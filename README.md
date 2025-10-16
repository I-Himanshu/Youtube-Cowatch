# 🎬 YouTube CoWatch

**Watch YouTube videos together in perfect sync  :  with real-time chat, emoji reactions, and an admin dashboard for control.** 
Built with **Next.js**, powered by **TypeScript**, and deployed via an automated **Docker + GitHub Actions CI/CD pipeline**.

---

## ✨ Features

### 🔁 Real-Time Sync
- Host’s video controls (play, pause, seek) automatically sync with all participants.
- Smooth synchronization powered by efficient client-side polling (via **SWR**).

### 💬 Live Chat
- Engage with others while watching  :  messages appear instantly across all users.

### 😍 Emoji Reactions
- Send floating emojis that overlay the video in real-time for all viewers.

### 🏠 Room Management
- Create a new co-watch room using any YouTube link.
- Join existing rooms easily via a unique room code.

### ⚡ Performance Optimized
- Server-side **in-memory caching** minimizes database reads and boosts polling speed.

### 🛡️ Admin Panel
- Monitor all active rooms in real-time.
- View participants and manage or delete rooms directly.

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **UI** | React + Tailwind CSS |
| **Database** | MongoDB with Mongoose |
| **Real-Time Sync** | Client-side polling using SWR |
| **Deployment** | Docker + GitHub Actions CI/CD |

---

## ⚙️ CI/CD Pipeline (DevOps)

### 🧩 Continuous Integration (CI)
Triggered on **every push** or **pull request**:
- ✅ Linting via ESLint to maintain code quality.
- 🧱 Build test inside Docker to ensure stability and compatibility.

### 🚢 Continuous Deployment (CD)
Triggered on **push/merge to main**:
1. **Dockerize** the app into a lightweight image.  
2. **Push to Docker Hub**.  
3. **Deploy to VPS**  :  automatically pulls the latest image and restarts the container.  
   ✅ Achieves zero-downtime deployments.

---

## 🛠️ Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/I-Himanshu/Youtube-Cowatch
cd youtube-cowatch
```
2️⃣ Install Dependencies
```bash
npm install
```

3️⃣ Add Environment Variables

Create a .env.local file in the root:

```bash
MONGODB_URI="your_mongodb_connection_string"
```
4️⃣ Run with Docker (Recommended)
Build the image:

```bash
docker build --build-arg MONGODB_URI="your_mongodb_connection_string" -t youtube-cowatch-local .
```

Run the container:
```bash
docker run -p 3000:3000 -e MONGODB_URI="your_mongodb_connection_string" youtube-cowatch-local
```

5️⃣ Run in Development Mode
```bash
npm run dev
```

Your app will be available at 👉 http://localhost:3000
# 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/api/room` | Create a new watch room |
| **GET** | `/api/room/[roomId]` | Fetch a room’s current state (for polling) |
| **POST** | `/api/room/[roomId]` | Add a new chat message or emoji |
| **PATCH** | `/api/room/[roomId]` | Update video state (host only) |
| **GET** | `/api/admin/rooms` | Get all active rooms (admin only) |
| **DELETE** | `/api/admin/room/[roomId]` | Delete a specific room (admin only) |

---

# 📁 Project Structure

This project uses a modular architecture with Next.js App Router, separating concerns between frontend components, backend APIs, data models, and utility functions.

