import React, { useState, useEffect } from 'react';
import {
  Shield,
  Home,
  Plane,
  HeartHandshake,
  Copy,
  Check,
  Printer,
  Sparkles,
  Info,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  RotateCcw,
  Share2,
  CreditCard,
  Send,
  UserCheck,
} from 'lucide-react';
import {
  InsuranceTypeCode,
  LIFE_PLANS,
  HOME_PLANS,
  TRAVEL_PLANS,
  calculateLifePremium,
  calculateHomePremium,
  calculateTravelPremium,
} from '../data/premiumCodes';
import { CustomerProfile, CustomerPolicyItem } from '../types';
import {
  ForwardCustomerModal,
  PlanCodeProposalData,
} from './ForwardCustomerModal';
import { PaymentModal } from './PaymentModal';

interface PremiumCodeLookupProps {
  initialType?: InsuranceTypeCode;
  existingCustomer?: CustomerProfile | null;
  currentAge?: number | null;
  onBackToBrochure?: () => void;
  onShowToast?: (msg: string) => void;
  onAssignPlanToCustomer?: (customer: CustomerProfile, newPolicy: CustomerPolicyItem) => void;
}

export const PremiumCodeLookup: React.FC<PremiumCodeLookupProps> = ({
  initialType = 'life',
  existingCustomer,
  currentAge,
  onBackToBrochure,
  onShowToast,
  onAssignPlanToCustomer,
}) => {
  const [activeType, setActiveType] = useState<InsuranceTypeCode>(initialType);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal states for Forward to Customer & Direct Payment
  const [isForwardModalOpen, setIsForwardModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] = useState<PlanCodeProposalData | null>(null);
  const [checkoutCustomerName, setCheckoutCustomerName] = useState<string>(
    existingCustomer ? `คุณ${existingCustomer.fullName}` : 'คุณลูกค้าสยามสไมล์'
  );
  const [checkoutCustomerPhone, setCheckoutCustomerPhone] = useState<string>(
    existingCustomer?.phone || '081-445-6789'
  );

  // Sync when initialType prop changes from sidebar clicks
  useEffect(() => {
    setActiveType(initialType);
  }, [initialType]);

  // ------------------ Life Insurance Form State ------------------
  const [lifePlanCode, setLifePlanCode] = useState<string>(LIFE_PLANS[0].code);
  const [lifeCategoryFilter, setLifeCategoryFilter] = useState<string>('all');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(currentAge || (existingCustomer?.age ? existingCustomer.age : 35));
  const [lifeSumInsured, setLifeSumInsured] = useState<number>(500000);
  const [paymentMode, setPaymentMode] = useState<'annual' | 'semi-annual' | 'quarterly' | 'monthly'>('annual');
  const [riders, setRiders] = useState({
    ci: true,
    ai: true,
    hb: false,
    wp: true,
  });

  // ------------------ Home Insurance Form State ------------------
  const [homePlanCode, setHomePlanCode] = useState<string>(HOME_PLANS[1].code);
  const [buildingSumInsured, setBuildingSumInsured] = useState<number>(2000000);
  const [contentsSumInsured, setContentsSumInsured] = useState<number>(500000);
  const [homePeriodYears, setHomePeriodYears] = useState<1 | 2 | 3>(3);
  const [extraFlood, setExtraFlood] = useState<boolean>(true);
  const [extraThirdParty, setExtraThirdParty] = useState<boolean>(true);

  // ------------------ Travel Insurance Form State ------------------
  const [travelPlanCode, setTravelPlanCode] = useState<string>(TRAVEL_PLANS[1].code);
  const [travelZone, setTravelZone] = useState<'domestic' | 'asia' | 'schengen' | 'worldwide'>('asia');
  const [tripType, setTripType] = useState<'single' | 'annual'>('single');
  const [travelDays, setTravelDays] = useState<number>(7);
  const [travelerCount, setTravelerCount] = useState<number>(48); // Initialized with 48 travelers matching example in file
  const [hasSenior60To75, setHasSenior60To75] = useState<boolean>(true); // Senior condition from file (age 60-75)
  const [seniorCount, setSeniorCount] = useState<number>(4); // Senior travelers count
  const [healthConfirmed, setHealthConfirmed] = useState<boolean>(true); // Health qualification condition from file
  const [ageCalcYears, setAgeCalcYears] = useState<number>(59);
  const [ageCalcMonths, setAgeCalcMonths] = useState<number>(7);
  const [showAgeCalcHelper, setShowAgeCalcHelper] = useState<boolean>(false);
  const [travelAddons, setTravelAddons] = useState({
    flightDelayPlus: true,
    baggagePlus: true,
  });

  // Automatically update travelPlanCode if zone changes
  const handleZoneChange = (zone: 'domestic' | 'asia' | 'schengen' | 'worldwide') => {
    setTravelZone(zone);
    const matched = TRAVEL_PLANS.find((p) => p.zone === zone);
    if (matched) {
      setTravelPlanCode(matched.code);
    }
  };

  // Calculations
  const lifeCalc = calculateLifePremium({
    planCode: lifePlanCode,
    gender,
    age,
    sumInsured: lifeSumInsured,
    paymentMode,
    riders,
  });

  const homeCalc = calculateHomePremium({
    planCode: homePlanCode,
    buildingSumInsured,
    contentsSumInsured,
    periodYears: homePeriodYears,
    extraFlood,
    extraThirdParty,
  });

  const travelCalc = calculateTravelPremium({
    planCode: travelPlanCode,
    tripType,
    travelDays,
    travelerCount,
    destinationZone: travelZone,
    hasSenior60To75,
    seniorCount,
    addons: travelAddons,
  });

  // Proposal Builders for Forwarding to Customer and Payment
  const buildLifeProposal = (): PlanCodeProposalData => ({
    insuranceType: 'life',
    planCode: lifeCalc.plan.code,
    planName: lifeCalc.plan.name,
    quotingCode: lifeCalc.quotingCode,
    sumInsuredText: `${lifeSumInsured.toLocaleString()} บาท`,
    premiumAmount: lifeCalc.totalPeriodic,
    premiumModeText: lifeCalc.modeName,
    annualEquivalentText: `${lifeCalc.totalAnnual.toLocaleString()} บ./ปี`,
    taxDeductible: lifeCalc.taxDeductible,
    highlights: [
      `ความคุ้มครองชีวิตสัญญาหลัก: ${lifeSumInsured.toLocaleString()} บาท`,
      `ผลประโยชน์เมื่อครบกำหนดสัญญา: ${lifeCalc.plan.maturityBenefit}`,
      ...(riders.ci ? ['คุ้มครอง 50 โรคร้ายแรง (CI) ทุน 500,000 บาท'] : []),
      ...(riders.ai ? ['สัญญาอุบัติเหตุเพิ่มเติม (AI) ทุน 500,000 บาท'] : []),
      ...(riders.hb ? ['ชดเชยรายวันนอน รพ. (HB) วันละ 1,000 บาท'] : []),
      ...(riders.wp ? ['ยกเว้นการชำระเบี้ยทุพพลภาพ (WP)'] : []),
    ],
  });

  const buildHomeProposal = (): PlanCodeProposalData => ({
    insuranceType: 'home',
    planCode: homeCalc.plan.code,
    planName: homeCalc.plan.name,
    quotingCode: homeCalc.quotingCode,
    sumInsuredText: `${homeCalc.totalSumInsured.toLocaleString()} บาท (${homePeriodYears} ปี)`,
    premiumAmount: homeCalc.totalPremium,
    premiumModeText: `ระยะเวลาคุ้มครอง ${homePeriodYears} ปีเต็ม`,
    annualEquivalentText: `เฉลี่ยเดือนละ ${homeCalc.monthlyEquivalent.toLocaleString()} บ.`,
    highlights: [
      `ทุนประกันตัวอาคาร: ${buildingSumInsured.toLocaleString()} บาท`,
      `ทุนประกันทรัพย์สินในบ้าน: ${contentsSumInsured.toLocaleString()} บาท`,
      `คุ้มครองภัยธรรมชาติ: ${homeCalc.plan.naturalDisasterIncluded.toLocaleString()} บาท`,
      `ความรับผิดต่อบุคคลภายนอก: ${homeCalc.plan.thirdPartyLiabilityIncluded.toLocaleString()} บาท`,
      ...(extraFlood ? ['ขยายความคุ้มครองภัยน้ำท่วมพิเศษ'] : []),
    ],
  });

  const buildTravelProposal = (): PlanCodeProposalData => ({
    insuranceType: 'travel',
    planCode: travelCalc.plan.code,
    planName: travelCalc.plan.name,
    quotingCode: travelCalc.quotingCode,
    sumInsuredText: travelCalc.isSeniorCapped
      ? `ค่ารักษาทั่วไป ${travelCalc.plan.medicalExpenseLimit.toLocaleString()} บ. (อายุ 60-75 ปี จำกัด 500,000 บ. ตามเงื่อนไขไฟล์)`
      : `ค่ารักษาพยาบาล ${travelCalc.plan.medicalExpenseLimit.toLocaleString()} บ. (${travelCalc.plan.zoneLabel})`,
    premiumAmount: travelCalc.grandTotal,
    premiumModeText:
      tripType === 'annual'
        ? `คุ้มครองรายปี (Multi-trip) ${travelerCount} ท่าน`
        : `คุ้มครอง ${travelDays} วัน (${travelerCount} ท่าน${hasSenior60To75 ? ` รวมผู้สูงอายุ ${seniorCount} ท่าน` : ''})`,
    annualEquivalentText: `เฉลี่ยท่านละ ${Math.round(travelCalc.grandTotal / travelerCount).toLocaleString()} บ.`,
    schengenGuaranteed: travelCalc.plan.schengenVisaGuaranteed,
    highlights: [
      `ค่ารักษาพยาบาลฉุกเฉินต่างประเทศ: ${travelCalc.plan.medicalExpenseLimit.toLocaleString()} บ.`,
      ...(travelCalc.isSeniorCapped
        ? [
            `⚠️ ผู้เดินทางอายุ 60 - 75 ปี (${seniorCount} ท่าน): จำกัดทุนประกันภัยไม่เกิน 500,000 บาท ตามเงื่อนไขไฟล์`,
          ]
        : ['รับประกันภัยผู้มีอายุ 1 - 75 ปีบริบูรณ์ (เศษเกิน 6 เดือน ปัดเป็น 1 ปี)']),
      `เคลื่อนย้ายการแพทย์ฉุกเฉิน SOS: ${
        travelCalc.plan.sosEvacuationLimit === -1
          ? 'ไม่จำกัดวงเงิน (Unlimited)'
          : `${travelCalc.plan.sosEvacuationLimit.toLocaleString()} บ.`
      }`,
      `ชดเชยเที่ยวบินล่าช้า: ${travelCalc.plan.flightDelayLimit.toLocaleString()} บ.`,
      `สัมภาระและกระเป๋าสูญหาย: ${travelCalc.plan.baggageLossLimit.toLocaleString()} บ.`,
      ...(travelCalc.hasFamilyDiscount ? [`${travelCalc.discountLabel} (ประหยัด ${travelCalc.discountAmount.toLocaleString()} บ.)`] : []),
      ...(travelCalc.plan.schengenVisaGuaranteed
        ? ['การันตีรับรองยื่นขอวีซ่าเชงเก้น 100% (เกิน 30,000 EUR)']
        : []),
      'เงื่อนไขสุขภาพ: ร่างกายแข็งแรงสมบูรณ์ ไม่มีอวัยวะบกพร่อง/พิการ',
    ],
  });

  const handleOpenForward = (type: InsuranceTypeCode) => {
    let prop: PlanCodeProposalData;
    if (type === 'life') prop = buildLifeProposal();
    else if (type === 'home') prop = buildHomeProposal();
    else prop = buildTravelProposal();
    setSelectedProposal(prop);
    setIsForwardModalOpen(true);
  };

  const handleOpenPayment = (type: InsuranceTypeCode) => {
    let prop: PlanCodeProposalData;
    if (type === 'life') prop = buildLifeProposal();
    else if (type === 'home') prop = buildHomeProposal();
    else prop = buildTravelProposal();
    setSelectedProposal(prop);
    setIsPaymentModalOpen(true);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onShowToast?.(`คัดลอกโค๊ด ${code} เรียบร้อยแล้ว`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return to brochure */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              onClick={onBackToBrochure}
              className="text-[#00509d] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span>Smart Brochure</span>
            </button>
            <span>/</span>
            <span className="text-slate-800 font-bold">ระบบคำนวณโค๊ดเบี้ยประกันภัย</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>คำนวณโค๊ดเบี้ยประกันภัย</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#00509d] border border-blue-200">
              Smile Code
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ตัวเลือกการกรอกโค๊ดจะปรับเปลี่ยนอัตโนมัติตามประเภทประกันภัย: ประกันชีวิต, ประกันบ้าน, ประกันเดินทาง
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Quick Forward & Pay buttons in top banner */}
          <button
            type="button"
            onClick={() => handleOpenForward(activeType)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#00509d] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#00509d]" />
            <span>ส่งต่อลูกค้า</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPayment(activeType)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>เลือกชำระเงิน</span>
          </button>

          {onBackToBrochure && (
            <button
              type="button"
              onClick={onBackToBrochure}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              กลับสู่หน้าเปรียบเทียบแผน
            </button>
          )}
          <button
            type="button"
            onClick={handlePrintQuote}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>พิมพ์ใบเสนอราคา</span>
          </button>
        </div>
      </div>

      {/* Customer Info Context Banner if customer is loaded */}
      {existingCustomer && (
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {existingCustomer.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900">เชื่อมโยงข้อมูลลูกค้า:</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">คุณ{existingCustomer.fullName}</span>
                <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  อายุ {existingCustomer.age} ปี
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                เลขประจำตัว: {existingCustomer.idCard} • กรมธรรม์เดิม: {existingCustomer.policyNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAge(existingCustomer.age);
              onShowToast?.(`ปรับอายุเป็น ${existingCustomer.age} ปี ตามข้อมูลลูกค้าแล้ว`);
            }}
            className="text-xs font-bold text-[#00509d] bg-white px-3 py-1.5 rounded-lg border border-sky-300 hover:bg-sky-100 transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            ใช้อายุ {existingCustomer.age} ปี สำหรับประกันชีวิต
          </button>
        </div>
      )}

      {/* 3 Main Insurance Type Tabs (เมนูประเภทประกัน) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-2xs">
        <div className="grid grid-cols-3 gap-2">
          {/* ประกันชีวิต */}
          <button
            type="button"
            onClick={() => setActiveType('life')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-center sm:text-left transition-all cursor-pointer ${
              activeType === 'life'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold shadow-md shadow-rose-600/20 ring-2 ring-rose-500/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                activeType === 'life' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <HeartHandshake className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">ประกันชีวิต</div>
              <div
                className={`text-[10px] sm:text-xs hidden sm:block ${
                  activeType === 'life' ? 'text-rose-100' : 'text-slate-500'
                }`}
              >
                ตลอดชีพ • สะสมทรัพย์ • บำนาญ
              </div>
            </div>
          </button>

          {/* ประกันบ้าน */}
          <button
            type="button"
            onClick={() => setActiveType('home')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-center sm:text-left transition-all cursor-pointer ${
              activeType === 'home'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                activeType === 'home' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">ประกันบ้าน</div>
              <div
                className={`text-[10px] sm:text-xs hidden sm:block ${
                  activeType === 'home' ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                อัคคีภัย • น้ำท่วม • คอนโด
              </div>
            </div>
          </button>

          {/* ประกันเดินทาง */}
          <button
            type="button"
            onClick={() => setActiveType('travel')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-center sm:text-left transition-all cursor-pointer ${
              activeType === 'travel'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-md shadow-blue-600/20 ring-2 ring-blue-500/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                activeType === 'travel' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}
            >
              <Plane className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">ประกันเดินทาง</div>
              <div
                className={`text-[10px] sm:text-xs hidden sm:block ${
                  activeType === 'travel' ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                ในประเทศ • เชงเก้น • ทั่วโลก
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: ประกันชีวิต (Life Insurance) Dynamic Input Section
      ========================================================================= */}
      {activeType === 'life' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
          {/* Left Form: Life Options (ตัวเลือกการกรอกโค๊ดประกันชีวิต) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    กำหนดตัวเลือกโค๊ดประกันชีวิต
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    เลือกรหัสแบบประกัน เพศ อายุ ทุนประกัน และสัญญาเพิ่มเติม
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Life Mode
              </span>
            </div>

            {/* หมวดหมู่แบบประกันชีวิต */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>1. หมวดหมู่แบบประกัน</span>
              </label>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'whole_life', label: 'ตลอดชีพ' },
                  { id: 'endowment', label: 'สะสมทรัพย์' },
                  { id: 'annuity', label: 'บำนาญ' },
                  { id: 'term', label: 'ชั่วระยะเวลา' },
                  { id: 'critical_illness', label: 'โรคร้ายแรง' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setLifeCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      lifeCategoryFilter === cat.id
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* รหัสแบบประกัน (Life Code Selector) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>2. เลือกรหัสแบบประกันชีวิต (Plan Code)</span>
                <span className="text-[11px] text-slate-400 font-normal">คลิกเพื่อเลือกโค๊ด</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LIFE_PLANS.filter(
                  (p) => lifeCategoryFilter === 'all' || p.category === lifeCategoryFilter
                ).map((plan) => (
                  <div
                    key={plan.code}
                    onClick={() => setLifePlanCode(plan.code)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      lifePlanCode === plan.code
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-extrabold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                        {plan.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ส่งเบี้ย {plan.premiumPayYears} ปี
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">{plan.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{plan.highlight}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ข้อมูลผู้เอาประกัน (เพศ & อายุ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* เพศ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">3. เพศผู้เอาประกัน</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      gender === 'male'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    👨 ชาย (Male)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      gender === 'female'
                        ? 'bg-pink-50 border-pink-500 text-pink-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    👩 หญิง (Female)
                  </button>
                </div>
              </div>

              {/* อายุ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>4. อายุผู้เอาประกัน</span>
                  <span className="text-rose-600 font-extrabold">{age} ปี</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="flex-1 accent-rose-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="70"
                    value={age}
                    onChange={(e) => setAge(Math.max(1, Math.min(70, Number(e.target.value))))}
                    className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* จำนวนเงินเอาประกันภัย (Sum Insured) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>5. จำนวนเงินเอาประกันภัย (ทุนประกันชีวิต)</span>
                <span className="text-slate-900 font-extrabold">
                  {lifeSumInsured.toLocaleString()} บาท
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[200000, 500000, 1000000, 2000000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setLifeSumInsured(amount)}
                    className={`py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                      lifeSumInsured === amount
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {(amount / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </div>

            {/* งวดการชำระ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">6. งวดการชำระเบี้ยประกัน</label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[
                  { mode: 'annual', label: 'รายปี (คุ้มสุด)' },
                  { mode: 'semi-annual', label: 'ราย 6 เดือน' },
                  { mode: 'quarterly', label: 'ราย 3 เดือน' },
                  { mode: 'monthly', label: 'รายเดือน' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setPaymentMode(item.mode as any)}
                    className={`py-1.5 px-1 rounded-lg text-center font-bold text-[11px] sm:text-xs border transition-colors cursor-pointer ${
                      paymentMode === item.mode
                        ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* สัญญาเพิ่มเติม (Riders) */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>7. สัญญาเพิ่มเติมแนบท้าย (Optional Riders)</span>
                <span className="text-[11px] text-slate-400 font-normal">เลือกตามต้องการ</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={riders.ci}
                    onChange={(e) => setRiders({ ...riders, ci: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 accent-rose-600"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800">คุ้มครอง 50 โรคร้ายแรง (CI)</div>
                    <div className="text-[10px] text-slate-500">ทุน 500,000 บาท เจอ จ่าย ก้อน</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={riders.ai}
                    onChange={(e) => setRiders({ ...riders, ai: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 accent-rose-600"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800">อุบัติเหตุเพิ่มเติม (AI)</div>
                    <div className="text-[10px] text-slate-500">ทุน 500,000 บาท คุ้มครองเสียชีวิต/สูญเสียอวัยวะ</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={riders.hb}
                    onChange={(e) => setRiders({ ...riders, hb: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 accent-rose-600"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800">ชดเชยรายวันนอน รพ. (HB)</div>
                    <div className="text-[10px] text-slate-500">วันละ 1,000 บาท สูงสุด 365 วัน</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={riders.wp}
                    onChange={(e) => setRiders({ ...riders, wp: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 accent-rose-600"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800">ยกเว้นเบี้ยทุพพลภาพ (WP)</div>
                    <div className="text-[10px] text-slate-500">ทุพพลภาพสิ้นเชิงถาวร บริษัทส่งเบี้ยต่อแทน</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Life Quoting Code & Calculation Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Result Card */}
            <div className="bg-gradient-to-b from-[#1a2332] to-[#0f172a] text-white rounded-2xl p-5 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ใบเสนอราคาโค๊ดประกันชีวิต</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Siam Smile Life
                </span>
              </div>

              {/* Quoting Code Box */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700/80">
                <div className="text-[11px] text-slate-400 font-medium mb-1">รหัสโค๊ดสำหรับออกใบเสนอขาย:</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 tracking-wide break-all">
                    {lifeCalc.quotingCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lifeCalc.quotingCode)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shrink-0 transition-colors cursor-pointer"
                    title="คัดลอกโค๊ด"
                  >
                    {copiedCode === lifeCalc.quotingCode ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Plan Title & Sum Insured */}
              <div>
                <div className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {lifeCalc.plan.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ทุนประกันภัย: <strong className="text-white">{lifeSumInsured.toLocaleString()} บาท</strong> • ผู้เอาประกัน: {gender === 'male' ? 'ชาย' : 'หญิง'} {age} ปี
                </div>
              </div>

              {/* Premium Breakdown */}
              <div className="space-y-2 bg-slate-800/50 rounded-xl p-3 text-xs border border-slate-700/40">
                <div className="flex justify-between text-slate-300">
                  <span>เบี้ยประกันชีวิตหลัก (รายปี):</span>
                  <span className="font-mono font-bold">{lifeCalc.baseAnnualPremium.toLocaleString()} บ.</span>
                </div>
                {riders.ci && (
                  <div className="flex justify-between text-slate-300">
                    <span>สัญญาเพิ่มเติมโรคร้ายแรง (CI):</span>
                    <span className="font-mono font-bold">+{lifeCalc.ciPremium.toLocaleString()} บ.</span>
                  </div>
                )}
                {riders.ai && (
                  <div className="flex justify-between text-slate-300">
                    <span>สัญญาเพิ่มเติมอุบัติเหตุ (AI):</span>
                    <span className="font-mono font-bold">+{lifeCalc.aiPremium.toLocaleString()} บ.</span>
                  </div>
                )}
                {riders.hb && (
                  <div className="flex justify-between text-slate-300">
                    <span>ชดเชยรายวันนอน รพ. (HB):</span>
                    <span className="font-mono font-bold">+{lifeCalc.hbPremium.toLocaleString()} บ.</span>
                  </div>
                )}
                {riders.wp && (
                  <div className="flex justify-between text-slate-300">
                    <span>ยกเว้นเบี้ยทุพพลภาพ (WP):</span>
                    <span className="font-mono font-bold">+{lifeCalc.wpPremium.toLocaleString()} บ.</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-200 font-semibold">
                  <span>เบี้ยประกันรวมรายปี:</span>
                  <span className="font-mono text-sm">{lifeCalc.totalAnnual.toLocaleString()} บ./ปี</span>
                </div>
              </div>

              {/* Total Periodic Due */}
              <div className="bg-gradient-to-r from-rose-900/60 to-rose-800/40 rounded-xl p-4 border border-rose-500/40 text-center">
                <div className="text-xs text-rose-200 font-medium">
                  เบี้ยประกันที่ต้องชำระ ({lifeCalc.modeName}):
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 tracking-tight">
                  {lifeCalc.totalPeriodic.toLocaleString()} <span className="text-sm font-normal text-rose-200">บาท</span>
                </div>
                {paymentMode !== 'annual' && (
                  <div className="text-[11px] text-rose-200/80 mt-1">
                    (เทียบเท่ารายปี: {lifeCalc.totalAnnual.toLocaleString()} บาท)
                  </div>
                )}
              </div>

              {/* Highlights & Tax */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-800/40">
                  <BookmarkCheck className="w-4 h-4 shrink-0" />
                  <span>
                    สิทธิลดหย่อนภาษีสูงสุด: <strong>{lifeCalc.taxDeductible.toLocaleString()} บาท/ปี</strong>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  💡 <strong>ผลประโยชน์เมื่อครบสัญญา:</strong> {lifeCalc.plan.maturityBenefit}
                </div>
              </div>

              {/* Action Buttons: Payment, Forward to Customer, and Copy Code */}
              <div className="space-y-2 pt-1 border-t border-slate-700/60">
                {/* 1. เลือกชำระเงินได้ */}
                <button
                  type="button"
                  onClick={() => handleOpenPayment('life')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ring-1 ring-emerald-400/30"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>เลือกชำระเงิน ({lifeCalc.totalPeriodic.toLocaleString()} บาท)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* 2. ส่งต่อลูกค้าเพื่อใช้เป็นแผนประกันได้ */}
                  <button
                    type="button"
                    onClick={() => handleOpenForward('life')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-[#00509d] hover:from-sky-500 hover:to-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>ส่งต่อลูกค้า</span>
                  </button>

                  {/* 3. คัดลอกรหัสโค๊ดเสนอขาย */}
                  <button
                    type="button"
                    onClick={() => handleCopy(lifeCalc.quotingCode)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedCode === lifeCalc.quotingCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกโค๊ด</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: ประกันบ้าน (Home Insurance) Dynamic Input Section
      ========================================================================= */}
      {activeType === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
          {/* Left Form: Home Options (ตัวเลือกการกรอกโค๊ดประกันบ้าน) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    กำหนดตัวเลือกโค๊ดประกันภัยบ้านและที่อยู่อาศัย
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    เลือกประเภทสิ่งปลูกสร้าง ทุนประกันตัวบ้าน ทรัพย์สิน และขยายภัยธรรมชาติ
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Home Security
              </span>
            </div>

            {/* รหัสแบบประกันบ้าน (Home Code Selector) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>1. เลือกรหัสแผนประกันบ้าน (Plan Code)</span>
                <span className="text-[11px] text-slate-400 font-normal">คลิกเพื่อเลือกแผน</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HOME_PLANS.map((plan) => (
                  <div
                    key={plan.code}
                    onClick={() => setHomePlanCode(plan.code)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      homePlanCode === plan.code
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                        {plan.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {plan.buildingType === 'condo' ? 'คอนโด' : plan.buildingType === 'class_2' ? 'กึ่งไม้' : 'คอนกรีต'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">{plan.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{plan.highlight}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ทุนประกันตัวอาคาร (Building Sum Insured) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>2. ทุนประกันตัวอาคาร / สิ่งปลูกสร้าง (ไม่รวมที่ดิน)</span>
                <span className="text-emerald-700 font-extrabold">
                  {buildingSumInsured.toLocaleString()} บาท
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[1000000, 2000000, 3500000, 5000000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBuildingSumInsured(amount)}
                    className={`py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                      buildingSumInsured === amount
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {(amount / 1000000).toFixed(1)} ล้าน
                  </button>
                ))}
              </div>
            </div>

            {/* ทุนประกันเฟอร์นิเจอร์ & ทรัพย์สินภายใน (Contents Sum Insured) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>3. ทุนประกันเฟอร์นิเจอร์และทรัพย์สินภายในบ้าน</span>
                <span className="text-slate-900 font-extrabold">
                  {contentsSumInsured.toLocaleString()} บาท
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[200000, 500000, 800000, 1500000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setContentsSumInsured(amount)}
                    className={`py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                      contentsSumInsured === amount
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {(amount / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </div>

            {/* ระยะเวลาเอาประกันภัย (Policy Period) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>4. ระยะเวลาทำประกันภัย (ปี)</span>
                <span className="text-emerald-600 font-bold text-[11px]">{homeCalc.discountText}</span>
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { years: 1, label: '1 ปี (เบี้ยปกติ)' },
                  { years: 2, label: '2 ปี (ประหยัด 12.5%)' },
                  { years: 3, label: '3 ปี (คุ้มสุด ประหยัด 16.7%)' },
                ].map((item) => (
                  <button
                    key={item.years}
                    type="button"
                    onClick={() => setHomePeriodYears(item.years as any)}
                    className={`py-2 px-2 rounded-xl text-center font-bold border transition-colors cursor-pointer ${
                      homePeriodYears === item.years
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* สิทธิความคุ้มครองเสริม (ภัยน้ำท่วม & บุคคลภายนอก) */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">
                5. ส่วนขยายความคุ้มครองพิเศษ
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extraFlood}
                    onChange={(e) => setExtraFlood(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <div>
                    <div className="font-bold text-slate-800">ขยายภัยน้ำท่วม Top-up (+100,000 บ.)</div>
                    <div className="text-[10px] text-slate-500">คุ้มครองน้ำหลาก น้ำท่วมขังตัวบ้าน</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extraThirdParty}
                    onChange={(e) => setExtraThirdParty(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <div>
                    <div className="font-bold text-slate-800">ความรับผิดต่อบุคคลภายนอก (+500k)</div>
                    <div className="text-[10px] text-slate-500">คุ้มครองไฟลาม กระเบื้องหลังคาตกใส่เพื่อนบ้าน</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Home Quoting Code & Calculation Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-b from-[#0c2e28] to-[#041a16] text-white rounded-2xl p-5 shadow-xl border border-emerald-950 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ใบเสนอราคาโค๊ดประกันภัยบ้าน</span>
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Siam Smile Home
                </span>
              </div>

              {/* Quoting Code Box */}
              <div className="bg-slate-950/80 rounded-xl p-3 border border-emerald-900/70">
                <div className="text-[11px] text-emerald-400/80 font-medium mb-1">รหัสโค๊ดสำหรับออกใบเสนอขาย:</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 tracking-wide break-all">
                    {homeCalc.quotingCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(homeCalc.quotingCode)}
                    className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white shrink-0 transition-colors cursor-pointer"
                    title="คัดลอกโค๊ด"
                  >
                    {copiedCode === homeCalc.quotingCode ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-emerald-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Plan Title & Sum Insured */}
              <div>
                <div className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {homeCalc.plan.name}
                </div>
                <div className="text-xs text-emerald-300/80 mt-0.5">
                  ทุนประกันภัยรวม: <strong className="text-white">{homeCalc.totalSumInsured.toLocaleString()} บาท</strong> ({homePeriodYears} ปี)
                </div>
              </div>

              {/* Coverage Breakdown */}
              <div className="space-y-2 bg-emerald-950/40 rounded-xl p-3 text-xs border border-emerald-900/40">
                <div className="flex justify-between text-slate-200">
                  <span>ทุนประกันตัวอาคาร:</span>
                  <span className="font-mono font-bold">{buildingSumInsured.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>ทุนประกันทรัพย์สินในบ้าน:</span>
                  <span className="font-mono font-bold">{contentsSumInsured.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>คุ้มครองภัยธรรมชาติพื้นฐาน:</span>
                  <span className="font-mono font-bold">{homeCalc.plan.naturalDisasterIncluded.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>ความรับผิดต่อบุคคลภายนอก:</span>
                  <span className="font-mono font-bold">{homeCalc.plan.thirdPartyLiabilityIncluded.toLocaleString()} บ.</span>
                </div>
                <div className="border-t border-emerald-900/60 pt-2 flex justify-between text-emerald-300">
                  <span>เบี้ยสุทธิ:</span>
                  <span className="font-mono">{homeCalc.premiumNet.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-emerald-400/80 text-[11px]">
                  <span>อากรแสตมป์ + VAT 7%:</span>
                  <span className="font-mono">{(homeCalc.stampDuty + homeCalc.vat).toLocaleString()} บ.</span>
                </div>
              </div>

              {/* Total Premium Due */}
              <div className="bg-gradient-to-r from-teal-900/70 to-emerald-900/50 rounded-xl p-4 border border-emerald-500/40 text-center">
                <div className="text-xs text-emerald-200 font-medium">
                  เบี้ยประกันรวมสุทธิ (คุ้มครอง {homePeriodYears} ปีเต็ม):
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 tracking-tight">
                  {homeCalc.totalPremium.toLocaleString()} <span className="text-sm font-normal text-emerald-200">บาท</span>
                </div>
                <div className="text-[11px] text-emerald-300/80 mt-1">
                  เฉลี่ยเพียงประมาณเดือนละ {homeCalc.monthlyEquivalent.toLocaleString()} บาท
                </div>
              </div>

              {/* Features List */}
              <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-emerald-950">
                <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>จุดเด่นความคุ้มครอง:</span>
                </div>
                {homeCalc.plan.features.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Payment, Forward to Customer, and Copy Code */}
              <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                {/* 1. เลือกชำระเงินได้ */}
                <button
                  type="button"
                  onClick={() => handleOpenPayment('home')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ring-1 ring-emerald-300/30"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>เลือกชำระเงิน ({homeCalc.totalPremium.toLocaleString()} บาท)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* 2. ส่งต่อลูกค้าเพื่อใช้เป็นแผนประกันได้ */}
                  <button
                    type="button"
                    onClick={() => handleOpenForward('home')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer border border-emerald-600/40"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>ส่งต่อลูกค้า</span>
                  </button>

                  {/* 3. คัดลอกรหัสโค๊ดเสนอขาย */}
                  <button
                    type="button"
                    onClick={() => handleCopy(homeCalc.quotingCode)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-200 border border-emerald-900/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedCode === homeCalc.quotingCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกโค๊ด</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: ประกันเดินทาง (Travel Insurance) Dynamic Input Section
      ========================================================================= */}
      {activeType === 'travel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
          {/* Left Form: Travel Options (ตัวเลือกการกรอกโค๊ดประกันเดินทาง) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    กำหนดตัวเลือกโค๊ดประกันการเดินทาง (Smile Travel)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    คำนวณเบี้ยประกันและออกรหัสโค๊ดตามเงื่อนไขการรับประกันภัยในไฟล์เอกสาร
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Travel Underwriting
              </span>
            </div>

            {/* Official Underwriting Criteria Banner from File (เงื่อนไขการรับประกันภัยตามไฟล์) */}
            <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>เงื่อนไขการรับประกันภัย (ตามเอกสาร/ไฟล์คำนวณเบี้ยเดินทาง)</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                  เกณฑ์มาตรฐาน
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="flex items-start gap-1.5 bg-white/80 p-2 rounded-lg border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">อายุรับประกันภัย:</strong> 1 - 75 ปีบริบูรณ์
                    <span className="block text-[10px] text-slate-500">
                      (เศษเกิน 6 เดือน ให้ปัดขึ้นเป็น 1 ปีบริบูรณ์)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 bg-amber-50/90 p-2 rounded-lg border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-950">เงื่อนไขอายุ 60 - 75 ปี:</strong>
                    <span className="block text-[10px] text-amber-800 font-semibold">
                      จำกัดทุนประกันภัยสูงสุดไม่เกิน 500,000 บาท
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 bg-white/80 p-2 rounded-lg border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">เงื่อนไขสุขภาพ:</strong> ร่างกายสมบูรณ์แข็งแรง
                    <span className="block text-[10px] text-slate-500">
                      ไม่มีอวัยวะส่วนใดบกพร่อง/พิการ และไม่มีโรคร้ายแรง
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 bg-white/80 p-2 rounded-lg border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">คณะเดินทาง & ส่วนลด:</strong> 1 - 48 ท่านขึ้นไป
                    <span className="block text-[10px] text-emerald-700 font-semibold">
                      (คณะทัวร์ 48 ท่าน ได้รับส่วนลดพิเศษ 20%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle Age Calculator Helper */}
              <div className="pt-1 flex items-center justify-between border-t border-blue-200/60">
                <button
                  type="button"
                  onClick={() => setShowAgeCalcHelper(!showAgeCalcHelper)}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    {showAgeCalcHelper
                      ? 'ซ่อนเครื่องมือทดสอบการปัดเศษอายุ'
                      : 'คลิกเพื่อทดสอบเกณฑ์ปัดเศษอายุ (เศษเกิน 6 เดือน = ปัดขึ้น 1 ปี)'}
                  </span>
                </button>
                <span className="text-[10px] text-slate-500 font-medium">คำนวณวันชนวัน ณ วันเริ่มคุ้มครอง</span>
              </div>

              {/* Interactive Age Calculation Tool */}
              {showAgeCalcHelper && (
                <div className="bg-white p-3 rounded-xl border border-blue-300 space-y-2 mt-1 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-slate-800">
                    เครื่องมือตรวจสอบอายุผู้เดินทางตามเกณฑ์ประกันภัย
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium">อายุ (ปีเต็ม):</label>
                      <input
                        type="number"
                        min="0"
                        max="85"
                        value={ageCalcYears}
                        onChange={(e) => setAgeCalcYears(Number(e.target.value))}
                        className="w-full mt-0.5 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium">เศษเดือน (เดือน):</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={ageCalcMonths}
                        onChange={(e) => setAgeCalcMonths(Number(e.target.value))}
                        className="w-full mt-0.5 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>

                  {(() => {
                    const roundedAge = ageCalcMonths > 6 ? ageCalcYears + 1 : ageCalcYears;
                    const isSenior = roundedAge >= 60 && roundedAge <= 75;
                    const isOver = roundedAge > 75;
                    const isUnder = roundedAge < 1;

                    return (
                      <div
                        className={`p-2.5 rounded-lg text-xs font-medium border ${
                          isOver || isUnder
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : isSenior
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <span>ผลการคำนวณอายุ:</span>
                          <span className="underline">
                            {ageCalcYears} ปี {ageCalcMonths} เดือน
                          </span>
                          <span>➜</span>
                          <span className="font-extrabold text-sm">{roundedAge} ปีบริบูรณ์</span>
                          <span className="text-[10px] text-slate-500">
                            ({ageCalcMonths > 6 ? 'เศษเกิน 6 เดือน ปัดขึ้น 1 ปี' : 'เศษไม่เกิน 6 เดือน ไม่ปัดขึ้น'})
                          </span>
                        </div>
                        <div className="text-[11px] mt-1">
                          {isOver && '❌ อายุเกิน 75 ปีบริบูรณ์ ไม่อยู่ในเงื่อนไขการรับประกันภัยการเดินทาง'}
                          {isUnder && '❌ อายุต่ำกว่า 1 ปีบริบูรณ์ ไม่อยู่ในเงื่อนไขการรับประกันภัย'}
                          {isSenior &&
                            '⚠️ เข้าเงื่อนไขผู้สูงอายุ (60 - 75 ปี): จำกัดทุนประกันภัย / ค่ารักษาพยาบาลสูงสุดไม่เกิน 500,000 บาท'}
                          {!isOver &&
                            !isUnder &&
                            !isSenior &&
                            '✅ อยู่ในช่วงอายุ 1 - 59 ปีบริบูรณ์: ได้รับความคุ้มครองเต็มวงเงินตามแผนที่เลือก'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* โซนประเทศปลายทาง */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">1. โซนจุดหมายปลายทาง</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                {[
                  { id: 'domestic', label: '🇹🇭 ในประเทศ' },
                  { id: 'asia', label: '🇯🇵 เอเชีย' },
                  { id: 'schengen', label: '🇪🇺 ยุโรป / เชงเก้น' },
                  { id: 'worldwide', label: '🌍 ทั่วโลก' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleZoneChange(item.id as any)}
                    className={`py-2 px-1.5 rounded-xl text-center font-bold border transition-colors cursor-pointer ${
                      travelZone === item.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* รูปแบบการเดินทาง (รายเที่ยว vs รายปี) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">2. รูปแบบทริปการเดินทาง</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTripType('single')}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    tripType === 'single'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ✈️ รายเที่ยว (Single Trip)
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('annual')}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    tripType === 'annual'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🔄 รายปี ไม่จำกัดเที่ยว (Annual Multi-Trip)
                </button>
              </div>
            </div>

            {/* รหัสแบบประกันเดินทาง (Travel Code Selector) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>3. เลือกรหัสแผนประกันเดินทาง (Plan Code)</span>
                <span className="text-[11px] text-slate-400 font-normal">คลิกเพื่อเลือกแผน</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRAVEL_PLANS.map((plan) => {
                  const isSelected = travelPlanCode === plan.code;
                  return (
                    <div
                      key={plan.code}
                      onClick={() => {
                        setTravelPlanCode(plan.code);
                        setTravelZone(plan.zone);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                          {plan.code}
                        </span>
                        <div className="flex items-center gap-1">
                          {plan.code === 'TRV-SMART-500K' && (
                            <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                              ⭐ แนะนำเกณฑ์ไฟล์
                            </span>
                          )}
                          {plan.schengenVisaGuaranteed && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                              วีซ่าเชงเก้น
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{plan.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{plan.highlight}</div>
                      <div className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center justify-between">
                        <span>ค่ารักษา: {plan.medicalExpenseLimit.toLocaleString()} บ.</span>
                        {plan.medicalExpenseLimit > 500000 && (
                          <span className="text-amber-700 font-normal">(อายุ 60-75 ปี จำกัด 500K)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* การตรวจสอบผู้เดินทางอายุ 60 - 75 ปี (Senior 60-75 Underwriting Rule) */}
            <div className="space-y-2 p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSenior60To75}
                    onChange={(e) => setHasSenior60To75(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                  />
                  <span>4. มีผู้เดินทางอายุ 60 - 75 ปีบริบูรณ์ ในคณะนี้</span>
                </label>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  เงื่อนไขไฟล์: จำกัด 500,000 บ.
                </span>
              </div>

              {hasSenior60To75 && (
                <div className="pt-2 border-t border-amber-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-900 font-semibold">
                      จำนวนผู้เดินทางที่มีอายุ 60 - 75 ปี:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={travelerCount}
                        value={seniorCount}
                        onChange={(e) =>
                          setSeniorCount(Math.max(1, Math.min(travelerCount, Number(e.target.value))))
                        }
                        className="w-16 px-2 py-1 border border-amber-300 rounded-lg text-xs font-bold text-center bg-white"
                      />
                      <span className="text-amber-950 font-bold">ท่าน (จาก {travelerCount} ท่าน)</span>
                    </div>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-lg border border-amber-300 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>ข้อกำหนดการรับประกันภัย:</strong> ผู้เดินทางอายุ 60 - 75 ปี จะถูกจำกัดทุนประกันภัย/ค่ารักษาพยาบาลสูงสุดไม่เกิน <strong>500,000 บาท</strong> ตามเงื่อนไขของบริษัท ส่วนผู้เดินทางอายุ 1 - 59 ปี จะได้รับความคุ้มครองเต็มวงเงินตามแผนปกติ
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* จำนวนวันเดินทาง & จำนวนผู้เดินทาง (รองรับ 48 ท่าน ตามไฟล์!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* จำนวนวันเดินทาง (กรณีรายเที่ยว) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>5. จำนวนวันเดินทาง</span>
                  <span className="text-blue-700 font-extrabold">
                    {tripType === 'annual' ? '365 วัน (รายปี)' : `${travelDays} วัน`}
                  </span>
                </label>
                {tripType === 'single' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={travelDays}
                      onChange={(e) => setTravelDays(Number(e.target.value))}
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={travelDays}
                      onChange={(e) => setTravelDays(Math.max(1, Math.min(180, Number(e.target.value))))}
                      className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    เดินทางได้ไม่จำกัดจำนวนเที่ยว สูงสุด 90 วัน/ทริป
                  </div>
                )}
              </div>

              {/* จำนวนผู้เดินทาง (Quick select buttons + custom input) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>6. จำนวนผู้เดินทาง</span>
                  <span className="text-blue-700 font-extrabold">{travelerCount} ท่าน</span>
                </div>
                <div className="flex flex-wrap gap-1 text-xs">
                  {[1, 2, 4, 10, 20, 30, 48].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setTravelerCount(count);
                        if (seniorCount > count) setSeniorCount(count);
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                        travelerCount === count
                          ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {count} {count === 48 ? 'ท่าน (คณะตามไฟล์ ⭐)' : 'คน'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500">หรือระบุจำนวนเอง:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={travelerCount}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(100, Number(e.target.value)));
                      setTravelerCount(val);
                      if (seniorCount > val) setSeniorCount(val);
                    }}
                    className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-xs font-bold text-center"
                  />
                  <span className="text-[11px] text-emerald-700 font-bold">
                    {travelCalc.hasFamilyDiscount ? `✓ ${travelCalc.discountLabel}` : 'อัตราปกติ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Confirmation Underwriting criteria */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="flex items-start gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthConfirmed}
                  onChange={(e) => setHealthConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 shrink-0 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900">
                    7. การรับรองสุขภาพผู้เอาประกันภัยทุกคน (เงื่อนไขการรับประกัน)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ผู้เอาประกันภัยทุกคนมีสุขภาพสมบูรณ์แข็งแรง ไม่มีอวัยวะส่วนใดส่วนหนึ่งบกพร่อง/พิการ และไม่มีโรคประจำตัวร้ายแรงก่อนออกเดินทาง
                  </p>
                </div>
              </label>
            </div>

            {/* ความคุ้มครองเสริมการเดินทาง */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">8. ความคุ้มครองเสริมพิเศษ (Add-ons)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={travelAddons.flightDelayPlus}
                    onChange={(e) =>
                      setTravelAddons({ ...travelAddons, flightDelayPlus: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <div>
                    <div className="font-bold text-slate-800">ชดเชยเที่ยวบินล่าช้า Plus</div>
                    <div className="text-[10px] text-slate-500">ดีเลย์ทุก 6 ชม. รับเงินชดเชยทันที (+120 บ./ท่าน)</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={travelAddons.baggagePlus}
                    onChange={(e) =>
                      setTravelAddons({ ...travelAddons, baggagePlus: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <div>
                    <div className="font-bold text-slate-800">กระเป๋า & สัมภาระสูญหาย Plus</div>
                    <div className="text-[10px] text-slate-500">ขยายวงเงินชดเชยทรัพย์สินเสียหาย (+150 บ./ท่าน)</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Travel Quoting Code & Calculation Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-b from-[#0b2447] to-[#041226] text-white rounded-2xl p-5 shadow-xl border border-blue-950 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
                <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ใบเสนอราคาโค๊ดประกันเดินทาง</span>
                </span>
                <span className="text-[10px] bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded font-mono">
                  Siam Smile Travel
                </span>
              </div>

              {/* Quoting Code Box */}
              <div className="bg-slate-950/80 rounded-xl p-3 border border-blue-900/70">
                <div className="text-[11px] text-sky-300/80 font-medium mb-1 flex items-center justify-between">
                  <span>รหัสโค๊ดสำหรับออกใบเสนอขาย:</span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    {hasSenior60To75 ? 'เงื่อนไข: ผู้สูงอายุ 60-75 ปี' : 'เกณฑ์: 1-75 ปีทั่วไป'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 tracking-wide break-all">
                    {travelCalc.quotingCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(travelCalc.quotingCode)}
                    className="p-2 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-white shrink-0 transition-colors cursor-pointer"
                    title="คัดลอกโค๊ด"
                  >
                    {copiedCode === travelCalc.quotingCode ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-sky-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Senior Capped Warning Badge */}
              {travelCalc.isSeniorCapped && (
                <div className="bg-amber-950/80 border border-amber-500/60 p-2.5 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">
                      จำกัดทุนสำหรับผู้สูงอายุ 60 - 75 ปี ({seniorCount} ท่าน)
                    </span>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      ตามเงื่อนไขการรับประกันภัยในไฟล์ ผู้เดินทางอายุ 60 - 75 ปี จำกัดทุนค่ารักษาพยาบาลสูงสุดไม่เกิน <strong>500,000 บาท</strong> (ส่วนผู้เดินทางอายุ 1 - 59 ปี ได้รับ <strong>{travelCalc.plan.medicalExpenseLimit.toLocaleString()} บาท</strong> เต็มสิทธิ์)
                    </p>
                  </div>
                </div>
              )}

              {/* Plan Title & Travel Scope */}
              <div>
                <div className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {travelCalc.plan.name}
                </div>
                <div className="text-xs text-sky-200/80 mt-0.5">
                  โซน: <strong className="text-white">{travelCalc.plan.zoneLabel}</strong> • ผู้เดินทาง: {travelerCount} ท่าน ({tripType === 'annual' ? 'รายปี 365 วัน' : `${travelDays} วัน`})
                </div>
              </div>

              {/* Coverage Breakdown */}
              <div className="space-y-2 bg-blue-950/40 rounded-xl p-3 text-xs border border-blue-900/40">
                <div className="flex justify-between text-slate-200">
                  <span>ค่ารักษาพยาบาลฉุกเฉิน (ทั่วไป):</span>
                  <span className="font-mono font-bold text-sky-300">
                    {travelCalc.plan.medicalExpenseLimit.toLocaleString()} บ.
                  </span>
                </div>
                {hasSenior60To75 && (
                  <div className="flex justify-between text-amber-300 font-semibold bg-amber-950/30 p-1 rounded">
                    <span>เพดานค่ารักษาผู้สูงอายุ (60-75 ปี):</span>
                    <span className="font-mono font-bold">500,000 บ. (ตามไฟล์)</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-200">
                  <span>เคลื่อนย้ายฉุกเฉิน SOS:</span>
                  <span className="font-mono font-bold">
                    {travelCalc.plan.sosEvacuationLimit === -1
                      ? 'ไม่จำกัดวงเงิน (Unlimited)'
                      : `${travelCalc.plan.sosEvacuationLimit.toLocaleString()} บ.`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>ชดเชยเที่ยวบินล่าช้า:</span>
                  <span className="font-mono font-bold">{travelCalc.plan.flightDelayLimit.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>สัมภาระ & กระเป๋าสูญหาย:</span>
                  <span className="font-mono font-bold">{travelCalc.plan.baggageLossLimit.toLocaleString()} บ.</span>
                </div>
                {travelCalc.hasFamilyDiscount && (
                  <div className="text-emerald-400 font-semibold text-[11px] border-t border-blue-900/60 pt-1 flex justify-between">
                    <span>✓ {travelCalc.discountLabel}:</span>
                    <span>ประหยัด -{travelCalc.discountAmount.toLocaleString()} บ.</span>
                  </div>
                )}
              </div>

              {/* Premium Calculation Breakdown */}
              <div className="bg-slate-950/60 rounded-xl p-3 text-xs space-y-1.5 border border-blue-900/50">
                <div className="flex justify-between text-slate-300">
                  <span>เบี้ยประกันต่อท่าน (ก่อนหักส่วนลด):</span>
                  <span className="font-mono font-semibold">{travelCalc.totalPerPerson.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>เบี้ยรวมก่อนส่วนลด ({travelerCount} ท่าน):</span>
                  <span className="font-mono">{travelCalc.rawTotal.toLocaleString()} บ.</span>
                </div>
                {travelCalc.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>หักส่วนลด ({Math.round(travelCalc.discountRate * 100)}%):</span>
                    <span className="font-mono">-{travelCalc.discountAmount.toLocaleString()} บ.</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300 pt-1 border-t border-blue-900/40">
                  <span>เบี้ยประกันสุทธิ (Net Premium):</span>
                  <span className="font-mono">{travelCalc.netPremium.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>อากรแสตมป์ (0.4%):</span>
                  <span className="font-mono">{travelCalc.stampDuty.toLocaleString()} บ.</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                  <span className="font-mono">{travelCalc.vat.toLocaleString()} บ.</span>
                </div>
              </div>

              {/* Total Premium Due */}
              <div className="bg-gradient-to-r from-blue-900/70 to-indigo-900/50 rounded-xl p-4 border border-blue-500/40 text-center">
                <div className="text-xs text-sky-200 font-medium">
                  เบี้ยประกันรวมทั้งสิ้น ({travelerCount} ท่าน):
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 tracking-tight">
                  {travelCalc.grandTotal.toLocaleString()} <span className="text-sm font-normal text-sky-200">บาท</span>
                </div>
                <div className="text-[11px] text-sky-300/80 mt-1">
                  เฉลี่ยท่านละ {Math.round(travelCalc.grandTotal / travelerCount).toLocaleString()} บาท
                </div>
              </div>

              {/* Schengen Visa Badge if guaranteed */}
              {travelCalc.plan.schengenVisaGuaranteed && (
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">รองรับยื่นขอวีซ่าเชงเก้น 100%</span>
                    <p className="text-[10px] text-emerald-300/80 mt-0.5">
                      ออกหนังสือรับรองภาษาอังกฤษทันที วงเงินเกิน 30,000 EUR การันตีคืนเงินหากวีซ่าไม่ผ่าน
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons: Payment, Forward to Customer, and Copy Code */}
              <div className="space-y-2 pt-1 border-t border-blue-900/60">
                {/* 1. เลือกชำระเงินได้ */}
                <button
                  type="button"
                  onClick={() => handleOpenPayment('travel')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ring-1 ring-emerald-400/30"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>เลือกชำระเงิน ({travelCalc.grandTotal.toLocaleString()} บาท)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* 2. ส่งต่อลูกค้าเพื่อใช้เป็นแผนประกันได้ */}
                  <button
                    type="button"
                    onClick={() => handleOpenForward('travel')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>ส่งต่อลูกค้า</span>
                  </button>

                  {/* 3. คัดลอกรหัสโค๊ดเสนอขาย */}
                  <button
                    type="button"
                    onClick={() => handleCopy(travelCalc.quotingCode)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-200 border border-blue-900/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedCode === travelCalc.quotingCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกโค๊ด</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forward to Customer Modal */}
      {selectedProposal && (
        <ForwardCustomerModal
          isOpen={isForwardModalOpen}
          onClose={() => setIsForwardModalOpen(false)}
          proposal={selectedProposal}
          existingCustomer={existingCustomer}
          onAssignToCustomer={(cust, policy) => {
            onAssignPlanToCustomer?.(cust, policy);
          }}
          onProceedToPayment={(custName, custPhone) => {
            setCheckoutCustomerName(custName);
            setCheckoutCustomerPhone(custPhone);
            setIsPaymentModalOpen(true);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* Payment Checkout Modal */}
      {selectedProposal && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          proposal={selectedProposal}
          customerName={checkoutCustomerName}
          customerPhone={checkoutCustomerPhone}
          onPaymentSuccess={(issuedPolicy) => {
            if (existingCustomer) {
              onAssignPlanToCustomer?.(existingCustomer, issuedPolicy);
            }
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
