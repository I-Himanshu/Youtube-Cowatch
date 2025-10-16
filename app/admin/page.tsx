"use client";

import { useState, useEffect } from "react";
import type { RoomDocument } from "@/lib/types";
import Link from "next/link";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Admin Panel - SyncStream",
  description: "Administrative interface for managing SyncStream rooms.",
};
const AdminPage = () => {
  const [rooms, setRooms] = useState<RoomDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/rooms");
      if (!res.ok) {
        throw new Error("Failed to fetch rooms.");
      }
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (roomId: string) => {
    if (!confirm(`Are you sure you want to delete room ${roomId}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/room/${roomId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete room.");
      }
      // Refresh the list after deleting
      await fetchRooms();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while deleting."
      );
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">Admin Panel</h1>
          <Link href="/" className="text-sm text-indigo-300 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Active Rooms</h2>
          <button
            onClick={fetchRooms}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">Error: {error}</p>}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Room ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Host
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Video ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Participants
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      Loading rooms...
                    </td>
                  </tr>
                )}
                {!isLoading && rooms.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No active rooms found.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  rooms.map((room) => (
                    <tr
                      key={room.roomId}
                      className="hover:bg-gray-800/60 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-400">
                        {room.roomId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {room.hostUsername}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <a
                          href={`https://www.youtube.com/watch?v=${room.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-400 hover:underline"
                        >
                          {room.videoId}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                        {room.participants.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDateTime(room.createdAt as any)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/room/${room.roomId}`}
                          target="_blank"
                          className="text-green-400 hover:text-green-300"
                        >
                          Join
                        </Link>
                        <button
                          onClick={() => handleDelete(room.roomId)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
