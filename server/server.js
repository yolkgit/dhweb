import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3004;
const DATA_FILE = path.join(__dirname, "database.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase limit for large JSON payloads
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
         logoSettings
     ] = await Promise.all([
         prisma.appSettings.findFirst(),
         prisma.companyInfo.findFirst(),
         prisma.category.findMany(),
         prisma.product.findMany(),
         prisma.certification.findMany(),
         prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
         prisma.designSettings.findFirst(),
         prisma.certificationMark.findMany(),
         prisma.labEquipment.findMany(),
         prisma.faq.findMany(),
         prisma.logoSettings.findFirst()
     ]);

     // Reconstruct playlists map from categories
     const playlists = {};
     categories.forEach(c => {
         if(c.playlistId) playlists[c.id] = c.playlistId;
     });

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

     res.json({
         appSettings: appSettings || {},
         companyInfo: processedCompanyInfo || {},
         categories: categories || [],
         products: processedProducts || [],
         certifications: certifications || [],
         heroSlides: heroSlides || [],
         playlists: playlists || {},
         designSettings: designSettings || {},
         certificationMarks: certificationMarks || [],
         labEquipment: labEquipment || [],
         faqs: faqs || [],
         logoSettings: logoSettings || {}
     });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Category & Playlist Management ---
app.post('/api/categories', async (req, res) => {
   try {
       const categories = req.body; // Array of Categories
       // This is a bulk update logic request. 
       // Simplest strategy: Sync entire list (Upsert all, delete missing?)
       // Or the frontend sends updates individually.
       // Current frontend sends the WHOLE array of categories.
       
       // Strategy: Transaction to handle full sync is safer but complex logic.
       // Let's assume we update them one by one or reconstruct.
       // Since the frontend manages the ID and ordering is implicitly index based,
       // but here ID is primary key.
       
       for (const cat of categories) {
           await prisma.category.upsert({
               where: { id: cat.id },
               update: { label: cat.label }, // Playlist is separate
               create: { id: cat.id, label: cat.label }
           });
       }
       // If categories were deleted in UI, we might need to delete them in DB.
       // For now, upsert is safe.
       res.json({ success: true });
   } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
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
        const result = await prisma.product.create({
            data: {
                id: prod.id, // Using client-generated ID is fine
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
                certificationMarkIds: JSON.stringify(prod.certificationMarkIds || [])
            }
        });
        res.json(result);
    } catch(e) { console.error(e); res.status(500).json({error: "Failed"}); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const prod = req.body;
        const result = await prisma.product.update({
            where: { id },
            data: {
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
                certificationMarkIds: JSON.stringify(prod.certificationMarkIds || [])
            }
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
app.delete('/api/lab-equipment/:id', async (req, res) => {
    try {
        await prisma.labEquipment.delete({ where: { id: req.params.id } });
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
        const { youtubeApiKey } = req.body;
        const updated = await prisma.appSettings.upsert({
            where: { id: 1 },
            update: { youtubeApiKey },
            create: { youtubeApiKey }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update settings" });
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
        const { youtubeApiKey } = data;
        const updated = await prisma.appSettings.upsert({
            where: { id: 1 },
            update: { youtubeApiKey },
            create: { youtubeApiKey }
        });
        return res.json(updated);
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

    // For Arrays: We perform a full sync (Delete all + Create all) OR Upsert loops.
    // Syncing is safer for reordering (Hero Slides) and Deletions.
    // SQLite transaction is fast enough for these small datasets.

    if (key === 'categories') {
        // IDs are strings provided by user/frontend (ASPHALT, etc)
        // If we want to handle deletions, we must delete those not in new list.
        await prisma.$transaction(async (tx) => {
             // 1. Get all existing IDs
            //  const existing = await tx.category.findMany({ select: { id: true } });
             // 2. Upsert all from request
             for (const item of data) {
                 await tx.category.upsert({
                     where: { id: item.id },
                     update: { label: item.label },
                     create: { id: item.id, label: item.label }
                 });
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
                };
                
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

// Serve React App (Catch-All) - Must be after all API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
