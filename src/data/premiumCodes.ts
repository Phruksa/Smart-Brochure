export type InsuranceTypeCode = 'life' | 'home' | 'travel';

// ---------------- Life Insurance Data & Types ----------------
export interface LifePlanOption {
  code: string;
  name: string;
  category: 'whole_life' | 'endowment' | 'annuity' | 'term' | 'critical_illness';
  categoryLabel: string;
  coverageYears: number | string; // e.g. 90 or 15 or 'ถึงอายุ 85 ปี'
  premiumPayYears: number; // e.g. 20 or 10 or 5
  baseRatePerThousandMale: number; // rate per 1,000 THB sum insured at baseline age 35
  baseRatePerThousandFemale: number;
  highlight: string;
  taxDeductibleMax: number;
  maturityBenefit: string;
  features: string[];
}

export const LIFE_PLANS: LifePlanOption[] = [
  {
    code: 'SS-WL90/20',
    name: 'สไมล์ ไลฟ์ ตลอดชีพ 90/20',
    category: 'whole_life',
    categoryLabel: 'ตลอดชีพ (Whole Life)',
    coverageYears: 90,
    premiumPayYears: 20,
    baseRatePerThousandMale: 28.5,
    baseRatePerThousandFemale: 24.2,
    highlight: 'คุ้มครองยาวนานถึงอายุ 90 ปี ชำระเบี้ย 20 ปี มรดกส่งต่อครอบครัว',
    taxDeductibleMax: 100000,
    maturityBenefit: 'รับ 100% ของทุนประกันภัยเมื่อครบอายุ 90 ปี หรือส่งต่อเป็นมรดก',
    features: [
      'คุ้มครองการเสียชีวิตทุกกรณี 100% ของทุนประกัน',
      'มีมูลค่าเวนคืนกรมธรรม์และกู้เงินตามกรมธรรม์ได้',
      'สามารถแนบสัญญาเพิ่มเติมสุขภาพและอุบัติเหตุได้ครบ',
      'ลดหย่อนภาษีได้สูงสุด 100,000 บาท/ปี',
    ],
  },
  {
    code: 'SS-WL99/10',
    name: 'สไมล์ ไลฟ์ ชำระสั้น 99/10',
    category: 'whole_life',
    categoryLabel: 'ตลอดชีพ (Whole Life)',
    coverageYears: 99,
    premiumPayYears: 10,
    baseRatePerThousandMale: 46.8,
    baseRatePerThousandFemale: 41.5,
    highlight: 'ชำระเบี้ยสั้นเพียง 10 ปี คุ้มครองยาวถึงอายุ 99 ปี สบายใจไร้กังวล',
    taxDeductibleMax: 100000,
    maturityBenefit: 'รับ 120% ของทุนประกันภัยเมื่อครบอายุ 99 ปี',
    features: [
      'ชำระสั้นเพียง 10 ปี ไม่เป็นภาระระยะยาว',
      'คุ้มครองชีวิตสูงถึง 99 ปี',
      'สร้างกองมรดกเงินสดปลอดภาษีให้ทายาท',
      'ลดหย่อนภาษีเงินได้บุคคลธรรมดาได้เต็มสิทธิ์',
    ],
  },
  {
    code: 'SS-SAVE-15/10',
    name: 'สไมล์ เซฟวิงส์ สะสมทรัพย์ 15/10',
    category: 'endowment',
    categoryLabel: 'สะสมทรัพย์ (Endowment)',
    coverageYears: 15,
    premiumPayYears: 10,
    baseRatePerThousandMale: 92.0,
    baseRatePerThousandFemale: 90.5,
    highlight: 'ออมเงิน 10 ปี รับเงินคืนทุกปี 2% ครบสัญญา 15 ปี รับเงินก้อน 140%',
    taxDeductibleMax: 100000,
    maturityBenefit: 'รับ 140% ของทุนประกันภัย ณ สิ้นปีกรมธรรม์ที่ 15',
    features: [
      'เงินคืนรายปี 2% ของทุนประกันภัย ตั้งแต่สิ้นปีที่ 1-14',
      'เงินครบสัญญา 140% ของทุนประกันภัย รวมผลประโยชน์ตลอดสัญญา 168%',
      'คุ้มครองชีวิตเพิ่มขึ้นเป็นขั้นบันไดสูงสุด 150%',
      'เหมาะสำหรับการวางแผนการศึกษาบุตรหรือเป้าหมายระยะกลาง',
    ],
  },
  {
    code: 'SS-SAVE-10/5',
    name: 'สไมล์ ซูเปอร์เซฟ 10/5',
    category: 'endowment',
    categoryLabel: 'สะสมทรัพย์ (Endowment)',
    coverageYears: 10,
    premiumPayYears: 5,
    baseRatePerThousandMale: 185.0,
    baseRatePerThousandFemale: 184.0,
    highlight: 'ชำระสั้นพิเศษเพียง 5 ปี คุ้มครอง 10 ปี ผลตอบแทนแน่นอน ไม่ผันผวน',
    taxDeductibleMax: 100000,
    maturityBenefit: 'รับเงินก้อน 520% ของทุนประกันภัยเมื่อครบ 10 ปี',
    features: [
      'ระยะเวลาชำระเบี้ยสั้นมาก เพียง 5 ปี',
      'ผลตอบแทนแน่นอน ไม่มีความเสี่ยงจากตลาดทุน',
      'ลดหย่อนภาษีได้ 5 ปีเต็ม',
      'รับความคุ้มครองชีวิต 100% - 500% ตลอดสัญญา',
    ],
  },
  {
    code: 'SS-ANNUITY-85/60',
    name: 'สไมล์ รีไทร์เมนต์ บำนาญ 85/60',
    category: 'annuity',
    categoryLabel: 'บำนาญ (Annuity)',
    coverageYears: 'ถึงอายุ 85 ปี',
    premiumPayYears: 20, // assuming start around 40 to 60
    baseRatePerThousandMale: 52.0,
    baseRatePerThousandFemale: 54.5,
    highlight: 'เกษียณอย่างมั่นคง รับเงินบำนาญ 15% ทุกปีตั้งแต่อายุ 60 ถึง 85 ปี',
    taxDeductibleMax: 300000,
    maturityBenefit: 'รับเงินบำนาญรวม 390% ของทุนประกันภัยตลอดช่วงอายุ 60-85 ปี',
    features: [
      'รับเงินบำนาญปีละ 15% ของทุนประกันทุกปีตั้งแต่อายุ 60-85 ปี',
      'การันตีการจ่ายเงินบำนาญ 15 ปี หากเสียชีวิตก่อนส่งต่อให้ทายาท',
      'ใช้สิทธิลดหย่อนภาษีประกันบำนาญเพิ่มเติมได้สูงสุด 200,000 บาท (รวมประกันชีวิตเดิมเป็น 300,000 บาท)',
      'การันตีรายได้หลังเกษียณไม่ต้องพึ่งพาลูกหลาน',
    ],
  },
  {
    code: 'SS-TERM-10/10',
    name: 'สไมล์ โพรเทคท์ ชั่วระยะเวลา 10/10',
    category: 'term',
    categoryLabel: 'ชั่วระยะเวลา (Term)',
    coverageYears: 10,
    premiumPayYears: 10,
    baseRatePerThousandMale: 6.8,
    baseRatePerThousandFemale: 5.2,
    highlight: 'เบี้ยประหยัด คุ้มครองสูง เหมาะสำหรับผู้เป็นเสาหลักครอบครัว',
    taxDeductibleMax: 100000,
    maturityBenefit: 'แบบประกันเน้นความคุ้มครองสูง ไม่มีเงินคืนเมื่อครบกำหนดสัญญา',
    features: [
      'เบี้ยประกันภัยต่ำที่สุดเมื่อเทียบกับทุนประกันภัยที่สูง',
      'ทุนประกัน 1 ล้านบาท เบี้ยเริ่มต้นเพียงปีละไม่กี่พันบาท',
      'คุ้มครองหนี้สินบ้านและรถยนต์สำหรับเสาหลักของบ้าน',
      'สามารถต่ออายุสัญญาหรือเปลี่ยนเป็นแบบตลอดชีพได้',
    ],
  },
  {
    code: 'SS-CI-MAX',
    name: 'สไมล์ ซีไอ แม็กซ์ (โรคร้ายแรง เจอ จ่าย จบ)',
    category: 'critical_illness',
    categoryLabel: 'โรคร้ายแรง (Critical Illness)',
    coverageYears: 'ถึงอายุ 80 ปี',
    premiumPayYears: 20,
    baseRatePerThousandMale: 14.5,
    baseRatePerThousandFemale: 13.8,
    highlight: 'คุ้มครอง 50 โรคร้ายแรงทุกระยะ ตรวจพบรับเงินก้อนทันที 100%',
    taxDeductibleMax: 25000,
    maturityBenefit: 'รับ 100% ของทุนประกันภัยเมื่อตรวจพบโรคร้ายแรง หรือครบสัญญาอายุ 80 ปี',
    features: [
      'ครอบคลุมมะเร็ง หัวใจ เส้นเลือดสมอง ไตวาย และ 50 โรคร้ายแรง',
      'ตรวจพบระยะเริ่มต้น รับ 20% ระยะรุนแรง รับเต็ม 100%',
      'รับเงินก้อนไปจัดสรรการรักษาและฟื้นฟูร่างกายได้อิสระ',
      'ลดหย่อนภาษีสุขภาพได้สูงสุด 25,000 บาท',
    ],
  },
];

