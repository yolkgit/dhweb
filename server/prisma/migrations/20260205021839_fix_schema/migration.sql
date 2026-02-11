-- CreateTable
CREATE TABLE "CompanyInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "name" TEXT NOT NULL,
    "englishName" TEXT,
    "ceo" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "bizNum" TEXT,
    "headerTitle" TEXT,
    "headerSubtitle" TEXT,
    "footerDesc" TEXT,
    "slogan" TEXT,
    "vision" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "playlistId" TEXT
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "specs" TEXT,
    "specTable" TEXT,
    "imageUrl" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isEco" BOOLEAN NOT NULL DEFAULT false,
    "specUrl" TEXT,
    "msdsUrl" TEXT,
    "certificationMarkIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CertificationMark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "poster" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "fadeOutDuration" REAL NOT NULL DEFAULT 0,
    "duration" REAL NOT NULL DEFAULT 6
);

-- CreateTable
CREATE TABLE "LabEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "youtubeApiKey" TEXT
);

-- CreateTable
CREATE TABLE "DesignSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "fontFamily" TEXT NOT NULL DEFAULT 'Noto Sans KR',
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "headerFontFamily" TEXT NOT NULL DEFAULT 'Noto Sans KR',
    "headerTitleSize" TEXT NOT NULL DEFAULT 'medium'
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LogoSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "useCustomLabel" BOOLEAN NOT NULL DEFAULT false,
    "defaultUrl" TEXT,
    "whiteUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_key_key" ON "Playlist"("key");
