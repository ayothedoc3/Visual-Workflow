# Quick Database Setup

## Option 1: Use Neon (Recommended - 30 seconds)

1. Go to https://neon.tech
2. Sign up (free - no credit card)
3. Click "Create Project"
4. Copy the connection string (looks like: `postgresql://user:pass@host/db`)
5. Open `.env.local` in this project
6. Update: `DATABASE_URL=your_connection_string_here`
7. Run: `npm run db:push`
8. Run: `curl -X POST http://localhost:3000/api/templates/seed`

Done! ✅

## Option 2: Use Supabase (Alternative - 30 seconds)

1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Go to Settings → Database → Connection String
5. Copy the connection string
6. Open `.env.local`
7. Update: `DATABASE_URL=your_connection_string_here`
8. Run: `npm run db:push`
9. Run: `curl -X POST http://localhost:3000/api/templates/seed`

Done! ✅

## Option 3: Test Without Database

You CAN test Phase 1 (canvas) without a database!

**What works without DB:**
- ✅ Drag and drop nodes
- ✅ Connect nodes
- ✅ Zoom and pan
- ✅ UI and styling

**What needs DB:**
- ❌ Template management
- ❌ Saving workflows
- ❌ Loading workflows

## After Database Setup

Run this to seed 22 sample templates:
```bash
curl -X POST http://localhost:3000/api/templates/seed
```

You should see:
```json
{
  "message": "Successfully seeded templates",
  "count": 22
}
```
