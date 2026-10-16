import { InsurancePlan, PlanTargetAudience } from '../types';

export const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: 'plan-15-i',
    code: '15-I',
    name: 'แผน 15-I',
    category: 'health',
    badge: 'ผู้ป่วยในเหมาจ่าย IPD',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'เน้นผู้ป่วยใน (IPD) ค่าห้อง 1,200 บ. คุ้มครองอุบัติเหตุสูง 200,000 บ.',
    monthlyPremium: 1590,
    annualPremium: 19080,
    minAge: 15,
    maxAge: 60,
    ageRangeText: '15 - 60 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครอง',
      },
    },
    dailyCompensation: {
      perNight: 300,
      maxLimit: 30000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsNormalRoom: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 20000,
    },
  },
  {
    id: 'plan-15-o',
    code: '15-O',
    name: 'แผน 15-O',
    category: 'health',
    badge: 'ยอดนิยม ออฟฟิศ OPD+IPD',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'ครบทั้งผู้ป่วยใน (IPD) และผู้ป่วยนอก OPD โรคทั่วไป 500 บ./ครั้ง (9 ครั้ง/ปี)',
    monthlyPremium: 1890,
    annualPremium: 22680,
    minAge: 15,
    maxAge: 60,
    ageRangeText: '15 - 60 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: true,
        perVisit: 500,
        maxVisitsPerYear: 9,
        note: '500 บ. (9 ครั้ง/ปี)',
      },
    },
    dailyCompensation: {
      perNight: 300,
      maxLimit: 30000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsNormalRoom: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 20000,
    },
  },
  {
    id: 'plan-610-i',
    code: '610-I',
    name: 'แผน 610-I',
    category: 'health',
    badge: 'ข้าราชการ/รัฐวิสาหกิจ',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'เบี้ยสบายกระเป๋าเพียง 590 บ./เดือน คุ้มครองผู้ป่วยในและชีวิต 200,000 บ.',
    monthlyPremium: 590,
    annualPremium: 7080,
    minAge: 6,
    maxAge: 65,
    ageRangeText: '6 - 65 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 4000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครอง',
      },
    },
    dailyCompensation: {
      perNight: 300,
      maxLimit: 30000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsNormalRoom: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 20000,
    },
  },
  {
    id: 'plan-610-o',
    code: '610-O',
    name: 'แผน 610-O',
    category: 'health',
    badge: 'วัยเก๋า ชดเชยรายวันสูงพิเศษ',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    description: 'ชดเชยรายวันสูงสุด 1,200 บ./คืน (กรณีใช้สิทธิ์อื่นได้ 3,000 บ.) + OPD 500 บ. (9 ครั้ง/ปี)',
    monthlyPremium: 790,
    annualPremium: 9480,
    minAge: 6,
    maxAge: 65,
    ageRangeText: '6 - 65 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: true,
        perVisit: 500,
        maxVisitsPerYear: 9,
        note: '500 บ. (9 ครั้ง/ปี)',
      },
    },
    dailyCompensation: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค (สูงกว่าแผนอื่น 4 เท่า)',
    },
    otherRightsNormalRoom: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค (สูงกว่าแผนอื่น 2.5 เท่า)',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 3000,
      murderAssault: 3000,
      motorcycle: 3000,
      funeralBenefit: 3000,
    },
  },
  // ==========================================
  // แผนประกันอุบัติเหตุส่วนบุคคลเพิ่มเติม (Smile PA)
  // ==========================================
  {
    id: 'plan-pa-60',
    code: 'PA60',
    name: 'แผน PA60',
    category: 'pa',
    badge: 'อุบัติเหตุ 60 บ./เดือน',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'เบี้ย 60 บ./เดือน ค่ารักษาอุบัติเหตุ 10,000 บ./ครั้ง คุ้มครองชีวิต/ทุพพลภาพถาวร 200,000 บ.',
    monthlyPremium: 60,
    annualPremium: 720,
    minAge: 6,
    maxAge: 60,
    ageRangeText: '6 - 60 ปี',
    roomNormal: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    roomICU: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    medicalGeneralPerVisit: 0,
    surgeryPerDisorder: 0,
    doctorVisitPerNight: {
      perNight: 0,
      maxLimit: 0,
    },
    opd: {
      accident: 10000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครองโรคทั่วไป (คุ้มครองเฉพาะอุบัติเหตุ)',
      },
    },
    dailyCompensation: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีค่าชดเชยรายวัน',
    },
    otherRightsNormalRoom: {
      perNight: 0,
      maxLimit: 0,
    },
    otherRightsICU: {
      perNight: 0,
      maxLimit: 0,
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 0,
    },
    paSchedule: {
      permanentDisability: 200000,
      twoLimbsOrEyes: 200000,
      oneLimbOrEye: 120000,
      deafBothOrMute: 100000,
      thumbTwoJoints: 50000,
      deafOneEar: 30000,
      thumbOneJoint: 20000,
      indexFingerThreeJoints: 20000,
      indexFingerTwoJoints: 16000,
      indexFingerOneJoint: 8000,
      otherFingersTwoJoints: 10000,
      bigToe: 10000,
      otherFingersOneJoint: 2000,
    },
  },
  {
    id: 'plan-pa-90',
    code: 'PA90',
    name: 'แผน PA90',
    category: 'pa',
    badge: 'อุบัติเหตุ 90 บ./เดือน',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'เบี้ย 90 บ./เดือน ค่ารักษาอุบัติเหตุ 15,000 บ./ครั้ง คุ้มครองชีวิต/ทุพพลภาพถาวร 300,000 บ.',
    monthlyPremium: 90,
    annualPremium: 1080,
    minAge: 6,
    maxAge: 60,
    ageRangeText: '6 - 60 ปี',
    roomNormal: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    roomICU: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    medicalGeneralPerVisit: 0,
    surgeryPerDisorder: 0,
    doctorVisitPerNight: {
      perNight: 0,
      maxLimit: 0,
    },
    opd: {
      accident: 15000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครองโรคทั่วไป (คุ้มครองเฉพาะอุบัติเหตุ)',
      },
    },
    dailyCompensation: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีค่าชดเชยรายวัน',
    },
    otherRightsNormalRoom: {
      perNight: 0,
      maxLimit: 0,
    },
    otherRightsICU: {
      perNight: 0,
      maxLimit: 0,
    },
    life: {
      accidentGeneral: 300000,
      murderAssault: 150000,
      motorcycle: 150000,
      funeralBenefit: 0,
    },
    paSchedule: {
      permanentDisability: 300000,
      twoLimbsOrEyes: 300000,
      oneLimbOrEye: 180000,
      deafBothOrMute: 150000,
      thumbTwoJoints: 75000,
      deafOneEar: 45000,
      thumbOneJoint: 30000,
      indexFingerThreeJoints: 30000,
      indexFingerTwoJoints: 24000,
      indexFingerOneJoint: 12000,
      otherFingersTwoJoints: 15000,
      bigToe: 15000,
      otherFingersOneJoint: 3000,
    },
  },
  {
    id: 'plan-pa-120',
    code: 'PA120',
    name: 'แผน PA120',
    category: 'pa',
    badge: 'อุบัติเหตุ 120 บ./เดือน',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'เบี้ย 120 บ./เดือน ค่ารักษาอุบัติเหตุ 20,000 บ./ครั้ง คุ้มครองชีวิต/ทุพพลภาพถาวร 400,000 บ.',
    monthlyPremium: 120,
    annualPremium: 1440,
    minAge: 6,
    maxAge: 60,
    ageRangeText: '6 - 60 ปี',
    roomNormal: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    roomICU: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    medicalGeneralPerVisit: 0,
    surgeryPerDisorder: 0,
    doctorVisitPerNight: {
      perNight: 0,
      maxLimit: 0,
    },
    opd: {
      accident: 20000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครองโรคทั่วไป (คุ้มครองเฉพาะอุบัติเหตุ)',
      },
    },
    dailyCompensation: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีค่าชดเชยรายวัน',
    },
    otherRightsNormalRoom: {
      perNight: 0,
      maxLimit: 0,
    },
    otherRightsICU: {
      perNight: 0,
      maxLimit: 0,
    },
    life: {
      accidentGeneral: 400000,
      murderAssault: 200000,
      motorcycle: 200000,
      funeralBenefit: 0,
    },
    paSchedule: {
      permanentDisability: 400000,
      twoLimbsOrEyes: 400000,
      oneLimbOrEye: 240000,
      deafBothOrMute: 200000,
      thumbTwoJoints: 100000,
      deafOneEar: 60000,
      thumbOneJoint: 40000,
      indexFingerThreeJoints: 40000,
      indexFingerTwoJoints: 32000,
      indexFingerOneJoint: 16000,
      otherFingersTwoJoints: 20000,
      bigToe: 20000,
      otherFingersOneJoint: 4000,
    },
  },
  {
    id: 'plan-pa-150',
    code: 'PA150',
    name: 'แผน PA150',
    category: 'pa',
    badge: 'อุบัติเหตุ 150 บ./เดือน',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'เบี้ย 150 บ./เดือน ค่ารักษาอุบัติเหตุ 25,000 บ./ครั้ง คุ้มครองชีวิต/ทุพพลภาพถาวร 500,000 บ.',
    monthlyPremium: 150,
    annualPremium: 1800,
    minAge: 6,
    maxAge: 60,
    ageRangeText: '6 - 60 ปี',
    roomNormal: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    roomICU: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีสิทธิ์ค่าห้อง (แผนอุบัติเหตุ PA)',
    },
    medicalGeneralPerVisit: 0,
    surgeryPerDisorder: 0,
    doctorVisitPerNight: {
      perNight: 0,
      maxLimit: 0,
    },
    opd: {
      accident: 25000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครองโรคทั่วไป (คุ้มครองเฉพาะอุบัติเหตุ)',
      },
    },
    dailyCompensation: {
      perNight: 0,
      maxLimit: 0,
      note: 'ไม่มีค่าชดเชยรายวัน',
    },
    otherRightsNormalRoom: {
      perNight: 0,
      maxLimit: 0,
    },
    otherRightsICU: {
      perNight: 0,
      maxLimit: 0,
    },
    life: {
      accidentGeneral: 500000,
      murderAssault: 250000,
      motorcycle: 250000,
      funeralBenefit: 0,
    },
    paSchedule: {
      permanentDisability: 500000,
      twoLimbsOrEyes: 500000,
      oneLimbOrEye: 300000,
      deafBothOrMute: 250000,
      thumbTwoJoints: 125000,
      deafOneEar: 75000,
      thumbOneJoint: 50000,
      indexFingerThreeJoints: 50000,
      indexFingerTwoJoints: 40000,
      indexFingerOneJoint: 20000,
      otherFingersTwoJoints: 25000,
      bigToe: 25000,
      otherFingersOneJoint: 5000,
    },
  },
];

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('th-TH').format(val);
};

