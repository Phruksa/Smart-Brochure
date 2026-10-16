import React from 'react';
import { InsurancePlan, CustomerProfile } from '../types';
import { formatCurrency } from '../data/plans';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface PremiumComparisonChartProps {
  selectedPlans: InsurancePlan[];
  existingCustomer?: CustomerProfile | null;
}

export const PremiumComparisonChart: React.FC<PremiumComparisonChartProps> = ({
  selectedPlans,
  existingCustomer = null,
}) => {
  if (selectedPlans.length === 0) {
    return null;
  }

  // Transform data for recharts
  const data = selectedPlans.map((plan) => {
    const isExisting = existingCustomer?.existingPlanId === plan.id;
    return {
      id: plan.id,
      code: plan.code,
      name: plan.name,
      annualPremium: plan.annualPremium,
      monthlyPremium: plan.monthlyPremium,
      isExisting,
      fillColor: isExisting ? '#059669' : '#2563eb', // Emerald for existing plan, Blue for new plans
    };
  });

  const premiums = selectedPlans.map((p) => p.annualPremium);
  const minAnnual = Math.min(...premiums);
  const maxAnnual = Math.max(...premiums);
  const annualDiff = maxAnnual - minAnnual;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-6">
      {/* Semi-formal Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              เปรียบเทียบเบี้ยประกันภัยรายปี
            </h3>
            <p className="text-xs text-slate-500">
              ภาพรวมเปรียบเทียบเบี้ยรายปีของแผนที่เลือก ({selectedPlans.length} แผน)
            </p>
          </div>
        </div>

        {/* Legend / Status indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          {existingCustomer && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="font-medium text-slate-700">แผนเดิมของลูกค้า</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="font-medium text-slate-700">
              {existingCustomer ? 'แผนเสนอเพิ่ม' : 'เบี้ยรายปี (บาท)'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="pt-4">
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 25, right: 20, left: 10, bottom: 20 }}
              barSize={selectedPlans.length === 1 ? 70 : selectedPlans.length === 2 ? 60 : 50}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val: number) => `฿${(val / 1000).toFixed(0)}k`}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.25)]}
              />
              <Tooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1 border border-slate-700 min-w-44">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 font-bold text-sm">
                          <span>{item.name}</span>
                          {item.isExisting && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-[10px] font-medium text-emerald-100">
                              แผนเดิม
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between pt-1 text-slate-300">
                          <span>เบี้ยรายปี:</span>
                          <span className="font-bold text-white text-sm">
                            ฿{formatCurrency(item.annualPremium)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300 text-[11px]">
                          <span>เฉลี่ยรายเดือน:</span>
                          <span className="font-semibold text-slate-200">
                            ฿{formatCurrency(item.monthlyPremium)}/เดือน
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="annualPremium" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.fillColor} />
                ))}
                <LabelList
                  dataKey="annualPremium"
                  position="top"
                  formatter={(val: unknown) => {
                    const num = typeof val === 'number' ? val : Number(val) || 0;
                    return `฿${formatCurrency(num)}`;
                  }}
                  style={{ fill: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clean, semi-formal summary strip */}
        <div className="mt-2 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 block text-[11px]">เบี้ยเริ่มต้น</span>
            <span className="font-bold text-slate-800 text-sm">฿{formatCurrency(minAnnual)}</span>
            <span className="text-[10px] text-slate-400 ml-1">/ปี</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 block text-[11px]">เบี้ยสูงสุด</span>
            <span className="font-bold text-slate-800 text-sm">฿{formatCurrency(maxAnnual)}</span>
            <span className="text-[10px] text-slate-400 ml-1">/ปี</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px]">ส่วนต่างสูงสุด</span>
            <span className="font-bold text-blue-700 text-sm">฿{formatCurrency(annualDiff)}</span>
            <span className="text-[10px] text-slate-400 ml-1">
              /ปี ({annualDiff > 0 ? `+฿${formatCurrency(Math.round(annualDiff / 12))}/เดือน` : 'เท่ากัน'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