// ---------------- Home Insurance Data & Types ----------------
export interface HomePlanOption {
  code: string;
  name: string;
  buildingType: 'class_1' | 'class_2' | 'condo';
  buildingTypeLabel: string;
  ratePerMillionBuilding: number; // THB annual premium per 1,000,000 building sum insured
  ratePerMillionContents: number; // THB annual premium per 1,000,000 furniture/contents sum insured
  naturalDisasterIncluded: number; // THB limit
  thirdPartyLiabilityIncluded: number; // THB limit
  highlight: string;
  features: string[];
}

export const HOME_PLANS: HomePlanOption[] = [
  {
    code: 'HOME-SMILE-ECO',
    name: 'สไมล์โฮม อิโคโนมี่ (คุ้มครองพื้นฐาน)',
    buildingType: 'class_1',
    buildingTypeLabel: 'บ้านคอนกรีตล้วน / ทาวน์เฮาส์ / ตึกแถว (ชั้น 1)',
    ratePerMillionBuilding: 850,
    ratePerMillionContents: 950,
    naturalDisasterIncluded: 20000,
    thirdPartyLiabilityIncluded: 100000,
    highlight: 'คุ้มครองอัคคีภัย ฟ้าผ่า การระเบิด อากาศยาน และภัยจากยานพาหนะ',
    features: [
      'คุ้มครองไฟไหม้ ฟ้าผ่า ระเบิด 100% ตามทุนประกัน',
      'คุ้มครองภัยเนื่องจากน้ำ (ท่อน้ำแตก น้ำรั่ว) สูงสุด 50,000 บาท',
      'คุ้มครองลมพายุ แผ่นดินไหว น้ำท่วม รวม 20,000 บาท',
      'ความรับผิดตามกฎหมายต่อบุคคลภายนอก 100,000 บาท',
    ],
  },
  {
    code: 'HOME-SMILE-PLUS',
    name: 'สไมล์โฮม พลัส (ยอดนิยม คุ้มครองรอบด้าน)',
    buildingType: 'class_1',
    buildingTypeLabel: 'บ้านคอนกรีตล้วน / บ้านเดี่ยว / ทาวน์โฮม (ชั้น 1)',
    ratePerMillionBuilding: 1200,
    ratePerMillionContents: 1300,
    naturalDisasterIncluded: 100000,
    thirdPartyLiabilityIncluded: 500000,
    highlight: 'เพิ่มคุ้มครองโจรกรรมงัดแงะ ไฟฟ้าลัดวงจร ค่าเช่าที่พักชั่วคราว และภัยธรรมชาติ 1 แสน',
    features: [
      'คุ้มครองอัคคีภัย ฟ้าผ่า ระเบิด เต็ม 100% ของทุนประกัน',
      'คุ้มครองโจรกรรม มีร่องรอยงัดแงะ สูงสุด 100,000 บาท',
      'คุ้มครองเครื่องใช้ไฟฟ้าเสียหายจากไฟฟ้าลัดวงจร 50,000 บาท',
      'เงินชดเชยค่าเช่าที่พักชั่วคราววันละ 1,000 บาท (สูงสุด 100,000 บาท)',
      'ขยายภัยธรรมชาติ (น้ำท่วม ลมพายุ แผ่นดินไหว) 100,000 บาท',
      'ความรับผิดต่อบุคคลภายนอก 500,000 บาท',
    ],
  },
  {
    code: 'HOME-VIP-MAX',
    name: 'สไมล์โฮม วีไอพี แม็กซ์ (All Risks คุ้มครองสูงสุด)',
    buildingType: 'class_1',
    buildingTypeLabel: 'บ้านเดี่ยวพรีเมียม / คอนกรีตล้วน (ชั้น 1)',
    ratePerMillionBuilding: 1650,
    ratePerMillionContents: 1750,
    naturalDisasterIncluded: 300000,
    thirdPartyLiabilityIncluded: 1000000,
    highlight: 'คุ้มครองทุกอุบัติเหตุภายนอก (All Risks) น้ำท่วม 3 แสน บุคคลภายนอก 1 ล้านบาท',
    features: [
      'คุ้มครองความสูญเสียหรือเสียหายจากอุบัติเหตุทุกชนิด (All Risks)',
      'คุ้มครองน้ำท่วม ลมพายุ แผ่นดินไหว ลูกเห็บ 300,000 บาท',
      'คุ้มครองการโจรกรรม ชิงทรัพย์ ปล้นทรัพย์ สูงสุด 200,000 บาท',
      'ชดเชยค่าเช่าที่พักชั่วคราวสูงสุด 200,000 บาท',
      'คุ้มครองความรับผิดตามกฎหมายต่อบุคคลภายนอก 1,000,000 บาท',
      'คุ้มครองการเสียชีวิตของผู้เอาประกันหรือคนในครอบครัวจากไฟไหม้ในบ้าน',
    ],
  },
  {
    code: 'HOME-WOOD-SEMI',
    name: 'สไมล์โฮม กึ่งตึกกึ่งไม้ (ชั้น 2)',
    buildingType: 'class_2',
    buildingTypeLabel: 'บ้านกึ่งตึกกึ่งไม้ (ชั้นล่างตึก ชั้นบนไม้)',
    ratePerMillionBuilding: 2100,
    ratePerMillionContents: 2200,
    naturalDisasterIncluded: 50000,
    thirdPartyLiabilityIncluded: 200000,
    highlight: 'สำหรับบ้านพักอาศัยกึ่งไม้ที่หาประกันยาก คุ้มครองอัคคีภัย ฟ้าผ่า ระเบิด มั่นใจได้',
    features: [
      'รับประกันบ้านประเภทกึ่งตึกกึ่งไม้ (ชั้นล่างคอนกรีต ชั้นบนไม้)',
      'คุ้มครองไฟไหม้ ฟ้าผ่า ระเบิด ยานพาหนะชน',
      'คุ้มครองภัยเนื่องจากน้ำ 50,000 บาท',
      'ภัยธรรมชาติ 50,000 บาท และบุคคลภายนอก 200,000 บาท',
    ],
  },
  {
    code: 'CONDO-SAFE-01',
    name: 'สไมล์คอนโด เซฟการ์ด (เฉพาะห้องชุด)',
    buildingType: 'condo',
    buildingTypeLabel: 'ห้องชุดคอนโดมิเนียม / อาคารชุดอยู่อาศัย',
    ratePerMillionBuilding: 680,
    ratePerMillionContents: 780,
    naturalDisasterIncluded: 50000,
    thirdPartyLiabilityIncluded: 1000000,
    highlight: 'ออกแบบเฉพาะคอนโด คุ้มครองน้ำรั่วซึมใส่ห้องข้างล่างสูงถึง 1 ล้านบาท',
    features: [
      'คุ้มครองการตกแต่งต่อเติมห้องชุด และทรัพย์สินเฟอร์นิเจอร์',
      'เน้นคุ้มครองท่อน้ำแตก น้ำล้น ทะลุไหลลงห้องชุดข้างล่างหรือห้องข้างเคียง',
      'ความรับผิดต่อบุคคลภายนอกและนิติบุคคลอาคารชุดสูงถึง 1,000,000 บาท',
      'คุ้มครองการโจรกรรมงัดแงะในห้องชุด 50,000 บาท',
    ],
  },
];