export interface DiffRowItem {
  id: string;
  category: string;
  title: string;
  subTitle?: string;
  values: { [planId: string]: string };
  isDifferent: boolean;
  highlightNote?: string;
}

export function analyzeDifferences(selectedPlans: InsurancePlan[]): DiffRowItem[] {
  if (selectedPlans.length === 0) return [];

  const rows: {
    id: string;
    category: string;
    title: string;
    subTitle?: string;
    getter: (p: InsurancePlan) => string;
    highlightNote?: string;
  }[] = [
    // ข้อมูลทั่วไปและคุณสมบัติ
    {
      id: 'plan-age-range',
      category: 'คุณสมบัติผู้สมัคร',
      title: 'เกณฑ์อายุที่รับประกันภัย',
      subTitle: 'ช่วงอายุผู้เอาประกันภัยที่สามารถสมัครได้',
      getter: (p) => p.ageRangeText,
      highlightNote: 'แผนตระกูล 15 รับอายุ 15-60 ปี ส่วนแผน 610 ขยายรับอายุ 6-65 ปี',
    },
    // เบี้ยประกัน
    {
      id: 'premium-monthly',
      category: 'เบี้ยประกันภัย',
      title: 'เบี้ยประกันภัยรายเดือน',
      subTitle: 'คำนวณชำระแบบรายเดือน',
      getter: (p) => `${formatCurrency(p.monthlyPremium)} บาท`,
    },
    {
      id: 'premium-annual',
      category: 'เบี้ยประกันภัย',
      title: 'เบี้ยประกันภัยรายปี',
      subTitle: 'คำนวณชำระแบบรายปี',
      getter: (p) => `${formatCurrency(p.annualPremium)} บาท`,
    },
    // ส่วนที่ 1: ค่าห้อง ค่าอาหาร
    {
      id: 'room-normal',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '1.1 ค่าห้อง ค่าอาหาร ผู้ป่วยปกติ ต่อคืน',
      subTitle: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่มีสิทธิ์ค่าห้อง'
          : `${formatCurrency(p.roomNormal.perNight)} บ. (สูงสุด ${formatCurrency(p.roomNormal.maxLimit)} บ.)`,
    },
    {
      id: 'room-icu',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '1.2 ค่าห้อง ค่าอาหาร ผู้ป่วยหนัก ICU ต่อคืน',
      subTitle: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่มีสิทธิ์ค่าห้อง'
          : `${formatCurrency(p.roomICU.perNight)} บ. (สูงสุด ${formatCurrency(p.roomICU.maxLimit)} บ.)`,
    },
    {
      id: 'room-combined-max-limit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '1.3 รวมวงเงินค่าห้องปกติ + ICU สูงสุดต่อครั้ง',
      subTitle: 'คำนวณจากห้องปกติ 45 คืน + ICU 30 คืน',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่มีสิทธิ์ค่าห้อง'
          : `${formatCurrency(p.roomNormal.maxLimit + p.roomICU.maxLimit)} บาท`,
    },
    {
      id: 'med-general',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.1 ค่ารักษาพยาบาล และค่าบริการทั่วไป ต่อครั้ง',
      subTitle: 'เบิกจ่ายตามจริงในวงเงิน',
      getter: (p) =>
        p.category === 'pa'
          ? 'คุ้มครองเฉพาะอุบัติเหตุ'
          : `${formatCurrency(p.medicalGeneralPerVisit)} บาท`,
    },
    {
      id: 'surgery',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.2 การรักษาโดยการผ่าตัด ต่อโรค',
      subTitle: 'เบิกตามค่าใช้จ่ายจริง ไม่เกินวงเงิน',
      getter: (p) =>
        p.category === 'pa'
          ? 'คุ้มครองเฉพาะอุบัติเหตุ'
          : `${formatCurrency(p.surgeryPerDisorder)} บาท`,
    },
    {
      id: 'med-inpatient-subtotal',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.4 รวมค่ารักษาพยาบาลผู้ป่วยใน (รักษาทั่วไป + ผ่าตัด)',
      subTitle: 'รวมวงเงินค่ารักษาและผ่าตัดต่อครั้ง',
      getter: (p) =>
        p.category === 'pa'
          ? 'คุ้มครองเฉพาะอุบัติเหตุ'
          : `${formatCurrency(p.medicalGeneralPerVisit + p.surgeryPerDisorder)} บาท`,
    },
    {
      id: 'doctor-visit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.3 ค่าแพทย์ตรวจเยี่ยมไข้ ผู้ป่วยใน ต่อคืน',
      subTitle: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
      getter: (p) =>
        p.category === 'pa'
          ? 'คุ้มครองเฉพาะอุบัติเหตุ'
          : `${formatCurrency(p.doctorVisitPerNight.perNight)} บ. (สูงสุด ${formatCurrency(p.doctorVisitPerNight.maxLimit)} บ.)`,
    },
    {
      id: 'med-inpatient-max-limit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.5 รวมผลประโยชน์ค่ารักษาพยาบาลผู้ป่วยในสูงสุด ต่อการรักษาครั้งหนึ่ง',
      subTitle: 'ค่าห้องปกติ 45 คืน + ค่ารักษาทั่วไป + ผ่าตัด + ค่าแพทย์ 45 คืน',
      getter: (p) =>
        p.category === 'pa'
          ? 'คุ้มครองเฉพาะอุบัติเหตุ'
          : `${formatCurrency(p.roomNormal.maxLimit + p.medicalGeneralPerVisit + p.surgeryPerDisorder + p.doctorVisitPerNight.maxLimit)} บาท`,
    },
    {
      id: 'opd-accident',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '3.1 OPD กรณีอุบัติเหตุ ต่อครั้ง',
      subTitle: 'ไม่จำกัดจำนวนครั้ง',
      getter: (p) => `${formatCurrency(p.opd.accident)} บาท`,
      highlightNote: 'แผน PA คุ้มครองค่ารักษาอุบัติเหตุสูง 10,000 - 25,000 บ./ครั้ง',
    },
    {
      id: 'opd-illness',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '3.2 OPD กรณีโรคภัยไข้เจ็บ ต่อครั้ง',
      subTitle: 'พบแพทย์ผู้ป่วยนอก ไม่ต้องนอนโรงพยาบาล',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่คุ้มครองโรคทั่วไป'
          : p.opd.illness.covered
          ? `${formatCurrency(p.opd.illness.perVisit || 0)} บ. (${p.opd.illness.maxVisitsPerYear} ครั้ง/ปี)`
          : 'ไม่คุ้มครอง',
      highlightNote: 'แผน 15-O และ 610-O มีความคุ้มครอง OPD โรคทั่วไป 500 บ./ครั้ง (9 ครั้ง/ปี)',
    },
    {
      id: 'opd-total-per-visit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '3.3 รวมค่ารักษาพยาบาลผู้ป่วยนอก (OPD) สูงสุดต่อครั้ง',
      subTitle: 'รวมอุบัติเหตุฉุกเฉิน และ OPD โรคทั่วไป',
      getter: (p) =>
        `${formatCurrency(
          p.opd.accident + (p.opd.illness.covered ? p.opd.illness.perVisit || 0 : 0)
        )} บาท`,
    },
    // ส่วนที่ 2: ค่าชดเชย
    {
      id: 'daily-comp',
      category: 'ส่วนที่ 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยรายวัน',
      title: '1. ค่าชดเชยการนอนโรงพยาบาล ผู้ป่วยใน ต่อคืน',
      subTitle: 'สูงสุด ต่อครั้ง ต่อโรค',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่มีเงินชดเชย'
          : `${formatCurrency(p.dailyCompensation.perNight)} บ./คืน (สูงสุด ${formatCurrency(p.dailyCompensation.maxLimit)} บ.)`,
      highlightNote: 'แผน 610-O ชดเชยสูง 1,200 บ./คืน (สูงสุด 54,000 บ.) ขณะที่แผนอื่นได้ 300 บ./คืน',
    },
    {
      id: 'other-rights-normal',
      category: 'ส่วนที่ 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยรายวัน',
      title: '2.1 ชดเชยกรณีใช้สิทธิ์อื่น (ห้องปกติ ต่อคืน)',
      subTitle: 'เบิกจ่ายจากสิทธิ์ราชการ, ประกันสังคม ฯลฯ ไม่ใช้ส่วนที่ 1',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่มีเงินชดเชย'
          : `${formatCurrency(p.otherRightsNormalRoom.perNight)} บ./คืน (สูงสุด ${formatCurrency(p.otherRightsNormalRoom.maxLimit)} บ.)`,
      highlightNote: 'แผน 610-O ชดเชยสูง 3,000 บ./คืน (สูงสุด 90,000 บ.) สูงกว่าแผนอื่น',
    },
    {
      id: 'other-rights-icu',
      category: 'ส่วนที่ 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยรายวัน',
      title: '2.2 ชดเชยกรณีใช้สิทธิ์อื่น (ห้อง ICU ต่อคืน)',
      subTitle: 'สูงสุด ต่อครั้ง ต่อโรค',
      getter: (p) =>
        p.category === 'pa'
          ? 'ไม่มีเงินชดเชย'
          : `${formatCurrency(p.otherRightsICU.perNight)} บ./คืน (สูงสุด ${formatCurrency(p.otherRightsICU.maxLimit)} บ.)`,
    },
    // ส่วนที่ 3: เสียชีวิต
    {
      id: 'life-accident',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '1. เสียชีวิต/ทุพพลภาพ จากอุบัติเหตุทั่วไป (อบ.2)',
      subTitle: 'คุ้มครองการเสียชีวิต สูญเสียอวัยวะ สายตา หรือทุพพลภาพ',
      getter: (p) => `${formatCurrency(p.life.accidentGeneral)} บาท`,
      highlightNote: 'แผน PA ให้ทุนคุ้มครองอุบัติเหตุสูงถึง 200,000 - 500,000 บาท',
    },
    {
      id: 'life-murder',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '2. เสียชีวิตจากถูกฆาตกรรม / ลอบทำร้าย',
      subTitle: 'ความคุ้มครองกรณีถูกทำร้ายร่างกาย',
      getter: (p) => `${formatCurrency(p.life.murderAssault)} บาท`,
    },
    {
      id: 'life-motorcycle',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '3. เสียชีวิตจากการขับขี่/โดยสารรถจักรยานยนต์',
      subTitle: 'กรณีอุบัติเหตุยานยนต์ 2 ล้อ',
      getter: (p) => `${formatCurrency(p.life.motorcycle)} บาท`,
    },
    {
      id: 'life-funeral',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '4. ผลประโยชน์ค่าปลงศพ กรณีเสียชีวิตจากการเจ็บป่วย',
      subTitle: 'ระยะเวลารอคอย 180 วัน',
      getter: (p) =>
        p.category === 'pa' ? 'ไม่มีค่าปลงศพ' : `${formatCurrency(p.life.funeralBenefit)} บาท`,
      highlightNote: 'แผนสุขภาพ 15-I, 15-O, 610-I มีค่าปลงศพ 20,000 บ. ส่วนแผน PA เน้นคุ้มครองอุบัติเหตุ',
    },
    // ส่วนที่ 4: ตารางผลประโยชน์อุบัติเหตุ อบ.2
    {
      id: 'pa-permanent-disability',
      category: 'ส่วนที่ 4: ตารางผลประโยชน์ความคุ้มครองอุบัติเหตุ อบ.2',
      title: '1. กรณีทุพพลภาพโดยถาวร (100%)',
      subTitle: 'ทุพพลภาพถาวรสิ้นเชิงจากอุบัติเหตุ',
      getter: (p) =>
        `${formatCurrency(
          p.paSchedule?.permanentDisability ?? p.life.accidentGeneral
        )} บาท`,
    },
    {
      id: 'pa-two-limbs',
      category: 'ส่วนที่ 4: ตารางผลประโยชน์ความคุ้มครองอุบัติเหตุ อบ.2',
      title: '2. สูญเสียอวัยวะ 2 ข้างขึ้นไป (100%)',
      subTitle: 'มือ เท้า สายตา 2 ข้างขึ้นไป',
      getter: (p) =>
        `${formatCurrency(
          p.paSchedule?.twoLimbsOrEyes ?? p.life.accidentGeneral
        )} บาท`,
    },
    {
      id: 'pa-one-limb',
      category: 'ส่วนที่ 4: ตารางผลประโยชน์ความคุ้มครองอุบัติเหตุ อบ.2',
      title: '3. สูญเสียอวัยวะ 1 ข้าง (60%)',
      subTitle: 'มือ เท้า หรือสายตา 1 ข้าง',
      getter: (p) =>
        `${formatCurrency(
          p.paSchedule?.oneLimbOrEye ?? Math.round(p.life.accidentGeneral * 0.6)
        )} บาท`,
    },
    {
      id: 'pa-accident-treatment',
      category: 'ส่วนที่ 4: ตารางผลประโยชน์ความคุ้มครองอุบัติเหตุ อบ.2',
      title: '4. ค่ารักษาพยาบาลต่ออุบัติเหตุแต่ละครั้ง',
      subTitle: 'ใช้ใบเสร็จตัวจริง + ใบรับรองแพทย์ ไม่จำกัดจำนวนครั้ง',
      getter: (p) => `${formatCurrency(p.opd.accident)} บาท`,
    },
  ];

  return rows.map((r) => {
    const values: { [planId: string]: string } = {};
    const valueSet = new Set<string>();

    selectedPlans.forEach((plan) => {
      const val = r.getter(plan);
      values[plan.id] = val;
      valueSet.add(val);
    });

    return {
      id: r.id,
      category: r.category,
      title: r.title,
      subTitle: r.subTitle,
      values,
      isDifferent: selectedPlans.length > 1 && valueSet.size > 1,
      highlightNote: r.highlightNote,
    };
  });
}

