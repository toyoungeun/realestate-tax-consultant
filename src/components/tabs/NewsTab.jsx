import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card.jsx';
import {
  META_SEARCH,
  NEWS_SOURCES,
  POPULAR_KEYWORDS,
  CATEGORIES,
} from '../../data/newsLinks.js';

const CATEGORY_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'official', label: '정부/공식' },
  { id: 'media', label: '언론' },
  { id: 'analysis', label: '분석/리포트' },
];

export default function NewsTab() {
  const [rawKeyword, setRawKeyword] = useState('');
  const [keyword, setKeyword] = useState(''); // debounce된 값
  const [activeCategory, setActiveCategory] = useState('all');
  const inputRef = useRef(null);

  // 300ms debounce — 타이핑 중 깜빡임 방지
  useEffect(() => {
    const t = setTimeout(() => setKeyword(rawKeyword.trim()), 300);
    return () => clearTimeout(t);
  }, [rawKeyword]);

  // 단축키: '/' 키로 검색창 포커스, ESC로 비우기
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setRawKeyword('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // 사이트 리스트는 키워드와 무관하게 항상 카테고리 필터만 적용해 표시.
  // (키워드 검색은 상단의 통합 뉴스 검색에서만 의미를 가짐)
  const sources = useMemo(() => {
    if (activeCategory === 'all') return NEWS_SOURCES;
    return NEWS_SOURCES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const hasKeyword = keyword.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">부동산 세금 뉴스</h1>
        <p className="mt-1 text-sm text-slate-600">
          키워드 검색은 네이버/구글/다음 통합 뉴스에 적용되며, 아래 사이트 리스트는
          카테고리별로 항상 노출됩니다.
          <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-slate-100 rounded border border-slate-200">/</kbd>{' '}
          키로 검색창에 포커스.
        </p>
      </header>

      {/* 검색 박스 */}
      <Card>
        <CardBody>
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={rawKeyword}
              onChange={(e) => setRawKeyword(e.target.value)}
              placeholder="키워드 검색 (예: 종부세, 다주택, 1세대1주택, 양도소득세)"
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              aria-label="뉴스 키워드 검색"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              🔍
            </span>
            {rawKeyword && (
              <button
                onClick={() => setRawKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm"
                aria-label="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-2">🔥 인기 키워드 (클릭하면 즉시 검색)</div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setRawKeyword(kw)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    keyword === kw
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {CATEGORY_FILTERS.map((c) => {
              const isActive = c.id === activeCategory;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* 통합 뉴스 검색 (키워드 있을 때만 강조) */}
      {hasKeyword && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">
                "{keyword}" 통합 뉴스 검색
              </h2>
              <span className="text-xs text-slate-500">새 탭으로 열림</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2">
              {META_SEARCH.map((m) => (
                <a
                  key={m.id}
                  href={m.searchUrl(keyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-400 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-2xl" aria-hidden="true">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm">{m.name}</div>
                    <div className="text-xs text-slate-500 truncate">{m.description}</div>
                  </div>
                  <span className="text-brand-600 text-sm">→</span>
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 사이트별 리스트 (키워드와 무관, 카테고리만 반영) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">큐레이션된 부동산 세금 사이트</h2>
          <span className="text-xs text-slate-500">{sources.length}개 사이트</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((s) => {
            const cat = CATEGORIES[s.category];
            return (
              <Card key={s.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{s.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={s.homeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors font-medium"
                  >
                    바로가기 →
                  </a>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="text-xs text-slate-500 text-center pb-4 leading-relaxed">
        ※ 외부 링크는 새 창에서 열립니다. 일부 정부 사이트는 자체 검색 API가 공개되어 있지
        않아 Google site: 검색으로 연결됩니다. 검색 결과의 정확성은 각 매체 정책을 따릅니다.
      </div>
    </div>
  );
}