// ---------------- Travel Insurance Data & Types ----------------
export interface TravelPlanOption {
  code: string;
  name: string;
  zone: 'domestic' | 'asia' | 'schengen' | 'worldwide';
  zoneLabel: string;
  tripType: 'single' | 'annual';
  medicalExpenseLimit: number; // THB
  maxSeniorMedicalLimit: number; // Max 500,000 THB for age 60-75 per underwriting rules
  sosEvacuationLimit: number; // THB or -1 for unlimited
  flightDelayLimit: number; // THB
  baggageLossLimit: number; // THB
  schengenVisaGuaranteed: boolean;
  baseRatePerDay: number; // THB per day (approx for single trip)
  annualRate?: number; // THB for annual multi-trip
  minAge: number; // 1 year old
  maxAge: number; // 75 years old
  minPremium: number; // Minimum premium per person
  highlight: string;
  features: string[];
}

export const TRAVEL_PLANS: TravelPlanOption[] = [
  {
    code: 'TRV-DOM-EASY',
    name: 'สไมล์ทราเวล ในประเทศ (ชิลทั่วไทย 2 แสน)',
    zone: 'domestic',
    zoneLabel: 'ในประเทศ (Domestic Thailand)',
    tripType: 'single',
    medicalExpenseLimit: 200000,
    maxSeniorMedicalLimit: 200000,
    sosEvacuationLimit: 500000,
    flightDelayLimit: 10000,
    baggageLossLimit: 15000,
    schengenVisaGuaranteed: false,
    baseRatePerDay: 45,
    annualRate: 1200,
    minAge: 1,
    maxAge: 75,
    minPremium: 140,
    highlight: 'เที่ยวไทยอุ่นใจ ค่ารักษาอุบัติเหตุ 2 แสน ผู้สูงอายุ 60-75 ปี รับประกันเต็มสิทธิ์',
    features: [
      'ค่ารักษาพยาบาลจากอุบัติเหตุในประเทศ 200,000 บาท',
      'รับประกันภัยอายุ 1 - 75 ปีบริบูรณ์ (เศษเกิน 6 เดือน ปัดเป็น 1 ปี)',
      'ค่ารักษาพยาบาลต่อเนื่องใน รพ. ชั้นนำทั่วไทย ไม่ต้องสำรองจ่าย',
      'ชดเชยเที่ยวบินล่าช้า (ดีเลย์เกิน 6 ชม.) 10,000 บาท',
      'กระเป๋าเดินทางหรือทรัพย์สินส่วนตัวสูญหาย/เสียหาย 15,000 บาท',
      'บริการเคลื่อนย้ายทางการแพทย์ฉุกเฉิน 500,000 บาท',
    ],
  },
  {
    code: 'TRV-SMART-500K',
    name: 'สไมล์ทราเวล สมาร์ท แคร์ (ทุน 500,000 บ. แนะนำตามเกณฑ์ไฟล์)',
    zone: 'asia',
    zoneLabel: 'เอเชีย / ทั่วไป (Asia & Standard)',
    tripType: 'single',
    medicalExpenseLimit: 500000,
    maxSeniorMedicalLimit: 500000,
    sosEvacuationLimit: 10000000,
    flightDelayLimit: 15000,
    baggageLossLimit: 20000,
    schengenVisaGuaranteed: false,
    baseRatePerDay: 65,
    annualRate: 2100,
    minAge: 1,
    maxAge: 75,
    minPremium: 180,
    highlight: 'แผนยอดนิยมตามเงื่อนไขไฟล์: รองรับผู้สูงอายุ 60-75 ปี เต็มเพดานสูงสุด 500,000 บ.',
    features: [
      'ค่ารักษาพยาบาลฉุกเฉิน 500,000 บาท (เต็มเพดานสูงสุดของผู้มีอายุ 60 - 75 ปี)',
      'รับประกันภัยอายุ 1 - 75 ปีบริบูรณ์ (ปัดเศษเดือนเกิน 6 เดือนเป็น 1 ปี)',
      'บริการช่วยเหลือฉุกเฉินทางการแพทย์ SOS วงเงิน 10,000,000 บาท',
      'ชดเชยเที่ยวบินล่าช้า 15,000 บาท / กระเป๋าสูญหาย 20,000 บาท',
      'คุ้มครองคณะทัวร์และกลุ่มเดินทาง มีส่วนลดคณะทัวร์สูงสุด 20%',
    ],
  },
  {
    code: 'TRV-ASIA-PLUS',
    name: 'สไมล์ทราเวล เอเชีย พลัส (ยอดฮิต 2 ล้านบาท)',
    zone: 'asia',
    zoneLabel: 'เอเชีย (Asia: ญี่ปุ่น เกาหลี จีน ไต้หวัน สิงคโปร์ ฯลฯ)',
    tripType: 'single',
    medicalExpenseLimit: 2000000,
    maxSeniorMedicalLimit: 500000,
    sosEvacuationLimit: 30000000,
    flightDelayLimit: 20000,
    baggageLossLimit: 30000,
    schengenVisaGuaranteed: false,
    baseRatePerDay: 85,
    annualRate: 2800,
    minAge: 1,
    maxAge: 75,
    minPremium: 220,
    highlight: 'ค่ารักษา 2 ล้านบาท (อายุ 60-75 ปี จำกัด 500,000 บาท ตามเงื่อนไขรับประกัน)',
    features: [
      'ค่ารักษาพยาบาลบาดเจ็บหรือเจ็บป่วยฉุกเฉิน 2,000,000 บาท (อายุ 60-75 ปี จำกัด 500,000 บ.)',
      'ครอบคลุมทั้งผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD) ในต่างประเทศ',
      'คุ้มครองเที่ยวบินล่าช้า กระเป๋าล่าช้า และการยกเลิกการเดินทาง',
      'บริการช่วยเหลือฉุกเฉินทางการแพทย์สากล 24 ชม. ไม่จำกัดวงเงิน',
      'มีศูนย์ประสานงานภาษาไทยตลอด 24 ชั่วโมง',
    ],
  },
  {
    code: 'TRV-SCHENGEN-PRO',
    name: 'สไมล์ทราเวล เชงเก้น โปร (การันตียื่นวีซ่ายุโรป 100%)',
    zone: 'schengen',
    zoneLabel: 'ยุโรปและกลุ่มเชงเก้น (Schengen Visa Compliant)',
    tripType: 'single',
    medicalExpenseLimit: 2500000,
    maxSeniorMedicalLimit: 500000,
    sosEvacuationLimit: 30000000,
    flightDelayLimit: 25000,
    baggageLossLimit: 40000,
    schengenVisaGuaranteed: true,
    baseRatePerDay: 135,
    annualRate: 4200,
    minAge: 1,
    maxAge: 75,
    minPremium: 350,
    highlight: 'คุ้มครองตามเกณฑ์สถานทูตเชงเก้น 100% มีใบรับรองภาษาอังกฤษ การันตีคืนเงินหากวีซ่าไม่ผ่าน',
    features: [
      'วงเงินค่ารักษาพยาบาลฉุกเฉิน 2,500,000 บาท (เกินกว่าเกณฑ์ขั้นต่ำ 30,000 EUR)',
      'ออกใบรับรองกรมธรรม์ภาษาอังกฤษทันทีเพื่อใช้ยื่นขอวีซ่าเชงเก้น',
      'การันตีคืนเบี้ยประกันเต็มจำนวน หากสถานทูตปฏิเสธการออกวีซ่า',
      'คุ้มครองครอบคลุม 29 ประเทศกลุ่มเชงเก้นและยุโรป',
      'บริการเคลื่อนย้ายเพื่อการรักษาพยาบาลฉุกเฉินทั่วโลก 30,000,000 บาท',
      'ผู้เดินทางอายุ 60-75 ปี คุ้มครองสูงสุดตามเงื่อนไข 500,000 บาท',
    ],
  },
  {
    code: 'TRV-WORLD-PLATINUM',
    name: 'สไมล์ทราเวล เวิลด์ แพลตตินัม (คุ้มครองทั่วโลก VIP 5 ล้าน)',
    zone: 'worldwide',
    zoneLabel: 'ทั่วโลก (Worldwide: รวมอเมริกา ยุโรป ออสเตรเลีย)',
    tripType: 'single',
    medicalExpenseLimit: 5000000,
    maxSeniorMedicalLimit: 500000,
    sosEvacuationLimit: -1, // Unlimited
    flightDelayLimit: 35000,
    baggageLossLimit: 60000,
    schengenVisaGuaranteed: true,
    baseRatePerDay: 195,
    annualRate: 6500,
    minAge: 1,
    maxAge: 75,
    minPremium: 500,
    highlight: 'ระดับพรีเมียม ค่ารักษาสูงถึง 5 ล้านบาท เคลื่อนย้าย SOS ไม่จำกัดวงเงิน ทั่วโลก',
    features: [
      'ค่ารักษาพยาบาลในต่างประเทศสูงสุด 5,000,000 บาท (รองรับค่ารักษาสูงในอเมริกา)',
      'การเคลื่อนย้ายฉุกเฉินทางการแพทย์และส่งศพกลับประเทศ ไม่จำกัดวงเงิน (Unlimited)',
      'คุ้มครองเอกสารการเดินทาง พาสปอร์ต และกระเป๋าสูญหาย 60,000 บาท',
      'ชดเชยการลดจำนวนวันเดินทาง หรือยกเลิกทริปจากเหตุจำเป็นสูงสุด 100,000 บาท',
      'คุ้มครองความรับผิดต่อบุคคลภายนอกในต่างประเทศ 2,000,000 บาท',
      'ผู้เดินทางอายุ 60-75 ปี คุ้มครองตามเพดานเงื่อนไขบริษัท 500,000 บาท',
    ],
  },
];

