# Visual Workflow Builder

A powerful visual workflow builder that allows you to rapidly assemble business process workflows by selecting pre-built templates from dropdown libraries. Perfect for creating SOPs, playbooks, and process documentation.

## 🎯 Project Status

### ✅ Phase 1: Foundation - COMPLETE
All Phase 1 acceptance criteria have been met:
- ✅ Can drag Issue/Action/Resource/Deliverable nodes to canvas
- ✅ Can connect nodes with arrows
- ✅ Canvas supports zoom/pan
- ✅ Nodes have distinct visual styling

### ✅ Phase 2: Template System - COMPLETE
All Phase 2 acceptance criteria have been met:
- ✅ Can create template via UI
- ✅ Template appears in node dropdown
- ✅ Selecting template populates node
- ✅ Search filters template list
- ✅ Can edit/delete templates

### 🔄 Phase 3: Workflow Management - NEXT
Coming soon: Save/load workflows, workflow library, and auto-save functionality.

## 🚀 Quick Start

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get up and running in 3 steps
- **[PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md)** - Detailed Phase 1 completion report
- **[PHASE_2_SUMMARY.md](./PHASE_2_SUMMARY.md)** - Detailed Phase 2 completion report

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+, React 19, TypeScript
- **Canvas**: React Flow 11+
- **Styling**: Tailwind CSS 4, shadcn/ui
- **State**: Zustand
- **Database**: PostgreSQL + Drizzle ORM
- **Icons**: Lucide React
- **Export**: html-to-image, jsPDF

## 🎨 Features

### Current (Phase 1 + 2)
- Visual workflow canvas with React Flow
- Four node types: Issue, Action, Resource, Deliverable
- Drag-and-drop from sidebar
- Node connections with smooth edges
- Zoom and pan controls
- Professional UI with distinct color coding
- **Template library system (22 pre-built templates)**
- **Template CRUD operations**
- **Template selection in nodes**
- **Search and filter templates**
- Responsive design

### Coming Soon (Phase 3+)
- Workflow save/load
- Workflow library
- Auto-save functionality
- Export to PNG/PDF
- Workflow sharing

## 🎨 Node Types

| Type | Color | Icon | Purpose | Examples |
|------|-------|------|---------|----------|
| Issue | 🔴 Red | Alert Circle | Problems, triggers | Client Onboarding, System Downtime |
| Action | 🔵 Blue | Play | Steps, processes | Discovery Call, Deploy Hotfix |
| Resource | 🟢 Green | Wrench | Tools, platforms | GoHighLevel, n8n, Analytics |
| Deliverable | 🟣 Purple | Check Circle | Outputs, results | Reports, Dashboards |

## 📁 Project Structure

```
/app
  /page.tsx                     # Landing page
  /workflows/page.tsx           # Workflow list
  /workflows/[id]/page.tsx      # Workflow editor
  /templates/page.tsx           # Template management

/components
  /workflow-editor
    /WorkflowCanvas.tsx         # Main React Flow canvas
    /NodeSelector.tsx           # Draggable node sidebar
    /NodeTypes/                 # Custom node components
  /ui/                          # shadcn/ui components

/lib
  /db.ts                        # Database connection
  /schema.ts                    # Drizzle schema
  /utils.ts                     # Utilities
```

## 🔧 Environment Setup

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

Get a free PostgreSQL database from:
- [Neon](https://neon.tech) (Recommended)
- [Supabase](https://supabase.com)

## 📊 Database Schema

### Templates Table
- `id`: UUID (primary key)
- `node_type`: Enum (issue, action, resource, deliverable)
- `name`: String
- `description`: Text
- `category`: String
- `tags`: String[]
- `metadata`: JSONB
- `created_at`, `updated_at`: Timestamps

### Workflows Table
- `id`: UUID (primary key)
- `name`: String
- `description`: Text
- `thumbnail`: String (URL)
- `nodes`: JSONB (React Flow nodes)
- `edges`: JSONB (React Flow edges)
- `created_at`, `updated_at`: Timestamps

### Users Table
- `id`: UUID (primary key)
- `email`: String (unique)
- `name`: String
- `created_at`: Timestamp

## 🛠️ Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint

# Database (when configured)
npm run db:generate # Generate migrations
npm run db:push     # Push schema to database
npm run db:studio   # Open Drizzle Studio
```

## 🎯 Design Principles

1. **Speed**: Fast load times, instant interactions
2. **Simplicity**: Anyone can use without training
3. **Visual**: Everything is visual, minimal text
4. **Professional**: Exports look polished, ready to share
5. **Scalable**: Can handle 1000s of templates

## 🌈 Color System

```css
/* Node Types */
--issue: #EF4444 (red)
--action: #3B82F6 (blue)
--resource: #10B981 (green)
--deliverable: #8B5CF6 (purple)

/* Interface */
--background: #F9FAFB
--canvas: #FFFFFF
--border: #E5E7EB
--text-primary: #111827
--text-secondary: #6B7280
```

## 🧪 Testing

### Phase 1 Checklist
- [x] Project builds without errors
- [x] Development server starts
- [x] Landing page loads
- [x] Workflow editor accessible
- [x] Nodes draggable from sidebar
- [x] Nodes connectable
- [x] Canvas zoom/pan works
- [x] Styling matches design system

## 🚀 Deployment

Ready for deployment to Vercel:

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repo to Vercel dashboard
# Set environment variables in Vercel dashboard
```

## 📚 Learning Resources

- [React Flow Docs](https://reactflow.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

This is a custom internal tool. Phase-by-phase implementation:

1. ✅ **Phase 1**: Foundation (COMPLETE)
2. 🔄 **Phase 2**: Template System (NEXT)
3. 📅 **Phase 3**: Workflow Management (UPCOMING)
4. 📅 **Phase 4**: Polish & Export (FUTURE)

## 📝 License

Private project - Internal use only

## 🙏 Acknowledgments

Built with modern web technologies:
- Next.js team for the amazing framework
- React Flow team for the powerful canvas library
- shadcn for the beautiful UI components
- Drizzle team for type-safe database access

---

## 📞 Support

For questions or issues:
1. Check [QUICK_START.md](./QUICK_START.md) for basic help
2. Review [PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md) for technical details
3. Contact the development team

---

**Built with ❤️ for rapid workflow assembly**

Last Updated: December 5, 2025 - Phase 2 Complete