export type AudienceType =
  | 'government'
  | 'office'
  | 'senior'
  | 'lumpsum'
  | 'general'
  | 'private';

export interface PlanPrimaryAudienceInfo {
  type: 'private' | 'government' | 'general' | 'senior' | 'lumpsum' | 'office';
  audienceGroup: 'government' | 'office' | 'senior' | 'lumpsum' | 'general';
  label: string;
  badgeColor: string;
  colorName: 'gold' | 'green' | 'pink' | 'blue';
  tags: ('government' | 'office' | 'senior' | 'lumpsum' | 'general')[];
}

export function getPlanPrimaryAudience(planId: string): PlanPrimaryAudienceInfo {
  switch (planId) {
    case 'plan-15-i':
      return {
        type: 'lumpsum',
        audienceGroup: 'lumpsum',
        label: '🏥 เหมาจ่าย',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400/20',
        colorName: 'blue',
        tags: ['lumpsum', 'office'],
      };
    case 'plan-15-o':
      return {
        type: 'office',
        audienceGroup: 'office',
        label: '🏢 ออฟฟิศ',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20',
        colorName: 'green',
        tags: ['office', 'general'],
      };
    case 'plan-610-i':
      return {
        type: 'government',
        audienceGroup: 'government',
        label: '🏛️ ข้าราชการ',
        badgeColor: 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/20',
        colorName: 'gold',
        tags: ['government', 'lumpsum'],
      };
    case 'plan-610-o':
      return {
        type: 'senior',
        audienceGroup: 'senior',
        label: '🧓 วัยเก๋า',
        badgeColor: 'bg-pink-50 text-pink-800 border-pink-300 ring-1 ring-pink-400/20',
        colorName: 'pink',
        tags: ['senior', 'general'],
      };
    case 'plan-pa-60':
      return {
        type: 'general',
        audienceGroup: 'general',
        label: '👤 บุคคลทั่วไป',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400/20',
        colorName: 'blue',
        tags: ['general'],
      };
    case 'plan-pa-90':
      return {
        type: 'office',
        audienceGroup: 'office',
        label: '🏢 ออฟฟิศ',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20',
        colorName: 'green',
        tags: ['office'],
      };
    case 'plan-pa-120':
      return {
        type: 'government',
        audienceGroup: 'government',
        label: '🏛️ ข้าราชการ',
        badgeColor: 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/20',
        colorName: 'gold',
        tags: ['government'],
      };
    case 'plan-pa-150':
      return {
        type: 'government',
        audienceGroup: 'government',
        label: '🏛️ ข้าราชการ',
        badgeColor: 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/20',
        colorName: 'gold',
        tags: ['government'],
      };
    default:
      return {
        type: 'general',
        audienceGroup: 'general',
        label: '👤 บุคคลทั่วไป',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400/20',
        colorName: 'blue',
        tags: ['general'],
      };
  }
}

