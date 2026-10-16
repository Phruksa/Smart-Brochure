import React, { useState } from 'react';
import {
  Home,
  Laptop,
  CheckSquare,
  Search,
  FileText,
  Briefcase,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Calculator,
  HeartHandshake,
  Plane,
} from 'lucide-react';

interface SmileSaleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

export const SmileSaleSidebar: React.FC<SmileSaleSidebarProps> = ({
  isOpen,
  onClose,
  activeMenu = 'smart-brochure',
  onSelectMenu,
}) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(true);
  const [isCodeMenuOpen, setIsCodeMenuOpen] = useState(true);

  return (
    <>
      {/* Mobile / Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#094f92] text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'lg:w-64' : 'lg:w-0 lg:overflow-hidden'}`}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#07427d]">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wide text-white flex items-center gap-1.5">
              <span>SmileSale</span>
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
            title="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-sm font-medium">
          {/* Home */}
          <button
            type="button"
            onClick={() => onSelectMenu?.('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'home'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 text-sky-200" />
            <span>Home</span>
          </button>

          {/* ติดตามสถานะ New App */}
          <button
            type="button"
            onClick={() => onSelectMenu?.('new-app')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'new-app'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4 text-sky-200" />
            <span>ติดตามสถานะ New App</span>
          </button>

          {/* ขอยกเลิกก่อน DCR */}
          <button
            type="button"
            onClick={() => onSelectMenu?.('cancel-dcr')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'cancel-dcr'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-sky-200" />
            <span>ขอยกเลิกก่อน DCR</span>
          </button>

          {/* ค้นหาข้อมูลกรมธรรม์ */}
          <button
            type="button"
            onClick={() => onSelectMenu?.('search-policy')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'search-policy'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4 text-sky-200" />
            <span>ค้นหาข้อมูลกรมธรรม์</span>
          </button>

          {/* รายงาน (Dropdown) */}
          <div>
            <button
              type="button"
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-sky-200" />
                <span>รายงาน</span>
              </div>
              {isReportsOpen ? (
                <ChevronUp className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/60" />
              )}
            </button>
            {isReportsOpen && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs text-white/70">
                <div className="py-1.5 hover:text-white cursor-pointer">รายงานยอดขาย</div>
                <div className="py-1.5 hover:text-white cursor-pointer">รายงานผลงานตัวแทน</div>
              </div>
            )}
          </div>

          {/* Smart Brochure (Active / Expanded Section) */}
          <div>
            <button
              type="button"
              onClick={() => setIsBrochureOpen(!isBrochureOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-white font-semibold bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-amber-300" />
                <span>Smart Brochure</span>
              </div>
              {isBrochureOpen ? (
                <ChevronUp className="w-4 h-4 text-white/70" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/70" />
              )}
            </button>

            {isBrochureOpen && (
              <div className="pl-6 pr-2 pt-1.5 pb-2 space-y-1">
                {/* Active Sub-item: Smart Brochure */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('smart-brochure')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                    activeMenu === 'smart-brochure'
                      ? 'bg-white/20 text-white font-bold shadow-2xs border-l-2 border-amber-400'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-sky-300" />
                  <span>Smart Brochure</span>
                </button>

                {/* จัดการเอกสาร Brochure */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('manage-docs')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-200" />
                  <span>จัดการเอกสาร Brochure</span>
                </button>

                {/* จัดการสิทธิประโยชน์ PH (ตั้งค่าความคุ้มครองแผนประกันทุกหมวด) */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('benefits-ph')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-bold transition-all ${
                    activeMenu === 'benefits-ph'
                      ? 'bg-amber-400 text-slate-900 shadow-sm'
                      : 'bg-white/10 text-amber-300 hover:bg-amber-400 hover:text-slate-900'
                  }`}
                  title="จัดการสิทธิประโยชน์ PH: ตั้งค่าความคุ้มครองแผนประกันสุขภาพและอุบัติเหตุทุกหมวด"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-300 group-hover:text-slate-900" />
                    <span>จัดการสิทธิประโยชน์ PH</span>
                  </div>
                  <span className="text-[9px] bg-amber-500/30 text-white px-1.5 py-0.5 rounded font-bold border border-amber-300/40">
                    ตั้งค่าแผน
                  </span>
                </button>

                {/* จัดการสิทธิประโยชน์ Motor */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('benefits-motor')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-sky-200" />
                  <span>จัดการสิทธิประโยชน์ Motor</span>
                </button>
              </div>
            )}
          </div>

          {/* โค๊ดเบี้ยประกัน (Life, Home, Travel) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setIsCodeMenuOpen(!isCodeMenuOpen);
                onSelectMenu?.('code-all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeMenu.startsWith('code-') || activeMenu === 'premium-code'
                  ? 'bg-amber-400 text-slate-900 font-bold shadow-sm'
                  : 'text-white/90 hover:bg-white/10 hover:text-white bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-amber-300 group-hover:text-slate-900" />
                <span className="font-bold">โค๊ดเบี้ยประกัน</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeMenu.startsWith('code-') || activeMenu === 'premium-code'
                    ? 'bg-slate-900/20 text-slate-900'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}>
                  ใหม่
                </span>
                {isCodeMenuOpen ? (
                  <ChevronUp className="w-4 h-4 opacity-75" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-75" />
                )}
              </div>
            </button>

            {isCodeMenuOpen && (
              <div className="pl-6 pr-2 pt-1.5 pb-1 space-y-1">
                {/* ประกันชีวิต */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('code-life')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                    activeMenu === 'code-life'
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-300" />
                    <span>ประกันชีวิต</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono">
                    Life
                  </span>
                </button>

                {/* ประกันบ้าน */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('code-home')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                    activeMenu === 'code-home'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-emerald-300" />
                    <span>ประกันบ้าน</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono">
                    Home
                  </span>
                </button>

                {/* ประกันเดินทาง */}
                <button
                  type="button"
                  onClick={() => onSelectMenu?.('code-travel')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                    activeMenu === 'code-travel'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-sky-300" />
                    <span>ประกันเดินทาง</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono">
                    Travel
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 text-[11px] text-white/60 bg-[#07427d]/60">
          <div className="flex items-center justify-between">
            <span>Siam Smile System</span>
            <span className="text-amber-300 font-semibold">v2.5</span>
          </div>
        </div>
      </aside>
    </>
  );
};