// Helper calculation functions
export function calculateLifePremium({
  planCode,
  gender,
  age,
  sumInsured,
  paymentMode,
  riders,
}: {
  planCode: string;
  gender: 'male' | 'female';
  age: number;
  sumInsured: number;
  paymentMode: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  riders: {
    ci: boolean; // Critical illness
    ai: boolean; // Accident indemnity
    hb: boolean; // Hospital cash benefit
    wp: boolean; // Waiver of premium
  };
}) {
  const plan = LIFE_PLANS.find((p) => p.code === planCode) || LIFE_PLANS[0];
  const baseRate = gender === 'male' ? plan.baseRatePerThousandMale : plan.baseRatePerThousandFemale;
  
  // Age factor: baseline 35
  const ageFactor = Math.max(0.6, 1 + (age - 35) * 0.025);
  const adjustedRatePerThousand = baseRate * ageFactor;
  
  const baseAnnualPremium = Math.round((sumInsured / 1000) * adjustedRatePerThousand);
  
  // Rider premiums
  let ciPremium = 0;
  if (riders.ci) {
    const ciRate = gender === 'male' ? 4.5 : 4.0;
    const ciSum = Math.min(sumInsured, 500000);
    ciPremium = Math.round((ciSum / 1000) * ciRate * ageFactor);
  }

  let aiPremium = 0;
  if (riders.ai) {
    const aiSum = Math.min(sumInsured, 500000);
    aiPremium = Math.round((aiSum / 1000) * 1.8); // fixed accident rate
  }

  let hbPremium = 0;
  if (riders.hb) {
    // 1,000 THB/day hospitalization benefit
    hbPremium = Math.round(1800 * (age > 45 ? 1.3 : 1.0));
  }

  let wpPremium = 0;
  if (riders.wp) {
    wpPremium = Math.round(baseAnnualPremium * 0.015);
  }

  const totalAnnual = baseAnnualPremium + ciPremium + aiPremium + hbPremium + wpPremium;

  let modeFactor = 1.0;
  let modeName = 'รายปี';
  if (paymentMode === 'semi-annual') {
    modeFactor = 0.52;
    modeName = 'ราย 6 เดือน';
  } else if (paymentMode === 'quarterly') {
    modeFactor = 0.27;
    modeName = 'ราย 3 เดือน';
  } else if (paymentMode === 'monthly') {
    modeFactor = 0.09;
    modeName = 'รายเดือน';
  }

  const totalPeriodic = Math.round(totalAnnual * modeFactor);
  const taxDeductible = Math.min(plan.taxDeductibleMax, baseAnnualPremium);

  // Generate Quoting / Policy Code
  const genderCode = gender === 'male' ? 'M' : 'F';
  const sumCode = `${Math.round(sumInsured / 1000)}K`;
  const modeCode = paymentMode === 'annual' ? 'ANN' : paymentMode === 'semi-annual' ? '6M' : paymentMode === 'quarterly' ? '3M' : 'MO';
  const quotingCode = `LF-${plan.code.replace('SS-', '')}-${genderCode}${age}-${sumCode}-${modeCode}`;

  return {
    plan,
    baseAnnualPremium,
    ciPremium,
    aiPremium,
    hbPremium,
    wpPremium,
    totalAnnual,
    totalPeriodic,
    modeName,
    taxDeductible,
    quotingCode,
  };
}

