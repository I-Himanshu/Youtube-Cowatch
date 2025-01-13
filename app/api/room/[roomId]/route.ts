import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';
import { nanoid } from 'nanoid';
import cache from "@/lib/cache";
// GET: Fetch room state for polling
export async function GET(request: Request, { params }: { params: { roomId: string } }) {
    try {
        await dbConnect();
        const { roomId } = await params;
        const cache_key = `room_${roomId}`;
        const cachedRoom = cache.get(cache_key);
        if (cachedRoom) {
            return NextResponse.json(cachedRoom, { status: 200 });
        }

        const room = await Room.findOne({ roomId });
        if (room) {
            cache.set(cache_key, room);
        }
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json(room, { status: 200 });
    } catch (error) {
        console.error(`Failed to fetch room ${params}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Update player state (host only)
export async function PATCH(request: Request, { params }: { params: { roomId: string } }) {
    const { roomId } = await params;
    const cache_key = `room_${roomId}`;
    try {
        await dbConnect();
        const playerState = await request.json();
        const updatedRoom = await Room.findOneAndUpdate(
            { roomId },
            { $set: { playerState } },
            { new: true }
        );

        if (!updatedRoom) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }
        cache.del(cache_key);

        return NextResponse.json(updatedRoom.playerState, { status: 200 });
    } catch (error) {
        console.error(`Failed to update player state for room ${roomId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Add chat message or emoji reaction
export async function POST(request: Request, { params }: { params: { roomId: string } }) {
    try {
        await dbConnect();
        const { type, payload } = await request.json();
        const { roomId } = await params;
        const cache_key = `room_${roomId}`;
        
        if (type === 'chat') {
            const { username, message } = payload;
            const newMessage = { id: nanoid(), username, message, timestamp: Date.now() };

            await Room.updateOne(
                { roomId },
                { $push: { messages: newMessage } }
            );
            cache.del(cache_key);
            return NextResponse.json({ message: 'Message added' }, { status: 201 });
        }

        if(type === 'emoji') {
            // TODO: Add rate limiting for emoji reactions to prevent spam :D
            const { emoji } = payload;
            const newReaction = {
                id: nanoid(),
                emoji,
                x: Math.random() * 80 + 10, // Random x position between 10% and 90%
                y: Math.random() * 20 + 70, // Random y position between 70% and 90%
            };
            
            await Room.updateOne(
                { roomId: roomId },
                { $push: { reactions: newReaction } }
            );
            cache.del(cache_key);
            return NextResponse.json({ message: 'Reaction added' }, { status: 201 });
        }
        
        return NextResponse.json({ message: 'Invalid request type' }, { status: 400 });

    } catch (error) {
        console.error(`Failed to post to room ${params}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
