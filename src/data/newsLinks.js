// 부동산 세금 뉴스 큐레이션 링크
// GitHub Pages 환경에서 CORS 이슈 없이 외부 링크로 이동.
// 키워드 검색 기능에 의해 필터링 가능.

export const NEWS_SOURCES = [
  // 정부/공식
  {
    id: 'nts',
    name: '국세청 보도자료',
    category: 'official',
    description: '국세청에서 발표하는 세제 변경, 안내문',
    homeUrl: 'https://www.nts.go.kr/nts/na/ntt/selectNttList.do?mi=40503&bbsId=131056',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Ants.go.kr+${encodeURIComponent(q)}`,
    tags: ['공식', '국세청', '보도자료'],
  },
  {
    id: 'molit',
    name: '국토교통부 부동산 정책',
    category: 'official',
    description: '국토부의 부동산 시장 안정 정책',
    homeUrl: 'https://www.molit.go.kr/policy/stable/sta_b_01.jsp',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Amolit.go.kr+${encodeURIComponent(q)}`,
    tags: ['공식', '국토부'],
  },
  {
    id: 'mois',
    name: '행정안전부 지방세',
    category: 'official',
    description: '취득세, 재산세 등 지방세 관련 고시',
    homeUrl: 'https://www.mois.go.kr',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Amois.go.kr+${encodeURIComponent(q)}+%EC%A7%80%EB%B0%A9%EC%84%B8`,
    tags: ['공식', '행안부', '지방세'],
  },

  // 주요 언론사 부동산 섹션
  {
    id: 'hankyung',
    name: '한국경제 부동산',
    category: 'media',
    description: '한국경제 부동산 섹션 - 정책/시장 분석',
    homeUrl: 'https://www.hankyung.com/realestate',
    searchUrl: (q) =>
      `https://search.hankyung.com/search/total?query=${encodeURIComponent(q)}`,
    tags: ['언론', '한국경제'],
  },
  {
    id: 'maeil',
    name: '매일경제 부동산',
    category: 'media',
    description: '매일경제 부동산 - 시장 동향, 세제',
    homeUrl: 'https://www.mk.co.kr/news/realestate/',
    searchUrl: (q) =>
      `https://search.mk.co.kr/?word=${encodeURIComponent(q)}`,
    tags: ['언론', '매일경제'],
  },
  {
    id: 'chosun-econ',
    name: '조선비즈 부동산',
    category: 'media',
    description: '조선비즈 부동산/세금',
    homeUrl: 'https://biz.chosun.com/real_estate/',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Abiz.chosun.com+${encodeURIComponent(q)}`,
    tags: ['언론', '조선비즈'],
  },
  {
    id: 'taxtimes',
    name: '한국세정신문',
    category: 'media',
    description: '세무 전문 매체 - 가장 빠른 세제 개정 소식',
    homeUrl: 'https://www.taxtimes.co.kr',
    searchUrl: (q) =>
      `https://www.taxtimes.co.kr/news/articleList.html?sc_word=${encodeURIComponent(q)}`,
    tags: ['언론', '세무전문'],
  },

  // 분석/보고서
  {
    id: 'pwc-kr',
    name: '삼일 PwC 세무 인사이트',
    category: 'analysis',
    description: '회계법인 부동산 세무 분석 보고서',
    homeUrl: 'https://www.pwc.com/kr/ko/insights/issue-brief.html',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Apwc.com%2Fkr+${encodeURIComponent(q)}`,
    tags: ['분석', 'PwC'],
  },
  {
    id: 'r114',
    name: '부동산114 리서치',
    category: 'analysis',
    description: '부동산 시장 분석 및 절세 전략 리포트',
    homeUrl: 'https://m.r114.com/?_c=research',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Ar114.com+${encodeURIComponent(q)}`,
    tags: ['분석', '리서치'],
  },
  {
    id: 'kbthink',
    name: 'KB 부동산',
    category: 'analysis',
    description: 'KB금융그룹 부동산 시장/세무 콘텐츠',
    homeUrl: 'https://kbthink.com/main/asset-management.html',
    searchUrl: (q) =>
      `https://www.google.com/search?q=site%3Akbthink.com+${encodeURIComponent(q)}`,
    tags: ['분석', 'KB'],
  },
];

// 인기 검색어 (기본 표시용)
export const POPULAR_KEYWORDS = [
  '2026 양도소득세',
  '종부세 개정',
  '취득세 다주택',
  '재산세 공정시장가액',
  '조정대상지역',
  '1세대1주택 비과세',
  '생애최초 취득세',
  '장기보유특별공제',
];

// 카테고리 메타
export const CATEGORIES = {
  official: { label: '정부/공식', color: 'bg-emerald-100 text-emerald-800' },
  media: { label: '언론', color: 'bg-blue-100 text-blue-800' },
  analysis: { label: '분석/리포트', color: 'bg-purple-100 text-purple-800' },
};

export default { NEWS_SOURCES, POPULAR_KEYWORDS, CATEGORIES };
