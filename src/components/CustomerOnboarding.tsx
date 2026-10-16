import React, { useState } from 'react';
import { InsurancePlan, CustomerProfile } from '../types';
import { calculateAge, searchExistingCustomer, MOCK_EXISTING_CUSTOMERS } from '../data/customers';
import { 
  Calendar, 
  Search, 
  UserCheck, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface CustomerOnboardingProps {
  onConfirmAge: (age: number | null, birthDateStr: string, customer?: CustomerProfile | null) => void;
  onSkip: () => void;
  allPlans: InsurancePlan[];
}

export const CustomerOnboarding: React.FC<CustomerOnboardingProps> = ({
  onConfirmAge,
  onSkip,
  allPlans,
}) => {
  const [activeTab, setActiveTab] = useState<'dob' | 'existing'>('dob');

  // DOB Tab state
  const [dob, setDob] = useState<string>('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Existing customer lookup state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foundCustomer, setFoundCustomer] = useState<CustomerProfile | null>(null);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const age = calculateAge(val);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  };

  const handleApplyDob = () => {
    if (calculatedAge !== null) {
      onConfirmAge(calculatedAge, dob, null);
    } else {
      onSkip();
    }
  };

  const handleSearchCustomer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchAttempted(true);
    const result = searchExistingCustomer(searchQuery);
    setFoundCustomer(result);
  };

  const handleSelectQuickCustomer = (cust: CustomerProfile) => {
    setSearchQuery(cust.idCard);
    setFoundCustomer(cust);
    setSearchAttempted(true);
  };

  const handleApplyExistingCustomer = () => {
    if (foundCustomer) {
      onConfirmAge(foundCustomer.age, foundCustomer.birthDate, foundCustomer);
    }
  };

  // Preview eligible plans count based on calculated age
  const eligiblePlansForAge = calculatedAge !== null 
    ? allPlans.filter(p => calculatedAge >= p.minAge && calculatedAge <= p.maxAge)
    : allPlans;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-900 text-white p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/10 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ขั้นตอนเริ่มต้นคำนวณความคุ้มครองที่ตรงใจ</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              ระบุข้อมูลผู้เอาประกันภัย เพื่อคัดกรองแผนที่เหมาะสม
            </h2>
            <p className="text-xs md:text-sm text-sky-200/90 mt-1 max-w-2xl">
              เลือกวันเดือนปีเกิดเพื่อคำนวณอายุและแสดงแผนที่สมัครได้ หรือค้นหาลูกค้าเก่าเพื่อดึงแผนเดิมมาเปรียบเทียบความคุ้มค่า
            </p>
          </div>

          <button
            onClick={onSkip}
            className="self-start md:self-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer whitespace-nowrap"
          >
            ข้ามขั้นตอนนี้ (ดูทุกแผน) &rarr;
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-5 border-t border-white/15 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('dob')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dob'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-sky-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>คำนวณอายุตามวันเกิด</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('existing')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'existing'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-sky-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ลูกค้าเก่าซื้อเพิ่ม (ค้นหาแผนเดิม)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: DOB Calculator */}
      {activeTab === 'dob' && (
        <div className="p-5 md:p-6 bg-slate-50/60">
          <div className="max-w-2xl space-y-4">
            <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>กรุณาเลือกวันเดือนปีเกิด (ค.ศ.) ของผู้เอาประกันภัย</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={handleDobChange}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800 bg-white shadow-2xs"
                />

                {calculatedAge !== null && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs">อายุคำนวณได้:</span>
                    <span className="text-base font-black text-blue-700">{calculatedAge}</span>
                    <span className="text-xs font-semibold">ปี</span>
                  </div>
                )}
              </div>

              {calculatedAge !== null && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      พบแผนที่รับประกันสำหรับอายุ <strong>{calculatedAge} ปี</strong> จำนวน{' '}
                      <strong className="text-blue-700 text-sm">{eligiblePlansForAge.length}</strong> จาก {allPlans.length} แผน
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {eligiblePlansForAge.map(p => (
                      <span key={p.id} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                        {p.code} ({p.ageRangeText})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick age chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="font-medium text-slate-600">ตัวอย่างทดสอบอายุ:</span>
              <button
                type="button"
                onClick={() => {
                  setDob('2015-05-10');
                  setCalculatedAge(calculateAge('2015-05-10'));
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                เด็กอายุ 10 ปี (แผน 610)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDob('1994-08-15');
                  setCalculatedAge(calculateAge('1994-08-15'));
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                วัยทำงาน 31 ปี (สมัครได้ทุกแผน)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDob('1962-02-20');
                  setCalculatedAge(calculateAge('1962-02-20'));
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                อายุ 63 ปี (เฉพาะแผน 610)
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleApplyDob}
                disabled={calculatedAge === null}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs md:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>กรองแผนตามอายุ ({calculatedAge !== null ? `${calculatedAge} ปี` : 'กรุณาเลือกวันเกิด'})</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
              >
                ข้าม / แสดงทุกแผน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Existing Customer Lookup */}
      {activeTab === 'existing' && (
        <div className="p-5 md:p-6 bg-slate-50/60">
          <div className="max-w-2xl space-y-4">
            <form onSubmit={handleSearchCustomer} className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>กรอกเลขประจำตัวประชาชน (13 หลัก) หรือชื่อ-นามสกุลลูกค้า</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                เพื่อค้นหาข้อมูลกรมธรรม์เดิมและดึงแผนปัจจุบันมาร่วมเปรียบเทียบกับแผนใหม่
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="เช่น 1100501234567 หรือ สมชาย มั่นคงดี"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs md:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>ค้นหาข้อมูล</span>
                </button>
              </div>

              {/* Quick sample existing customer buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                <span className="font-medium text-slate-600">ตัวอย่างลูกค้าในระบบ:</span>
                {MOCK_EXISTING_CUSTOMERS.map((cust) => (
                  <button
                    key={cust.idCard}
                    type="button"
                    onClick={() => handleSelectQuickCustomer(cust)}
                    className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border border-slate-200"
                  >
                    {cust.fullName} (มี {allPlans.find(p => p.id === cust.existingPlanId)?.code})
                  </button>
                ))}
              </div>
            </form>

            {/* Customer Found Card - Clean & Semi-Formal */}
            {foundCustomer && (
              <div className="bg-white border-2 border-emerald-500 rounded-xl p-4 md:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{foundCustomer.fullName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ลูกค้าเดิม
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        เลขบัตร: {foundCustomer.idCard} | อายุ {foundCustomer.age} ปี | กรมธรรม์: {foundCustomer.policyNumber}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyExistingCustomer}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center"
                  >
                    <span>เลือกเปรียบเทียบ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status metrics: Plan, Loss Claim, and Line OA status */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Current Plan */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                    <span className="text-slate-400 block text-[11px]">แผนความคุ้มครองเดิม</span>
                    <span className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
                      {allPlans.find(p => p.id === foundCustomer.existingPlanId)?.name}
                    </span>
                  </div>

                  {/* Loss Claim */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                    <span className="text-slate-400 block text-[11px]">ข้อมูล Loss Claim</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        foundCustomer.lossClaimRate <= 20 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="font-bold text-slate-800 text-xs">
                        {foundCustomer.lossClaimStatus}
                      </span>
                    </div>
                  </div>

                  {/* LINE OA Registration Status */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                    <span className="text-slate-400 block text-[11px]">สถานะ LINE OA</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        foundCustomer.lineOaRegistered ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                      <span className={`font-bold text-xs ${
                        foundCustomer.lineOaRegistered ? 'text-emerald-700' : 'text-slate-500'
                      }`}>
                        {foundCustomer.lineOaStatusText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {searchAttempted && !foundCustomer && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ไม่พบข้อมูลลูกค้าจากคำค้นหาดังกล่าว ท่านสามารถลองคลิกตัวอย่างลูกค้าด้านบน หรือใช้วิธีกรอกวันเกิดแทน</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
