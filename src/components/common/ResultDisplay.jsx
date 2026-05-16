import React from 'react';
import { formatKRW } from '../../lib/taxCalculations.js';

/**
 * 세금 계산 결과 공통 출력 컴포넌트.
 * { total, breakdown, meta } 형태의 결과 객체를 받아서 표시.
 */
export default function ResultDisplay({ result, primaryLabel }) {
  if (!result) return null;

  return (
    <div className="mt-6 bg-brand-50 border border-brand-100 rounded-2xl p-5">
      <div className="text-sm text-brand-900 font-medium">
        {primaryLabel || `${result.taxType} 예상 세액`}
      </div>
      <div className="mt-1 text-3xl font-bold text-brand-700 tabular-nums">
        {formatKRW(result.total)}
      </div>
      {result.meta?.effectiveRate !== undefined && (
        <div className="mt-1 text-xs text-brand-700/70">
          실효세율 {(result.meta.effectiveRate * 100).toFixed(3)}%
        </div>
      )}

      <div className="mt-4 space-y-2">
        {result.breakdown.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-3 text-sm py-1.5 border-t border-brand-100/60 first:border-t-0"
          >
            <div className="flex-1">
              <div className="font-medium text-slate-700">{item.label}</div>
              {item.note && (
                <div className="text-xs text-slate-500 mt-0.5">{item.note}</div>
              )}
            </div>
            <div
              className={`tabular-nums font-semibold ${
                item.amount < 0 ? 'text-emerald-600' : 'text-slate-900'
              }`}
            >
              {item.amount < 0 ? '−' : ''}
              {formatKRW(Math.abs(item.amount))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
