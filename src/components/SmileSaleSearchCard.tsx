import React, { useState, useEffect, useRef } from 'react';
import { InsurancePlan, CustomerProfile, PayerOrganizationType } from '../types';
import {
  calculateAge,
  calculateDetailedAge,
  formatThaiBuddhistDate,
  searchExistingCustomer,
  MOCK_EXISTING_CUSTOMERS,
} from '../data/customers';
import {
  Calendar as CalendarIcon,
  Search,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Building2,
  Landmark,
  Users,
  Briefcase,
  Minus,
  Plus,
} from 'lucide-react';

interface SmileSaleSearchCardProps {
  onConfirmAge: (
    age: number | null,
    birthDateStr: string,
    customer?: CustomerProfile | null,
    payerType?: PayerOrganizationType
  ) => void;
  onReset: () => void;
  allPlans: InsurancePlan[];
  initialDob?: string;
  existingCustomer?: CustomerProfile | null;
  currentAge?: number | null;
  initialPayerType?: PayerOrganizationType;
}

export const SmileSaleSearchCard: React.FC<SmileSaleSearchCardProps> = ({
  onConfirmAge,
  onReset,
  allPlans,
  initialDob = '',
  existingCustomer = null,
  currentAge = null,
  initialPayerType = 'private',
}) => {
  // Payer Organization Type (ประเภทหน่วยงานผู้ชำระเบี้ย: หน่วยงานเอกชน, ข้าราชการและรัฐวิสาหกิจ, ทั่วไป)
  const [payerType, setPayerType] = useState<PayerOrganizationType>(initialPayerType);
  const [mode, setMode] = useState<'dob' | 'customer'>('dob');

  // Unknown DOB toggle & Manual Age state
  const [isUnknownDob, setIsUnknownDob] = useState<boolean>(false);
  const [manualAge, setManualAge] = useState<number>(() => currentAge || 30);

  // Date of birth state
  const [dob, setDob] = useState<string>(initialDob || '1995-05-15');
  const [detailedAge, setDetailedAge] = useState<{
    years: number;
    months: number;
    days: number;
    displayText: string;
  }>(() => calculateDetailedAge(initialDob || '1995-05-15'));

  // Customer search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foundCustomer, setFoundCustomer] = useState<CustomerProfile | null>(existingCustomer);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Sync when initialDob, currentAge, existingCustomer, or initialPayerType changes
  useEffect(() => {
    if (initialDob) {
      setDob(initialDob);
      setDetailedAge(calculateDetailedAge(initialDob));
    }
    if (currentAge !== null && currentAge !== undefined) {
      setManualAge(currentAge);
    }
    if (existingCustomer) {
      setFoundCustomer(existingCustomer);
      setMode('customer');
    }
    if (initialPayerType) {
      setPayerType(initialPayerType);
    }
  }, [initialDob, currentAge, existingCustomer, initialPayerType]);

  const handleDateChange = (val: string) => {
    setDob(val);
    const calculated = calculateDetailedAge(val);
    setDetailedAge(calculated);
  };

  const handleManualAgeChange = (newAge: number) => {
    const clamped = Math.max(1, Math.min(99, newAge));
    setManualAge(clamped);
  };

  const handleToggleUnknownDob = (checked: boolean) => {
    setIsUnknownDob(checked);
    if (checked) {
      // Switching to manual age: initialize with current calculated age or 30
      const currentYears = dob ? calculateAge(dob) : (manualAge || 30);
      setManualAge(currentYears > 0 ? currentYears : 30);
    } else {
      // Switching back to DOB: if empty, set default date based on manual age
      if (!dob) {
        const year = new Date().getFullYear() - (manualAge || 30);
        const defaultDob = `${year}-06-15`;
        setDob(defaultDob);
        setDetailedAge(calculateDetailedAge(defaultDob));
      }
    }
  };

  const handleSearchCustomer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const result = searchExistingCustomer(searchQuery);
    setFoundCustomer(result);
  };

  const handleSelectMockCustomer = (cust: CustomerProfile) => {
    setSearchQuery(cust.idCard);
    setFoundCustomer(cust);
    setHasSearched(true);
    setDob(cust.birthDate);
    setIsUnknownDob(false);
    setDetailedAge(calculateDetailedAge(cust.birthDate));
    onConfirmAge(cust.age, cust.birthDate, cust, payerType);
  };

  const handleApplySearch = () => {
    if (mode === 'customer' && foundCustomer) {
      onConfirmAge(foundCustomer.age, foundCustomer.birthDate, foundCustomer, payerType);
    } else if (isUnknownDob) {
      const ageVal = manualAge > 0 ? manualAge : 30;
      // Approximate birth date based on age when DOB is not known
      const approxYear = new Date().getFullYear() - ageVal;
      const approxDob = `${approxYear}-01-01`;
      onConfirmAge(ageVal, approxDob, null, payerType);
    } else if (dob) {
      const ageInYears = calculateAge(dob);
      onConfirmAge(ageInYears, dob, null, payerType);
    } else {
      onConfirmAge(null, '', null, payerType);
    }
  };

  const handleResetForm = () => {
    setDob('');
    setIsUnknownDob(false);
    setManualAge(30);
    setPayerType('private');
    setDetailedAge({ years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' });
    setFoundCustomer(null);
    setSearchQuery('');
    setHasSearched(false);
    onReset();
  };

  // Check eligible plans count for this age
  const effectiveAge: number | null = isUnknownDob
    ? (manualAge > 0 ? manualAge : null)
    : (dob ? calculateAge(dob) : currentAge);

  const eligibleCount = effectiveAge !== null && effectiveAge !== undefined
    ? allPlans.filter((p) => effectiveAge >= p.minAge && effectiveAge <= p.maxAge).length
    : allPlans.length;

  const thaiFormattedDate = dob ? formatThaiBuddhistDate(dob) : '22/09/2569';

  return (
    <div className="w-full">
      {/* Outer light blue container - sleek & compact */}
      <div className="bg-[#ebf4fa] rounded-xl p-3 sm:p-4 md:p-5 border border-[#d6e7f5]">
        {/* Section title */}
        <h2 className="text-center font-bold text-slate-800 text-sm sm:text-base mb-2">
          เช็คราคาประกันสุขภาพ
        </h2>

        {/* Inner white card - compact width & padding */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-3.5 sm:p-4 md:p-5 max-w-xl mx-auto">
          {/* Card sub-header with Mode Switch */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              กรอกข้อมูลเพื่อค้นหาแผนประกัน
            </h3>

            {/* Switch Mode: DOB vs Existing Customer */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setMode('dob')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  mode === 'dob'
                    ? 'bg-white text-[#00509d] shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                คำนวณตามอายุ / วันเกิด
              </button>
              <button
                type="button"
                onClick={() => setMode('customer')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'customer'
                    ? 'bg-[#00509d] text-white shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>ลูกค้าเดิม (Top-up)</span>
              </button>
            </div>
          </div>

          {mode === 'dob' ? (
            <div className="space-y-3.5">
              {/* 1. Date of Birth OR Manual Age Input Section (มาอยู่ด้านบน) */}
              <div className="space-y-1.5">
                {/* Header with 'ไม่ทราบวันเกิด' toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#0088cc]" />
                    <span>{isUnknownDob ? 'ระบุอายุของผู้เอาประกัน' : 'วัน/เดือน/ปีเกิด'}</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 hover:text-slate-900 select-none bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md transition-colors border border-slate-200/70">
                    <input
                      type="checkbox"
                      checked={isUnknownDob}
                      onChange={(e) => handleToggleUnknownDob(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#0088cc] rounded border-slate-300 focus:ring-[#0088cc] cursor-pointer"
                    />
                    <span className={isUnknownDob ? 'font-bold text-[#00509d]' : ''}>
                      ไม่ทราบวันเกิด (ระบุอายุโดยตรง)
                    </span>
                  </label>
                </div>

                {!isUnknownDob ? (
                  /* Standard Mode: Date of Birth Input Container */
                  <div>
                    <fieldset className="border border-slate-300 rounded-lg px-3 py-1.5 focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] bg-white transition-all">
                      <legend className="text-[10px] sm:text-[11px] text-slate-500 font-medium px-1">
                        วัน/เดือน/ปีเกิด
                      </legend>

                      <div className="flex items-center justify-between gap-2">
                        {/* Native date input */}
                        <input
                          ref={dateInputRef}
                          type="date"
                          value={dob}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none w-36 sm:w-40 py-0.5"
                        />

                        {/* Calculated detailed age on the right */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#00509d] bg-sky-50 px-2 py-0.5 rounded border border-sky-200/80 whitespace-nowrap">
                            {detailedAge.displayText}
                          </span>
                          <button
                            type="button"
                            onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
                            className="text-slate-400 hover:text-[#0088cc] transition-colors p-0.5 cursor-pointer"
                            title="เลือกวันเดือนปีเกิด"
                          >
                            <CalendarIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </fieldset>

                    {/* Display date in Thai Buddhist Era */}
                    {dob && (
                      <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 px-0.5">
                        <span>
                          วันที่เลือก: <strong className="text-slate-700">{thaiFormattedDate} (พ.ศ.)</strong>
                        </span>
                        <span className="text-[#0088cc] font-semibold">
                          สมัครได้ {eligibleCount} จาก {allPlans.length} แผน
                        </span>
                      </div>
                    )}

                    {/* Quick Age Test Presets */}
                    <div className="pt-1 flex items-center gap-1 flex-wrap text-[10px] text-slate-500">
                      <span className="text-[10px] text-slate-400">ทดสอบอายุ:</span>
                      <button
                        type="button"
                        onClick={() => handleDateChange('2015-06-10')}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        เด็ก 10 ปี (แผน 610)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDateChange('1994-08-15')}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        วัยทำงาน 31 ปี (ทุกแผน)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDateChange('1962-03-20')}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        สูงอายุ 63 ปี (แผน 610)
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Unknown DOB Mode: Direct Age Input */
                  <div>
                    <fieldset className="border border-[#0088cc] bg-sky-50/30 rounded-lg px-3 py-2 ring-1 ring-[#0088cc]/30 transition-all">
                      <legend className="text-[10px] sm:text-[11px] text-[#00509d] font-bold px-1">
                        ระบุอายุผู้เอาประกันโดยตรง (ปี)
                      </legend>

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        {/* Stepper controls & Number input */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualAgeChange(manualAge - 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:border-[#0088cc] hover:bg-sky-50 text-slate-700 hover:text-[#00509d] flex items-center justify-center font-bold text-base shadow-2xs transition-colors cursor-pointer"
                            title="ลดอายุ 1 ปี"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="relative flex items-center">
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={manualAge || ''}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                handleManualAgeChange(isNaN(val) ? 0 : val);
                              }}
                              className="w-16 sm:w-20 text-center font-bold text-base text-slate-900 bg-white border border-slate-300 rounded-lg py-1 focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc]"
                              placeholder="ระบุอายุ"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleManualAgeChange(manualAge + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:border-[#0088cc] hover:bg-sky-50 text-slate-700 hover:text-[#00509d] flex items-center justify-center font-bold text-base shadow-2xs transition-colors cursor-pointer"
                            title="เพิ่มอายุ 1 ปี"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-xs font-bold text-slate-700 ml-1">ปี</span>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#00509d] bg-sky-100/90 px-2.5 py-1 rounded-md border border-sky-200 shadow-2xs">
                            อายุ {manualAge} ปีบริบูรณ์
                          </span>
                        </div>
                      </div>
                    </fieldset>

                    <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 px-0.5">
                      <span>
                        ระบบประมาณปีเกิด: <strong className="text-slate-700">พ.ศ. {new Date().getFullYear() + 543 - (manualAge || 0)}</strong>
                      </span>
                      <span className="text-[#0088cc] font-semibold">
                        สมัครได้ {eligibleCount} จาก {allPlans.length} แผน
                      </span>
                    </div>

                    {/* Quick age preset chips */}
                    <div className="pt-1 flex items-center gap-1 flex-wrap text-[10px] text-slate-500">
                      <span className="text-[10px] text-slate-400">เลือกอายุเร็ว:</span>
                      <button
                        type="button"
                        onClick={() => handleManualAgeChange(10)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        เด็ก 10 ปี (แผน 610)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleManualAgeChange(25)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        25 ปี (เริ่มทำงาน)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleManualAgeChange(35)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        35 ปี (วัยทำงาน)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleManualAgeChange(50)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        50 ปี (ผู้ใหญ่)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleManualAgeChange(63)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                      >
                        63 ปี (สูงอายุ)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. ประเภทหน่วยงานผู้ชำระเบี้ย (ย้ายลงมาต่อ วัน/เดือน/ปีเกิด) */}
              <div className="pt-0.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#0088cc]" />
                    <span>ประเภทหน่วยงานผู้ชำระเบี้ย</span>
                  </label>
                  <span className="text-[10px] text-slate-400">เลือกกลุ่มเพื่อรับสิทธิประโยชน์</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {/* ตัวเลือกที่ 1: หน่วยงานเอกชน */}
                  <button
                    type="button"
                    onClick={() => setPayerType('private')}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start gap-2 sm:gap-0.5 relative ${
                      payerType === 'private'
                        ? 'border-[#0088cc] bg-[#f0f8ff] text-[#00509d] ring-1 ring-[#0088cc] shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Building2 className={`w-3.5 h-3.5 ${payerType === 'private' ? 'text-[#0088cc]' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold leading-tight">หน่วยงานเอกชน</span>
                    </div>
                    <span className="text-[10px] text-slate-400 sm:mt-0.5 ml-auto sm:ml-0 font-normal">
                      พนักงานบริษัท / ปกส.
                    </span>
                    {payerType === 'private' && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0088cc] hidden sm:block" />
                    )}
                  </button>

                  {/* ตัวเลือกที่ 2: ข้าราชการและรัฐวิสาหกิจ */}
                  <button
                    type="button"
                    onClick={() => setPayerType('government')}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start gap-2 sm:gap-0.5 relative ${
                      payerType === 'government'
                        ? 'border-[#0088cc] bg-[#f0f8ff] text-[#00509d] ring-1 ring-[#0088cc] shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Landmark className={`w-3.5 h-3.5 ${payerType === 'government' ? 'text-[#0088cc]' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold leading-tight">ข้าราชการและรัฐวิสาหกิจ</span>
                    </div>
                    <span className="text-[10px] text-slate-400 sm:mt-0.5 ml-auto sm:ml-0 font-normal">
                      เสริมสิทธิเบิกตรง
                    </span>
                    {payerType === 'government' && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0088cc] hidden sm:block" />
                    )}
                  </button>

                  {/* ตัวเลือกที่ 3: ทั่วไป */}
                  <button
                    type="button"
                    onClick={() => setPayerType('general')}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start gap-2 sm:gap-0.5 relative ${
                      payerType === 'general'
                        ? 'border-[#0088cc] bg-[#f0f8ff] text-[#00509d] ring-1 ring-[#0088cc] shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3.5 h-3.5 ${payerType === 'general' ? 'text-[#0088cc]' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold leading-tight">ทั่วไป</span>
                    </div>
                    <span className="text-[10px] text-slate-400 sm:mt-0.5 ml-auto sm:ml-0 font-normal">
                      ประชาชน / อาชีพอิสระ
                    </span>
                    {payerType === 'general' && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0088cc] hidden sm:block" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons - compact */}
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 px-3 rounded-lg border border-[#0088cc] text-[#0088cc] hover:bg-sky-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplySearch}
                  className="w-full py-2 px-3 rounded-lg bg-[#00509d] hover:bg-[#003e7a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>ค้นหาแผนประกัน</span>
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Existing Customer Lookup - compact */
            <div className="space-y-3">
              <form onSubmit={handleSearchCustomer}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="กรอกเลขบัตรประชาชน 13 หลัก หรือชื่อลูกค้าเดิม..."
                    className="w-full px-3 py-1.5 pr-20 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc] text-xs sm:text-sm text-slate-800"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#00509d] hover:bg-[#003e7a] text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>ค้นหา</span>
                  </button>
                </div>
              </form>

              {/* Quick Customer Test Chips */}
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">
                  หรือคลิกเลือกลูกค้าทดสอบ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {MOCK_EXISTING_CUSTOMERS.map((cust) => {
                    const motorPolicy = cust.policies?.find((p) => p.policyType === 'motor' || p.vehicleDetails);
                    const totalPolicies = cust.policies?.length || 1;

                    return (
                      <button
                        key={cust.idCard}
                        type="button"
                        onClick={() => handleSelectMockCustomer(cust)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          foundCustomer?.idCard === cust.idCard
                            ? 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                            <span>คุณ{cust.fullName} ({cust.age} ปี)</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-medium">
                              {totalPolicies} กรมธรรม์
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            สุขภาพ: {cust.existingPlanId.replace('plan-', '').toUpperCase()}
                            {motorPolicy?.vehicleDetails?.licensePlate && (
                              <span className="text-blue-700 ml-1.5 font-medium">
                                • 🚗 รถ {motorPolicy.vehicleDetails.insuranceClass || ''} ({motorPolicy.vehicleDetails.licensePlate})
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Found customer result box */}
              {foundCustomer && (() => {
                const motorPolicy = foundCustomer.policies?.find((p) => p.policyType === 'motor' || p.vehicleDetails);
                const firePolicy = foundCustomer.policies?.find((p) => p.policyType === 'fire');
                const totalPolicies = foundCustomer.policies?.length || 1;

                return (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-1 text-emerald-900 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>พบข้อมูลลูกค้าเดิม: คุณ{foundCustomer.fullName}</span>
                      </div>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-semibold">
                        ถือครอง {totalPolicies} กรมธรรม์
                      </span>
                    </div>

                    <p className="text-slate-600 text-[10.5px]">
                      เลขบัตร: <strong>{foundCustomer.idCard}</strong> • อายุ: {foundCustomer.age} ปี • แผนสุขภาพเดิม: <strong>{allPlans.find(p => p.id === foundCustomer.existingPlanId)?.name || foundCustomer.existingPlanId}</strong>
                    </p>

                    {(motorPolicy || firePolicy) && (
                      <div className="pt-1 border-t border-emerald-200/70 flex items-center gap-2 text-[10.5px] text-slate-700 flex-wrap">
                        {motorPolicy && (
                          <span className="inline-flex items-center gap-1 text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                            🚗 ประกันรถ: {motorPolicy.customPlanName || 'ประกันรถยนต์'} {motorPolicy.vehicleDetails?.licensePlate ? `(${motorPolicy.vehicleDetails.licensePlate})` : ''}
                          </span>
                        )}
                        {firePolicy && (
                          <span className="inline-flex items-center gap-1 text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200 font-medium">
                            🏠 ประกันอัคคีภัย: {firePolicy.customPlanName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 px-3 rounded-lg border border-[#0088cc] text-[#0088cc] hover:bg-sky-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplySearch}
                  disabled={!foundCustomer}
                  className="w-full py-2 px-3 rounded-lg bg-[#00509d] hover:bg-[#003e7a] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ดึงแผนเดิมและเปรียบเทียบ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
