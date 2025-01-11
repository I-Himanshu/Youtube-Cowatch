import mongoose, { Schema, Document, models, Model } from "mongoose";
import { EmojiReaction, RoomDocument } from "@/lib/types";

const ParticipantSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
});

const MessageSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

const PlayerStateSchema = new Schema(
  {
    status: { type: Number, default: -1 }, // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
    time: { type: Number, default: 0 },
  },
  { _id: false }
);
const ReactionSchema = new Schema<EmojiReaction>({
  id: { type: String, required: true },
  emoji: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
}, { _id: false });

const RoomSchema = new Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  videoId: { type: String, required: true },
  hostUsername: { type: String, required: true },
  participants: [ParticipantSchema],
  messages: [MessageSchema],
  reactions: [ReactionSchema ],
  playerState: { type: PlayerStateSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now, expires: "24h" }, // Rooms expire after 24 hours
});

const Room: Model<RoomDocument> =
  models.Room || mongoose.model<RoomDocument>("Room", RoomSchema);

export default Room;
