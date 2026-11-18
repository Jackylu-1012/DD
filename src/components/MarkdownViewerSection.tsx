/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UploadedDoc } from '../types';
import {
  FileCode,
  FileText,
  Search,
  Copy,
  Check,
  Hash,
  Eye,
  Code2,
} from 'lucide-react';

interface Props {
  documents: UploadedDoc[];
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
}

export const MarkdownViewerSection: React.FC<Props> = ({
  documents,
  selectedDocId,
  setSelectedDocId,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState<boolean>(false);

  const currentDoc =
    documents.find((d) => d.id === selectedDocId) || documents[0] || null;

  const handleCopy = () => {
    if (!currentDoc) return;
    navigator.clipboard.writeText(currentDoc.markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentDoc) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
        <FileCode className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-base font-semibold text-slate-800">尚未選擇或上傳任何文件</h3>
        <p className="text-xs text-slate-500 mt-1">
          請先至「文件上傳」頁籤匯入投標文件或載入示範資料。
        </p>
      </div>
    );
  }

  // Format simple markdown into styled elements safely
  const renderSimpleMarkdown = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
        {lines.map((line, idx) => {
          const isHighlighted =
            searchTerm.trim() &&
            line.toLowerCase().includes(searchTerm.toLowerCase());

          // Headings
          if (line.startsWith('# ')) {
            return (
              <h1
                key={idx}
                className={`text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 mt-4 mb-2 ${
                  isHighlighted ? 'bg-yellow-100' : ''
                }`}
              >
                {line.replace('# ', '')}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className={`text-base font-bold text-slate-900 mt-3 mb-1 ${
                  isHighlighted ? 'bg-yellow-100' : ''
                }`}
              >
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className={`text-sm font-semibold text-slate-900 mt-2 mb-1 ${
                  isHighlighted ? 'bg-yellow-100' : ''
                }`}
              >
                {line.replace('### ', '')}
              </h3>
            );
          }

          // Horizontal rule
          if (line.trim() === '---') {
            return <hr key={idx} className="border-slate-200 my-3" />;
          }

          // Blockquote
          if (line.startsWith('> ')) {
            return (
              <div
                key={idx}
                className={`border-l-2 border-slate-400 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 italic my-1 ${
                  isHighlighted ? 'bg-yellow-100' : ''
                }`}
              >
                {line.replace('> ', '')}
              </div>
            );
          }

          // Table row indicator
          if (line.startsWith('|')) {
            const cells = line
              .split('|')
              .filter((c, i, arr) => i > 0 && i < arr.length - 1)
              .map((c) => c.trim());

            if (line.includes(':---') || line.includes('---:')) {
              return null; // divider
            }

            return (
              <div
                key={idx}
                className={`grid grid-cols-6 gap-2 py-1 px-2 border-b border-slate-100 text-xs ${
                  idx < 15 ? 'font-semibold bg-slate-50 text-slate-700' : 'text-slate-800'
                } ${isHighlighted ? 'bg-yellow-100' : ''}`}
              >
                {cells.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    className={cIdx === 0 ? 'col-span-1' : cIdx === 1 ? 'col-span-3' : 'col-span-2'}
                  >
                    {cell.replace(/\*\*/g, '')}
                  </div>
                ))}
              </div>
            );
          }

          // Stamp or verification annotation bracket: [ ... ]
          if (line.includes('[') && line.includes(']')) {
            return (
              <div
                key={idx}
                className={`flex items-start gap-1.5 text-xs my-0.5 ${
                  isHighlighted ? 'bg-yellow-100' : ''
                }`}
              >
                <span className="text-slate-400 font-mono w-7 text-right select-none shrink-0">
                  {idx + 1}
                </span>
                <span className="text-purple-800 bg-purple-50/70 border border-purple-200 px-2 py-0.5 rounded-sm">
                  {line}
                </span>
              </div>
            );
          }

          // Bullet items
          if (line.startsWith('- ')) {
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 pl-2 text-xs my-0.5 ${
                  isHighlighted ? 'bg-yellow-100' : ''
                }`}
              >
                <span className="text-slate-400 font-mono w-7 text-right select-none shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-400">•</span>
                <div className="flex-1">
                  {line
                    .replace('- ', '')
                    .split('**')
                    .map((part, pIdx) =>
                      pIdx % 2 === 1 ? (
                        <strong key={pIdx} className="text-slate-900 font-semibold">
                          {part}
                        </strong>
                      ) : (
                        <span key={pIdx}>{part}</span>
                      )
                    )}
                </div>
              </div>
            );
          }

          // Empty line
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Standard paragraph
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs my-0.5 ${
                isHighlighted ? 'bg-yellow-100' : ''
              }`}
            >
              <span className="text-slate-400 font-mono w-7 text-right select-none shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1">
                {line
                  .split('**')
                  .map((part, pIdx) =>
                    pIdx % 2 === 1 ? (
                      <strong key={pIdx} className="text-slate-900 font-semibold">
                        {part}
                      </strong>
                    ) : (
                      <span key={pIdx}>{part}</span>
                    )
                  )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Document Sidebar Selector */}
      <div className="lg:col-span-1 space-y-2">
        <div className="text-xs font-semibold text-slate-500 px-1 mb-2">文件瀏覽選擇器</div>
        {documents.map((doc) => {
          const isSelected = doc.id === currentDoc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs truncate max-w-[170px]">{doc.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {doc.typeName}
                </span>
              </div>
              <div
                className={`text-[11px] font-mono ${
                  isSelected ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {(doc.size / 1024).toFixed(1)} KB · v{doc.version}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Markdown Preview Box */}
      <div className="lg:col-span-3">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">
                  {currentDoc.name}
                </h3>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                  {currentDoc.typeName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                匯入時間：{currentDoc.uploadedAt} · 結構化 Markdown 預覽與行號定位
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search within document */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="文內關鍵字搜尋..."
                  className="pl-7 pr-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-36 sm:w-44"
                />
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('rendered')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${
                    viewMode === 'rendered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  預覽
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${
                    viewMode === 'raw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Code2 className="w-3 h-3 inline mr-1" />
                  源碼
                </button>
              </div>

              {/* Copy markdown button */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                title="複製 Markdown 內容"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="bg-slate-50/40 border border-slate-200 rounded-md p-4 max-h-[620px] overflow-y-auto">
            {viewMode === 'rendered' ? (
              renderSimpleMarkdown(currentDoc.markdownContent)
            ) : (
              <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {currentDoc.markdownContent}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
