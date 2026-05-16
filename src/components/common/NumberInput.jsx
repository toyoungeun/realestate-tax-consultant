import React from 'react';
import { UNIT } from '../../data/taxRates2026.js';

/**
 * 한국 부동산 금액 입력 전용.
 *
 * unit 옵션:
 *  - "만원" (기본): 사용자는 만원 단위로 입력. "80000" 또는 "8억"으로 입력 → 내부 원 단위 저장
 *  - "원": 원 단위 직접 입력
 *  - "년"/"세"/"㎡": 단순 숫자
 */
export default function NumberInput({
  label,
  value,
  onChange,
  unit = '만원',
  placeholder,
  help,
  suffix,
  min = 0,
  step,
}) {
  const isMoney = unit === '만원' || unit === '원';
  const effectiveSuffix = suffix || (isMoney ? unit : '');
  const display = formatDisplay(value, unit);

  const handleChange = (e) => {
    const raw = isMoney
      ? e.target.value.replace(/[^0-9.억만천원,\s]/g, '')
      : e.target.value.replace(/[^0-9.]/g, '');
    const parsed = parseInput(raw, unit);
    onChange(parsed);
  };

  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {value > 0 && isMoney && (
          <span className="text-xs text-slate-500 tabular-nums truncate">
            = {formatHumanLabel(value)}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-14 border border-slate-300 rounded-lg text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          min={min}
          step={step}
          aria-label={label}
        />
        {effectiveSuffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
            {effectiveSuffix}
          </span>
        )}
      </div>
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </label>
  );
}

function formatDisplay(value, unit) {
  if (!value || value === 0) return '';
  if (unit === '만원') {
    // 원 → 만원으로 변환하여 표시 (소수 첫째자리까지)
    const manwon = value / UNIT.만;
    if (Number.isInteger(manwon)) return manwon.toLocaleString();
    return manwon.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }
  if (unit === '원') {
    return value.toLocaleString();
  }
  return String(value);
}

function parseInput(raw, unit) {
  if (!raw) return 0;
  if (unit !== '만원' && unit !== '원') {
    const n = parseFloat(raw);
    return Number.isNaN(n) ? 0 : n;
  }
  let cleaned = raw.replace(/,|\s/g, '');

  // "8억", "8억 5천", "8억 5000만" → 원
  if (cleaned.includes('억')) {
    const [eokPart, restPart = ''] = cleaned.split('억');
    const eok = parseFloat(eokPart) || 0;
    let manwon = 0;
    if (restPart) {
      const r = restPart.replace('원', '');
      if (r.includes('천')) {
        // "5천" = 5,000만원
        const cheon = parseFloat(r.replace('천', '').replace('만', '')) || 0;
        manwon = cheon * 1000;
      } else {
        manwon = parseFloat(r.replace('만', '')) || 0;
      }
    }
    return Math.round(eok * UNIT.억 + manwon * UNIT.만);
  }

  // "5천" = 5,000만원 (= 5천만원)
  if (cleaned.includes('천') && !cleaned.includes('억')) {
    const cheon = parseFloat(cleaned.replace('천', '').replace('만', '').replace('원', '')) || 0;
    return Math.round(cheon * 1000 * UNIT.만);
  }

  // "80000만" or just number
  if (cleaned.includes('만')) {
    const n = parseFloat(cleaned.replace('만', '').replace('원', '')) || 0;
    return Math.round(n * UNIT.만);
  }

  const n = parseFloat(cleaned.replace('원', '')) || 0;

  // 단위에 따른 해석
  if (unit === '만원') return Math.round(n * UNIT.만);
  return Math.round(n);
}

function formatHumanLabel(value) {
  if (value >= UNIT.억) {
    const eok = value / UNIT.억;
    return `${eok.toFixed(eok % 1 === 0 ? 0 : 2)}억원`;
  }
  if (value >= UNIT.만) {
    return `${(value / UNIT.만).toLocaleString()}만원`;
  }
  return `${value.toLocaleString()}원`;
}
