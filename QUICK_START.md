# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### Step 2: Navigate to Workflow Editor
1. Click "Get Started" or "Workflows" on the landing page
2. Click "New Workflow" button
3. You'll see the workflow editor with:
   - **Left sidebar**: Draggable node types
   - **Center canvas**: React Flow editing area
   - **Top bar**: Save and Export buttons

### Step 3: Create Your First Workflow
1. **Drag** an "Issue" node from the sidebar to the canvas
2. **Drag** an "Action" node to the canvas
3. **Connect** them by dragging from the bottom handle of Issue to the top handle of Action
4. **Zoom** and **Pan** to navigate the canvas
5. Click the **Save** button to save (functionality coming in Phase 3)

---

## 🎨 Node Types Reference

### 🔴 Issue Node (Red)
- **Purpose**: Problems, circumstances, triggers
- **Icon**: Alert Circle
- **Color**: Red (#EF4444)
- **Examples**: "Client Onboarding", "System Downtime"

### 🔵 Action Node (Blue)
- **Purpose**: Steps, actions, processes
- **Icon**: Play
- **Color**: Blue (#3B82F6)
- **Examples**: "Discovery Call", "Deploy Hotfix"

### 🟢 Resource Node (Green)
- **Purpose**: Tools, platforms, resources
- **Icon**: Wrench
- **Color**: Green (#10B981)
- **Examples**: "GoHighLevel", "n8n", "Google Analytics"

### 🟣 Deliverable Node (Purple)
- **Purpose**: Outputs, results, deliverables
- **Icon**: Check Circle
- **Color**: Purple (#8B5CF6)
- **Examples**: "Onboarding Report", "Test Dashboard"

---

## 🎯 Canvas Controls

### Mouse Controls
- **Pan**: Click and drag on empty canvas
- **Zoom**: Scroll wheel
- **Select Node**: Click on node
- **Connect Nodes**: Drag from connection handle
- **Delete Node**: Select node + Delete key

### Keyboard Shortcuts (Coming in Phase 3)
- `Cmd/Ctrl + S`: Save workflow
- `Cmd/Ctrl + Z`: Undo
- `Cmd/Ctrl + Shift + Z`: Redo
- `Delete`: Delete selected node

---

## 📂 Project Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database (When Configured)
```bash
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

---

## 🔧 Environment Setup

### Required Environment Variables
Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

**For Development:**
- Get a free PostgreSQL database from [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- Copy the connection string
- Update `.env.local`

---

## 📱 Application Structure

```
Landing Page (/)
├── Workflows (/workflows)
│   └── New Workflow (/workflows/new)
│       ├── Node Selector (left sidebar)
│       ├── Canvas (center)
│       └── Controls (top bar)
├── Templates (/templates)
│   └── Template Management (Phase 2)
└── Documentation (coming soon)
```

---

## 🐛 Troubleshooting

### Issue: Build fails with font errors
**Solution**: Already fixed! We removed Google Fonts and use system fonts.

### Issue: Canvas doesn't render
**Solution**: Ensure you're using a modern browser (Chrome 100+, Firefox 100+, Safari 15+)

### Issue: Nodes aren't draggable
**Solution**: Make sure you're dragging from the sidebar, not trying to drag existing nodes (that feature is for moving them on canvas)

### Issue: Database connection error
**Solution**: Phase 1 doesn't require database. It's needed for Phase 2 (template system).

---

## 🎓 Learning Resources

### React Flow Documentation
- Official Docs: https://reactflow.dev
- Examples: https://reactflow.dev/examples

### Next.js 14
- App Router: https://nextjs.org/docs/app
- Routing: https://nextjs.org/docs/app/building-your-application/routing

### Drizzle ORM
- Documentation: https://orm.drizzle.team
- PostgreSQL Guide: https://orm.drizzle.team/docs/get-started-postgresql

---

## ✨ What's Working Now (Phase 1)

✅ Drag nodes from sidebar to canvas
✅ Connect nodes with arrows
✅ Zoom and pan canvas
✅ Four distinct node types with colors
✅ Professional UI with shadcn/ui
✅ Responsive design
✅ Clean project structure

## 🚧 Coming Soon (Phase 2+)

🔄 Template library system
🔄 Template selection in nodes
🔄 Save/load workflows
🔄 Auto-save functionality
🔄 Export to PNG/PDF
🔄 Search and filter templates
🔄 Workflow sharing

---

## 💡 Pro Tips

1. **Use the MiniMap**: The small map in the bottom-right helps navigate large workflows
2. **Color Coding**: Use consistent colors for node types to make workflows easy to understand
3. **Grid Alignment**: The background dots help align nodes visually
4. **Connection Handles**: Top = input, Bottom = output (you can customize this in Phase 3)
5. **Multiple Connections**: One node can connect to multiple other nodes

---

## 🎉 You're All Set!

The foundation is built and working. Start creating workflows and get ready for Phase 2 where we'll add the template library system that makes this tool truly powerful!

**Questions?** Check `PHASE_1_SUMMARY.md` for detailed technical information.

**Ready for Phase 2?** Let's build the template system next! 🚀
