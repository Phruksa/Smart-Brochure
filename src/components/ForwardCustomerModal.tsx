import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  QrCode,
  UserCheck,
  Shield,
  Home,
  Plane,
  Sparkles,
  ExternalLink,
  CreditCard,
  CheckCircle2,
  Phone,
  User,
  Clock,
  Printer,
  FileText,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { CustomerProfile, CustomerPolicyItem } from '../types';
import { MOCK_EXISTING_CUSTOMERS } from '../data/customers';

export interface PlanCodeProposalData {
  insuranceType: 'health' | 'pa' | 'life' | 'home' | 'travel';
  planCode: string;
  planName: string;
  quotingCode: string;
  sumInsuredText: string;
  premiumAmount: number;
  premiumModeText: string;
  annualEquivalentText?: string;
  monthlyAmount?: number;
  annualAmount?: number;
  highlights: string[];
  taxDeductible?: number;
  schengenGuaranteed?: boolean;
}

interface ForwardCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: PlanCodeProposalData;
  existingCustomer?: CustomerProfile | null;
  onAssignToCustomer?: (customer: CustomerProfile, newPolicy: CustomerPolicyItem) => void;
  onProceedToPayment?: (customerName: string, customerPhone: string) => void;
  onShowToast?: (msg: string) => void;
}

