import React, { useState } from 'react';
import { InsurancePlan, CustomerProfile, CustomerPolicyItem, PlanCategory } from '../types';
import { formatCurrency, getPlanTargetAudience, getPlanPrimaryAudience } from '../data/plans';
import { calculatePolicyDuration } from '../data/customers';
import {
  Check,
  X,
  Layers,
  UserCheck,
  Calendar,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Settings,
  Clock,
  Activity,
  Plus,
  FileText,
  Car,
  Home,
  Shield,
  Building,
  Landmark,
  Users,
  Heart,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  CreditCard,
  Share2,
  ExternalLink,
  Scale,
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { ForwardCustomerModal, PlanCodeProposalData } from './ForwardCustomerModal';

interface PlanSelectorProps {
  allPlans: InsurancePlan[];
  selectedPlanIds: string[];
  onTogglePlan: (planId: string) => void;
  onSetSelection: (planIds: string[]) => void;
  currentAge?: number | null;
  existingCustomer?: CustomerProfile | null;
  onResetCustomer?: () => void;
  onOpenPlanSettings?: () => void;
  onGoToComparison?: () => void;
  onAssignPlanToCustomer?: (customer: CustomerProfile, newPolicy: CustomerPolicyItem) => void;
  onShowToast?: (msg: string) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  allPlans,
  selectedPlanIds,
  onTogglePlan,
  onSetSelection,
  currentAge = null,
  existingCustomer = null,
  onResetCustomer,
  onOpenPlanSettings,
  onGoToComparison,
  onAssignPlanToCustomer,
  onShowToast,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'health' | 'pa'>('all');
  const [customerPolicyFilter, setCustomerPolicyFilter] = useState<'all' | 'health_pa' | 'motor' | 'other'>('all');
  const [selectedAudienceFilter, setSelectedAudienceFilter] = useState<
    'all' | 'government' | 'office' | 'senior' | 'lumpsum' | 'general'
  >('all');
  const [interestedToastPlanName, setInterestedToastPlanName] = useState<string | null>(null);

  // Buy Insurance & Forward Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState<boolean>(false);
  const [selectedPlanForAction, setSelectedPlanForAction] = useState<InsurancePlan | null>(null);

  const MAX_SELECTION = 3;
  const isMaxSelected = selectedPlanIds.length >= MAX_SELECTION;

  const getPlanProposalData = (plan: InsurancePlan): PlanCodeProposalData => {
    const isPa = plan.category === 'pa';
    const accidentCoverage = plan.paSchedule?.permanentDisability || plan.life.accidentGeneral || 200000;
    return {
      insuranceType: isPa ? 'pa' : 'health',
      planCode: plan.code,
      planName: plan.name,
      quotingCode: `SSM-${plan.code.toUpperCase()}-WEB`,
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

  const handleBuyPlanClick = (plan: InsurancePlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlanForAction(plan);
    setIsPaymentModalOpen(true);
  };

  const handleForwardPlanClick = (plan: InsurancePlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlanForAction(plan);
    setIsForwardModalOpen(true);
  };

  const handlePaymentSuccess = (issuedPolicy: CustomerPolicyItem) => {
    if (selectedPlanForAction) {
      const targetCustomer: CustomerProfile = existingCustomer || {
        idCard: '1100200300400',
        fullName: 'คุณลูกค้าสยามสไมล์',
        birthDate: '1995-05-15',
        age: 30,
        phone: '081-445-6789',
        policyNumber: issuedPolicy.policyNumber,
        existingPlanId: selectedPlanForAction.id,
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

  const handleInterestedClick = (plan: InsurancePlan, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPlanIds.includes(plan.id)) {
      if (selectedPlanIds.length < MAX_SELECTION) {
        onTogglePlan(plan.id);
        setInterestedToastPlanName(`บันทึกความสนใจ ${plan.name} เรียบร้อยแล้ว (เลือก ${selectedPlanIds.length + 1}/3 แผน)`);
      } else {
        setInterestedToastPlanName(`เลือกเปรียบเทียบได้สูงสุด ${MAX_SELECTION} แผน กรุณายกเลิกแผนเดิมก่อน`);
      }
    } else {
      onTogglePlan(plan.id);
      setInterestedToastPlanName(`ยกเลิกความสนใจ ${plan.name} แล้ว`);
    }
    setTimeout(() => {
      setInterestedToastPlanName(null);
    }, 3200);
  };

  const existingCustomerPlan = existingCustomer
    ? allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null
    : null;

  const isExistingPlanSelected = existingCustomerPlan
    ? selectedPlanIds.includes(existingCustomerPlan.id)
    : false;

  const policyDuration = existingCustomer
    ? calculatePolicyDuration(existingCustomer.startDate)
    : null;

  const filteredPlans = allPlans.filter((plan) => {
    if (activeCategoryTab === 'health' && plan.category !== 'health') return false;
    if (activeCategoryTab === 'pa' && plan.category !== 'pa') return false;
    if (selectedAudienceFilter !== 'all') {
      const primaryAud = getPlanPrimaryAudience(plan.id);
      if (
        primaryAud.audienceGroup !== selectedAudienceFilter &&
        !primaryAud.tags.includes(selectedAudienceFilter)
      ) {
        return false;
      }
    }
    return true;
  });

  const healthPlansCount = allPlans.filter((p) => p.category === 'health').length;
  const paPlansCount = allPlans.filter((p) => p.category === 'pa').length;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 sm:p-5 mb-4">
      {/* 1. ข้อมูลลูกค้าเดิมและแผนที่ถือครอง (รวมประกันสุขภาพ, รถยนต์, และประกันอื่นๆ) */}
      {existingCustomer && (() => {
        const customerPolicies: CustomerPolicyItem[] =
          existingCustomer.policies && existingCustomer.policies.length > 0
            ? existingCustomer.policies
            : [
                {
                  policyNumber: existingCustomer.policyNumber,
                  planId: existingCustomer.existingPlanId,
                  policyType: 'health',
                  startDate: existingCustomer.startDate,
                  lossClaimRate: existingCustomer.lossClaimRate,
                  lossClaimStatus: existingCustomer.lossClaimStatus,
                },
              ];

        const getPolicyType = (pol: CustomerPolicyItem): 'health' | 'pa' | 'motor' | 'fire' | 'life' | 'other' => {
          if (pol.policyType) return pol.policyType;
          if (
            pol.vehicleDetails ||
            pol.customPlanName?.includes('รถ') ||
            pol.customPlanName?.includes('พ.ร.บ.') ||
            pol.policyNumber.startsWith('VMI') ||
            pol.policyNumber.startsWith('CMI')
          ) {
            return 'motor';
          }
          if (
            pol.customPlanName?.includes('อัคคีภัย') ||
            pol.customPlanName?.includes('บ้าน') ||
            pol.policyNumber.startsWith('FIR')
          ) {
            return 'fire';
          }
          const plan = allPlans.find((p) => p.id === pol.planId);
          if (plan?.category === 'pa' || pol.policyNumber.includes('PA')) return 'pa';
          return 'health';
        };

        const motorPolicies = customerPolicies.filter((p) => getPolicyType(p) === 'motor');
        const healthPaPolicies = customerPolicies.filter((p) => {
          const type = getPolicyType(p);
          return type === 'health' || type === 'pa';
        });
        const otherPolicies = customerPolicies.filter((p) => {
          const type = getPolicyType(p);
          return type !== 'motor' && type !== 'health' && type !== 'pa';
        });

        const displayedCustomerPolicies = customerPolicies.filter((pol) => {
          if (customerPolicyFilter === 'all') return true;
          const type = getPolicyType(pol);
          if (customerPolicyFilter === 'health_pa') return type === 'health' || type === 'pa';
          if (customerPolicyFilter === 'motor') return type === 'motor';
          if (customerPolicyFilter === 'other') return type !== 'motor' && type !== 'health' && type !== 'pa';
          return true;
        });

        let totalExistingMonthly = 0;
        let totalExistingAnnual = 0;

        customerPolicies.forEach((pol) => {
          const plan = pol.planId ? allPlans.find((p) => p.id === pol.planId) : undefined;
          totalExistingMonthly += plan?.monthlyPremium ?? pol.monthlyPremium ?? 0;
          totalExistingAnnual += plan?.annualPremium ?? pol.annualPremium ?? 0;
        });

        return (
          <div className="mb-5 rounded-xl border border-blue-200/80 bg-white shadow-xs overflow-hidden">
            {/* Header: Customer Info & Status Bar - โทนสีฟ้า มินิมอล สะอาดตา */}
            <div className="bg-blue-50/70 px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      แผนเดิมที่ถือครอง: คุณ{existingCustomer.fullName}
                    </span>
                    <span className="text-xs text-slate-500">
                      (อายุ {existingCustomer.age} ปี)
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                      รวม {customerPolicies.length} กรมธรรม์
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-0.5 text-xs text-slate-500 flex-wrap">
                    <span>เลขบัตร: <strong className="font-mono text-slate-700">{existingCustomer.idCard}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span>LINE OA: <strong className="text-slate-700">{existingCustomer.lineOaStatusText}</strong></span>
                  </div>
                </div>
              </div>

              {onResetCustomer && (
                <button
                  type="button"
                  onClick={onResetCustomer}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline self-start sm:self-center cursor-pointer transition-colors"
                >
                  เปลี่ยนลูกค้า
                </button>
              )}
            </div>

            {/* Filter Tabs for Policy Types (All, Health/PA, Motor, Other) */}
            {customerPolicies.length > 1 && (
              <div className="bg-white px-3.5 py-2 border-b border-slate-100 flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">หมวดหมู่:</span>
                <button
                  type="button"
                  onClick={() => setCustomerPolicyFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    customerPolicyFilter === 'all'
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  ทั้งหมด ({customerPolicies.length})
                </button>

                {healthPaPolicies.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomerPolicyFilter('health_pa')}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                      customerPolicyFilter === 'health_pa'
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3 text-blue-500" />
                    <span>สุขภาพ/PA ({healthPaPolicies.length})</span>
                  </button>
                )}

                {motorPolicies.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomerPolicyFilter('motor')}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                      customerPolicyFilter === 'motor'
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <Car className="w-3 h-3 text-blue-500" />
                    <span>ประกันรถยนต์ ({motorPolicies.length})</span>
                  </button>
                )}

                {otherPolicies.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomerPolicyFilter('other')}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                      customerPolicyFilter === 'other'
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <Home className="w-3 h-3 text-blue-500" />
                    <span>ประกันอื่นๆ ({otherPolicies.length})</span>
                  </button>
                )}
              </div>
            )}

            {/* Policies list in clean minimal blue-tinted rows */}
            <div className="divide-y divide-slate-100">
              {displayedCustomerPolicies.map((pol, idx) => {
                const type = getPolicyType(pol);
                const plan = pol.planId ? allPlans.find((p) => p.id === pol.planId) : undefined;
                const duration = calculatePolicyDuration(pol.startDate);
                const isSelected = pol.planId ? selectedPlanIds.includes(pol.planId) : false;
                const monthly = plan?.monthlyPremium ?? pol.monthlyPremium ?? 0;
                const annual = plan?.annualPremium ?? pol.annualPremium ?? 0;
                const lossStatus = pol.lossClaimStatus || existingCustomer.lossClaimStatus;

                const displayName = plan?.name || pol.customPlanName || pol.planId || pol.policyNumber;

                return (
                  <div
                    key={`${pol.policyNumber}-${idx}`}
                    className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-blue-50/20 transition-colors"
                  >
                    {/* Left: Plan Info & Indicators */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Icon badge by type */}
                        {type === 'motor' ? (
                          <span className="p-1 rounded bg-blue-100 text-blue-700 inline-flex items-center justify-center shrink-0">
                            <Car className="w-3.5 h-3.5" />
                          </span>
                        ) : type === 'fire' ? (
                          <span className="p-1 rounded bg-amber-100 text-amber-700 inline-flex items-center justify-center shrink-0">
                            <Home className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="p-1 rounded bg-blue-100 text-blue-700 inline-flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}

                        <span className="font-bold text-slate-900 text-sm">
                          {displayName}
                        </span>

                        {/* Category tag */}
                        {type === 'motor' ? (
                          <span className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {pol.vehicleDetails?.insuranceClass === 'พ.ร.บ.' ? 'พ.ร.บ. รถยนต์' : 'ประกันรถยนต์'}
                          </span>
                        ) : type === 'fire' ? (
                          <span className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            ประกันอัคคีภัย/บ้าน
                          </span>
                        ) : (
                          <span className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {plan?.category === 'pa' ? 'ประกันอุบัติเหตุ' : 'ประกันสุขภาพ'}
                          </span>
                        )}

                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {pol.policyNumber}
                        </span>

                        {/* Health specific: OPD badge */}
                        {type === 'health' && plan && (
                          plan.opd.illness.covered ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" /> คุ้มครอง OPD {plan.opd.illness.perVisit ? `฿${formatCurrency(plan.opd.illness.perVisit)}/ครั้ง` : ''}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              <X className="w-3 h-3 text-slate-400" /> ไม่คุ้มครอง OPD
                            </span>
                          )
                        )}

                        {type === 'pa' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            <Check className="w-3 h-3 text-sky-600" /> OPD อุบัติเหตุ ฿{formatCurrency(plan?.opd.accident || 5000)}
                          </span>
                        )}
                      </div>

                      {/* Motor specific: Car details pill strip */}
                      {type === 'motor' && pol.vehicleDetails && (
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs">
                          {pol.vehicleDetails.licensePlate && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 font-semibold text-blue-900">
                              🚗 ทะเบียน: {pol.vehicleDetails.licensePlate}
                            </span>
                          )}
                          {pol.vehicleDetails.brandModel && (
                            <span className="text-slate-600">
                              {pol.vehicleDetails.brandModel}
                            </span>
                          )}
                          {pol.vehicleDetails.insuranceClass && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                              {pol.vehicleDetails.insuranceClass}
                              {pol.vehicleDetails.repairType ? ` (${pol.vehicleDetails.repairType})` : ''}
                            </span>
                          )}
                          {pol.vehicleDetails.sumInsured && (
                            <span className="text-slate-700 font-medium">
                              ทุนประกัน: <strong className="text-blue-900 font-bold">฿{formatCurrency(pol.vehicleDetails.sumInsured)}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Fire / Other specific: Sum insured */}
                      {type === 'fire' && pol.sumInsured && (
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-slate-600">
                          <span>ทุนประกันความคุ้มครอง: <strong className="text-blue-900 font-bold">฿{formatCurrency(pol.sumInsured)}</strong></span>
                          {pol.companyName && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span>บริษัท: {pol.companyName}</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Dates & Loss Claim status - มินิมอล สบายตา */}
                      <div className="flex items-center gap-2 sm:gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>วันที่เริ่ม: <strong className="text-slate-700 font-medium">{pol.startDate}</strong></span>
                        </div>
                        {pol.endDate && (
                          <>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>สิ้นสุด: <strong className="text-slate-700 font-medium">{pol.endDate}</strong></span>
                            </div>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>ระยะเวลา: <strong className="text-blue-900 font-semibold">{duration.displayText}</strong></span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>ประวัติเคลม: <strong className="text-slate-700 font-medium">{lossStatus}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Premium & Action Button */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <div className="text-xs sm:text-sm font-bold text-slate-900">
                          ฿{formatCurrency(monthly)}<span className="text-[10px] text-slate-400 font-normal">/เดือน</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          ฿{formatCurrency(annual)}/ปี
                        </div>
                      </div>

                      {/* Compare toggle button if it's a selectable health/PA plan */}
                      {plan ? (
                        <button
                          type="button"
                          onClick={() => onTogglePlan(plan.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                            isSelected
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-blue-200" />
                              <span>อยู่ในตาราง</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-blue-600" />
                              <span>เปรียบเทียบ</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>คุ้มครองอยู่</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary bar across all held policies */}
            {customerPolicies.length > 1 && (
              <div className="bg-blue-50/50 px-4 py-2.5 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-700">
                    รวมเบี้ยแผนเดิมที่ถือครอง ({customerPolicies.length} กรมธรรม์):
                  </span>
                  {motorPolicies.length > 0 && (
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                      รถยนต์ {motorPolicies.length} ฉบับ
                    </span>
                  )}
                  {healthPaPolicies.length > 0 && (
                    <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      สุขภาพ/PA {healthPaPolicies.length} ฉบับ
                    </span>
                  )}
                  {otherPolicies.length > 0 && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      อื่นๆ {otherPolicies.length} ฉบับ
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
                  <span className="font-bold text-blue-900 text-xs sm:text-sm">
                    ฿{formatCurrency(totalExistingMonthly)}/เดือน
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (฿{formatCurrency(totalExistingAnnual)}/ปี)
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Visual Section Divider: มินิมอล เรียบร้อย */}
      {existingCustomer && (
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 shadow-2xs">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>เลือกแผนใหม่ด้านล่างเพื่อเปรียบเทียบ / Top-up</span>
          </div>
        </div>
      )}

      {/* Age filter banner if NO existing customer but age filter is active */}
      {!existingCustomer && currentAge !== null && (
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="font-semibold text-slate-700">
              กรองตามอายุ: {currentAge} ปี
            </span>
          </div>

          {onResetCustomer && (
            <button
              type="button"
              onClick={onResetCustomer}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              เปลี่ยนข้อมูล
            </button>
          )}
        </div>
      )}

      {/* Clean & Minimal Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {existingCustomer ? 'เลือกแผนที่จะเปรียบเทียบ / Top-up' : 'เลือกแผนเปรียบเทียบ'}
          </h2>
          <span className="text-[11px] text-slate-400">
            (สูงสุด {MAX_SELECTION} แผน)
          </span>
        </div>

        {/* Minimal Category Tabs & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          {/* Category Tabs */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveCategoryTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ทั้งหมด ({allPlans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('health')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'health'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              สุขภาพ ({healthPlansCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('pa')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'pa'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PA ({paPlansCount})
            </button>
          </div>

          {/* Settings Button */}
          {onOpenPlanSettings && (
            <button
              type="button"
              onClick={onOpenPlanSettings}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
              title="ตั้งค่าความคุ้มครองและชื่อแผนประกัน"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">ตั้งค่าแผน</span>
            </button>
          )}

          {/* Selection Counter Pill */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              selectedPlanIds.length > 0
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            เลือก {selectedPlanIds.length}/{MAX_SELECTION}
          </span>

          {selectedPlanIds.length > 0 && (
            <button
              onClick={() => onSetSelection([])}
              className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer underline ml-0.5"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Target Audience Segment Bar: ข้าราชการ (สีทอง) / ออฟฟิศ (สีเขียว) / วัยเก๋า (สีชมพู) / เหมาจ่าย (สีน้ำเงิน) / บุคคลทั่วไป (สีน้ำเงิน) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 text-xs border-b border-slate-100/90 scrollbar-none flex-wrap">
        <span className="font-semibold text-slate-700 shrink-0 text-[11px] flex items-center gap-1">
          <span>กลุ่มเป้าหมาย:</span>
        </span>
        <button
          type="button"
          onClick={() => setSelectedAudienceFilter('all')}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
            selectedAudienceFilter === 'all'
              ? 'bg-slate-800 text-white font-bold shadow-2xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          แสดงทุกกลุ่ม (5 กลุ่ม)
        </button>

        {/* กลุ่มข้าราชการ - สีทอง */}
        <button
          type="button"
          onClick={() => setSelectedAudienceFilter('government')}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1 border ${
            selectedAudienceFilter === 'government'
              ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white font-bold shadow-xs border-amber-500 ring-1 ring-amber-400'
              : 'bg-amber-50/90 text-amber-900 hover:bg-amber-100 border-amber-300'
          }`}
        >
          <Landmark className="w-3 h-3 text-amber-700" />
          <span>🏛️ ข้าราชการ</span>
        </button>

        {/* ออฟฟิศ - สีเขียว */}
        <button
          type="button"
          onClick={() => setSelectedAudienceFilter('office')}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1 border ${
            selectedAudienceFilter === 'office'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-xs border-emerald-600 ring-1 ring-emerald-500'
              : 'bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
          }`}
        >
          <Building className="w-3 h-3 text-emerald-700" />
          <span>🏢 ออฟฟิศ</span>
        </button>

        {/* วัยเก๋า - สีชมพู */}
        <button
          type="button"
          onClick={() => setSelectedAudienceFilter('senior')}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1 border ${
            selectedAudienceFilter === 'senior'
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold shadow-xs border-pink-500 ring-1 ring-pink-400'
              : 'bg-pink-50/90 text-pink-800 hover:bg-pink-100 border-pink-300'
          }`}
        >
          <Heart className="w-3 h-3 text-pink-700" />
          <span>🧓 วัยเก๋า</span>
        </button>

        {/* เหมาจ่าย - สีน้ำเงิน */}
        <button
          type="button"
          onClick={() => setSelectedAudienceFilter('lumpsum')}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1 border ${
            selectedAudienceFilter === 'lumpsum'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-xs border-blue-600 ring-1 ring-blue-500'
              : 'bg-blue-50/90 text-blue-800 hover:bg-blue-100 border-blue-300'
          }`}
        >
          <Shield className="w-3 h-3 text-blue-700" />
          <span>🏥 เหมาจ่าย</span>
        </button>

        {/* บุคคลทั่วไป - สีน้ำเงิน */}
        <button
          type="button"
          onClick={() => setSelectedAudienceFilter('general')}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1 border ${
            selectedAudienceFilter === 'general'
              ? 'bg-gradient-to-r from-blue-600 to-sky-700 text-white font-bold shadow-xs border-blue-600 ring-1 ring-blue-500'
              : 'bg-blue-50/90 text-blue-800 hover:bg-blue-100 border-blue-300'
          }`}
        >
          <Users className="w-3 h-3 text-blue-700" />
          <span>👤 บุคคลทั่วไป</span>
        </button>
      </div>

      {/* Plan Selection Grid - Minimal, Crisp & Balanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
        {filteredPlans.map((plan) => {
          const isSelected = selectedPlanIds.includes(plan.id);
          const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
          const isPa = plan.category === 'pa';
          const primaryAudience = getPlanPrimaryAudience(plan.id);

          // Check age eligibility if age filter is specified
          const isAgeIneligible =
            currentAge !== null && (currentAge < plan.minAge || currentAge > plan.maxAge);
          const isDisabled = (!isSelected && isMaxSelected) || isAgeIneligible;

          return (
            <div
              key={plan.id}
              onClick={() => {
                if (!isDisabled) {
                  onTogglePlan(plan.id);
                }
              }}
              className={`relative rounded-xl p-3 transition-all duration-150 text-left flex flex-col justify-between border select-none ${
                isAgeIneligible
                  ? 'border-slate-200 bg-slate-50/60 opacity-40 cursor-not-allowed'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50/20 shadow-xs ring-1 ring-blue-600 cursor-pointer'
                  : isDisabled
                  ? 'border-slate-200 bg-slate-50/40 opacity-50 cursor-not-allowed'
                  : 'border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Header: Name + Status Badge + Checkbox */}
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">
                        {plan.name}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Heart className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                          สนใจแล้ว
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isExistingCustomerPlan ? '⭐ แผนเดิมที่ถือครอง' : isPa ? 'อุบัติเหตุ PA' : 'สุขภาพ'}
                    </span>
                  </div>

                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-[10px] transition-colors mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isAgeIneligible
                        ? 'border border-slate-200 bg-slate-100 text-slate-300'
                        : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    {isAgeIneligible ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </span>
                </div>

                {/* กลุ่มเป้าหมาย: แสดงแผนละ 1 ประเภท พร้อมสีตามที่กำหนด (ข้าราชการ: สีทอง, ออฟฟิศ: สีเขียว, วัยเก๋า: สีชมพู, เหมาจ่าย: สีน้ำเงิน, บุคคลทั่วไป: สีน้ำเงิน) */}
                <div className="my-1.5 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold border ${primaryAudience.badgeColor}`}
                  >
                    {primaryAudience.audienceGroup === 'government' ? (
                      <Landmark className="w-3 h-3 text-amber-700 shrink-0" />
                    ) : primaryAudience.audienceGroup === 'office' ? (
                      <Building className="w-3 h-3 text-emerald-700 shrink-0" />
                    ) : primaryAudience.audienceGroup === 'senior' ? (
                      <Heart className="w-3 h-3 text-pink-700 shrink-0" />
                    ) : primaryAudience.audienceGroup === 'lumpsum' ? (
                      <Shield className="w-3 h-3 text-blue-700 shrink-0" />
                    ) : (
                      <Users className="w-3 h-3 text-blue-700 shrink-0" />
                    )}
                    <span>{primaryAudience.label}</span>
                  </span>
                </div>

                {/* OPD Coverage Indicator - Minimal Chip */}
                <div className="my-1.5">
                  {plan.category === 'health' ? (
                    plan.opd.illness.covered ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-50 text-emerald-700">
                        <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>มี OPD {plan.opd.illness.perVisit ? `฿${formatCurrency(plan.opd.illness.perVisit)}/ครั้ง` : ''}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-normal bg-slate-100 text-slate-500">
                        <X className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>ไม่มี OPD</span>
                      </div>
                    )
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-sky-50 text-sky-800">
                      <Check className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                      <span>OPD อุบัติเหตุ ฿{formatCurrency(plan.opd.accident)}</span>
                    </div>
                  )}
                </div>

                {/* Age Range */}
                <div className="text-[11px] text-slate-400 mt-1">
                  <span>อายุ </span>
                  <span
                    className={
                      isAgeIneligible
                        ? 'text-rose-600 font-bold'
                        : 'text-slate-600 font-medium'
                    }
                  >
                    {plan.ageRangeText}
                  </span>
                  {isAgeIneligible && (
                    <span className="text-[10px] text-rose-600 ml-1">(ไม่ตรงเกณฑ์)</span>
                  )}
                </div>
              </div>

              {/* Price & Action Buttons Footer (หน้าการ์ด) */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between gap-1">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      ฿{formatCurrency(plan.monthlyPremium)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-0.5">/เดือน</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    ฿{formatCurrency(plan.annualPremium)}/ปี
                  </div>
                </div>

                {/* Action Buttons on Card Face: ปุ่มเปรียบเทียบแผน + ปุ่มสนใจแผนนี้ (ลิงก์ไปยัง https://prmorder.uatsiamsmile.com/) */}
                <div className="space-y-1.5 pt-0.5">
                  {/* ปุ่ม "เปรียบเทียบแผน" (เปลี่ยนชื่อจาก "ซื้อประกัน" ตามคำขอของผู้ใช้) */}
                  <button
                    type="button"
                    disabled={isAgeIneligible}
                    onClick={(e) => handleInterestedClick(plan, e)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98] ${
                      isAgeIneligible
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                        : isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-blue-600/20'
                        : 'bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-600 hover:border-blue-700'
                    }`}
                    title={isSelected ? 'คลิกเพื่อยกเลิกการเปรียบเทียบแผนนี้' : `คลิกเพื่อเลือกแผน ${plan.name} เปรียบเทียบในตาราง`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>เปรียบเทียบแผนแล้ว ({selectedPlanIds.length}/3)</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>เปรียบเทียบแผน</span>
                      </>
                    )}
                  </button>

                  {/* แถวล่าง: ปุ่ม "สนใจแผนนี้" (ลิงก์ไปยัง https://prmorder.uatsiamsmile.com/) + ปุ่มส่งต่อลูกค้า */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href="https://prmorder.uatsiamsmile.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
                        isAgeIneligible
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 pointer-events-none'
                          : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-600/20 hover:shadow-md'
                      }`}
                      title={`สนใจแผน ${plan.name} - สั่งซื้อออนไลน์ที่ https://prmorder.uatsiamsmile.com/`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>สนใจแผนนี้</span>
                    </a>

                    {/* ปุ่มส่งต่อลูกค้าแบบด่วน */}
                    <button
                      type="button"
                      disabled={isAgeIneligible}
                      onClick={(e) => handleForwardPlanClick(plan, e)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer shrink-0"
                      title="ส่งต่อข้อเสนอแผนนี้ให้ลูกค้า (ทาง LINE / SMS)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Action Bar: เลือกก่อน ไม่เกิน 3 แล้วค่อยกดเปรียบเทียบ */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-slate-50 p-3 sm:p-4 rounded-xl border border-blue-100/90 shadow-2xs">
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              แผนที่เลือกเปรียบเทียบ:
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedPlanIds.length > 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {selectedPlanIds.length} / {MAX_SELECTION} แผน
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedPlanIds.map((id) => {
              const p = allPlans.find((x) => x.id === id);
              return p ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-blue-200 text-blue-900 text-xs font-bold rounded-lg shadow-2xs"
                >
                  <span>{p.code}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlan(id);
                    }}
                    className="hover:text-rose-600 text-slate-400 cursor-pointer ml-0.5 font-bold"
                    title="ลบแผนนี้"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}

            {selectedPlanIds.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                (กรุณาเลือก 1 - 3 แผนด้านบน แล้วกดปุ่มเปรียบเทียบ)
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={selectedPlanIds.length === 0}
          onClick={onGoToComparison}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            selectedPlanIds.length > 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
          title={selectedPlanIds.length > 0 ? 'เปิดหน้าเปรียบเทียบรายละเอียดแผน' : 'กรุณาเลือกแผนอย่างน้อย 1 แผน'}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span>กดเปรียบเทียบแผน ({selectedPlanIds.length} แผน)</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Interest Feedback Toast */}
      {interestedToastPlanName && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>บันทึกความสนใจ <strong>{interestedToastPlanName}</strong> เรียบร้อยแล้ว (เลือกอยู่ในตาราง)</span>
        </div>
      )}

      {/* Payment Modal for Purchasing Plan directly from Card Face */}
      {selectedPlanForAction && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlanForAction(null);
          }}
          proposal={getPlanProposalData(selectedPlanForAction)}
          customerName={existingCustomer?.fullName || 'คุณลูกค้าสยามสไมล์'}
          customerPhone={existingCustomer?.phone || '081-445-6789'}
          onPaymentSuccess={handlePaymentSuccess}
          onShowToast={onShowToast}
        />
      )}

      {/* Forward Customer Modal for sharing proposal directly from Card Face */}
      {selectedPlanForAction && (
        <ForwardCustomerModal
          isOpen={isForwardModalOpen}
          onClose={() => {
            setIsForwardModalOpen(false);
            setSelectedPlanForAction(null);
          }}
          proposal={getPlanProposalData(selectedPlanForAction)}
          existingCustomer={existingCustomer}
          onAssignToCustomer={onAssignPlanToCustomer}
          onProceedToPayment={(custName, custPhone) => {
            setIsForwardModalOpen(false);
            setIsPaymentModalOpen(true);
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
