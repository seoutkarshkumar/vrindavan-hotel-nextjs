import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Vrindavan Hotel database seed...');

  // 1. Seed Default Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vrindavanhotel.com';
  const adminPlainPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Vrindavan@123';
  const passwordHash = await bcrypt.hash(adminPlainPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Hotel Owner (Admin)',
      passwordHash,
    },
  });
  console.log(`✅ Admin user ready: ${adminEmail}`);

  // 2. Seed Default Site Settings (Strictly using [placeholders] for hotel facts)
  const domain = 'https://vrindavanhotel.com';
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      hotelName: '[naam]',
      tagline: 'Spiritual & Peaceful Family Stay in Shri Dham Vrindavan',
      brandColor: '#c2410c',
      domain,
      phone: '[number]',
      whatsapp: '[number]',
      email: '[email]',
      address: '[full address]',
      distanceFromBankeBihari: '[e.g. 600 m]',
      checkInTime: '[time]',
      checkOutTime: '[time]',
      priceRange: 'Deluxe ₹__, Family ₹__, Suite ₹__',
      amenitiesList: JSON.stringify([
        '[Amenity 1 - e.g. Free High-Speed Wi-Fi]',
        '[Amenity 2 - e.g. AC Rooms with Geyser]',
        '[Amenity 3 - e.g. Pure Satvik Veg Dining]',
        '[Amenity 4 - e.g. Secure Car Parking]',
        '[Amenity 5 - e.g. Lift / Elevator Facility]',
        '[Amenity 6 - e.g. 24x7 Power Backup & Room Service]',
        '[Amenity 7 - e.g. E-Rickshaw / Temple Darshan Assistance]',
      ]),
      defaultMetaTitle: '[naam] | Best Family Hotel Near Banke Bihari Temple, Vrindavan',
      defaultMetaDescription:
        'Welcome to [naam] at [full address], just [e.g. 600 m] from Banke Bihari Temple. Book Deluxe (₹__), Family (₹__) or Suite (₹__) rooms directly & save 10%.',
      defaultOgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      promoBannerText: 'Radhe Radhe! Book Direct via Website or WhatsApp & Save 10% Instantly!',
    },
  });
  console.log('✅ Site settings seeded with editable [placeholders]');

  // 3. Seed 3 Default Rooms (Deluxe ₹__, Family ₹__, Suite ₹__)
  const roomsData = [
    {
      slug: 'deluxe-room',
      name: 'Deluxe Room',
      pricePlaceholder: '₹__',
      priceNumeric: 0,
      capacity: 2,
      bedType: '1 King Size Bed',
      roomSize: '[Room Size sq ft]',
      shortDescription:
        'Comfortable AC Deluxe Room ideal for couples and yatris visiting Banke Bihari Ji.',
      description: `<h2>Peaceful Deluxe Room in Vrindavan</h2>
<p>Our <strong>Deluxe Room</strong> at <strong>[naam]</strong> offers a clean, spiritual, and restful environment just <strong>[e.g. 600 m]</strong> from Banke Bihari Temple. Designed for couples and solo devotees, every room comes with modern amenities and warm Braj hospitality.</p>
<ul>
  <li>Tariff: <strong>Deluxe ₹__</strong> per night (Book Direct &amp; Save 10%)</li>
  <li>Check-in / Check-out: <strong>[time]</strong></li>
  <li>Walking/E-Rickshaw access to major Vrindavan temples</li>
</ul>`,
      amenities: JSON.stringify([
        'Air Conditioning',
        'Free Wi-Fi',
        '24x7 Hot & Cold Water',
        'LED TV',
        'Clean Linen & Towels',
        'Room Service',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
          alt: 'Deluxe Room at [naam] Hotel in Vrindavan',
        },
        {
          url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
          alt: 'Deluxe Room Interior and Bed at [naam] Vrindavan',
        },
      ]),
      featured: true,
      sortOrder: 1,
      seoTitle: 'Deluxe Room (₹__) at [naam] Vrindavan | Near Banke Bihari Temple',
      metaDescription:
        'Book a clean AC Deluxe Room (₹__) at [naam], located [e.g. 600 m] from Banke Bihari Temple in Vrindavan. Call or WhatsApp [number] to save 10%.',
      focusKeyword: 'Deluxe Room in Vrindavan',
      canonicalUrl: `${domain}/rooms/deluxe-room/`,
      featuredImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
      featuredImageAlt: 'Deluxe Room at [naam] Hotel in Vrindavan',
      faqs: JSON.stringify([
        {
          question: 'What is the price of the Deluxe Room at [naam]?',
          answer: 'The Deluxe Room tariff is ₹__ per night. Book directly on our website or WhatsApp [number] to get an instant 10% discount.',
        },
        {
          question: 'How far is the hotel from Banke Bihari Temple?',
          answer: '[naam] is located at [full address], approximately [e.g. 600 m] from Shri Banke Bihari Temple.',
        },
      ]),
    },
    {
      slug: 'family-room',
      name: 'Family Room',
      pricePlaceholder: '₹__',
      priceNumeric: 0,
      capacity: 4,
      bedType: '2 Double Beds',
      roomSize: '[Room Size sq ft]',
      shortDescription:
        'Spacious 4-bed AC Family Room perfect for families and senior citizens on Braj Yatra.',
      description: `<h2>Spacious Family Room for Braj Parikrama &amp; Darshan</h2>
<p>Travelling to Vrindavan with your family and parents? Our <strong>Family Room</strong> at <strong>[naam]</strong> comfortably accommodates up to 4 guests with ample luggage space, elevator access, and proximity (<strong>[e.g. 600 m]</strong>) to Banke Bihari Ji.</p>
<ul>
  <li>Tariff: <strong>Family ₹__</strong> per night</li>
  <li>Check-in / Check-out: <strong>[time]</strong></li>
  <li>Senior-citizen friendly with lift and satvik food options</li>
</ul>`,
      amenities: JSON.stringify([
        '2 Comfortable Double Beds',
        'Air Conditioning',
        'Free Wi-Fi',
        'Lift / Elevator Access',
        'Attached Modern Washroom',
        'Tea / Coffee Maker',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80',
          alt: 'Spacious Family Room at [naam] Hotel Vrindavan',
        },
        {
          url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
          alt: 'Family Room Beds and Seating at [naam] Vrindavan',
        },
      ]),
      featured: true,
      sortOrder: 2,
      seoTitle: 'Family Room (₹__) in Vrindavan | [naam] Near Banke Bihari Ji',
      metaDescription:
        'Stay together in our spacious 4-Guest Family Room (₹__) at [naam], just [e.g. 600 m] from Banke Bihari Temple, Vrindavan. Senior citizen friendly.',
      focusKeyword: 'Family Room in Vrindavan',
      canonicalUrl: `${domain}/rooms/family-room/`,
      featuredImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80',
      featuredImageAlt: 'Spacious Family Room at [naam] Hotel Vrindavan',
      faqs: JSON.stringify([
        {
          question: 'How many guests can stay in the Family Room?',
          answer: 'Our Family Room comfortably accommodates 4 adults with 2 double beds and extra mattress facility on request.',
        },
        {
          question: 'What is the tariff for the Family Room?',
          answer: 'The Family Room tariff is ₹__ per night. Contact us on [number] for group or multi-night discounts.',
        },
      ]),
    },
    {
      slug: 'suite-room',
      name: 'Royal Vrindavan Suite',
      pricePlaceholder: '₹__',
      priceNumeric: 0,
      capacity: 4,
      bedType: '1 King Bed + Living Lounge',
      roomSize: '[Room Size sq ft]',
      shortDescription:
        'Premium luxury suite with living area for a serene and royal stay in Vrindavan.',
      description: `<h2>Luxury Suite Stay in the Heart of Vrindavan</h2>
<p>Experience unmatched comfort during your spiritual journey in our <strong>Suite</strong> at <strong>[naam]</strong>. Featuring a plush king bed, private seating lounge, and premium bathroom fittings, it is ideal for families seeking extra comfort near Banke Bihari Temple (<strong>[e.g. 600 m]</strong>).</p>
<ul>
  <li>Tariff: <strong>Suite ₹__</strong> per night</li>
  <li>Check-in / Check-out: <strong>[time]</strong></li>
  <li>Priority temple darshan guidance &amp; VIP hospitality</li>
</ul>`,
      amenities: JSON.stringify([
        'King Bed + Sofa Lounge',
        'Split AC',
        'Mini Fridge',
        'High-Speed Wi-Fi',
        'Premium Toiletries',
        'Complimentary Welcome Drink',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
          alt: 'Luxury Suite Room at [naam] Hotel Vrindavan',
        },
        {
          url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=80',
          alt: 'Suite Living Area at [naam] Vrindavan',
        },
      ]),
      featured: true,
      sortOrder: 3,
      seoTitle: 'Luxury Suite Room (₹__) in Vrindavan | [naam] Hotel',
      metaDescription:
        'Book our premium Suite Room (₹__) at [naam], located [e.g. 600 m] from Banke Bihari Temple in Vrindavan. Separate lounge, AC, parking & direct booking discount.',
      focusKeyword: 'Suite Room in Vrindavan',
      canonicalUrl: `${domain}/rooms/suite-room/`,
      featuredImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
      featuredImageAlt: 'Luxury Suite Room at [naam] Hotel Vrindavan',
      faqs: JSON.stringify([
        {
          question: 'What is included in the Suite Room at [naam]?',
          answer: 'The Suite (₹__) includes a king bedroom, a private seating lounge, mini fridge, AC, Wi-Fi, and 24x7 room service.',
        },
      ]),
    },
  ];

  for (const room of roomsData) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: room,
    });
  }
  console.log('✅ 3 Rooms seeded (Deluxe ₹__, Family ₹__, Suite ₹__)');

  // 4. Seed Default Pages (Home page with 5 FAQs, Location Pages, Sample Blog Post, FAQ page, Group Booking)
  const homeFaqs = [
    {
      question: 'How far is [naam] from Shri Banke Bihari Temple?',
      answer: '[naam] is located at [full address], just [e.g. 600 m] from Shri Banke Bihari Temple, making it very convenient for Mangala and Shringar Aarti darshan.',
    },
    {
      question: 'What are the room tariffs at [naam]?',
      answer: 'Our room tariffs are: Deluxe ₹__, Family ₹__, and Suite ₹__. When you book directly through our website or WhatsApp ([number]), you save 10% instantly.',
    },
    {
      question: 'What is the Check-in and Check-out time?',
      answer: 'Our standard Check-in and Check-out time is [time]. Early check-in is subject to room availability.',
    },
    {
      question: 'Do you have car parking and lift facilities for senior citizens?',
      answer: 'Yes, please check our amenities list ([list]). We prioritize the comfort of families and senior citizen yatris visiting Vrindavan.',
    },
    {
      question: 'How can I confirm my room booking at [naam]?',
      answer: 'You can fill out the Booking Enquiry form on our website, or directly call / WhatsApp us at [number] or email [email] for instant confirmation.',
    },
  ];

  const pagesData = [
    {
      type: 'system',
      slug: 'home',
      title: 'Welcome to [naam] – Peaceful Family Hotel Near Banke Bihari Temple, Vrindavan',
      excerpt:
        'Experience divine Braj hospitality at [naam], located just [e.g. 600 m] from Banke Bihari Temple at [full address].',
      content: `<h2>Divine Comfort in the Heart of Shri Dham Vrindavan</h2>
<p><strong>Radhe Radhe!</strong> Welcome to <strong>[naam]</strong>, your serene home in Vrindavan. Situated at <strong>[full address]</strong>—just <strong>[e.g. 600 m]</strong> from the sacred <strong>Shri Banke Bihari Temple</strong>—our hotel is thoughtfully designed for families, devotees, and group yatris seeking spotless rooms, peaceful surroundings, and effortless temple darshan.</p>
<h3>Why Devotees Love Staying at [naam]</h3>
<ul>
  <li><strong>Prime Temple Proximity:</strong> Only [e.g. 600 m] from Banke Bihari Temple, with easy access to Prem Mandir, ISKCON Temple, and Nidhivan.</li>
  <li><strong>Transparent Direct Tariffs:</strong> Choose from <strong>Deluxe (₹__)</strong>, <strong>Family (₹__)</strong>, and <strong>Suite (₹__)</strong> rooms.</li>
  <li><strong>Modern Amenities:</strong> Enjoy [list] with check-in / check-out at [time].</li>
  <li><strong>Direct Booking Advantage:</strong> Call or WhatsApp <strong>[number]</strong> directly to save 10% with zero OTA commission fees!</li>
</ul>`,
      category: 'Main',
      seoTitle: '[naam] | Best Family Hotel in Vrindavan Near Banke Bihari Temple',
      metaDescription:
        'Stay at [naam] ([full address]), located [e.g. 600 m] from Banke Bihari Temple. Clean AC Deluxe ₹__, Family ₹__ & Suite ₹__ rooms. Call [number] & save 10%!',
      focusKeyword: 'Hotel in Vrindavan Near Banke Bihari Temple',
      canonicalUrl: `${domain}/`,
      featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      featuredImageAlt: '[naam] Hotel Exterior and Welcome Lobby in Vrindavan',
      faqs: JSON.stringify(homeFaqs),
      status: 'published',
    },
    {
      type: 'location',
      slug: 'hotel-near-banke-bihari-temple',
      title: 'Best Family Hotel Near Banke Bihari Temple, Vrindavan ([e.g. 600 m])',
      excerpt:
        'Looking for a clean, safe family hotel walking distance from Shri Banke Bihari Temple? Stay at [naam], just [e.g. 600 m] away.',
      content: `<h2>Stay Just [e.g. 600 m] from Shri Banke Bihari Ji Temple</h2>
<p>Finding a peaceful hotel with easy access to <strong>Shri Banke Bihari Temple</strong> is the top priority for every devotee visiting Vrindavan. <strong>[naam]</strong> is located at <strong>[full address]</strong>, just <strong>[e.g. 600 m]</strong> from the temple gates, allowing you and your family to attend morning Shringar Aarti and evening Shayan Aarti without long travel delays.</p>
<h3>Room Options Near Banke Bihari Temple</h3>
<table>
  <thead>
    <tr><th>Room Category</th><th>Tariff</th><th>Ideal For</th></tr>
  </thead>
  <tbody>
    <tr><td>Deluxe Room</td><td>₹__</td><td>Couples &amp; 2 Guests</td></tr>
    <tr><td>Family Room</td><td>₹__</td><td>Families up to 4 Guests</td></tr>
    <tr><td>Suite Room</td><td>₹__</td><td>Luxury Family Stay</td></tr>
  </tbody>
</table>
<p>Call or WhatsApp us at <strong>[number]</strong> to book directly and save 10%.</p>`,
      category: 'Location Guide',
      landmarkName: 'Shri Banke Bihari Temple',
      distanceFromHotel: '[e.g. 600 m]',
      seoTitle: 'Hotel Near Banke Bihari Temple Vrindavan ([e.g. 600 m]) | [naam]',
      metaDescription:
        'Book [naam], a family-friendly hotel just [e.g. 600 m] from Banke Bihari Temple in Vrindavan. Deluxe ₹__, Family ₹__, Suite ₹__. Call [number] now!',
      focusKeyword: 'Hotel near Banke Bihari Temple',
      canonicalUrl: `${domain}/hotel-near-banke-bihari-temple/`,
      featuredImage: 'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=1200&q=80',
      featuredImageAlt: 'Hotel near Banke Bihari Temple Vrindavan - [naam]',
      faqs: JSON.stringify([
        {
          question: 'What is the exact distance from [naam] to Banke Bihari Temple?',
          answer: 'The distance from [naam] ([full address]) to Banke Bihari Temple is [e.g. 600 m].',
        },
        {
          question: 'Can senior citizens easily reach Banke Bihari Temple from your hotel?',
          answer: 'Yes! Because we are just [e.g. 600 m] away, devotees can easily walk or take a 2-minute e-rickshaw right from outside our hotel.',
        },
      ]),
      status: 'published',
    },
    {
      type: 'location',
      slug: 'hotel-near-prem-mandir-vrindavan',
      title: 'Hotel Near Prem Mandir, Vrindavan – Comfortable Family Rooms at [naam]',
      excerpt:
        'Planning to witness the divine evening light show at Prem Mandir? Stay comfortably at [naam] in Vrindavan.',
      content: `<h2>Convenient Stay for Prem Mandir &amp; Chhatikara Road Darshan</h2>
<p><strong>Prem Mandir</strong> (The Temple of Divine Love), established by Jagadguru Kripalu Parishat, is famous for its white Italian marble architecture and evening musical fountain show. When you stay at <strong>[naam]</strong> (<strong>[full address]</strong>), you enjoy quick connectivity to both Prem Mandir and Banke Bihari Temple (<strong>[e.g. 600 m]</strong>).</p>
<ul>
  <li><strong>Rooms &amp; Rates:</strong> Deluxe ₹__, Family ₹__, Suite ₹__</li>
  <li><strong>Check-in / Check-out:</strong> [time]</li>
  <li><strong>Direct Booking Contact:</strong> [number] / [email]</li>
</ul>`,
      category: 'Location Guide',
      landmarkName: 'Prem Mandir Vrindavan',
      distanceFromHotel: '[Distance to Prem Mandir]',
      seoTitle: 'Hotel Near Prem Mandir Vrindavan | Family Rooms at [naam]',
      metaDescription:
        'Looking for a hotel near Prem Mandir Vrindavan? Stay at [naam] ([full address]). Clean AC rooms: Deluxe ₹__, Family ₹__, Suite ₹__. Book direct & save 10%.',
      focusKeyword: 'Hotel near Prem Mandir Vrindavan',
      canonicalUrl: `${domain}/hotel-near-prem-mandir-vrindavan/`,
      featuredImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
      featuredImageAlt: 'Hotel near Prem Mandir Vrindavan - [naam]',
      faqs: JSON.stringify([
        {
          question: 'How do we reach Prem Mandir from [naam]?',
          answer: 'E-rickshaws and autos are available right outside [naam] ([full address]) for a quick ride to Prem Mandir.',
        },
      ]),
      status: 'published',
    },
    {
      type: 'location',
      slug: 'hotel-near-iskcon-temple-vrindavan',
      title: 'Hotel Near ISKCON Temple (Krishna Balaram Mandir), Vrindavan | [naam]',
      excerpt:
        'Stay near ISKCON Vrindavan and Banke Bihari Temple at [naam]. Peaceful AC rooms for devotees and families.',
      content: `<h2>Peaceful Devotee Stay Near ISKCON Temple, Vrindavan</h2>
<p><strong>ISKCON Vrindavan (Sri Krishna Balaram Mandir)</strong> in Raman Reti attracts devotees from around the world. At <strong>[naam]</strong> (<strong>[full address]</strong>), we provide a clean, satvik, and peaceful stay near both ISKCON Temple and Banke Bihari Ji (<strong>[e.g. 600 m]</strong>).</p>
<p>Choose from our <strong>Deluxe (₹__)</strong>, <strong>Family (₹__)</strong>, or <strong>Suite (₹__)</strong> rooms and book directly via WhatsApp at <strong>[number]</strong>.</p>`,
      category: 'Location Guide',
      landmarkName: 'ISKCON Temple Vrindavan',
      distanceFromHotel: '[Distance to ISKCON]',
      seoTitle: 'Hotel Near ISKCON Temple Vrindavan | [naam] Family Stay',
      metaDescription:
        'Book your stay near ISKCON Temple & Banke Bihari Ji at [naam], Vrindavan. Deluxe ₹__, Family ₹__, Suite ₹__. Call [number] for 10% direct booking discount.',
      focusKeyword: 'Hotel near ISKCON Temple Vrindavan',
      canonicalUrl: `${domain}/hotel-near-iskcon-temple-vrindavan/`,
      featuredImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80',
      featuredImageAlt: 'Hotel near ISKCON Temple Vrindavan - [naam]',
      faqs: JSON.stringify([
        {
          question: 'Is [naam] suitable for ISKCON devotees and families?',
          answer: 'Yes! [naam] offers a pure spiritual environment with [list] and easy access to ISKCON Raman Reti and Banke Bihari Temple ([e.g. 600 m]).',
        },
      ]),
      status: 'published',
    },
    {
      type: 'blog',
      slug: 'complete-vrindavan-darshan-guide-timings-tips',
      title: 'Complete Vrindavan Temple Darshan Guide: Aarti Timings & Stay Tips',
      excerpt:
        'Planning a family pilgrimage to Vrindavan? Read our complete guide to Banke Bihari Ji, Prem Mandir, ISKCON timings, and where to stay comfortably.',
      content: `<h2>Planning Your Spiritual Yatra to Shri Dham Vrindavan</h2>
<p>Visiting Vrindavan with your family is a deeply spiritual experience. To make the most of your darshan at <strong>Shri Banke Bihari Temple</strong>, <strong>Prem Mandir</strong>, <strong>ISKCON</strong>, and <strong>Radha Vallabh Mandir</strong>, planning your stay location and temple timings in advance is essential.</p>
<h3>1. Choose a Centrally Located Hotel</h3>
<p>Staying at <strong>[naam]</strong> (<strong>[full address]</strong>), located just <strong>[e.g. 600 m]</strong> from Banke Bihari Temple, saves hours of traffic congestion. Our room options include:</p>
<ul>
  <li><strong>Deluxe Room:</strong> ₹__</li>
  <li><strong>Family Room:</strong> ₹__</li>
  <li><strong>Suite Room:</strong> ₹__</li>
</ul>
<h3>2. Essential Tips for Devotees</h3>
<ul>
  <li>Keep spectacles and phones safe inside pockets around temple premises.</li>
  <li>Arrive 30 minutes prior to Shringar or Sandhya Aarti.</li>
  <li>Book your room directly with <strong>[naam]</strong> on <strong>[number]</strong> to save 10% and get local darshan assistance.</li>
</ul>`,
      category: 'Vrindavan Darshan Guide',
      tags: JSON.stringify(['Vrindavan Guide', 'Banke Bihari Temple', 'Family Stay']),
      author: '[naam] Desk',
      seoTitle: 'Vrindavan Temple Darshan Guide & Best Stay Tips | [naam] Blog',
      metaDescription:
        'Read our complete Vrindavan Darshan Guide for families. Learn temple tips and book your stay at [naam], located [e.g. 600 m] from Banke Bihari Temple.',
      focusKeyword: 'Vrindavan Temple Darshan Guide',
      canonicalUrl: `${domain}/blog/complete-vrindavan-darshan-guide-timings-tips/`,
      featuredImage: 'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=1200&q=80',
      featuredImageAlt: 'Vrindavan Temple Darshan Guide by [naam]',
      faqs: JSON.stringify([
        {
          question: 'Which area is best to stay in Vrindavan for families?',
          answer: 'Staying near Banke Bihari Temple ([e.g. 600 m] from [naam] at [full address]) is ideal for easy access to all major temples.',
        },
        {
          question: 'How can I book a room at [naam] for my Vrindavan trip?',
          answer: 'Call or WhatsApp [number] or use our online Booking Enquiry form to reserve Deluxe (₹__), Family (₹__), or Suite (₹__) rooms.',
        },
      ]),
      status: 'published',
    },
  ];

  for (const page of pagesData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log('✅ Pages, Location Pages, 5+ FAQs, and Sample Blog Post seeded');

  // 5. Seed Sample Testimonials
  const testimonialsCount = await prisma.testimonial.count();
  if (testimonialsCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          guestName: 'Rajesh Sharma & Family',
          guestCity: 'New Delhi',
          rating: 5,
          comment:
            'Radhe Radhe! Very clean rooms and polite staff. The location near Banke Bihari Temple made darshan effortless for our elderly parents.',
          stayDate: 'Family Yatra',
        },
        {
          guestName: 'Meera Agarwal',
          guestCity: 'Jaipur',
          rating: 5,
          comment:
            'Peaceful and safe environment for families. Booking directly on WhatsApp saved us 10% and check-in was super smooth.',
          stayDate: 'Weekend Stay',
        },
        {
          guestName: 'Vikram Malhotra',
          guestCity: 'Noida',
          rating: 5,
          comment:
            'Spacious Family Room, great AC, and prompt service. Highly recommended for anyone visiting Vrindavan!',
          stayDate: 'Group Pilgrimage',
        },
      ],
    });
    console.log('✅ Guest testimonials seeded');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
