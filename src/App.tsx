/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  CaseInfo,
  CheckCategory,
  CheckResultRecord,
  ConsistencyComparison,
  UploadedDoc,
} from './types';
import {
  INITIAL_CASE_INFO,
  BLANK_CASE_INFO,
  DEFAULT_CHECK_CATEGORIES,
} from './data/defaultRules';
import { SAMPLE_DOCUMENTS } from './data/sampleTenderData';
import { runDocumentAudit } from './utils/checkEngine';

import { Header, ActiveTab } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { CaseInfoSection } from './components/CaseInfoSection';
import { RuleSettingsSection } from './components/RuleSettingsSection';
import { DocumentUploadSection } from './components/DocumentUploadSection';
import { MarkdownViewerSection } from './components/MarkdownViewerSection';
import { CheckResultsTable } from './components/CheckResultsTable';
import { ConsistencyAnalysisSection } from './components/ConsistencyAnalysisSection';
import { ExceptionsSection } from './components/ExceptionsSection';
import { FullAuditReport } from './components/FullAuditReport';

export default function App() {
  // App starts with blank case info per user preference, with instant 1-click sample loader
  const [caseInfo, setCaseInfo] = useState<CaseInfo>(BLANK_CASE_INFO);
  const [categories, setCategories] = useState<CheckCategory[]>(DEFAULT_CHECK_CATEGORIES);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('case');
  const [results, setResults] = useState<CheckResultRecord[]>([]);
  const [consistency, setConsistency] = useState<ConsistencyComparison[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Re-run audit engine when documents, categories, or caseInfo change (preserving manual adjustments if same ID)
  useEffect(() => {
    const audit = runDocumentAudit(categories, documents, caseInfo);

    // Merge manual overrides
    setResults((prev) => {
      const manualOverrides = new Map(
        prev.filter((p) => p.isManuallyAdjusted).map((p) => [p.id, p])
      );

      return audit.results.map((res) => {
        const manual = manualOverrides.get(res.id);
        if (manual) {
          return {
            ...res,
            status: manual.status,
            note: manual.note,
            isManuallyAdjusted: true,
          };
        }
        return res;
      });
    });

    setConsistency(audit.consistency);
  }, [categories, documents, caseInfo]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // One-click load Central Bank sample tender
  const handleLoadSample = () => {
    setCaseInfo(JSON.parse(JSON.stringify(INITIAL_CASE_INFO)));
    setDocuments(JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS)));
    setSelectedDocId(SAMPLE_DOCUMENTS[0].id);
    showNotification('已載入「中央銀行磁帶採購案」7 份投標文檔與檢核規格！');
  };

  // Reset to clean blank slate
  const handleResetBlank = () => {
    if (window.confirm('確定重設為初始空白專案？這將清除目前上傳的檔案與設定。')) {
      setCaseInfo(JSON.parse(JSON.stringify(BLANK_CASE_INFO)));
      setDocuments([]);
      setSelectedDocId(null);
      setCategories(JSON.parse(JSON.stringify(DEFAULT_CHECK_CATEGORIES)));
      setActiveTab('case');
      showNotification('已重設為空白專案。');
    }
  };

  // Trigger discrepancy test: artificially tamper one document to show cross-document inconsistency alert
  const handleTriggerDiscrepancyDemo = () => {
    setDocuments((prev) => {
      if (prev.length === 0) {
        showNotification('請先載入示範檔案以進行不一致性測試！');
        return prev;
      }
      return prev.map((doc) => {
        if (doc.type === 'quotation') {
          // Alter tender number in quotation
          const tampered = doc.markdownContent.replace(
            'CBC-115-TP-088',
            'CBC-115-TP-099 (誤植為前期案號)'
          );
          return { ...doc, markdownContent: tampered, version: doc.version + 1 };
        }
        return doc;
      });
    });
    setActiveTab('consistency');
    showNotification('已於「報價單」中植入案號不一致狀況，請檢視系統警示與人工確認提示！');
  };

  // Reset documents back to original sample
  const handleResetDocuments = () => {
    setDocuments(JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS)));
    showNotification('已還原為標準一致性標案文件。');
  };

  // Print Report
  const handlePrint = () => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Export Markdown Report
  const handleExportMarkdown = () => {
    const content = `# 投標文件完整性與初步符合性檢核報告
標案名稱：${caseInfo.tenderName || '未命名標案'}
採購案號：${caseInfo.tenderNumber || '未載明'}
檢核日期：${caseInfo.checkDate}
檢核承辦人員：${caseInfo.auditorName || '採購承辦'}

法定聲明：本結果僅供文件完整性及初步符合性檢核使用，不構成正式投標資格、合格或不合格判定。正式認定仍應由承辦人依原始投標文件、投標須知、需求說明書及相關規定確認。

## 檢核統計
- 總項目：${results.length}
- 已找到：${results.filter((r) => r.status === 'found').length}
- 部分找到：${results.filter((r) => r.status === 'partial').length}
- 未找到：${results.filter((r) => r.status === 'not_found').length}
- 需人工確認：${results.filter((r) => r.status === 'manual_review').length}

## 明細表格
| 類別 | 項目 | 狀態 | 文件內容 | 原文依據 | 備註 |
|:---|:---|:---:|:---|:---|:---|
${results.map((r) => `| ${r.categoryName} | ${r.itemName} | ${r.status} | ${r.extractedValue} | ${r.sourceLocation} | ${r.note} |`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `投標文件檢核報告_${caseInfo.tenderNumber || 'CBC'}_${caseInfo.checkDate}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('已下載 Markdown 檢核報告！');
  };

  // Jump to Markdown preview for a document
  const handleViewDocQuote = (docName: string) => {
    const target = documents.find((d) => d.name === docName || docName.includes(d.name));
    if (target) {
      setSelectedDocId(target.id);
      setActiveTab('upload');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadSample={handleLoadSample}
        onResetBlank={handleResetBlank}
        onPrint={handlePrint}
        onExportMarkdown={handleExportMarkdown}
        documentCount={documents.length}
        resultCount={results.length}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Statutory Disclaimer Banner (Always accessible at top) */}
        <div className="print:hidden">
          <DisclaimerBanner />
        </div>

        {/* Tab 1: 案件基本資料 */}
        {activeTab === 'case' && (
          <CaseInfoSection
            caseInfo={caseInfo}
            setCaseInfo={setCaseInfo}
            onLoadSample={handleLoadSample}
            onProceedToUpload={() => setActiveTab('upload')}
            documentCount={documents.length}
          />
        )}

        {/* Tab 2: 檢核欄位設定 */}
        {activeTab === 'rules' && (
          <RuleSettingsSection categories={categories} setCategories={setCategories} />
        )}

        {/* Tab 3: 多文件上傳與預覽 */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <DocumentUploadSection
              documents={documents}
              setDocuments={setDocuments}
              selectedDocId={selectedDocId}
              setSelectedDocId={setSelectedDocId}
              onProceedToResults={() => setActiveTab('results')}
            />

            {documents.length > 0 && (
              <div className="mt-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  文件結構化內容預覽
                </div>
                <MarkdownViewerSection
                  documents={documents}
                  selectedDocId={selectedDocId}
                  setSelectedDocId={setSelectedDocId}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 4: 檢核結果表格 */}
        {activeTab === 'results' && (
          <CheckResultsTable
            results={results}
            setResults={setResults}
            onViewDocQuote={handleViewDocQuote}
          />
        )}

        {/* Tab 5: 跨文件一致性 */}
        {activeTab === 'consistency' && (
          <ConsistencyAnalysisSection
            consistency={consistency}
            documents={documents}
            onTriggerDiscrepancyDemo={handleTriggerDiscrepancyDemo}
            onResetDocuments={handleResetDocuments}
          />
        )}

        {/* Tab 6: 缺漏與需確認 */}
        {activeTab === 'exceptions' && (
          <ExceptionsSection
            results={results}
            consistency={consistency}
            onViewDocQuote={handleViewDocQuote}
          />
        )}

        {/* Tab 7: 完整檢核報告 */}
        {activeTab === 'report' && (
          <FullAuditReport
            caseInfo={caseInfo}
            categories={categories}
            documents={documents}
            results={results}
            consistency={consistency}
            onPrint={handlePrint}
            onExportMarkdown={handleExportMarkdown}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            投標文件完整性與初步符合性檢核系統 · 中央銀行採購案輔助規格
          </div>
          <div className="flex items-center gap-3">
            <span>低飽和公務四態檢核標準</span>
            <span>·</span>
            <span>支援 A4 列印與 Markdown 匯出</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
