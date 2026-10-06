import { Car, CarOption, LicensePlate } from '../types';

export const USD_TO_UZS_RATE = 12850;

export const AVAILABLE_OPTIONS: CarOption[] = [
  {
    id: 'opt_tinting',
    name: '100% Qoraytirish (Tanirovka ruxsatnomasi)',
    priceUsd: 250,
    description: '1 yillik rasmiy IIV ruxsatnomasi va sifatli termo-plyonka bilan'
  },
  {
    id: 'opt_ceramic',
    name: 'Nanokeramika himoya qoplamasi (9H Pro)',
    priceUsd: 320,
    description: 'Kuzovni tirnalish, quyosh nurlari va chang-to\'zondan himoya qilish'
  },
  {
    id: 'opt_mats',
    name: '7D Premium Eva/Charm poliklar to\'plami',
    priceUsd: 90,
    description: 'Salonga to\'liq moslashtirilgan sifatli nam o\'tkazmaydigan material'
  },
  {
    id: 'opt_winter_tires',
    name: 'Michelin / Pirelli qishki shinalar to\'plami',
    priceUsd: 480,
    description: 'Qor va muzda mustahkam tishlashuv ta\'minlovchi 4 ta yangi shina'
  },
  {
    id: 'opt_dashcam',
    name: '4K Ultra HD Ikki kamerali videoregistrator',
    priceUsd: 140,
    description: 'GPS, Wi-Fi va tungi tasvirga olish sensori bilan'
  }
];

export const PRESET_LICENSE_PLATES: LicensePlate[] = [
  {
    id: 'plate_std',
    region: '01',
    number: '428',
    series: 'BCA',
    fullPlate: '01 428 BCA',
    category: 'standart',
    priceUsd: 0
  },
  {
    id: 'plate_777_aaa',
    region: '01',
    number: '777',
    series: 'AAA',
    fullPlate: '01 777 AAA',
    category: 'vip',
    priceUsd: 950
  },
  {
    id: 'plate_001_aar',
    region: '01',
    number: '001',
    series: 'AAR',
    fullPlate: '01 001 AAR',
    category: 'vip',
    priceUsd: 850
  },
  {
    id: 'plate_707_uzb',
    region: '01',
    number: '707',
    series: 'UZB',
    fullPlate: '01 707 UZB',
    category: 'chiroyli',
    priceUsd: 380
  },
  {
    id: 'plate_555_bbb',
    region: '01',
    number: '555',
    series: 'BBB',
    fullPlate: '01 555 BBB',
    category: 'vip',
    priceUsd: 650
  },
  {
    id: 'plate_070_vip',
    region: '01',
    number: '070',
    series: 'VIP',
    fullPlate: '01 070 VIP',
    category: 'chiroyli',
    priceUsd: 420
  },
  {
    id: 'plate_717_wow',
    region: '01',
    number: '717',
    series: 'WOW',
    fullPlate: '01 717 WOW',
    category: 'chiroyli',
    priceUsd: 360
  }
];

export const UZBEKISTAN_REGIONS = [
  'Toshkent shahri (01)',
  'Toshkent viloyati (10)',
  'Samarqand viloyati (30)',
  'Farg\'ona viloyati (40)',
  'Andijon viloyati (60)',
  'Namangan viloyati (50)',
  'Buxoro viloyati (80)',
  'Xorazm viloyati (90)',
  'Qashqadaryo viloyati (70)',
  'Surxondaryo viloyati (75)',
  'Navoiy viloyati (85)',
  'Jizzax viloyati (25)',
  'Sirdaryo viloyati (20)',
  'Qoraqalpog\'iston Respublikasi (95)'
];