export const ForwardCustomerModal: React.FC<ForwardCustomerModalProps> = ({
  isOpen,
  onClose,
  proposal,
  existingCustomer,
  onAssignToCustomer,
  onProceedToPayment,
  onShowToast,
}) => {
  if (!isOpen) return null;

  // Selected customer mode
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>(
    existingCustomer ? 'existing' : 'existing'
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    existingCustomer?.idCard || MOCK_EXISTING_CUSTOMERS[0].idCard
  );
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newCustomerPhone, setNewCustomerPhone] = useState<string>('');
  const [newCustomerIdCard, setNewCustomerIdCard] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedLineMsg, setCopiedLineMsg] = useState<boolean>(false);
  const [isSavedToPortfolio, setIsSavedToPortfolio] = useState<boolean>(false);

  // Determine current active customer target
  const currentCustomer =
    customerMode === 'existing'
      ? MOCK_EXISTING_CUSTOMERS.find((c) => c.idCard === selectedCustomerId) || existingCustomer
      : null;

  const targetCustomerName =
    customerMode === 'existing'
      ? currentCustomer?.fullName || 'ลูกค้า'
      : newCustomerName.trim() || 'ลูกค้า';

  const targetCustomerPhone =
    customerMode === 'existing'
      ? currentCustomer?.phone || '08X-XXX-XXXX'
      : newCustomerPhone.trim() || '08X-XXX-XXXX';

  // Proposal Web Portal Link
  const proposalPortalUrl = `https://smilesale.siamsmile.co.th/portal/proposal?code=${encodeURIComponent(
    proposal.quotingCode
  )}&plan=${encodeURIComponent(proposal.planCode)}&cust=${encodeURIComponent(
    targetCustomerName
  )}`;

  // Formatted Thai message for LINE/SMS
  const lineShareMessage = `เรียน คุณ${targetCustomerName}

บริษัท สยามสไมล์โบรกเกอร์ฯ ขอส่งมอบข้อเสนอแผนประกันภัยสำหรับคุณ:
📋 แผนประกัน: ${proposal.planName}
🔑 รหัสอ้างอิงโค๊ด: ${proposal.quotingCode}
🛡️ ทุนประกันภัย: ${proposal.sumInsuredText}
💰 เบี้ยประกันภัย: ${proposal.premiumAmount.toLocaleString()} บาท (${proposal.premiumModeText})
${proposal.taxDeductible ? `✓ ลดหย่อนภาษีได้สูงสุด: ${proposal.taxDeductible.toLocaleString()} บ.\n` : ''}${
    proposal.schengenGuaranteed ? '✓ ได้รับการรับรองยื่นขอวีซ่าเชงเก้น 100%\n' : ''
  }
📲 ดูรายละเอียดและกดยืนยันแผนประกันได้ทันทีที่:
${proposalPortalUrl}

สอบถามข้อมูลเพิ่มเติมได้ที่ตัวแทนสยามสไมล์ของคุณได้ตลอด 24 ชม.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(proposalPortalUrl);
    setCopiedLink(true);
    onShowToast?.('คัดลอกลิงก์สำหรับส่งให้ลูกค้าเรียบร้อยแล้ว');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyLineMsg = () => {
    navigator.clipboard.writeText(lineShareMessage);
    setCopiedLineMsg(true);
    onShowToast?.('คัดลอกข้อความสำหรับส่งทาง LINE เรียบร้อยแล้ว');
    setTimeout(() => setCopiedLineMsg(false), 2500);
  };

  const handleOpenLineShare = () => {
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(lineShareMessage)}`;
    window.open(lineUrl, '_blank');
    onShowToast?.('กำลังเปิด LINE เพื่อแชร์ข้อความ');
  };

  const handleSaveToCustomerPortfolio = () => {
    const now = new Date();
    const thaiDate = `${now.getDate()} ${
      [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค.',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
      ][now.getMonth()]
    } ${now.getFullYear() + 543}`;

    const newPolicyItem: CustomerPolicyItem = {
      policyNumber: `PRO-${proposal.insuranceType.toUpperCase()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
      policyType:
        proposal.insuranceType === 'life'
          ? 'life'
          : proposal.insuranceType === 'home'
          ? 'fire'
          : proposal.insuranceType === 'health'
          ? 'health'
          : proposal.insuranceType === 'pa'
          ? 'pa'
          : 'other',
      customPlanName: `${proposal.planName} (โค๊ด: ${proposal.quotingCode})`,
      companyName: 'บมจ. สยามสไมล์ โบรกเกอร์',
      startDate: thaiDate,
      annualPremium: proposal.premiumAmount,
      monthlyPremium: Math.round(proposal.premiumAmount / 12),
      notes: `ส่งต่อเป็นแผนเสนอขายให้ลูกค้าเมื่อ ${thaiDate} รหัสโค๊ด: ${proposal.quotingCode}`,
    };

    let targetCust: CustomerProfile;
    if (customerMode === 'existing' && currentCustomer) {
      targetCust = currentCustomer;
    } else {
      targetCust = {
        idCard: newCustomerIdCard || `1100${Math.floor(100000000 + Math.random() * 900000000)}`,
        fullName: newCustomerName.trim() || 'ลูกค้าใหม่',
        birthDate: '1990-01-01',
        age: 35,
        phone: newCustomerPhone.trim() || '081-000-0000',
        existingPlanId: 'plan-custom',
        policyNumber: newPolicyItem.policyNumber,
        startDate: thaiDate,
        lossClaimRate: 0,
        lossClaimStatus: '0% (แผนใหม่)',
        lineOaRegistered: false,
        lineOaStatusText: 'ส่งลิงก์ข้อเสนอแล้ว',
        policies: [newPolicyItem],
      };
    }

    onAssignToCustomer?.(targetCust, newPolicyItem);
    setIsSavedToPortfolio(true);
    onShowToast?.(`บันทึกแผน ${proposal.planName} เข้าสู่ประวัติของ คุณ${targetCustomerName} เรียบร้อยแล้ว`);
  };

  const getInsuranceBadge = () => {
    switch (proposal.insuranceType) {
      case 'health':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'ประกันสุขภาพ (Health)',
          badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
          gradient: 'from-blue-50 to-sky-50',
        };
      case 'pa':
        return {
          icon: <Activity className="w-3.5 h-3.5" />,
          label: 'ประกันอุบัติเหตุ (PA)',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          gradient: 'from-amber-50 to-orange-50',
        };
      case 'life':
        return {
          icon: <Shield className="w-3.5 h-3.5" />,
          label: 'ประกันชีวิต (Life)',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
          gradient: 'from-rose-50 to-pink-50',
        };
      case 'home':
        return {
          icon: <Home className="w-3.5 h-3.5" />,
          label: 'ประกันบ้าน (Home)',
          badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          gradient: 'from-emerald-50 to-teal-50',
        };
      case 'travel':
      default:
        return {
          icon: <Plane className="w-3.5 h-3.5" />,
          label: 'ประกันเดินทาง (Travel)',
          badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
          gradient: 'from-blue-50 to-indigo-50',
        };
    }
  };

  const badge = getInsuranceBadge();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#00509d] via-[#003f7a] to-[#002855] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-200 backdrop-blur-xs border border-white/10">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>ส่งต่อลูกค้าเพื่อใช้เป็นแผนประกันภัย</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-300/30">
                  Customer Portal
                </span>
              </h3>
              <p className="text-xs text-sky-200/80">
                ส่งมอบใบข้อเสนอแผนประกันจากรหัสโค๊ดให้ลูกค้า พร้อมลิงก์เปิดดูบนมือถือและช่องทางชำระเงิน
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Plan Summary Card */}
          <div
            className={`rounded-2xl border p-4 bg-gradient-to-r ${badge.gradient} border-slate-200/90 shadow-2xs space-y-3`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.badgeClass}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">รหัสโค๊ด:</span>
                <span className="font-mono text-xs font-extrabold text-[#00509d] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {proposal.quotingCode}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {proposal.planName}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  ทุนประกันภัย: <strong className="text-slate-900">{proposal.sumInsuredText}</strong>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[11px] text-slate-500 font-medium">
                  เบี้ยประกันภัย ({proposal.premiumModeText})
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#00509d] font-mono tracking-tight">
                  {proposal.premiumAmount.toLocaleString()} <span className="text-xs font-normal text-slate-600">บาท</span>
                </div>
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {proposal.highlights.slice(0, 4).map((h, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Select or Enter Customer Info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#00509d]" />
                <span>ระบุลูกค้าผู้รับแผนประกัน</span>
              </label>
              <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCustomerMode('existing')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    customerMode === 'existing'
                      ? 'bg-[#00509d] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  เลือกลูกค้าเดิมในระบบ
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode('new')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    customerMode === 'new'
                      ? 'bg-[#00509d] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  กรอกข้อมูลลูกค้าใหม่
                </button>
              </div>
            </div>

            {customerMode === 'existing' ? (
              <div className="space-y-2">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    setIsSavedToPortfolio(false);
                  }}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
                >
                  {MOCK_EXISTING_CUSTOMERS.map((cust) => (
                    <option key={cust.idCard} value={cust.idCard}>
                      คุณ{cust.fullName} (อายุ {cust.age} ปี • โทร {cust.phone || '-'} • บัตร {cust.idCard})
                    </option>
                  ))}
                </select>
                {currentCustomer && (
                  <div className="flex items-center justify-between text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>เบอร์ติดต่อ: <strong>{currentCustomer.phone}</strong></span>
                    </span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                      กรมธรรม์เดิม: {currentCustomer.policyNumber}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ชื่อ-นามสกุลลูกค้า *</label>
                  <input
                    type="text"
                    placeholder="เช่น คุณวิเชียร สมใจ"
                    value={newCustomerName}
                    onChange={(e) => {
                      setNewCustomerName(e.target.value);
                      setIsSavedToPortfolio(false);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    placeholder="เช่น 089-123-4567"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">เลขบัตร ปชช. (ถ้ามี)</label>
                  <input
                    type="text"
                    placeholder="13 หลัก"
                    value={newCustomerIdCard}
                    onChange={(e) => setNewCustomerIdCard(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Tabs / Channels for Forwarding */}
          <div className="space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>ช่องทางการส่งต่อแผนประกัน</span>
            </h4>

            {/* Channel 1: Customer Direct Proposal Link & QR */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-blue-300 transition-colors shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-[#00509d] flex items-center justify-center">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      1. ลิงก์สำหรับลูกค้าเปิดดูและยอมรับแผน (Customer Proposal Portal)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ลูกค้าสามารถกดดูใบเสนอราคา กดยืนยัน และสแกนชำระเงินผ่านมือถือได้ทันที
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                  แนะนำ
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={proposalPortalUrl}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#00509d] hover:bg-[#003f7a] text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
                </button>
              </div>

              {/* QR Code Preview for Customer scanning directly */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        proposalPortalUrl
                      )}`}
                      alt="Customer Proposal QR"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      QR Code สำหรับให้ลูกค้าสแกนเปิดแผน
                    </div>
                    <p className="text-[11px] text-slate-500">
                      ยื่นหน้าจอให้ คุณ{targetCustomerName} ใช้กล้องมือถือสแกนเพื่ออ่านแผนทันที
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open(proposalPortalUrl, '_blank')}
                  className="text-xs font-bold text-[#00509d] hover:underline cursor-pointer flex items-center gap-1 shrink-0 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                >
                  <span>ทดลองเปิดดู</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Channel 2: LINE & SMS Messaging */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-emerald-300 transition-colors shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      2. ส่งข้อความนำเสนอผ่าน LINE Official หรือ SMS
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ข้อความสรุปสิทธิประโยชน์พร้อมส่งให้ลูกค้าทางแชต LINE
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={4}
                  value={lineShareMessage}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-sans leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCopyLineMsg}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    copiedLineMsg
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {copiedLineMsg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLineMsg ? 'คัดลอกข้อความแล้ว' : 'คัดลอกข้อความ LINE'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenLineShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#06c755] hover:bg-[#05b04c] text-white transition-all cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>แชร์เข้า LINE ทันที</span>
                </button>
              </div>
            </div>

            {/* Channel 3: บันทึกเข้าพอร์ตแผนประกันของลูกค้าทันที */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-indigo-300 transition-colors shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    3. บันทึกเข้าสู่พอร์ตแผนประกันของลูกค้า (Assign to Portfolio)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    เพิ่มแผนความคุ้มครองนี้เข้าในข้อมูลลูกค้า เพื่อใช้ติดตามและจัดทำเอกสารกรมธรรม์
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveToCustomerPortfolio}
                disabled={isSavedToPortfolio}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs ${
                  isSavedToPortfolio
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSavedToPortfolio ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>บันทึกเข้าพอร์ตแล้ว</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>บันทึกเป็นแผนของลูกค้า</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Payment option */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onProceedToPayment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToPayment(targetCustomerName, targetCustomerPhone);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>ลูกค้าพร้อมชำระเงิน → ดำเนินการชำระเงิน</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
