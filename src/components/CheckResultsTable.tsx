/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckResultRecord, CheckStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Search,
  Filter,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  MinusCircle,
  Edit2,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';

interface Props {
  results: CheckResultRecord[];
  setResults: React.Dispatch<React.SetStateAction<CheckResultRecord[]>>;
  onViewDocQuote: (docName: string) => void;
}

export const CheckResultsTable: React.FC<Props> = ({
  results,
  setResults,
  onViewDocQuote,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState<string>('');
  const [editStatus, setEditStatus] = useState<CheckStatus>('found');

  // Counts
  const totalCount = results.length;
  const foundCount = results.filter((r) => r.status === 'found').length;
  const partialCount = results.filter((r) => r.status === 'partial').length;
  const notFoundCount = results.filter((r) => r.status === 'not_found').length;
  const manualReviewCount = results.filter((r) => r.status === 'manual_review').length;

  // Unique categories
  const categories = Array.from(new Set(results.map((r) => r.categoryName)));

  // Filter logic
  const filteredResults = results.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.categoryName !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.documentName.toLowerCase().includes(q) ||
        r.categoryName.toLowerCase().includes(q) ||
        r.itemName.toLowerCase().includes(q) ||
        r.extractedValue.toLowerCase().includes(q) ||
        r.note.toLowerCase().includes(q) ||
        r.sourceQuote.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleStartEdit = (record: CheckResultRecord) => {
    setEditingId(record.id);
    setEditNote(record.note);
    setEditStatus(record.status);
  };

  const handleSaveEdit = (recordId: string) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r;
        return {
          ...r,
          status: editStatus,
          note: editNote,
          isManuallyAdjusted: true,
          originalStatus: r.originalStatus || r.status,
        };
      })
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI & Four-Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-lg border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-400 font-medium">總檢核項目</div>
          <div className="text-xl font-bold font-mono tabular-nums mt-0.5">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">六大應備類別彙總</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('found')}
          className={`p-3 rounded-lg border text-left transition-all ${
            statusFilter === 'found'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700">已找到</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-900 mt-0.5">
            {foundCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">明確可辨識資料</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('partial')}
          className={`p-3 rounded-lg border text-left transition-all ${
            statusFilter === 'partial'
              ? 'bg-sky-900 text-white border-sky-900 shadow-xs'
              : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sky-700">部分找到</span>
            <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-sky-900 mt-0.5">
            {partialCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">有內容但需補全</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('not_found')}
          className={`p-3 rounded-lg border text-left transition-all ${
            statusFilter === 'not_found'
              ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">未找到</span>
            <MinusCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-800 mt-0.5">
            {notFoundCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">目前上傳未檢索到</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('manual_review')}
          className={`p-3 rounded-lg border text-left transition-all ${
            statusFilter === 'manual_review'
              ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
              : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-700">需人工確認</span>
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-purple-900 mt-0.5">
            {manualReviewCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">印章/衝突/附表疑義</div>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>類別：</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                <option value="all">全部檢核類別 ({results.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c} ({results.filter((r) => r.categoryName === c).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>狀態：</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                <option value="all">全部狀態 ({totalCount})</option>
                <option value="found">已找到 ({foundCount})</option>
                <option value="partial">部分找到 ({partialCount})</option>
                <option value="not_found">未找到 ({notFoundCount})</option>
                <option value="manual_review">需人工確認 ({manualReviewCount})</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋欄位、內容、原文依據或備註..."
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-32">文件名稱</th>
                <th className="py-2.5 px-3 font-semibold w-28">檢核類別</th>
                <th className="py-2.5 px-3 font-semibold w-36">檢核項目</th>
                <th className="py-2.5 px-3 font-semibold min-w-[160px]">文件內容</th>
                <th className="py-2.5 px-3 font-semibold text-center w-28">檢核狀態</th>
                <th className="py-2.5 px-3 font-semibold min-w-[180px]">原文依據</th>
                <th className="py-2.5 px-3 font-semibold min-w-[180px]">備註</th>
                <th className="py-2.5 px-3 font-semibold text-center w-16">維護</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    無符合條件之檢核結果，請確認篩選條件或至文件上傳區匯入標案文檔。
                  </td>
                </tr>
              ) : (
                filteredResults.map((record) => {
                  const isEditing = editingId === record.id;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. 文件名稱 */}
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        <button
                          type="button"
                          onClick={() => onViewDocQuote(record.documentName)}
                          className="text-left text-slate-800 hover:text-slate-900 hover:underline flex items-center gap-1 group"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                          <span className="truncate max-w-[110px]" title={record.documentName}>
                            {record.documentName}
                          </span>
                        </button>
                      </td>

                      {/* 2. 檢核類別 */}
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded-sm text-[11px]">
                          {record.categoryName}
                        </span>
                      </td>

                      {/* 3. 檢核項目 */}
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {record.itemName}
                      </td>

                      {/* 4. 文件內容 */}
                      <td className="py-2.5 px-3 text-slate-800">
                        <div className="font-sans leading-relaxed max-w-xs">
                          {record.extractedValue}
                        </div>
                      </td>

                      {/* 5. 檢核狀態 */}
                      <td className="py-2.5 px-3 text-center">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as CheckStatus)}
                            className="text-xs border border-slate-300 rounded px-1.5 py-1 bg-white"
                          >
                            <option value="found">已找到</option>
                            <option value="partial">部分找到</option>
                            <option value="not_found">未找到</option>
                            <option value="manual_review">需人工確認</option>
                          </select>
                        ) : (
                          <div className="flex flex-col items-center">
                            <StatusBadge status={record.status} size="sm" />
                            {record.isManuallyAdjusted && (
                              <span className="text-[10px] text-purple-700 mt-0.5 font-medium">
                                (承辦人人工覆核)
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 6. 原文依據 */}
                      <td className="py-2.5 px-3 text-slate-600">
                        <div className="text-[11px] text-slate-500 font-mono mb-0.5">
                          {record.sourceLocation}
                        </div>
                        <div className="text-xs text-slate-700 italic bg-slate-50/70 border border-slate-100 p-1 rounded-sm line-clamp-2">
                          "{record.sourceQuote}"
                        </div>
                      </td>

                      {/* 7. 備註 */}
                      <td className="py-2.5 px-3 text-slate-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span className="text-xs text-slate-600 leading-relaxed">
                            {record.note}
                          </span>
                        )}
                      </td>

                      {/* 8. 操作 */}
                      <td className="py-2.5 px-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(record.id)}
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                              title="儲存"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              title="取消"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(record)}
                            className="p-1 text-slate-400 hover:text-slate-900 rounded"
                            title="承辦人人工註記/調整狀態"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
