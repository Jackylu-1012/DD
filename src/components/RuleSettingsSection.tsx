/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCategory, CheckItemRule } from '../types';
import { Plus, Trash2, RotateCcw, AlertCircle, Check, Info } from 'lucide-react';
import { DEFAULT_CHECK_CATEGORIES } from '../data/defaultRules';

interface Props {
  categories: CheckCategory[];
  setCategories: React.Dispatch<React.SetStateAction<CheckCategory[]>>;
}

export const RuleSettingsSection: React.FC<Props> = ({ categories, setCategories }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || 'cat_label');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDesc, setNewItemDesc] = useState<string>('');
  const [newItemRequired, setNewItemRequired] = useState<boolean>(true);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

  const handleToggleRequired = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, required: !item.required } : item
          ),
        };
      })
    );
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !activeCategory) return;
    const newItem: CheckItemRule = {
      id: `custom_${Date.now()}`,
      categoryId: activeCategory.id,
      categoryName: activeCategory.name.replace(/^[一二三四五六七八九十]、/, ''),
      itemName: newItemName.trim(),
      required: newItemRequired,
      description: newItemDesc.trim() || '自訂檢核欄位項目',
    };

    setCategories((prev) =>
      prev.map((cat) => (cat.id === activeCategory.id ? { ...cat, items: [...cat.items, newItem] } : cat))
    );

    setNewItemName('');
    setNewItemDesc('');
    setShowAddModal(false);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  const handleResetToDefault = () => {
    if (window.confirm('確定將所有檢核欄位規則恢復為官方標準六大類別預設值？')) {
      setCategories(JSON.parse(JSON.stringify(DEFAULT_CHECK_CATEGORIES)));
    }
  };

  const totalItemsCount = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Overview & Action Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              標準規範 · 檢核欄位與條件規則庫
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              六大應備文件檢核設定 ({totalItemsCount} 項檢核指標)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              遵循政府採購法規與投標須知格式，嚴格比對必要欄位、印章資格與法定條件附表。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增此類別自訂欄位</span>
            </button>
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              title="恢復預設檢核規範"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢復預設規則</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Category Tabs and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Category Navigator */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-semibold text-slate-500 px-1 mb-2">文件檢核類別</div>
          {categories.map((cat, idx) => {
            const isSelected = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{cat.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-sm ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.items.length} 欄位
                  </span>
                </div>
                <div
                  className={`text-xs line-clamp-1 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {cat.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Category Items Detailed View */}
        <div className="lg:col-span-3">
          {activeCategory && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
                <div>
                  <div className="text-xs font-medium text-slate-500">{activeCategory.code}</div>
                  <h3 className="text-lg font-bold text-slate-900">{activeCategory.name}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{activeCategory.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    必要項目：
                    <strong className="text-slate-900">
                      {activeCategory.items.filter((i) => i.required).length}
                    </strong>{' '}
                    / {activeCategory.items.length}
                  </span>
                </div>
              </div>

              {/* Special Conditional Rule Callout (if any) */}
              {activeCategory.id === 'cat_declaration' && (
                <div className="mb-4 p-3 bg-purple-50/70 border border-purple-200 rounded-md text-xs text-purple-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>特定條件檢核規則：</strong>
                    「如果第8項公職人員利益衝突迴避勾選為『是』，還必須檢查是否提供『A.事前揭露表』。」系統將在比對時自動檢查兩份文件之連動附隨關係。
                  </div>
                </div>
              )}

              {activeCategory.id === 'cat_authorization' && (
                <div className="mb-4 p-3 bg-sky-50/70 border border-sky-200 rounded-md text-xs text-sky-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>出席條件檢核規則：</strong>
                    「若有代理人出席時才需要檢查」。若投標廠商由法定負責人本人出席開標，依採購法須知得免附授權書，系統將標註免予檢核。
                  </div>
                </div>
              )}

              {/* Items List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold w-12 text-center">項次</th>
                      <th className="py-2.5 px-3 font-semibold">檢核欄位名稱</th>
                      <th className="py-2.5 px-3 font-semibold">規範說明與條件要求</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-28">跨文件比對</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-24">必要性</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCategory.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.itemName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <div>{item.description}</div>
                          {item.conditionalRule && (
                            <div className="text-[11px] text-purple-700 mt-0.5 font-medium">
                              ★ 條件：{item.conditionalRule}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {item.crossCheckField ? (
                            <span className="inline-block px-1.5 py-0.5 text-[11px] bg-slate-100 text-slate-700 rounded-sm">
                              {item.crossCheckField === 'tenderName' && '標案名稱'}
                              {item.crossCheckField === 'tenderNumber' && '採購案號'}
                              {item.crossCheckField === 'vendorName' && '廠商名稱'}
                              {item.crossCheckField === 'taxId' && '統一編號'}
                              {item.crossCheckField === 'leaderName' && '負責人姓名'}
                              {item.crossCheckField === 'bidAmount' && '總標價'}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleRequired(activeCategory.id, item.id)}
                            className={`px-2 py-0.5 text-[11px] font-medium rounded-sm border transition-colors ${
                              item.required
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
                            }`}
                          >
                            {item.required ? '必要檢核' : '選填/參考'}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {item.id.startsWith('custom_') ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(activeCategory.id, item.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-sm"
                              title="刪除自訂欄位"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              新增自訂檢核欄位至「{activeCategory.name}」
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              可依據本次標案個別招標須知新增特定審查規格或條款。
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  檢核欄位名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="例如：原廠軟體升級保證書"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  規範說明或審查要求
                </label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="例如：需載明提供三年版本無償升級承諾..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="req_checkbox"
                  checked={newItemRequired}
                  onChange={(e) => setNewItemRequired(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
                <label htmlFor="req_checkbox" className="text-xs text-slate-700">
                  設定為必要檢核欄位
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
                className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-md"
              >
                儲存欄位
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
