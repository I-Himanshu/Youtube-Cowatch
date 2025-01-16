'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { EmojiReaction } from '@/lib/types';

interface EmojiOverlayProps {
  reactions: EmojiReaction[];
}

const EmojiOverlay: React.FC<EmojiOverlayProps> = ({ reactions }) => {
  const [animatingReactions, setAnimatingReactions] = useState<EmojiReaction[]>([]);
  const prevReactionIds = useRef(new Set());

  useEffect(() => {
    // Determine which reactions are new since the last render
    const newReactions = reactions.filter(r => !prevReactionIds.current.has(r.id));
    
    if (newReactions.length > 0) {
      setAnimatingReactions(prev => [...prev, ...newReactions]);
      newReactions.forEach(r => prevReactionIds.current.add(r.id));

      // Clean up old reactions from the animating list after animation ends
      setTimeout(() => {
        const newIds = new Set(newReactions.map(r => r.id));
        setAnimatingReactions(current => current.filter(r => !newIds.has(r.id)));
      }, 2000); // Must match animation duration
    }
  }, [reactions]);

  return (
    <>
      <style>
        {`
          @keyframes float-up {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-200px) scale(1.5);
            }
          }
          .emoji-float {
            position: absolute;
            font-size: 2.25rem; /* text-4xl */
            animation: float-up 2s ease-out forwards;
          }
        `}
      </style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {animatingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="emoji-float"
            style={{ 
              left: `${reaction.x}%`,
              top: `${reaction.y}%`,
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>
    </>
  );
};

export default EmojiOverlay;
