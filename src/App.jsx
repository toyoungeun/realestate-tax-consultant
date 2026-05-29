import React, { useState, useEffect } from 'react';
import Tabs from './components/common/Tabs.jsx';
import PolicyTab from './components/tabs/PolicyTab.jsx';
import CalculatorTab from './components/tabs/CalculatorTab.jsx';
import NewsTab from './components/tabs/NewsTab.jsx';

// 오늘(KST) 기준 YYYY-MM-DD — 항상 페이지를 연 시점의 실제 날짜
function todayKstYmd() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const TABS = [
  { id: 'policy', label: '정책 정리', icon: '📋', Component: PolicyTab },
  { id: 'calculator', label: '세금 계산기', icon: '🧮', Component: CalculatorTab },
  { id: 'news', label: '뉴스', icon: '📰', Component: NewsTab },
];

/**
 * 부동산 세금 컨설턴트 메인 App
 *
 * 외부 앱(예: 부동산 투자 컨설턴트)과 통합 시:
 *   1) 이 App 컴포넌트를 통째로 import하거나
 *   2) 개별 탭(PolicyTab/CalculatorTab/NewsTab) 또는
 *      개별 Calculator(AcquisitionTaxCalculator 등)만 import
 *
 * 모든 계산 로직은 src/lib/taxCalculations.js의 순수함수로 분리되어 있어
 * UI 없이 로직만 가져다 쓸 수도 있음.
 */
export default function App({ defaultTab = 'policy' }) {
  // URL 해시에서 탭 ID 읽기 (예: #calculator)
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (TABS.find((t) => t.id === hash)) return hash;
    }
    return defaultTab;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${activeId}`);
    }
  }, [activeId]);

  const Active = TABS.find((t) => t.id === activeId)?.Component;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏘️</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">부동산 세금 컨설턴트</h1>
              <p className="text-xs text-slate-500">
                2026년 기준 · 취득세 · 보유세 · 양도세
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
              title="페이지를 연 시점의 KST 날짜입니다"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              기준일 {todayKstYmd()}
            </span>
            <span>🇰🇷 한국 아파트 전용</span>
          </div>
        </div>
      </header>

      <Tabs tabs={TABS} activeId={activeId} onChange={setActiveId} />

      <main>{Active && <Active />}</main>

      <footer className="border-t border-slate-200 bg-white mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 text-xs text-slate-500 leading-relaxed">
          <div className="font-medium text-slate-700 mb-1">📌 면책 안내</div>
          본 도구는 일반적인 정보 제공 목적이며, 실제 세무 신고에 활용 시 반드시
          국세청 홈택스 공식 계산 도구와 세무사의 검토를 받으시기 바랍니다. 본 도구의
          계산 결과로 인한 손실에 대해 책임지지 않습니다.
        </div>
      </footer>
    </div>
  );
}

// 외부 앱에서 개별 import할 수 있도록 named export도 제공
export { PolicyTab, CalculatorTab, NewsTab };
