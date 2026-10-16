import React, { useState } from 'react';
import { InsurancePlan } from '../types';
import { formatCurrency } from '../data/plans';
import { Lightbulb, Check, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  selectedPlans: InsurancePlan[];
  onSelectPlan: (planId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  selectedPlans,
}) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'opd' | 'compensation' | 'life'>('budget');

  if (selectedPlans.length < 2) return null;

  return (
    <div className="no-print bg-gradient-to-br from-blue-900 via-sky-900 to-indigo-950 text-white rounded-2xl p-5 md:p-6 mb-6 shadow-md border border-blue-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
            <Lightbulb className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base md:text-lg">คำแนะนำตามความต้องการของผู้เอาประกัน</h3>
            <p className="text-xs text-sky-200">วิเคราะห์ตาม 3 แผนที่คุณกำลังเปรียบเทียบ</p>
          </div>
        </div>

        {/* Priority tabs */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'budget' ? 'bg-blue-600 text-white font-semibold' : 'text-sky-200 hover:text-white'
            }`}
          >
            เน้นประหยัด
          </button>
          <button
            onClick={() => setActiveTab('opd')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'opd' ? 'bg-blue-600 text-white font-semibold' : 'text-sky-200 hover:text-white'
            }`}
          >
            เน้น OPD
          </button>
          <button
            onClick={() => setActiveTab('compensation')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'compensation' ? 'bg-blue-600 text-white font-semibold' : 'text-sky-200 hover:text-white'
            }`}
          >
            เน้นชดเชยรายวัน
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs md:text-sm text-sky-100 leading-relaxed">
        {activeTab === 'budget' && (
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
              ฿
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">หากต้องการเบี้ยประกันประหยัดที่สุด</h4>
              <p className="text-xs text-sky-200 mt-1">
                สำหรับผู้ที่ต้องการความคุ้มครองผู้ป่วยใน (IPD) และอุบัติเหตุเสียชีวิต 200,000 บาท ในงบประมาณเริ่มต้นเบาๆ โดยไม่ต้องจ่ายส่วนเกินของ OPD
              </p>
            </div>
          </div>
        )}

        {activeTab === 'opd' && (
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 font-bold">
              OPD
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">หากเจ็บป่วยบ่อย และต้องการหาหมอแบบไม่ต้องนอน รพ.</h4>
              <p className="text-xs text-sky-200 mt-1">
                แนะนำเลือกแผนที่มีตัวย่อ <strong>-O</strong> (เช่น <strong>15-O</strong> หรือ <strong>610-O</strong>) ซึ่งมีวงเงิน OPD โรคทั่วไป 500 บาท/ครั้ง สูงสุด 9 ครั้งต่อปี คุ้มค่าสำหรับการพบแพทย์ไข้หวัดทั่วไป
              </p>
            </div>
          </div>
        )}

        {activeTab === 'compensation' && (
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold">
              +
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">หากมีสิทธิ์ประกันสังคมหรือสวัสดิการข้าราชการอยู่แล้ว</h4>
              <p className="text-xs text-sky-200 mt-1">
                แนะนำ <strong>แผน 610-O</strong> ที่ให้ค่าชดเชยการนอนโรงพยาบาลปกติสูงถึง <strong>1,200 บ./คืน</strong> และกรณีใช้สิทธิ์อื่นเบิกค่ารักษา จะได้รับเงินชดเชยสูงถึง <strong>3,000 บ./คืน</strong> ในเบี้ยเพียง 790 บ./เดือน
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
