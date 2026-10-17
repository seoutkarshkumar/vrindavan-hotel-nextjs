export const DEFAULT_SETTINGS = {
  siteName: 'Vrindavan Hotel',
  tagline: 'A Divine Stay in the Land of Krishna',
  description:
    'Experience serene comfort at Vrindavan Hotel — luxury rooms, authentic Vraj hospitality, walking distance to Banke Bihari Temple.',
  keywords:
    'vrindavan hotel, hotels in vrindavan, banke bihari hotel, vrindavan mathura stay, best hotel vrindavan, dharamshala vrindavan',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'bookings@vrindavanhotel.example',
  address: 'Near Banke Bihari Temple, Vrindavan, Mathura, Uttar Pradesh 281121',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.99!2d77.6913!3d27.5806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM0JzUwLjIiTiA3N8KwNDEnMjguNyJF!5e0!3m2!1sen!2sin!4v1700000000000',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
  },
};

export const DEFAULT_ROOMS = [
  {
    id: 1,
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    price: 2499,
    capacity: 2,
    size: '280 sq ft',
    beds: '1 King Bed',
    featured: true,
    shortDesc: 'Elegant room with modern comforts and temple-side ambience.',
    description:
      'Our Deluxe Rooms offer a serene retreat after a divine day in Vrindavan. Enjoy plush bedding, a private balcony, and warm hospitality inspired by Vraj culture.',
    amenities: ['Free Wi-Fi', 'AC', 'Smart TV', 'Room Service', 'Private Balcony', 'Complimentary Breakfast'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
    ],
  },
  {
    id: 2,
    slug: 'premium-suite',
    name: 'Premium Suite',
    price: 4499,
    capacity: 3,
    size: '450 sq ft',
    beds: '1 King + Sofa Bed',
    featured: true,
    shortDesc: 'Spacious suite with living area, ideal for families on pilgrimage.',
    description:
      'Premium Suite offers a separate living lounge, luxurious king bed, and a curated tea/coffee bar. Perfect for families and small groups.',
    amenities: ['Free Wi-Fi', 'AC', 'Living Area', 'Mini Fridge', 'Bathtub', 'Breakfast + Dinner'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200',
    ],
  },
  {
    id: 3,
    slug: 'family-room',
    name: 'Family Room',
    price: 3499,
    capacity: 4,
    size: '380 sq ft',
    beds: '2 Queen Beds',
    featured: true,
    shortDesc: 'Comfort for the whole family, close to all major temples.',
    description:
      'Two queen beds, connecting balcony, and a dedicated seating area — designed for families visiting the sacred sites of Vrindavan-Mathura.',
    amenities: ['Free Wi-Fi', 'AC', 'Smart TV', 'Extra Bedding', 'Kids Welcome Kit', 'Breakfast'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200',
    ],
  },
];

export const DEFAULT_SERVICES = [
  { id: 1, icon: 'Utensils',   title: 'Pure Veg Restaurant',     description: 'Authentic satvik cuisine — no onion, no garlic — prepared by temple-trained chefs.' },
  { id: 2, icon: 'Car',        title: 'Temple Darshan Cab',       description: 'Comfortable AC cabs for full-day temple tours across Vrindavan & Mathura.' },
  { id: 3, icon: 'Sparkles',    title: 'Yoga & Meditation',        description: 'Daily sunrise yoga sessions on our rooftop with a view of Yamuna.' },
  { id: 4, icon: 'Wifi',        title: 'Free High-Speed Wi-Fi',     description: 'Blazing-fast internet across the entire property, lobby to rooftop.' },
  { id: 5, icon: 'ConciergeBell', title: '24×7 Concierge',           description: 'Round-the-clock help — from aarti timings to laundry to airport pickup.' },
  { id: 6, icon: 'HeartHandshake', title: 'Pilgrimage Assistance',   description: 'Guided tours of Banke Bihari, ISKCON, Prem Mandir & Nidhivan.' },
];

export const DEFAULT_BLOG = [
  {
    id: 1,
    slug: 'top-10-temples-vrindavan',
    title: 'Top 10 Temples to Visit in Vrindavan',
    excerpt: 'A curated guide to the most divine temples of Vrindavan — timings, tips, and hidden gems.',
    cover: 'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=1200',
    author: 'Vrindavan Hotel Team',
    date: '2025-01-15',
    tags: ['temples', 'travel', 'vrindavan'],
    content:
      '# Top 10 Temples to Visit in Vrindavan\n\nVrindavan, the land of Krishna, houses thousands of temples. Here are the top 10 you must not miss...\n\n## 1. Banke Bihari Temple\nThe most iconic temple of Vrindavan...\n\n## 2. ISKCON Vrindavan\nA modern architectural marvel...\n\n## 3. Prem Mandir\nThe Temple of Divine Love...\n\n(Continue writing your content)',
  },
  {
    id: 2,
    slug: 'best-time-to-visit-vrindavan',
    title: 'Best Time to Visit Vrindavan — Seasons & Festivals',
    excerpt: 'From Holi to Janmashtami — plan your Vrindavan trip around the divine calendar.',
    cover: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=1200',
    author: 'Vrindavan Hotel Team',
    date: '2025-01-10',
    tags: ['travel', 'festivals'],
    content: '# Best Time to Visit Vrindavan\n\nOctober to March is the most pleasant weather...',
  },
];

export const DEFAULT_PAGES = [
  {
    id: 1,
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    published: true,
    content:
      '# Privacy Policy\n\nWe value your privacy. This page describes how we handle your data...',
  },
];