export function calculateHomePremium({
  planCode,
  buildingSumInsured,
  contentsSumInsured,
  periodYears,
  extraFlood,
  extraThirdParty,
}: {
  planCode: string;
  buildingSumInsured: number;
  contentsSumInsured: number;
  periodYears: 1 | 2 | 3;
  extraFlood: boolean;
  extraThirdParty: boolean;
}) {
  const plan = HOME_PLANS.find((p) => p.code === planCode) || HOME_PLANS[0];

  const buildingRate = plan.ratePerMillionBuilding / 1000000;
  const contentsRate = plan.ratePerMillionContents / 1000000;

  const baseBuildingAnnual = buildingSumInsured * buildingRate;
  const baseContentsAnnual = contentsSumInsured * contentsRate;

  let extraFloodAnnual = 0;
  if (extraFlood) {
    extraFloodAnnual = 450; // extra flood top-up
  }

  let extraThirdPartyAnnual = 0;
  if (extraThirdParty) {
    extraThirdPartyAnnual = 350; // extra 500k liability
  }

  const subtotalAnnual = baseBuildingAnnual + baseContentsAnnual + extraFloodAnnual + extraThirdPartyAnnual;

  // Period multiplier:
  // 1 year = 100%
  // 2 years = 175% (save 12.5%)
  // 3 years = 250% (save 16.7%)
  let periodFactor = 1.0;
  let discountText = 'ปกติ';
  if (periodYears === 2) {
    periodFactor = 1.75;
    discountText = 'ประหยัด 12.5%';
  } else if (periodYears === 3) {
    periodFactor = 2.5;
    discountText = 'ประหยัดคุ้มสุด 16.7% (เฉลี่ยปีละถูกกว่า)';
  }

  const premiumNet = Math.round(subtotalAnnual * periodFactor);
  const stampDuty = Math.ceil(premiumNet * 0.004); // 0.4% stamp duty
  const vat = Math.round((premiumNet + stampDuty) * 0.07);
  const totalPremium = premiumNet + stampDuty + vat;
  const monthlyEquivalent = Math.round(totalPremium / (periodYears * 12));

  const totalSumInsured = buildingSumInsured + contentsSumInsured;
  const quotingCode = `HM-${plan.code.replace('HOME-', '')}-${Math.round(totalSumInsured / 100000)}L-${periodYears}Y`;

  return {
    plan,
    premiumNet,
    stampDuty,
    vat,
    totalPremium,
    monthlyEquivalent,
    discountText,
    totalSumInsured,
    quotingCode,
  };
}

