import React, { useState, useMemo } from 'react';
import { InsurancePlan, ExportMeta, CustomerProfile } from '../types';
import { formatCurrency, getPlanTargetAudience } from '../data/plans';
import { exportToPdf, triggerPrint } from '../utils/pdfExport';
import { PolicyTermsNotice } from './PolicyTermsNotice';
import {
  X,
  Printer,
  FileDown,
  Eye,
  BookmarkPlus,
  Edit3,
  Check,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  Building2,
  Calendar,
  ShieldCheck,
  AlertCircle,
  FileText,
  Phone,
  Sparkles,
  Car,
  Home,
  Building,
  Landmark,
  Users,
} from 'lucide-react';

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlans: InsurancePlan[];
  allPlans: InsurancePlan[];
  exportMeta: ExportMeta;
  existingCustomer?: CustomerProfile | null;
  userAge?: number | null;
  onOpenExportSettings?: () => void;
  onSaveToHistory?: () => void;
}

export const PlanPreviewModal: React.FC<PlanPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedPlans,
  allPlans,
  exportMeta,
  existingCustomer,
  userAge,
  onOpenExportSettings,
  onSaveToHistory,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [historySuccess, setHistorySuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If existing customer plan is available
  const existingCustomerPlan = useMemo(() => {
    if (!existingCustomer) return null;
    return allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null;
  }, [existingCustomer, allPlans]);

  const isExistingPlanSelected = useMemo(() => {
    if (!existingCustomerPlan) return false;
    return selectedPlans.some((p) => p.id === existingCustomerPlan.id);
  }, [existingCustomerPlan, selectedPlans]);

  // Combined plans calculation
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

  const combinedTotals = useMemo(() => {
    if (plansForCombined.length <= 1) return null;

    const monthlyPremium = plansForCombined.reduce((sum, p) => sum + p.monthlyPremium, 0);
    const annualPremium = plansForCombined.reduce((sum, p) => sum + p.annualPremium, 0);

    const roomNormalPerNight = plansForCombined.reduce((sum, p) => sum + p.roomNormal.perNight, 0);
    const roomNormalMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomNormal.maxLimit, 0);

    const roomICUPerNight = plansForCombined.reduce((sum, p) => sum + p.roomICU.perNight, 0);
    const roomICUMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomICU.maxLimit, 0);

    const medicalGeneral = plansForCombined.reduce((sum, p) => sum + p.medicalGeneralPerVisit, 0);
    const surgery = plansForCombined.reduce((sum, p) => sum + p.surgeryPerDisorder, 0);
    const doctorVisit = plansForCombined.reduce((sum, p) => sum + p.doctorVisitPerNight.perNight, 0);

    const opdAccident = plansForCombined.reduce((sum, p) => sum + p.opd.accident, 0);
    const opdCoveredPlans = plansForCombined.filter((p) => p.opd.illness.covered);
    const hasOpdIllness = opdCoveredPlans.length > 0;
    const opdIllnessPerVisit = opdCoveredPlans.reduce((sum, p) => sum + (p.opd.illness.perVisit || 0), 0);

    const dailyComp = plansForCombined.reduce((sum, p) => sum + p.dailyCompensation.perNight, 0);
    const lifeAccident = plansForCombined.reduce((sum, p) => sum + p.life.accidentGeneral, 0);

    const existingMonthly = existingCustomerPlan ? existingCustomerPlan.monthlyPremium : 0;
    const addedMonthly = Math.max(0, monthlyPremium - existingMonthly);

    return {
      monthlyPremium,
      annualPremium,
      roomNormalPerNight,
      roomNormalMaxLimit,
      roomICUPerNight,
      roomICUMaxLimit,
      medicalGeneral,
      surgery,
      doctorVisit,
      opdAccident,
      hasOpdIllness,
      opdIllnessPerVisit,
      dailyComp,
      lifeAccident,
      addedMonthly,
    };
  }, [plansForCombined, existingCustomerPlan]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 130));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleZoomReset = () => setZoomLevel(100);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setErrorMsg(null);
    setExportSuccess(false);

    if (onSaveToHistory) {
      onSaveToHistory();
    }

    try {
      const planCodes = selectedPlans.map((p) => p.code).join('-');
      const clientName = exportMeta.customerName.trim()
        ? `_${exportMeta.customerName.trim().replace(/\s+/g, '_')}`
        : '';
      const fileName = `พรีวิวแผนประกันภัย${clientName}_${planCodes}_${new Date().toISOString().slice(0, 10)}.pdf`;

      const success = await exportToPdf('plan-preview-document-element', fileName);
      if (success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      } else {
        setErrorMsg('ไม่สามารถสร้างไฟล์ PDF จากพรีวิวได้ แนะนำให้กดปุ่ม "พิมพ์" ทางบราวเซอร์แทน');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการประมวลผล PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintDocument = () => {
    if (onSaveToHistory) {
      onSaveToHistory();
    }
    // Small timeout to allow UI state to settle
    setTimeout(() => {
      triggerPrint();
    }, 150);
  };

  const handleSaveHistoryClick = () => {
    if (onSaveToHistory) {
      onSaveToHistory();
      setHistorySuccess(true);
      setTimeout(() => setHistorySuccess(false), 3000);
    }
  };

  const customerDisplayName =
    exportMeta.customerName.trim() ||
    (existingCustomer ? existingCustomer.fullName : 'ลูกค้าทั่วไป (ไม่ระบุชื่อ)');

  const agentDisplayName =
    `${exportMeta.agentFirstName} ${exportMeta.agentLastName}`.trim() || 'ตัวแทนสยามสไมล์';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <header className="no-print bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
        {/* Left: Title & Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                พรีวิวแผนและเอกสารข้อเสนอ (Smart Brochure Preview)
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {selectedPlans.length} แผน
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ตรวจสอบความถูกต้องและรายละเอียดความคุ้มครองก่อนสั่งพิมพ์หรือส่งออก PDF
            </p>
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="ลดขนาดแสดงผล"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-slate-300 min-w-[42px] text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="เพิ่มขนาดแสดงผล"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomReset}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer ml-0.5"
            title="รีเซ็ตขนาด 100%"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenExportSettings && (
            <button
              type="button"
              onClick={onOpenExportSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="แก้ไขข้อมูลลูกค้า ผู้แทน หรือหมายเหตุ"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">แก้ไขข้อมูล</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveHistoryClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-950/40 text-sky-200 hover:bg-sky-900/60 text-xs font-medium transition-colors cursor-pointer"
            title="บันทึกข้อมูล Smart Brochure ลงใน Firebase Firestore"
          >
            {historySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">บันทึกใน Firebase แล้ว</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">บันทึก Smart Brochure</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrintDocument}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-400/40 bg-blue-900/60 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="สั่งพิมพ์เอกสารพรีวิวทางเครื่องพิมพ์หรือเซฟเป็น PDF ทางบราวเซอร์"
          >
            <Printer className="w-3.5 h-3.5 text-blue-200" />
            <span>พิมพ์</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="ดาวน์โหลดไฟล์ PDF โดยตรง"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังสร้าง PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>ส่งออก PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            title="ปิดหน้าต่างพรีวิว"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notifications banner if any */}
      {errorMsg && (
        <div className="no-print bg-rose-600 text-white px-4 py-2 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="underline cursor-pointer">
            ปิด
          </button>
        </div>
      )}

      {exportSuccess && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-center gap-2 shrink-0">
          <Check className="w-4 h-4" />
          <span>ดาวน์โหลดเอกสาร PDF จากพรีวิวเรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* Document Viewport (Scrollable with zoom scaling) */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center bg-slate-800/60">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-full max-w-4xl"
        >
          {/* Printable Document Sheet Container */}
          <div
            id="plan-preview-document-element"
            className="bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
          >
            {/* Header: Siam Smile Official Branding */}
            <div className="border-b-2 border-[#00509d] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#00509d] text-white font-extrabold text-xs tracking-wider uppercase">
                    SMILE HEALTH
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    บริษัท สยามสไมล์โบรกเกอร์ (ประเทศไทย) จำกัด
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#003e7a] tracking-tight mt-1.5">
                  ข้อเสนอและเปรียบเทียบผลประโยชน์ความคุ้มครอง
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Smart Brochure - เอกสารประกอบการพิจารณาเลือกแผนประกันภัยสุขภาพและอุบัติเหตุ
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                <div className="flex sm:justify-end items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>วันที่จัดทำ: <strong className="text-slate-800">{exportMeta.date}</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  รหัสสำนักงาน/ตัวแทน: <strong className="font-mono text-slate-700">{exportMeta.agentOfficeCode || '-'}</strong>
                </div>
              </div>
            </div>

            {/* Info Cards: Customer & Agent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Customer Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-[#00509d] mb-2 pb-1.5 border-b border-slate-200">
                  <User className="w-4 h-4" />
                  <span>ข้อมูลผู้เอาประกันภัย (ลูกค้า)</span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ชื่อ-นามสกุล:</span>
                    <strong className="text-slate-900">{customerDisplayName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">อายุผู้เอาประกัน:</span>
                    <span className="font-medium text-slate-800">
                      {userAge ? `${userAge} ปี` : existingCustomer ? `${existingCustomer.age} ปี` : 'ตามช่วงอายุที่กำหนด'}
                    </span>
                  </div>
                  {existingCustomer && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">สถานะลูกค้า:</span>
                        <span className="font-semibold text-blue-700">ลูกค้าเดิมในระบบ (ถือครอง {existingCustomer.policies?.length || 1} กรมธรรม์)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">แผนสุขภาพเดิม:</span>
                        <span className="font-semibold text-slate-800">
                          {existingCustomerPlan?.name || existingCustomer.existingPlanId} ({existingCustomer.policyNumber})
                        </span>
                      </div>
                      {/* Motor and Other Policies held by customer */}
                      {existingCustomer.policies && existingCustomer.policies.length > 1 && (
                        <div className="pt-1.5 mt-1 border-t border-slate-200/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                            กรมธรรม์อื่นๆ ที่ถือครองร่วมกัน:
                          </span>
                          {existingCustomer.policies
                            .filter((p) => p.planId !== existingCustomer.existingPlanId)
                            .map((p, pIdx) => {
                              const isMotor = p.policyType === 'motor' || p.vehicleDetails;
                              const isFire = p.policyType === 'fire';
                              return (
                                <div
                                  key={pIdx}
                                  className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between gap-1 text-[10.5px]"
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    {isMotor ? (
                                      <Car className="w-3 h-3 text-blue-600 shrink-0" />
                                    ) : isFire ? (
                                      <Home className="w-3 h-3 text-amber-600 shrink-0" />
                                    ) : (
                                      <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
                                    )}
                                    <span className="font-medium text-slate-800 truncate">
                                      {p.customPlanName || p.policyNumber}
                                      {p.vehicleDetails?.licensePlate && ` (${p.vehicleDetails.licensePlate})`}
                                    </span>
                                  </div>
                                  <div className="text-right shrink-0 text-slate-600">
                                    {p.sumInsured ? (
                                      <span className="text-[10px] text-blue-800 font-semibold">
                                        ทุน ฿{formatCurrency(p.sumInsured)}
                                      </span>
                                    ) : p.annualPremium ? (
                                      <span className="text-[10px] text-slate-700">
                                        ฿{formatCurrency(p.annualPremium)}/ปี
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Agent & Coordinator Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-[#00509d] mb-2 pb-1.5 border-b border-slate-200">
                  <Building2 className="w-4 h-4" />
                  <span>ข้อมูลผู้แทนและผู้ประสานงานโครงการ</span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ผู้แทนที่ปรึกษา:</span>
                    <strong className="text-slate-900">{agentDisplayName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">เบอร์ติดต่อผู้แทน:</span>
                    <span className="font-mono text-slate-800">{exportMeta.agentPhone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ผู้ประสานงานโครงการ:</span>
                    <span className="font-medium text-slate-900">{exportMeta.coordinatorName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">เบอร์ติดต่อผู้ประสานงาน:</span>
                    <span className="font-mono text-slate-800">{exportMeta.coordinatorPhone || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes / Special Remarks */}
            {exportMeta.notes && (
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-blue-900">สรุปคำแนะนำ / ข้อความเพิ่มเติม: </strong>
                  <span>{exportMeta.notes}</span>
                </div>
              </div>
            )}

            {/* Comparison Matrix Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gradient-to-r from-sky-900 via-sky-800 to-blue-900 text-white">
                    <th className="p-3 w-[34%] font-bold text-sm border-r border-sky-700">
                      รายการความคุ้มครองและผลประโยชน์
                    </th>
                    {selectedPlans.map((plan) => {
                      const isExisting = existingCustomer?.existingPlanId === plan.id;
                      return (
                        <th
                          key={plan.id}
                          className="p-3 text-center border-r border-sky-700 align-top"
                        >
                          <div className="flex flex-col items-center">
                            {isExisting && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white mb-1 shadow-2xs">
                                แผนเดิม
                              </span>
                            )}
                            <span className="text-sm font-black">{plan.code}</span>
                            <span className="text-[11px] font-normal text-sky-200 mt-0.5">
                              {plan.name}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                    {combinedTotals && (
                      <th className="p-3 text-center bg-[#094f92] text-white align-top border-l-2 border-sky-400">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 mb-1 shadow-2xs">
                            Top-up รวม
                          </span>
                          <span className="text-sm font-black">รวมผลประโยชน์</span>
                          <span className="text-[11px] font-normal text-sky-200 mt-0.5">
                            {plansForCombined.length} แผน
                          </span>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {/* Category: Target Audience Suitability */}
                  <tr className="bg-slate-100/90 font-bold text-slate-900">
                    <td
                      colSpan={selectedPlans.length + (combinedTotals ? 2 : 1)}
                      className="py-1.5 px-3 text-[11px] uppercase tracking-wider text-[#00509d]"
                    >
                      ความเหมาะสมตามกลุ่มเป้าหมาย (เอกชน / ราชการรัฐวิสาหกิจ / ลูกค้าทั่วไป)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-xs text-blue-900 bg-blue-50/30">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>สำหรับพนักงานเอกชน (Top-up ปกส.)</span>
                      </div>
                    </td>
                    {selectedPlans.map((p) => {
                      const aud = getPlanTargetAudience(p.id, p.targetAudience);
                      return (
                        <td key={p.id} className="py-2 px-3 border-r border-slate-200 text-xs text-left">
                          <div className="p-1.5 rounded bg-blue-50/60 border border-blue-100 text-[11px] text-blue-950 leading-snug">
                            {aud.privateSector}
                          </div>
                        </td>
                      );
                    })}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 text-xs text-blue-900 font-medium">
                        เสริมสวัสดิการ ปกส. ครบวงจร
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-xs text-indigo-900 bg-indigo-50/30">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>สำหรับข้าราชการ / รัฐวิสาหกิจ</span>
                      </div>
                    </td>
                    {selectedPlans.map((p) => {
                      const aud = getPlanTargetAudience(p.id, p.targetAudience);
                      return (
                        <td key={p.id} className="py-2 px-3 border-r border-slate-200 text-xs text-left">
                          <div className="p-1.5 rounded bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-950 leading-snug">
                            {aud.government}
                          </div>
                        </td>
                      );
                    })}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 text-xs text-indigo-900 font-medium">
                        เสริมสิทธิเบิกตรง & ชดเชยรายวัน
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-xs text-emerald-900 bg-emerald-50/30">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>สำหรับลูกค้าทั่วไป (อาชีพอิสระ)</span>
                      </div>
                    </td>
                    {selectedPlans.map((p) => {
                      const aud = getPlanTargetAudience(p.id, p.targetAudience);
                      return (
                        <td key={p.id} className="py-2 px-3 border-r border-slate-200 text-xs text-left">
                          <div className="p-1.5 rounded bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-950 leading-snug">
                            {aud.generalPublic}
                          </div>
                        </td>
                      );
                    })}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 text-xs text-emerald-900 font-medium">
                        คุ้มครองครบ แบ่งชำระรายเดือนสบาย
                      </td>
                    )}
                  </tr>

                  {/* Category: Room */}
                  <tr className="bg-slate-100/80 font-bold text-slate-900">
                    <td
                      colSpan={selectedPlans.length + (combinedTotals ? 2 : 1)}
                      className="py-1.5 px-3 text-[11px] uppercase tracking-wider text-[#00509d]"
                    >
                      1. ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      ค่าห้องและค่าอาหาร (ปกติ) / วัน
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.roomNormal.perNight)}</strong>
                        <div className="text-[10px] text-slate-500">
                          สูงสุด ฿{formatCurrency(p.roomNormal.maxLimit)}
                        </div>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.roomNormalPerNight)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      ค่าห้อง ICU / วัน (สูงสุด 15 วัน)
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.roomICU.perNight)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.roomICUPerNight)}
                      </td>
                    )}
                  </tr>

                  {/* Category: Medical & Surgery */}
                  <tr className="bg-slate-100/80 font-bold text-slate-900">
                    <td
                      colSpan={selectedPlans.length + (combinedTotals ? 2 : 1)}
                      className="py-1.5 px-3 text-[11px] uppercase tracking-wider text-[#00509d]"
                    >
                      2. ค่ารักษาพยาบาลและการผ่าตัด (IPD)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      ค่ารักษาพยาบาลทั่วไป / ครั้ง
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.medicalGeneralPerVisit)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.medicalGeneral)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      ค่าแพทย์ผ่าตัดและหัตถการ / ครั้ง
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.surgeryPerDisorder)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.surgery)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      ค่าแพทย์เยี่ยมไข้ประจำวัน / วัน
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.doctorVisitPerNight.perNight)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.doctorVisit)}
                      </td>
                    )}
                  </tr>

                  {/* Category: OPD */}
                  <tr className="bg-slate-100/80 font-bold text-slate-900">
                    <td
                      colSpan={selectedPlans.length + (combinedTotals ? 2 : 1)}
                      className="py-1.5 px-3 text-[11px] uppercase tracking-wider text-[#00509d]"
                    >
                      3. ค่ารักษาพยาบาลผู้ป่วยนอก (OPD)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      OPD กรณีเจ็บป่วยทั่วไป
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        {p.category === 'health' && p.opd.illness.covered ? (
                          <div className="text-emerald-700 font-bold">
                            ฿{formatCurrency(p.opd.illness.perVisit || 0)}/ครั้ง
                            <div className="text-[10px] text-slate-500 font-normal">
                              (สูงสุด {p.opd.illness.maxVisitsPerYear || 30} ครั้ง/ปี)
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">- ไม่คุ้มครอง -</span>
                        )}
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        {combinedTotals.hasOpdIllness
                          ? `฿${formatCurrency(combinedTotals.opdIllnessPerVisit)}/ครั้ง`
                          : '-'}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      OPD กรณีอุบัติเหตุฉุกเฉิน (ภายใน 24 ชม.)
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.opd.accident)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.opdAccident)}
                      </td>
                    )}
                  </tr>

                  {/* Category: Daily Comp & Life */}
                  <tr className="bg-slate-100/80 font-bold text-slate-900">
                    <td
                      colSpan={selectedPlans.length + (combinedTotals ? 2 : 1)}
                      className="py-1.5 px-3 text-[11px] uppercase tracking-wider text-[#00509d]"
                    >
                      4. ชดเชยรายวันและอุบัติเหตุ (PA)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      เงินชดเชยรายวันกรณีรักษาตัวใน รพ. / วัน
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.dailyCompensation.perNight)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.dailyComp)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">
                      ความคุ้มครองชีวิตและอุบัติเหตุทั่วไป (อบ.1)
                    </td>
                    {selectedPlans.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center border-r border-slate-200">
                        <strong>฿{formatCurrency(p.life.accidentGeneral)}</strong>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="py-2 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                        ฿{formatCurrency(combinedTotals.lifeAccident)}
                      </td>
                    )}
                  </tr>
                </tbody>

                {/* Table Footer: Premiums */}
                <tfoot>
                  <tr className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 text-white border-t-2 border-sky-400">
                    <td className="p-3.5 font-bold text-sm border-r border-sky-800">
                      <div>อัตราเบี้ยประกันภัย</div>
                      <div className="text-[10px] text-sky-300 font-normal">
                        รวมภาษีมูลค่าเพิ่มและอากรแสตมป์
                      </div>
                    </td>
                    {selectedPlans.map((plan) => (
                      <td
                        key={plan.id}
                        className="p-3 text-center border-r border-sky-800 align-middle"
                      >
                        <div className="text-base sm:text-lg font-black text-white">
                          ฿{formatCurrency(plan.monthlyPremium)}
                          <span className="text-[11px] font-normal text-sky-200 ml-1">/เดือน</span>
                        </div>
                        <div className="text-[10px] text-sky-300 font-semibold mt-0.5">
                          ฿{formatCurrency(plan.annualPremium)} /ปี
                        </div>
                      </td>
                    ))}
                    {combinedTotals && (
                      <td className="p-3 text-center bg-[#002f5c] text-white border-l-2 border-sky-300 align-middle">
                        <div className="text-base sm:text-lg font-black text-amber-300">
                          ฿{formatCurrency(combinedTotals.monthlyPremium)}
                          <span className="text-[11px] font-normal text-sky-200 ml-1">/เดือน</span>
                        </div>
                        <div className="text-[10px] text-sky-200 font-semibold mt-0.5">
                          ฿{formatCurrency(combinedTotals.annualPremium)} /ปี
                        </div>
                        {existingCustomer && combinedTotals.addedMonthly > 0 && (
                          <div className="text-[9.5px] font-bold text-sky-100 bg-sky-900/90 py-0.5 px-1.5 rounded mt-1 border border-sky-400/40">
                            จ่ายเพิ่มเพียง +฿{formatCurrency(combinedTotals.addedMonthly)}/เดือน
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Terms and Exceptions Component */}
            <div className="pt-2">
              <PolicyTermsNotice
                coordinatorName={exportMeta.coordinatorName}
                coordinatorPhone={exportMeta.coordinatorPhone}
              />
            </div>

            {/* Signatures & Consent */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-700">
              <div className="text-center space-y-3">
                <div className="border-b border-dotted border-slate-400 w-3/4 mx-auto pt-8" />
                <p className="font-semibold text-slate-800">
                  (ลงชื่อ) ............................................................................ ผู้เอาประกันภัย / ลูกค้า
                </p>
                <p className="text-[11px] text-slate-500">
                  วันที่ .......... / .......... / ....................
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="border-b border-dotted border-slate-400 w-3/4 mx-auto pt-8" />
                <p className="font-semibold text-slate-800">
                  (ลงชื่อ) ............................................................................ ตัวแทน / ที่ปรึกษาประกันภัย
                </p>
                <p className="text-[11px] text-slate-500">
                  {agentDisplayName} (รหัส: {exportMeta.agentOfficeCode || '-'})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
