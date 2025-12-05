# 🧪 Testing Guide - Visual Workflow Builder

## ✅ Pre-Requisites

The development server is already running at: **http://localhost:3000**

---

## 📋 Quick Test Checklist

### ✓ Phase 1 - Foundation
- [ ] Can drag nodes to canvas
- [ ] Can connect nodes
- [ ] Canvas zoom/pan works
- [ ] Nodes have distinct colors

### ✓ Phase 2 - Templates
- [ ] Can create templates
- [ ] Templates appear in node dropdown
- [ ] Selecting template populates node
- [ ] Can search/filter templates
- [ ] Can edit/delete templates

### ✓ Phase 3 - Workflows
- [ ] Can save workflows
- [ ] Can load workflows
- [ ] Auto-save works
- [ ] Can duplicate workflows
- [ ] Can delete workflows

---

## 🚀 Step-by-Step Testing

### Step 1: Seed the Database with Templates

**IMPORTANT: You need a PostgreSQL database for this to work!**

#### Option A: If you have a database setup
```bash
# Seed 22 sample templates
curl -X POST http://localhost:3000/api/templates/seed
```

You should see:
```json
{
  "message": "Successfully seeded templates",
  "count": 22
}
```

#### Option B: If you DON'T have a database
The app will show errors when trying to save. You can still test:
- The UI and canvas (Phase 1)
- Template forms (Phase 2 UI only)
- Workflow editor interface (Phase 3 UI only)

**To set up a database quickly:**
1. Sign up for free at https://neon.tech or https://supabase.com
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update `.env.local` with: `DATABASE_URL=your_connection_string`
5. Run: `npm run db:push` to create tables
6. Run the seed command above

---

### Step 2: Test the Landing Page

1. Open: **http://localhost:3000**

**What you should see:**
- Large heading "Visual Workflow Builder"
- Three cards: Workflows, Templates, Documentation
- "Get Started" button
- Clean, professional design

**Actions to test:**
- Click "Workflows" card → should go to /workflows
- Click "Templates" card → should go to /templates
- Click "Get Started" button → should go to /workflows

---

### Step 3: Test Template Management (Phase 2)

1. Navigate to: **http://localhost:3000/templates**

**What you should see:**
- Header "Template Library"
- "22 templates available" (if seeded)
- Search bar and filter dropdowns
- Grid of template cards
- "Add Template" button

**Test: Search Templates**
- Type "client" in search box
- Should see only templates with "client" in name/description
- Clear search → see all templates again

**Test: Filter by Node Type**
- Select "Issue" from node type dropdown
- Should see only Issue templates (red badges)
- Try "Action", "Resource", "Deliverable"

**Test: Filter by Category**
- Select a category from dropdown
- Should see only templates in that category

**Test: Create New Template**
1. Click "Add Template" button
2. Modal opens
3. Fill in:
   - Node Type: Action
   - Name: "Test Template"
   - Category: "Testing"
   - Description: "This is a test"
   - Tags: "test, demo"
4. Click "Create Template"
5. Modal closes
6. New template appears in grid

**Test: Edit Template**
1. Click edit icon (pencil) on any template
2. Modal opens with template data
3. Change the name
4. Click "Update Template"
5. Name updates in grid

**Test: Delete Template**
1. Click delete icon (trash) on your test template
2. Confirmation dialog appears
3. Click OK
4. Template disappears from grid

---

### Step 4: Test Workflow Canvas (Phase 1)

1. Navigate to: **http://localhost:3000/workflows/new**

**What you should see:**
- Left sidebar with 4 node types (Issue, Action, Resource, Deliverable)
- Large white canvas in center
- React Flow controls (zoom buttons, minimap)
- Header with "Untitled Workflow" and Save button

**Test: Drag Nodes to Canvas**
1. **Drag "Issue"** node from sidebar to canvas
2. Node appears on canvas (red border, alert icon)
3. **Drag "Action"** node to canvas
4. Node appears (blue border, play icon)
5. **Drag "Resource"** node to canvas
6. Node appears (green border, wrench icon)
7. **Drag "Deliverable"** node to canvas
8. Node appears (purple border, check icon)