/**
 * Get tailored benefits description for Private Sector, Government/State Enterprise, and General Public
 */
export function getPlanTargetAudience(planId: string, customAudience?: PlanTargetAudience): PlanTargetAudience {
  if (customAudience && customAudience.privateSector && customAudience.government && customAudience.generalPublic) {
    return customAudience;
  }
  switch (planId) {
    case 'plan-15-i':
      return {
        privateSector: 'Top-up สิทธิ ปกส./ประกันกลุ่ม ค่าห้อง 1,200 บ. + ผ่าตัด 30,000 บ.',
        government: 'เสริมค่าห้องพิเศษ + แพทย์เยี่ยมไข้ + ชดเชยรายวัน 300 บ./วัน',
        generalPublic: 'แผนหลักราคาประหยัด จ่าย 1,590 บ./เดือน คุ้มครองชีวิต 2 แสน',
      };
    case 'plan-15-o':
      return {
        privateSector: 'ครบทั้ง IPD และ OPD 500 บ./ครั้ง (9 ครั้ง/ปี) ไม่ต้องรอคิว ปกส.',
        government: 'ใช้พบแพทย์คลินิกพิเศษนอกเวลา + เสริมค่าห้องส่วนเกิน 1,200 บ.',
        generalPublic: 'ยอดนิยมครบวงจร รวมหาหมอหวัด ท้องเสีย สบายใจ 1,890 บ./เดือน',
      };
    case 'plan-610-i':
      return {
        privateSector: 'อัปเกรดนอน รพ.เอกชน ค่าห้อง 2,000 บ. ผ่าตัด 40,000 บ. ชีวิต 3 แสน',
        government: 'เติมเต็มค่าห้องเดี่ยวมาตรฐาน + รับเงินชดเชยรายวัน 500 บ./วัน',
        generalPublic: 'ความคุ้มครองพรีเมียมทุกวัย (6-65 ปี) เบี้ยเริ่ม 1,890 บ./เดือน',
      };
    case 'plan-610-o':
      return {
        privateSector: 'OPD สูง 1,000 บ./ครั้ง (12 ครั้ง/ปี) นอนห้องเดี่ยวสบาย เบิกได้เต็ม',
        government: 'ยกระดับความคุ้มครองสูงสุด คลินิกนอกเวลา + ชดเชย 500 บ./วัน',
        generalPublic: 'แพ็กเกจสูงสุดสำหรับครอบครัวและเด็กเล็ก สบายใจทุกการรักษา',
      };
    case 'plan-pa-60':
      return {
        privateSector: 'อุบัติเหตุ 24 ชม. ทั่วโลก ทุน 1 แสน ค่ารักษา 5,000 บ. ไม่ต้องสำรองจ่าย',
        government: 'เสริมคุ้มครองการเดินทาง ขับขี่มอเตอร์ไซค์ และลอบทำร้าย',
        generalPublic: 'เบี้ยถูกที่สุดเพียง 60 บ./เดือน (2 บ./วัน) อุ่นใจทุกอุบัติเหตุ',
      };
    case 'plan-pa-90':
      return {
        privateSector: 'ทุนอุบัติเหตุ 1.5 แสน ค่ารักษา 7,500 บ./ครั้ง บัตรแคร์การ์ดรูดจ่ายได้',
        government: 'เสริมสวัสดิการอุบัติเหตุครอบคลุม 24 ชม. ทั่วประเทศ',
        generalPublic: 'เบี้ยคุ้มค่าเพียง 90 บ./เดือน (3 บ./วัน) อุ่นใจทุกงาน',
      };
    case 'plan-pa-120':
      return {
        privateSector: 'ทุน 2 แสน ค่ารักษา 10,000 บ./ครั้ง เหมาะกับสายเดินทางและเซลส์',
        government: 'วงเงินค่ารักษาและคุ้มครองชีวิตสูง ปลอดภัยทุกภารกิจ',
        generalPublic: 'เหมาะกับผู้ประกอบอาชีพอิสระ ค้าขาย สัญจรประจำ',
      };
    case 'plan-pa-150':
      return {
        privateSector: 'วงเงินอุบัติเหตุสูงสุด ทุน 3 แสน ค่ารักษา 15,000 บ./ครั้ง',
        government: 'คุ้มครองเต็มแม็กซ์ เสริมความมั่นคงสูงสุดให้ครอบครัว',
        generalPublic: 'ชดเชยและค่ารักษาอุบัติเหตุระดับพรีเมียม เพียง 5 บ./วัน',
      };
    default:
      return {
        privateSector: 'เสริมสวัสดิการพนักงานเอกชนและประกันสังคม',
        government: 'เสริมสิทธิเบิกจ่ายตรงและค่าห้องพิเศษ',
        generalPublic: 'แบ่งจ่ายรายเดือนได้ คุ้มครองครอบคลุม',
      };
  }
}

