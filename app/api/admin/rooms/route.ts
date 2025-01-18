import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';

export async function GET() {
    try {
        await dbConnect();
        
        // Find all rooms and sort by creation date descending
        const rooms = await Room.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(rooms, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch rooms:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
