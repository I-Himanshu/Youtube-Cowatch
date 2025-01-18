import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';

export async function DELETE(request: Request, { params }: { params: { roomId: string } }) {
    const { roomId } = await params;
    try {
        await dbConnect();

        const result = await Room.deleteOne({ roomId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Room ${roomId} deleted successfully` }, { status: 200 });

    } catch (error) {
        console.error(`Failed to delete room ${roomId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
