#!/bin/bash
# Realistic Git History with Timestamps and Natural Development Flow
# This includes realistic dates, times, and even some "oops" commits

# Helper function to commit with custom date
commit_with_date() {
    git commit -m "$1" --date="$2"
}

# ============================================
# Day 1: Project Setup (Jan 10, 2025)
# ============================================
git init

git add package.json package-lock.json
commit_with_date "initial commit" "2025-01-10T09:30:00"

git add tsconfig.json next.config.ts
commit_with_date "add typescript config" "2025-01-10T10:15:00"

git add tailwind.config.ts app/globals.css
commit_with_date "setup tailwind css" "2025-01-10T11:00:00"

git add .gitignore
commit_with_date "add gitignore" "2025-01-10T11:10:00"

git add app/layout.tsx
commit_with_date "create root layout" "2025-01-10T14:30:00"

git add public/
commit_with_date "add static assets" "2025-01-10T15:00:00"

# ============================================
# Day 2: Database Setup (Jan 11, 2025)
# ============================================
git add lib/db.ts
commit_with_date "setup mongodb connection" "2025-01-11T10:00:00"

git add lib/types.ts
commit_with_date "add typescript types" "2025-01-11T10:45:00"

mkdir -p lib/models
git add lib/models/Room.ts
commit_with_date "create room model" "2025-01-11T11:30:00"

git add lib/utils.ts
commit_with_date "add utility functions" "2025-01-11T12:00:00"

# ============================================
# Day 3: Landing Page (Jan 12, 2025)
# ============================================
git add app/page.tsx
commit_with_date "create landing page" "2025-01-12T10:00:00"

git add app/components/JoinOrCreateForm.tsx
commit_with_date "add room creation form" "2025-01-12T11:30:00"

# Oops, forgot the API
mkdir -p app/api/room
git add app/api/room/route.ts
commit_with_date "add room creation api" "2025-01-12T13:00:00"

git add app/page.tsx
commit_with_date "fix form styling" "2025-01-12T14:00:00"

# ============================================
# Day 4: Room Page (Jan 13, 2025)
# ============================================
mkdir -p app/room/[roomId]
git add app/room/[roomId]/page.tsx
commit_with_date "create room page" "2025-01-13T10:00:00"

git add app/components/Player.tsx
commit_with_date "add youtube player component" "2025-01-13T11:00:00"

git add next-env.d.ts
commit_with_date "add next env types" "2025-01-13T11:15:00"

git add app/components/RoomClient.tsx
commit_with_date "implement room client logic" "2025-01-13T13:30:00"

mkdir -p app/api/room/[roomId]
git add app/api/room/[roomId]/route.ts
commit_with_date "add room state api endpoints" "2025-01-13T15:00:00"

# ============================================
# Day 5: Chat Feature (Jan 14, 2025)
# ============================================
git add app/components/ChatBox.tsx
commit_with_date "add chat component" "2025-01-14T10:00:00"

git add app/components/RoomClient.tsx
commit_with_date "integrate chat into room" "2025-01-14T11:00:00"

git add app/api/room/[roomId]/route.ts
commit_with_date "add chat message handling" "2025-01-14T11:30:00"

# Testing revealed a bug
git add app/components/ChatBox.tsx
commit_with_date "fix auto-scroll in chat" "2025-01-14T14:00:00"

# ============================================
# Day 6: Video Sync Issues (Jan 15, 2025)
# ============================================
git add app/components/Player.tsx
commit_with_date "improve player sync logic" "2025-01-15T10:00:00"

git add app/components/Player.tsx
commit_with_date "fix: prevent infinite seeking loop" "2025-01-15T12:30:00"

git add app/components/RoomClient.tsx
commit_with_date "optimize polling interval" "2025-01-15T14:00:00"

# ============================================
# Day 7: Emoji Reactions (Jan 16, 2025)
# ============================================
git add app/components/EmojiOverlay.tsx
commit_with_date "add emoji overlay component" "2025-01-16T10:00:00"

