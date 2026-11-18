/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckStatus } from '../types';
import { CheckCircle2, AlertCircle, HelpCircle, MinusCircle } from 'lucide-react';

interface Props {
  status: CheckStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  switch (status) {
    case 'found':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>已找到</span>
        </span>
      );

    case 'partial':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-sky-300 bg-sky-50 text-sky-800 ${sizeClasses}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
          <span>部分找到</span>
        </span>
      );

    case 'not_found':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-slate-300 bg-slate-100 text-slate-700 ${sizeClasses}`}
          title="目前文件中未檢索到此項目，非不合格判定"
        >
          {showIcon && <MinusCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>未找到</span>
        </span>
      );

    case 'manual_review':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-purple-300 bg-purple-50 text-purple-900 ${sizeClasses}`}
          title="資料可能存在、內容有衝突、掃描不清楚或需人工確認"
        >
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
          <span>需人工確認</span>
        </span>
      );

    default:
      return null;
  }
};
