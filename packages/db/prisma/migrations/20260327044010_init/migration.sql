-- CreateEnum
CREATE TYPE "CarWashType" AS ENUM ('self_service', 'automatic', 'manual', 'detailing', 'truck');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('BUY', 'SELL', 'OPEN', 'SUPPLIER', 'FRANCHISE', 'GENERAL');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "LandStatus" AS ENUM ('OWNED', 'LEASE', 'SUBLEASE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'pending_review', 'active', 'archived');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('manual', 'import', 'synthetic');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'MODERATOR');

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "population" INTEGER,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWash" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "CarWashType" NOT NULL,
    "description" TEXT,
    "shortDesc" TEXT,
    "cityId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "district" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT,
    "priceFrom" INTEGER,
    "priceTo" INTEGER,
    "posts" INTEGER,
    "isOpen24h" BOOLEAN NOT NULL DEFAULT false,
    "workingHours" TEXT,
    "services" TEXT[],
    "photos" TEXT[],
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'pending_review',
    "source" "DataSource" NOT NULL DEFAULT 'manual',
    "sourceUrl" TEXT,
    "importedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarWash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "carwashId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "source" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "city" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "photos" TEXT[],
    "services" TEXT[],
    "productTypes" TEXT[],
    "priceRange" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'pending_review',
    "source" "DataSource" NOT NULL DEFAULT 'manual',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Franchise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "investmentFrom" INTEGER,
    "investmentTo" INTEGER,
    "royalty" DOUBLE PRECISION,
    "lumpSum" INTEGER,
    "paybackMonths" INTEGER,
    "postsCount" TEXT,
    "supportLevel" TEXT,
    "logoUrl" TEXT,
    "photos" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'pending_review',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "description" TEXT,
    "carwashType" "CarWashType" NOT NULL,
    "cityId" TEXT NOT NULL,
    "address" TEXT,
    "price" INTEGER,
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "revenue" INTEGER,
    "profit" INTEGER,
    "posts" INTEGER,
    "landStatus" "LandStatus",
    "equipmentAge" INTEGER,
    "photos" TEXT[],
    "contactName" TEXT,
    "contactPhone" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'pending_review',
    "source" "DataSource" NOT NULL DEFAULT 'manual',
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "leadType" "LeadType" NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "message" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "landingPage" TEXT,
    "pageType" TEXT,
    "city" TEXT,
    "cityId" TEXT,
    "category" TEXT,
    "device" TEXT,
    "referrer" TEXT,
    "carwashId" TEXT,
    "supplierId" TEXT,
    "franchiseId" TEXT,
    "listingId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT,
    "leadType" "LeadType",
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "carwashType" "CarWashType" NOT NULL,
    "city" TEXT,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "year" INTEGER NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_slug_idx" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_isActive_idx" ON "City"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CarWash_slug_key" ON "CarWash"("slug");

-- CreateIndex
CREATE INDEX "CarWash_cityId_type_status_idx" ON "CarWash"("cityId", "type", "status");

-- CreateIndex
CREATE INDEX "CarWash_slug_idx" ON "CarWash"("slug");

-- CreateIndex
CREATE INDEX "CarWash_featured_status_idx" ON "CarWash"("featured", "status");

-- CreateIndex
CREATE INDEX "CarWash_views_idx" ON "CarWash"("views");

-- CreateIndex
CREATE INDEX "Review_carwashId_idx" ON "Review"("carwashId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_slug_key" ON "Supplier"("slug");

-- CreateIndex
CREATE INDEX "Supplier_category_status_idx" ON "Supplier"("category", "status");

-- CreateIndex
CREATE INDEX "Supplier_slug_idx" ON "Supplier"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_slug_key" ON "Franchise"("slug");

-- CreateIndex
CREATE INDEX "Franchise_status_idx" ON "Franchise"("status");

-- CreateIndex
CREATE INDEX "Franchise_slug_idx" ON "Franchise"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessListing_slug_key" ON "BusinessListing"("slug");

-- CreateIndex
CREATE INDEX "BusinessListing_cityId_listingType_status_idx" ON "BusinessListing"("cityId", "listingType", "status");

-- CreateIndex
CREATE INDEX "BusinessListing_slug_idx" ON "BusinessListing"("slug");

-- CreateIndex
CREATE INDEX "Lead_leadType_createdAt_idx" ON "Lead"("leadType", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_cityId_idx" ON "Lead"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "Guide_category_status_idx" ON "Guide"("category", "status");

-- CreateIndex
CREATE INDEX "Guide_slug_idx" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "FaqItem_category_status_idx" ON "FaqItem"("category", "status");

-- CreateIndex
CREATE INDEX "Benchmark_carwashType_city_idx" ON "Benchmark"("carwashType", "city");

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_carwashType_city_metric_year_key" ON "Benchmark"("carwashType", "city", "metric", "year");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_key_key" ON "SiteSettings"("key");

-- AddForeignKey
ALTER TABLE "CarWash" ADD CONSTRAINT "CarWash_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_carwashId_fkey" FOREIGN KEY ("carwashId") REFERENCES "CarWash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessListing" ADD CONSTRAINT "BusinessListing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_carwashId_fkey" FOREIGN KEY ("carwashId") REFERENCES "CarWash"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "BusinessListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
