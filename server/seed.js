import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const dbPath = path.join(__dirname, 'database.json');

async function main() {
  let data = {};
  
  // Try reading database.json
  try {
    const fileData = fs.readFileSync(dbPath, 'utf8');
    data = JSON.parse(fileData);
    console.log("Loaded data from database.json");
  } catch (err) {
    console.log("No database.json found or invalid, using defaults.");
  }

  // --- Seeding Logic with Fallbacks ---

  // 1. AppSettings
  await prisma.appSettings.upsert({
      where: { id: 1 },
      update: { youtubeApiKey: data.appSettings?.youtubeApiKey || "" },
      create: { youtubeApiKey: data.appSettings?.youtubeApiKey || "" }
  });

  // 2. CompanyInfo 
  // (Assuming data.companyInfo exists, otherwise let's skip or create dummy?)
  if (data.companyInfo) {
      await prisma.companyInfo.upsert({
          where: { id: 1 },
          update: { 
              ...data.companyInfo, 
              vision: JSON.stringify(data.companyInfo.vision || []) 
          },
          create: { 
              ...data.companyInfo, 
              vision: JSON.stringify(data.companyInfo.vision || []) 
          }
      });
  }

  // 3. Products (Fallback to constants if DB dry?)
  // Logic moved to section 5 below with INITIAL_PRODUCTS fallback
  // The user said "No basic data". 
  // Let's seed from constants if JSON is empty for these main items.
  
  // Actually, we can't easily import from ../constants.ts because it's TS.
  // We'll trust the JSON file or emptiness. 
  // But wait! database.json file viewed earlier DOES NOT HAVE 'products' key!
  // It only has 'appSettings', 'playlists', 'certifications', 'companyInfo'.
  // PRODUCTS were in constants.ts!
  // The original backend didn't save products to json unless they were modified? 
  // OR the `database.json` viewer showed it lacks products.
  
  // The `constants.ts` holds the INITIAL data.
  // WE MUST MIGRATE constants.ts data into the DB if DB is empty.
  
  // Since we cannot import TS directly in JS verify easily without build,
  // We will manually copy the constants data into this seed script 
  // OR use ts-node to run seed? No, simpler to
  const INITIAL_CATEGORIES = [
    { id: 'ASPHALT', label: '도로보수재 (RPM)' },
    { id: 'CONCRETE', label: '콘크리트 보수' },
    { id: 'NON_SLIP', label: '미끄럼방지/도막' },
    { id: 'DEICING', label: '제설제' }
  ];

  const INITIAL_PRODUCTS = [
      {
        id: 'rpm-general',
        name: 'RPM (상온아스콘)',
        category: 'ASPHALT',
        description: '선별한 5mm 골재와 특수 고분자수지를 혼합한 도로보수용 상온 아스팔트 혼합물입니다.',
        features: JSON.stringify(['전천후 사용 가능', '시공이 간단하여 누구나 작업 가능', '내구성이 우수하여 반영구적', '시공 후 즉시 통행 가능']),
        specs: JSON.stringify({
          "포장 단위": "25kg / 지대",
          "유통 기한": "제조일로부터 12개월",
          "골재 크기": "최대 5mm ~ 8mm",
          "사용 용도": "포트홀, 도로 균열, 맨홀 주변 보수"
        }),
        imageUrl: 'https://picsum.photos/id/1015/600/400'
      },
      {
        id: 'rpm-s',
        name: 'RPM S (고급품)',
        category: 'ASPHALT',
        description: '3mm 골재와 특수 고분자수지를 사용한 고강도 제품으로 다짐성 및 강도가 향상되었습니다.',
        features: JSON.stringify(['물에 대한 저항성 향상', '세립골재 사용으로 다짐성 우수', '견고한 밀폐포장']),
        specs: JSON.stringify({
          "포장 단위": "25kg / PE백 (밀폐)",
          "유통 기한": "제조일로부터 24개월",
          "골재 크기": "최대 3mm (세립)",
          "특징": "고강도, 우수한 수밀성"
        }),
        imageUrl: 'https://picsum.photos/id/1021/600/400',
        isNew: true
      },
      {
        id: 'rpm-water-fix',
        name: 'RPM WATER FIX (수경성)',
        category: 'ASPHALT',
        description: '물이 고인 포트홀에 바로 사용 가능하며 물과 반응하여 높은 접착강도를 발현합니다.',
        features: JSON.stringify(['수중 수화반응 경화', '물을 제거하지 않고 작업 가능', '급속경화 필요시 물살포']),
        specs: JSON.stringify({
          "포장 단위": "25kg / 캔 or 백",
          "경화 방식": "수분 반응형 (수화반응)",
          "작업 환경": "우천 시, 물 고인 곳 작업 가능",
          "초기 경화": "타설 후 즉시 교통 개방 가능"
        }),
        imageUrl: 'https://picsum.photos/id/16/600/400',
      },
      {
        id: 'ez-rpm',
        name: 'EZ RPM (친환경 경량)',
        category: 'ASPHALT',
        description: '순환경량골재를 50% 이상 사용하여 기존 제품보다 가볍고 환경친화적인 제품입니다.',
        features: JSON.stringify(['순환자원 사용', '가벼운 무게로 작업 용이', '환경표지인증 제 30442호']),
        specs: JSON.stringify({
          "포장 단위": "20kg (기존 25kg 부피 동일)",
          "인증 현황": "환경표지인증 획득",
          "탄소 저감": "순환 골재 50% 이상 사용",
          "작업성": "경량화로 인한 작업 피로도 감소"
        }),
        imageUrl: 'https://picsum.photos/id/204/600/400',
        isEco: true
      },
      {
        id: 'conseal',
        name: 'CONSEAL (콘-씰)',
        category: 'CONCRETE',
        description: 'L형 측구 및 콘크리트 표면 보수재. 파쇄 후 재타설하지 않고 표면을 재생합니다.',
        features: JSON.stringify(['작업이 쉬움 (철거 불필요)', '동결융해 저항성 우수', '내화학성 및 내후성', '빠른 건조']),
        specs: JSON.stringify({
          "포장 단위": "20kg / Pail",
          "압축 강도": "45MPa 이상",
          "부착 강도": "1.5MPa 이상",
          "양생 시간": "30분 ~ 1시간 (기온에 따라 변동)"
        }),
        imageUrl: 'https://picsum.photos/id/21/600/400',
      },
      {
        id: 'mma-nonslip',
        name: '미끄럼방지 포장재 (MMA)',
        category: 'NON_SLIP',
        description: '어린이보호구역, 급경사 등 미끄럼 저항력이 필요한 구간에 시공하여 안전을 강화합니다.',
        features: JSON.stringify(['우수한 미끄럼 저항성', '뛰어난 시인성', '속경화성 (빠른 시공)', '강력한 접착력']),
        specs: JSON.stringify({
          "주성분": "MMA (Methyl Methacrylate) 수지",
          "건조 시간": "1시간 이내 (초속경)",
          "적용 구간": "스쿨존, 급커브, 경사로",
          "색상": "적색, 암적색, 녹색 등 다양"
        }),
        imageUrl: 'https://picsum.photos/id/133/600/400',
      },
      {
        id: 'stamped-paving',
        name: '도막형 바닥재 (스텐실/스템프)',
        category: 'NON_SLIP',
        description: '다양한 색상과 문양을 연출하여 거리 미관을 개선하는 바닥 포장재입니다.',
        features: JSON.stringify(['다양한 디자인 (벽돌, 석재 등)', '심미성 우수', '내구성 및 내마모성', '자전거도로/산책로 적용']),
        specs: JSON.stringify({
          "시공 두께": "2mm ~ 3mm",
          "디자인": "스텐실 페이퍼를 이용한 문양 구현",
          "용도": "공원 산책로, 광장, 자전거 도로",
          "특징": "논슬립 기능 포함 가능"
        }),
        imageUrl: 'https://picsum.photos/id/296/600/400',
      },
      {
        id: 'deicing',
        name: '친환경 제설제 / 염화칼슘',
        category: 'DEICING',
        description: '부식 억제력이 강하고 제설 성능이 뛰어난 제설 솔루션입니다.',
        features: JSON.stringify(['환경표지인증 (친환경)', '자동차 및 시설물 부식 억제', '우수한 융빙 성능']),
        specs: JSON.stringify({
          "성분": "염화칼슘 및 부식억제제, 환경친화 물질",
          "포장 단위": "25kg / 1,000kg (톤백)",
          "부식성": "일반 소금 대비 현저히 낮음",
          "지속성": "살포 후 장시간 융빙 효과 지속"
        }),
        imageUrl: 'https://picsum.photos/id/560/600/400',
      }
  ];

  const INITIAL_HERO_SLIDES = [
      {
        id: 'slide-1',
        type: 'video',
        src: 'https://cdn.pixabay.com/video/2020/06/17/42323-431835336_large.mp4',
        poster: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1920&auto=format&fit=crop',
        title: 'Future Road Culture',
        subtitle: '미래형 도로문화를 선도하는 다현산업',
        desc: '최고의 품질과 기술력으로 안전하고 쾌적한 도로 환경을 만듭니다.'
      },
      {
        id: 'slide-2',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920&auto=format&fit=crop',
        title: 'High Quality Materials',
        subtitle: '엄격한 품질관리, 최상의 내구성',
        desc: 'KS 규격과 국제 표준을 준수하는 검증된 도로 보수재를 생산합니다.'
      },
      {
        id: 'slide-3',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1584463635346-9524e9416ee6?q=80&w=1920&auto=format&fit=crop',
        title: 'Eco-Friendly Solution',
        subtitle: '환경을 생각하는 친환경 기술',
        desc: '환경표지인증 제품과 순환 자원을 활용한 지속 가능한 솔루션을 제공합니다.'
      }
  ];
  
  const INITIAL_CERTIFICATIONS = [
      { id: '1', title: 'ISO 9001 품질경영시스템', issuer: 'KOSRE', type: 'CERTIFICATE' },
      { id: '2', title: '환경표지인증 (EZ RPM)', issuer: '한국환경산업기술원', type: 'CERTIFICATE' },
      { id: '3', title: '단체표준인증 (미끄럼방지)', issuer: '한국도로교통협회', type: 'CERTIFICATE' },
      { id: '4', title: '특허: 도로 보수재 및 코팅제', issuer: '특허청', type: 'PATENT' },
      { id: '5', title: '벤처기업확인서', issuer: '중소기업진흥공단', type: 'CERTIFICATE' },
  ];

  const INITIAL_LAB_EQUIPMENT = [
      { id: 'le-1', title: "고점도 교반 히팅", iconName: 'Beaker', desc: "신제품 개발 및 바인더 시험장비" },
      { id: 'le-2', title: "마샬안정도 시험기", iconName: 'Microscope', desc: "안정도와 흐름값을 측정하는 디지털 장비" },
      { id: 'le-3', title: "항온챔버", iconName: 'ClipboardCheck', desc: "KS 시험규격에 따른 온도 유지 장치" },
      { id: 'le-4', title: "아스팔트 자동 다짐기", iconName: 'Award', desc: "규격에 적합하도록 공시체를 다지는 장비" }
  ];

  const INITIAL_FAQS = [
      {
        question: "제품 구매는 어떻게 하나요?",
        answer: "본사 전화(043-883-0602) 또는 홈페이지의 '견적 문의하기'를 통해 문의해 주시면 담당자가 상세히 안내해 드립니다. 대량 구매 및 관급 납품도 가능합니다."
      },
      {
        question: "소량 주문도 가능한가요?",
        answer: "네, 가능합니다. RPM 등 보수재 제품은 소량 택배 발송도 지원하고 있습니다. 자세한 배송비와 일정은 전화 문의 부탁드립니다."
      },
      {
        question: "RPM 상온아스콘 시공 시 특별한 장비가 필요한가요?",
        answer: "아니요, 특별한 중장비 없이 삽과 빗자루, 그리고 다짐 도구(발로 밟거나 차량 바퀴 이용 가능)만 있으면 누구나 쉽게 시공할 수 있습니다."
      },
      {
        question: "비가 오는 날에도 작업이 가능한가요?",
        answer: "일반 RPM 제품도 수분에 강하지만, 특히 'RPM WATER FIX' 제품은 물이 고인 포트홀에서도 물을 퍼내지 않고 바로 시공할 수 있도록 개발되었습니다."
      },
      {
        question: "전국 배송이 가능한가요?",
        answer: "네, 전국 어디든 화물 또는 택배 배송이 가능합니다. 제주 및 도서 산간 지역은 배송 기간이 추가될 수 있습니다."
      }
  ];


  // 1. AppSettings
  await prisma.appSettings.upsert({
      where: { id: 1 },
      update: { youtubeApiKey: data.appSettings?.youtubeApiKey || "" },
      create: { youtubeApiKey: data.appSettings?.youtubeApiKey || "" }
  });
  console.log('Migrated AppSettings');

  // 2. CompanyInfo 
  const ci = data.companyInfo || {};
  await prisma.companyInfo.upsert({
      where: { id: 1 },
      update: { 
          name: ci.name || "(주)다현산업", 
          englishName: ci.englishName || "DAHYEON INDUSTRY CO.,LTD.",
          ceo: ci.ceo,
          address: ci.address || "충북 음성군 삼성면 대덕로 289",
          phone: ci.phone || "043-883-0602",
          fax: ci.fax || "043-882-0818",
          email: ci.email,
          bizNum: ci.bizNum,
          headerTitle: ci.headerTitle || "DAHYEON",
          headerSubtitle: ci.headerSubtitle || "INDUSTRY",
          footerDesc: ci.footerDesc || "다현산업은 끊임없는 기술 혁신으로\n대한민국의 도로 안전을 책임집니다.",
          slogan: ci.slogan || "최고의 품질과 기술력을 바탕으로 미래형 도로문화를 창조합니다.",
          vision: JSON.stringify(ci.vision || ["우수한 품질", "착한 가격", "정확한 납기", "빠른 서비스"]) 
      },
      create: { 
          name: ci.name || "(주)다현산업", 
          englishName: ci.englishName || "DAHYEON INDUSTRY CO.,LTD.",
          ceo: ci.ceo,
          address: ci.address || "충북 음성군 삼성면 대덕로 289",
          phone: ci.phone || "043-883-0602",
          fax: ci.fax || "043-882-0818",
          email: ci.email,
          bizNum: ci.bizNum,
          headerTitle: ci.headerTitle || "DAHYEON",
          headerSubtitle: ci.headerSubtitle || "INDUSTRY",
          footerDesc: ci.footerDesc || "다현산업은 끊임없는 기술 혁신으로\n대한민국의 도로 안전을 책임집니다.",
          slogan: ci.slogan || "최고의 품질과 기술력을 바탕으로 미래형 도로문화를 창조합니다.",
          vision: JSON.stringify(ci.vision || ["우수한 품질", "착한 가격", "정확한 납기", "빠른 서비스"]) 
      }
  });
  console.log('Migrated CompanyInfo');

  // 3. Categories & Playlists
  // First, gather playlists from data.playlists
  const categoryPlaylists = data.playlists || {}; // e.g. { ASPHALT: "..." }

  // 4. Categories
  if (data.categories && data.categories.length > 0) {
    for (const cat of data.categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: { 
            label: cat.label,
            playlistId: categoryPlaylists[cat.id] || null 
        },
        create: { 
            id: cat.id, 
            label: cat.label,
            playlistId: categoryPlaylists[cat.id] || null 
        }
      });
    }
    console.log(`Migrated ${data.categories.length} Categories`);
  } else {
      // Seed initial categories
      for (const cat of INITIAL_CATEGORIES) {
          await prisma.category.upsert({
              where: { id: cat.id },
              update: { label: cat.label, playlistId: categoryPlaylists[cat.id] || null },
              create: { id: cat.id, label: cat.label, playlistId: categoryPlaylists[cat.id] || null },
          })
      }
      console.log(`Seeded ${INITIAL_CATEGORIES.length} Categories from defaults`);
  }

  // 5. Products
  const productsToSeed = data.products && data.products.length > 0 ? data.products : INITIAL_PRODUCTS;
  if (productsToSeed) {
    for (const prod of productsToSeed) {
      await prisma.product.upsert({
        where: { id: prod.id },
        update: {
          name: prod.name,
          categoryId: prod.category, // Map 'category' field to 'categoryId'
          description: prod.description,
          features: typeof prod.features === 'string' ? prod.features : JSON.stringify(prod.features || []),
          specs: typeof prod.specs === 'string' ? prod.specs : JSON.stringify(prod.specs || {}),
          specTable: prod.specTable ? (typeof prod.specTable === 'string' ? prod.specTable : JSON.stringify(prod.specTable)) : null,
          imageUrl: prod.imageUrl,
          isNew: prod.isNew || false,
          isEco: prod.isEco || false,
          specUrl: prod.specUrl,
          msdsUrl: prod.msdsUrl,
          certificationMarkIds: prod.certificationMarkIds ? (typeof prod.certificationMarkIds === 'string' ? prod.certificationMarkIds : JSON.stringify(prod.certificationMarkIds)) : null,
        },
        create: {
          id: prod.id,
          name: prod.name,
          categoryId: prod.category,
          description: prod.description,
          features: typeof prod.features === 'string' ? prod.features : JSON.stringify(prod.features || []),
          specs: typeof prod.specs === 'string' ? prod.specs : JSON.stringify(prod.specs || {}),
          specTable: prod.specTable ? (typeof prod.specTable === 'string' ? prod.specTable : JSON.stringify(prod.specTable)) : null,
          imageUrl: prod.imageUrl,
          isNew: prod.isNew || false,
          isEco: prod.isEco || false,
          specUrl: prod.specUrl,
          msdsUrl: prod.msdsUrl,
          certificationMarkIds: prod.certificationMarkIds ? (typeof prod.certificationMarkIds === 'string' ? prod.certificationMarkIds : JSON.stringify(prod.certificationMarkIds)) : null,
        }
      });
    }
    console.log(`Migrated ${productsToSeed.length} Products`);
  }

  // 6. Certifications
  const certsToSeed = data.certifications && data.certifications.length > 0 ? data.certifications : INITIAL_CERTIFICATIONS;
  if (certsToSeed) {
    for (const cert of certsToSeed) {
      await prisma.certification.upsert({
        where: { id: cert.id },
        update: {
          title: cert.title,
          issuer: cert.issuer,
          type: cert.type,
          pdfUrl: cert.pdfUrl
        },
        create: {
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          type: cert.type,
          pdfUrl: cert.pdfUrl
        }
      });
    }
    console.log(`Migrated ${certsToSeed.length} Certifications`);
  }

  // 7. Hero Slides
  const slidesToSeed = data.heroSlides && data.heroSlides.length > 0 ? data.heroSlides : INITIAL_HERO_SLIDES;
  if (slidesToSeed) {
    for (const slide of slidesToSeed) {
      await prisma.heroSlide.upsert({
        where: { id: slide.id },
        update: {
          type: slide.type || 'image',
          src: slide.src,
          poster: slide.poster,
          title: slide.title,
          subtitle: slide.subtitle,
          desc: slide.desc,
          order: slide.order || 0,
          fadeOutDuration: slide.fadeOutDuration || 0,
          duration: slide.duration || 6
        },
        create: {
          id: slide.id,
          type: slide.type || 'image',
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
    }
    console.log(`Migrated ${slidesToSeed.length} Hero Slides`);
  }

  // 8. Design Settings
  const ds = data.designSettings || {};
  await prisma.designSettings.upsert({
       where: { id: 1 },
       update: {
         fontFamily: ds.fontFamily,
         fontSize: ds.fontSize,
         headerFontFamily: ds.headerFontFamily,
         headerTitleSize: ds.headerTitleSize,
       },
       create: {
         fontFamily: ds.fontFamily || 'Noto Sans KR',
         fontSize: ds.fontSize || 'medium',
         headerFontFamily: ds.headerFontFamily || 'Noto Sans KR',
         headerTitleSize: ds.headerTitleSize || 'medium',
       }
  });
  console.log('Migrated Design Settings');

  // 9. Certification Marks & Lab Equipment (if any in your data, add here)
  if (data.certificationMarks) {
      for(const mark of data.certificationMarks) {
          await prisma.certificationMark.upsert({
              where: { id: mark.id },
              update: { name: mark.name, imageUrl: mark.imageUrl },
              create: { id: mark.id, name: mark.name, imageUrl: mark.imageUrl }
          });
      }
      console.log('Migrated Certification Marks');
  }
  
  // 9. Lab Equipment
  const labToSeed = data.labEquipment && data.labEquipment.length > 0 ? data.labEquipment : INITIAL_LAB_EQUIPMENT;
  if (labToSeed) {
      for(const equip of labToSeed) {
          await prisma.labEquipment.upsert({
              where: { id: equip.id },
              update: { title: equip.title, desc: equip.desc, iconName: equip.iconName, imageUrl: equip.imageUrl },
              create: { id: equip.id, title: equip.title, desc: equip.desc, iconName: equip.iconName, imageUrl: equip.imageUrl }
          });
      }
      console.log(`Migrated ${labToSeed.length} Lab Equipment`);
  }

  // 10. FAQs
  const faqsToSeed = data.faqs && data.faqs.length > 0 ? data.faqs : INITIAL_FAQS;
  if (faqsToSeed) {
      // Clear all FAQs and re-insert to avoid dups if no IDs, or we can't easily upsert without IDs.
      // Strategy: Delete and Recreate is simpler for FAQs if they don't have stable IDs to check against.
      await prisma.faq.deleteMany({});
      for (const item of faqsToSeed) {
          await prisma.faq.create({
              data: {
                  question: item.question,
                  answer: item.answer,
                  category: item.category // Might be undefined but optional in schema now
              }
          });
      }
      console.log(`Migrated ${faqsToSeed.length} FAQs`);
  }
  
  // Logo Settings
  const ls = data.logoSettings || {};
  await prisma.logoSettings.upsert({
      where: { id: 1 },
      update: {
          useCustomLabel: ls.useCustomLabel || false,
          defaultUrl: ls.defaultUrl,
          whiteUrl: ls.whiteUrl
      },
      create: {
          useCustomLabel: ls.useCustomLabel || false,
          defaultUrl: ls.defaultUrl,
          whiteUrl: ls.whiteUrl
      }
  });
  console.log('Migrated Logo Settings');

  console.log('Migration completed successfully with backups.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
