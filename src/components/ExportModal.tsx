import React, { useState } from 'react';
import { ExportMeta, InsurancePlan, CustomerProfile } from '../types';
import { exportToPdf, triggerPrint } from '../utils/pdfExport';
import { saveAgentProfile } from '../utils/historyStorage';
import {
  FileDown,
  Printer,
  X,
  Check,
  Loader2,
  User,
  Phone,
  Calendar,
  MessageSquare,
  AlertCircle,
  Building2,
  BookmarkPlus,
  Eye,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlans: InsurancePlan[];
  exportMeta: ExportMeta;
  onUpdateMeta: (meta: ExportMeta) => void;
  onSaveToHistory?: () => void;
  onOpenPreview?: () => void;
  existingCustomer?: CustomerProfile | null;
  userAge?: number | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  selectedPlans,
  exportMeta,
  onUpdateMeta,
  onSaveToHistory,
  onOpenPreview,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [historySavedSuccess, setHistorySavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const persistAgentData = () => {
    saveAgentProfile({
      agentFirstName: exportMeta.agentFirstName,
      agentLastName: exportMeta.agentLastName,
      agentOfficeCode: exportMeta.agentOfficeCode,
      agentPhone: exportMeta.agentPhone,
    });
  };

  const handleDownloadPdf = async () => {
    persistAgentData();
    setIsExporting(true);
    setErrorMsg(null);
    setExportSuccess(false);

    // Also auto-save to history on export
    if (onSaveToHistory) {
      onSaveToHistory();
    }

    try {
      const planNames = selectedPlans.map((p) => p.code).join('-');
      const clientPart = exportMeta.customerName ? `_${exportMeta.customerName}` : '';
      const fileName = `เปรียบเทียบแผนประกันภัย${clientPart}_${planNames}_${new Date().toISOString().slice(0, 10)}.pdf`;
      const success = await exportToPdf('comparison-report-element', fileName);

      if (success) {
        setExportSuccess(true);
        setTimeout(() => {
          setExportSuccess(false);
        }, 3500);
      } else {
        setErrorMsg('ไม่สามารถสร้างไฟล์ PDF ได้ กรุณาลองใช้วิธีสั่งพิมพ์ทางบราวเซอร์แทน');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการประมวลผล PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    persistAgentData();
    if (onSaveToHistory) {
      onSaveToHistory();
    }
    onClose();
    setTimeout(() => {
      triggerPrint();
    }, 200);
  };

  const handleManualSaveHistory = () => {
    persistAgentData();
    if (onSaveToHistory) {
      onSaveToHistory();
      setHistorySavedSuccess(true);
      setTimeout(() => {
        setHistorySavedSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-800 to-blue-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 rounded-lg text-white">
              <FileDown className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base md:text-lg">ส่งออกเอกสารและบันทึกประวัติ</h3>
              <p className="text-xs text-sky-200">เปรียบเทียบ {selectedPlans.length} แผนที่เลือก</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Customer Section */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                ชื่อผู้ถูกนำเสนอแผน (ลูกค้า)
              </label>
              <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                ระบุหรือไม่ระบุก็ได้
              </span>
            </div>
            <input
              type="text"
              placeholder="เช่น คุณสมชาย มีสุข (เว้นว่างได้หากไม่ต้องการระบุ)"
              value={exportMeta.customerName}
              onChange={(e) => onUpdateMeta({ ...exportMeta, customerName: e.target.value })}
              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              หากไม่ระบุ ระบบจะบันทึกและแสดงในเอกสารเป็น &quot;ลูกค้าทั่วไป (ไม่ระบุชื่อ)&quot;
            </p>
          </div>

          {/* Agent Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-600" />
                ข้อมูลผู้แทน / ผู้ให้คำปรึกษา
              </span>
              <span className="text-[10px] text-slate-500">บันทึกอัตโนมัติสำหรับรอบถัดไป</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อผู้แทน</label>
                <input
                  type="text"
                  placeholder="เช่น กิตติศักดิ์"
                  value={exportMeta.agentFirstName}
                  onChange={(e) => onUpdateMeta({ ...exportMeta, agentFirstName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">นามสกุลผู้แทน</label>
                <input
                  type="text"
                  placeholder="เช่น มั่นคงเจริญ"
                  value={exportMeta.agentLastName}
                  onChange={(e) => onUpdateMeta({ ...exportMeta, agentLastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">รหัสสำนักงาน</label>
                <input
                  type="text"
                  placeholder="เช่น BKK-088"
                  value={exportMeta.agentOfficeCode}
                  onChange={(e) => onUpdateMeta({ ...exportMeta, agentOfficeCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  เบอร์ติดต่อผู้แทน
                </label>
                <input
                  type="text"
                  placeholder="เช่น 089-123-4567"
                  value={exportMeta.agentPhone}
                  onChange={(e) => onUpdateMeta({ ...exportMeta, agentPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Coordinator Section */}
          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-700" />
                ผู้ประสานงานโครงการ (สำหรับระบุในเงื่อนไขการใช้สิทธิ์)
              </label>
              <span className="text-[10px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-medium">
                สยามสไมล์
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล ผู้ประสานงานโครงการ"
                  value={exportMeta.coordinatorName || ''}
                  onChange={(e) => onUpdateMeta({ ...exportMeta, coordinatorName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="เบอร์โทรศัพท์ผู้ประสานงาน"
                  value={exportMeta.coordinatorPhone || ''}
                  onChange={(e) => onUpdateMeta({ ...exportMeta, coordinatorPhone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-xs"
                />
              </div>
            </div>
            <div className="text-[10px] text-indigo-900 bg-indigo-100/60 p-2 rounded-lg flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
              <span>
                เอกสารที่ส่งออกจะแนบ <strong>&quot;เงื่อนไขและข้อยกเว้น ในการใช้สิทธิ์&quot;</strong> ครบ 7 ข้อ พร้อม QR Code และเบอร์ติดต่อ 1434 ทุกครั้ง
              </span>
            </div>
          </div>

          {/* Date and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="sm:col-span-1">
              <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                วันที่จัดทำ
              </label>
              <input
                type="text"
                value={exportMeta.date}
                onChange={(e) => onUpdateMeta({ ...exportMeta, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-slate-400" />
                หมายเหตุ / สรุปคำแนะนำ
              </label>
              <input
                type="text"
                placeholder="เช่น แนะนำสำหรับผู้ที่ต้องการเพิ่มสิทธิค่าห้องและชดเชยรายวัน"
                value={exportMeta.notes}
                onChange={(e) => onUpdateMeta({ ...exportMeta, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {historySavedSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>บันทึก Smart Brochure ลง Firebase เรียบร้อยแล้ว ☁️</span>
            </div>
          )}

          {exportSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>ดาวน์โหลดไฟล์ PDF พร้อมบันทึกประวัติเรียบร้อยแล้ว!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenPreview && (
              <button
                type="button"
                onClick={() => {
                  persistAgentData();
                  onClose();
                  onOpenPreview();
                }}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="ดูตัวอย่างเอกสารข้อเสนอแผนประกันก่อนกดส่งหรือพิมพ์"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>พรีวิวแผนก่อนพิมพ์/ส่ง</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleManualSaveHistory}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-[#00509d] text-xs font-bold hover:bg-sky-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="บันทึกข้อมูล Smart Brochure ลงใน Firebase Firestore"
            >
              <BookmarkPlus className="w-4 h-4 text-[#0088cc]" />
              <span>บันทึก Smart Brochure (Firebase)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังสร้าง...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>ส่งออก PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
