/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CaseInfo,
  CheckCategory,
  CheckResultRecord,
  ConsistencyComparison,
  UploadedDoc,
} from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Printer,
  Download,
  Copy,
  Check,
  FileCheck2,
  ShieldAlert,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MinusCircle,
} from 'lucide-react';

interface Props {
  caseInfo: CaseInfo;
  categories: CheckCategory[];
  documents: UploadedDoc[];
  results: CheckResultRecord[];
  consistency: ConsistencyComparison[];
  onPrint: () => void;
  onExportMarkdown: () => void;
}

export const FullAuditReport: React.FC<Props> = ({
  caseInfo,
  categories,
  documents,
  results,
  consistency,
  onPrint,
  onExportMarkdown,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Group results
  const requiredResults = results.filter((r) => {
    // Check if item is marked required in category
    const cat = categories.find((c) => c.id === r.categoryId);
    const item = cat?.items.find((i) => i.id === r.itemId);
    return item ? item.required : true;
  });

  const sealResults = results.filter((r) =>
    r.itemName.includes('印章') || r.itemName.includes('簽名') || r.itemName.includes('簽署')
  );

  const qualResults = results.filter((r) => r.categoryName.includes('資格'));
  const missingResults = results.filter((r) => r.status === 'not_found');
  const manualResults = results.filter((r) => r.status === 'manual_review');

  const foundCount = results.filter((r) => r.status === 'found').length;
  const partialCount = results.filter((r) => r.status === 'partial').length;
  const notFoundCount = results.filter((r) => r.status === 'not_found').length;
  const manualCount = results.filter((r) => r.status === 'manual_review').length;

  const handleCopyMarkdown = () => {
    const md = generateReportMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateReportMarkdown = () => {
    return `# 投標文件完整性與初步符合性檢核報告

**產出時間**：${new Date().toLocaleString('zh-TW')}  
**檢核承辦人員**：${caseInfo.auditorName || '採購承辦'}  

> **公務法定聲明**：  
> 「本結果僅供文件完整性及初步符合性檢核使用，不構成正式投標資格、合格或不合格判定。正式認定仍應由承辦人依原始投標文件、投標須知、需求說明書及相關規定確認。」

---

## 一、案件基本資料
- **標案名稱**：${caseInfo.tenderName || '未填寫'}
- **採購案號**：${caseInfo.tenderNumber || '未填寫'}
- **招標機關**：${caseInfo.agencyName || '未填寫'}
- **投標廠商**：${caseInfo.vendorName || '未填寫'}
- **檢核日期**：${caseInfo.checkDate}
- **開標案次**：${caseInfo.sessionNumber}
- **預算金額**：${caseInfo.budgetAmount || '依招標文件'}
- **受託代理人出席狀態**：${caseInfo.hasProxyAttending ? '有代理人出席（已核檢授權書）' : '負責人親自出席（免附授權書）'}

---

## 二、應備文件檢核
目前上傳文件數量：${documents.length} 份
${documents.map((d, i) => `${i + 1}. **${d.name}** [${d.typeName}] (${(d.size / 1024).toFixed(1)} KB)`).join('\n')}

---

## 三、必要欄位檢核
| 類別 | 檢核項目 | 文件提取值 | 檢核狀態 | 原文依據 | 備註 |
|:---|:---|:---|:---:|:---|:---|
${results.map((r) => `| ${r.categoryName} | ${r.itemName} | ${r.extractedValue} | ${r.status} | ${r.sourceLocation} | ${r.note} |`).join('\n')}

---

## 四、簽章與形式要求
${sealResults.map((s) => `- **${s.itemName}** (${s.documentName})：狀態【${s.status}】\n  - 引文依據：${s.sourceQuote}\n  - 備註：${s.note}`).join('\n\n')}

---

## 五、資格證明文件
${qualResults.map((q) => `- **${q.itemName}**：狀態【${q.status}】\n  - 查驗內容：${q.extractedValue}\n  - 備註：${q.note}`).join('\n\n')}

---

## 六、跨文件一致性
${consistency.map((c) => `- **${c.fieldLabel}**：【${c.status}】\n  - 摘要：${c.summary}\n  - 處置建議：${c.actionRequired}`).join('\n\n')}

---

## 七、缺漏項目
${missingResults.length === 0 ? '無缺漏項目。' : missingResults.map((m) => `- **${m.itemName}** (${m.categoryName})：${m.note}`).join('\n')}

---

## 八、需人工確認事項
${manualResults.length === 0 ? '無待人工確認事項。' : manualResults.map((m) => `- **${m.itemName}** (${m.documentName})：${m.note}`).join('\n')}

---

## 九、整體檢核摘要
- 總檢核指標數：${results.length}
- 已找到：${foundCount}
- 部分找到：${partialCount}
- 未找到：${notFoundCount}（註：未找到不構成不合格判定）
- 需人工確認：${manualCount}
`;
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              公務正式格式檢核報告
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              投標文件完整性與初步符合性檢核報告
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              包含完整九大章節。支援一鍵列印為標準 A4 公務公文格式，或匯出 Markdown 格式留存備查。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="複製 Markdown 報告"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製' : '複製 Markdown'}</span>
            </button>
            <button
              type="button"
              onClick={onExportMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="下載報告 .md 檔案"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下載報告 (.md)</span>
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
              title="列印報告"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>列印 A4 檢核報告</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Printable Report Document Body */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-xs print:border-none print:shadow-none print:p-0 max-w-5xl mx-auto space-y-8 font-sans">
        {/* Document Title Header */}
        <div className="text-center pb-6 border-b-2 border-slate-800">
          <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">
            政府採購開標輔助紀錄文件
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            投標文件完整性與初步符合性檢核報告
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600 mt-2">
            <span>檢核基準日：{caseInfo.checkDate}</span>
            <span>·</span>
            <span>產出承辦：{caseInfo.auditorName || '林專員'}</span>
            <span>·</span>
            <span>案次：{caseInfo.sessionNumber}</span>
          </div>
        </div>

        {/* Mandatory Statutory Notice Box */}
        <div className="bg-slate-50 border-2 border-slate-300 rounded-md p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            重要法定公務免責與效力聲明：
          </div>
          <p className="font-medium text-slate-900">
            「本結果僅供文件完整性及初步符合性檢核使用，不構成正式投標資格、合格或不合格判定。正式認定仍應由承辦人依原始投標文件、投標須知、需求說明書及相關規定確認。」
          </p>
        </div>

        {/* 一、案件基本資料 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            一、案件基本資料
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200">
              <span className="text-slate-500">標案名稱</span>
              <div className="font-bold text-slate-900 mt-0.5">{caseInfo.tenderName || '-'}</div>
            </div>
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200">
              <span className="text-slate-500">採購案號</span>
              <div className="font-bold font-mono text-slate-900 mt-0.5">
                {caseInfo.tenderNumber || '-'}
              </div>
            </div>
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200">
              <span className="text-slate-500">招標機關</span>
              <div className="font-bold text-slate-900 mt-0.5">{caseInfo.agencyName || '-'}</div>
            </div>
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200">
              <span className="text-slate-500">投標廠商全銜</span>
              <div className="font-bold text-slate-900 mt-0.5">{caseInfo.vendorName || '-'}</div>
            </div>
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200">
              <span className="text-slate-500">招標預算金額</span>
              <div className="font-bold text-slate-900 mt-0.5">{caseInfo.budgetAmount || '-'}</div>
            </div>
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200">
              <span className="text-slate-500">代理人出席狀況</span>
              <div className="font-bold text-slate-900 mt-0.5">
                {caseInfo.hasProxyAttending ? '有受託人出席（已檢核授權書）' : '負責人親自出席（免附）'}
              </div>
            </div>
          </div>
        </section>

        {/* 二、應備文件檢核 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            二、應備文件檢核清單 ({documents.length} 份)
          </h2>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="py-2 px-3 font-semibold w-12 text-center">序</th>
                  <th className="py-2 px-3 font-semibold">投標文件名稱</th>
                  <th className="py-2 px-3 font-semibold">文件類型</th>
                  <th className="py-2 px-3 font-semibold text-right">檔案大小</th>
                  <th className="py-2 px-3 font-semibold text-center">結構化狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc, idx) => (
                  <tr key={doc.id}>
                    <td className="py-2 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{doc.name}</td>
                    <td className="py-2 px-3 text-slate-600">{doc.typeName}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500">
                      {(doc.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        已結構化解析
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 三、必要欄位檢核 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            三、必要欄位檢核明細 ({results.length} 項)
          </h2>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="py-2 px-3 font-semibold w-24">檢核類別</th>
                  <th className="py-2 px-3 font-semibold w-36">檢核項目</th>
                  <th className="py-2 px-3 font-semibold">文件內容</th>
                  <th className="py-2 px-3 font-semibold text-center w-24">狀態</th>
                  <th className="py-2 px-3 font-semibold w-32">原文依據</th>
                  <th className="py-2 px-3 font-semibold">審查備註</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 text-slate-600">{r.categoryName}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{r.itemName}</td>
                    <td className="py-2 px-3 text-slate-800">{r.extractedValue}</td>
                    <td className="py-2 px-3 text-center">
                      <StatusBadge status={r.status} size="sm" showIcon={false} />
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                      {r.sourceLocation}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 四、簽章與形式要求 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            四、簽章與形式要求查核
          </h2>
          <div className="space-y-2">
            {sealResults.map((s) => (
              <div
                key={s.id}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {s.itemName} · <span className="text-slate-600">{s.documentName}</span>
                  </div>
                  <div className="text-slate-600 mt-0.5">{s.sourceQuote}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 font-mono">{s.sourceLocation}</span>
                  <StatusBadge status={s.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 五、資格證明文件 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            五、資格證明文件彙整
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {qualResults.map((q) => (
              <div key={q.id} className="p-3 border border-slate-200 rounded bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{q.itemName}</span>
                  <StatusBadge status={q.status} size="sm" showIcon={false} />
                </div>
                <p className="text-slate-700 leading-relaxed">{q.extractedValue}</p>
                <div className="text-[11px] text-slate-500 mt-1">備註：{q.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 六、跨文件一致性 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            六、跨文件一致性比對結果
          </h2>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="py-2 px-3 font-semibold w-28">關鍵比對欄位</th>
                  <th className="py-2 px-3 font-semibold text-center w-28">一致性狀態</th>
                  <th className="py-2 px-3 font-semibold">比對摘要說明</th>
                  <th className="py-2 px-3 font-semibold">處置建議</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consistency.map((c) => (
                  <tr key={c.fieldKey}>
                    <td className="py-2 px-3 font-bold text-slate-900">{c.fieldLabel}</td>
                    <td className="py-2 px-3 text-center">
                      {c.status === 'consistent' ? (
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                          完全相符
                        </span>
                      ) : c.status === 'inconsistent' ? (
                        <span className="text-[11px] font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded-sm font-bold">
                          需人工確認
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                          資料不足
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-700">{c.summary}</td>
                    <td className="py-2 px-3 text-slate-600">{c.actionRequired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 七、缺漏項目 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            七、缺漏項目 ({missingResults.length} 項)
          </h2>
          {missingResults.length === 0 ? (
            <p className="text-xs text-slate-600 italic">經比對目前文件，無缺漏項目。</p>
          ) : (
            <div className="space-y-2 text-xs">
              {missingResults.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{m.itemName}</span>
                    <span className="text-slate-500 ml-2">（類別：{m.categoryName}）</span>
                  </div>
                  <span className="text-slate-600">{m.note}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 八、需人工確認事項 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            八、需人工確認事項清單 ({manualResults.length} 項)
          </h2>
          {manualResults.length === 0 ? (
            <p className="text-xs text-slate-600 italic">無需人工確認事項。</p>
          ) : (
            <div className="space-y-2 text-xs">
              {manualResults.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-purple-50/50 border border-purple-200 rounded space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{m.itemName}</span>
                    <span className="text-[11px] text-purple-900">文件：{m.documentName}</span>
                  </div>
                  <div className="text-purple-900">{m.note}</div>
                  <div className="text-slate-500 text-[11px]">依據：{m.sourceQuote}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 九、整體檢核摘要 */}
        <section className="space-y-3 pt-4 border-t-2 border-slate-800">
          <h2 className="text-base font-bold text-slate-900 pb-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-xs"></span>
            九、整體檢核統計摘要
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500">已找到項目</span>
              <div className="text-lg font-bold font-mono text-emerald-800">{foundCount} 項</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500">部分找到項目</span>
              <div className="text-lg font-bold font-mono text-sky-800">{partialCount} 項</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500">未找到項目（非不合格）</span>
              <div className="text-lg font-bold font-mono text-slate-800">{notFoundCount} 項</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500">需人工確認</span>
              <div className="text-lg font-bold font-mono text-purple-900">{manualCount} 項</div>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-700">
            <div className="border-t border-slate-300 pt-2">
              <span className="text-slate-500">檢核承辦人員核章：</span>
              <div className="h-10 mt-2 font-bold text-slate-900">
                {caseInfo.auditorName || '林專員'} （蓋章）
              </div>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <span className="text-slate-500">開標主持人覆核：</span>
              <div className="h-10 mt-2 font-bold text-slate-400">（簽名或蓋章）</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
