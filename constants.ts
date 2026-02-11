
import { Product, Certification, LabEquipment, CategoryPlaylists, HeroSlide, LogoSettings, DesignSettings, CertificationMark, Category, CalculatorSettings, Branch } from './types';

export const COMPANY_INFO = {
  name: "(주)다현산업",
  englishName: "DAHYEON INDUSTRY CO.,LTD.",
  headerTitle: "DAHYEON",
  headerSubtitle: "INDUSTRY",
  footerDesc: "다현산업은 끊임없는 기술 혁신으로\n대한민국의 도로 안전을 책임집니다.",
  address: "충북 음성군 삼성면 대덕로 289",
  phone: "043-883-0602",
  fax: "043-882-0818",
  slogan: "최고의 품질과 기술력을 바탕으로 미래형 도로문화를 창조합니다.",
  vision: ["우수한 품질", "착한 가격", "정확한 납기", "빠른 서비스"],
  companyViewUrl: '',
  kakaoChannelUrl: 'http://pf.kakao.com/_aZxjxmn'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'ASPHALT', label: '도로보수재 (RPM)' },
  { id: 'CONCRETE', label: '콘크리트 보수' },
  { id: 'NON_SLIP', label: '미끄럼방지/도막' },
  { id: 'DEICING', label: '제설제' }
];

export const HERO_SLIDES: HeroSlide[] = [];

export const CERT_MARKS: CertificationMark[] = [];

export const PRODUCTS: Product[] = [
  {
    id: 'rpm-general',
    name: 'RPM (상온아스콘)',
    category: 'ASPHALT',
    description: '선별한 5mm 골재와 특수 고분자수지를 혼합한 도로보수용 상온 아스팔트 혼합물입니다.',
    features: ['전천후 사용 가능', '시공이 간단하여 누구나 작업 가능', '내구성이 우수하여 반영구적', '시공 후 즉시 통행 가능'],
    specs: {
      "포장 단위": "25kg / 지대",
      "유통 기한": "제조일로부터 12개월",
      "골재 크기": "최대 5mm ~ 8mm",
      "사용 용도": "포트홀, 도로 균열, 맨홀 주변 보수"
    },
    imageUrl: 'https://picsum.photos/id/1015/600/400', 
  },
  {
    id: 'rpm-s',
    name: 'RPM S (고급품)',
    category: 'ASPHALT',
    description: '3mm 골재와 특수 고분자수지를 사용한 고강도 제품으로 다짐성 및 강도가 향상되었습니다.',
    features: ['물에 대한 저항성 향상', '세립골재 사용으로 다짐성 우수', '견고한 밀폐포장'],
    specs: {
      "포장 단위": "25kg / PE백 (밀폐)",
      "유통 기한": "제조일로부터 24개월",
      "골재 크기": "최대 3mm (세립)",
      "특징": "고강도, 우수한 수밀성"
    },
    imageUrl: 'https://picsum.photos/id/1021/600/400',
    isNew: true
  },
  {
    id: 'rpm-water-fix',
    name: 'RPM WATER FIX (수경성)',
    category: 'ASPHALT',
    description: '물이 고인 포트홀에 바로 사용 가능하며 물과 반응하여 높은 접착강도를 발현합니다.',
    features: ['수중 수화반응 경화', '물을 제거하지 않고 작업 가능', '급속경화 필요시 물살포'],
    specs: {
      "포장 단위": "25kg / 캔 or 백",
      "경화 방식": "수분 반응형 (수화반응)",
      "작업 환경": "우천 시, 물 고인 곳 작업 가능",
      "초기 경화": "타설 후 즉시 교통 개방 가능"
    },
    imageUrl: 'https://picsum.photos/id/16/600/400',
  },
  {
    id: 'ez-rpm',
    name: 'EZ RPM (친환경 경량)',
    category: 'ASPHALT',
    description: '순환경량골재를 50% 이상 사용하여 기존 제품보다 가볍고 환경친화적인 제품입니다.',
    features: ['순환자원 사용', '가벼운 무게로 작업 용이', '환경표지인증 제 30442호'],
    specs: {
      "포장 단위": "20kg (기존 25kg 부피 동일)",
      "인증 현황": "환경표지인증 획득",
      "탄소 저감": "순환 골재 50% 이상 사용",
      "작업성": "경량화로 인한 작업 피로도 감소"
    },
    imageUrl: 'https://picsum.photos/id/204/600/400',
    isEco: true
  },
  {
    id: 'conseal',
    name: 'CONSEAL (콘-씰)',
    category: 'CONCRETE',
    description: 'L형 측구 및 콘크리트 표면 보수재. 파쇄 후 재타설하지 않고 표면을 재생합니다.',
    features: ['작업이 쉬움 (철거 불필요)', '동결융해 저항성 우수', '내화학성 및 내후성', '빠른 건조'],
    specs: {
      "포장 단위": "20kg / Pail",
      "압축 강도": "45MPa 이상",
      "부착 강도": "1.5MPa 이상",
      "양생 시간": "30분 ~ 1시간 (기온에 따라 변동)"
    },
    imageUrl: 'https://picsum.photos/id/21/600/400',
  },
  {
    id: 'mma-nonslip',
    name: '미끄럼방지 포장재 (MMA)',
    category: 'NON_SLIP',
    description: '어린이보호구역, 급경사 등 미끄럼 저항력이 필요한 구간에 시공하여 안전을 강화합니다.',
    features: ['우수한 미끄럼 저항성', '뛰어난 시인성', '속경화성 (빠른 시공)', '강력한 접착력'],
    specs: {
      "주성분": "MMA (Methyl Methacrylate) 수지",
      "건조 시간": "1시간 이내 (초속경)",
      "적용 구간": "스쿨존, 급커브, 경사로",
      "색상": "적색, 암적색, 녹색 등 다양"
    },
    imageUrl: 'https://picsum.photos/id/133/600/400',
  },
  {
    id: 'stamped-paving',
    name: '도막형 바닥재 (스텐실/스템프)',
    category: 'NON_SLIP',
    description: '다양한 색상과 문양을 연출하여 거리 미관을 개선하는 바닥 포장재입니다.',
    features: ['다양한 디자인 (벽돌, 석재 등)', '심미성 우수', '내구성 및 내마모성', '자전거도로/산책로 적용'],
    specs: {
      "시공 두께": "2mm ~ 3mm",
      "디자인": "스텐실 페이퍼를 이용한 문양 구현",
      "용도": "공원 산책로, 광장, 자전거 도로",
      "특징": "논슬립 기능 포함 가능"
    },
    imageUrl: 'https://picsum.photos/id/296/600/400',
  },
  {
    id: 'deicing',
    name: '친환경 제설제 / 염화칼슘',
    category: 'DEICING',
    description: '부식 억제력이 강하고 제설 성능이 뛰어난 제설 솔루션입니다.',
    features: ['환경표지인증 (친환경)', '자동차 및 시설물 부식 억제', '우수한 융빙 성능'],
    specs: {
      "성분": "염화칼슘 및 부식억제제, 환경친화 물질",
      "포장 단위": "25kg / 1,000kg (톤백)",
      "부식성": "일반 소금 대비 현저히 낮음",
      "지속성": "살포 후 장시간 융빙 효과 지속"
    },
    imageUrl: 'https://picsum.photos/id/560/600/400',
  }
];

