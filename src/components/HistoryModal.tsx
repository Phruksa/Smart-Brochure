import React, { useState, useMemo } from 'react';
import { ComparisonHistoryItem } from '../types';
import {
  History,
  X,
  Search,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Trash2,
  User,
  Building2,
  Calendar,
  Layers,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: ComparisonHistoryItem[];
  onToggleMark: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (item: ComparisonHistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
  onToggleMark,
  onDelete,
  onRestore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'marked'>('all');

  // Filter history records specifically focusing on Customer Name as requested
  const filteredList = useMemo(() => {
    let result = historyList;

    if (activeTab === 'marked') {
      result = result.filter((item) => item.isMarked);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((item) => {
        const custName = (item.customerName || 'ลูกค้าทั่วไป ไม่ระบุชื่อ').toLowerCase();
        return custName.includes(q);
      });
    }

    return result;
  }, [historyList, activeTab, searchTerm]);

  const markedCount = useMemo(() => {
    return historyList.filter((item) => item.isMarked).length;
  }, [historyList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 md:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 rounded-lg text-white">
              <History className="w-5 h-5 text-sky-400" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base md:text-lg">ประวัติ Smart Brochure</h3>
                <span className="text-[10px] font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  ☁️ Firebase: Smart Brochure
                </span>
              </div>
              <p className="text-xs text-slate-300">
                ข้อมูลบันทึกและซิงค์ผ่านคอลเลกชัน smart_brochures บน Firebase Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          {/* Customer Name Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาเฉพาะชื่อลูกค้า เช่น สมชาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด ({historyList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('marked')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'marked'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>มาร์กไว้เพื่อนำส่ง ({markedCount})</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              พบ {filteredList.length} รายการ
            </span>
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredList.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-medium text-slate-600">ไม่พบประวัติการบันทึก</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {searchTerm
                  ? `ไม่พบประวัติที่มีชื่อลูกค้าตรงกับ "${searchTerm}"`
                  : 'ยังไม่มีประวัติการบันทึกแผนหรือการส่งออกเอกสาร'}
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const hasCustomerName = Boolean(item.customerName && item.customerName.trim());
              const displayCustomerName = hasCustomerName
                ? item.customerName
                : 'ลูกค้าทั่วไป (ไม่ระบุชื่อ)';

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition-all ${
                    item.isMarked
                      ? 'border-blue-300 bg-blue-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar: Customer Name & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          hasCustomerName
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {displayCustomerName}
                          </h4>
                          {item.userAge && (
                            <span className="px-1.5 py-0.2 rounded text-[10.5px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              อายุ {item.userAge} ปี
                            </span>
                          )}
                          {item.payerType && (
                            <span className="px-1.5 py-0.2 rounded text-[10.5px] font-medium bg-sky-50 text-[#00509d] border border-sky-200">
                              {item.payerType === 'private'
                                ? 'หน่วยงานเอกชน'
                                : item.payerType === 'government'
                                ? 'ข้าราชการ/รัฐวิสาหกิจ'
                                : 'ทั่วไป'}
                            </span>
                          )}
                          {item.isMarked && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Bookmark className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                              มาร์กไว้
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {item.formattedDate}
                          <span className="text-slate-300">•</span>
                          <span className="text-[#0088cc] font-medium">Smart Brochure (Firebase)</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {/* Mark / Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => onToggleMark(item.id)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-1 ${
                          item.isMarked
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600 hover:border-amber-200'
                        }`}
                        title={item.isMarked ? 'ยกเลิกการมาร์ก' : 'มาร์กไว้เพื่อนำส่งหรือเปิดดูอีกรอบ'}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${item.isMarked ? 'fill-amber-500 text-amber-500' : ''}`}
                        />
                        <span className="text-[11px] font-medium hidden md:inline">
                          {item.isMarked ? 'มาร์กแล้ว' : 'มาร์กไว้'}
                        </span>
                      </button>

                      {/* Restore / Load Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onRestore(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="เปิดชุดเปรียบเทียบนี้เพื่อดูข้อมูลหรือนำส่งอีกรอบ"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>เปิดดูอีกรอบ</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Compared Plans */}
                  <div className="mt-2.5 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>แผนที่เปรียบเทียบ ({item.selectedPlanIds.length} แผน):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.selectedPlanNames.map((pName, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/80"
                        >
                          {pName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Agent Details & Notes */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        ผู้แทน: {item.agentFirstName} {item.agentLastName}
                      </span>
                      {item.agentOfficeCode && (
                        <span className="text-[11px] text-slate-400">
                          (สนง. {item.agentOfficeCode})
                        </span>
                      )}
                      {item.agentPhone && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          {item.agentPhone}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <span className="text-[11px] text-slate-500 italic truncate max-w-xs">
                        &quot;{item.notes}&quot;
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>รวมทั้งหมด {historyList.length} รายการที่บันทึกไว้ในระบบ</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
