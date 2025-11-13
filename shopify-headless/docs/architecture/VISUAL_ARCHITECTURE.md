# Modern Homepage - Visual Architecture

## Page Layout (Desktop)

```
┌────────────────────────────────────────────────────┐
│              HEADER (Navigation)                   │
├────────────────────────────────────────────────────┤
│                                                    │
│               HERO SECTION                        │ ← Above Fold
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │ Welcome to Our Store                       │   │
│  │ Discover amazing products                  │   │
│  │                                            │   │
│  │ [Shop Now]  [Build Family Plan]            │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│          FEATURED PRODUCTS GRID                   │ ← Mid-Fold
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Product 1│  │ Product 2│  │ Product 3│  ...    │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│           HERO CAROUSEL                           │ ← Below Fold
│                                                    │ (Lazy Loaded)
│  ┌────────────────────────────────────────────┐   │
│  │                                            │   │
│  │         ┌─────────────────────────┐        │   │
│  │         │                         │        │   │
│  │         │    [FULL SLIDE IMAGE]   │        │   │
│  │         │                         │        │   │
│  │         │    ● ● ● ● ●           │        │   │
│  │         │    (Navigation dots)    │        │   │
│  │         │  ← [   ] [   ] →        │        │   │
│  │         │   (Arrow buttons)       │        │   │
│  │         │                         │        │   │
│  │         │  Premium Tech          │        │   │
│  │         │  High-quality t-shirts │        │   │
│  │         │                         │        │   │
│  │         └─────────────────────────┘        │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│          FAMILY PLAN PROMO                        │
│                                                    │
│  Save More with Family Plans                      │
│  [Details...]                                     │
│                                                    │
├────────────────────────────────────────────────────┤
│              FOOTER (Links, Info)                  │
└────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
Home (page.tsx)
├── Hero Section
│   ├── Title (h1)
│   ├── Subtitle (p)
│   └── Buttons
│       ├── Shop Now (Link)
│       └── Build Family Plan (Link)
│
├── Featured Products Section
│   ├── Title (h2)
│   └── Products Grid
│       ├── ProductCard 1
│       ├── ProductCard 2
│       ├── ProductCard 3
│       └── ProductCard 4
│
├── Hero Carousel (Lazy Loaded)
│   ├── Carousel Wrapper
│   │   ├── AnimatePresence (Framer Motion)
│   │   │   └── Motion Div (Slide)
│   │   │       ├── Image
│   │   │       ├── Overlay (gradient)
│   │   │       └── Text Overlay (animated)
│   │   ├── Navigation Dots
│   │   │   └── Motion Buttons (dot)
│   │   └── Arrow Buttons
│   │       ├── Previous Button
│   │       └── Next Button
│   └── Auto-advance Timer
│
└── Family Plan Promo (Lazy Loaded)
    ├── Title
    ├── Description
    └── Features
```

---

## Animation Flow

### Carousel Slide Transition
```
1. Slide Enters
   ┌─────────────────────────┐
   │ x: 1000 or -1000        │  ← Position
   │ opacity: 0              │  ← Fade in
   └─────────────────────────┘
            ↓ animate (300ms) ↓
   ┌─────────────────────────┐
   │ x: 0                    │  ← Center position
   │ opacity: 1              │  ← Full visible
   └─────────────────────────┘

2. Text Overlay Enters (staggered)
   ┌─────────────────────────┐
   │ opacity: 0              │
   │ y: 20px                 │  ← Below visible area
   └─────────────────────────┘
            ↓ animate (600ms) ↓
            ↓ delay: 300ms    ↓
   ┌─────────────────────────┐
   │ opacity: 1              │  ← Visible
   │ y: 0                    │  ← In position
   └─────────────────────────┘

3. Slide Exits
   ┌─────────────────────────┐
   │ x: -1000 or 1000        │  ← Slide out
   │ opacity: 0              │  ← Fade out
   └─────────────────────────┘
            ↓ (parallel with next slide enter)
```

---

## Responsive Breakpoints

### Desktop (1024px+)
```
┌──────────────────────────────────┐
│      Hero Section (4rem padding) │
│      Hero: 3rem font             │
│      Carousel: 500px height      │
│      Products: 4 columns         │
└──────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────────────┐
│   Hero Section (3rem padding)  │
│   Hero: 2.5rem font            │
│   Carousel: 350px height       │
│   Products: 3 columns          │
└────────────────────────────────┘
```

### Mobile (480px - 767px)
```
┌──────────────────────────────┐
│ Hero (2rem padding)          │
│ Hero: 2rem font              │
│ Carousel: 250px height       │
│ Products: 2 columns          │
└──────────────────────────────┘
```

### Small Mobile (<480px)
```
┌────────────────────────────┐
│ Hero (1rem padding)        │
│ Hero: 1.75rem font         │
│ Carousel: 250px height     │
│ Products: 1 column         │
└────────────────────────────┘
```