export const CERTIFICATIONS: Certification[] = [
  { id: '1', title: 'ISO 9001 품질경영시스템', issuer: 'KOSRE', type: 'CERTIFICATE' },
  { id: '2', title: '환경표지인증 (EZ RPM)', issuer: '한국환경산업기술원', type: 'CERTIFICATE' },
  { id: '3', title: '단체표준인증 (미끄럼방지)', issuer: '한국도로교통협회', type: 'CERTIFICATE' },
  { id: '4', title: '특허: 도로 보수재 및 코팅제', issuer: '특허청', type: 'PATENT' },
  { id: '5', title: '벤처기업확인서', issuer: '중소기업진흥공단', type: 'CERTIFICATE' },
];

export const LAB_EQUIPMENT: LabEquipment[] = [
  { id: 'le-1', title: "고점도 교반 히팅", iconName: 'Beaker', desc: "신제품 개발 및 바인더 시험장비" },
  { id: 'le-2', title: "마샬안정도 시험기", iconName: 'Microscope', desc: "안정도와 흐름값을 측정하는 디지털 장비" },
  { id: 'le-3', title: "항온챔버", iconName: 'ClipboardCheck', desc: "KS 시험규격에 따른 온도 유지 장치" },
  { id: 'le-4', title: "아스팔트 자동 다짐기", iconName: 'Award', desc: "규격에 적합하도록 공시체를 다지는 장비" }
];

export const FAQS = [
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

export const LOGO_SETTINGS: LogoSettings = {
  useCustomLabel: false,
  defaultUrl: '',
  whiteUrl: ''
};

export const DESIGN_SETTINGS: DesignSettings = {
  fontFamily: 'Noto Sans KR',
  fontSize: 'medium',
  headerFontFamily: 'Inter',
  headerTitleSize: 'medium',
  headerFontSize: 'medium',
  footerFontFamily: 'Noto Sans KR',
  footerFontSize: 'small'
};

export const DEFAULT_PLAYLISTS: CategoryPlaylists = {
  'ASPHALT': '', 
  'CONCRETE': '',
  'NON_SLIP': '',
  'DEICING': '',
};

export const CALCULATOR_SETTINGS: CalculatorSettings = {
  bagImageUrl: 'https://placehold.co/400x400/png?text=Bag+Image',
  palletImageUrl: 'https://placehold.co/400x400/png?text=Pallet+Image',
  density: 2.3 // Default density
};

export const INITIAL_BRANCHES: Branch[] = [
  { 
    id: 'hq', 
    name: '본사 (음성 공장)', 
    address: '충북 음성군 삼성면 대덕로 289 (용성리 543-3)', 
    phone: '043-883-0602' 
  },
  { 
    id: 'dj', 
    name: '대전 지점', 
    address: '대전광역시 유성구 유성대로', 
    phone: '042-000-0000' 
  },
  { 
    id: 'gw', 
    name: '강원 지점', 
    address: '강원도 원주시', 
    phone: '033-000-0000' 
  }
];