```
youtube-cowatch/
├── .github/
│   └── workflows/
│       └── cicd.yml               # CI/CD pipeline configuration
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                 # Root layout with global providers
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Global styles & Tailwind imports
│   │
│   ├── room/
│   │   └── [roomId]/
│   │       └── page.tsx           # Dynamic room page (Server Component)
│   │
│   ├── admin/
│   │   └── page.tsx               # Admin dashboard page
│   │
│   ├── components/                # React UI components
│   │   ├── JoinOrCreateForm.tsx  # Create/join room interface
│   │   ├── RoomClient.tsx        # Room view container (Client Component)
│   │   ├── ChatBox.tsx           # Real-time chat interface
│   │   ├── EmojiOverlay.tsx      # Animated emoji reactions
│   │   ├── Player.tsx            # YouTube video player wrapper
│   │   ├── RoomPage.tsx          # (Empty placeholder)
│   │   └── HomePage.tsx          # (Empty placeholder)
│   │
│   └── api/                       # Backend API endpoints
│       ├── room/
│       │   ├── route.ts           # POST: Create new room
│       │   └── [roomId]/
│       │       └── route.ts       # GET: Fetch room | PATCH: Update state | POST: Chat/Emoji
│       │
│       └── admin/
│           ├── rooms/
│           │   └── route.ts       # GET: Fetch all rooms
│           └── room/
│               └── [roomId]/
│                   └── route.ts   # DELETE: Remove room
│
├── lib/                            # Core utilities and services
│   ├── db.ts                      # MongoDB connection handler
│   ├── cache.ts                   # In-memory caching layer (NodeCache)
│   ├── utils.ts                   # Helper functions (extractVideoId)
│   ├── types.ts                   # TypeScript type definitions
│   │
│   └── models/                    # Mongoose schemas
│       └── Room.ts                # Room state schema
│
├── public/                         # Static assets
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   ├── globe.svg
│   └── file.svg
│
├── .gitignore                     # Git ignore rules
├── .dockerignore                  # Docker ignore rules
├── Dockerfile                     # Container configuration
├── next.config.ts                 # Next.js configuration
├── next-env.d.ts                  # Next.js TypeScript declarations
├── tsconfig.json                  # TypeScript compiler options
├── package.json                   # Dependencies & scripts
├── eslint.config.mjs              # Code linting rules
├── tt.txt                         # (Empty file)
└── README.md                      # Project documentation
```

## 📂 Key Directories

### `app/`
Next.js 13+ App Router structure combining pages and API routes. Uses Server Components by default with Client Components marked with `'use client'`.

### `app/components/`
React components for UI rendering. Includes both presentational and container components for room management, chat, video player, and emoji reactions.

### `app/api/`
RESTful API endpoints handling:
- **Room Management**: Create, read, update room state
- **Real-time Features**: Chat messages, emoji reactions
- **Admin Operations**: View and delete rooms

### `lib/`
Business logic and shared utilities isolated from UI code:
- **db.ts**: Mongoose connection with caching
- **cache.ts**: In-memory cache for polling optimization
- **utils.ts**: Video ID extraction and helpers
- **types.ts**: Shared TypeScript interfaces

### `lib/models/`
Mongoose schemas defining MongoDB document structure:
- **Room.ts**: Complete room schema with participants, messages, reactions, and player state

### `.github/workflows/`
GitHub Actions CI/CD pipeline for automated linting, Docker builds, and deployment.

## 🔑 Key Features

- **Polling Architecture**: 2-second polling interval for state synchronization
- **Host Controls**: Only room host can control video playback
- **Optimistic Updates**: Instant UI feedback for chat messages
- **Caching Layer**: NodeCache reduces database load during polling
- **Auto-expiry**: Rooms automatically deleted after 24 hours
- **Docker Support**: Containerized deployment with CI/CD pipeline
---

## 🧠 Future Enhancements

- 🎥 **Multi-Platform Streaming:** Add support for sources like Netflix and Twitch.  
- 🕹️ **Real-Time Socket Sync:** Upgrade from polling to WebSocket-based sync for larger rooms.  
- 🧍 **User Authentication:** Personalized watch history, favorites, and room creation limits.  
- 📊 **Admin Analytics Dashboard:** Insights into usage, active users, and engagement stats.

---

## 👨‍💻 Author

**Himanshu Kumar**  
Backend Developer | GDSC Lead | Open Source Contributor  

📎 [LinkedIn](https://www.linkedin.com/in/i-himanshu/) • [GitHub](https://github.com/i-himanshu) • [Website](https://i-himanshu.github.io)

---

## 🧩 License

This project is licensed under the **MIT License**  :  feel free to modify and share.
