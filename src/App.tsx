/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INSURANCE_PLANS } from './data/plans';
import { MOCK_EXISTING_CUSTOMERS } from './data/customers';
import { ViewFilterMode, ExportMeta, CustomerProfile, ComparisonHistoryItem, InsurancePlan, CustomerPolicyItem, PayerOrganizationType } from './types';
import { SmileSaleSidebar } from './components/SmileSaleSidebar';
import { SmileSaleHeader } from './components/SmileSaleHeader';
import { SmileSaleSearchCard } from './components/SmileSaleSearchCard';
import { PlanSelector } from './components/PlanSelector';
import { ComparisonTable } from './components/ComparisonTable';
import { ExportModal } from './components/ExportModal';
import { HistoryModal } from './components/HistoryModal';
import { PlanSettingsModal } from './components/PlanSettingsModal';
import { PlanPreviewModal } from './components/PlanPreviewModal';
import { PremiumCodeLookup } from './components/PremiumCodeLookup';
import { InsuranceTypeCode } from './data/premiumCodes';
import { triggerPrint } from './utils/pdfExport';
import {
  loadStoredPlans,
  saveStoredPlans,
  resetStoredPlans,
  loadCoordinatorSettings,
  saveCoordinatorSettings,
  CoordinatorInfo,
} from './utils/planStorage';
import {
  getComparisonHistory,
  saveComparisonHistoryItem,
  toggleMarkComparison,
  deleteComparisonHistoryItem,
  getSavedAgentProfile,
} from './utils/historyStorage';
import {
  testConnection,
  subscribeToSmartBrochures,
  seedCustomersToFirestore,
} from './lib/firebase';
import {
  CheckCircle2,
  BookmarkPlus,
  RotateCcw,
  Eye,
  ArrowLeft,
  SlidersHorizontal,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // Sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string>('smart-brochure');

  // Customer & Age State
  const [userAge, setUserAge] = useState<number | null>(null);
  const [userDob, setUserDob] = useState<string>('1995-05-15');
  const [payerType, setPayerType] = useState<PayerOrganizationType>('private');
  const [existingCustomer, setExistingCustomer] = useState<CustomerProfile | null>(null);

  // Plans & Settings state
  const [plans, setPlans] = useState<InsurancePlan[]>(() => loadStoredPlans());
  const [coordinatorInfo, setCoordinatorInfo] = useState<CoordinatorInfo>(() =>
    loadCoordinatorSettings()
  );
  const [isPlanSettingsOpen, setIsPlanSettingsOpen] = useState<boolean>(false);

  // Selected plans for comparison (max 3 plans, empty by default, user selects freely)
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'selection' | 'comparison' | 'premium-code'>('selection');
  const [premiumCodeType, setPremiumCodeType] = useState<InsuranceTypeCode>('life');

  const [filterMode, setFilterMode] = useState<ViewFilterMode>('all');
  const [highlightDiffs, setHighlightDiffs] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPlanPreviewOpen, setIsPlanPreviewOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<ComparisonHistoryItem[]>(() => getComparisonHistory());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and subscribe to Firebase Firestore (Smart Brochure collection)
  useEffect(() => {
    // Validate connection to Firebase Firestore on boot
    testConnection();

    // Seed initial mock customer data to Firestore
    seedCustomersToFirestore();

    // Listen to real-time updates from Firebase Firestore (Smart Brochure collection)
    const unsubscribe = subscribeToSmartBrochures((items) => {
      if (items && items.length > 0) {
        setHistoryList(items);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const initialAgent = getSavedAgentProfile();

  const [exportMeta, setExportMeta] = useState<ExportMeta>({
    customerName: '',
    agentFirstName: initialAgent.agentFirstName || 'บรรจง',
    agentLastName: initialAgent.agentLastName || '',
    agentOfficeCode: initialAgent.agentOfficeCode || '05741',
    agentPhone: initialAgent.agentPhone,
    coordinatorName: coordinatorInfo.name,
    coordinatorPhone: coordinatorInfo.phone,
    date: new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    notes: 'ตารางเปรียบเทียบผลประโยชน์และความคุ้มครองแผนประกันสุขภาพและอุบัติเหตุ Smile Health',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Plan Settings Handlers
  const handleSavePlans = (updatedPlans: InsurancePlan[]) => {
    setPlans(updatedPlans);
    saveStoredPlans(updatedPlans);
    showToast('บันทึกการตั้งค่าแผนประกันเรียบร้อยแล้ว');
  };

  const handleResetPlans = () => {
    const defaultPlans = resetStoredPlans();
    setPlans(defaultPlans);
    showToast('คืนค่าแผนประกันเริ่มต้นเรียบร้อยแล้ว');
  };

  const handleSaveCoordinator = (info: CoordinatorInfo) => {
    setCoordinatorInfo(info);
    saveCoordinatorSettings(info);
    setExportMeta((prev) => ({
      ...prev,
      coordinatorName: info.name,
      coordinatorPhone: info.phone,
    }));
    showToast('บันทึกข้อมูลผู้ประสานงานโครงการเรียบร้อยแล้ว');
  };

  // Handle confirming age from Search Card
  const handleConfirmAge = (
    age: number | null,
    birthDateStr: string,
    customer?: CustomerProfile | null,
    selectedPayerType?: PayerOrganizationType
  ) => {
    setUserAge(age);
    setUserDob(birthDateStr);
    if (selectedPayerType) {
      setPayerType(selectedPayerType);
    }

    const payerLabels: Record<PayerOrganizationType, string> = {
      private: 'หน่วยงานเอกชน',
      government: 'ข้าราชการและรัฐวิสาหกิจ',
      general: 'ทั่วไป',
    };
    const activePayerLabel = selectedPayerType ? payerLabels[selectedPayerType] : payerLabels[payerType];

    if (customer) {
      setExistingCustomer(customer);
      setExportMeta((prev) => ({
        ...prev,
        customerName: customer.fullName,
        notes: `เปรียบเทียบแผนเพิ่มความคุ้มครองสำหรับลูกค้าเดิม (กรมธรรม์ ${customer.policyNumber}) แผนปัจจุบันคือ ${
          plans.find((p) => p.id === customer.existingPlanId)?.name || ''
        } [ประเภทผู้ชำระเบี้ย: ${activePayerLabel}]`,
      }));

      // Do not pre-select comparison plans automatically; let the user choose freely
      setSelectedPlanIds([]);
      showToast(`ดึงข้อมูลลูกค้าเดิม คุณ${customer.fullName} (${activePayerLabel}) เรียบร้อยแล้ว`);
    } else if (age !== null) {
      setExistingCustomer(null);
      setSelectedPlanIds([]);
      setExportMeta((prev) => ({
        ...prev,
        notes: `ตารางเปรียบเทียบผลประโยชน์และความคุ้มครอง (อายุ ${age} ปี, ${activePayerLabel})`,
      }));
      showToast(`กรองแผนที่รองรับสำหรับอายุ ${age} ปี (${activePayerLabel}) เรียบร้อยแล้ว`);
    } else {
      setExistingCustomer(null);
    }
  };

  const handleResetSearch = () => {
    setExistingCustomer(null);
    setUserAge(null);
    setUserDob('');
    setPayerType('private');
    setSelectedPlanIds([]);
    showToast('รีเซ็ตเงื่อนไขการค้นหาเรียบร้อยแล้ว');
  };

  // Assign or purchase a plan code for a customer
  const handleAssignPlanToCustomer = (customer: CustomerProfile, newPolicy: CustomerPolicyItem) => {
    const matched = MOCK_EXISTING_CUSTOMERS.find((c) => c.idCard === customer.idCard);
    if (matched) {
      if (!matched.policies) matched.policies = [];
      matched.policies = [newPolicy, ...matched.policies.filter((p) => p.policyNumber !== newPolicy.policyNumber)];
    }

    const updatedCustomer: CustomerProfile = {
      ...customer,
      policies: [newPolicy, ...(customer.policies || []).filter((p) => p.policyNumber !== newPolicy.policyNumber)],
    };

    setExistingCustomer(updatedCustomer);
    setExportMeta((prev) => ({
      ...prev,
      customerName: customer.fullName,
    }));
  };

  const handleTogglePlan = (planId: string) => {
    setSelectedPlanIds((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, planId];
    });
  };

  const handleSetSelection = (planIds: string[]) => {
    setSelectedPlanIds(planIds.slice(0, 3));
  };

  const selectedPlans = plans.filter((p) =>
    selectedPlanIds.includes(p.id)
  );

  const handleOpenPlanPreview = () => {
    if (selectedPlans.length === 0) {
      showToast('กรุณาเลือกแผนประกันภัยอย่างน้อย 1 แผนเพื่อพรีวิว');
      return;
    }
    setIsPlanPreviewOpen(true);
  };

  const handleGoToComparison = () => {
    if (selectedPlanIds.length === 0) {
      showToast('กรุณาเลือกแผนประกันภัย 1 - 3 แผนเพื่อเปรียบเทียบ');
      return;
    }
    setCurrentView('comparison');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwapPlan = (oldPlanId: string, newPlanId: string) => {
    setSelectedPlanIds((prev) =>
      prev.map((id) => (id === oldPlanId ? newPlanId : id))
    );
    const newPlan = plans.find((p) => p.id === newPlanId);
    if (newPlan) {
      showToast(`เปลี่ยนเป็น ${newPlan.name} เรียบร้อยแล้ว`);
    }
  };

  // History Actions: Store Smart Brochure in Firebase Firestore
  const handleSaveCurrentComparison = () => {
    if (selectedPlans.length === 0) {
      showToast('กรุณาเลือกแผนประกันภัยอย่างน้อย 1 แผนเพื่อบันทึก Smart Brochure');
      return;
    }
    const planNames = selectedPlans.map((p) => `${p.code} (${p.name})`);
    const custName = exportMeta.customerName.trim() || (existingCustomer ? existingCustomer.fullName : '');

    const { updatedList } = saveComparisonHistoryItem({
      customerName: custName,
      isMarked: false,
      selectedPlanIds,
      selectedPlanNames: planNames,
      agentFirstName: exportMeta.agentFirstName,
      agentLastName: exportMeta.agentLastName,
      agentOfficeCode: exportMeta.agentOfficeCode,
      agentPhone: exportMeta.agentPhone,
      userAge,
      payerType,
      existingCustomerIdCard: existingCustomer?.idCard || null,
      notes: exportMeta.notes,
    });

    setHistoryList(updatedList);
    showToast(
      custName
        ? `บันทึกข้อมูล ${custName} ลง Firebase (Smart Brochure) เรียบร้อยแล้ว ☁️`
        : 'บันทึกข้อมูลลง Firebase (Smart Brochure) เรียบร้อยแล้ว ☁️'
    );
  };

  const handleToggleMark = (id: string) => {
    const updated = toggleMarkComparison(id);
    setHistoryList(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteComparisonHistoryItem(id);
    setHistoryList(updated);
    showToast('ลบรายการประวัติเรียบร้อยแล้ว');
  };

  const handleRestoreComparison = (item: ComparisonHistoryItem) => {
    if (item.selectedPlanIds && item.selectedPlanIds.length > 0) {
      setSelectedPlanIds(item.selectedPlanIds);
      setCurrentView('comparison');
    }

    if (item.payerType) {
      setPayerType(item.payerType as PayerOrganizationType);
    }

    setExportMeta((prev) => ({
      ...prev,
      customerName: item.customerName || '',
      agentFirstName: item.agentFirstName || prev.agentFirstName,
      agentLastName: item.agentLastName || prev.agentLastName,
      agentOfficeCode: item.agentOfficeCode || prev.agentOfficeCode,
      agentPhone: item.agentPhone || prev.agentPhone,
      notes: item.notes || prev.notes,
    }));

    if (item.userAge) {
      setUserAge(item.userAge);
    }

    if (item.existingCustomerIdCard) {
      const matched = MOCK_EXISTING_CUSTOMERS.find((c: CustomerProfile) => c.idCard === item.existingCustomerIdCard);
      if (matched) {
        setExistingCustomer(matched);
      }
    }

    showToast(`เปิดชุด Smart Brochure ${item.customerName || 'ลูกค้าทั่วไป'} เรียบร้อยแล้ว`);
  };

  const markedHistoryCount = historyList.filter((h) => h.isMarked).length;

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar (SmileSale Navigation) */}
      <SmileSaleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeMenu={activeMenu}
        onSelectMenu={(menu) => {
          setActiveMenu(menu);
          if (menu === 'benefits-ph' || menu === 'plan-settings') {
            setIsPlanSettingsOpen(true);
          } else if (menu === 'smart-brochure') {
            setCurrentView('selection');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (menu === 'code-life') {
            setPremiumCodeType('life');
            setCurrentView('premium-code');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (menu === 'code-home') {
            setPremiumCodeType('home');
            setCurrentView('premium-code');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (menu === 'code-travel') {
            setPremiumCodeType('travel');
            setCurrentView('premium-code');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (menu === 'code-all' || menu === 'premium-code') {
            setCurrentView('premium-code');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Main Content Body (Adjusts margin based on sidebar state on desktop) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        {/* Top Header */}
        <SmileSaleHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenPreview={handleOpenPlanPreview}
          onOpenPlanSettings={() => setIsPlanSettingsOpen(true)}
          onPrint={() => triggerPrint()}
          historyCount={historyList.length}
          markedCount={markedHistoryCount}
          exportMeta={exportMeta}
          existingCustomer={existingCustomer}
          selectedPlansCount={selectedPlans.length}
          currentView={currentView}
          onSaveSmartBrochure={handleSaveCurrentComparison}
          onNavigateView={(view) => {
            setCurrentView(view);
            if (view === 'premium-code') {
              setActiveMenu('code-all');
            } else {
              setActiveMenu('smart-brochure');
            }
          }}
        />

        {/* Page Content Container */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-5 max-w-7xl w-full mx-auto space-y-4 sm:space-y-5">
          {currentView === 'premium-code' ? (
            <PremiumCodeLookup
              initialType={premiumCodeType}
              existingCustomer={existingCustomer}
              currentAge={userAge}
              onBackToBrochure={() => {
                setCurrentView('selection');
                setActiveMenu('smart-brochure');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
              onAssignPlanToCustomer={handleAssignPlanToCustomer}
            />
          ) : currentView === 'selection' ? (
            <>
              {/* Centered Hero Header exactly as in screenshot */}
              <section className="text-center pt-1 sm:pt-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  ทำประกัน<span className="text-[#0088cc]">สุขภาพ</span>กับสยามสไมล์
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium mt-1.5">
                  "Smile Health สุขภาพ อุบัติเหตุ โรคร้ายแรง ชำระรายเดือนได้"
                </p>
                <div className="border-b border-dotted border-[#9dc4e8] w-full max-w-3xl mx-auto my-3.5" />
              </section>

              {/* Search / Price Check Card (เช็คราคาประกันสุขภาพ) */}
              <section aria-label="เช็คราคาประกันสุขภาพ">
                <SmileSaleSearchCard
                  onConfirmAge={handleConfirmAge}
                  onReset={handleResetSearch}
                  allPlans={plans}
                  initialDob={userDob}
                  existingCustomer={existingCustomer}
                  currentAge={userAge}
                  initialPayerType={payerType}
                />
              </section>

              {/* Section: "แพ็กเกจและความคุ้มครอง" (เลือกแผนก่อน ไม่เกิน 3 แผน แล้วค่อยกดเปรียบเทียบ) */}
              <section className="pt-2">
                <div className="text-center mb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                    แพ็กเกจและความคุ้มครอง
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    เลือกแผนที่สนใจ (สูงสุดไม่เกิน 3 แผน) แล้วกดปุ่ม <strong>"กดเปรียบเทียบแผน"</strong> เพื่อดูรายละเอียด
                  </p>
                </div>

                {/* Plan Selector (15-I, 15-O, 610-I, 610-O, PA 60, PA 90, PA 120, PA 150) */}
                <div className="mb-4">
                  <PlanSelector
                    allPlans={plans}
                    selectedPlanIds={selectedPlanIds}
                    onTogglePlan={handleTogglePlan}
                    onSetSelection={handleSetSelection}
                    currentAge={userAge}
                    existingCustomer={existingCustomer}
                    onResetCustomer={handleResetSearch}
                    onOpenPlanSettings={() => setIsPlanSettingsOpen(true)}
                    onGoToComparison={handleGoToComparison}
                    onAssignPlanToCustomer={handleAssignPlanToCustomer}
                    onShowToast={showToast}
                  />
                </div>
              </section>
            </>
          ) : (
            /* Dedicated Comparison View (เปิดเป็นอีก UI เพื่อดูรายละเอียด สามารถเพิ่มลดแก้ไขแผนในหน้านี้ได้) */
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Header Navigation Bar for Comparison Page */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBackToSelection}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer border border-slate-200 shrink-0"
                      title="ย้อนกลับไปหน้าเลือกแผน"
                    >
                      <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span
                          onClick={handleBackToSelection}
                          className="hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          หน้าเลือกแผน
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-blue-700 font-bold">
                          รายละเอียดการเปรียบเทียบ ({selectedPlans.length}/3 แผน)
                        </span>
                      </div>
                      <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                        ตารางเปรียบเทียบผลประโยชน์ความคุ้มครอง
                      </h1>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={handleOpenPlanPreview}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      title="พรีวิวเอกสารข้อเสนอก่อนสั่งพิมพ์หรือส่งออก"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>พรีวิวแผนก่อนส่ง/พิมพ์</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCurrentComparison}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      title="บันทึกชุดเปรียบเทียบนี้ไว้ในประวัติระบบ"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>บันทึกชุดแผนนี้</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToSelection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">เลือกแผนเพิ่ม/แก้ไข</span>
                      <span className="sm:hidden">กลับ</span>
                    </button>
                  </div>
                </div>

                {/* Customer summary if available */}
                {existingCustomer && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                        ลูกค้าเดิม
                      </span>
                      <span className="font-semibold text-slate-800">
                        {existingCustomer.fullName}
                      </span>
                      <span className="text-slate-400">
                        (อายุ {existingCustomer.age} ปี / ถือครอง {existingCustomer.policies?.length || 1} กรมธรรม์)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Comprehensive Comparison Table (พร้อมแถบเพิ่ม/ลด/แก้ไขแผนในหน้านี้ได้ทันที) */}
              <ComparisonTable
                selectedPlans={selectedPlans}
                allPlans={plans}
                filterMode={filterMode}
                onFilterModeChange={setFilterMode}
                highlightDiffs={highlightDiffs}
                onToggleHighlightDiffs={() => setHighlightDiffs((prev) => !prev)}
                exportMeta={exportMeta}
                existingCustomer={existingCustomer}
                currentAge={userAge}
                onSelectExistingCustomer={(customer) =>
                  customer
                    ? handleConfirmAge(customer.age, customer.birthDate, customer)
                    : handleResetSearch()
                }
                onTogglePlan={handleTogglePlan}
                onOpenPreview={handleOpenPlanPreview}
                onBackToSelection={handleBackToSelection}
                onSwapPlan={handleSwapPlan}
                onAssignPlanToCustomer={handleAssignPlanToCustomer}
                onShowToast={showToast}
              />
            </section>
          )}
        </main>
      </div>

      {/* Plan Settings Modal (Coverage & Custom Naming for Health & PA) */}
      <PlanSettingsModal
        isOpen={isPlanSettingsOpen}
        onClose={() => setIsPlanSettingsOpen(false)}
        plans={plans}
        onSavePlans={handleSavePlans}
        onResetPlans={handleResetPlans}
        coordinatorInfo={coordinatorInfo}
        onSaveCoordinator={handleSaveCoordinator}
      />

      {/* Export / PDF Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedPlans={selectedPlans}
        exportMeta={exportMeta}
        onUpdateMeta={setExportMeta}
        onSaveToHistory={handleSaveCurrentComparison}
        onOpenPreview={handleOpenPlanPreview}
        existingCustomer={existingCustomer}
        userAge={userAge}
      />

      {/* Plan Preview Modal (พรีวิวแผนและเอกสารข้อเสนอก่อนกดส่งหรือกดพิมพ์) */}
      <PlanPreviewModal
        isOpen={isPlanPreviewOpen}
        onClose={() => setIsPlanPreviewOpen(false)}
        selectedPlans={selectedPlans}
        allPlans={plans}
        exportMeta={exportMeta}
        existingCustomer={existingCustomer}
        userAge={userAge}
        onOpenExportSettings={() => {
          setIsPlanPreviewOpen(false);
          setIsExportModalOpen(true);
        }}
        onSaveToHistory={handleSaveCurrentComparison}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyList={historyList}
        onToggleMark={handleToggleMark}
        onDelete={handleDeleteHistory}
        onRestore={handleRestoreComparison}
      />
    </div>
  );
}