**Test: Connect Nodes**
1. Hover over Issue node
2. See connection handles (top and bottom)
3. Click and drag from bottom handle of Issue
4. Drag to top handle of Action
5. Release → arrow connects nodes
6. Connect Action → Resource → Deliverable

**Test: Canvas Controls**
- **Zoom**: Scroll mouse wheel → canvas zooms in/out
- **Pan**: Click and drag on empty canvas → canvas moves
- **MiniMap**: Bottom-right corner shows overview
- **Delete**: Select node, press Delete key → node disappears

---

### Step 5: Test Template Selection in Nodes (Phase 2)

**Prerequisite:** Make sure you have templates seeded!

1. On the workflow canvas, click on an **Issue** node

**What you should see:**
- Button "Select Template"

2. Click "Select Template"

**What happens:**
- Modal opens
- Title: "Select issue Template"
- Search bar at top
- Category filter
- List of Issue templates (only Issue type shown)

**Test: Search Templates in Modal**
- Type "client" in search
- Should see filtered results
- Clear search

**Test: Filter by Category**
- Select a category
- Results filter

**Test: Select a Template**
1. Click on "Client Onboarding" template
2. Modal closes
3. Node updates to show:
   - Title: "Client Onboarding"
   - Description below title
   - "Change Template" button

**Test: Change Template**
1. Click "Change Template" button
2. Modal opens again
3. Select different template
4. Node updates

**Repeat for other node types:**
- Action node → Select "Discovery Call"
- Resource node → Select "GoHighLevel"
- Deliverable node → Select "Client Onboarding Report"

---

### Step 6: Test Workflow Save (Phase 3)

**Create a complete workflow first:**
1. Add 4 nodes (Issue, Action, Resource, Deliverable)
2. Select templates for each
3. Connect them all

**Test: Manual Save**
1. Change workflow name to "Test Workflow"
2. Click "Save" button
3. Alert: "Workflow saved successfully!"
4. URL changes from `/workflows/new` to `/workflows/{id}`
5. See green checkmark with "Saved just now"

**Test: Continue Editing**
1. Add another node
2. Wait a moment
3. See "Saved Xs ago" update

**Test: Auto-Save**
1. Make a change (move a node)
2. Wait 30 seconds
3. See "Saved Xs ago" update (no alert)
4. Check auto-save checkbox is ON

**Test: Toggle Auto-Save**
1. Uncheck "Auto-save" checkbox
2. Make a change
3. Wait 30+ seconds
4. "Saved" time doesn't update
5. Re-check checkbox
6. Wait 30 seconds
7. Auto-save resumes

---

### Step 7: Test Workflow Library (Phase 3)

1. Navigate to: **http://localhost:3000/workflows**

**What you should see:**
- Header "Workflows"
- Count of workflows
- Search bar (if workflows exist)
- Grid of workflow cards
- "New Workflow" button

**Each workflow card shows:**
- Gradient thumbnail
- Workflow name
- Last updated date
- Node count
- Connection count
- Edit, Duplicate, Delete buttons

**Test: Search Workflows**
- Type workflow name in search
- Results filter in real-time

**Test: Edit Workflow**
1. Click "Edit" button on a workflow
2. Opens in editor
3. All nodes and edges load correctly
4. Templates are selected in nodes
5. Workflow name is correct

**Test: Duplicate Workflow**
1. Click duplicate icon (copy) on a workflow
2. Confirmation dialog
3. Click OK
4. New workflow opens in editor
5. Name is "Original Name (Copy)"
6. All nodes and connections are duplicated

**Test: Delete Workflow**
1. Click delete icon (trash) on a workflow
2. Confirmation: "Delete workflow X? This cannot be undone."
3. Click OK
4. Workflow disappears from library

---

### Step 8: Test Complete User Flow

**Create a Real Workflow from Start to Finish:**

1. **Start**: Go to /workflows, click "New Workflow"

2. **Build**:
   - Drag Issue node → Select "Client Onboarding"
   - Drag Action node → Select "Discovery Call"
   - Drag Resource node → Select "GoHighLevel"
   - Drag Deliverable node → Select "Client Onboarding Report"
   - Connect: Issue → Action → Resource → Deliverable

