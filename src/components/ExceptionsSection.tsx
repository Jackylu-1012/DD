/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckResultRecord, ConsistencyComparison } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  AlertTriangle,
  HelpCircle,
  MinusCircle,
  FileText,
  ShieldAlert,
  GitCommit,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  results: CheckResultRecord[];
  consistency: ConsistencyComparison[];
  onViewDocQuote: (docName: string) => void;
}

export const ExceptionsSection: React.FC<Props> = ({
  results,
  consistency,
  onViewDocQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'missing' | 'version'>('manual');

  const manualReviewItems = results.filter((r) => r.status === 'manual_review');
  const missingItems = results.filter((r) => r.status === 'not_found');
  const inconsistentItems = consistency.filter((c) => c.status === 'inconsistent');

  // Simulated version differences for demonstration
  const versionDiffs = [
    {
      id: 'diff_1',
      changeType: 'modified',
      documentName: '03_投標廠商聲明書.md',
      field: '第8項 公職人員利益衝突',
      oldValue: '勾選【否】（免附表）',
      newValue: '勾選【是】（需另附事前揭露表A）',
      impact: '條件規則觸發：連帶必須核檢事前揭露表A。',
    },
    {
      id: 'diff_2',
      changeType: 'value_changed',
      documentName: '02_報價單.md',
      field: '企業級磁帶庫維護服務複價',
      oldValue: 'NT$ 7,400,000',
      newValue: 'NT$ 7,443,810',
      impact: '總標價含稅調整為 NT$ 17,980,000 元整。',
    },
    {
      id: 'diff_3',
      changeType: 'added',
      documentName: '07_公職人員利益衝突事前揭露表_表A.md',
      field: '新增附隨文件',
      oldValue: '無此檔案',
      newValue: '隨投標文件附送表A',
      impact: '補齊第8項之法定身分關係揭露。',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              疑義排除與公務查核焦點
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              缺漏項目與需人工確認清單
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              集中列管「需人工確認」（{manualReviewItems.length} 項）與「未找到」（
              {missingItems.length} 項），以利開標現場主持人與承辦人重點檢視。
            </p>
          </div>

          <div className="flex items-center bg-slate-100 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                activeTab === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              需人工確認 ({manualReviewItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('missing')}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                activeTab === 'missing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              缺漏未找到 ({missingItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('version')}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                activeTab === 'version'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              版本變更分析 ({versionDiffs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <strong>開標審查核心原則：</strong>
          「不得自行將『未找到』直接判斷成『不合格』。」本系統僅輔助指出文件檢索現況，承辦人應於現場查證是否為漏附、誤置於其他封套，或屬免附條件，並由機關主官核定。
        </div>
      </div>

      {/* 1. 需人工確認項目區 */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          {manualReviewItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-xs">
              目前無標示為「需人工確認」之欄位。
            </div>
          ) : (
            manualReviewItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-purple-200 rounded-lg p-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-700 shrink-0" />
                    <span className="font-bold text-sm text-slate-900">{item.itemName}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                      {item.categoryName}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      來源：{item.documentName}
                    </span>
                  </div>
                  <StatusBadge status="manual_review" size="sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">文件辨識現況：</span>
                    <div className="text-slate-800 font-mono mt-0.5 bg-slate-50 p-2 rounded-sm border border-slate-100">
                      {item.extractedValue}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700">人工確認核心疑義：</span>
                    <div className="text-purple-900 mt-0.5 bg-purple-50/60 p-2 rounded-sm border border-purple-100">
                      {item.note}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>原文出處：{item.sourceLocation} · "{item.sourceQuote}"</span>
                  <button
                    type="button"
                    onClick={() => onViewDocQuote(item.documentName)}
                    className="text-slate-700 hover:text-slate-900 underline font-medium"
                  >
                    前往查看文件原文 →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. 缺漏項目區 */}
      {activeTab === 'missing' && (
        <div className="space-y-4">
          {missingItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              所有必要項目目前均已找到對應文件記錄，無缺漏項目。
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">缺漏檢核項目</th>
                    <th className="py-2.5 px-3 font-semibold">應具備文件類別</th>
                    <th className="py-2.5 px-3 font-semibold">目前檢索狀態</th>
                    <th className="py-2.5 px-3 font-semibold">承辦人現場裁量指南</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {missingItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.itemName}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded-sm">
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status="not_found" size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {item.note || '請承辦人確認廠商是否置於其他信封或是否符合特別免附規定。'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. 版本變更分析區 */}
      {activeTab === 'version' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              投標文件版本異動差異分析 (Audit Version Diffs)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              當投標廠商補正、更換標單或抽換文件時，系統自動識別文字新增、刪除、數值變更與條件差異。
            </p>
          </div>

          <div className="space-y-3">
            {versionDiffs.map((diff) => (
              <div
                key={diff.id}
                className="p-3 bg-slate-50/80 border border-slate-200 rounded-md text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-3.5 h-3.5 text-slate-600" />
                    <span className="font-bold text-slate-900">{diff.documentName}</span>
                    <span className="text-slate-500 font-medium">· {diff.field}</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-sm font-mono text-[10px]">
                    {diff.changeType === 'modified' && '內容修改'}
                    {diff.changeType === 'value_changed' && '數值變更'}
                    {diff.changeType === 'added' && '新增文件'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="text-slate-500 bg-white p-1.5 rounded border border-slate-100">
                    <span className="text-red-500 line-through">舊值：{diff.oldValue}</span>
                  </div>
                  <div className="text-slate-800 bg-white p-1.5 rounded border border-slate-100">
                    <span className="text-emerald-700 font-semibold">新值：{diff.newValue}</span>
                  </div>
                </div>

                <div className="text-slate-600 text-[11px]">
                  <strong>影響評估：</strong> {diff.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
