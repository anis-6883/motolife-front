# Moto Life - Motorcycle E-Commerce Platform

A full-featured e-commerce platform built with Next.js for motorcycle gear, parts, and accessories. This marketplace connects riders with trusted vendors across Bangladesh.

![Moto Life](https://motolife-root.vercel.app/images/auth/logo.png)

## 🏍️ Overview

Moto Life is a comprehensive online marketplace specializing in motorcycle products including helmets, riding wear, engine oils, accessories, and motorcycle parts. The platform features a modern, responsive design with advanced e-commerce functionalities.

## ✨ Features

- **Product Catalog**: Browse extensive collections of motorcycle gear and accessories
- **Flash Sales**: Time-limited deals with countdown timers
- **Product Categories**:
  - Engine Oil
  - Helmets
  - Locks
  - Parts
  - Windbreaker & Jackets
  - Riding Gear
- **Shopping Cart**: Full cart management with real-time updates
- **Wishlist**: Save favorite products for later
- **Order Tracking**: Track your orders in real-time
- **Multi-language Support**: English and Bengali language options
- **Seller Portal**: Dedicated dashboard for vendors
- **Combo Offers**: Special bundled product deals
- **User Authentication**: Secure login and account management
- **Search Functionality**: Quick product search
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React Framework)
- **Styling**: Tailwind CSS (inferred from modern responsive design)
- **Image Optimization**: Next.js Image component
- **Deployment**: Vercel
- **Currency**: BDT (Bangladeshi Taka)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn or pnpm

### Installation

1. Clone the repository:

```bash
git clone
cd motolife
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
motolife/
├── app/                    # Next.js app directory
├── components/             # React components
├── public/
│   └── images/
│       ├── auth/          # Authentication related images
│       ├── carousel/      # Carousel/slider images
│       ├── sample-data-images/  # Product images
│       └── shared/        # Shared assets
├── styles/                # CSS/Tailwind styles
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── next.config.js         # Next.js configuration
```

## 🔑 Key Pages

- `/` - Homepage with featured products and categories
- `/product/[id]` - Product detail pages
- `/combo-offer` - Combo deals and bundles
- `/track-order` - Order tracking
- `/contact` - Contact page
- `/become-seller` - Seller registration
- `/wishlist` - User wishlist
- `/orders` - Order history
- `/cart` - Shopping cart

## 🎨 UI Features

- Animated carousel banners
- Product cards with rating and pricing
- Countdown timers for flash sales
- Rotating wheel animations for categories
- Responsive navigation with mobile menu
- Product discount badges
- Wishlist and cart indicators

## 🌐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔒 Authentication & Security

- Secure user authentication system
- Protected routes for authenticated users
- Seller verification process
- Secure payment processing

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🛒 E-Commerce Features

### For Customers

- Browse products by category
- Advanced search and filtering
- Product reviews and ratings
- Secure checkout process
- Order tracking
- Wishlist management
- Discount codes and combo offers

### For Sellers

- Seller registration and verification
- Product listing management
- Order fulfillment
- Dedicated seller dashboard

## 🚢 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

```bash
# Deploy using Vercel CLI
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and inquiries:

- **Address**: Bangshal, Dhaka, Bangladesh
- **Phone**: 01322140062
- **Email**: contact.motolife@gmail.com

## 📄 Policies

- [Terms & Conditions](https://motolife-root.vercel.app/terms-conditions)
- [Privacy Policy](https://motolife-root.vercel.app/privacy-policy)
- [Return & Refund Policy](https://motolife-root.vercel.app/return-refund)
- [Seller Policy](https://motolife-root.vercel.app/seller-policy)

## 📝 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and vendors on the platform

---

**Live Demo**: [https://motolife-root.vercel.app](https://motolife-root.vercel.app)

Copyright ©2026 MotoLife. All rights reserved.
