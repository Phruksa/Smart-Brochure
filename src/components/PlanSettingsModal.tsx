import React, { useState } from 'react';
import { InsurancePlan, PlanCategory } from '../types';
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Shield,
  ShieldAlert,
  HeartPulse,
  DollarSign,
  UserCheck,
  Phone,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { CoordinatorInfo } from '../utils/planStorage';

interface PlanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: InsurancePlan[];
  onSavePlans: (updatedPlans: InsurancePlan[]) => void;
  onResetPlans: () => void;
  coordinatorInfo: CoordinatorInfo;
  onSaveCoordinator: (info: CoordinatorInfo) => void;
}

export const PlanSettingsModal: React.FC<PlanSettingsModalProps> = ({
  isOpen,
  onClose,
  plans,
  onSavePlans,
  onResetPlans,
  coordinatorInfo,
  onSaveCoordinator,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'pa' | 'coordinator'>('health');
  const [editingPlans, setEditingPlans] = useState<InsurancePlan[]>(() =>
    JSON.parse(JSON.stringify(plans))
  );
  const [coordData, setCoordData] = useState<CoordinatorInfo>(() => ({ ...coordinatorInfo }));
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    const firstHealth = plans.find((p) => p.category !== 'pa');
    return firstHealth ? firstHealth.id : plans[0]?.id || '';
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync state whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setEditingPlans(JSON.parse(JSON.stringify(plans)));
      setCoordData({ ...coordinatorInfo });
      setSaveSuccess(false);
      setShowResetConfirm(false);
    }
  }, [isOpen, plans, coordinatorInfo]);

  if (!isOpen) return null;

  const currentPlan = editingPlans.find((p) => p.id === selectedPlanId) || editingPlans[0];

  const handleUpdateCurrentPlan = (updatedFields: Partial<InsurancePlan>) => {
    if (!currentPlan) return;
    setEditingPlans((prev) =>
      prev.map((p) => (p.id === currentPlan.id ? { ...p, ...updatedFields } : p))
    );
  };

  const handleSaveAll = () => {
    onSavePlans(editingPlans);
    onSaveCoordinator(coordData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleConfirmReset = () => {
    onResetPlans();
    setShowResetConfirm(false);
    onClose();
  };

  const handleAddNewPlan = (category: PlanCategory) => {
    const id = `plan-custom-${Date.now()}`;
    const isPa = category === 'pa';
    const newPlan: InsurancePlan = {
      id,
      code: isPa ? 'PA-CUSTOM' : 'CUSTOM-1',
      name: isPa ? 'แผนอุบัติเหตุปรับแต่ง' : 'แผนสุขภาพปรับแต่งพิเศษ',
      category,
      badge: 'กำหนดเอง',
      badgeColor: 'bg-emerald-600',
      description: isPa
        ? 'แผนประกันอุบัติเหตุคุ้มครองพิเศษตามต้องการ'
        : 'แผนประกันสุขภาพปรับแต่งตามความต้องการลูกค้า',
      monthlyPremium: isPa ? 350 : 1200,
      annualPremium: isPa ? 3800 : 13500,
      minAge: 15,
      maxAge: 60,
      ageRangeText: '15 - 60 ปี',
      roomNormal: { perNight: isPa ? 0 : 2500, maxLimit: isPa ? 0 : 112500 },
      roomICU: { perNight: isPa ? 0 : 5000, maxLimit: isPa ? 0 : 75000 },
      medicalGeneralPerVisit: isPa ? 0 : 30000,
      surgeryPerDisorder: isPa ? 0 : 60000,
      doctorVisitPerNight: { perNight: isPa ? 0 : 800, maxLimit: isPa ? 0 : 36000 },
      opd: {
        accident: isPa ? 80000 : 6000,
        illness: {
          covered: false,
          perVisit: 0,
          maxVisitsPerYear: 0,
        },
      },
      dailyCompensation: { perNight: isPa ? 0 : 500, maxLimit: isPa ? 0 : 90000 },
      otherRightsNormalRoom: { perNight: isPa ? 0 : 500, maxLimit: isPa ? 0 : 90000 },
      otherRightsICU: { perNight: isPa ? 0 : 1000, maxLimit: isPa ? 0 : 15000 },
      life: {
        accidentGeneral: isPa ? 800000 : 100000,
        murderAssault: isPa ? 400000 : 50000,
        motorcycle: isPa ? 400000 : 50000,
        funeralBenefit: isPa ? 0 : 10000,
      },
      paSchedule: isPa
        ? {
            permanentDisability: 800000,
            twoLimbsOrEyes: 800000,
            oneLimbOrEye: 480000,
            deafBothOrMute: 400000,
            thumbTwoJoints: 200000,
            deafOneEar: 120000,
            thumbOneJoint: 80000,
            indexFingerThreeJoints: 80000,
            indexFingerTwoJoints: 64000,
            indexFingerOneJoint: 32000,
            otherFingersTwoJoints: 40000,
            bigToe: 40000,
            otherFingersOneJoint: 8000,
            accidentMedicalTreatment: 80000,
          }
        : undefined,
    };

    setEditingPlans((prev) => [...prev, newPlan]);
    setSelectedPlanId(id);
    setActiveTab(category);
  };

  const handleDeletePlan = (planId: string) => {
    if (editingPlans.length <= 1) {
      alert('ต้องมีแผนประกันอย่างน้อย 1 แผนในระบบ');
      return;
    }
    const remaining = editingPlans.filter((p) => p.id !== planId);
    setEditingPlans(remaining);
    setSelectedPlanId(remaining[0].id);
  };

  const healthPlans = editingPlans.filter((p) => p.category !== 'pa');
  const paPlans = editingPlans.filter((p) => p.category === 'pa');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#00509d] via-[#094f92] to-[#003e7a] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-xl text-white">
              <Settings className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2">
                <span>จัดการสิทธิประโยชน์ PH & ตั้งค่าความคุ้มครองแผนประกัน</span>
              </h3>
              <p className="text-xs text-sky-200">
                ปรับแต่งชื่อแผน วงเงินความคุ้มครองได้ทุกหมวด เบี้ยประกัน และข้อมูลผู้ประสานงานโครงการ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100/90 px-4 sm:px-6 pt-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('health');
                const firstHealth = editingPlans.find((p) => p.category !== 'pa');
                if (firstHealth) setSelectedPlanId(firstHealth.id);
              }}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-colors cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-white text-[#00509d] border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>แผนประกันสุขภาพ ({healthPlans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('pa');
                const firstPa = editingPlans.find((p) => p.category === 'pa');
                if (firstPa) setSelectedPlanId(firstPa.id);
              }}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-colors cursor-pointer ${
                activeTab === 'pa'
                  ? 'bg-white text-[#00509d] border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>แผนประกันอุบัติเหตุ PA ({paPlans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coordinator')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-colors cursor-pointer ${
                activeTab === 'coordinator'
                  ? 'bg-white text-[#00509d] border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>ผู้ประสานงานโครงการ & เงื่อนไข</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={() => handleAddNewPlan(activeTab === 'pa' ? 'pa' : 'health')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มแผน{activeTab === 'pa' ? ' PA' : 'สุขภาพ'}ใหม่</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Plan Selector Sidebar (if in health or pa tab) */}
          {activeTab !== 'coordinator' && (
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto shrink-0 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                เลือกแผนที่ต้องการปรับแต่ง
              </div>
              <div className="space-y-1">
                {(activeTab === 'health' ? healthPlans : paPlans).map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      selectedPlanId === plan.id
                        ? 'bg-white border-[#00509d] shadow-xs ring-1 ring-[#00509d]'
                        : 'bg-white/70 border-slate-200 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{plan.code}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        ฿{plan.monthlyPremium.toLocaleString()}/เดือน
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                      {plan.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {activeTab === 'coordinator' ? (
              /* Coordinator & Terms Settings - เรียงเป็นข้อลงมา */
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#00509d]" />
                    ข้อมูลผู้ประสานงานโครงการ (แสดงในกรอบเงื่อนไขและเอกสารส่งออก)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    ข้อมูลนี้จะนำไปแสดงตรงช่อง &quot;ผู้ประสานงานโครงการ ชื่อ-นามสกุล ............ โทรศัพท์ ............&quot; ในเอกสารตารางเปรียบเทียบและไฟล์ PDF
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs">
                  {/* ข้อ 1 */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 px-2 py-0.5 rounded bg-sky-100 text-[#00509d] text-xs font-bold">
                        ข้อ 1
                      </span>
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          ชื่อ-นามสกุล ผู้ประสานงานโครงการ
                        </label>
                        <p className="text-[11px] text-slate-500">
                          ระบุชื่อและนามสกุลสำหรับแสดงบนหัวและท้ายตารางเปรียบเทียบ
                        </p>
                      </div>
                    </div>
                    <div className="sm:w-72 shrink-0">
                      <input
                        type="text"
                        value={coordData.name}
                        onChange={(e) => setCoordData({ ...coordData, name: e.target.value })}
                        placeholder="เช่น นายสมเกียรติ รักประกัน"
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
                      />
                    </div>
                  </div>

                  {/* ข้อ 2 */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 px-2 py-0.5 rounded bg-sky-100 text-[#00509d] text-xs font-bold">
                        ข้อ 2
                      </span>
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          เบอร์โทรศัพท์ ผู้ประสานงานโครงการ
                        </label>
                        <p className="text-[11px] text-slate-500">
                          เบอร์ติดต่อด่วนสำหรับให้ลูกค้าติดต่อสอบถามเพิ่มเติม
                        </p>
                      </div>
                    </div>
                    <div className="sm:w-72 shrink-0">
                      <input
                        type="text"
                        value={coordData.phone}
                        onChange={(e) => setCoordData({ ...coordData, phone: e.target.value })}
                        placeholder="เช่น 081-234-5678"
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
                      />
                    </div>
                  </div>

                  {/* ข้อ 3 */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 px-2 py-0.5 rounded bg-sky-100 text-[#00509d] text-xs font-bold">
                        ข้อ 3
                      </span>
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          เงื่อนไขและข้อยกเว้นที่จะปรากฏในเอกสารส่งออก
                        </label>
                        <p className="text-[11px] text-slate-500">
                          ข้อกำหนดมาตรฐานตามใบอนุญาตสยามสไมล์โบรกเกอร์ (ว00017/2553)
                        </p>
                      </div>
                    </div>
                    <div className="ml-0 sm:ml-10 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 space-y-1.5">
                      <p className="font-bold text-slate-900">
                        เงื่อนไขและข้อยกเว้น ในการใช้สิทธิ์ (สยามสไมล์โบรกเกอร์ ใบอนุญาต ว00017/2553)
                      </p>
                      <p>• ลูกค้าต้องเปิดเผยข้อมูลสุขภาพตามความเป็นจริง</p>
                      <p>• กรมธรรม์จะไม่คุ้มครองโรคที่เป็นมาก่อนการทำประกันภัย</p>
                      <p>• ระยะเวลารอคอย 30 วันสำหรับโรคทั่วไป และ 120 วันสำหรับ 8 กลุ่มโรคเรื้อรัง</p>
                      <p>• คำเตือนขอให้ศึกษาข้อยกเว้นก่อนตัดสินใจ หากมีข้อขัดข้องติดต่อ 1434</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentPlan ? (
              /* Plan Fields Editor - เรียงเป็นข้อลงมา */
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* General Information - เรียงเป็นข้อลงมา */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>ข้อมูลทั่วไปและการตั้งชื่อแผน ({currentPlan.code})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(currentPlan.id)}
                      className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="ลบแผนนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบแผน</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {/* ข้อ 1 */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                          ข้อ 1
                        </span>
                        <div>
                          <span className="font-bold text-slate-800">รหัสแผน (Code)</span>
                          <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                            เช่น 15-I, 15-O, PA 60
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={currentPlan.code}
                        onChange={(e) => handleUpdateCurrentPlan({ code: e.target.value })}
                        className="w-full sm:w-64 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold focus:ring-1 focus:ring-blue-500 text-slate-900"
                      />
                    </div>

                    {/* ข้อ 2 */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                          ข้อ 2
                        </span>
                        <div>
                          <span className="font-bold text-slate-800">ชื่อแผนประกัน (ตั้งชื่อตามต้องการ)</span>
                          <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                            ชื่อเต็มที่จะแสดงในตารางและเอกสาร
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={currentPlan.name}
                        onChange={(e) => handleUpdateCurrentPlan({ name: e.target.value })}
                        className="w-full sm:w-80 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-semibold focus:ring-1 focus:ring-blue-500"
                        placeholder="เช่น แผน 15 (ผู้ป่วยในอย่างเดียว)"
                      />
                    </div>

                    {/* ข้อ 3 */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                          ข้อ 3
                        </span>
                        <div>
                          <span className="font-bold text-slate-800">ป้ายกำกับ (Badge)</span>
                          <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                            เช่น แนะนำ, ยอดนิยม, ขายดี (เว้นว่างได้)
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={currentPlan.badge || ''}
                        onChange={(e) => handleUpdateCurrentPlan({ badge: e.target.value })}
                        className="w-full sm:w-64 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300"
                        placeholder="เช่น แนะนำ, ยอดนิยม"
                      />
                    </div>

                    {/* ข้อ 4 */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                          ข้อ 4
                        </span>
                        <div>
                          <span className="font-bold text-slate-800">เบี้ยประกันภัยรายเดือน</span>
                          <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                            ยอดหักหรือชำระรายเดือน
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={currentPlan.monthlyPremium}
                          onChange={(e) =>
                            handleUpdateCurrentPlan({ monthlyPremium: Number(e.target.value) || 0 })
                          }
                          className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-emerald-700 text-right"
                        />
                        <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/เดือน</span>
                      </div>
                    </div>

                    {/* ข้อ 5 */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                          ข้อ 5
                        </span>
                        <div>
                          <span className="font-bold text-slate-800">เบี้ยประกันภัยรายปี</span>
                          <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                            ยอดชำระแบบรายปี
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={currentPlan.annualPremium}
                          onChange={(e) =>
                            handleUpdateCurrentPlan({ annualPremium: Number(e.target.value) || 0 })
                          }
                          className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-blue-700 text-right"
                        />
                        <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ปี</span>
                      </div>
                    </div>

                    {/* ข้อ 6 */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                          ข้อ 6
                        </span>
                        <div>
                          <span className="font-bold text-slate-800">คำอธิบายแผนโดยสรุป</span>
                          <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                            คำบรรยายจุดเด่นสั้นๆ
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={currentPlan.description}
                        onChange={(e) => handleUpdateCurrentPlan({ description: e.target.value })}
                        className="w-full sm:w-80 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300"
                        placeholder="เช่น แผนประกันสุขภาพคุ้มครองผู้ป่วยใน IPD"
                      />
                    </div>
                  </div>
                </div>

                {/* Coverages Breakdown - เรียงเป็นข้อลงมา */}
                {currentPlan.category === 'pa' ? (
                  /* PA Plan Coverage Inputs - เรียงเป็นข้อลงมา */
                  <div className="space-y-4">
                    {/* ส่วนที่ 1: ค่ารักษาพยาบาลและกรณีพิเศษ */}
                    <div className="bg-white rounded-xl border border-amber-200 shadow-2xs overflow-hidden">
                      <div className="bg-amber-50/90 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
                        <h5 className="font-bold text-amber-950 text-xs flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          <span>หมวดค่ารักษาพยาบาลจากอุบัติเหตุ & กรณีพิเศษ (เรียงข้อ 1 - 3)</span>
                        </h5>
                      </div>

                      <div className="divide-y divide-amber-100/60 text-xs">
                        {/* ข้อ 1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                              ข้อ 1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่ารักษาพยาบาลจากอุบัติเหตุ (บาท/ครั้ง)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                วงเงินรักษาพยาบาลฉุกเฉินและต่อเนื่องต่ออุบัติเหตุแต่ละครั้ง
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.opd.accident}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  opd: { ...currentPlan.opd, accident: val },
                                  paSchedule: currentPlan.paSchedule
                                    ? {
                                        ...currentPlan.paSchedule,
                                        accidentMedicalTreatment: val,
                                      }
                                    : undefined,
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-amber-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ครั้ง</span>
                          </div>
                        </div>

                        {/* ข้อ 2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                              ข้อ 2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">การถูกฆาตกรรม หรือถูกลอบทำร้าย</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ความคุ้มครองการเสียชีวิตจากการถูกทำร้ายหรือฆาตกรรม
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.life.murderAssault}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  life: {
                                    ...currentPlan.life,
                                    murderAssault: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 3 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                              ข้อ 3
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">การขับขี่ หรือโดยสารรถจักรยานยนต์</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ความคุ้มครองการเสียชีวิตจากอุบัติเหตุรถจักรยานยนต์
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.life.motorcycle}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  life: {
                                    ...currentPlan.life,
                                    motorcycle: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ส่วนที่ 2: ตารางความคุ้มครอง อบ.2 ครบ 12 รายการ เรียงเป็นข้อลงมา */}
                    <div className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden">
                      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>ตารางความคุ้มครอง อบ.2 (สูญเสียอวัยวะ สายตา ทุพพลภาพ)</span>
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            เรียงลำดับความคุ้มครองข้อ 4.1 ถึงข้อ 4.12 ลงมา สามารถปรับวงเงินแต่ละรายการย่อยได้อิสระ
                          </p>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        {/* ข้อ 4.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                              ข้อ 4.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ทุพพลภาพถาวรสิ้นเชิง (100%)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ทุพพลภาพถาวรสิ้นเชิง ไม่สามารถปฏิบัติหน้าที่ใดๆ ได้
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.permanentDisability ?? currentPlan.life.accidentGeneral}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  life: { ...currentPlan.life, accidentGeneral: val },
                                  paSchedule: currentPlan.paSchedule
                                    ? { ...currentPlan.paSchedule, permanentDisability: val, twoLimbsOrEyes: val }
                                    : undefined,
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-blue-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                              ข้อ 4.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">สูญเสียมือ 2 ข้าง หรือเท้า 2 ข้าง หรือสายตา 2 ข้าง (100%)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                สูญเสียอวัยวะสำคัญคู่กัน 2 ข้าง หรืออย่างใดอย่างหนึ่งรวมกัน 2 ข้าง
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.twoLimbsOrEyes ?? currentPlan.life.accidentGeneral}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, twoLimbsOrEyes: val },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-blue-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.3 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.3
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">สูญเสียมือ 1 ข้าง หรือเท้า 1 ข้าง หรือสายตา 1 ข้าง (60%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.oneLimbOrEye ?? Math.round(currentPlan.life.accidentGeneral * 0.6)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, oneLimbOrEye: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.4 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.4
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">หูหนวกทั้ง 2 ข้าง หรือเป็นใบ้ (50%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.deafBothOrMute ?? Math.round(currentPlan.life.accidentGeneral * 0.5)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, deafBothOrMute: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.5 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.5
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วหัวแม่มือ 2 ข้อ (25%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.thumbTwoJoints ?? Math.round(currentPlan.life.accidentGeneral * 0.25)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, thumbTwoJoints: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.6 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.6
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">หูหนวก 1 ข้าง (15%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.deafOneEar ?? Math.round(currentPlan.life.accidentGeneral * 0.15)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, deafOneEar: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.7 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.7
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วหัวแม่มือ 1 ข้อ (10%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.thumbOneJoint ?? Math.round(currentPlan.life.accidentGeneral * 0.1)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, thumbOneJoint: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.8 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.8
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วชี้ 3 ข้อ (10%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.indexFingerThreeJoints ?? Math.round(currentPlan.life.accidentGeneral * 0.1)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, indexFingerThreeJoints: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.9 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.9
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วชี้ 2 ข้อ (8%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.indexFingerTwoJoints ?? Math.round(currentPlan.life.accidentGeneral * 0.08)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, indexFingerTwoJoints: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.10 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.10
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วอื่น 2 ข้อ (5%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.otherFingersTwoJoints ?? Math.round(currentPlan.life.accidentGeneral * 0.05)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, otherFingersTwoJoints: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.11 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.11
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วหัวแม่เท้า (5%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.bigToe ?? Math.round(currentPlan.life.accidentGeneral * 0.05)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, bigToe: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 4.12 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                              ข้อ 4.12
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">นิ้วอื่น 1 ข้อ (1%)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.paSchedule?.otherFingersOneJoint ?? Math.round(currentPlan.life.accidentGeneral * 0.01)}
                              onChange={(e) => {
                                if (currentPlan.paSchedule) {
                                  handleUpdateCurrentPlan({
                                    paSchedule: { ...currentPlan.paSchedule, otherFingersOneJoint: Number(e.target.value) || 0 },
                                  });
                                }
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-right font-medium text-slate-800"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Health Plan Coverage Inputs - เรียงเป็นข้อ 1 ถึง 6 ลงมาอย่างเป็นระบบ */
                  <div className="space-y-4">
                    {/* หมวด 1: ค่าห้องและค่าอาหาร (ข้อ 1.1 - 1.4) */}
                    <div className="bg-white rounded-xl border border-sky-200 shadow-2xs overflow-hidden">
                      <div className="bg-sky-50/90 px-4 py-3 border-b border-sky-200 flex items-center justify-between">
                        <h5 className="font-bold text-[#00509d] text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#00509d] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            1
                          </span>
                          <span>หมวด 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาลประจำวัน</span>
                        </h5>
                        <span className="text-[10px] text-sky-700 font-semibold bg-sky-100/70 px-2 py-0.5 rounded-full">
                          ห้องปกติ 45 คืน / ICU 30 คืน
                        </span>
                      </div>

                      <div className="divide-y divide-sky-100/60 text-xs">
                        {/* ข้อ 1.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-sky-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-[#00509d] font-bold shrink-0">
                              ข้อ 1.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่าห้องและค่าอาหารปกติ (บาท/คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                สูงสุดไม่เกิน 45 คืนต่อการเข้าพักรักษาตัวครั้งใดครั้งหนึ่ง
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.roomNormal.perNight}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  roomNormal: {
                                    ...currentPlan.roomNormal,
                                    perNight: val,
                                    maxLimit: val * 45,
                                  },
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/คืน</span>
                          </div>
                        </div>

                        {/* ข้อ 1.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-sky-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-[#00509d] font-bold shrink-0">
                              ข้อ 1.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่าห้องปกติ รวมสูงสุดต่อครั้ง (45 คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                คำนวณอัตโนมัติ (45 × ค่าห้องต่อคืน) หรือระบุวงเงินตามต้องการ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.roomNormal.maxLimit}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  roomNormal: {
                                    ...currentPlan.roomNormal,
                                    maxLimit: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-medium text-slate-700 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 1.3 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-sky-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-[#00509d] font-bold shrink-0">
                              ข้อ 1.3
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่าห้องผู้ป่วยหนัก ICU (บาท/คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                สูงสุดไม่เกิน 30 คืนต่อการเข้าพักรักษาตัวครั้งใดครั้งหนึ่ง
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.roomICU.perNight}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  roomICU: {
                                    ...currentPlan.roomICU,
                                    perNight: val,
                                    maxLimit: val * 30,
                                  },
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/คืน</span>
                          </div>
                        </div>

                        {/* ข้อ 1.4 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-sky-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-[#00509d] font-bold shrink-0">
                              ข้อ 1.4
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่าห้อง ICU รวมสูงสุดต่อครั้ง (30 คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                คำนวณอัตโนมัติ (30 × ค่าห้อง ICU) หรือระบุวงเงินตามต้องการ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.roomICU.maxLimit}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  roomICU: {
                                    ...currentPlan.roomICU,
                                    maxLimit: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-medium text-slate-700 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* หมวด 2: ค่ารักษาพยาบาลทั่วไป & การผ่าตัด (ข้อ 2.1 - 2.2) */}
                    <div className="bg-white rounded-xl border border-emerald-200 shadow-2xs overflow-hidden">
                      <div className="bg-emerald-50/90 px-4 py-3 border-b border-emerald-200 flex items-center justify-between">
                        <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            2
                          </span>
                          <span>หมวด 2: ค่ารักษาพยาบาลทั่วไป & ค่าผ่าตัด หัตถการ</span>
                        </h5>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          รวมค่ายา ตรวจแล็บ เอ็กซเรย์ เลือด
                        </span>
                      </div>

                      <div className="divide-y divide-emerald-100/60 text-xs">
                        {/* ข้อ 2.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                              ข้อ 2.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่ารักษาพยาบาลทั่วไปต่อครั้ง (บาท/ครั้ง)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ค่ายา ค่าตรวจวินิจฉัยทางห้องปฏิบัติการ ค่าตรวจทางรังสีวิทยา ค่าบริการโลหิต
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.medicalGeneralPerVisit}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  medicalGeneralPerVisit: Number(e.target.value) || 0,
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-emerald-800 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ครั้ง</span>
                          </div>
                        </div>

                        {/* ข้อ 2.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                              ข้อ 2.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่าผ่าตัดและการทำหัตถการ (บาท/ครั้ง)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ค่าห้องผ่าตัดและอุปกรณ์ ค่าแพทย์ผ่าตัด วงเงินสูงสุดตามตารางผ่าตัด
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.surgeryPerDisorder}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  surgeryPerDisorder: Number(e.target.value) || 0,
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-emerald-800 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ครั้ง</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* หมวด 3: ค่าแพทย์ตรวจเยี่ยมประจำวัน (ข้อ 3.1 - 3.2) */}
                    <div className="bg-white rounded-xl border border-indigo-200 shadow-2xs overflow-hidden">
                      <div className="bg-indigo-50/90 px-4 py-3 border-b border-indigo-200 flex items-center justify-between">
                        <h5 className="font-bold text-indigo-950 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            3
                          </span>
                          <span>หมวด 3: ค่าแพทย์ตรวจรักษาประจำวัน (Doctor Visits)</span>
                        </h5>
                        <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100/70 px-2 py-0.5 rounded-full">
                          สูงสุด 45 วันต่อครั้ง
                        </span>
                      </div>

                      <div className="divide-y divide-indigo-100/60 text-xs">
                        {/* ข้อ 3.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-indigo-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold shrink-0">
                              ข้อ 3.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่าแพทย์ตรวจเยี่ยมต่อวัน (บาท/คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ค่าผู้ประกอบวิชาชีพเวชกรรม (แพทย์) ตรวจรักษาประจำวัน สูงสุด 45 วันต่อครั้ง
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.doctorVisitPerNight.perNight}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  doctorVisitPerNight: {
                                    ...currentPlan.doctorVisitPerNight,
                                    perNight: val,
                                    maxLimit: val * 45,
                                  },
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-indigo-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/คืน</span>
                          </div>
                        </div>

                        {/* ข้อ 3.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-indigo-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold shrink-0">
                              ข้อ 3.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">วงเงินรวมค่าแพทย์ตรวจเยี่ยมสูงสุดต่อปี (บาท)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                วงเงินผลประโยชน์รวมค่าแพทย์ตรวจรักษาสูงสุดต่อรอบปีกรมธรรม์
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.doctorVisitPerNight.maxLimit}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  doctorVisitPerNight: {
                                    ...currentPlan.doctorVisitPerNight,
                                    maxLimit: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-medium text-slate-700 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ปี</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* หมวด 4: ค่ารักษาพยาบาลผู้ป่วยนอก OPD (ข้อ 4.1 - 4.3) */}
                    <div className="bg-white rounded-xl border border-amber-200 shadow-2xs overflow-hidden">
                      <div className="bg-amber-50/90 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
                        <h5 className="font-bold text-amber-950 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            4
                          </span>
                          <span>หมวด 4: ค่ารักษาพยาบาลผู้ป่วยนอก (OPD)</span>
                        </h5>
                        <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-full">
                          อุบัติเหตุฉุกเฉิน 24 ชม. & เจ็บป่วยทั่วไป
                        </span>
                      </div>

                      <div className="divide-y divide-amber-100/60 text-xs">
                        {/* ข้อ 4.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                              ข้อ 4.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่ารักษาอุบัติเหตุฉุกเฉิน 24 ชั่วโมง (บาท/ครั้ง)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ภายใน 24 ชม. หลังเกิดอุบัติเหตุ พร้อมการรักษาต่อเนื่อง 15 วัน
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.opd.accident}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  opd: { ...currentPlan.opd, accident: Number(e.target.value) || 0 },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-amber-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ครั้ง</span>
                          </div>
                        </div>

                        {/* ข้อ 4.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                              ข้อ 4.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ค่ารักษาผู้ป่วยนอกโรคทั่วไป OPD (บาท/ครั้ง)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                เบิกค่ายาและค่าตรวจเมื่อหาหมอโดยไม่ต้องนอนโรงพยาบาล (0 = ไม่คุ้มครอง)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.opd.illness?.perVisit || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  opd: {
                                    ...currentPlan.opd,
                                    illness: {
                                      ...currentPlan.opd.illness,
                                      covered: val > 0,
                                      perVisit: val,
                                      maxVisitsPerYear: currentPlan.opd.illness?.maxVisitsPerYear || 30,
                                    },
                                  },
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/ครั้ง</span>
                          </div>
                        </div>

                        {/* ข้อ 4.3 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                              ข้อ 4.3
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">จำนวนครั้งสูงสุดที่เบิกได้ต่อปี (ครั้ง/ปี)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                โควตาจำนวนครั้งผู้ป่วยนอก OPD สูงสุดต่อรอบปีกรมธรรม์
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.opd.illness?.maxVisitsPerYear || 0}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  opd: {
                                    ...currentPlan.opd,
                                    illness: {
                                      ...currentPlan.opd.illness,
                                      covered: (currentPlan.opd.illness?.perVisit || 0) > 0,
                                      perVisit: currentPlan.opd.illness?.perVisit || 0,
                                      maxVisitsPerYear: Number(e.target.value) || 0,
                                    },
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-medium text-slate-700 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">ครั้ง/ปี</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* หมวด 5: ค่าชดเชยรายได้รายวัน & สิทธิพิเศษกรณีใช้สิทธิอื่น (ข้อ 5.1 - 5.4) */}
                    <div className="bg-white rounded-xl border border-purple-200 shadow-2xs overflow-hidden">
                      <div className="bg-purple-50/90 px-4 py-3 border-b border-purple-200 flex items-center justify-between">
                        <h5 className="font-bold text-purple-950 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            5
                          </span>
                          <span>หมวด 5: ค่าชดเชยรายได้รายวัน & สิทธิพิเศษกรณีใช้สิทธิอื่น</span>
                        </h5>
                        <span className="text-[10px] text-purple-800 font-semibold bg-purple-100/70 px-2 py-0.5 rounded-full">
                          ชดเชยเมื่อนอน รพ. สูงสุด 180 วัน
                        </span>
                      </div>

                      <div className="divide-y divide-purple-100/60 text-xs">
                        {/* ข้อ 5.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-purple-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold shrink-0">
                              ข้อ 5.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">ชดเชยรายได้รายวันเมื่อนอน รพ. (บาท/คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                เงินชดเชยรายวันกรณีเข้ารับการรักษาพยาบาลเป็นผู้ป่วยใน สูงสุด 180 วัน
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.dailyCompensation.perNight}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleUpdateCurrentPlan({
                                  dailyCompensation: {
                                    ...currentPlan.dailyCompensation,
                                    perNight: val,
                                    maxLimit: val * 180,
                                  },
                                });
                              }}
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-purple-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/คืน</span>
                          </div>
                        </div>

                        {/* ข้อ 5.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-purple-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold shrink-0">
                              ข้อ 5.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">วงเงินชดเชยรายได้รวมสูงสุดต่อครั้ง (180 วัน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                คำนวณอัตโนมัติ (180 × ชดเชยรายวัน) หรือระบุวงเงินตามต้องการ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.dailyCompensation.maxLimit}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  dailyCompensation: {
                                    ...currentPlan.dailyCompensation,
                                    maxLimit: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-medium text-slate-700 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 5.3 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-purple-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold shrink-0">
                              ข้อ 5.3
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">สิทธิประโยชน์ค่าห้องปกติกรณีใช้สิทธิอื่น (บาท/คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                เมื่อผู้เอาประกันภัยใช้สิทธิเบิกสวัสดิการอื่น เช่น ประกันสังคม สิทธิข้าราชการ (สูงสุด 180 วัน)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.otherRightsNormalRoom.perNight}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  otherRightsNormalRoom: {
                                    ...currentPlan.otherRightsNormalRoom,
                                    perNight: Number(e.target.value) || 0,
                                    maxLimit: (Number(e.target.value) || 0) * 180,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/คืน</span>
                          </div>
                        </div>

                        {/* ข้อ 5.4 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-purple-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold shrink-0">
                              ข้อ 5.4
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">สิทธิประโยชน์ค่าห้อง ICU กรณีใช้สิทธิอื่น (บาท/คืน)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                เมื่อใช้สิทธิอื่นและนอนพักรักษาในห้องผู้ป่วยหนัก ICU (สูงสุด 15 วัน)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.otherRightsICU.perNight}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  otherRightsICU: {
                                    ...currentPlan.otherRightsICU,
                                    perNight: Number(e.target.value) || 0,
                                    maxLimit: (Number(e.target.value) || 0) * 15,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท/คืน</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* หมวด 6: ความคุ้มครองชีวิตและการเสียชีวิต (ข้อ 6.1 - 6.4) */}
                    <div className="bg-white rounded-xl border border-rose-200 shadow-2xs overflow-hidden">
                      <div className="bg-rose-50/90 px-4 py-3 border-b border-rose-200 flex items-center justify-between">
                        <h5 className="font-bold text-rose-950 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            6
                          </span>
                          <span>หมวด 6: ความคุ้มครองชีวิตและการเสียชีวิต</span>
                        </h5>
                        <span className="text-[10px] text-rose-800 font-semibold bg-rose-100/70 px-2 py-0.5 rounded-full">
                          อุบัติเหตุ ฆาตกรรม มอเตอร์ไซค์ ค่าปลงศพ
                        </span>
                      </div>

                      <div className="divide-y divide-rose-100/60 text-xs">
                        {/* ข้อ 6.1 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-rose-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold shrink-0">
                              ข้อ 6.1
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">การเสียชีวิตจากอุบัติเหตุทั่วไป (อบ.2)</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                วงเงินความคุ้มครองชีวิตและการสูญเสียอวัยวะ สายตา ทุพพลภาพถาวรสิ้นเชิง
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.life.accidentGeneral}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  life: {
                                    ...currentPlan.life,
                                    accidentGeneral: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-rose-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 6.2 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-rose-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold shrink-0">
                              ข้อ 6.2
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">การถูกฆาตกรรม หรือถูกลอบทำร้าย</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ความคุ้มครองการเสียชีวิตจากการถูกทำร้ายหรือฆาตกรรม
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.life.murderAssault}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  life: {
                                    ...currentPlan.life,
                                    murderAssault: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 6.3 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-rose-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold shrink-0">
                              ข้อ 6.3
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">การขับขี่ หรือโดยสารรถจักรยานยนต์</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                ความคุ้มครองการเสียชีวิตจากอุบัติเหตุรถจักรยานยนต์
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.life.motorcycle}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  life: {
                                    ...currentPlan.life,
                                    motorcycle: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>

                        {/* ข้อ 6.4 */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-rose-50/30">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold shrink-0">
                              ข้อ 6.4
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">เงินช่วยเหลือค่าปลงศพและค่าใช้จ่ายจัดงานศพ</span>
                              <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                                เงินช่วยเหลือพิเศษกรณีเสียชีวิตจากการเจ็บป่วยหรืออุบัติเหตุ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={currentPlan.life.funeralBenefit}
                              onChange={(e) =>
                                handleUpdateCurrentPlan({
                                  life: {
                                    ...currentPlan.life,
                                    funeralBenefit: Number(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-36 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-slate-900 text-right"
                            />
                            <span className="text-slate-500 font-medium text-xs min-w-[52px]">บาท</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3.5 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-slate-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-red-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>คืนค่าเริ่มต้นจากโรงงาน</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-lg border border-red-200 text-xs">
                <span className="text-red-700 font-semibold">ยืนยันคืนค่าเดิม?</span>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="bg-red-600 text-white px-2.5 py-0.5 rounded font-bold hover:bg-red-700 cursor-pointer"
                >
                  ใช่
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                บันทึกการตั้งค่าสำเร็จ!
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ปิด
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#00509d] hover:bg-[#094f92] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่าแผนทั้งหมด</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
