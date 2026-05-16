import React from 'react';

/**
 * 간단한 탭 네비게이션 컴포넌트.
 * 외부 앱과 통합 시 이 컴포넌트를 그대로 사용하거나, 자체 라우터로 대체 가능.
 */
export default function Tabs({ tabs, activeId, onChange }) {
  return (
    <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto" role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
