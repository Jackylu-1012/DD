/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CaseInfo } from '../types';
import { Building2, FileText, Calendar, User, DollarSign, Users, Info, Sparkles } from 'lucide-react';

interface Props {
  caseInfo: CaseInfo;
  setCaseInfo: React.Dispatch<React.SetStateAction<CaseInfo>>;
  onLoadSample: () => void;
  onProceedToUpload: () => void;
  documentCount: number;
}

export const CaseInfoSection: React.FC<Props> = ({
  caseInfo,
  setCaseInfo,
  onLoadSample,
  onProceedToUpload,
  documentCount,
}) => {
  const handleChange = (field: keyof CaseInfo, value: any) => {
    setCaseInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              採購基本資料登記
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {caseInfo.tenderName || '尚未設定標案名稱（點擊下方填寫或載入範例）'}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span>案號：{caseInfo.tenderNumber || '未設定'}</span>
              <span>·</span>
              <span>招標機關：{caseInfo.agencyName || '未設定'}</span>
              <span>·</span>
              <span>開標案次：{caseInfo.sessionNumber || '第 1 次開標'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!caseInfo.tenderName && (
              <button
                type="button"
                onClick={onLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>套用「中央銀行磁帶採購案」範例</span>
              </button>
            )}
            <button
              type="button"
              onClick={onProceedToUpload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <span>前往文件上傳 ({documentCount} 份已就緒)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          案件登記詳細欄位
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 標案名稱 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              標案名稱 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={caseInfo.tenderName}
                onChange={(e) => handleChange('tenderName', e.target.value)}
                placeholder="例如：中央銀行磁帶採購案"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">需與政府採購公告招標公告名稱完全相符</p>
          </div>

          {/* 採購案號 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              採購案號 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={caseInfo.tenderNumber}
                onChange={(e) => handleChange('tenderNumber', e.target.value)}
                placeholder="例如：CBC-115-TP-088"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">招標文件所載之標準採購案號碼</p>
          </div>

          {/* 招標機關 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">招標機關名稱</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={caseInfo.agencyName}
                onChange={(e) => handleChange('agencyName', e.target.value)}
                placeholder="例如：中央銀行資訊處"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* 投標廠商名稱 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              投標廠商全銜（登記名義）
            </label>
            <input
              type="text"
              value={caseInfo.vendorName}
              onChange={(e) => handleChange('vendorName', e.target.value)}
              placeholder="例如：台灣磁存儲存科技股份有限公司"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <p className="text-xs text-slate-500 mt-1">比對標封、報價單與切結書之一致性</p>
          </div>

          {/* 檢核日期 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">檢核/開標日期</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={caseInfo.checkDate}
                onChange={(e) => handleChange('checkDate', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* 承辦人員 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">檢核承辦人員</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={caseInfo.auditorName}
                onChange={(e) => handleChange('auditorName', e.target.value)}
                placeholder="例如：林專員 / 採購承辦"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* 開標案次 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">開標案次</label>
            <input
              type="text"
              value={caseInfo.sessionNumber}
              onChange={(e) => handleChange('sessionNumber', e.target.value)}
              placeholder="第 1 次開標"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* 預算金額 */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">招標預算金額</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={caseInfo.budgetAmount}
                onChange={(e) => handleChange('budgetAmount', e.target.value)}
                placeholder="例如：新臺幣 18,500,000 元"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* 授權書條件連動設定 */}
          <div className="border border-slate-200 bg-slate-50/70 rounded-md p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-600" />
                代理人出席狀態（連動第5項）
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseInfo.hasProxyAttending}
                  onChange={(e) => handleChange('hasProxyAttending', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
            <p className="text-xs text-slate-600">
              {caseInfo.hasProxyAttending ? (
                <span className="text-slate-900 font-medium">
                  開標現場有受託代理人出席，將嚴格檢查「五、委託代理授權書」7項欄位。
                </span>
              ) : (
                <span className="text-slate-500">
                  負責人親自出席，依規定得免檢附委託代理授權書。
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 備註說明 */}
        <div className="mt-5">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            案件檢核特別說明或投標須知規定備註
          </label>
          <textarea
            rows={2}
            value={caseInfo.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="例如：本案採總價決標、非拒絕往來戶證明應在開標日前半年內出具..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* Helpful Guidance Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>案件設定提示：</strong>
          基本資料設定後，系統將用於跨文件一致性之比對標準。您可隨時切換至「檢核欄位設定」新增自訂檢核規則，或直接至「文件上傳與預覽」區上傳投標廠商文檔。
        </div>
      </div>
    </div>
  );
};
