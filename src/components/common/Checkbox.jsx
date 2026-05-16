import React from 'react';

export default function Checkbox({ label, checked, onChange, help, className = '' }) {
  return (
    <label
      className={`flex items-start gap-2 cursor-pointer py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {help && <div className="text-xs text-slate-500 mt-0.5">{help}</div>}
      </div>
    </label>
  );
}
