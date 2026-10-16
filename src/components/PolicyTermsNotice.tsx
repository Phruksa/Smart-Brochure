import React from 'react';

interface PolicyTermsNoticeProps {
  coordinatorName?: string;
  coordinatorPhone?: string;
  className?: string;
}

export const PolicyTermsNotice: React.FC<PolicyTermsNoticeProps> = ({
  coordinatorName = '',
  coordinatorPhone = '',
  className = '',
}) => {
  return (
    <div
      className={`border-2 border-[#5c6ac4] sm:border-[#4338ca] rounded-2xl bg-white p-3.5 sm:p-5 shadow-xs ${className}`}
      id="policy-terms-notice-card"
    >
      <div className="space-y-2.5">
        {/* Header */}
        <div className="border-b border-indigo-100 pb-2">
          <h4 className="text-base sm:text-lg font-black text-[#003e7a] tracking-tight flex items-center gap-1.5">
            <span>เงื่อนไขและข้อยกเว้น ในการใช้สิทธิ์</span>
          </h4>
        </div>

        {/* 7 Standard Clauses */}
        <ol className="text-[11px] sm:text-xs text-slate-800 space-y-1.5 leading-relaxed font-normal">
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">1.</span>
            <span>
              ลูกค้าต้องเปิดเผยข้อมูลสุขภาพตามความเป็นจริง ให้ครบถ้วน และชัดเจน หากปกปิดประวัติสุขภาพ บริษัทมีสิทธิ์ปฏิเสธ การจ่ายสินไหมได้ตามกฎหมาย
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">2.</span>
            <span>
              กรมธรรม์ จะไม่คุ้มครอง โรคที่เป็นมาก่อนการทำประกันภัย
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">3.</span>
            <span>
              โรคเอดส์ หรือโรคที่เป็นผลสืบเนื่องมาจากโรคเอดส์ ทั้งก่อนและหลังการทำประกันภัย ไม่คุ้มครอง
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">4.</span>
            <span>
              การตรวจสุขภาพประจำปี การคลอดบุตร การแท้งบุตร ศัลยกรรมตกแต่ง โรคพิษสุรา การติดยาเสพติด โรคเครียด ไมเกรน โรคทางจิตประสาท โรคเกี่ยวกับฟัน ไม่คุ้มครอง
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">5.</span>
            <span>
              ตั้งแต่วันที่เริ่มความคุ้มครอง ในช่วง 30 วันแรก กรมธรรม์ไม่คุ้มครอง การเจ็บป่วยด้วยโรคทั่วไป
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">6.</span>
            <span>
              ตั้งแต่วันที่เริ่มความคุ้มครอง ในช่วง 120 วันแรก กรมธรรม์ไม่คุ้มครอง โรคดังต่อไปนี้ โรคมะเร็ง โรคภายในสตรี โรคกระเพาะอาหารอักเสบ โรคที่เกี่ยวกับต่อมทอนซิล ต่อมไทรอยด์ เส้นเลือดขอด นิ่วทุกชนิด ไส้เลื่อน ริดสีดวงทวาร ต่อมอะดีนอยด์ ต้อทุกชนิด ถุงน้ำและเนื้องอกทุกชนิด
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className="font-bold text-slate-900 shrink-0">7.</span>
            <span>
              รายละเอียดเงื่อนไขความคุ้มครองและข้อยกเว้นทั่วไป ตามเงื่อนไขของกรมธรรม์
            </span>
          </li>
        </ol>

        {/* Project Coordinator */}
        <div className="pt-2 border-t border-slate-200/80 text-[11px] sm:text-xs text-slate-900 font-semibold space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-slate-900">
              ผู้ประสานงานโครงการ ชื่อ-นามสกุล
            </span>
            <span className="text-blue-900 font-bold border-b border-dotted border-slate-400 px-1 min-w-[180px]">
              {coordinatorName || '.......................................................................................'}
            </span>
            <span className="text-slate-900">
              โทรศัพท์
            </span>
            <span className="text-blue-900 font-bold border-b border-dotted border-slate-400 px-1 min-w-[110px]">
              {coordinatorPhone || '.....................................'}
            </span>
          </div>

          {/* Management & Underwriters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[10px] sm:text-[11px] text-slate-700 font-medium">
            <div>
              ผู้บริหาร/ผู้จัดการโครงการ : <strong className="text-slate-900 font-bold">บริษัท สยามสไมล์โบรกเกอร์ (ประเทศไทย) จำกัด</strong>
            </div>
            <div className="text-slate-800">
              ใบอนุญาตเลขที่ <strong className="font-bold text-slate-900">ว00017/2553</strong>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-slate-700 font-medium leading-tight">
            บริษัทผู้รับประกันภัย : บริษัท บางกอกสหประกันภัย จำกัด (มหาชน), บริษัท แปซิฟิค ครอส ประกันสุขภาพ จำกัด (มหาชน), บริษัท เออร์โกประกันภัย (ประเทศไทย) จำกัด (มหาชน)
          </div>
        </div>
      </div>

      {/* Red Warning Banner (exact wording from image) */}
      <div className="mt-3 pt-2 border-t border-red-200 text-[10px] sm:text-[11px] text-red-600 font-bold leading-snug">
        คำเตือน ขอให้ผู้เอาประกันภัยศึกษา และทำความเข้าใจเงื่อนไขความคุ้มครองและข้อยกเว้นกรมธรรม์ประกันภัย ก่อนตัดสินใจทำประกันภัยทุกครั้ง หากมีปัญหาหรือข้อขัดข้องใดๆ เกี่ยวกับการประกันวินาศภัย กรุณาติดต่อ 1434
      </div>
    </div>
  );
};