export const CARS_DATA: Car[] = [
  // 1. CHEVROLET DAMAS (Yangi qo'shildi)
  {
    id: 'chevrolet-damas-deluxe',
    name: 'Chevrolet Damas D1 Deluxe (8 o\'rinli)',
    shortModel: 'Damas',
    brand: 'Chevrolet',
    country: 'Uzbekistan',
    bodyType: 'Miniven',
    year: 2024,
    priceUsd: 7900,
    originalPriceUsd: 8400,
    discountPercent: 6,
    image: '/images/car_chevrolet_damas_1791207590027.jpg',
    gallery: [
      '/images/car_chevrolet_damas_1791207590027.jpg'
    ],
    colors: [
      { name: 'Oq toza klassik', hex: '#FFFFFF', classBg: 'bg-white' },
      { name: 'Kumushrang metallik', hex: '#E5E7EB', classBg: 'bg-zinc-200' }
    ],
    specs: {
      engine: '0.8L F8CB 3-silindrli SOHC',
      powerHp: 38,
      acceleration0to100: '24.0 soniya',
      topSpeed: '115 km/soat',
      transmission: '5-bosqichli mexanika (MT)',
      fuelType: 'Benzin (AI-80/92) / Metan / Propan',
      fuelConsumption: '5.8 L / 100 km',
      driveTrain: 'Orqa uzatma (RWD)',
      year: 2024
    },
    features: [
      '8 nafar yo\'lovchi sig\'imi',
      'Ikkita suriluvchi yon eshiklar',
      'Kuchaytirilgan orqa ressor osmasi',
      'Tejamkor va o\'ta chidamli 0.8L dvigatel',
      'Tijorat va katta oila uchun eng optimal transport'
    ],
    description: 'O\'zbekistonning chinakam mehnatkashi va xalqona mikroveni — Chevrolet Damas Deluxe! Kam xarajat, o\'ta tejamkor va 8 o\'rindiqli qulay yo\'lovchi saloni bilan har qanday biznes va oilaviy yumushlarga tayyor.',
    inStock: 12,
    isPopular: true,
    isFeatured: true,
    warranty: '2 yil yoki 50 000 km rasmiy zavod kafolati',
    engineSoundType: 'damas'
  },

  // 2. QORA GENTRA (Alohida so'ralgan mashhur model)
  {
    id: 'chevrolet-qora-gentra-black-edition',
    name: 'Chevrolet Qora Gentra (1.5 AT Elegant Plus Black Edition)',
    shortModel: 'Qora Gentra',
    brand: 'Chevrolet',
    country: 'Uzbekistan',
    bodyType: 'Sedan',
    year: 2024,
    priceUsd: 12900,
    originalPriceUsd: 13600,
    discountPercent: 5,
    image: '/images/car_gentra_lacetti_1791206275293.jpg',
    gallery: [
      '/images/car_gentra_lacetti_1791206275293.jpg'
    ],
    colors: [
      { name: 'Qora metallik (GBO)', hex: '#0B0C0E', classBg: 'bg-zinc-950' },
      { name: 'To\'q asfalt (GYM)', hex: '#374151', classBg: 'bg-zinc-700' }
    ],
    specs: {
      engine: '1.5L DOHC 16V 4-silindrli GM Powertrain',
      powerHp: 107,
      acceleration0to100: '11.9 soniya',
      topSpeed: '180 km/soat',
      transmission: '6-bosqichli avtomat uzatmalar qutisi (6T30)',
      fuelType: 'Benzin (AI-92/95)',
      fuelConsumption: '7.4 L / 100 km',
      driveTrain: 'Oldi uzatma (FWD)',
      year: 2024
    },
    features: [
      'Zavod lyuk (Sunroof)',
      'Elegant Plus qoraytirilgan Black Edition radiator panjarasi',
      'Old o\'rindiqlarni 2 bosqichli isitish',
      'ABS tormoz tizimi va 2 ta xavfsizlik yostiqchasi',
      'Optitron priborlar paneli va 4 ta elektr oyna ko\'targich'
    ],
    description: 'O\'zbekistondagi eng mashhur va talabgir avtomobil — Qora Gentra 1.5 Avtomat! To\'liq qora rangdagi eksklyuziv ko\'rinish, lyuk, 6-bosqichli avtomat va qulay podveska.',
    inStock: 5,
    isPopular: true,
    isFeatured: true,
    warranty: '3 yil yoki 100 000 km rasmiy kafolat',
    engineSoundType: 'gentra'
  },

  // 3. CHEVROLET COBALT LTZ
  {
    id: 'chevrolet-cobalt-ltz-2024',
    name: 'Chevrolet Cobalt LTZ 1.5 AT',
    shortModel: 'Cobalt',
    brand: 'Chevrolet',
    country: 'Uzbekistan',
    bodyType: 'Sedan',
    year: 2024,
    priceUsd: 11400,
    originalPriceUsd: 12100,
    discountPercent: 6,
    image: '/images/car_chevrolet_cobalt_1791207506180.jpg',
    gallery: [
      '/images/car_chevrolet_cobalt_1791207506180.jpg'
    ],
    colors: [
      { name: 'Oq marvarid (GAZ)', hex: '#FFFFFF', classBg: 'bg-white' },
      { name: 'To\'q kulrang (GYM)', hex: '#4B5563', classBg: 'bg-zinc-600' },
      { name: 'Qora asfalt (GBO)', hex: '#18181B', classBg: 'bg-zinc-900' }
    ],
    specs: {
      engine: '1.5L B15D2 16V zanjirli motor',
      powerHp: 106,
      acceleration0to100: '11.7 soniya',
      topSpeed: '170 km/soat',
      transmission: '6-bosqichli avtomat (M qo\'lda boshqarish bilan)',
      fuelType: 'Benzin (AI-92)',
      fuelConsumption: '6.7 L / 100 km',
      driveTrain: 'Oldi uzatma (FWD)',
      year: 2024
    },
    features: [
      '545 litr rekord darajadagi ulkan yukxona',
      'Yumshoq energiya yutuvchi osma qismi',
      'R15 yengil qotishmali disklar',
      'Konditsioner va audio tizim'
    ],
    description: 'Haqiqiy xalqona sedan! 545 litrli ulkan bagaji, tejamkorligi va qattiq yo\'llarga moslashtirilgan chidamli osmasi bilan shahar va viloyatlararo qatnovlar uchun ajoyib tanlov.',
    inStock: 9,
    isPopular: true,
    isFeatured: true,
    warranty: '3 yil yoki 100 000 km kafolat',
    engineSoundType: 'cobalt'
  },

  // 4. CHEVROLET TRACKER 2 PREMIER
  {
    id: 'chevrolet-tracker-2-premier',
    name: 'Chevrolet Tracker 2 Premier Turbo',
    shortModel: 'Tracker',
    brand: 'Chevrolet',
    country: 'Uzbekistan',
    bodyType: 'Krossover',
    year: 2024,
    priceUsd: 18900,
    originalPriceUsd: 19900,
    discountPercent: 5,
    image: '/images/car_chevrolet_tracker_1791207519659.jpg',
    gallery: [
      '/images/car_chevrolet_tracker_1791207519659.jpg'
    ],
    colors: [
      { name: 'Yorqin Qizil (Redline)', hex: '#DC2626', classBg: 'bg-red-600' },
      { name: 'Qora samoviy metallik', hex: '#09090B', classBg: 'bg-black' },
      { name: 'Oq toza marvarid', hex: '#F9FAFB', classBg: 'bg-zinc-100' }
    ],
    specs: {
      engine: '1.2L E-Turbo 3-silindrli',
      powerHp: 132,
      acceleration0to100: '9.2 soniya',
      topSpeed: '185 km/soat',
      transmission: '6-bosqichli avtomat uzatmalar qutisi',
      fuelType: 'Benzin (AI-95)',
      fuelConsumption: '6.5 L / 100 km',
      driveTrain: 'Oldi uzatma (FWD)',
      year: 2024
    },
    features: [
      'Panoramik lyukli to\'liq shisha tom',
      'Avtomatik parallel va perpendikulyar parkovka',
      'Simsiz smartfon quvvatlash stansiyasi',
      'Apple CarPlay & Android Auto sensor ekrani'
    ],
    description: 'Zamonaviy shahar krossoveri! Tracker 2 Premier — panoramik shisha tom, avtoparkovka yordamchisi va kuchli tejamkor 1.2 turbo dvigatelga ega.',
    inStock: 4,
    isPopular: true,
    isFeatured: true,
    warranty: '3 yil yoki 100 000 km rasmiy kafolat',
    engineSoundType: 'tracker'
  },

  // 5. CHEVROLET LACETTI CDX
  {
    id: 'chevrolet-lacetti-cdx-classic',
    name: 'Chevrolet Lacetti CDX 1.8 Sport Edition',
    shortModel: 'Lacetti',
    brand: 'Chevrolet',
    country: 'Uzbekistan',
    bodyType: 'Sedan',
    year: 2023,
    priceUsd: 9600,
    originalPriceUsd: 10200,
    discountPercent: 6,
    image: '/images/car_chevrolet_lacetti_1791207537120.jpg',
    gallery: [
      '/images/car_chevrolet_lacetti_1791207537120.jpg'
    ],
    colors: [
      { name: 'Kumushrang metallik', hex: '#CBD5E1', classBg: 'bg-slate-300' },
      { name: 'Qora qatron', hex: '#0D0D11', classBg: 'bg-zinc-950' },
      { name: 'Oq klassik', hex: '#FFFFFF', classBg: 'bg-white' }
    ],
    specs: {
      engine: '1.8L DOHC E-TEC II',
      powerHp: 122,
      acceleration0to100: '10.7 soniya',
      topSpeed: '190 km/soat',
      transmission: '5-bosqichli mexanika / 4-AT',
      fuelType: 'Benzin / Propan / Metan mos',
      fuelConsumption: '8.2 L / 100 km',
      driveTrain: 'Oldi uzatma (FWD)',
      year: 2023
    },
    features: [
      'Chidamli va mustahkam osma qismi',
      'Konditsioner tizimi',
      'Keng va qulay salon',
      'Sport disklar va past shovqinli shinalar'
    ],
    description: 'Klassik Chevrolet Lacetti — kuchli 1.8 motori, mustahkam metall korpusi va ishonchli mexanikasi bilan sinovdan o\'tgan haqiqiy do\'st.',
    inStock: 3,
    warranty: '2 yil yoki 60 000 km kafolat',
    engineSoundType: 'lacetti'
  },

  // 6. CHEVROLET MALIBU 2 PREMIER
  {
    id: 'chevrolet-malibu-2-premier',
    name: 'Chevrolet Malibu 2 Premier 2.0 Turbo',
    shortModel: 'Malibu 2',
    brand: 'Chevrolet',
    country: 'Uzbekistan',
    bodyType: 'Sedan',
    year: 2024,
    priceUsd: 28900,
    originalPriceUsd: 30500,
    discountPercent: 5,
    image: '/images/car_chevrolet_malibu_1791207569703.jpg',
    gallery: [
      '/images/car_chevrolet_malibu_1791207569703.jpg'
    ],
    colors: [
      { name: 'Black Shadow (Qora)', hex: '#0F172A', classBg: 'bg-slate-900' },
      { name: 'Oq marvarid', hex: '#F8FAFC', classBg: 'bg-slate-50' }
    ],
    specs: {
      engine: '2.0L Turbo DOHC Ecotec',
      powerHp: 253,
      acceleration0to100: '6.7 soniya',
      topSpeed: '250 km/soat',
      transmission: '9-bosqichli zamonaviy avtomat (9T50)',
      fuelType: 'Benzin (AI-95)',
      fuelConsumption: '8.5 L / 100 km',
      driveTrain: 'Oldi uzatma (FWD)',
      year: 2024
    },
    features: [
      'Bose premium 9-dinamikli surround akustika',
      'Ventilatsiyalanadigan va isitiladigan charm o\'rindiqlar',
      'Panoramik ikki bo\'limli lyuk',
      'Avtomatik favqulodda tormozlash tizimi'
    ],
    description: 'Biznes toifasidagi eng nufuzli sedan! 253 ot kuchi, 9-bosqichli avtomat va shovqinsiz saloni bilan yuqori darajadagi qulaylik baxsh etadi.',
    inStock: 3,
    isPopular: true,
    warranty: '3 yil yoki 100 000 km kafolat',
    engineSoundType: 'malibu'
  },

  // 7. BMW M5 CS (F90)
  {
    id: 'bmw-m5-cs-f90',
    name: 'BMW M5 CS Competition (F90)',
    shortModel: 'BMW M5',
    brand: 'BMW',
    country: 'Germaniya',
    bodyType: 'Sportkar',
    year: 2024,
    priceUsd: 119000,
    originalPriceUsd: 128000,
    discountPercent: 7,
    image: '/images/car_bmw_m5_cs_1791206291939.jpg',
    gallery: [
      '/images/car_bmw_m5_cs_1791206291939.jpg'
    ],
    colors: [
      { name: 'Frozen Deep Grey', hex: '#1C1D21', classBg: 'bg-zinc-800' },
      { name: 'Marina Bay Blue', hex: '#1D4ED8', classBg: 'bg-blue-700' },
      { name: 'Alpinweiss Oq', hex: '#F9FAFB', classBg: 'bg-white' }
    ],
    specs: {
      engine: '4.4L S63 Twin-Turbocharged V8',
      powerHp: 635,
      acceleration0to100: '3.0 soniya',
      topSpeed: '305 km/soat',
      transmission: '8-bosqichli M Steptronic Drivelogic',
      fuelType: 'Benzin (AI-98/100 Super Plus)',
      fuelConsumption: '11.3 L / 100 km',
      driveTrain: 'M xDrive aqlli to\'liq uzatma (2WD drift rejimli)',
      year: 2024
    },
    features: [
      'Karbon-keramik M sport poyga tormozlari',
      'M Carbon karkasli yengil sport o\'rindiqlar',
      'BMW Laserlight sariq poyga kunduzgi chiroqlari',
      'Bowers & Wilkins Diamond Surround audio tizimi'
    ],
    description: 'Bavariya muhandisligining cho\'qqisi! 635 ot kuchi, 3.0 soniyada 100 km/soatgacha uchish tezlanishi va M xDrive drift rejimi.',
    inStock: 2,
    isPopular: true,
    isFeatured: true,
    warranty: '4 yil yoki 120 000 km xalqaro rasmiy kafolat',
    engineSoundType: 'bmw_m5'
  },

  // 8. MERCEDES-BENZ G 63 AMG (MERS)
  {
    id: 'mercedes-amg-g63-2024',
    name: 'Mercedes-AMG G 63 Geländewagen',
    shortModel: 'MERS G63',
    brand: 'Mercedes-Benz',
    country: 'Germaniya',
    bodyType: 'Krossover',
    year: 2024,
    priceUsd: 189000,
    originalPriceUsd: 199000,
    discountPercent: 5,
    image: '/images/car_mercedes_g63_1791206320015.jpg',
    gallery: [
      '/images/car_mercedes_g63_1791206320015.jpg'
    ],
    colors: [
      { name: 'Obsidian Black Metallic', hex: '#0E0E10', classBg: 'bg-zinc-950' },
      { name: 'G manufaktur Matt Oq', hex: '#F3F4F6', classBg: 'bg-zinc-100' }
    ],
    specs: {
      engine: '4.0L V8 Biturbo AMG Handcrafted',
      powerHp: 585,
      acceleration0to100: '4.5 soniya',
      topSpeed: '240 km/soat',
      transmission: 'AMG SPEEDSHIFT TCT 9G avtomat',
      fuelType: 'Benzin (AI-98 Premium)',
      fuelConsumption: '14.4 L / 100 km',
      driveTrain: 'To\'liq 4x4 (3 ta 100% differensial blokirovkasi)',
      year: 2024
    },
    features: [
      'Yon tomonga chiqqan AMG sport glushitellari (gullagan ovoz)',
      'Nappa charm qoplamali massaj va ventilatsiyali o\'rindiqlar',
      'Burmester Surround 16 dinamikli premium akustika',
      '22 dyuymli soxtalashtirilgan AMG Forged disklar'
    ],
    description: 'Qudrat va nufuz ramzi! Mercedes-Benz G 63 AMG — shohona salon, qo\'lda yig\'ilgan 585 ot kuchiga ega V8 Biturbo motori.',
    inStock: 2,
    isPopular: true,
    isFeatured: true,
    warranty: '3 yil cheksiz masofali rasmiy kafolat',
    engineSoundType: 'amg_g63'
  },

  // 9. TOYOTA GR SUPRA 3.0 TURBO
  {
    id: 'toyota-gr-supra-mk5',
    name: 'Toyota GR Supra 3.0 Pro Turbo',
    shortModel: 'SUPRA',
    brand: 'Toyota',
    country: 'Yaponiya',
    bodyType: 'Sportkar',
    year: 2024,
    priceUsd: 59000,
    originalPriceUsd: 63000,
    discountPercent: 6,
    image: '/images/car_toyota_supra_1791206306729.jpg',
    gallery: [
      '/images/car_toyota_supra_1791206306729.jpg'
    ],
    colors: [
      { name: 'Prominence Red (Qizil)', hex: '#DC2626', classBg: 'bg-red-600' },
      { name: 'Phantom Matte Grey', hex: '#27272A', classBg: 'bg-zinc-800' }
    ],
    specs: {
      engine: '3.0L B58 Twin-Scroll Turbo Inline-6',
      powerHp: 387,
      acceleration0to100: '3.9 soniya',
      topSpeed: '250 km/soat',
      transmission: '8-bosqichli Sport AT / Paddle shifters',
      fuelType: 'Benzin (AI-95/98)',
      fuelConsumption: '7.8 L / 100 km',
      driveTrain: 'Klassik orqa uzatma (RWD + Active Diff)',
      year: 2024
    },
    features: [
      '50:50 mukammal vazn taqsimoti',
      'Brembo 4-porshenli sport tormoz disklari',
      'Faol sport differensiali va adaptiv osma',
      'JBL 12-dinamikli akustik tizim'
    ],
    description: 'Yapon afsonasi! Toyota GR Supra 3.0 — 387 ot kuchi, 3.9 soniyada 100 km/soatga erishish va mashhur Blow-off turbina ovozi.',
    inStock: 3,
    isPopular: true,
    isFeatured: true,
    warranty: '3 yil yoki 100 000 km kafolat',
    engineSoundType: 'supra_turbo'
  },

  // 10. NISSAN GT-R NISMO (R35 GODZILLA)
  {
    id: 'nissan-gtr-nismo-r35',
    name: 'Nissan GT-R Nismo Edition (R35 Godzilla)',
    shortModel: 'NISSAN GT-R',
    brand: 'Nissan',
    country: 'Yaponiya',
    bodyType: 'Sportkar',
    year: 2024,
    priceUsd: 112000,
    originalPriceUsd: 119000,
    discountPercent: 6,
    image: '/images/car_nissan_gtr_nismo_1791207551599.jpg',
    gallery: [
      '/images/car_nissan_gtr_nismo_1791207551599.jpg'
    ],
    colors: [
      { name: 'Nismo Stealth Grey', hex: '#3F3F46', classBg: 'bg-zinc-700' },
      { name: 'Pearl Black Solid', hex: '#09090B', classBg: 'bg-black' }
    ],
    specs: {
      engine: '3.8L VR38DETT Twin-Turbo V6 (Takumi ustalar yig\'gan)',
      powerHp: 600,
      acceleration0to100: '2.8 soniya',
      topSpeed: '315 km/soat',
      transmission: '6-bosqichli ikkita muftali BorgWarner GR6',
      fuelType: 'Benzin (AI-98/100)',
      fuelConsumption: '12.0 L / 100 km',
      driveTrain: 'ATTESA E-TS aqlli AWD to\'liq uzatma',
      year: 2024
    },
    features: [
      'Karbon tolali orqa katta qanot (Spoiler)',
      '2.8 soniyada 0-100 ga start (Launch Control)',
      'Brembo uglerod-keramik poyga tormozlari',
      'Recaro uglerod qobig\'idagi anatomik o\'rindiqlar'
    ],
    description: 'Haqiqiy "Godzilla"! Nissan GT-R Nismo — treklar qiroli. Har bir dvigatel Tokioda faqat 5 nafar usta tomonidan qo\'lda yig\'iladi.',
    inStock: 2,
    isPopular: true,
    isFeatured: true,
    warranty: '3 yil yoki 100 000 km kafolat',
    engineSoundType: 'nissan_gtr'
  }
];

export const PROMO_CODES: Record<string, { discountPercent?: number; discountUsd?: number; title: string }> = {
  'UZAVTO2025': { discountPercent: 3, title: 'Yangi mavsum: 3% qo\'shimcha chegirma' },
  'TOSHKENT': { discountUsd: 300, title: 'Toshkent shahar aksiyasi: $300 chegirma' },
  'CLICKPAY': { discountPercent: 2, title: 'Click bonusi: 2% chegirma' },
  'PAYMEUZ': { discountPercent: 2, title: 'Payme orqali 2% qo\'shimcha bonus' }
};
