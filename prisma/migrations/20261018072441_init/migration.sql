-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Hotel Owner',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hotelName" TEXT NOT NULL DEFAULT '[Hotel Naam]',
    "tagline" TEXT NOT NULL DEFAULT 'A Divine & Peaceful Stay Near Banke Bihari Temple, Vrindavan',
    "brandColor" TEXT NOT NULL DEFAULT '#c2410c',
    "domain" TEXT NOT NULL DEFAULT 'https://vrindavanhotel.com',
    "phone" TEXT NOT NULL DEFAULT '[Phone Number]',
    "whatsapp" TEXT NOT NULL DEFAULT '[WhatsApp Number]',
    "email" TEXT NOT NULL DEFAULT '[Email Address]',
    "address" TEXT NOT NULL DEFAULT '[Full Address, Vrindavan, Mathura, UP 281121]',
    "distanceFromBankeBihari" TEXT NOT NULL DEFAULT '[e.g. 600 m]',
    "checkInTime" TEXT NOT NULL DEFAULT '[12:00 PM]',
    "checkOutTime" TEXT NOT NULL DEFAULT '[11:00 AM]',
    "priceRange" TEXT NOT NULL DEFAULT '₹[Deluxe Price] - ₹[Suite Price]',
    "amenitiesList" TEXT NOT NULL DEFAULT '["Free High-Speed Wi-Fi","AC Rooms","24x7 Hot & Cold Water","Pure Satvik Veg Food","Parking Available","Temple Darshan Assistance","Lift / Elevator","Power Backup"]',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3538.8!2d77.69!3d27.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVrindavan!5e0!3m2!1sen!2sin!4v1700000000000',
    "geoLatitude" TEXT NOT NULL DEFAULT '27.5806',
    "geoLongitude" TEXT NOT NULL DEFAULT '77.6913',
    "googleBusinessUrl" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "googleAnalyticsId" TEXT NOT NULL DEFAULT '',
    "searchConsoleCode" TEXT NOT NULL DEFAULT '',
    "indexNowApiKey" TEXT NOT NULL DEFAULT 'vrindavan-hotel-indexnow-key-2026',
    "defaultMetaTitle" TEXT NOT NULL DEFAULT '[Hotel Naam] - Best Family Hotel Near Banke Bihari Temple, Vrindavan',
    "defaultMetaDescription" TEXT NOT NULL DEFAULT 'Book direct and save 10% at [Hotel Naam], located just [e.g. 600 m] from Banke Bihari Temple in Vrindavan. Clean AC rooms, family suites, parking & satvik food.',
    "defaultOgImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    "robotsTxtCustom" TEXT NOT NULL DEFAULT '',
    "promoBannerText" TEXT NOT NULL DEFAULT 'Book Direct on Website / WhatsApp & Save 10% Instantly!',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'page',
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "author" TEXT NOT NULL DEFAULT 'Hotel Team',
    "seoTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "focusKeyword" TEXT NOT NULL DEFAULT '',
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "canonicalOverride" BOOLEAN NOT NULL DEFAULT false,
    "featuredImage" TEXT NOT NULL DEFAULT '',
    "featuredImageAlt" TEXT NOT NULL DEFAULT '',
    "ogTitle" TEXT NOT NULL DEFAULT '',
    "ogDescription" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "isIndexed" BOOLEAN NOT NULL DEFAULT true,
    "faqs" TEXT NOT NULL DEFAULT '[]',
    "landmarkName" TEXT NOT NULL DEFAULT '',
    "distanceFromHotel" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'published',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricePlaceholder" TEXT NOT NULL DEFAULT '₹__',
    "priceNumeric" INTEGER NOT NULL DEFAULT 0,
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "bedType" TEXT NOT NULL DEFAULT '1 King Bed',
    "roomSize" TEXT NOT NULL DEFAULT '280 sq ft',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "focusKeyword" TEXT NOT NULL DEFAULT '',
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "canonicalOverride" BOOLEAN NOT NULL DEFAULT false,
    "featuredImage" TEXT NOT NULL DEFAULT '',
    "featuredImageAlt" TEXT NOT NULL DEFAULT '',
    "ogTitle" TEXT NOT NULL DEFAULT '',
    "ogDescription" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "isIndexed" BOOLEAN NOT NULL DEFAULT true,
    "faqs" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "checkIn" TEXT NOT NULL,
    "checkOut" TEXT NOT NULL,
    "guests" TEXT NOT NULL DEFAULT '2 Adults',
    "roomType" TEXT NOT NULL DEFAULT 'Deluxe Room',
    "enquiryType" TEXT NOT NULL DEFAULT 'Room Booking',
    "message" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'New',
    "notes" TEXT NOT NULL DEFAULT '',
    "sourcePage" TEXT NOT NULL DEFAULT '/',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL DEFAULT '',
    "mimeType" TEXT NOT NULL DEFAULT 'image/webp',
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" SERIAL NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "isAuto" BOOLEAN NOT NULL DEFAULT false,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestCity" TEXT NOT NULL DEFAULT 'Delhi',
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "stayDate" TEXT NOT NULL DEFAULT 'Recent Stay',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");
