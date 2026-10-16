import React, { useState, useMemo } from 'react';
import {
  InsurancePlan,
  ViewFilterMode,
  ExportMeta,
  CustomerProfile,
  CustomerPolicyItem,
  PaDismembermentSchedule,
} from '../types';
import { formatCurrency, analyzeDifferences, getPlanTargetAudience } from '../data/plans';
import { MOCK_EXISTING_CUSTOMERS } from '../data/customers';
import {
  ShieldCheck,
  Gift,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Layers,
  PlusCircle,
  Check,
  Zap,
  HeartPulse,
  UserCheck,
  Stethoscope,
  Activity,
  Plus,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Eye,
  Car,
  Building,
  Landmark,
  Users,
  ArrowLeft,
  X,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { PolicyTermsNotice } from './PolicyTermsNotice';
import { PaymentModal } from './PaymentModal';
import { PlanCodeProposalData } from './ForwardCustomerModal';

interface ComparisonTableProps {
  selectedPlans: InsurancePlan[];
  allPlans: InsurancePlan[];
  filterMode: ViewFilterMode;
  onFilterModeChange: (mode: ViewFilterMode) => void;
  highlightDiffs: boolean;
  onToggleHighlightDiffs: () => void;
  exportMeta?: ExportMeta;
  printMode?: boolean;
  existingCustomer?: CustomerProfile | null;
  currentAge?: number | null;
  onSelectExistingCustomer?: (customer: CustomerProfile | null) => void;
  onTogglePlan?: (planId: string) => void;
  onOpenPreview?: () => void;
  onBackToSelection?: () => void;
  onSwapPlan?: (oldPlanId: string, newPlanId: string) => void;
  onAssignPlanToCustomer?: (customer: CustomerProfile, newPolicy: CustomerPolicyItem) => void;
  onShowToast?: (msg: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  selectedPlans,
  allPlans,
  filterMode,
  onFilterModeChange,
  highlightDiffs,
  onToggleHighlightDiffs,
  exportMeta,
  printMode = false,
  existingCustomer = null,
  currentAge = null,
  onSelectExistingCustomer,
  onTogglePlan,
  onOpenPreview,
  onBackToSelection,
  onSwapPlan,
  onAssignPlanToCustomer,
  onShowToast,
}) => {
  const [showCombinedColumn, setShowCombinedColumn] = useState<boolean>(true);
  const [showPaDetails, setShowPaDetails] = useState<boolean>(true);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<InsurancePlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  const getPlanProposalData = (plan: InsurancePlan): PlanCodeProposalData => {
    const isPa = plan.category === 'pa';
    const accidentCoverage = plan.paSchedule?.permanentDisability || plan.life.accidentGeneral || 200000;
    return {
      insuranceType: isPa ? 'pa' : 'health',
      planCode: plan.code,
      planName: plan.name,
      quotingCode: `SSM-${plan.code.toUpperCase()}-COMPARE`,
      sumInsuredText: isPa
        ? `วงเงินเสียชีวิต/ทุพพลภาพ ฿${formatCurrency(accidentCoverage)} / ค่ารักษาอุบัติเหตุ ฿${formatCurrency(plan.opd.accident || 20000)}`
        : `ค่าห้อง ฿${formatCurrency(plan.roomNormal.perNight)}/คืน (ผู้ป่วยใน IPD รวม ฿${formatCurrency(plan.medicalGeneralPerVisit + plan.surgeryPerDisorder)})`,
      premiumAmount: plan.monthlyPremium,
      premiumModeText: 'รายเดือน',
      annualEquivalentText: `฿${formatCurrency(plan.annualPremium)}/ปี`,
      monthlyAmount: plan.monthlyPremium,
      annualAmount: plan.annualPremium,
      highlights: [
        isPa
          ? `ความคุ้มครองอุบัติเหตุ 24 ชั่วโมง ทั่วโลก`
          : `คุ้มครองผู้ป่วยใน (IPD) ค่าห้อง ฿${formatCurrency(plan.roomNormal.perNight)}/คืน`,
        plan.opd.illness.covered
          ? `มี OPD โรคทั่วไป ฿${formatCurrency(plan.opd.illness.perVisit || 500)}/ครั้ง (${plan.opd.illness.maxVisitsPerYear || 9} ครั้ง/ปี)`
          : isPa
          ? `ค่ารักษาพยาบาลอุบัติเหตุ ฿${formatCurrency(plan.opd.accident)}/ครั้ง`
          : `คุ้มครองอุบัติเหตุฉุกเฉินและเสียชีวิต ฿${formatCurrency(plan.life.accidentGeneral || 200000)}`,
        `ชำระเบี้ยรายเดือนเริ่มต้นเพียง ฿${formatCurrency(plan.monthlyPremium)}/เดือน หรือ ฿${formatCurrency(plan.annualPremium)}/ปี`,
        `ออกกรมธรรม์ออนไลน์ มีผลคุ้มครองตามเงื่อนไขทันที`,
      ],
      taxDeductible: plan.category === 'health' ? Math.min(plan.annualPremium, 25000) : 0,
    };
  };

  const handlePaymentSuccess = (issuedPolicy: CustomerPolicyItem) => {
    if (selectedPlanForPayment) {
      const targetCustomer: CustomerProfile = existingCustomer || {
        idCard: '1100200300400',
        fullName: 'คุณลูกค้าสยามสไมล์',
        birthDate: '1995-05-15',
        age: 30,
        phone: '081-445-6789',
        policyNumber: issuedPolicy.policyNumber,
        existingPlanId: selectedPlanForPayment.id,
        startDate: issuedPolicy.startDate,
        lossClaimRate: 0,
        lossClaimStatus: '0% (กรมธรรม์ใหม่)',
        lineOaRegistered: true,
        lineOaStatusText: 'ชำระเงินออนไลน์แล้ว',
        policies: [issuedPolicy],
      };
      onAssignPlanToCustomer?.(targetCustomer, issuedPolicy);
    }
  };

  // Helper to get dismemberment amount for a plan
  const getPlanPaValue = (
    plan: InsurancePlan,
    key: keyof PaDismembermentSchedule,
    ratio: number
  ): number => {
    if (plan.paSchedule && plan.paSchedule[key] !== undefined) {
      return plan.paSchedule[key];
    }
    return Math.round(plan.life.accidentGeneral * ratio);
  };

  // Identify existing plan if customer is active
  const existingCustomerPlan = useMemo(() => {
    if (!existingCustomer) return null;
    return allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null;
  }, [existingCustomer, allPlans]);

  const isExistingPlanSelected = useMemo(() => {
    if (!existingCustomerPlan) return false;
    return selectedPlans.some((p) => p.id === existingCustomerPlan.id);
  }, [existingCustomerPlan, selectedPlans]);

  // Determine which plans are combined:
  // If existing customer is active and only 1 proposed plan is selected (and it's not the existing plan),
  // we combine [existingCustomerPlan, selectedPlans[0]] so that the combined column immediately shows
  // the existing customer combined total (Top-up)!
  const plansForCombined = useMemo(() => {
    if (selectedPlans.length === 0) return [];
    if (
      existingCustomer &&
      existingCustomerPlan &&
      selectedPlans.length === 1 &&
      !isExistingPlanSelected
    ) {
      return [existingCustomerPlan, selectedPlans[0]];
    }
    return selectedPlans;
  }, [selectedPlans, existingCustomer, existingCustomerPlan, isExistingPlanSelected]);

  // Pre-calculate differences
  const diffItems = useMemo(() => analyzeDifferences(selectedPlans), [selectedPlans]);
  const diffMap = useMemo(() => {
    const map = new Map<string, boolean>();
    diffItems.forEach((item) => {
      map.set(item.id, item.isDifferent);
    });
    return map;
  }, [diffItems]);

  const differentCount = useMemo(() => {
    return diffItems.filter((item) => item.isDifferent).length;
  }, [diffItems]);

  // Calculate combined totals for plansForCombined
  const combinedTotals = useMemo(() => {
    if (plansForCombined.length === 0) return null;

    const count = plansForCombined.length;
    const monthlyPremium = plansForCombined.reduce((sum, p) => sum + p.monthlyPremium, 0);
    const annualPremium = plansForCombined.reduce((sum, p) => sum + p.annualPremium, 0);

    // 1. Room
    const roomNormalPerNight = plansForCombined.reduce((sum, p) => sum + p.roomNormal.perNight, 0);
    const roomNormalMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomNormal.maxLimit, 0);

    const roomICUPerNight = plansForCombined.reduce((sum, p) => sum + p.roomICU.perNight, 0);
    const roomICUMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomICU.maxLimit, 0);
    const roomCombinedMaxLimit = roomNormalMaxLimit + roomICUMaxLimit;

    // 2. Medical & Surgery
    const medicalGeneral = plansForCombined.reduce((sum, p) => sum + p.medicalGeneralPerVisit, 0);
    const surgery = plansForCombined.reduce((sum, p) => sum + p.surgeryPerDisorder, 0);
    const inpatientMedicalSubtotal = medicalGeneral + surgery;

    const doctorVisitPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.doctorVisitPerNight.perNight,
      0
    );
    const doctorVisitMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.doctorVisitPerNight.maxLimit,
      0
    );
    const inpatientMedicalMaxLimit =
      roomNormalMaxLimit + medicalGeneral + surgery + doctorVisitMaxLimit;

    // 3. OPD
    const opdAccident = plansForCombined.reduce((sum, p) => sum + p.opd.accident, 0);
    const opdCoveredPlans = plansForCombined.filter((p) => p.opd.illness.covered);
    const hasOpdIllness = opdCoveredPlans.length > 0;
    const opdIllnessPerVisit = opdCoveredPlans.reduce(
      (sum, p) => sum + (p.opd.illness.perVisit || 0),
      0
    );
    const opdIllnessMaxVisits = opdCoveredPlans.reduce(
      (sum, p) => sum + (p.opd.illness.maxVisitsPerYear || 0),
      0
    );
    const opdIllnessMaxPerYear = opdCoveredPlans.reduce(
      (sum, p) =>
        sum + (p.opd.illness.perVisit || 0) * (p.opd.illness.maxVisitsPerYear || 0),
      0
    );
    const opdTotalPerVisit = opdAccident + (hasOpdIllness ? opdIllnessPerVisit : 0);

    // 4. Daily compensation
    const dailyCompPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.dailyCompensation.perNight,
      0
    );
    const dailyCompMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.dailyCompensation.maxLimit,
      0
    );

    // Other rights
    const otherRightsNormalPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsNormalRoom.perNight,
      0
    );
    const otherRightsNormalMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsNormalRoom.maxLimit,
      0
    );

    const otherRightsICUPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsICU.perNight,
      0
    );
    const otherRightsICUMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsICU.maxLimit,
      0
    );

    // 5. Life & Accident
    const lifeAccidentGeneral = plansForCombined.reduce(
      (sum, p) => sum + p.life.accidentGeneral,
      0
    );
    const lifeMurder = plansForCombined.reduce((sum, p) => sum + p.life.murderAssault, 0);
    const lifeMotorcycle = plansForCombined.reduce((sum, p) => sum + p.life.motorcycle, 0);
    const lifeFuneral = plansForCombined.reduce((sum, p) => sum + p.life.funeralBenefit, 0);

    // 6. PA Dismemberment Schedule Breakdown
    const paPermanentDisability = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.permanentDisability ?? p.life.accidentGeneral),
      0
    );
    const paTwoLimbsOrEyes = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.twoLimbsOrEyes ?? p.life.accidentGeneral),
      0
    );
    const paOneLimbOrEye = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.oneLimbOrEye ?? Math.round(p.life.accidentGeneral * 0.6)),
      0
    );
    const paDeafBothOrMute = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.deafBothOrMute ?? Math.round(p.life.accidentGeneral * 0.5)),
      0
    );
    const paThumbTwoJoints = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.thumbTwoJoints ?? Math.round(p.life.accidentGeneral * 0.25)),
      0
    );
    const paDeafOneEar = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.deafOneEar ?? Math.round(p.life.accidentGeneral * 0.15)),
      0
    );
    const paThumbOneJoint = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.thumbOneJoint ?? Math.round(p.life.accidentGeneral * 0.1)),
      0
    );
    const paIndexFingerThreeJoints = plansForCombined.reduce(
      (sum, p) =>
        sum + (p.paSchedule?.indexFingerThreeJoints ?? Math.round(p.life.accidentGeneral * 0.1)),
      0
    );
    const paIndexFingerTwoJoints = plansForCombined.reduce(
      (sum, p) =>
        sum + (p.paSchedule?.indexFingerTwoJoints ?? Math.round(p.life.accidentGeneral * 0.08)),
      0
    );
    const paIndexFingerOneJoint = plansForCombined.reduce(
      (sum, p) =>
        sum + (p.paSchedule?.indexFingerOneJoint ?? Math.round(p.life.accidentGeneral * 0.04)),
      0
    );
    const paOtherFingersTwoJoints = plansForCombined.reduce(
      (sum, p) =>
        sum + (p.paSchedule?.otherFingersTwoJoints ?? Math.round(p.life.accidentGeneral * 0.05)),
      0
    );
    const paBigToe = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.bigToe ?? Math.round(p.life.accidentGeneral * 0.05)),
      0
    );
    const paOtherFingersOneJoint = plansForCombined.reduce(
      (sum, p) =>
        sum + (p.paSchedule?.otherFingersOneJoint ?? Math.round(p.life.accidentGeneral * 0.01)),
      0
    );

    // Age bounds
    const minEligibleAge = Math.max(...plansForCombined.map((p) => p.minAge));
    const maxEligibleAge = Math.min(...plansForCombined.map((p) => p.maxAge));

    // Premium calculations for existing customer
    const existingMonthly = existingCustomerPlan ? existingCustomerPlan.monthlyPremium : 0;
    const addedMonthly = Math.max(0, monthlyPremium - existingMonthly);
    const existingAnnual = existingCustomerPlan ? existingCustomerPlan.annualPremium : 0;
    const addedAnnual = Math.max(0, annualPremium - existingAnnual);

    return {
      count,
      monthlyPremium,
      annualPremium,
      existingMonthly,
      addedMonthly,
      existingAnnual,
      addedAnnual,
      roomNormalPerNight,
      roomNormalMaxLimit,
      roomICUPerNight,
      roomICUMaxLimit,
      roomCombinedMaxLimit,
      medicalGeneral,
      surgery,
      inpatientMedicalSubtotal,
      doctorVisitPerNight,
      doctorVisitMaxLimit,
      inpatientMedicalMaxLimit,
      opdAccident,
      hasOpdIllness,
      opdIllnessPerVisit,
      opdIllnessMaxVisits,
      opdIllnessMaxPerYear,
      opdTotalPerVisit,
      dailyCompPerNight,
      dailyCompMaxLimit,
      otherRightsNormalPerNight,
      otherRightsNormalMaxLimit,
      otherRightsICUPerNight,
      otherRightsICUMaxLimit,
      lifeAccidentGeneral,
      lifeMurder,
      lifeMotorcycle,
      lifeFuneral,
      paPermanentDisability,
      paTwoLimbsOrEyes,
      paOneLimbOrEye,
      paDeafBothOrMute,
      paThumbTwoJoints,
      paDeafOneEar,
      paThumbOneJoint,
      paIndexFingerThreeJoints,
      paIndexFingerTwoJoints,
      paIndexFingerOneJoint,
      paOtherFingersTwoJoints,
      paBigToe,
      paOtherFingersOneJoint,
      minEligibleAge,
      maxEligibleAge,
    };
  }, [plansForCombined, existingCustomerPlan]);

  if (selectedPlans.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-8 sm:p-12 text-center text-slate-500">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">ยังไม่ได้เลือกแผนที่จะเปรียบเทียบ</h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {existingCustomer
            ? `กรุณาคลิกเลือกแผนใหม่จากรายการด้านบน เพื่อเปรียบเทียบผลประโยชน์และดูวงเงิน Top-up เพิ่มเติมจากแผนเดิม (${existingCustomerPlan?.name || ''})`
            : 'กรุณาคลิกเลือกแผนประกันภัยอย่างน้อย 1 แผนจากด้านบนเพื่อแสดงตารางเปรียบเทียบ'}
        </p>
      </div>
    );
  }

  const shouldShowRow = (rowId: string) => {
    if (filterMode === 'all') return true;
    return diffMap.get(rowId) === true;
  };

  const isRowDiff = (rowId: string) => {
    return highlightDiffs && diffMap.get(rowId) === true;
  };

  const hasMultiplePlans = plansForCombined.length >= 2;
  const isCombinedVisible = hasMultiplePlans && showCombinedColumn && combinedTotals !== null;
  const totalColumnsCount = selectedPlans.length + (isCombinedVisible ? 2 : 1);

  return (
    <div
      id="comparison-report-element"
      className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden"
    >
      {/* iPad-Optimized Integrated Function Toolbar */}
      {!printMode && (
        <div className="no-print p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200 space-y-3">
          {/* Plan Slots Management: เพิ่ม/ลด/แก้ไขแผนในหน้านี้ได้ทันที */}
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  จัดการแผนที่เปรียบเทียบ ({selectedPlans.length}/3 แผน):
                </span>
                <span className="text-[11px] text-slate-500">
                  (สามารถเพิ่ม ลด หรือเปลี่ยนแผนได้ทันที)
                </span>
              </div>

              {onBackToSelection && (
                <button
                  type="button"
                  onClick={onBackToSelection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="ย้อนกลับไปหน้าแพ็กเกจเลือกแผน"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>ย้อนกลับไปหน้าเลือกแผน</span>
                </button>
              )}
            </div>

            {/* 3 Interactive Slots Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[0, 1, 2].map((slotIdx) => {
                const plan = selectedPlans[slotIdx];
                const unselectedPlans = allPlans.filter(
                  (p) => !selectedPlans.some((sp) => sp.id === p.id)
                );

                if (plan) {
                  return (
                    <div
                      key={plan.id}
                      className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white shrink-0">
                            ช่องที่ {slotIdx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {plan.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          ฿{formatCurrency(plan.monthlyPremium)}/เดือน
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Change/Swap dropdown */}
                        {unselectedPlans.length > 0 && onSwapPlan && (
                          <div className="relative inline-block">
                            <select
                              aria-label={`เปลี่ยนแผนช่องที่ ${slotIdx + 1}`}
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  onSwapPlan(plan.id, e.target.value);
                                }
                              }}
                              className="text-[10px] font-semibold bg-white border border-slate-200 hover:border-blue-400 text-slate-700 rounded-md px-1.5 py-1 cursor-pointer transition-colors shadow-2xs"
                              title="เปลี่ยนเป็นแผนอื่น"
                            >
                              <option value="" disabled>เปลี่ยนแผน</option>
                              {unselectedPlans.map((up) => (
                                <option key={up.id} value={up.id}>
                                  {up.code} ({formatCurrency(up.monthlyPremium)}/เดือน)
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Remove button */}
                        {onTogglePlan && (
                          <button
                            type="button"
                            onClick={() => onTogglePlan(plan.id)}
                            className="p-1 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-300 cursor-pointer transition-colors shadow-2xs"
                            title={`ลบ ${plan.name} ออกจากการเปรียบเทียบ`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                // Empty Slot
                return (
                  <div
                    key={`empty-slot-${slotIdx}`}
                    className="p-2.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2"
                  >
                    <div className="text-xs text-slate-400 font-medium">
                      สล็อตว่างที่ {slotIdx + 1} (ไม่เกิน 3)
                    </div>

                    {unselectedPlans.length > 0 && onTogglePlan ? (
                      <select
                        aria-label={`เพิ่มแผนในสล็อตที่ ${slotIdx + 1}`}
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            onTogglePlan(e.target.value);
                          }
                        }}
                        className="text-[11px] font-bold bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 rounded-lg px-2.5 py-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <option value="" disabled>+ เพิ่มแผนเปรียบเทียบ</option>
                        {unselectedPlans.map((up) => (
                          <option key={up.id} value={up.id}>
                            + {up.name} (฿{formatCurrency(up.monthlyPremium)}/เดือน)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[10px] text-slate-400">ครบทุกแผนแล้ว</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* View Mode (All vs Differences Only) */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                โหมด:
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onFilterModeChange('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    filterMode === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  แสดงทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => onFilterModeChange('differences_only')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                    filterMode === 'differences_only'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>เฉพาะจุดที่ต่างกัน</span>
                  <span
                    className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                      filterMode === 'differences_only'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {differentCount}
                  </span>
                </button>
              </div>

              {/* Highlight diffs toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium ml-1">
                <input
                  type="checkbox"
                  checked={highlightDiffs}
                  onChange={onToggleHighlightDiffs}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span className="flex items-center gap-1 text-[11px] sm:text-xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  เน้นสีจุดต่าง
                </span>
              </label>
            </div>

            {/* Combined Column Toggle & Plan Counter */}
            <div className="flex items-center gap-3 text-xs self-start md:self-center flex-wrap">
              {hasMultiplePlans && (
                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold cursor-pointer select-none transition-colors hover:bg-emerald-100/70">
                  <input
                    type="checkbox"
                    checked={showCombinedColumn}
                    onChange={(e) => setShowCombinedColumn(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300 cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {existingCustomer
                      ? `แสดงช่องรวมกรณีลูกค้าเดิม (${plansForCombined.length} แผน)`
                      : `แสดงช่องรวม (${selectedPlans.length} แผน)`}
                  </span>
                </label>
              )}

              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-500 text-[11px] sm:text-xs">
                เปรียบเทียบ <strong className="text-slate-800">{selectedPlans.length}</strong> แผน
              </span>

              {onOpenPreview && (
                <button
                  type="button"
                  onClick={onOpenPreview}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/90 hover:bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  title="พรีวิวเอกสารข้อเสนอก่อนสั่งพิมพ์หรือส่งออก"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>พรีวิวแผน</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Info for Existing Customer holding Motor/Other policies */}
      {!printMode && existingCustomer && existingCustomer.policies && existingCustomer.policies.length > 1 && (
        <div className="no-print px-3.5 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>พอร์ตกรมธรรม์เดิม คุณ{existingCustomer.fullName}:</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              (ถือครอง {existingCustomer.policies.length} กรมธรรม์)
            </span>
            {existingCustomer.policies
              .filter((p) => p.policyType === 'motor' || p.vehicleDetails)
              .map((mp, mIdx) => (
                <span
                  key={mIdx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[11px] text-blue-950 font-medium shadow-2xs"
                >
                  <Car className="w-3 h-3 text-blue-600" />
                  <span>
                    {mp.customPlanName || 'ประกันรถยนต์'}
                    {mp.vehicleDetails?.licensePlate ? ` (${mp.vehicleDetails.licensePlate})` : ''}
                  </span>
                </span>
              ))}
          </div>
          <span className="text-[10.5px] text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
            สามารถนำเสนอ Top-up สุขภาพร่วมกับแพ็กเกจเดิมได้
          </span>
        </div>
      )}

      {/* Main Insurance Comparison Table (iPad responsive & clean) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[720px]">
          {/* Header Row */}
          <thead>
            <tr className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-800 text-white">
              {/* Coverage Column Header */}
              <th className="p-3 md:p-3.5 w-[32%] text-left font-bold text-sm md:text-base tracking-wide border-r border-sky-600/50">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-sky-200" />
                  <span>ความคุ้มครอง</span>
                </div>
              </th>

              {/* Selected Plans Headers */}
              {selectedPlans.map((plan) => {
                const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
                const columnWidth = isCombinedVisible
                  ? `${48 / selectedPlans.length}%`
                  : `${68 / selectedPlans.length}%`;

                return (
                  <th
                    key={plan.id}
                    className="p-3 md:p-3.5 text-center border-r border-sky-600/50 align-top relative group"
                    style={{ width: columnWidth }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {/* Delete button on column header (iPad/Desktop friendly) */}
                      {onTogglePlan && (
                        <div className="no-print w-full flex justify-end -mb-2">
                          <button
                            type="button"
                            onClick={() => onTogglePlan(plan.id)}
                            className="p-0.5 rounded-full bg-sky-900/70 hover:bg-rose-600 text-sky-200 hover:text-white cursor-pointer transition-colors shadow-2xs"
                            title={`ลบ ${plan.name} ออกจากตาราง`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      )}

                      {isExistingCustomerPlan && (
                        <span className="inline-block bg-emerald-500 text-white font-black text-[9px] uppercase px-1.5 py-0.2 rounded-full shadow-2xs">
                          แผนเดิมของลูกค้า
                        </span>
                      )}
                      {plan.category === 'pa' ? (
                        <span className="inline-block bg-amber-400 text-amber-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                          แผนอุบัติเหตุ PA
                        </span>
                      ) : (
                        <span className="inline-block bg-sky-950/40 text-sky-200 font-medium text-[9px] uppercase px-1.5 py-0.2 rounded-full">
                          แผนประกันสุขภาพ
                        </span>
                      )}
                      <div className="inline-block bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md text-sm md:text-base font-black tracking-wide border border-sky-300/30">
                        {plan.name}
                      </div>
                      <div className="text-[11px] font-semibold text-sky-200">
                        ฿{formatCurrency(plan.monthlyPremium)}/เดือน
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* Combined Total Column Header */}
              {isCombinedVisible && combinedTotals && (
                <th
                  className="p-3 md:p-3.5 text-center bg-gradient-to-b from-[#094f92] via-[#00509d] to-[#003e7a] text-white border-l-2 border-sky-300 align-top shadow-md"
                  style={{ width: '22%' }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {existingCustomer ? (
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-white/30 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-sky-200" />
                        กรณีลูกค้าเดิม (Top-up)
                      </span>
                    ) : (
                      <span className="inline-block bg-white/20 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-white/30 shadow-2xs">
                        ความคุ้มครองรวม
                      </span>
                    )}

                    <div className="inline-block bg-white text-[#00509d] px-3 py-1 rounded-md text-xs sm:text-sm md:text-base font-black tracking-wide shadow-xs">
                      ช่องรวมค่ารักษาพยาบาล
                    </div>

                    <div className="text-[11px] text-sky-100 font-medium">
                      {existingCustomer ? 'สิทธิประโยชน์รวมแผนเดิมและแผนใหม่' : 'สิทธิประโยชน์ความคุ้มครองรวม'}
                    </div>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {/* ============================================================== */}
            {/* SECTION 0: เกณฑ์อายุที่รับประกันภัย */}
            {/* ============================================================== */}
            <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
              <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-900">เกณฑ์อายุที่รับประกันภัย</span>
                </div>
              </td>
              {selectedPlans.map((plan) => {
                const isMatchAge =
                  currentAge !== null
                    ? currentAge >= plan.minAge && currentAge <= plan.maxAge
                    : true;
                return (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-200 text-xs md:text-sm"
                  >
                    <span className="font-bold text-slate-800 block">{plan.ageRangeText}</span>
                    {currentAge !== null && (
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          isMatchAge
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isMatchAge ? `ตรงเกณฑ์` : `ไม่ตรงเกณฑ์`}
                      </span>
                    )}
                  </td>
                );
              })}
              {isCombinedVisible && combinedTotals && (
                <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] text-xs md:text-sm border-l-2 border-[#b9ddf8] font-bold text-[#00509d]">
                  {combinedTotals.minEligibleAge} - {combinedTotals.maxEligibleAge} ปี
                  <span className="block text-[10px] text-sky-700 font-normal">
                    (ช่วงอายุที่สมัครคู่กันได้)
                  </span>
                </td>
              )}
            </tr>

            {/* ============================================================== */}
            {/* SECTION: ข้อมูลแผนตามกลุ่มเป้าหมาย (เอกชน / ราชการ / ลูกค้าทั่วไป) */}
            {/* ============================================================== */}
            <tr className="bg-slate-100/90 text-slate-800 font-bold border-y border-slate-200">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <span className="inline-flex items-center gap-1.5 text-[#00509d]">
                  <Users className="w-4 h-4 text-blue-600" />
                  ความเหมาะสม & จุดเด่นตามกลุ่มผู้ใช้ (เอกชน / ราชการรัฐวิสาหกิจ / ลูกค้าทั่วไป)
                </span>
              </td>
            </tr>

            {/* Row: เอกชน */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
              <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4 sm:pl-5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>พนักงานเอกชน (Top-up ปกส.)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  เสริมสวัสดิการประกันกลุ่ม / สิทธิประกันสังคม
                </div>
              </td>
              {selectedPlans.map((plan) => {
                const aud = getPlanTargetAudience(plan.id, plan.targetAudience);
                return (
                  <td key={plan.id} className="py-2 px-3 sm:px-4 border-r border-slate-100 text-left text-xs">
                    <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-950 font-medium leading-relaxed">
                      {aud.privateSector}
                    </div>
                  </td>
                );
              })}
              {isCombinedVisible && combinedTotals && (
                <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8] text-xs font-semibold text-blue-900">
                  สิทธิความคุ้มครองเสริมครอบคลุมทั้ง OPD/IPD
                </td>
              )}
            </tr>

            {/* Row: ราชการ */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
              <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4 sm:pl-5">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <Landmark className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>ราชการ / รัฐวิสาหกิจ</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  เสริมสิทธิเบิกตรง ค่าห้องพิเศษเดี่ยว & คลินิกนอกเวลา
                </div>
              </td>
              {selectedPlans.map((plan) => {
                const aud = getPlanTargetAudience(plan.id, plan.targetAudience);
                return (
                  <td key={plan.id} className="py-2 px-3 sm:px-4 border-r border-slate-100 text-left text-xs">
                    <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 font-medium leading-relaxed">
                      {aud.government}
                    </div>
                  </td>
                );
              })}
              {isCombinedVisible && combinedTotals && (
                <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8] text-xs font-semibold text-indigo-900">
                  เสริมส่วนเกินสิทธิเบิกจ่ายตรง + ชดเชยรายวัน
                </td>
              )}
            </tr>

            {/* Row: ลูกค้าทั่วไป */}
            <tr className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
              <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4 sm:pl-5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ลูกค้าทั่วไป (อาชีพอิสระ)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  แบ่งชำระรายเดือน เบาใจ ไม่ต้องสำรองจ่าย
                </div>
              </td>
              {selectedPlans.map((plan) => {
                const aud = getPlanTargetAudience(plan.id, plan.targetAudience);
                return (
                  <td key={plan.id} className="py-2 px-3 sm:px-4 border-r border-slate-100 text-left text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 font-medium leading-relaxed">
                      {aud.generalPublic}
                    </div>
                  </td>
                );
              })}
              {isCombinedVisible && combinedTotals && (
                <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8] text-xs font-semibold text-emerald-900">
                  แพ็กเกจคุ้มครองครบวงจร แบ่งจ่ายรายเดือนสบาย
                </td>
              )}
            </tr>

            {/* ============================================================== */}
            {/* SECTION 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล */}
            {/* ============================================================== */}
            <tr className="bg-sky-100/90 text-sky-950 font-bold border-y-2 border-sky-300">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  ส่วนที่ 1 : ความคุ้มครองค่าห้อง ค่าอาหาร และค่าบริการพยาบาล
                </span>
              </td>
            </tr>

            {/* Subsection 1 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                1. ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล กรณีผู้ป่วยใน
              </td>
            </tr>

            {/* Row 1.1 - Room Normal */}
            {shouldShowRow('room-normal') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('room-normal')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    1.1 ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล ผู้ป่วยปกติ ต่อคืน
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.roomNormal.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.roomNormal.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.roomNormalPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.roomNormalMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 1.2 - Room ICU */}
            {shouldShowRow('room-icu') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('room-icu')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    1.2 ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล ผู้ป่วยหนัก ICU ต่อคืน
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.roomICU.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.roomICU.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.roomICUPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.roomICUMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 1.3 - Combined Room Limit */}
            {shouldShowRow('room-combined-max-limit') && (
              <tr className="bg-slate-50/50 border-b border-slate-200 transition-colors hover:bg-slate-100/60 font-medium">
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span>1.3 รวมวงเงินค่าห้องปกติ + ICU สูงสุดต่อครั้ง</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (คำนวณจากห้องปกติ 45 คืน + ICU 30 คืน)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planRoomMax = plan.roomNormal.maxLimit + plan.roomICU.maxLimit;
                  return (
                    <td
                      key={plan.id}
                      className="py-2 px-3 sm:px-4 text-center border-r border-slate-100 font-semibold text-sky-800 text-xs sm:text-sm"
                    >
                      {formatCurrency(planRoomMax)}
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.roomCombinedMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Subsection 2 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                2. ค่ารักษาพยาบาล กรณีผู้ป่วยใน
              </td>
            </tr>

            {/* Row 2.1 - Medical General */}
            {shouldShowRow('med-general') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('med-general')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2.1 ค่ารักษาพยาบาล และค่าบริการทั่วไป ต่อครั้ง
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.medicalGeneralPerVisit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.medicalGeneral)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.2 - Surgery */}
            {shouldShowRow('surgery') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('surgery')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2.2 การรักษาโดยการผ่าตัด ต่อโรค
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (เบิกตามค่าใช้จ่ายจริง ไม่เกินวงเงินในแผน)
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.surgeryPerDisorder)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.surgery)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.3 - Doctor Visit */}
            {shouldShowRow('doctor-visit') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('doctor-visit')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2.3 การดูแลโดยแพทย์ (ค่าแพทย์เยี่ยมไข้ ผู้ป่วยใน) สูงสุดต่อคืน
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.doctorVisitPerNight.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.doctorVisitPerNight.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.doctorVisitPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.doctorVisitMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.4 - Combined Inpatient Medical (General + Surgery) */}
            {shouldShowRow('med-inpatient-subtotal') && (
              <tr className="bg-[#f0f7fd]/70 border-b border-sky-200 transition-colors hover:bg-sky-50">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-sky-950 font-bold">
                    <HeartPulse className="w-4 h-4 text-[#00509d] shrink-0" />
                    <span>2.4 รวมค่ารักษาพยาบาลผู้ป่วยใน (ค่ารักษาทั่วไป + ค่าผ่าตัด)</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-700 font-semibold mt-0.5">
                    {existingCustomer
                      ? `⭐ รวมค่ารักษาพยาบาลกรณีลูกค้าเดิม (Top-up เพิ่มจากแผนเดิม ${existingCustomerPlan?.code || ''})`
                      : '⭐ รวมค่ารักษาทั่วไป + ค่าผ่าตัด ต่อการรักษาครั้งหนึ่ง'}
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planMedicalSubtotal = plan.medicalGeneralPerVisit + plan.surgeryPerDisorder;
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(planMedicalSubtotal)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        (ทั่วไป {formatCurrency(plan.medicalGeneralPerVisit)} + ผ่าตัด {formatCurrency(plan.surgeryPerDisorder)})
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-sm sm:text-base md:text-lg">
                      {formatCurrency(combinedTotals.inpatientMedicalSubtotal)}
                    </div>
                    <div className="text-[10px] font-bold text-[#00509d]">
                      {existingCustomer ? 'วงเงินรักษารวมของลูกค้าเดิม' : `รวม ${plansForCombined.length} แผน`}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.5 - Total Inpatient Maximum Limit */}
            {shouldShowRow('med-inpatient-max-limit') && (
              <tr className="bg-sky-50/40 border-b-2 border-slate-200 transition-colors hover:bg-sky-100/40">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>2.5 รวมผลประโยชน์ค่ารักษาผู้ป่วยในสูงสุด ต่อครั้ง ต่อโรค</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (รวมค่าห้องปกติ 45 คืน + ค่ารักษาทั่วไป + ผ่าตัด + ค่าแพทย์ 45 คืน)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planInpatientMax =
                    plan.roomNormal.maxLimit +
                    plan.medicalGeneralPerVisit +
                    plan.surgeryPerDisorder +
                    plan.doctorVisitPerNight.maxLimit;
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-black text-blue-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(planInpatientMax)}
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-sm sm:text-base md:text-lg">
                      {formatCurrency(combinedTotals.inpatientMedicalMaxLimit)}
                    </div>
                    <div className="text-[10px] font-bold text-[#00509d]">
                      วงเงินสูงสุดรวมต่อครั้ง
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Subsection 3 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                3. ค่ารักษาพยาบาล กรณีผู้ป่วยนอก OPD ต่อครั้ง
              </td>
            </tr>

            {/* Row 3.1 - OPD Accident */}
            {shouldShowRow('opd-accident') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('opd-accident')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    3.1 กรณีอุบัติเหตุ ไม่จำกัดจำนวนครั้ง
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.opd.accident)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.opdAccident)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.2 - OPD Illness */}
            {shouldShowRow('opd-illness') && (
              <tr
                className={`border-b-2 border-sky-200 transition-colors ${
                  isRowDiff('opd-illness')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                    <span>3.2 กรณีโรคภัยไข้เจ็บ</span>
                    {isRowDiff('opd-illness') && (
                      <span className="text-[9px] sm:text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        จุดต่างสำคัญ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (การพบแพทย์รักษาแบบผู้ป่วยนอกทั่วไป ไม่ต้องนอน รพ.)
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    {plan.opd.illness.covered ? (
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                          {formatCurrency(plan.opd.illness.perVisit || 0)}
                        </div>
                        <div className="text-[11px] font-semibold text-sky-600">
                          {plan.opd.illness.maxVisitsPerYear} ครั้ง/ปี
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-rose-600 text-xs md:text-sm flex items-center justify-center gap-1">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>ไม่คุ้มครอง</span>
                      </div>
                    )}
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    {combinedTotals.hasOpdIllness ? (
                      <div>
                        <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                          {formatCurrency(combinedTotals.opdIllnessPerVisit)}
                        </div>
                        <div className="text-[11px] font-bold text-sky-700">
                          รวม {combinedTotals.opdIllnessMaxVisits} ครั้ง/ปี
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">ไม่คุ้มครอง</span>
                    )}
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.3 - Total OPD per visit */}
            {shouldShowRow('opd-total-per-visit') && (
              <tr className="bg-[#f0f7fd]/70 border-b-2 border-sky-300 transition-colors hover:bg-sky-50">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-sky-950 font-bold">
                    <Stethoscope className="w-4 h-4 text-[#00509d] shrink-0" />
                    <span>3.3 รวมวงเงินค่ารักษา OPD ต่อครั้ง (อุบัติเหตุ + โรคทั่วไป)</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-700 font-medium mt-0.5">
                    (รวมสิทธิ์ OPD ทุกกรณี ต่อครั้งที่เข้ารับการรักษาแบบผู้ป่วยนอก)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planOpdTotal =
                    plan.opd.accident +
                    (plan.opd.illness.covered ? plan.opd.illness.perVisit || 0 : 0);
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(planOpdTotal)}
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-sm sm:text-base md:text-lg">
                      {formatCurrency(combinedTotals.opdTotalPerVisit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* ============================================================== */}
            {/* SECTION 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยการนอนรักษาพยาบาล */}
            {/* ============================================================== */}
            <tr className="bg-gradient-to-r from-sky-700 to-blue-700 text-white font-bold">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-sky-200" />
                  <span>ส่วนที่ 2 : สิทธิพิเศษเพิ่มเติม / ค่าชดเชยการนอนรักษาพยาบาลผู้ป่วยใน</span>
                </div>
              </td>
            </tr>

            {/* Section 2 - Row 1 - Daily Compensation */}
            {shouldShowRow('daily-comp') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('daily-comp')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4">
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <span>1. ค่าชดเชยการนอนรักษาพยาบาลผู้ป่วยใน ต่อคืน</span>
                    {isRowDiff('daily-comp') && (
                      <span className="text-[9px] sm:text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        จุดต่างสำคัญ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุด ต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div
                      className={`text-xs sm:text-sm md:text-base ${
                        plan.dailyCompensation.perNight >= 1000
                          ? 'font-black text-blue-900'
                          : 'font-bold text-slate-900'
                      }`}
                    >
                      {formatCurrency(plan.dailyCompensation.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.dailyCompensation.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.dailyCompPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.dailyCompMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Section 2 - Row 2 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                2. ใช้สิทธิ์เบิกค่ารักษาพยาบาลจากหน่วยงานอื่น เช่น ส่วนราชการ, รัฐวิสาหกิจ, ประกันสังคม
                <span className="text-sky-600 font-normal ml-1 text-[11px]">(กรณีไม่ใช้ส่วนที่ 1)</span>
              </td>
            </tr>

            {/* Section 2 - Row 2.1 */}
            {shouldShowRow('other-rights-normal') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('other-rights-normal')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    ค่าชดเชยการนอนรักษาพยาบาล ห้องปกติ ต่อคืน
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div
                      className={`text-xs sm:text-sm md:text-base ${
                        plan.otherRightsNormalRoom.perNight > 1500
                          ? 'font-black text-blue-900'
                          : 'font-bold text-slate-900'
                      }`}
                    >
                      {formatCurrency(plan.otherRightsNormalRoom.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.otherRightsNormalRoom.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.otherRightsNormalPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.otherRightsNormalMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Section 2 - Row 2.2 */}
            {shouldShowRow('other-rights-icu') && (
              <tr
                className={`border-b-2 border-sky-200 transition-colors ${
                  isRowDiff('other-rights-icu')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    ค่าชดเชยการนอนรักษาพยาบาล ห้อง ICU ต่อคืน
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.otherRightsICU.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.otherRightsICU.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.otherRightsICUPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.otherRightsICUMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* ============================================================== */}
            {/* SECTION 3: ความคุ้มครองการเสียชีวิต */}
            {/* ============================================================== */}
            <tr className="bg-sky-100/90 text-sky-950 font-bold border-y-2 border-sky-300">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  ส่วนที่ 3 : ความคุ้มครองการเสียชีวิต
                </span>
              </td>
            </tr>

            {/* Row 3.1 - Accident General */}
            {shouldShowRow('life-accident') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('life-accident')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-700 font-semibold text-[11px] sm:text-xs whitespace-nowrap mt-0.5">
                      เสียชีวิตอุบัติเหตุ (อบ.2)
                    </span>
                    <div className="text-slate-800">
                      เสียชีวิต สูญเสียอวัยวะหรือทุพพลภาพถาวรจากอุบัติเหตุทั่วไป
                    </div>
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div
                      className={`text-xs sm:text-sm md:text-base ${
                        plan.life.accidentGeneral >= 100000
                          ? 'font-bold text-slate-900'
                          : 'font-semibold text-slate-600'
                      }`}
                    >
                      {formatCurrency(plan.life.accidentGeneral)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeAccidentGeneral)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.2 - Murder */}
            {shouldShowRow('life-murder') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('life-murder')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-8 sm:pl-12">
                  <div className="text-slate-800 font-normal">
                    เสียชีวิตจากการถูกฆาตกรรมหรือถูกลอบทำร้ายร่างกาย
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.life.murderAssault)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeMurder)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.3 - Motorcycle */}
            {shouldShowRow('life-motorcycle') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('life-motorcycle')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-8 sm:pl-12">
                  <div className="text-slate-800 font-normal">
                    เสียชีวิตจากการขับขี่หรือโดยสารรถจักรยานยนต์
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.life.motorcycle)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeMotorcycle)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.4 - Funeral */}
            {shouldShowRow('life-funeral') && (
              <tr
                className={`border-b-2 border-slate-300 transition-colors ${
                  isRowDiff('life-funeral')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4">
                  <div className="text-slate-800 font-medium">
                    2. ค่าปลงศพหรือจัดการงานศพ กรณีเสียชีวิตจากการเจ็บป่วย
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    (ระยะเวลารอคอย 180 วัน)
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    {plan.category === 'pa' ? (
                      <div>
                        <div className="text-slate-400 font-medium text-xs">-</div>
                        <div className="text-[10px] text-slate-400">ไม่มีค่าปลงศพ</div>
                      </div>
                    ) : (
                      <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(plan.life.funeralBenefit)}
                      </div>
                    )}
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeFuneral)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* ============================================================== */}
            {/* SECTION 4: รายละเอียดตารางความคุ้มครองอุบัติเหตุ อบ.2            */}
            {/* ============================================================== */}
            <tr className="bg-gradient-to-r from-amber-700 via-sky-800 to-blue-900 text-white font-bold border-t-2 border-amber-400">
              <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <span className="font-bold">
                        ส่วนที่ 4 : ตารางผลประโยชน์ความคุ้มครองอุบัติเหตุ อบ.2
                      </span>
                      <span className="hidden sm:inline text-amber-200 font-normal ml-2 text-[11px]">
                        (สูญเสียอวัยวะ สายตา ทุพพลภาพถาวรสิ้นเชิง และค่ารักษาอุบัติเหตุ)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaDetails(!showPaDetails)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/15 hover:bg-white/25 active:bg-white/30 text-amber-100 px-2.5 py-1 rounded-md transition-colors border border-amber-300/30"
                  >
                    <span>{showPaDetails ? 'ย่อข้อย่อย อบ.2' : 'ขยายข้อย่อย อบ.2 ทั้งหมด'}</span>
                    {showPaDetails ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </td>
            </tr>

            {/* Section 4 - Row 0: Accident Medical Treatment */}
            {shouldShowRow('pa-accident-treatment') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('pa-accident-treatment')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4 sm:pl-5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    <span>ค่ารักษาพยาบาลจากอุบัติเหตุ ต่อครั้ง</span>
                    <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded border border-sky-300">
                      ผู้ป่วยนอก & ใน
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (จ่ายตามค่าใช้จ่ายจริงที่เกิดขึ้น ไม่เกินวงเงินต่อครั้ง)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const treatmentAmount =
                    plan.paSchedule?.accidentMedicalTreatment ?? plan.opd.accident;
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div
                        className={`text-xs sm:text-sm md:text-base font-black ${
                          plan.category === 'pa' ? 'text-amber-700' : 'text-slate-900'
                        }`}
                      >
                        {formatCurrency(treatmentAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {plan.category === 'pa' ? 'วงเงินอุบัติเหตุ อบ.2' : 'คุ้มครองอุบัติเหตุฉุกเฉิน'}
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.opdAccident)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Subsection Header: อบ.2 Dismemberment & Disability */}
            <tr className="bg-slate-100/90 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                <span className="text-slate-900 font-bold">
                  การชดเชยการสูญเสียอวัยวะ สายตา หรือทุพพลภาพถาวรสิ้นเชิง อันเนื่องมาจากอุบัติเหตุ
                </span>
                <span className="text-slate-500 font-normal ml-1">
                  (ตามข้อตกลงคุ้มครอง อบ.2)
                </span>
              </td>
            </tr>

            {/* Row 4.1: Permanent Total Disability (100%) */}
            {shouldShowRow('pa-permanent-disability') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('pa-permanent-disability')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-semibold flex items-center justify-between">
                    <span>1. ทุพพลภาพถาวรสิ้นเชิง</span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 ml-1">
                      100%
                    </span>
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const val = getPlanPaValue(plan, 'permanentDisability', 1.0);
                  return (
                    <td
                      key={plan.id}
                      className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div
                        className={`text-xs sm:text-sm md:text-base font-bold ${
                          plan.category === 'pa' ? 'text-sky-950 font-black' : 'text-slate-900'
                        }`}
                      >
                        {formatCurrency(val)}
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.paPermanentDisability)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 4.2: Loss of 2 limbs or 2 eyes (100%) */}
            {shouldShowRow('pa-two-limbs') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('pa-two-limbs')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2. มือ 2 ข้าง หรือเท้า 2 ข้าง หรือสายตา 2 ข้าง
                  </div>
                  <div className="text-[10px] text-slate-500">
                    หรืออย่างใดอย่างหนึ่งรวมกันตั้งแต่ 2 อย่างขึ้นไป
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const val = getPlanPaValue(plan, 'twoLimbsOrEyes', 1.0);
                  return (
                    <td
                      key={plan.id}
                      className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(val)}
                      </div>
                      <div className="text-[10px] text-sky-600 font-semibold">100%</div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.paTwoLimbsOrEyes)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 4.3: Loss of 1 limb or 1 eye (60%) */}
            {shouldShowRow('pa-one-limb') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('pa-one-limb')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    3. มือ 1 ข้าง หรือเท้า 1 ข้าง หรือสายตา 1 ข้าง
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const val = getPlanPaValue(plan, 'oneLimbOrEye', 0.6);
                  return (
                    <td
                      key={plan.id}
                      className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(val)}
                      </div>
                      <div className="text-[10px] text-sky-600 font-semibold">60%</div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.paOneLimbOrEye)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Collapsible Detailed Schedule Rows */}
            {showPaDetails && (
              <>
                {/* Row 4.4: Deaf both ears or mute (50%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      4. หูหนวกทั้ง 2 ข้าง หรือเป็นใบ้
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'deafBothOrMute', 0.5);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">50%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paDeafBothOrMute)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.5: Thumb 2 joints (25%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      5. สูญเสียนิ้วหัวแม่มือ (อย่างน้อย 2 ข้อ)
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'thumbTwoJoints', 0.25);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">25%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paThumbTwoJoints)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.6: Deaf 1 ear (15%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      6. หูหนวก 1 ข้าง
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'deafOneEar', 0.15);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">15%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paDeafOneEar)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.7: Thumb 1 joint (10%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      7. สูญเสียนิ้วหัวแม่มือ (1 ข้อ)
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'thumbOneJoint', 0.1);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">10%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paThumbOneJoint)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.8: Index finger 3 joints (10%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      8. สูญเสียนิ้วชี้ (อย่างน้อย 3 ข้อ)
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'indexFingerThreeJoints', 0.1);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">10%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paIndexFingerThreeJoints)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.9: Index finger 2 joints (8%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      9. สูญเสียนิ้วชี้ (2 ข้อ)
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'indexFingerTwoJoints', 0.08);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">8%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paIndexFingerTwoJoints)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.10: Index finger 1 joint (4%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      10. สูญเสียนิ้วชี้ (1 ข้อ)
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'indexFingerOneJoint', 0.04);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">4%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paIndexFingerOneJoint)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.11: Other fingers 2 joints (5%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      11. สูญเสียนิ้วอื่น ๆ นอกจากนิ้วหัวแม่มือและนิ้วชี้ (อย่างน้อย 2 ข้อ) ต่อนิ้ว
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'otherFingersTwoJoints', 0.05);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">5%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paOtherFingersTwoJoints)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.12: Big toe (5%) */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      12. สูญเสียนิ้วหัวแม่เท้า
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'bigToe', 0.05);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">5%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paBigToe)}
                      </div>
                    </td>
                  )}
                </tr>

                {/* Row 4.13: Other fingers 1 joint (1%) */}
                <tr className="border-b-2 border-slate-300 hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                    <div className="text-slate-800 font-normal">
                      13. สูญเสียนิ้วอื่น ๆ นอกจากนิ้วหัวแม่เท้า (1 ข้อ) ต่อนิ้ว
                    </div>
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = getPlanPaValue(plan, 'otherFingersOneJoint', 0.01);
                    return (
                      <td
                        key={plan.id}
                        className="py-1.5 px-3 sm:px-4 text-center border-r border-slate-100"
                      >
                        <div className="font-medium text-slate-900 text-xs sm:text-sm">
                          {formatCurrency(val)}
                        </div>
                        <div className="text-[9px] text-slate-400">1%</div>
                      </td>
                    );
                  })}
                  {isCombinedVisible && combinedTotals && (
                    <td className="py-1.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                      <div className="font-bold text-[#00509d] text-xs sm:text-sm">
                        {formatCurrency(combinedTotals.paOtherFingersOneJoint)}
                      </div>
                    </td>
                  )}
                </tr>
              </>
            )}
          </tbody>

          {/* Table Footer: Premiums (รายเดือน & รายปี) + Combined Premium */}
          <tfoot>
            <tr className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 text-white border-t-2 border-sky-400">
              <td className="p-3.5 sm:p-4 font-bold text-base md:text-lg border-r border-sky-800">
                <div className="tracking-wide">เบี้ยประกันภัย</div>
                <div className="text-[11px] font-normal text-sky-300 mt-0.5">
                  (คำนวณแบ่งจ่ายรายเดือน และรายปี รวมภาษี/อากร)
                </div>
              </td>

              {selectedPlans.map((plan) => (
                <td
                  key={plan.id}
                  className="p-3 sm:p-4 text-center border-r border-sky-800 align-middle"
                >
                  <div className="flex items-baseline justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {formatCurrency(plan.monthlyPremium)}
                    </span>
                    <span className="text-xs font-normal text-sky-200 ml-1">บาท/เดือน</span>
                  </div>
                  <div className="text-[11px] font-semibold text-sky-300 mt-1 bg-sky-950/70 py-0.5 px-2 rounded-full inline-block border border-sky-800/40">
                    {formatCurrency(plan.annualPremium)} บาท/ปี
                  </div>

                  {/* ปุ่มสนใจแผนนี้ (ลิงก์ไปยังเว็ป https://prmorder.uatsiamsmile.com/) */}
                  {!printMode && (
                    <div className="no-print mt-2.5 space-y-1.5">
                      <a
                        href="https://prmorder.uatsiamsmile.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                        title={`สนใจแผน ${plan.name} - สั่งซื้อออนไลน์ที่ https://prmorder.uatsiamsmile.com/`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span>สนใจแผนนี้</span>
                      </a>
                    </div>
                  )}
                </td>
              ))}

              {/* Combined Total Premium Footer Cell */}
              {isCombinedVisible && combinedTotals && (
                <td className="p-3.5 sm:p-4 text-center bg-gradient-to-b from-[#0a4882] via-[#094f92] to-[#002f5c] text-white border-l-2 border-sky-300 align-middle">
                  <div className="text-[10px] font-bold text-sky-200 mb-0.5 tracking-wide">
                    {existingCustomer
                      ? `เบี้ยรวมแผนเดิม + ใหม่ (${plansForCombined.length} แผน)`
                      : `เบี้ยรวม (${selectedPlans.length} แผน)`}
                  </div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                      {formatCurrency(combinedTotals.monthlyPremium)}
                    </span>
                    <span className="text-xs font-normal text-sky-200 ml-1">บาท/เดือน</span>
                  </div>
                  <div className="text-[11px] font-bold text-sky-100 mt-1 bg-white/15 py-0.5 px-2.5 rounded-full inline-block border border-sky-300/40 shadow-xs">
                    {formatCurrency(combinedTotals.annualPremium)} บาท/ปี
                  </div>
                  {existingCustomer && combinedTotals.addedMonthly > 0 && (
                    <div className="mt-1.5 text-[10px] font-extrabold text-sky-100 bg-sky-900/80 border border-sky-400/50 py-0.5 px-2 rounded-md">
                      ลูกค้าเดิมจ่ายเพิ่มเพียง +฿{formatCurrency(combinedTotals.addedMonthly)}/เดือน
                    </div>
                  )}
                </td>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Terms and Conditions Section (displayed on comparison page and included in all PDF/Print exports) */}
      <div className="p-3 sm:p-5 bg-slate-50 border-t border-slate-200">
        <PolicyTermsNotice
          coordinatorName={exportMeta?.coordinatorName}
          coordinatorPhone={exportMeta?.coordinatorPhone}
        />
      </div>

      {/* Payment Modal for Purchasing Plan from Comparison Table */}
      {selectedPlanForPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlanForPayment(null);
          }}
          proposal={getPlanProposalData(selectedPlanForPayment)}
          customerName={existingCustomer?.fullName || 'คุณลูกค้าสยามสไมล์'}
          customerPhone={existingCustomer?.phone || '081-445-6789'}
          onPaymentSuccess={handlePaymentSuccess}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
