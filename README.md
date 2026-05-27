# Lumencraft Landing Page

A modern, responsive landing page for Lumencraft - architectural lighting solutions company.

## 🚀 Features

- **Dark Modern Header** - Sticky navigation with search functionality
- **Hero Section** - Eye-catching "Let's talk LIGHT" hero with gradient background and animated light beams
- **Expertise Section** - Company overview and capabilities
- **Services** - Dedicated services and products sections with icons
- **Featured Products** - Interactive carousel showcasing DRAGO lighting products with real images
- **Statistics Banner** - Key metrics and achievements
- **Why Choose Us** - Four key value propositions with icons
- **Featured Projects** - Gallery of architectural lighting projects with hover effects
- **Technology Partners** - Partner logos with industry tags
- **Contact CTA** - Call-to-action section
- **Professional Footer** - Complete footer with navigation and social links

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Unsplash Images** - High-quality stock images for products and projects

## 📦 Getting Started

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
lumencraft-landing/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── Expertise.tsx     # Company expertise
│   ├── Services.tsx      # Services section
│   ├── FeaturedProducts.tsx  # Product carousel
│   ├── Stats.tsx         # Statistics banner
│   ├── WhyChooseUs.tsx   # Value propositions
│   ├── FeaturedProjects.tsx  # Project gallery
│   ├── TechnologyPartners.tsx # Partner logos
│   ├── Contact.tsx       # CTA section
│   └── Footer.tsx        # Footer
└── next.config.ts        # Next.js configuration
```

## 🎨 Customization

### Replace Images

**Products:** Edit `components/FeaturedProducts.tsx` - Update the `products` array:
```typescript
const products = [
  {
    id: 1,
    name: "Your Product Name",
    type: "Product Type",
    image: "/images/product1.jpg" // or Unsplash URL
  },
];
```

**Projects:** Edit `components/FeaturedProjects.tsx` - Update the `projects` array:
```typescript
const projects = [
  {
    id: 1,
    name: "Project Name",
    location: "Location",
    image: "/images/project1.jpg"
  },
];
```

### Colors & Branding

- Hero gradient: `components/Hero.tsx`
- Stats banner: `components/Stats.tsx` (blue-600)
- All text content is in component files for easy editing

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile: Single column
- Tablet: 2-column grids
- Desktop: Full layouts

## 🚀 Deploy on Vercel

```bash
npm install -g vercel
vercel
```

Or use the [Vercel Platform](https://vercel.com/new) - import from Git.
