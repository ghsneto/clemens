# Clemens Design System & UI Guidelines

## 🎯 Objective
Recreate a modern admin dashboard UI inspired by DashStack (Figma) and the images inside `/references`.

The goal is NOT to copy exactly, but to achieve a visually very close, clean, and professional SaaS interface.

---

## 📁 Reference Files

Use the following images as primary UI inspiration:

- `references/home.png` → main dashboard layout
- `references/dashboard-reference.png` → cards, charts, spacing
- `references/sidebar.png` (implicit from others) → navigation structure
- `references/listas.png` → table/list layout
- `references/componentes-filtros.png` → filters, inputs, dropdowns
- `references/componentes-calendario.png` → calendar components
- `references/calendario.png` → calendar page
- `references/formulario.png` → forms and input layout

---

## 🧱 Layout Structure

### Global Layout
- Left sidebar (fixed)
- Top navbar (sticky)
- Main content area (responsive container)

### Sidebar
- Dark background
- Icons + labels
- Active item highlight
- Section grouping

### Navbar
- Search input
- Notifications icon
- User avatar/menu

---

## 🧩 Core Components

Create reusable components:

- `Sidebar.tsx`
- `Navbar.tsx`
- `Layout.tsx`
- `StatCard.tsx`
- `DataTable.tsx`
- `FilterBar.tsx`
- `FormInput.tsx`
- `CalendarView.tsx`

---

## 🎨 Design Tokens

### Colors
- Primary: Indigo / Blue (similar to DashStack)
- Background: Light gray (#F9FAFB or similar)
- Surface: White (#FFFFFF)
- Text: Dark gray (#111827)
- Muted: Gray (#6B7280)

### Typography
- Font: Inter
- Headings: semi-bold
- Body: regular

### Spacing
- Use 8px spacing system
- Generous padding in containers

### Border Radius
- Cards: rounded-xl
- Inputs: rounded-lg

### Shadows
- Soft shadows (not heavy)
- Use subtle elevation

---

## 📐 UI Patterns

### Cards
- White background
- Rounded corners
- Shadow-sm
- Padding consistent

### Tables
- Clean layout
- Row hover effect
- Optional striped rows
- Actions aligned right

### Forms
- Labels above inputs
- Clear spacing
- Focus states visible

### Filters
- Inline filter bar
- Dropdown + input combo

---

## ⚙️ Technical Constraints

- Framework: React (Vite)
- Styling: Tailwind CSS
- Components must be reusable
- Avoid inline styles
- Use composition over duplication

---

## 📱 Responsiveness

- Sidebar collapses on smaller screens
- Grid adjusts from 4 → 2 → 1 columns
- Tables scroll horizontally if needed

---

## 🚫 Rules

- DO NOT copy pixel-by-pixel
- DO NOT hardcode layout values randomly
- DO follow spacing consistency
- DO maintain visual hierarchy

---

## ✅ Deliverables Expected

- Clean layout system
- Reusable components
- Consistent UI across pages

Pages to implement:

- Dashboard
- Lists (Users, etc.)
- Forms
- Calendar

---

## 🧠 AI Instruction Layer

Interpret the references as design inspiration and translate them into a production-ready UI system.

Focus on:
- visual hierarchy
- spacing
- alignment
- usability

Avoid:
- unnecessary complexity
- inconsistent styles
