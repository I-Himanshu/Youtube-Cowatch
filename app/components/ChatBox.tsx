'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.username === currentUser ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.username === currentUser ? 'bg-indigo-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                <p className={`text-sm font-semibold mb-1 ${msg.username !== currentUser ? 'text-indigo-300' : ''}`}>
                  {msg.username}
                </p>
                <p className="text-white break-words">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
