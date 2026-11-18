/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600 rounded-md flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
        <p>
          <strong>法定聲明：</strong>
          本結果僅供文件完整性及初步符合性檢核使用，不構成正式投標資格、合格或不合格判定。正式認定仍應由承辦人依原始投標文件及相關規定確認。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-slate-700">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-slate-900 mb-0.5">
            投標文件初步符合性檢核公務聲明
          </div>
          <p className="text-slate-600 leading-relaxed">
            本工具用於協助承辦人檢查投標廠商所提供的文件是否包含指定文件、必要欄位、簽章及資格證明，並進行跨文件一致性、缺漏及初步符合性分析。
            <strong>本工具只做初步文件檢核，不做正式合格、不合格或法律認定。</strong>
            不得自行將「未找到」直接判定為「不合格」。正式認定仍應由承辦人依原始投標文件、投標須知、需求說明書及相關規定確認。
          </p>
        </div>
      </div>
    </div>
  );
};
