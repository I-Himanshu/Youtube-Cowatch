import { Document } from 'mongoose';

export interface Participant {
  id: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface PlayerState {
  status: number;
  time: number;
}

export interface EmojiReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

// Interface for the Room model document from Mongoose
export interface RoomDocument extends Document {
  reactions: EmojiReaction[];
  roomId: string;
  videoId: string;
  hostUsername: string;
  participants: Participant[];
  messages: ChatMessage[];
  playerState: PlayerState;
  createdAt: Date;
}