export function calculateTravelPremium({
  planCode,
  tripType,
  travelDays,
  travelerCount,
  destinationZone,
  hasSenior60To75 = false,
  seniorCount = 0,
  addons,
}: {
  planCode: string;
  tripType: 'single' | 'annual';
  travelDays: number;
  travelerCount: number;
  destinationZone: 'domestic' | 'asia' | 'schengen' | 'worldwide';
  hasSenior60To75?: boolean;
  seniorCount?: number;
  addons: {
    flightDelayPlus: boolean;
    baggagePlus: boolean;
  };
}) {
  const plan = TRAVEL_PLANS.find((p) => p.code === planCode) || TRAVEL_PLANS[0];

  let basePremiumPerPerson = 0;
  if (tripType === 'annual' && plan.annualRate) {
    basePremiumPerPerson = plan.annualRate;
  } else {
    // Days scaling with minimum tier according to table file
    const days = Math.max(1, Math.min(180, travelDays));
    if (days <= 4) {
      basePremiumPerPerson = Math.round(plan.baseRatePerDay * 3.5);
    } else if (days <= 7) {
      basePremiumPerPerson = Math.round(plan.baseRatePerDay * days * 0.90);
    } else if (days <= 14) {
      basePremiumPerPerson = Math.round(plan.baseRatePerDay * days * 0.85);
    } else if (days <= 30) {
      basePremiumPerPerson = Math.round(plan.baseRatePerDay * days * 0.80);
    } else {
      basePremiumPerPerson = Math.round(plan.baseRatePerDay * days * 0.75);
    }
    // Enforce minimum premium per person according to underwriting criteria in file
    if (plan.minPremium && basePremiumPerPerson < plan.minPremium) {
      basePremiumPerPerson = plan.minPremium;
    }
  }

  let addonPerPerson = 0;
  if (addons.flightDelayPlus) addonPerPerson += 120;
  if (addons.baggagePlus) addonPerPerson += 150;

  const totalPerPerson = basePremiumPerPerson + addonPerPerson;

  // Group / Tour Discount tiers according to file:
  // 1-2 pax = 0%
  // 3-9 pax = 10% (ส่วนลดครอบครัว/กลุ่ม)
  // 10-19 pax = 12% (ส่วนลดหมู่คณะเล็ก)
  // 20-35 pax = 15% (ส่วนลดคณะทัวร์)
  // 36-48+ pax = 20% (ส่วนลดคณะทัวร์ขนาดใหญ่ เช่น 48 ท่าน ตามไฟล์!)
  let discountRate = 0;
  let discountLabel = 'อัตราปกติ';
  if (travelerCount >= 36) {
    discountRate = 0.20;
    discountLabel = 'ส่วนลดคณะทัวร์ 20% (36 ท่านขึ้นไป / คณะ 48 ท่าน)';
  } else if (travelerCount >= 20) {
    discountRate = 0.15;
    discountLabel = 'ส่วนลดคณะทัวร์ 15% (20 - 35 ท่าน)';
  } else if (travelerCount >= 10) {
    discountRate = 0.12;
    discountLabel = 'ส่วนลดหมู่คณะ 12% (10 - 19 ท่าน)';
  } else if (travelerCount >= 3) {
    discountRate = 0.10;
    discountLabel = 'ส่วนลดครอบครัว/กลุ่ม 10% (3 - 9 ท่าน)';
  }

  const rawTotal = totalPerPerson * travelerCount;
  const discountAmount = Math.round(rawTotal * discountRate);
  const netPremium = Math.round(rawTotal - discountAmount);

  // Duty Stamp (0.4%) & VAT (7%)
  const stampDuty = Math.ceil(netPremium * 0.004);
  const vat = Math.round((netPremium + stampDuty) * 0.07);
  const grandTotal = netPremium + stampDuty + vat;

  // Senior underwriting criteria:
  // Age 60 - 75 years is strictly capped at max 500,000 THB sum insured
  const isSeniorCapped = Boolean(hasSenior60To75 && plan.medicalExpenseLimit > 500000);
  const effectiveSeniorMedicalLimit = Math.min(plan.medicalExpenseLimit, 500000);

  const zoneCode = destinationZone === 'domestic' ? 'DOM' : destinationZone === 'asia' ? 'ASIA' : destinationZone === 'schengen' ? 'SCHEN' : 'WW';
  const tripCode = tripType === 'annual' ? 'ANN' : `${travelDays}D`;
  const ageTag = hasSenior60To75 ? 'SNR500K' : 'A1-75';
  const quotingCode = `TRV-${plan.code.replace('TRV-', '')}-${zoneCode}-${tripCode}-${travelerCount}PAX-${ageTag}`;

  return {
    plan,
    basePremiumPerPerson,
    addonPerPerson,
    totalPerPerson,
    travelerCount,
    discountRate,
    discountLabel,
    hasFamilyDiscount: discountRate > 0,
    rawTotal,
    discountAmount,
    netPremium,
    stampDuty,
    vat,
    grandTotal,
    quotingCode,
    isSeniorCapped,
    effectiveSeniorMedicalLimit,
    minAge: 1,
    maxAge: 75,
  };
}
