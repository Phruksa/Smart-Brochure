import React from 'react';
import { InsurancePlan, CustomerProfile } from '../types';
import { formatCurrency, analyzeDifferences } from '../data/plans';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Zap, Shield, HeartPulse, DollarSign, UserCheck, TrendingUp } from 'lucide-react';

interface DifferencesSummaryProps {
  selectedPlans: InsurancePlan[];
  existingCustomer?: CustomerProfile | null;
}

export const DifferencesSummary: React.FC<DifferencesSummaryProps> = ({ selectedPlans, existingCustomer = null }) => {
  if (selectedPlans.length < 2) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 mb-6">
        <p className="text-sm">กรุณาเลือกอย่างน้อย 2 แผนเพื่อดูบทสรุปความแตกต่าง</p>
      </div>
    );
  }

  const allDiffRows = analyzeDifferences(selectedPlans);
  const differentRows = allDiffRows.filter((r) => r.isDifferent);

  // Existing customer plan identification
  const existingPlan = existingCustomer
    ? selectedPlans.find((p) => p.id === existingCustomer.existingPlanId)
    : null;

  // Calculate monthly premium diff
  const minMonthly = Math.min(...selectedPlans.map((p) => p.monthlyPremium));
  const maxMonthly = Math.max(...selectedPlans.map((p) => p.monthlyPremium));
  const monthlyDiff = maxMonthly - minMonthly;

  // OPD Comparison insight
  const opdCoveredPlans = selectedPlans.filter((p) => p.opd.illness.covered);
  const noOpdPlans = selectedPlans.filter((p) => !p.opd.illness.covered);

  // Compensation Comparison insight
  const highCompPlans = selectedPlans.filter((p) => p.dailyCompensation.perNight >= 1000);

  // Life Coverage insight
  const highLifePlans = selectedPlans.filter((p) => p.life.accidentGeneral >= 100000);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-6">
      {/* Existing customer upgrade / comparison callout - Clean & Semi-Formal */}
      {existingCustomer && existingPlan && (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>เปรียบเทียบเพิ่มความคุ้มครองจากแผนเดิม ({existingPlan.name})</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px]">
                <span className="text-slate-400 mr-1">Loss Claim:</span>
                <strong className="text-slate-900 font-semibold">{existingCustomer.lossClaimStatus}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px]">
                <span className="text-slate-400 mr-1">LINE OA:</span>
                <strong className={`font-semibold ${existingCustomer.lineOaRegistered ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {existingCustomer.lineOaStatusText}
                </strong>
              </span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs pt-2">
            คุณ <strong>{existingCustomer.fullName}</strong> (กรมธรรม์ {existingCustomer.policyNumber}) ปัจจุบันชำระเบี้ยแผนเดิม ฿{formatCurrency(existingPlan.annualPremium)}/ปี (฿{formatCurrency(existingPlan.monthlyPremium)}/เดือน)
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Zap className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              สรุปจุดแตกต่างสำคัญ ({differentRows.length} รายการที่ต่างกัน)
            </h2>
            <p className="text-sm text-slate-500">
              เปรียบเทียบจุดเด่นและความคุ้มครองที่แตกต่างระหว่าง {selectedPlans.map((p) => p.name).join(', ')}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">ส่วนต่างเบี้ยสูงสุด</span>
          <span className="text-sm font-bold text-slate-700">
            ฿{formatCurrency(monthlyDiff)} / เดือน (฿{formatCurrency(monthlyDiff * 12)} / ปี)
          </span>
        </div>
      </div>

      {/* 4 Key Pillar Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* 1. OPD Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-2">
            <HeartPulse className="w-4 h-4" />
            <span>OPD โรคทั่วไป</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {selectedPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{plan.name}:</span>
                {plan.opd.illness.covered ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 500 บ. (9 ครั้ง/ปี)
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> ไม่คุ้มครอง
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/80">
            {opdCoveredPlans.length > 0 && noOpdPlans.length > 0
              ? `มีเฉพาะ ${opdCoveredPlans.map((p) => p.code).join(', ')} ที่มีวงเงิน OPD โรคทั่วไป`
              : 'ทั้งหมดยังคงมีวงเงิน OPD อุบัติเหตุ 2,000 บ. ทุกแผน'}
          </p>
        </div>

        {/* 2. Compensation Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            <span>ค่าชดเชยรายวัน</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {selectedPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{plan.name}:</span>
                <span className={`font-semibold px-1.5 py-0.5 rounded ${
                  plan.dailyCompensation.perNight >= 1000
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-slate-700'
                }`}>
                  ฿{formatCurrency(plan.dailyCompensation.perNight)}/คืน
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/80">
            {highCompPlans.length > 0
              ? `${highCompPlans.map((p) => p.code).join(', ')} ชดเชยสูงสุด 1,200 บ./คืน (ใช้สิทธิ์อื่นได้ถึง 3,000 บ.)`
              : 'อัตราชดเชยมาตรฐาน 300 บ./คืน'}
          </p>
        </div>

        {/* 3. Life & Accident Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-2">
            <Shield className="w-4 h-4" />
            <span>ความคุ้มครองชีวิต</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {selectedPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{plan.name}:</span>
                <span className={`font-semibold px-1.5 py-0.5 rounded ${
                  plan.life.accidentGeneral >= 100000
                    ? 'text-emerald-800 bg-emerald-50'
                    : 'text-slate-600 bg-slate-100'
                }`}>
                  ฿{formatCurrency(plan.life.accidentGeneral)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/80">
            {highLifePlans.length > 0 && selectedPlans.some((p) => p.life.accidentGeneral < 100000)
              ? `ความคุ้มครองชีวิตต่างกันอย่างมีนัยสำคัญ (200,000 บ. vs 3,000 บ.)`
              : 'วงเงินคุ้มครองชีวิตอยู่ในเกณฑ์ระดับเดียวกัน'}
          </p>
        </div>

        {/* 4. Monthly Premium Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-sky-800 font-semibold text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            <span>เบี้ยประกันภัย</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {selectedPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{plan.name}:</span>
                <span className="font-bold text-blue-900">
                  ฿{formatCurrency(plan.monthlyPremium)}/เดือน
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/80">
            ประหยัดสุด: {selectedPlans.reduce((min, p) => p.monthlyPremium < min.monthlyPremium ? p : min, selectedPlans[0]).name}
          </p>
        </div>
      </div>

      {/* Summary table of difference rows */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ตารางสรุปเฉพาะหัวข้อที่มีความแตกต่าง ({differentRows.length} รายการ)
          </span>
          <span className="text-[11px] text-slate-500">
            เปรียบเทียบ {selectedPlans.length} แผน
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold text-slate-700 w-1/3">รายการความคุ้มครอง</th>
                {selectedPlans.map((plan) => (
                  <th key={plan.id} className="py-2.5 px-4 font-bold text-slate-800 text-center border-l border-slate-200">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {differentRows.map((row) => (
                <tr key={row.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-2.5 px-4 text-slate-800">
                    <div className="font-medium text-slate-900">{row.title}</div>
                    {row.subTitle && (
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.subTitle}</div>
                    )}
                  </td>
                  {selectedPlans.map((plan) => {
                    const val = row.values[plan.id];
                    const isPositiveCover = val.includes('500') || val.includes('1,200') || val.includes('200,000') || val.includes('3,000 บ.');
                    const isNotCovered = val.includes('ไม่คุ้มครอง');
                    return (
                      <td
                        key={plan.id}
                        className="py-2.5 px-4 text-center font-medium border-l border-slate-200"
                      >
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          isNotCovered
                            ? 'text-rose-600 bg-rose-50'
                            : isPositiveCover
                            ? 'text-blue-900 font-bold bg-blue-50/80'
                            : 'text-slate-700'
                        }`}>
                          {val}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
