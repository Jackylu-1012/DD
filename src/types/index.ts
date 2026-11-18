/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CheckStatus = 'found' | 'partial' | 'not_found' | 'manual_review';

export interface CaseInfo {
  tenderName: string;
  tenderNumber: string;
  agencyName: string;
  vendorName: string;
  checkDate: string;
  auditorName: string;
  sessionNumber: string;
  budgetAmount: string;
  notes: string;
  hasProxyAttending: boolean;
}

export interface CheckItemRule {
  id: string;
  categoryId: string;
  categoryName: string;
  itemName: string;
  required: boolean;
  conditionalRule?: string;
  description: string;
  crossCheckField?: 'tenderName' | 'tenderNumber' | 'vendorName' | 'taxId' | 'leaderName' | 'bidAmount';
}

export interface CheckCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  isConditional?: boolean;
  conditionalCondition?: string;
  items: CheckItemRule[];
}

export type DocumentType = 
  | 'label'             // 投標標封
  | 'quotation'         // 報價單
  | 'declaration'       // 投標廠商聲明書
  | 'affidavit'         // 廠商切結書
  | 'authorization'     // 委託代理授權書
  | 'qualification'     // 資格證明
  | 'disclosure'        // 事前揭露表
  | 'other';

export interface UploadedDoc {
  id: string;
  name: string;
  type: DocumentType;
  typeName: string;
  size: number;
  uploadedAt: string;
  markdownContent: string;
  parsingStatus: 'completed' | 'parsing' | 'error';
  isSimulated: boolean;
  version: number;
  checksum?: string;
}

export interface CheckResultRecord {
  id: string;
  documentName: string;
  documentType: string;
  categoryId: string;
  categoryName: string;
  itemId: string;
  itemName: string;
  extractedValue: string;
  status: CheckStatus;
  sourceQuote: string;
  sourceLocation: string; // 例：P.1 行 12 或 第2節
  note: string;
  isManuallyAdjusted?: boolean;
  originalStatus?: CheckStatus;
}

export interface ConsistencyComparison {
  fieldKey: 'tenderName' | 'tenderNumber' | 'vendorName' | 'taxId' | 'leaderName' | 'bidAmount';
  fieldLabel: string;
  status: 'consistent' | 'inconsistent' | 'insufficient_data';
  evidence: {
    documentName: string;
    documentType: string;
    value: string;
    quote: string;
    location: string;
  }[];
  summary: string;
  actionRequired: string;
}

export interface VersionDiffItem {
  id: string;
  changeType: 'added' | 'removed' | 'modified' | 'value_changed' | 'condition_changed';
  documentName: string;
  field: string;
  oldValue: string;
  newValue: string;
  impact: string;
}
