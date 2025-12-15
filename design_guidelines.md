# Design Guidelines: منصة توظيف ذكية (Smart Hiring Platform)

## Design Approach
**Reference-Based with LinkedIn + Modern Job Platforms inspiration**
- Primary references: LinkedIn (professional profiles), Indeed (job listings), Behance (clean card layouts)
- Justification: Professional job platform requiring trust, clarity, and efficient information display
- Principle: Balance professionalism with approachability for 15-70 age range

## Core Design Elements

### A. Typography
**Font Stack (via Google Fonts):**
- Primary (Arabic/RTL): 'Cairo' - 400, 600, 700
- Secondary (Latin): 'Inter' - 400, 500, 600, 700
- Mono (code/numbers): 'IBM Plex Mono' - 400

**Hierarchy:**
- Hero Headlines: text-5xl md:text-6xl font-bold
- Section Headers: text-3xl md:text-4xl font-semibold  
- Card Titles: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Captions: text-sm text-gray-600

### B. Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20
- Card gaps: gap-6 md:gap-8
- Container: max-w-7xl mx-auto px-4

**Grid Patterns:**
- Job listings: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Features: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Profiles: grid-cols-1 lg:grid-cols-3 (sidebar + content)

### C. Component Library

**Navigation:**
- Fixed header with logo left, navigation center, auth buttons right
- Mobile: Hamburger menu with slide-out drawer
- Multi-language dropdown (6 flags with labels)
- Dark mode toggle icon (sun/moon)

**Cards (Job/Training/Volunteer):**
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-sm hover:shadow-md)
- Company logo top-left (w-12 h-12 rounded-md)
- Title, company name, location, salary range
- Tags for job type/category (rounded-full px-3 py-1)
- Apply button bottom-right
- Bookmark icon top-right

**Profile Components:**
- LinkedIn-style header with cover image
- Avatar overlay (w-32 h-32 rounded-full border-4)
- Stats row (connections, posts, views)
- Tabbed content sections
- Experience timeline with company logos

**CV Builder (ATS System):**
- Step-by-step wizard with progress bar
- Form sections with clear labels
- Real-time preview panel (split screen on desktop)
- Drag-and-drop for reordering sections
- Templates gallery with thumbnails

**Messaging:**
- WhatsApp-style chat interface
- Conversation list left, chat window right
- Message bubbles (sender: green, receiver: white/gray)
- Typing indicators, read receipts
- File attachment support with previews

**Search & Filters:**
- Prominent search bar (w-full max-w-2xl)
- Expandable filter sidebar
- Chips for active filters (removable)
- Results count display
- Sort dropdown (newest, relevant, salary)

**Admin Dashboard:**
- Sidebar navigation with icons
- Stat cards grid (users, jobs, revenue)
- Charts for analytics (line, bar, pie)
- Data tables with pagination
- Action buttons (approve/reject/edit)

### D. Color System Structure
**Note:** Specific colors provided separately. Design uses:
- Primary: Green shades for CTAs, accents
- Neutral: White, black, grays for backgrounds, text
- Accent: Subtle gold for premium features, badges
- Semantic: Success (green), warning (amber), error (red)

**Dark Mode:**
- Background: Near-black (not pure black)
- Cards: Elevated dark surfaces
- Text: Off-white for readability
- Maintain green primary, adjust opacity

### E. Provincial Pages (14 Pages)
- Hero with province name + landmark image
- Quick stats (total jobs, companies, seekers)
- Featured opportunities grid
- Company directory for that province
- Map integration showing job locations

### Images
**Hero Section:** Large background image (h-screen) showing Syrian professionals in modern office/diverse work settings, subtle overlay for text readability

**Provincial Pages:** Landmark images for each province (Damascus: Umayyad Mosque area, Aleppo: Citadel, etc.) as hero backgrounds

**Job Cards:** Company logo placeholders (80x80px)

**Profile Pages:** Cover images (1200x300) + profile avatars (circular, 150x150)

**About/Features:** Illustrations of AI-powered CV matching, communication flow, 3-4 images showing platform benefits

## Accessibility
- RTL support for Arabic (dir="rtl" on html)
- Keyboard navigation throughout
- ARIA labels for all interactive elements
- Focus states: ring-2 ring-green-500
- Minimum contrast ratio 4.5:1
- Form validation with clear error messages

## Animation (Minimal)
- Page transitions: Fade only
- Card hover: Subtle lift (transform scale-105)
- Button states: Built-in hover/active
- No scroll animations or distractions

## Responsive Breakpoints
- Mobile-first approach
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px
- Stack multi-column layouts on mobile
- Hide sidebar nav on mobile, show hamburger