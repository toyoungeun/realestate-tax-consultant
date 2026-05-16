import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, action }) {
  return (
    <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-100">
      <div className="flex items-start gap-3">
        {icon && <div className="text-2xl">{icon}</div>}
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export default Card;
