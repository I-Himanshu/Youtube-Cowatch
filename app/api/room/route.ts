import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { videoId, username } = await request.json();

        if (!videoId || !username) {
            return NextResponse.json({ message: 'Missing videoId or username' }, { status: 400 });
        }
        
        const roomId = nanoid(8);
        
        const newRoom = new Room({
            roomId,
            videoId,
            hostUsername: username,
            participants: [{ id: nanoid(), username }],
            messages: [],
            playerState: { status: -1, time: 0 },
        });

        await newRoom.save();

        return NextResponse.json({ roomId }, { status: 201 });

    } catch (error) {
        console.error('Failed to create room:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
