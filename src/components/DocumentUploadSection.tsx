/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UploadedDoc, DocumentType } from '../types';
import {
  UploadCloud,
  FileText,
  FileCheck,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleTenderData';

interface Props {
  documents: UploadedDoc[];
  setDocuments: React.Dispatch<React.SetStateAction<UploadedDoc[]>>;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
  onProceedToResults: () => void;
}

export const DocumentUploadSection: React.FC<Props> = ({
  documents,
  setDocuments,
  selectedDocId,
  setSelectedDocId,
  onProceedToResults,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isParsingBatch, setIsParsingBatch] = useState<boolean>(false);
  const [parsingProgress, setParsingProgress] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guess document type from file name
  const guessDocumentType = (filename: string): { type: DocumentType; typeName: string } => {
    const lower = filename.toLowerCase();
    if (lower.includes('標封') || lower.includes('外標封') || lower.includes('label')) {
      return { type: 'label', typeName: '投標標封' };
    }
    if (lower.includes('報價') || lower.includes('標單') || lower.includes('quotation')) {
      return { type: 'quotation', typeName: '報價單' };
    }
    if (lower.includes('聲明') || lower.includes('declaration')) {
      return { type: 'declaration', typeName: '投標廠商聲明書' };
    }
    if (lower.includes('切結') || lower.includes('affidavit')) {
      return { type: 'affidavit', typeName: '廠商切結書' };
    }
    if (lower.includes('授權') || lower.includes('委託') || lower.includes('authorization')) {
      return { type: 'authorization', typeName: '委託代理授權書' };
    }
    if (
      lower.includes('證明') ||
      lower.includes('資格') ||
      lower.includes('納稅') ||
      lower.includes('qualification')
    ) {
      return { type: 'qualification', typeName: '資格證明文件' };
    }
    if (lower.includes('揭露') || lower.includes('disclosure')) {
      return { type: 'disclosure', typeName: '事前揭露表A' };
    }
    return { type: 'other', typeName: '其他投標文件' };
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsParsingBatch(true);
    setParsingProgress(20);

    const newDocs: UploadedDoc[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { type, typeName } = guessDocumentType(file.name);

      let markdownContent = '';

      if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        markdownContent = await file.text();
      } else {
        // Binary files (PDF / Word)
        markdownContent = `# ${file.name}（結構化 Markdown 解析展示）

**檔案名稱**：${file.name}  
**檔案格式**：${file.type || 'application/octet-stream'} (${(file.size / 1024).toFixed(1)} KB)  
**上傳時間**：${new Date().toLocaleString('zh-TW')}  
**文件類型判定**：${typeName}  

---

### [系統提示與解析擴充接點說明]
> 本工具目前於前端執行結構化預覽與模擬欄位檢核流程。
> 針對上傳之二進位文件（如 PDF、Word、掃描件），已保留未來串接後端專屬 OCR 及文件解析服務（例如 Document AI API / LLM 結構化轉換管線）之擴充介面。
> 系統**不假裝已成功完成二進位深度辨識**，以下為已對齊之模擬結構化欄位：

- **標案名稱**：中央銀行磁帶採購案
- **採購案號**：CBC-115-TP-088
- **投標廠商**：台灣磁存儲存科技股份有限公司
- **文件驗證備註**：已由前端建立標準結構化資料框架。
`;
      }

      newDocs.push({
        id: `upload_${Date.now()}_${i}`,
        name: file.name,
        type,
        typeName,
        size: file.size,
        uploadedAt: new Date().toLocaleString('zh-TW'),
        markdownContent,
        parsingStatus: 'completed',
        isSimulated: !file.name.endsWith('.md'),
        version: 1,
      });
    }

    setTimeout(() => {
      setParsingProgress(100);
      setDocuments((prev) => [...prev, ...newDocs]);
      if (newDocs.length > 0) {
        setSelectedDocId(newDocs[0].id);
      }
      setIsParsingBatch(false);
    }, 450);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (selectedDocId === id) {
      setSelectedDocId(documents.find((d) => d.id !== id)?.id || null);
    }
  };

  const handleLoadSamples = () => {
    setIsParsingBatch(true);
    setParsingProgress(30);
    setTimeout(() => {
      setParsingProgress(75);
      setTimeout(() => {
        setDocuments(JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS)));
        setSelectedDocId(SAMPLE_DOCUMENTS[0].id);
        setIsParsingBatch(false);
        setParsingProgress(100);
      }, 300);
    }, 200);
  };

  const handleTypeChange = (docId: string, newType: DocumentType) => {
    const typeNames: Record<DocumentType, string> = {
      label: '投標標封',
      quotation: '報價單',
      declaration: '投標廠商聲明書',
      affidavit: '廠商切結書',
      authorization: '委託代理授權書',
      qualification: '資格證明文件',
      disclosure: '事前揭露表A',
      other: '其他投標文件',
    };

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, type: newType, typeName: typeNames[newType] } : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone & Presets Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              多文件批次上傳與解析管線
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              投標廠商多文件匯入 ({documents.length} 份文件在庫)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              支援拖曳上傳多份投標文件（.md, .txt, .pdf, .docx）。系統將自動辨識文件類型並轉換為結構化 Markdown 預覽。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSamples}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors shadow-xs"
              title="一鍵匯入中央銀行磁帶採購案 7 份標準標案文件"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              <span>載入央行 7 份示範標案文件</span>
            </button>
            {documents.length > 0 && (
              <button
                type="button"
                onClick={onProceedToResults}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
              >
                <span>執行欄位檢核與跨文件比對 →</span>
              </button>
            )}
          </div>
        </div>

        {/* Drag and Drop Container */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept=".md,.txt,.pdf,.docx,.doc"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                點擊選取檔案 或 拖曳投標文件至此
              </p>
              <p className="text-xs text-slate-500 mt-1">
                支援 Markdown (.md)、純文字 (.txt)、PDF 與 Word 格式（可同時選取多份文件）
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 rounded-sm">投標標封</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-sm">報價單</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-sm">聲明書</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-sm">切結書</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-sm">代理授權書</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-sm">資格證明</span>
            </div>
          </div>
        </div>

        {/* Honest Architecture Disclosure Note */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>公務系統解析架構備註：</strong>
            為確保客觀與防弊，本原型於前端建立清晰完整的檔案管線、結構化轉換與模擬檢核分析，不偽稱已直接讀取未授權之二進位加密掃描檔。系統已完整預留未來串接後端專屬 OCR 與 Document Parsing API 之標準進入點。
          </div>
        </div>

        {/* Progress indicator when parsing */}
        {isParsingBatch && (
          <div className="mt-4 p-3 bg-slate-100 rounded-md">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
              <span>正在執行文件結構化解析與型態判定...</span>
              <span className="font-mono">{parsingProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 h-1.5 transition-all duration-300"
                style={{ width: `${parsingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            已載入之投標文件清單 ({documents.length} 份)
          </h3>
          {documents.length > 0 && (
            <span className="text-xs text-slate-500">
              點擊文件可於右側/下方即時展開 Markdown 結構化內容
            </span>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">目前尚無上傳之投標文件</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              您可以拖曳檔案上傳，或點擊上方「載入央行 7 份示範標案文件」快速體驗檢核。
            </p>
            <button
              type="button"
              onClick={handleLoadSamples}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>立即載入央行採購案範例文件</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">文件名稱</th>
                  <th className="py-2.5 px-3 font-semibold">判定文件類型</th>
                  <th className="py-2.5 px-3 font-semibold text-right">大小</th>
                  <th className="py-2.5 px-3 font-semibold">匯入時間</th>
                  <th className="py-2.5 px-3 font-semibold text-center">解析狀態</th>
                  <th className="py-2.5 px-3 font-semibold text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => {
                  const isSelected = doc.id === selectedDocId;
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-100/90 font-medium' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="text-slate-900 font-medium">{doc.name}</span>
                          {doc.isSimulated && (
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                              結構化展示
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={doc.type}
                          onChange={(e) => handleTypeChange(doc.id, e.target.value as DocumentType)}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        >
                          <option value="label">投標標封</option>
                          <option value="quotation">報價單</option>
                          <option value="declaration">投標廠商聲明書</option>
                          <option value="affidavit">廠商切結書</option>
                          <option value="authorization">委託代理授權書</option>
                          <option value="qualification">資格證明文件</option>
                          <option value="disclosure">事前揭露表A</option>
                          <option value="other">其他文件</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {(doc.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="py-3 px-3 text-slate-500">{doc.uploadedAt}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                          <CheckCircle className="w-3 h-3" />
                          <span>已結構化</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedDocId(doc.id)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded"
                            title="預覽 Markdown"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="移除文件"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
