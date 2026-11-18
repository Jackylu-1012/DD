/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileText,
  Settings,
  UploadCloud,
  CheckSquare,
  GitCompare,
  AlertTriangle,
  FileCheck2,
  RotateCcw,
  Sparkles,
  Printer,
  Download,
} from 'lucide-react';

export type ActiveTab =
  | 'case'
  | 'rules'
  | 'upload'
  | 'results'
  | 'consistency'
  | 'exceptions'
  | 'report';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLoadSample: () => void;
  onResetBlank: () => void;
  onPrint: () => void;
  onExportMarkdown: () => void;
  documentCount: number;
  resultCount: number;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onLoadSample,
  onResetBlank,
  onPrint,
  onExportMarkdown,
  documentCount,
  resultCount,
}) => {
  const tabs = [
    { id: 'case' as ActiveTab, label: '案件資料', icon: FileText },
    { id: 'rules' as ActiveTab, label: '檢核欄位設定', icon: Settings },
    {
      id: 'upload' as ActiveTab,
      label: `文件上傳與預覽 (${documentCount})`,
      icon: UploadCloud,
    },
    {
      id: 'results' as ActiveTab,
      label: `檢核結果表 (${resultCount})`,
      icon: CheckSquare,
    },
    { id: 'consistency' as ActiveTab, label: '跨文件一致性', icon: GitCompare },
    { id: 'exceptions' as ActiveTab, label: '缺漏與需確認', icon: AlertTriangle },
    { id: 'report' as ActiveTab, label: '完整檢核報告', icon: FileCheck2 },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs print:hidden">
      {/* Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Single line wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
              CBC
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                投標文件完整性與初步符合性檢核系統
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
                行政輔助審查 · 嚴格客觀檢核標準
              </span>
            </div>
          </div>

          {/* Zone 3: Global Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="載入中央銀行磁帶採購案完整示範文件集"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>載入央行範例</span>
            </button>

            <button
              onClick={onResetBlank}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap"
              title="清除所有文件回到初始空白"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">重設空白</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden md:block" />

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap hidden md:inline-flex"
              title="A4 友善格式列印報告"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>列印報告</span>
            </button>

            <button
              onClick={onExportMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs whitespace-nowrap"
              title="匯出完整 Markdown 審查報告"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出 .md 報告</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
