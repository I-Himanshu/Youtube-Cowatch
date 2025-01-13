"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { PlayerState } from "@/lib/types";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface PlayerProps {
  videoId: string;
  onStateChange: (state: PlayerState) => void;
  isHost: boolean;
  hostPlayerState: PlayerState;
}

// Blind Copy From AI to fix concurrency issues (-_-)
// But i understand the code now :D
const Player: React.FC<PlayerProps> = ({
  videoId,
  onStateChange,
  isHost,
  hostPlayerState,
}) => {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const lastSentState = useRef<string>("");
  const sendHostStateUpdate = useCallback(() => {
    if (!isHost || !isReady || !playerRef.current?.getCurrentTime) return;

    const newState: PlayerState = {
      status: playerRef.current.getPlayerState(),
      time: playerRef.current.getCurrentTime(),
    };

    // To avoid flooding the server, only send updates when state actually changes
    const stateString = `${newState.status}-${Math.round(newState.time)}`;
    if (stateString !== lastSentState.current) {
      onStateChange(newState);
      lastSentState.current = stateString;
    }
  }, [isHost, isReady, onStateChange]);

  const createPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }
    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: isHost ? 1 : 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        disablekb: isHost ? 0 : 1,
        enablejsapi: 1,
      },
      events: {
        onReady: () => setIsReady(true),
        onStateChange: () => {
          // Send an immediate update on any state change event
          sendHostStateUpdate();
        },
      },
    });
  };

  useEffect(() => {
    if (typeof window.YT?.Player === "function") {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, isHost]);

  // Host now sends a "heartbeat" update every 2 seconds
  useEffect(() => {
    if (isHost && isReady) {
      const intervalId = setInterval(sendHostStateUpdate, 2000);
      return () => clearInterval(intervalId);
    }
  }, [isHost, isReady, sendHostStateUpdate]);


  useEffect(() => {
    if (!isHost && isReady && playerRef.current) {
      const player = playerRef.current;
      const { status: hostStatus, time: hostTime } = hostPlayerState;

      const clientTime = player.getCurrentTime();
      const clientStatus = player.getPlayerState();

      // 1. Sync Play/Pause State (Highest Priority)
      if (hostStatus !== clientStatus) {
        if (hostStatus === 1) {
          // Host is PLAYING
          player.playVideo();
        } else if (hostStatus === 2) {
          // Host is PAUSED
          player.pauseVideo();
        }
      }

      // 2. Correct Timeline Drift Intelligently only when playing
      if (hostStatus === 1) {
        const timeDiff = clientTime - hostTime; // Directional difference

        // The "safe" window for the client is to be slightly ahead of the host's
        // last known time (due to polling delay), but not too far ahead.
        const maxAllowedLead = 3.0; // e.g., 3 seconds ahead
        const maxAllowedLag = -0.5; // Client should never be lagging behind

        // If the client is outside this safe window, resynchronize.
        if (timeDiff > maxAllowedLead || timeDiff < maxAllowedLag) {
          player.seekTo(hostTime, true);
        }
      }
    }
  }, [hostPlayerState, isHost, isReady]);

  return <div id="youtube-player" className="w-full h-full"></div>;
};

export default Player;
