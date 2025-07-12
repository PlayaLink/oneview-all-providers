# New Grid/Table Workflow (Backend-Driven Config)

This checklist guides you through adding a new grid/table using a fully backend-driven configuration in Supabase.

---

## 1. Gather Field Requirements
- [ ] Collect screenshots or a detailed list of all fields/columns needed for the new grid.
- [ ] Identify any field groupings for the Details panel.

## 2. Write SQL Migration for New Table
- [ ] Draft a Supabase-compatible SQL script to create the new table, including all required columns and relationships (e.g., provider_id).
- [ ] Run the migration in Supabase.

## 3. Seed Table with Dummy Data
- [ ] Create or update a Node script to generate and insert dummy data for the new table.
- [ ] Run the script and verify data is present.

## 4. Create CRUD Helpers and Zod Schema
- [ ] Add fetch, insert, update, and delete helpers in your supabase client file.
- [ ] Define a Zod schema for runtime validation.

## 5. Add Grid and Columns to Backend Config Tables
- [ ] Insert a new row in `grid_definitions` for the grid.
- [ ] Insert all columns for the grid into `grid_columns`, including display names, types, order, visibility, and groupings.

## 6. Wire Up Grid and Details Panel in Frontend
- [ ] Fetch grid and column config from Supabase in the frontend.
- [ ] Dynamically generate AG Grid columns and Details panel field groups.
- [ ] Create or update the Details component, using CollapsibleSection for field groups.

## 7. Add Semantic/Testability Attributes
- [ ] Add `data-testid`, `role`, and relevant `aria-*` attributes to all interactive and structural elements.
- [ ] Use semantic HTML elements where possible.

## 8. Test End-to-End
- [ ] Verify the grid displays data correctly.
- [ ] Test Details panel for correct grouping and editing.
- [ ] Confirm CRUD operations work as expected.
- [ ] Ensure accessibility and testability requirements are met.

---

**Use this checklist for every new grid/table you add!** 