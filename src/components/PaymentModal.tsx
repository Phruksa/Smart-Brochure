import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Shield,
  Home,
  Plane,
  AlertCircle,
  Copy,
  Check,
  Download,
  Share2,
  Activity,
} from 'lucide-react';
import { PlanCodeProposalData } from './ForwardCustomerModal';
import { CustomerProfile, CustomerPolicyItem } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: PlanCodeProposalData;
  customerName?: string;
  customerPhone?: string;
  onPaymentSuccess?: (issuedPolicy: CustomerPolicyItem) => void;
  onShowToast?: (msg: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  proposal,
  customerName = 'คุณลูกค้าสยามสไมล์',
  customerPhone = '081-445-6789',
  onPaymentSuccess,
  onShowToast,
}) => {
  if (!isOpen) return null;

  type PaymentMethod = 'promptpay' | 'credit' | 'mobile_banking' | 'counter';
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('promptpay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Frequency toggle if both monthly and annual amounts are available
  const hasModeOptions = Boolean(proposal.monthlyAmount && proposal.annualAmount);
  const [selectedPayFrequency, setSelectedPayFrequency] = useState<'monthly' | 'annual'>(() => {
    return proposal.premiumModeText.includes('ปี') ? 'annual' : 'monthly';
  });

  const effectivePremiumAmount = hasModeOptions
    ? selectedPayFrequency === 'annual'
      ? (proposal.annualAmount || proposal.premiumAmount)
      : (proposal.monthlyAmount || proposal.premiumAmount)
    : proposal.premiumAmount;

  const effectiveModeText = hasModeOptions
    ? selectedPayFrequency === 'annual'
      ? 'รายปี'
      : 'รายเดือน'
    : proposal.premiumModeText;

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8890');
  const [cardHolder, setCardHolder] = useState<string>(customerName);
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('•••');
  const [isInstallment, setIsInstallment] = useState<boolean>(false);
  const [installmentMonths, setInstallmentMonths] = useState<3 | 6 | 10>(10);
  const [selectedBank, setSelectedBank] = useState<string>('kbank');

  // Timer for QR Payment countdown (15 minutes = 900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(899);

  // Generated policy info after payment
  const [issuedPolicyNumber, setIssuedPolicyNumber] = useState<string>('');
  const [issuedReceiptNumber, setIssuedReceiptNumber] = useState<string>('');
  const [paymentTimestamp, setPaymentTimestamp] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      setTimeLeft(899);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPaymentLink = () => {
    const link = `${window.location.origin}?action=pay&code=${proposal.quotingCode}&plan=${proposal.planCode}`;
    navigator.clipboard.writeText(link);
    onShowToast?.(`คัดลอกลิงก์ชำระเงินสำหรับ คุณ${customerName} เรียบร้อยแล้ว สามารถส่งต่อทาง LINE หรือ SMS ได้ทันที`);
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
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
      } ${now.getFullYear() + 543} เวลา ${now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      })} น.`;

      const typePrefix =
        proposal.insuranceType === 'life'
          ? 'LIFE'
          : proposal.insuranceType === 'home'
          ? 'HOME'
          : proposal.insuranceType === 'travel'
          ? 'TRV'
          : proposal.insuranceType === 'pa'
          ? 'PA'
          : 'HLT';

      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const policyNo = `SSM-${typePrefix}-2026-${randomDigits}`;
      const receiptNo = `REC-${Math.floor(1000000 + Math.random() * 9000000)}`;

      setIssuedPolicyNumber(policyNo);
      setIssuedReceiptNumber(receiptNo);
      setPaymentTimestamp(thaiDate);
      setIsProcessing(false);
      setIsSuccess(true);

      const newPolicy: CustomerPolicyItem = {
        policyNumber: policyNo,
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
        customPlanName: `${proposal.planName} (อนุมัติคุ้มครองทันที)`,
        companyName: 'บมจ. สยามสไมล์ โบรกเกอร์ (ความคุ้มครองพร้อมมีผล)',
        startDate: thaiDate,
        annualPremium: effectivePremiumAmount,
        monthlyPremium: effectiveModeText.includes('เดือน') ? effectivePremiumAmount : Math.round(effectivePremiumAmount / 12),
        lossClaimRate: 0,
        lossClaimStatus: '0% (กรมธรรม์เริ่มใหม่)',
        notes: `ชำระเงินเรียบร้อยเมื่อ ${thaiDate} (${effectiveModeText}) ผ่าน ${
          selectedMethod === 'promptpay'
            ? 'พร้อมเพย์ QR Code'
            : selectedMethod === 'credit'
            ? `บัตรเครดิต (${isInstallment ? `ผ่อน 0% ${installmentMonths} เดือน` : 'เต็มจำนวน'})`
            : selectedMethod === 'mobile_banking'
            ? 'Mobile Banking'
            : 'เคาน์เตอร์เซอร์วิส'
        } ใบเสร็จ: ${receiptNo}`,
      };

      onPaymentSuccess?.(newPolicy);
      onShowToast?.(`ชำระเงินสำเร็จ! ออกเลขที่กรมธรรม์ ${policyNo} เรียบร้อยแล้ว`);
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const getInsuranceBadge = () => {
    switch (proposal.insuranceType) {
      case 'health':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'ประกันสุขภาพ',
          colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
        };
      case 'pa':
        return {
          icon: <Activity className="w-3.5 h-3.5" />,
          label: 'ประกันอุบัติเหตุ PA',
          colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
        };
      case 'life':
        return {
          icon: <Shield className="w-3.5 h-3.5" />,
          label: 'ประกันชีวิต',
          colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
        };
      case 'home':
        return {
          icon: <Home className="w-3.5 h-3.5" />,
          label: 'ประกันภัยบ้าน',
          colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        };
      case 'travel':
      default:
        return {
          icon: <Plane className="w-3.5 h-3.5" />,
          label: 'ประกันเดินทาง',
          colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
        };
    }
  };

  const badge = getInsuranceBadge();
  const installmentPerMonth = isInstallment
    ? Math.round(effectivePremiumAmount / installmentMonths)
    : effectivePremiumAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200 border border-white/10">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>ระบบชำระเงินค่าเบี้ยประกันภัย</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  Smile Payment
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80">
                บมจ. สยามสไมล์ โบรกเกอร์ • ชำระปลอดภัย มีผลคุ้มครองตามเงื่อนไขทันที
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Order Summary Ribbon */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.colorClass}`}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  โค๊ด: {proposal.quotingCode}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                {proposal.planName}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                ผู้เอาประกัน: <strong>{customerName}</strong> ({customerPhone})
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCopyPaymentLink}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00509d] hover:text-blue-800 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="คัดลอกลิงก์ให้ลูกค้าชำระเงินเอง"
                >
                  <Share2 className="w-3 h-3" />
                  <span>แชร์ลิงก์ให้ลูกค้าชำระ</span>
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              {hasModeOptions && (
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold mb-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPayFrequency('monthly')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      selectedPayFrequency === 'monthly'
                        ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    รายเดือน
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayFrequency('annual')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      selectedPayFrequency === 'annual'
                        ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    รายปี
                  </button>
                </div>
              )}
              <div className="text-[11px] text-slate-500 font-medium">ยอดเงินที่ต้องชำระสุทธิ</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">
                {effectivePremiumAmount.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-600">บาท</span>
              </div>
              <div className="text-[10px] text-slate-400">
                (โหมด: {effectiveModeText})
              </div>
            </div>
          </div>

          {!isSuccess ? (
            <>
              {/* Payment Method Selector Tabs */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">เลือกวิธีการชำระเงิน</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('promptpay')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'promptpay'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">พร้อมเพย์ QR</span>
                    <span className="text-[10px] text-emerald-600 font-medium">สแกนจ่ายทันที</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('credit')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'credit'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">บัตรเครดิต/เดบิต</span>
                    <span className="text-[10px] text-blue-600 font-medium">ผ่อน 0% สูงสุด 10 เดือน</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mobile_banking')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'mobile_banking'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-teal-600" />
                    <span className="text-xs">Mobile Banking</span>
                    <span className="text-[10px] text-teal-600 font-medium">เปิดแอปธนาคาร</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('counter')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'counter'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">เคาน์เตอร์ / บิล</span>
                    <span className="text-[10px] text-amber-600 font-medium">7-Eleven / Lotus</span>
                  </button>
                </div>
              </div>

              {/* METHOD 1: PromptPay QR */}
              {selectedMethod === 'promptpay' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-center">
                  <div className="max-w-xs mx-auto border-2 border-[#00509d] rounded-2xl p-4 bg-white shadow-md space-y-3">
                    <div className="bg-[#00509d] text-white py-1.5 px-3 rounded-lg flex items-center justify-between">
                      <span className="font-extrabold text-xs tracking-wider">THAI QR PAYMENT</span>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">พร้อมเพย์</span>
                    </div>

                    <div className="w-48 h-48 mx-auto bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PROMPTPAY|SIAMSMILE|${effectivePremiumAmount}|REF:${proposal.quotingCode}`}
                        alt="Thai QR PromptPay"
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      บมจ. สยามสไมล์ โบรกเกอร์ (Siam Smile)
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5 font-mono">
                      <div>Ref 1: {proposal.quotingCode.slice(0, 15)}</div>
                      <div>Ref 2: {proposal.planCode}</div>
                    </div>

                    <div className="text-base font-black text-[#00509d] font-mono border-t border-slate-200 pt-2">
                      ฿ {effectivePremiumAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* QR Expiration Timer & Simulation Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>QR Code มีอายุคงเหลือ:</span>
                      <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {formatTimer(timeLeft)} นาที
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    สามารถเปิดแอปพลิเคชันธนาคารใดก็ได้ (K PLUS, SCB EASY, Krungthai NEXT ฯลฯ) สแกนเพื่อชำระเงินได้ทันที
                  </p>

                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isProcessing}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>กำลังตรวจสอบการชำระเงิน...</span>
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>จำลองระบบ: ลูกค้าสแกนชำระสำเร็จแล้ว</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* METHOD 2: Credit Card */}
              {selectedMethod === 'credit' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">ข้อมูลบัตรเครดิต / เดบิต</label>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        <span className="text-blue-700">VISA</span> •
                        <span className="text-rose-600">MasterCard</span> •
                        <span className="text-emerald-700">JCB</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">หมายเลขบัตร 16 หลัก</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ชื่อผู้ถือบัตร</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">วันหมดอายุ (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">รหัส CVV (3 หลัก)</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Installment 0% Option */}
                  {effectivePremiumAmount >= 3000 && (
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isInstallment}
                          onChange={(e) => setIsInstallment(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                        />
                        <span className="text-xs font-bold text-slate-900">
                          เลือกผ่อนชำระ 0% ดอกเบี้ยพิเศษสยามสไมล์
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                          0% นานสูงสุด 10 เดือน
                        </span>
                      </label>

                      {isInstallment && (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          {[3, 6, 10].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setInstallmentMonths(m as 3 | 6 | 10)}
                              className={`py-2 px-1 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                                installmentMonths === m
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div>ผ่อน 0% {m} เดือน</div>
                              <div className="text-[10px] font-mono opacity-90 mt-0.5">
                                เดือนละ {Math.round(effectivePremiumAmount / m).toLocaleString()} บ.
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>กำลังยืนยันรายการกับธนาคาร...</span>
                      </span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          ชำระเงิน {effectivePremiumAmount.toLocaleString()} บาท
                          {isInstallment && ` (ผ่อน 0% ${installmentMonths} เดือน เดือนละ ${installmentPerMonth.toLocaleString()} บ.)`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* METHOD 3: Mobile Banking */}
              {selectedMethod === 'mobile_banking' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    เลือกแอปพลิเคชัน Mobile Banking เพื่อทำรายการชำระเงิน
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleExecutePayment}
                      className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
                        K+
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">K PLUS</div>
                        <div className="text-[10px] text-slate-500">ธนาคารกสิกรไทย</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExecutePayment}
                      className="p-3 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-700 text-white font-extrabold flex items-center justify-center text-xs">
                        SCB
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">SCB EASY</div>
                        <div className="text-[10px] text-slate-500">ธนาคารไทยพาณิชย์</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExecutePayment}
                      className="p-3 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-extrabold flex items-center justify-center text-xs">
                        KTB
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Krungthai NEXT</div>
                        <div className="text-[10px] text-slate-500">ธนาคารกรุงไทย</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExecutePayment}
                      className="p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-extrabold flex items-center justify-center text-xs">
                        BBL
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Bangkok Bank</div>
                        <div className="text-[10px] text-slate-500">ธนาคารกรุงเทพ</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* METHOD 4: Counter Service / Pay-in */}
              {selectedMethod === 'counter' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-center">
                  <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2 max-w-md mx-auto">
                    <div className="font-bold text-xs text-slate-800">
                      ใบแจ้งการชำระเงินค่าเบี้ยประกันภัย (Pay-in Slip)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      สามารถนำบาร์โค้ดนี้ไปชำระที่ 7-Eleven, Lotus's, Big C หรือเคาน์เตอร์ธนาคาร
                    </div>
                    {/* Simulated barcode */}
                    <div className="h-14 bg-white border border-slate-200 rounded p-2 flex items-center justify-center">
                      <div className="font-mono text-xs tracking-widest text-slate-800 font-bold">
                        ||| | |||| | ||||| || |||||| | ||| || |||||
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600">
                      Code: |010553702111100|{proposal.quotingCode.slice(0, 10)}|{effectivePremiumAmount}00
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>บันทึกการรับชำระผ่านเคาน์เตอร์เซอร์วิส</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* PAYMENT SUCCESS SCREEN / E-RECEIPT & E-POLICY */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-b from-emerald-50 via-teal-50 to-white border-2 border-emerald-400 rounded-2xl p-5 text-center space-y-3 shadow-md">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-900">
                    ชำระเงินและออกกรมธรรม์สำเร็จ!
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    ความคุ้มครองมีผลบังคับใช้ตามเงื่อนไขของสัญญาประกันภัยทันที
                  </p>
                </div>

                {/* Policy & Receipt Info Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-200 text-left space-y-2 text-xs shadow-2xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">เลขที่กรมธรรม์ (Policy No.):</span>
                    <span className="font-mono font-extrabold text-[#00509d] text-sm sm:text-base">
                      {issuedPolicyNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">เลขที่ใบเสร็จรับเงิน (Receipt No.):</span>
                    <span className="font-mono font-bold text-slate-800">{issuedReceiptNumber}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">ผู้เอาประกันภัย:</span>
                    <span className="font-bold text-slate-900">{customerName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">แผนความคุ้มครอง:</span>
                    <span className="font-bold text-slate-900">{proposal.planName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">รหัสโค๊ดเสนอขาย:</span>
                    <span className="font-mono text-slate-700">{proposal.quotingCode}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">วันที่เริ่มต้นความคุ้มครอง:</span>
                    <span className="font-medium text-slate-800">{paymentTimestamp}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-emerald-800 font-bold">
                    <span>จำนวนเงินที่ชำระ:</span>
                    <span className="font-mono text-base font-black">
                      {effectivePremiumAmount.toLocaleString()} บาท ({effectiveModeText})
                    </span>
                  </div>
                </div>

                {/* Post-Payment Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>พิมพ์ใบเสร็จรับเงิน / กรมธรรม์</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast?.(`ส่งหลักฐาน E-Policy ไปยังหมายเลข ${customerPhone} เรียบร้อยแล้ว`);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#00509d] hover:bg-[#003f7a] shadow-xs transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>ส่ง E-Receipt ทาง SMS / LINE</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>รับประกันความปลอดภัยตามมาตรฐาน SSL 256-bit</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isSuccess ? 'เสร็จสิ้น' : 'ยกเลิก'}
          </button>
        </div>
      </div>
    </div>
  );
};
