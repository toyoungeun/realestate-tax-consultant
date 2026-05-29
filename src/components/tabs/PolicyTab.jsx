import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card.jsx';
import {
  POLICY_OVERVIEW,
  POLICY_CATEGORIES,
  KEY_CHANGES_2026,
} from '../../data/policyData.js';
import { META, REGULATED_AREAS, CAPITAL_GAINS_TAX } from '../../data/taxRates2026.js';

// 오늘(KST) 기준 YYYY-MM-DD
function todayKst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// 두 날짜 사이 일수 차이
function daysBetween(fromYmd, toYmd) {
  const a = new Date(fromYmd + 'T00:00:00+09:00');
  const b = new Date(toYmd + 'T00:00:00+09:00');
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

const IMPORTANCE_STYLES = {
  critical: 'border-red-300 bg-red-50',
  high: 'border-amber-300 bg-amber-50',
  medium: 'border-blue-200 bg-blue-50',
  low: 'border-slate-200 bg-slate-50',
};

export default function PolicyTab() {
  const today = todayKst();
  const enforcementDate = CAPITAL_GAINS_TAX.multiHomeAdditional.enforcementDate;
  const ddays = daysBetween(today, enforcementDate);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 헤더 */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm opacity-80">
            오늘 {today} · 기준 {META.baseYear}년 · 최종 정리 {META.lastReviewed}
          </div>
          {ddays > 0 ? (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
              다주택자 양도세 중과 시행: {enforcementDate} (시행까지 {ddays}일 남음)
            </span>
          ) : ddays === 0 ? (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-300 text-amber-900 font-semibold">
              ⚠️ 오늘({enforcementDate})부터 다주택자 양도세 중과 시행
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
              다주택자 양도세 중과: {enforcementDate} 시행 ({Math.abs(ddays)}일 경과)
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">{POLICY_OVERVIEW.title}</h1>
        <p className="mt-3 text-sm md:text-base text-white/90 leading-relaxed">
          {POLICY_OVERVIEW.summary}
        </p>
      </section>

      {/* 2026 주요 변화 */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-3">📅 2026년 주요 변화</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {KEY_CHANGES_2026.map((change, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${IMPORTANCE_STYLES[change.importance]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{change.title}</h3>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {change.date}
                </span>
              </div>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {change.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 정책 카테고리 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">📚 세목별 정책 정리</h2>
        {POLICY_CATEGORIES.map((cat) => (
          <Card key={cat.id}>
            <CardHeader icon={cat.icon} title={cat.title} subtitle={cat.summary} />
            <CardBody>
              <div className="grid sm:grid-cols-2 gap-3">
                {cat.keyPoints.map((kp, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 p-3 bg-slate-50/50"
                  >
                    <div className="text-xs text-slate-500">{kp.label}</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {kp.value}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {kp.detail}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-medium text-slate-600 mb-2">📎 공식 출처</div>
                <div className="flex flex-wrap gap-2">
                  {cat.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                    >
                      {src.label} →
                    </a>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      {/* 조정대상지역 */}
      <section>
        <Card>
          <CardHeader
            icon="📍"
            title="조정대상지역 현황"
            subtitle={`최종 업데이트 ${REGULATED_AREAS.lastUpdated}`}
          />
          <CardBody>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-1">서울</div>
                <div className="flex flex-wrap gap-1.5">
                  {REGULATED_AREAS.seoul.map((area, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded bg-red-50 text-red-700 border border-red-100"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-1">경기</div>
                <div className="flex flex-wrap gap-1.5">
                  {REGULATED_AREAS.gyeonggi.map((area, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded bg-orange-50 text-orange-700 border border-orange-100"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 면책 */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-amber-900 mb-1">⚠️ 안내</div>
        <p className="text-xs text-amber-800 leading-relaxed">{META.disclaimer}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {META.officialSources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline text-amber-900 hover:text-amber-700"
            >
              {src.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