3. **Save**:
   - Rename to "Client Onboarding Process"
   - Click Save
   - URL updates

4. **Edit**:
   - Add another Action node
   - Select "Client Training Session"
   - Connect it
   - Wait 30 seconds → auto-save!

5. **Return**:
   - Click "Back" to workflows library
   - See your workflow in grid

6. **Reload**:
   - Click Edit on your workflow
   - Everything loads correctly!

7. **Duplicate**:
   - Go back to library
   - Duplicate the workflow
   - Opens with all content

8. **Delete**:
   - Delete the duplicate
   - Confirm it's gone

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch templates"
**Cause:** Database not configured
**Solution:** Set up PostgreSQL database (see Step 1)

### Issue: Templates don't appear in dropdown
**Cause:** Database not seeded
**Solution:** Run seed command: `curl -X POST http://localhost:3000/api/templates/seed`

### Issue: Nodes don't connect
**Cause:** Dragging from wrong position
**Solution:** Drag from the small circle handles (top/bottom of nodes)

### Issue: Auto-save not working
**Cause:** Workflow not saved yet
**Solution:** Click "Save" manually first, then auto-save activates

### Issue: Workflow doesn't load
**Cause:** Invalid workflow ID
**Solution:** Go to /workflows library and click Edit on a valid workflow

---

## ✅ Feature Verification Checklist

After testing, verify these key features work:

### Phase 1 - Canvas
- [x] Drag-drop nodes
- [x] Connect nodes with arrows
- [x] Zoom in/out
- [x] Pan canvas
- [x] Delete nodes
- [x] 4 distinct node types with colors

### Phase 2 - Templates
- [x] 22 templates seeded
- [x] Create new template
- [x] Edit template
- [x] Delete template
- [x] Search templates
- [x] Filter by node type
- [x] Filter by category
- [x] Select template in node
- [x] Change template in node
- [x] Template data populates node

### Phase 3 - Workflows
- [x] Save new workflow
- [x] Update existing workflow
- [x] Load workflow from library
- [x] Auto-save every 30 seconds
- [x] Toggle auto-save on/off
- [x] "Saved Xs ago" indicator
- [x] Search workflows
- [x] Edit workflow
- [x] Duplicate workflow
- [x] Delete workflow
- [x] Node/edge counts correct

---

## 📊 Performance Benchmarks

**What to expect:**
- Page load: < 2 seconds
- Template search: Instant
- Workflow save: < 500ms
- Workflow load: < 500ms
- Node drag: Smooth 60fps
- Canvas zoom/pan: Smooth

**If performance is slow:**
- Check browser console for errors
- Ensure database connection is fast
- Try with fewer nodes (start small)

---

## 🎓 Advanced Testing

### Test with Many Nodes
1. Create workflow with 20+ nodes
2. Connect them all
3. Save
4. Reload
5. Should load smoothly

### Test with Long Names
1. Create template with very long name (100 chars)
2. Should truncate in UI
3. Full name shows on hover

### Test Edge Cases
- Create workflow with NO nodes → should save
- Create workflow with nodes but NO connections → should save
- Delete all nodes from saved workflow → should save empty workflow

---

## 📝 Test Report Template

After testing, note:

**✅ Working Features:**
- (List what works)

**❌ Issues Found:**
- (List any bugs or problems)

**🎯 Suggestions:**
- (Any improvements or feedback)

---

## 🎉 Success Criteria

**You've successfully tested when:**
1. ✅ All 3 phases features work
2. ✅ Can create complete workflow from scratch
3. ✅ Can save and reload workflow
4. ✅ Auto-save works
5. ✅ Templates populate nodes correctly
6. ✅ No console errors
7. ✅ UI is responsive and smooth

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check terminal for server errors
3. Verify database is connected (if using DB features)
4. Try refreshing the page
5. Check PHASE_1_SUMMARY.md, PHASE_2_SUMMARY.md, PHASE_3_SUMMARY.md for technical details

---

**Happy Testing! 🚀**
