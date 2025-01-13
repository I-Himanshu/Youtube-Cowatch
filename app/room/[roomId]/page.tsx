import RoomClient from "@/app/components/RoomClient";
import dbConnect from "@/lib/db";
import Room from "@/lib/models/Room";
import { RoomDocument } from "@/lib/types";
import { notFound } from "next/navigation";

async function getRoomData(roomId: string): Promise<RoomDocument | null> {
  await dbConnect();
  const room = await Room.findOne({ roomId }).lean();
  if (!room) {
    return null;
  }
  return JSON.parse(JSON.stringify(room)) as RoomDocument;
}

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = await params;
  const roomData = await getRoomData(roomId);

  if (!roomData) {
    return notFound();
  }

  return <RoomClient initialRoomData={roomData} />;
}
