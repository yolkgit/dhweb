import nodemailer from 'nodemailer';
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from '@prisma/client';
import geoip from 'geoip-lite';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3004;
const DATA_FILE = path.join(__dirname, "database.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" })); // Reduced limit after removing bulk updates
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, "../dist"))); // Serve Frontend Build

// Ensure uploads directory and database file exist
async function init() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "{}", "utf-8");
  }
}
init();

// Storage config for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// --- API Endpoints ---

// Get All Content
app.get('/api/content', async (req, res) => {
  try {
     const [
         appSettings, 
         companyInfo, 
         categories, 
         products, 
         certifications, 
         heroSlides,
         designSettings,
         certificationMarks,
         labEquipment,
         faqs,
         logoSettings,
         branches,
         calculatorSettings
     ] = await Promise.all([
         prisma.appSettings.findFirst(),
         prisma.companyInfo.findFirst(),
         prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
         prisma.product.findMany({ orderBy: { sortOrder: 'asc' } }),
         prisma.certification.findMany({ orderBy: { sortOrder: 'asc' } }),
         prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
         prisma.designSettings.findFirst(),
         prisma.certificationMark.findMany(),
         prisma.labEquipment.findMany({ orderBy: { sortOrder: 'asc' } }),
         prisma.faq.findMany(),
         prisma.logoSettings.findFirst(),
         prisma.branch.findMany({ orderBy: { sortOrder: 'asc' } }),
         prisma.calculatorSettings.findFirst()
     ]);

     // Reconstruct playlists map from categories
    const playlistMap = {};
    categories.forEach(c => {
      if (c.playlistId) playlistMap[c.id] = c.playlistId;
    });

    // Map categories to include representativeProductId for frontend
    const mappedCategories = categories.map(c => ({
      id: c.id,
      label: c.label,
      representativeProductId: c.representativeProductId || null,
      slideImages: c.slideImages ? JSON.parse(c.slideImages) : []
    }));

     // Process Products to parse JSON fields
     const processedProducts = products.map(p => ({
         ...p,
         category: p.categoryId, // Map primitive Prisma field to legacy frontend field
         features: JSON.parse(p.features || '[]'),
         specs: p.specs ? JSON.parse(p.specs) : {},
         specTable: p.specTable ? JSON.parse(p.specTable) : null,
         certificationMarkIds: p.certificationMarkIds ? JSON.parse(p.certificationMarkIds) : [],
     }));

     // Process CompanyInfo vision
     const processedCompanyInfo = companyInfo ? {
         ...companyInfo,
         vision: JSON.parse(companyInfo.vision || '[]')
     } : {};

     // Strip the admin password from the public payload; parse JSON fields for the frontend.
     const safeAppSettings = appSettings ? (() => {
         const { adminPassword, navItems, glossary, ...rest } = appSettings;
         return {
             ...rest,
             navItems: navItems ? JSON.parse(navItems) : null,
             glossary: glossary ? JSON.parse(glossary) : null
         };
     })() : {};

     res.json({
         appSettings: safeAppSettings,
         companyInfo: processedCompanyInfo || {},
         categories: mappedCategories || [],
         products: processedProducts || [],
         certifications: certifications || [],
         heroSlides: heroSlides || [],
         playlists: playlistMap || {},
         designSettings: designSettings || {},
         certificationMarks: certificationMarks || [],
         labEquipment: labEquipment || [],
         faqs: faqs || [],
         logoSettings: logoSettings || {},
         branches: branches || [],
         calculatorSettings: calculatorSettings || {}
     });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Category & Playlist Management ---
app.post('/api/categories', async (req, res) => {
    try {
        const cat = req.body;
        // If it's an array (legacy bulk update), handle it gracefully
        if (Array.isArray(cat)) {
            for (const c of cat) {
                await prisma.category.upsert({
                    where: { id: c.id },
                    update: { label: c.label, representativeProductId: c.representativeProductId || null, sortOrder: c.sortOrder ?? 0, slideImages: c.slideImages ? JSON.stringify(c.slideImages) : null },
                    create: { id: c.id, label: c.label, representativeProductId: c.representativeProductId || null, sortOrder: c.sortOrder ?? 0, slideImages: c.slideImages ? JSON.stringify(c.slideImages) : null }
                });
            }
            return res.json({ success: true });
        }
        
        // Auto-assign sortOrder to be at the end
        const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });
        const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;
        
        const result = await prisma.category.create({
             data: { id: cat.id, label: cat.label, representativeProductId: cat.representativeProductId || null, sortOrder: cat.sortOrder ?? nextOrder, slideImages: cat.slideImages ? JSON.stringify(cat.slideImages) : null }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

// --- Category Reorder (must be before :id route) ---
app.put('/api/categories/reorder', async (req, res) => {
    try {
        const orderedIds = req.body; // Array of category IDs in new order
        await prisma.$transaction(
            orderedIds.map((id, index) =>
                prisma.category.update({
                    where: { id },
                    data: { sortOrder: index }
                })
            )
        );
        res.json({ success: true });
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const cat = req.body;
        const updateData = { label: cat.label, representativeProductId: cat.representativeProductId || null };
        if (cat.sortOrder !== undefined) updateData.sortOrder = cat.sortOrder;
        if (cat.slideImages !== undefined) updateData.slideImages = cat.slideImages ? JSON.stringify(cat.slideImages) : null;
        const result = await prisma.category.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

app.post('/api/playlists', async (req, res) => {
    try {
        const playlists = req.body; // { CAT_ID: PLAYLIST_ID }
        for (const [catId, playlistId] of Object.entries(playlists)) {
            await prisma.category.update({
                where: { id: catId },
                data: { playlistId }
            });
        }
        res.json({ success: true });
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});


// --- Product Management ---
app.post('/api/products', async (req, res) => {
    try {
        const prod = req.body;
        // Auto-assign sortOrder to be at the end within this category
        const maxOrder = await prisma.product.aggregate({
            where: { categoryId: prod.category },
            _max: { sortOrder: true }
        });
        const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;
        
        const result = await prisma.product.create({
            data: {
                id: prod.id,
                name: prod.name,
                categoryId: prod.category,
                description: prod.description,
                features: JSON.stringify(prod.features),
                specs: JSON.stringify(prod.specs || {}),
                specTable: prod.specTable ? JSON.stringify(prod.specTable) : null,
                imageUrl: prod.imageUrl,
                isNew: prod.isNew,
                isEco: prod.isEco,
                specUrl: prod.specUrl,
                msdsUrl: prod.msdsUrl,
                certificationMarkIds: JSON.stringify(prod.certificationMarkIds || []),
                constructionImageUrl: prod.constructionImageUrl || null,
                sortOrder: prod.sortOrder ?? nextOrder
            }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

// --- Product Reorder (must be before :id route) ---
app.put('/api/products/reorder', async (req, res) => {
    try {
        const orderedIds = req.body; // Array of product IDs in new order
        await prisma.$transaction(
            orderedIds.map((id, index) =>
                prisma.product.update({
                    where: { id },
                    data: { sortOrder: index }
                })
            )
        );
        res.json({ success: true });
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const prod = req.body;
        const updateData = {
            name: prod.name,
            categoryId: prod.category,
            description: prod.description,
            features: JSON.stringify(prod.features),
            specs: JSON.stringify(prod.specs || {}),
            specTable: prod.specTable ? JSON.stringify(prod.specTable) : null,
            imageUrl: prod.imageUrl,
            isNew: prod.isNew,
            isEco: prod.isEco,
            specUrl: prod.specUrl,
            msdsUrl: prod.msdsUrl,
            certificationMarkIds: JSON.stringify(prod.certificationMarkIds || []),
            constructionImageUrl: prod.constructionImageUrl || null
        };
        if (prod.sortOrder !== undefined) updateData.sortOrder = prod.sortOrder;
        const result = await prisma.product.update({
            where: { id },
            data: updateData
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});


// --- Hero Slides Management ---
app.post('/api/hero-slides', async (req, res) => {
    try {
        const slide = req.body;
        // The frontend might be sending the whole list of slides for reordering
        // Or specific create/update.
        // It seems the frontend sends singular updates based on usage in Admin.tsx
        // Actually, previous implementation relied on 'saveDB' of everything.
        // We need to support the operations used in Admin.tsx.
        // Admin.tsx calls: POST /api/hero-slides (Create), PUT (Update), DELETE.
        
        // Wait, Admin.tsx in previous steps wasn't fully refactored to specific endpoints call for everything yet?
        // Let's check ContentContext.tsx.
        // ContentContext generally fetched all and updated all.
        // If we want detailed management, we need to ensure endpoints exist.
        
        // Assuming we update ContentContext later or it already uses specific endpoints.
        // Let's implement CREATE/UPDATE/DELETE.
        
        const result = await prisma.heroSlide.create({
            data: {
                 id: slide.id,
                 type: slide.type,
                 src: slide.src,
                 poster: slide.poster,
                 title: slide.title,
                 subtitle: slide.subtitle,
                 desc: slide.desc,
                 order: slide.order || 0,
                 fadeOutDuration: slide.fadeOutDuration || 0,
                 duration: slide.duration || 6
            }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.put('/api/hero-slides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const slide = req.body;
        const result = await prisma.heroSlide.update({
            where: { id },
             data: {
                 type: slide.type,
                 src: slide.src,
                 poster: slide.poster,
                 title: slide.title,
                 subtitle: slide.subtitle,
                 desc: slide.desc,
                 order: slide.order,
                 fadeOutDuration: slide.fadeOutDuration,
                 duration: slide.duration
            }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.delete('/api/hero-slides/:id', async (req, res) => {
    try {
        await prisma.heroSlide.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

// --- Certifications ---
app.post('/api/certifications', async (req, res) => { 
    try {
        const cert = req.body;
        const result = await prisma.certification.create({
             data: {
                 id: cert.id,
                 title: cert.title,
                 issuer: cert.issuer,
                 type: cert.type,
                 pdfUrl: cert.pdfUrl
             }
        });
        res.json(result);
    } catch(e) { res.status(500).json({error: "Failed"}); }
});
// Reorder Certifications (must be before :id route)
app.put('/api/certifications/reorder', async (req, res) => {
    try {
        const ids = req.body;
        await prisma.$transaction(
            ids.map((id, index) =>
                prisma.certification.update({ where: { id }, data: { sortOrder: index } })
            )
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reorder certifications" });
    }
});
app.put('/api/certifications/:id', async (req, res) => {
    try {
        const cert = req.body;
        const result = await prisma.certification.update({
             where: { id: req.params.id },
             data: {
                 title: cert.title,
                 issuer: cert.issuer,
                 type: cert.type,
                 pdfUrl: cert.pdfUrl
             }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});
app.delete('/api/certifications/:id', async (req, res) => {
    try {
        await prisma.certification.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

// --- Certification Marks ---
app.post('/api/certification-marks', async (req, res) => {
     try {
         const mark = req.body;
         const result = await prisma.certificationMark.create({
             data: { id: mark.id, name: mark.name, imageUrl: mark.imageUrl }
         });
         res.json(result);
     } catch(e) { res.status(500).json({error: "Failed"}); }
});
app.put('/api/certification-marks/:id', async (req, res) => {
    try {
        const mark = req.body;
        const result = await prisma.certificationMark.update({
             where: { id: req.params.id },
             data: { name: mark.name, imageUrl: mark.imageUrl }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});
app.delete('/api/certification-marks/:id', async (req, res) => {
    try {
        await prisma.certificationMark.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

// --- Lab Equipment ---
app.post('/api/lab-equipment', async (req, res) => {
    try {
        const eq = req.body;
        const result = await prisma.labEquipment.create({
            data: { id: eq.id, title: eq.title, desc: eq.desc, iconName: eq.iconName, imageUrl: eq.imageUrl }
        });
        res.json(result);
    } catch(e) { res.status(500).json({error: "Failed"}); }
});
app.put('/api/lab-equipment/:id', async (req, res) => {
    try {
        const eq = req.body;
        const result = await prisma.labEquipment.update({
             where: { id: req.params.id },
             data: { title: eq.title, desc: eq.desc, iconName: eq.iconName, imageUrl: eq.imageUrl }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});
app.delete('/api/lab-equipment/:id', async (req, res) => {
    try {
        await prisma.labEquipment.delete({ where: { id: req.params.id } });
         res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

// --- Branches ---
app.post('/api/branches', async (req, res) => {
    try {
        const b = req.body;
        const result = await prisma.branch.create({
            data: { id: b.id, name: b.name, address: b.address, phone: b.phone }
        });
        res.json(result);
    } catch(e) { res.status(500).json({error: "Failed"}); }
});
// Reorder Branches (must be before :id route)
app.put('/api/branches/reorder', async (req, res) => {
    try {
        const ids = req.body;
        await prisma.$transaction(
            ids.map((id, index) =>
                prisma.branch.update({ where: { id }, data: { sortOrder: index } })
            )
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reorder branches" });
    }
});
app.put('/api/branches/:id', async (req, res) => {
    try {
        const b = req.body;
        const result = await prisma.branch.update({
             where: { id: req.params.id },
             data: { name: b.name, address: b.address, phone: b.phone }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});
app.delete('/api/branches/:id', async (req, res) => {
    try {
        await prisma.branch.delete({ where: { id: req.params.id } });
         res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

// --- FAQs ---
app.post('/api/faqs', async (req, res) => {
    try {
        const f = req.body;
        const result = await prisma.faq.create({
            data: { question: f.question, answer: f.answer, category: f.category }
        });
        res.json(result);
    } catch(e) { res.status(500).json({error: "Failed"}); }
});
app.put('/api/faqs/:id', async (req, res) => {
    try {
        const f = req.body;
        const result = await prisma.faq.update({
             where: { id: parseInt(req.params.id, 10) },
             data: { question: f.question, answer: f.answer, category: f.category }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});
app.delete('/api/faqs/:id', async (req, res) => {
    try {
        await prisma.faq.delete({ where: { id: parseInt(req.params.id, 10) } });
         res.json({ success: true });
    } catch(e) { res.status(500).json({error: "Failed"}); }
});

// Update Company Info
app.post('/api/company-info', async (req, res) => {
    try {
        const data = req.body;
        const updated = await prisma.companyInfo.upsert({
            where: { id: 1 },
            update: {
                ...data,
                vision: JSON.stringify(data.vision)
            },
            create: {
                ...data,
                vision: JSON.stringify(data.vision || [])
            }
        });
        res.json(updated);
    } catch (error) {
        console.error("Update company info error:", error);
        res.status(500).json({ error: "Failed to update" });
    }
});

// Update App Settings (YouTube Key)
app.post('/api/app-settings', async (req, res) => {
    try {
        const { youtubeApiKey, smtpHost, smtpPort, smtpUser, smtpPass } = req.body;
        const updated = await prisma.appSettings.upsert({
            where: { id: 1 },
            update: { youtubeApiKey, smtpHost, smtpPort, smtpUser, smtpPass },
            create: { youtubeApiKey, smtpHost, smtpPort, smtpUser, smtpPass }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// --- Admin Password Auth ---
// Verify admin password (server-side; never exposed via /api/content).
app.post('/api/admin/verify', async (req, res) => {
    try {
        const { password } = req.body;
        const settings = await prisma.appSettings.findFirst();
        const stored = (settings && settings.adminPassword) ? settings.adminPassword : '0000';
        res.json({ ok: String(password) === String(stored) });
    } catch (error) {
        console.error("Admin verify error:", error);
        res.status(500).json({ error: "Failed to verify" });
    }
});

// Change admin password (requires current password).
app.post('/api/admin/change-password', async (req, res) => {
    try {
        const { current, next } = req.body;
        const settings = await prisma.appSettings.findFirst();
        const stored = (settings && settings.adminPassword) ? settings.adminPassword : '0000';
        if (String(current) !== String(stored)) {
            return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
        }
        if (!next || String(next).length < 4) {
            return res.status(400).json({ error: '새 비밀번호는 4자리 이상이어야 합니다.' });
        }
        await prisma.appSettings.upsert({
            where: { id: 1 },
            update: { adminPassword: String(next) },
            create: { id: 1, adminPassword: String(next) }
        });
        res.json({ ok: true });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

// Update Design Settings
app.post('/api/design-settings', async (req, res) => {
    try {
        const data = req.body;
        const updated = await prisma.designSettings.upsert({
            where: { id: 1 },
            update: data,
            create: data
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update design settings" });
    }
});

// --- Legacy Compatibility & Bulk Update Endpoints ---
// The frontend uses /api/data/:key for syncing entire arrays or objects.
app.post("/api/data/:key", async (req, res) => {
  const { key } = req.params;
  const data = req.body;

  try {
    if (key === 'companyInfo') {
        const updated = await prisma.companyInfo.upsert({
            where: { id: 1 },
            update: { ...data, vision: JSON.stringify(data.vision || []) },
            create: { ...data, vision: JSON.stringify(data.vision || []) }
        });
        return res.json(updated);
    }
    
    if (key === 'appSettings') {
        const { youtubeApiKey, smtpHost, smtpPort, smtpUser, smtpPass, navItems, glossary } = data;
        // undefined => don't touch; array => store as JSON string.
        const navItemsStr = navItems !== undefined ? JSON.stringify(navItems) : undefined;
        const glossaryStr = glossary !== undefined ? JSON.stringify(glossary) : undefined;
        const updated = await prisma.appSettings.upsert({
            where: { id: 1 },
            update: { youtubeApiKey, smtpHost, smtpPort, smtpUser, smtpPass, navItems: navItemsStr, glossary: glossaryStr },
            create: { youtubeApiKey, smtpHost, smtpPort, smtpUser, smtpPass, navItems: navItemsStr, glossary: glossaryStr }
        });
        return res.json({ success: true });
    }

    if (key === 'designSettings') {
         const updated = await prisma.designSettings.upsert({
            where: { id: 1 },
            update: data,
            create: data
        });
        return res.json(updated);
    }

    if (key === 'logoSettings') {
        const updated = await prisma.logoSettings.upsert({
            where: { id: 1 },
            update: data,
            create: data
        });
        return res.json(updated);
    }

    if (key === 'calculatorSettings') {
        const { id, ...updateData } = data;
        const updated = await prisma.calculatorSettings.upsert({
            where: { id: 1 },
            update: updateData,
            create: {
                id: 1,
                ...updateData
            }
        });
        return res.json(updated);
    }

    if (key === 'branches') {
        await prisma.$transaction(async (tx) => {
            for (const item of data) {
                await tx.branch.upsert({
                    where: { id: item.id },
                    update: { name: item.name, address: item.address, phone: item.phone },
                    create: { id: item.id, name: item.name, address: item.address, phone: item.phone }
                });
            }
            const newIds = data.map(d => d.id);
            await tx.branch.deleteMany({
                where: { id: { notIn: newIds } }
            });
        });
        return res.json({ success: true });
    }

    // For Arrays: We perform a full sync (Delete all + Create all) OR Upsert loops.
    // Syncing is safer for reordering (Hero Slides) and Deletions.
    // SQLite transaction is fast enough for these small datasets.

    if (key === 'categories') {
        // IDs are strings provided by user/frontend (ASPHALT, etc)
        // If we want to handle deletions, we must delete those not in new list.
        await prisma.$transaction(async (tx) => {
             // 1. Get all existing IDs
            //  const existing = await tx.category.findMany({ select: { id: true } });
             // 2. Upsert all from request (preserve sortOrder from array index)
             let orderCounter = 0;
             for (const item of data) {
                 await tx.category.upsert({
                     where: { id: item.id },
                     update: { label: item.label, representativeProductId: item.representativeProductId || null, sortOrder: item.sortOrder ?? orderCounter, slideImages: item.slideImages ? JSON.stringify(item.slideImages) : null },
                     create: { id: item.id, label: item.label, representativeProductId: item.representativeProductId || null, sortOrder: item.sortOrder ?? orderCounter, slideImages: item.slideImages ? JSON.stringify(item.slideImages) : null }
                 });
                 orderCounter++;
             }
             // 3. Delete those not in request? 
             // Frontend usually sends the whole list.
             // Let's safe delete: Delete where ID not in new list IDs.
             const newIds = data.map(d => d.id);
             await tx.category.deleteMany({
                 where: { id: { notIn: newIds } }
             });
        });
        return res.json({ success: true });
    }

    if (key === 'products') {
        await prisma.$transaction(async (tx) => {
            let orderCounter = 0;
            for (const item of data) {
                const productData = {
                    id: item.id,
                    name: item.name,
                    categoryId: item.category, // Map 'category' -> 'categoryId'
                    description: item.description,
                    features: JSON.stringify(item.features || []),
                    specs: JSON.stringify(item.specs || {}),
                    specTable: item.specTable ? JSON.stringify(item.specTable) : null,
                    imageUrl: item.imageUrl,
                    isNew: item.isNew || false,
                    isEco: item.isEco || false,
                    specUrl: item.specUrl,
                    msdsUrl: item.msdsUrl,
                    certificationMarkIds: JSON.stringify(item.certificationMarkIds || []),
                    constructionImageUrl: item.constructionImageUrl || null,
                    sortOrder: item.sortOrder ?? orderCounter
                };
                orderCounter++;
                
                await tx.product.upsert({
                   where: { id: item.id },
                   update: productData,
                   create: productData
                });
            }
            const newIds = data.map(d => d.id);
            await tx.product.deleteMany({ where: { id: { notIn: newIds } } });
        });
        return res.json({ success: true });
    }

    if (key === 'heroSlides') {
        await prisma.$transaction(async (tx) => {
            // Re-ordering is handled by frontend sending array in order.
            // We should save the order index.
            let orderCounter = 0;
            for (const item of data) {
                 const slideData = {
                     id: item.id,
                     type: item.type || 'image',
                     src: item.src,
                     poster: item.poster,
                     title: item.title,
                     subtitle: item.subtitle,
                     desc: item.desc,
                     order: orderCounter++, // Enforce order based on array index
                     fadeOutDuration: item.fadeOutDuration || 0,
                     duration: item.duration || 6
                 };
                 await tx.heroSlide.upsert({
                     where: { id: item.id },
                     update: slideData,
                     create: slideData
                 });
            }
            const newIds = data.map(d => d.id);
            await tx.heroSlide.deleteMany({ where: { id: { notIn: newIds } } });
        });
        return res.json({ success: true });
    }

    if (key === 'playlists') {
        // Object: { CAT_ID: PLAYLIST_ID }
        await prisma.$transaction(async (tx) => {
             for (const [catId, playlistId] of Object.entries(data)) {
                 // Check if category exists first? It should.
                 await tx.category.update({
                     where: { id: catId },
                     data: { playlistId: playlistId }
                 });
             }
        });
        return res.json({ success: true });
    }

    if (key === 'certifications') {
        await prisma.$transaction(async (tx) => {
            for (const item of data) {
                const certData = {
                    id: item.id,
                    title: item.title,
                    issuer: item.issuer,
                    type: item.type,
                    pdfUrl: item.pdfUrl
                };
                await tx.certification.upsert({
                    where: { id: item.id },
                    update: certData,
                    create: certData
                });
            }
            const newIds = data.map(d => d.id);
            await tx.certification.deleteMany({ where: { id: { notIn: newIds } } });
        });
        return res.json({ success: true });
    }
    
    if (key === 'certificationMarks') {
         await prisma.$transaction(async (tx) => {
            for (const item of data) {
                const markData = { id: item.id, name: item.name, imageUrl: item.imageUrl };
                await tx.certificationMark.upsert({
                    where: { id: item.id },
                    update: markData,
                    create: markData
                });
            }
            const newIds = data.map(d => d.id);
            await tx.certificationMark.deleteMany({ where: { id: { notIn: newIds } } });
        });
        return res.json({ success: true });
    }
    
    if (key === 'labEquipment') {
         await prisma.$transaction(async (tx) => {
            for (const item of data) {
                const eqData = { 
                    id: item.id, 
                    title: item.title, 
                    desc: item.desc, 
                    iconName: item.iconName, // Should match what Frontend sends
                    imageUrl: item.imageUrl 
                };
                await tx.labEquipment.upsert({
                    where: { id: item.id },
                    update: eqData,
                    create: eqData
                });
            }
            const newIds = data.map(d => d.id);
            await tx.labEquipment.deleteMany({ where: { id: { notIn: newIds } } });
        });
        return res.json({ success: true });
    }
    
    if (key === 'faqs') {
         await prisma.$transaction(async (tx) => {
             // FAQs from frontend might not have IDs if they are new or just array index based?
             // ContentContext initializes FAQS as array of { question, answer }.
             // If frontend adds ID, great. If not, we might need to clear and recreate all?
             // Let's assume existing behavior re: IDs.
             // Checking constants.ts... no IDs in FAQS.
             // If no IDs, we must Delete All and Recreate All.
             
             await tx.faq.deleteMany({});
             let order = 0;
             for (const item of data) {
                 await tx.faq.create({
                     data: {
                         question: item.question,
                         answer: item.answer,
                         category: item.category // Optional
                     }
                 });
             }
        });
        return res.json({ success: true });
    }

    res.status(400).json({ error: "Unknown data key" });

  } catch (err) {
    console.error(`Error updating ${key}:`, err);
    res.status(500).json({ error: "Failed to update data" });
  }
});

// Upload file
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the URL to access the file
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// List uploaded files
app.get("/api/uploads", async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    // Filter for files only (skip directories if any, though fs.readdir returns names)
    // Map to full URL
    const fileUrls = files.map(file => `/uploads/${file}`);
    // Sort by newest first? (Ideally we'd stat them, but name contains timestamp)
    // Filename format: timestamp-random.ext
    // So reverse sorting by name provides roughly newest first
    fileUrls.sort().reverse();
    
    res.json(fileUrls);
  } catch (error) {
    console.error("Failed to list uploads:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

// --- Access Analytics (self-hosted page-view tracking) ---

// Extract the real client IP (behind nginx reverse proxy which sets X-Forwarded-For).
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || '';
}

// Reduce a referrer URL to a host, categorizing internal/direct traffic.
function normalizeReferrer(referrer, ownHost) {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (ownHost && host && ownHost.replace(/^www\./, '').endsWith(host)) return 'internal';
    return host || 'direct';
  } catch {
    return 'direct';
  }
}

// Record a page view. Fire-and-forget from the client.
app.post('/api/track', async (req, res) => {
  try {
    let { path: p, referrer } = req.body || {};
    if (!p || typeof p !== 'string') return res.json({ ok: false });
    // Never track the admin area itself.
    if (p.startsWith('/admin')) return res.json({ ok: true, skipped: true });
    p = p.slice(0, 512);

    const ip = getClientIp(req);
    const cleanIp = ip.replace(/^::ffff:/, '');
    const geo = cleanIp ? geoip.lookup(cleanIp) : null;
    const country = (geo && geo.country) ? geo.country : 'unknown';

    const ownHost = req.headers.host || '';
    const ref = normalizeReferrer(referrer, ownHost).slice(0, 255);

    await prisma.pageView.create({ data: { path: p, referrer: ref, country } });
    res.json({ ok: true });
  } catch (error) {
    // Analytics must never break the site.
    res.json({ ok: false });
  }
});

// Aggregated stats for the admin dashboard.
app.get('/api/track/stats', async (req, res) => {
  try {
    const days = Math.min(365, Math.max(1, parseInt(req.query.days, 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [total, byDayRaw, topPaths, topReferrers, topCountries] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      prisma.$queryRaw`SELECT DATE(createdAt) AS d, COUNT(*) AS c FROM PageView WHERE createdAt >= ${since} GROUP BY d ORDER BY d ASC`,
      prisma.pageView.groupBy({ by: ['path'], where: { createdAt: { gte: since } }, _count: { path: true }, orderBy: { _count: { path: 'desc' } }, take: 15 }),
      prisma.pageView.groupBy({ by: ['referrer'], where: { createdAt: { gte: since } }, _count: { referrer: true }, orderBy: { _count: { referrer: 'desc' } }, take: 15 }),
      prisma.pageView.groupBy({ by: ['country'], where: { createdAt: { gte: since } }, _count: { country: true }, orderBy: { _count: { country: 'desc' } }, take: 20 }),
    ]);

    const byDay = byDayRaw.map(r => ({
      date: (r.d instanceof Date) ? r.d.toISOString().slice(0, 10) : String(r.d).slice(0, 10),
      count: Number(r.c),
    }));

    res.json({
      total,
      days,
      byDay,
      topPaths: topPaths.map(r => ({ path: r.path, count: r._count.path })),
      topReferrers: topReferrers.map(r => ({ referrer: r.referrer, count: r._count.referrer })),
      topCountries: topCountries.map(r => ({ country: r.country, count: r._count.country })),
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// --- SEO: robots.txt & sitemap.xml (generated per requesting domain) ---

// Keep in sync with utils/productSlug.ts on the frontend.
function slugifyProduct(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[()[\]{}.,/\\|]/g, ' ')
    .replace(/[^0-9a-z가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

// Build the public origin from the proxy headers so both domains get correct URLs.
function getOrigin(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  return `${proto}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  const origin = getOrigin(req);
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
  res.type('text/plain').send(body);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const origin = getOrigin(req);

    // Use the admin-configured header menu so the sitemap follows the real site structure.
    let paths = ['/', '/products', '/certifications', '/technology', '/contact'];
    try {
      const settings = await prisma.appSettings.findFirst();
      if (settings && settings.navItems) {
        const items = JSON.parse(settings.navItems);
        const fromNav = items
          .filter(i => i && i.visible && typeof i.path === 'string' && i.path.startsWith('/') && !i.path.startsWith('/admin'))
          .map(i => i.path);
        if (fromNav.length) paths = Array.from(new Set(['/', ...fromNav]));
      }
    } catch { /* fall back to the default list */ }

    // Each product gets its own indexable URL (must match utils/productSlug.ts).
    try {
      const products = await prisma.product.findMany({ orderBy: { sortOrder: 'asc' } });
      const productPaths = products
        .map(p => slugifyProduct(p.name))
        .filter(Boolean)
        .map(s => `/products/${encodeURIComponent(s)}`);
      paths = paths.concat(productPaths);
    } catch { /* products are optional for the sitemap */ }

    const lastmod = new Date().toISOString().slice(0, 10);
    const urls = Array.from(new Set(paths)).map(p => {
      const loc = `${origin}${p === '/' ? '/' : p}`;
      const priority = p === '/' ? '1.0' : (p.startsWith('/products/') ? '0.7' : '0.8');
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    res.type('application/xml').send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Failed to build sitemap');
  }
});

// --- Per-product SEO HTML ---
// Search crawlers that do not run JavaScript (notably Naver's Yeti) would otherwise see
// the same generic shell on every product URL. We fetch the built app shell from the
// client container and inject product-specific title/description/content into it.

const escapeHtml = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

let shellCache = { html: null, at: 0 };
async function getAppShell() {
  if (shellCache.html && Date.now() - shellCache.at < 60000) return shellCache.html;
  const r = await fetch('http://client/index.html', { signal: AbortSignal.timeout(3000) });
  if (!r.ok) throw new Error(`shell fetch failed: ${r.status}`);
  const html = await r.text();
  shellCache = { html, at: Date.now() };
  return html;
}

app.get('/products/:slug', async (req, res) => {
  try {
    const slug = decodeURIComponent(req.params.slug || '');
    const [products, categories] = await Promise.all([
      prisma.product.findMany(),
      prisma.category.findMany(),
    ]);
    const product = products.find(p => slugifyProduct(p.name) === slug) || products.find(p => p.id === slug);
    if (!product) return res.redirect(302, '/products');

    const shell = await getAppShell();
    const catLabel = (categories.find(c => c.id === product.categoryId) || {}).label || '';
    const features = (() => { try { return JSON.parse(product.features || '[]'); } catch { return []; } })();

    const title = `${product.name}${catLabel ? ` - ${catLabel}` : ''} | 주식회사 다현산업`;
    const desc = `${product.name} | ${String(product.description || '').slice(0, 150)} 견적 문의 043-883-0602`;
    const origin = getOrigin(req);
    const url = `${origin}/products/${encodeURIComponent(slug)}`;

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: String(product.description || '').slice(0, 300),
      category: catLabel || undefined,
      url,
      brand: { '@type': 'Brand', name: '주식회사 다현산업' },
      manufacturer: { '@type': 'Organization', name: '주식회사 다현산업', telephone: '+82-43-883-0602' },
    });

    const crawlerContent = `
    <noscript>
      <h1>${escapeHtml(product.name)}</h1>
      ${catLabel ? `<p>분류: ${escapeHtml(catLabel)}</p>` : ''}
      <p>${escapeHtml(product.description || '')}</p>
      ${features.length ? `<h2>주요 특징</h2><ul>${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : ''}
      <p>주식회사 다현산업 | 충북 음성군 삼성면 대덕로 289 | 043-883-0602</p>
      <p><a href="/products">전체 제품 보기</a></p>
    </noscript>`;

    let html = shell
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/(<meta\s+name="description"[\s\S]*?content=")[\s\S]*?(")/, `$1${escapeHtml(desc)}$2`)
      .replace(/(<meta\s+property="og:title"[\s\S]*?content=")[\s\S]*?(")/, `$1${escapeHtml(title)}$2`)
      .replace(/(<meta\s+property="og:description"[\s\S]*?content=")[\s\S]*?(")/, `$1${escapeHtml(desc)}$2`)
      .replace('</head>', `  <link rel="canonical" href="${url}" />\n    <script type="application/ld+json">${jsonLd}</script>\n  </head>`)
      .replace('<noscript>', `${crawlerContent}\n    <noscript>`);

    res.type('html').send(html);
  } catch (error) {
    console.error('Product SEO render error:', error);
    // Fall back to the plain app shell so users still get a working page.
    try {
      res.type('html').send(await getAppShell());
    } catch {
      res.redirect(302, '/products');
    }
  }
});

// Serve React App (Catch-All) - Must be after all API routes.
// In production the build lives in the client container, so fall back to fetching
// the app shell from it when ../dist is not present next to the server.
app.get("*", (req, res) => {
  const localIndex = path.join(__dirname, "../dist/index.html");
  res.sendFile(localIndex, async (err) => {
    if (!err) return;
    try {
      res.type('html').send(await getAppShell());
    } catch {
      res.redirect(302, '/');
    }
  });
});

// Start server

// Online Inquiry Endpoint (Send Email)
app.post('/api/inquiry', async (req, res) => {
    try {
        const { name, phone, email, region, subject, message } = req.body;
        
        // Fetch Admin Settings & SMTP Config
        const appSettings = await prisma.appSettings.findFirst();
        const companyInfo = await prisma.companyInfo.findFirst();
        
        if (!companyInfo || !companyInfo.email) {
            return res.status(400).json({ error: '관리자 수신 이메일이 설정되지 않았습니다. 관리자 페이지에서 이메일을 설정해주세요.' });
        }
        
        if (!appSettings || !appSettings.smtpHost || !appSettings.smtpPort || !appSettings.smtpUser || !appSettings.smtpPass) {
            return res.status(400).json({ error: 'SMTP 발송 서버가 설정되지 않았습니다. 관리자 페이지에서 SMTP 정보를 설정해주세요.' });
        }
        
        // Create Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: appSettings.smtpHost,
            port: appSettings.smtpPort,
            secure: appSettings.smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: appSettings.smtpUser,
                pass: appSettings.smtpPass
            }
        });
        
        // Compose Email
        const mailOptions = {
            from: `"${name}" <${appSettings.smtpUser}>`, // Sender address must be the SMTP user to avoid spoofing issues
            replyTo: email, // Reply to the customer's email
            to: companyInfo.email, // Receiver address
            subject: `[온라인 문의] ${subject}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px;">새로운 온라인 문의가 접수되었습니다.</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 120px; color: #475569;">이름/담당자명</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">연락처</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">지역</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${region || '-'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">이메일</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="mailto:${email}" style="color: #10b981;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">문의 제목</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${subject}</td>
                        </tr>
                    </table>
                    <h3 style="color: #475569; font-size: 16px; margin-bottom: 10px;">문의 내용</h3>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                        이 메일은 웹사이트 온라인 문의를 통해 자동 발송되었습니다.
                    </div>
                </div>
            `
        };
        
        // Send Email
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ error: '이메일 발송에 실패했습니다: ' + error.message });
    }
});


// Reorder Lab Equipments
app.put('/api/lab-equipments/reorder', async (req, res) => {
    try {
        const ids = req.body;
        await prisma.$transaction(
            ids.map((id, index) =>
                prisma.labEquipment.update({
                    where: { id },
                    data: { sortOrder: index }
                })
            )
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reorder lab equipments" });
    }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