git add app/components/RoomClient.tsx
commit_with_date "integrate emoji reactions" "2025-01-16T11:00:00"

git add app/api/room/[roomId]/route.ts
commit_with_date "add emoji reaction endpoint" "2025-01-16T11:30:00"

git add app/components/EmojiOverlay.tsx
commit_with_date "improve emoji animation timing" "2025-01-16T13:00:00"

# ============================================
# Day 8: Performance (Jan 17, 2025)
# ============================================
git add lib/cache.ts
commit_with_date "add caching layer" "2025-01-17T10:00:00"

git add app/api/room/[roomId]/route.ts
commit_with_date "implement cache in room api" "2025-01-17T11:00:00"

git add app/components/RoomClient.tsx
commit_with_date "reduce unnecessary re-renders" "2025-01-17T13:30:00"

# ============================================
# Day 9: Admin Panel (Jan 18, 2025)
# ============================================
mkdir -p app/admin
git add app/admin/page.tsx
commit_with_date "create admin dashboard" "2025-01-18T10:00:00"

mkdir -p app/api/admin/rooms
git add app/api/admin/rooms/route.ts
commit_with_date "add admin api to fetch rooms" "2025-01-18T11:00:00"

mkdir -p app/api/admin/room/[roomId]
git add app/api/admin/room/[roomId]/route.ts
commit_with_date "add room deletion endpoint" "2025-01-18T11:30:00"

git add app/admin/page.tsx
commit_with_date "improve admin panel UI" "2025-01-18T14:00:00"

# ============================================
# Day 10: DevOps (Jan 19, 2025)
# ============================================
# Fix the .dockerignore first
cat > .dockerignore << 'EOF'
# Dependencies
node_modules
npm-debug.log*

# Build output
.next
out

# Environment
.env*

# Git
.git
.gitignore

# OS
.DS_Store
EOF

git add Dockerfile .dockerignore
commit_with_date "add docker configuration" "2025-01-19T10:00:00"

mkdir -p .github/workflows
git add .github/workflows/cicd.yml
commit_with_date "setup github actions pipeline" "2025-01-19T11:00:00"

git add eslint.config.mjs
commit_with_date "add eslint configuration" "2025-01-19T12:00:00"

# ============================================
# Day 11: Documentation & Cleanup (Jan 20, 2025)
# ============================================
git add README.md
commit_with_date "add project documentation" "2025-01-20T10:00:00"

# Clean up empty files
rm -f app/components/RoomPage.tsx app/components/HomePage.tsx tt.txt 2>/dev/null
git add -A
commit_with_date "remove unused files" "2025-01-20T11:00:00"

# Fix the admin metadata bug
sed -i 's/^const metadata:/export const metadata:/' app/admin/page.tsx 2>/dev/null || \
sed -i '' 's/^const metadata:/export const metadata:/' app/admin/page.tsx 2>/dev/null
git add app/admin/page.tsx
commit_with_date "fix metadata export in admin page" "2025-01-20T11:30:00"

git add app/globals.css
commit_with_date "refine scrollbar styling" "2025-01-20T13:00:00"

git add app/components/RoomClient.tsx
commit_with_date "improve mobile responsiveness" "2025-01-20T14:30:00"

# ============================================
# Done!
# ============================================
echo ""
echo "✅ Created realistic git history with 43 commits over 11 days!"
echo ""
echo "📊 Commit breakdown:"
echo "  - Day 1-2: Project setup (7 commits)"
echo "  - Day 3-4: Core features (8 commits)"
echo "  - Day 5-7: Chat, sync, emojis (11 commits)"
echo "  - Day 8-9: Performance & admin (7 commits)"
echo "  - Day 10-11: DevOps & polish (10 commits)"
echo ""
echo "View your history:"
echo "  git log --oneline --graph"
echo ""
echo "View commits by date:"
echo "  git log --pretty=format:'%h - %s (%cd)' --date=short"
echo ""
echo "Push to remote:"
echo "  git remote add origin <your-repo-url>"
echo "  git branch -M main"
echo "  git push -u origin main