---

## Image Carousel Anatomy

```
┌─────────────────────────────────────────────────────────┐
│  Hero Carousel Container                                │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Carousel Wrapper (500px height)                 │  │
│  │                                                  │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │                                             │ │  │
│  │  │         SLIDE IMAGE (full cover)            │ │  │
│  │  │  (object-fit: cover, object-position: center) │ │  │
│  │  │                                             │ │  │
│  │  │         ┌──────────────────────────┐       │ │  │
│  │  │         │  Overlay (gradient)      │       │ │  │
│  │  │         │  (40% height at bottom)  │       │ │  │
│  │  │         │                          │       │ │  │
│  │  │         │  ┌──────────────────┐   │       │ │  │
│  │  │         │  │ Text Overlay     │   │       │ │  │
│  │  │         │  │ • Premium Tech   │   │       │ │  │
│  │  │         │  │ • High-quality   │   │       │ │  │
│  │  │         │  │   t-shirts       │   │       │ │  │
│  │  │         │  └──────────────────┘   │       │ │  │
│  │  │         └──────────────────────────┘       │ │  │
│  │  │  ← Navigation Button              Next →   │ │  │
│  │  │                                             │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  │        ● ● ● ● ●                               │  │
│  │        (Navigation Dots)                        │  │
│  │                                                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## CSS Layout Technique

### Hero Section
```css
/* Flexbox layout */
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 2rem;
```

### Carousel Wrapper
```css
/* Position relative for absolute children */
position: relative;
width: 100%;
height: 500px;  /* Fixed - prevents CLS */
overflow: hidden;
```

### Carousel Slide
```css
/* Absolute positioning for animation */
position: absolute;
width: 100%;
height: 100%;

/* Animated via Framer Motion */
transform: translateX(x);  /* GPU accelerated */
opacity: opacity;
```

### Navigation Buttons
```css
/* Absolute positioning */
position: absolute;
top: 50%;
transform: translateY(-50%);

/* Positioned left or right */
left: 1.5rem;  /* or right: 1.5rem */
```

---

## State Management

### Carousel State (React Hooks)

```typescript
// Current slide index
const [currentIndex, setCurrentIndex] = useState(0);

// Direction of navigation
const [direction, setDirection] = useState(0);

// Auto-advance timer
useEffect(() => {
  const interval = setInterval(() => {
    paginate(1);  // Auto-advance 1 slide forward
  }, 5000);       // Every 5 seconds
  
  return () => clearInterval(interval);
}, [paginate]);

// Handle manual navigation
const paginate = (newDirection) => {
  setDirection(newDirection);
  setCurrentIndex((prev) => 
    (prev + newDirection + images.length) % images.length
  );
};
```

---

## Performance Characteristics

### Render Timeline
```
0ms   ┌─ Page requested
      │
100ms ├─ HTML parsed (LCP begins)
      │
500ms ├─ CSS parsed
      │  ├─ Hero section renders
      │  └─ Hero text visible (LCP ends ~1.2s)
      │
1000ms├─ JavaScript parsed
      │  ├─ Products fetched
      │  └─ Featured products render
      │
1500ms├─ Carousel component imported (lazy)
      │  ├─ Images start loading
      │  └─ Carousel renders
      │
2000ms├─ Carousel images loaded
      │  └─ Carousel fully interactive
```

### FCP (First Contentful Paint)
- **Time:** ~500ms
- **Content:** Hero text, buttons
- **No images:** Keeps FCP fast

### LCP (Largest Contentful Paint)
- **Time:** ~1.2-1.5s
- **Content:** Hero text
- **Status:** ✅ < 2.5s (Good threshold)

### CLS (Cumulative Layout Shift)
- **Score:** < 0.05
- **Reason:** Fixed dimensions, no dynamic insertion above fold
- **Status:** ✅ Excellent

---

## Color & Typography

### Typography Scale
```
Hero Title:       3rem   (desktop) → 1.75rem (mobile)
Hero Subtitle:    1.25rem → 1rem
Overlay Title:    2.5rem (desktop) → 1.5rem (mobile)
Overlay Desc:     1.1rem (desktop) → 0.9rem (mobile)
Product Title:    1.25rem
Section Title:    2.25rem (desktop) → 1.5rem (mobile)
Button Text:      1rem
```

### Color Palette
```
Primary:          #2563eb (blue)
Primary Dark:     #1d4ed8 (hover)
Text Dark:        #1a1a1a (90% black)
Text Medium:      #666 (secondary text)
Background:       #ffffff (light)
Accent:           #f0f9ff (light blue hover)
Overlay:          rgba(0, 0, 0, 0.6) (semi-transparent)
```

---

**Visual Guide Complete ✅**
