"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { extractVideoId } from "@/lib/utils";

export default function JoinOrCreateForm() {
  const [name, setName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [createYoutubeUrl, setCreateYoutubeUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<null | "create" | "join">(null);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    localStorage.setItem("Youtube-Cowatch_username", name);

    const videoId = extractVideoId(createYoutubeUrl);
    if (!videoId) {
      setError("Invalid YouTube URL. Please use a valid video URL.");
      return;
    }

    setIsLoading("create");
    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, username: name }),
      });
      if (!res.ok) throw new Error("Failed to create room.");

      const { roomId } = await res.json();
      router.push(`/room/${roomId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      setIsLoading(null);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!joinRoomId.trim()) {
      setError("Please enter a room code.");
      return;
    }
    localStorage.setItem("Youtube-Cowatch_username", name);
    setIsLoading("join");
    router.push(`/room/${joinRoomId.trim()}`);
  };

  return (
    <>
      <div className="w-full max-w-sm mb-8">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-indigo-200 mb-2"
        >
          Your Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create a Room
          </h2>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label
                htmlFor="youtube-url"
                className="block text-sm font-medium text-indigo-200 mb-2"
              >
                YouTube Video URL
              </label>
              <input
                id="youtube-url"
                type="text"
                value={createYoutubeUrl}
                onChange={(e) => setCreateYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading === "create"}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === "create" ? "Creating..." : "Create & Watch"}
            </button>
          </form>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Join a Room
          </h2>
          <form onSubmit={handleJoin}>
            <div className="mb-4">
              <label
                htmlFor="room-id"
                className="block text-sm font-medium text-indigo-200 mb-2"
              >
                Room Code
              </label>
              <input
                id="room-id"
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter room code..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading === "join"}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === "join" ? "Joining..." : "Join Room"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
