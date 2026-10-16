import { CustomerProfile } from '../types';

/**
 * Mock database of existing customers for demonstration.
 * In a real production environment, this would call a backend customer CRM/Policy API.
 */
export const MOCK_EXISTING_CUSTOMERS: CustomerProfile[] = [
  {
    idCard: '1100501234567',
    fullName: 'สมชาย มั่นคงดี',
    birthDate: '1985-06-15',
    age: 41,
    phone: '081-445-6789',
    existingPlanId: 'plan-15-i',
    policyNumber: 'POL-2022-8910',
    startDate: '15 มิ.ย. 2565',
    lossClaimRate: 15,
    lossClaimStatus: '15% (ประวัติดี)',
    lineOaRegistered: true,
    lineOaStatusText: 'ลงทะเบียนแล้ว',
    policies: [
      {
        policyNumber: 'POL-2022-8910',
        planId: 'plan-15-i',
        policyType: 'health',
        customPlanName: 'แผน 15-I (ผู้ป่วยในเหมาจ่าย)',
        startDate: '15 มิ.ย. 2565',
        monthlyPremium: 430,
        annualPremium: 5160,
        lossClaimRate: 15,
        lossClaimStatus: '15% (ประวัติดี)',
      },
      {
        policyNumber: 'POL-PA-2023-4011',
        planId: 'plan-pa-60',
        policyType: 'pa',
        customPlanName: 'แผน PA 60 (อุบัติเหตุส่วนบุคคล)',
        startDate: '10 ม.ค. 2566',
        monthlyPremium: 60,
        annualPremium: 720,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
      },
      {
        policyNumber: 'VMI-2023-8899',
        policyType: 'motor',
        customPlanName: 'ประกันภัยรถยนต์ ประเภท 1 (ซ่อมห้าง)',
        companyName: 'สยามสไมล์ / เมืองไทยประกันภัย',
        startDate: '20 ส.ค. 2566',
        endDate: '20 ส.ค. 2568',
        annualPremium: 18500,
        monthlyPremium: 1542,
        sumInsured: 650000,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ไม่มีเคลม / ส่วนลดประวัติดี 20%)',
        vehicleDetails: {
          licensePlate: '3ขก-8821 กทม.',
          brandModel: 'Toyota Corolla Cross Hybrid (ปี 2022)',
          insuranceClass: 'ชั้น 1',
          repairType: 'ซ่อมห้าง',
          sumInsured: 650000,
        },
        notes: 'คุ้มครองตัวรถชน สูญหาย ไฟไหม้ น้ำท่วม และค่ารักษาพยาบาลผู้ขับขี่/ผู้โดยสาร',
      },
      {
        policyNumber: 'CMI-2024-5510',
        policyType: 'motor',
        customPlanName: 'พ.ร.บ. คุ้มครองผู้ประสบภัยจากรถ (เก๋ง)',
        companyName: 'บมจ. กลางคุ้มครองผู้ประสบภัยจากรถ',
        startDate: '20 ส.ค. 2567',
        endDate: '20 ส.ค. 2568',
        annualPremium: 645,
        monthlyPremium: 54,
        sumInsured: 500000,
        vehicleDetails: {
          licensePlate: '3ขก-8821 กทม.',
          brandModel: 'Toyota Corolla Cross',
          insuranceClass: 'พ.ร.บ.',
          sumInsured: 500000,
        },
      },
    ],
  },
  {
    idCard: '3200109876543',
    fullName: 'วิภาดา วงศ์สุวรรณ',
    birthDate: '1992-11-20',
    age: 33,
    phone: '089-123-4567',
    existingPlanId: 'plan-610-i',
    policyNumber: 'POL-2023-4321',
    startDate: '20 พ.ย. 2566',
    lossClaimRate: 0,
    lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
    lineOaRegistered: true,
    lineOaStatusText: 'ลงทะเบียนแล้ว',
    policies: [
      {
        policyNumber: 'POL-2023-4321',
        planId: 'plan-610-i',
        policyType: 'health',
        customPlanName: 'แผน 610-I (เหมาจ่ายระดับพรีเมียม)',
        startDate: '20 พ.ย. 2566',
        monthlyPremium: 690,
        annualPremium: 8280,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
      },
      {
        policyNumber: 'VMI-2024-1144',
        policyType: 'motor',
        customPlanName: 'ประกันภัยรถยนต์ ประเภท 2+ (คุ้มครองรถชน สูญหาย ไฟไหม้)',
        companyName: 'สยามสไมล์ / ทิพยประกันภัย',
        startDate: '15 ม.ค. 2567',
        endDate: '15 ม.ค. 2568',
        annualPremium: 7900,
        monthlyPremium: 658,
        sumInsured: 350000,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ประวัติดี)',
        vehicleDetails: {
          licensePlate: 'กต-5541 เชียงใหม่',
          brandModel: 'Honda City Turbo 1.0 (ปี 2021)',
          insuranceClass: 'ชั้น 2+',
          repairType: 'ซ่อมอู่มาตรฐาน',
          sumInsured: 350000,
        },
      },
      {
        policyNumber: 'CMI-2024-3321',
        policyType: 'motor',
        customPlanName: 'พ.ร.บ. คุ้มครองผู้ประสบภัยจากรถ',
        companyName: 'บมจ. กลางคุ้มครองผู้ประสบภัยจากรถ',
        startDate: '15 ม.ค. 2567',
        annualPremium: 645,
        monthlyPremium: 54,
        vehicleDetails: {
          licensePlate: 'กต-5541 เชียงใหม่',
          brandModel: 'Honda City',
          insuranceClass: 'พ.ร.บ.',
        },
      },
    ],
  },
  {
    idCard: '1509900345678',
    fullName: 'กิตติศักดิ์ เจริญพร',
    birthDate: '1976-03-10',
    age: 50,
    phone: '086-778-9900',
    existingPlanId: 'plan-15-o',
    policyNumber: 'POL-2021-1122',
    startDate: '10 มี.ค. 2564',
    lossClaimRate: 48,
    lossClaimStatus: '48% (ปกติ)',
    lineOaRegistered: false,
    lineOaStatusText: 'ยังไม่ลงทะเบียน',
    policies: [
      {
        policyNumber: 'POL-2021-1122',
        planId: 'plan-15-o',
        policyType: 'health',
        customPlanName: 'แผน 15-O (คุ้มครอง OPD พิเศษ)',
        startDate: '10 มี.ค. 2564',
        monthlyPremium: 580,
        annualPremium: 6960,
        lossClaimRate: 48,
        lossClaimStatus: '48% (ปกติ)',
      },
      {
        policyNumber: 'VMI-2023-6622',
        policyType: 'motor',
        customPlanName: 'ประกันภัยรถกระบะ ประเภท 1 (ซ่อมอู่)',
        companyName: 'สยามสไมล์ / วิริยะประกันภัย',
        startDate: '5 เม.ย. 2566',
        endDate: '5 เม.ย. 2568',
        annualPremium: 14800,
        monthlyPremium: 1233,
        sumInsured: 520000,
        lossClaimRate: 20,
        lossClaimStatus: '20% (เคลมกระจกหน้า 1 ครั้ง)',
        vehicleDetails: {
          licensePlate: 'ผข-1234 ขอนแก่น',
          brandModel: 'Isuzu D-Max Hi-Lander 4 ประตู (ปี 2020)',
          insuranceClass: 'ชั้น 1',
          repairType: 'ซ่อมอู่ในเครือ',
          sumInsured: 520000,
        },
      },
      {
        policyNumber: 'FIR-2022-7711',
        policyType: 'fire',
        customPlanName: 'ประกันภัยบ้านและอัคคีภัย Smile Home Security',
        companyName: 'สยามสไมล์โบรกเกอร์',
        startDate: '10 มี.ค. 2565',
        endDate: '10 มี.ค. 2568',
        annualPremium: 3200,
        monthlyPremium: 267,
        sumInsured: 2500000,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
        notes: 'คุ้มครองไฟไหม้ ฟ้าผ่า ระเบิด ภัยน้ำท่วม และโจรกรรมทรัพย์สินในบ้าน',
      },
    ],
  },
  {
    idCard: '1101234567890',
    fullName: 'นภาภรณ์ รัตนโชติ',
    birthDate: '2015-08-25',
    age: 10,
    phone: '090-987-6543',
    existingPlanId: 'plan-610-o',
    policyNumber: 'POL-2024-5566',
    startDate: '25 ส.ค. 2567',
    lossClaimRate: 0,
    lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
    lineOaRegistered: false,
    lineOaStatusText: 'ยังไม่ลงทะเบียน',
    policies: [
      {
        policyNumber: 'POL-2024-5566',
        planId: 'plan-610-o',
        policyType: 'health',
        customPlanName: 'แผน 610-O (เด็กเล็กคุ้มครอง OPD พิเศษ)',
        startDate: '25 ส.ค. 2567',
        monthlyPremium: 890,
        annualPremium: 10680,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
      },
      {
        policyNumber: 'PA-STU-2024-0012',
        policyType: 'pa',
        customPlanName: 'ประกันอุบัติเหตุนักเรียน Smile Student PA',
        companyName: 'สยามสไมล์',
        startDate: '16 พ.ค. 2567',
        annualPremium: 450,
        monthlyPremium: 38,
        sumInsured: 100000,
        lossClaimRate: 0,
        lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
      },
    ],
  },
];

