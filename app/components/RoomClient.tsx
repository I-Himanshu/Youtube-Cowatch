"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Player from "./Player";
import ChatBox from "./ChatBox";
import EmojiOverlay from "./EmojiOverlay";
import type {
  ChatMessage,
  EmojiReaction,
  Participant,
  RoomDocument,
  PlayerState,
} from "@/lib/types";

const EMOJIS = ["❤️", "🔥", "😂", "👍", "🎉"];
const POLLING_INTERVAL = 2000; // 2 seconds

interface RoomClientProps {
  initialRoomData: RoomDocument;
}

export default function RoomClient({ initialRoomData }: RoomClientProps) {
  const router = useRouter();
  const [room, setRoom] = useState<RoomDocument>(initialRoomData);
  const [username, setUsername] = useState<string>("");
  const [reactions, setReactions] = useState<EmojiReaction[]>([]);
  const isHost = username === room.hostUsername;

  // Check for username on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("Youtube-Cowatch_username");
    if (!storedUsername) {
      const name = prompt("Enter your username:");
      if (!name) {
        router.push("/");
        return;
      }
      localStorage.setItem("Youtube-Cowatch_username", name);
      setUsername(name);
    } else {
      setUsername(storedUsername);
      // Here you would also add the user to the participants list via an API call
    }
  }, [router]);

  // Main polling logic
  const syncRoomState = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${room.roomId}`);
      if (!res.ok) {
        if (res.status === 404) router.push("/"); // Room deleted
        return;
      }
      const data: RoomDocument = await res.json();
      setReactions(data.reactions);
      setRoom(data);
    } catch (error) {
      console.error("Failed to sync room state:", error);
    }
  }, [room.roomId, router]);

  useEffect(() => {
    const intervalId = setInterval(syncRoomState, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [syncRoomState]);

  const handleSendMessage = async (message: string) => {
    if (!username) return;
    const tempId = Date.now().toString();
    const newMessage: ChatMessage = {
      id: tempId,
      username,
      message,
      timestamp: Date.now(),
    };
    // Optimistic update
    setRoom((prev) => {
      const updatedRoom = Object.assign(
        Object.create(Object.getPrototypeOf(prev)),
        prev
      );
      updatedRoom.messages = [...prev.messages, newMessage];
      return updatedRoom;
    });

    await fetch(`/api/room/${room.roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "chat", payload: { username, message } }),
    });
  };

  const handleEmojiClick = async (emoji: string) => {
    const newReaction: EmojiReaction = {
      id: String(Date.now()) + Math.random(),
      emoji,
      x: Math.random() * 80 + 10,
      y: Math.random() * 20 + 70,
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((current) => current.filter((r) => r.id !== newReaction.id));
    }, 4000);

    await fetch(`/api/room/${room.roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "emoji", payload: { emoji } }),
    });
  };

  const handlePlayerStateChange = async (state: PlayerState) => {
    if (!isHost) return;
    console.log("Host player state changed:", state);
    await fetch(`/api/room/${room.roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  };

  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Room link copied to clipboard!");
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden">
      <header className="flex-shrink-0 bg-gray-800 p-3 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold">Youtube-Cowatch</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Room:{" "}
            <span className="font-mono text-indigo-400">{room.roomId}</span>
          </span>
          <button
            onClick={handleCopyRoomLink}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
          >
            Copy Link
          </button>
        </div>
      </header>
      <div className="flex flex-grow min-h-0 flex-col md:flex-row">
        <main className="flex-grow flex flex-col relative">
          <div className="w-full h-[56.25vw] md:h-full bg-black">
            <Player
              videoId={room.videoId}
              onStateChange={handlePlayerStateChange}
              isHost={isHost}
              hostPlayerState={room.playerState}
            />
          </div>
          <EmojiOverlay reactions={reactions} />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-center items-center gap-4 z-10">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-3xl transform transition-transform duration-200 hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        </main>
        <aside className="w-full md:w-96 flex-shrink-0 bg-gray-800 flex flex-col h-auto md:h-full z-20">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">
              {room.participants.length} Participants
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {room.participants.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center gap-2"
                >
                  <span>{p.username}</span>
                  {p.username === room.hostUsername && (
                    <span className="text-yellow-400 text-xs">👑</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <ChatBox
            messages={room.messages}
            onSendMessage={handleSendMessage}
            currentUser={username}
          />
        </aside>
      </div>
    </div>
  );
}
