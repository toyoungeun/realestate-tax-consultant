import React, { useState } from 'react';
import AcquisitionTaxCalculator from '../calculators/AcquisitionTaxCalculator.jsx';
import HoldingTaxCalculator from '../calculators/HoldingTaxCalculator.jsx';
import CapitalGainsTaxCalculator from '../calculators/CapitalGainsTaxCalculator.jsx';

const CALCULATORS = [
  { id: 'acquisition', label: '취득세', icon: '🏠', Component: AcquisitionTaxCalculator },
  { id: 'holding', label: '보유세 (재산세+종부세)', icon: '🏘️', Component: HoldingTaxCalculator },
  { id: 'capital-gains', label: '양도소득세', icon: '💰', Component: CapitalGainsTaxCalculator },
];

export default function CalculatorTab() {
  const [activeId, setActiveId] = useState('acquisition');
  const Active = CALCULATORS.find((c) => c.id === activeId)?.Component;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">세금 계산기</h1>
        <p className="mt-1 text-sm text-slate-600">
          취득세 · 보유세 · 양도세를 한 화면에서. 입력값은 자동으로 실시간 계산됩니다.
        </p>
      </header>

      {/* 세금 종류 선택 (서브 탭) */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CALCULATORS.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {Active && <Active />}
    </div>
  );
}
