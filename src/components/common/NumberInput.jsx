import React from 'react';
import { UNIT } from '../../data/taxRates2026.js';

/**
 * 한국 부동산 금액 입력 전용.
 * 사용자가 "8억" 또는 "80000만원" 같이 직관적으로 입력해도
 * 원 단위 숫자로 자동 변환.
 */
export default function NumberInput({
  label,
  value,
  onChange,
  unit = '원',
  placeholder,
  help,
  suffix,
  min = 0,
  step,
}) {
  const display = formatDisplay(value, unit);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.억만원,\s]/g, '');
    const parsed = parseInput(raw, unit);
    onChange(parsed);
  };

  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {value > 0 && unit === '원' && (
          <span className="text-xs text-slate-500 tabular-nums">{formatKRWLabel(value)}</span>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-12 border border-slate-300 rounded-lg text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          min={min}
          step={step}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </label>
  );
}

function formatDisplay(value, unit) {
  if (!value || value === 0) return '';
  if (unit === '원') {
    // 콤마 구분
    return value.toLocaleString();
  }
  return String(value);
}

function parseInput(raw, unit) {
  if (!raw) return 0;
  if (unit !== '원') {
    const n = parseFloat(raw);
    return Number.isNaN(n) ? 0 : n;
  }
  // 한국식 입력 지원: "8억", "8억 5천", "80000만"
  let cleaned = raw.replace(/,|\s/g, '');
  if (cleaned.includes('억')) {
    const parts = cleaned.split('억');
    const eok = parseFloat(parts[0]) || 0;
    let man = 0;
    if (parts[1]) {
      const rest = parts[1].replace('원', '').replace('만', '');
      man = parseFloat(rest) || 0;
    }
    return eok * UNIT.억 + man * UNIT.만;
  }
  if (cleaned.includes('만')) {
    const n = parseFloat(cleaned.replace('만', '').replace('원', ''));
    return Math.round((n || 0) * UNIT.만);
  }
  const n = parseFloat(cleaned.replace('원', ''));
  return Math.round(n || 0);
}

function formatKRWLabel(value) {
  if (value >= UNIT.억) {
    const eok = value / UNIT.억;
    return `${eok.toFixed(eok % 1 === 0 ? 0 : 2)}억원`;
  }
  if (value >= UNIT.만) {
    return `${(value / UNIT.만).toLocaleString()}만원`;
  }
  return `${value.toLocaleString()}원`;
}
