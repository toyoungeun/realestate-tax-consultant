import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card.jsx';
import {
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
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const sources = useMemo(() => {
    let list = NEWS_SOURCES;
    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [keyword, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">부동산 세금 뉴스</h1>
        <p className="mt-1 text-sm text-slate-600">
          정부 보도자료부터 주요 언론, 전문 매체까지. 키워드 검색으로 각 사이트에서 최신
          기사를 바로 확인하세요.
        </p>
      </header>

      {/* 검색 박스 */}
      <Card>
        <CardBody>
          <div className="relative">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 검색 (예: 종부세, 다주택, 1세대1주택)"
              className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-2">🔥 인기 키워드</div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setKeyword(kw)}
                  className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
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

      {/* 뉴스 소스 카드 */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            검색 결과가 없습니다.
          </div>
        )}
        {sources.map((s) => {
          const cat = CATEGORIES[s.category];
          const searchUrl = keyword.trim() ? s.searchUrl(keyword.trim()) : s.homeUrl;
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
                <div className="flex gap-2">
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-sm py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors font-medium"
                  >
                    {keyword.trim() ? `"${keyword}" 검색 →` : '바로가기 →'}
                  </a>
                  {keyword.trim() && (
                    <a
                      href={s.homeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                      title="사이트 메인"
                    >
                      🏠
                    </a>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <div className="text-xs text-slate-500 text-center pb-4">
        ※ 외부 링크는 새 창에서 열립니다. 검색 결과의 정확성은 각 매체 정책을 따릅니다.
      </div>
    </div>
  );
}