/**
 * Calculate precise age in years from birthdate string (YYYY-MM-DD)
 */
export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Calculate detailed age in years, months, and days for display
 */
export function calculateDetailedAge(birthDateString: string): {
  years: number;
  months: number;
  days: number;
  displayText: string;
} {
  if (!birthDateString) {
    return { years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' };
  }

  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) {
    return { years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' };
  }

  const today = new Date();
  if (birth > today) {
    return { years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' };
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  years = Math.max(0, years);
  months = Math.max(0, months);
  days = Math.max(0, days);

  return {
    years,
    months,
    days,
    displayText: `อายุ : ${years} ปี ${months} เดือน ${days} วัน`,
  };
}

/**
 * Format date string into Thai Buddhist Era string (DD/MM/BBBB)
 */
export function formatThaiBuddhistDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parts[1];
  const day = parts[2];
  if (isNaN(year)) return dateStr;
  const thaiYear = year + 543;
  return `${day}/${month}/${thaiYear}`;
}


/**
 * Search existing customer by ID card or full name (case-insensitive substring match)
 */
export function searchExistingCustomer(query: string): CustomerProfile | null {
  const cleanQuery = query.trim().replace(/-/g, '');
  if (!cleanQuery) return null;

  return (
    MOCK_EXISTING_CUSTOMERS.find((c) => {
      const cleanId = c.idCard.replace(/-/g, '');
      const cleanName = c.fullName.replace(/\s+/g, '');
      const searchTarget = cleanQuery.replace(/\s+/g, '');
      return cleanId.includes(searchTarget) || cleanName.includes(searchTarget) || c.fullName.includes(query.trim());
    }) || null
  );
}

const THAI_MONTH_MAP: { [key: string]: number } = {
  'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
  'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11,
  'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5,
  'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11,
};

/**
 * Calculate policy duration in years, months, and days from start date
 */
export function calculatePolicyDuration(startDateStr: string): {
  years: number;
  months: number;
  days: number;
  displayText: string;
} {
  if (!startDateStr) {
    return { years: 0, months: 0, days: 0, displayText: '-' };
  }

  let startDate: Date | null = null;
  const thaiMatch = startDateStr.trim().match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/);
  if (thaiMatch) {
    const day = parseInt(thaiMatch[1], 10);
    const monthKey = thaiMatch[2];
    let year = parseInt(thaiMatch[3], 10);
    if (year > 2400) year -= 543;
    const month = THAI_MONTH_MAP[monthKey] ?? 0;
    startDate = new Date(year, month, day);
  } else {
    const parsed = new Date(startDateStr);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
    }
  }

  if (!startDate || isNaN(startDate.getTime())) {
    return { years: 0, months: 0, days: 0, displayText: startDateStr };
  }

  const today = new Date();
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  years = Math.max(0, years);
  months = Math.max(0, months);
  days = Math.max(0, days);

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ปี`);
  if (months > 0) parts.push(`${months} เดือน`);
  if (days > 0 || (years === 0 && months === 0)) parts.push(`${days} วัน`);

  return {
    years,
    months,
    days,
    displayText: parts.join(' '),
  };
}
