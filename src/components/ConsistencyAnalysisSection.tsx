/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConsistencyComparison, UploadedDoc } from '../types';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Sparkles,
  RefreshCw,
  Info,
} from 'lucide-react';

interface Props {
  consistency: ConsistencyComparison[];
  documents: UploadedDoc[];
  onTriggerDiscrepancyDemo: () => void;
  onResetDocuments: () => void;
}

export const ConsistencyAnalysisSection: React.FC<Props> = ({
  consistency,
  documents,
  onTriggerDiscrepancyDemo,
  onResetDocuments,
}) => {
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('tenderName');

  const selectedField =
    consistency.find((c) => c.fieldKey === selectedFieldKey) || consistency[0];

  const inconsistentCount = consistency.filter((c) => c.status === 'inconsistent').length;
  const consistentCount = consistency.filter((c) => c.status === 'consistent').length;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              跨多文件核心欄位交叉核驗
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              六大關鍵法定欄位一致性矩陣
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              自動比對「標案名稱、採購案號、廠商名稱、統一編號、負責人姓名、報價金額」，若有出入即刻警示。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTriggerDiscrepancyDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors shadow-xs"
              title="模擬廠商在報價單誤植案號之不一致情況，測試檢核反應"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
              <span>注入不一致情境測試</span>
            </button>
            <button
              type="button"
              onClick={onResetDocuments}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              title="重設為一致版本"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>還原標準一致檔</span>
            </button>
          </div>
        </div>

        {/* Status Counts Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
            <span className="text-xs text-slate-500">比對欄位總數</span>
            <div className="text-lg font-bold font-mono text-slate-800">6 項關鍵指標</div>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-md border border-emerald-100">
            <span className="text-xs text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              完全相符欄位
            </span>
            <div className="text-lg font-bold font-mono text-emerald-900">
              {consistentCount} 項
            </div>
          </div>
          <div
            className={`p-3 rounded-md border ${
              inconsistentCount > 0
                ? 'bg-purple-50 border-purple-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <span
              className={`text-xs flex items-center gap-1 ${
                inconsistentCount > 0 ? 'text-purple-900 font-semibold' : 'text-slate-500'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              出入／需人工確認
            </span>
            <div
              className={`text-lg font-bold font-mono ${
                inconsistentCount > 0 ? 'text-purple-900' : 'text-slate-700'
              }`}
            >
              {inconsistentCount} 項
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 6 Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consistency.map((item) => {
          const isSelected = item.fieldKey === selectedFieldKey;
          const isError = item.status === 'inconsistent';
          return (
            <button
              key={item.fieldKey}
              type="button"
              onClick={() => setSelectedFieldKey(item.fieldKey)}
              className={`text-left p-4 rounded-lg border transition-all ${
                isSelected
                  ? 'border-slate-900 bg-white ring-1 ring-slate-900 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{item.fieldLabel}</span>
                {item.status === 'consistent' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    完全一致
                  </span>
                ) : item.status === 'inconsistent' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-900 bg-purple-50 border border-purple-300 px-2 py-0.5 rounded-sm animate-pulse">
                    <HelpCircle className="w-3 h-3 text-purple-700" />
                    需人工確認
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                    資料不足
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
                {item.summary}
              </p>

              <div className="text-[11px] text-slate-400">
                涉及文件：{item.evidence.length} 份
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Field Comparison View */}
      {selectedField && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div>
              <div className="text-xs text-slate-500 font-mono">比對標的指標</div>
              <h3 className="text-base font-bold text-slate-900">
                【{selectedField.fieldLabel}】跨文件提取值明細
              </h3>
            </div>

            <div>
              {selectedField.status === 'consistent' ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  比對相符 · 無衝突
                </span>
              ) : selectedField.status === 'inconsistent' ? (
                <span className="inline-flex items-center gap-1 text-xs text-purple-900 bg-purple-50 border border-purple-300 px-2.5 py-1 rounded-md font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-700" />
                  內容有出入 · 標示需人工確認
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  待更多文件比對
                </span>
              )}
            </div>
          </div>

          {/* Action guidance callout */}
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
            <strong>查核處置建議：</strong> {selectedField.actionRequired}
          </div>

          {/* Evidence Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold w-40">來源文件名稱</th>
                  <th className="py-2.5 px-3 font-semibold w-28">文件類別</th>
                  <th className="py-2.5 px-3 font-semibold">提取比對值</th>
                  <th className="py-2.5 px-3 font-semibold">文件原始引文依據</th>
                  <th className="py-2.5 px-3 font-semibold w-32">來源位置</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedField.evidence.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      尚未上傳包含此欄位之文件。
                    </td>
                  </tr>
                ) : (
                  selectedField.evidence.map((ev, index) => (
                    <tr key={index} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-medium text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]" title={ev.documentName}>
                          {ev.documentName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded-sm text-[11px]">
                          {ev.documentType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                        {ev.value}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 italic font-sans bg-slate-50/50">
                        "{ev.quote}"
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {ev.location}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
