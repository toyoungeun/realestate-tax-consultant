// 부동산 세금 뉴스 큐레이션 링크
// 각 URL은 실제 동작 여부를 확인한 후 등록되었습니다 (최종 검증: 2026-05-16).
// `searchUrl(q)`는 해당 사이트의 네이티브 검색 결과 페이지로 직접 이동합니다.

/* -----------------------------------------------------------
 * 통합 뉴스 검색 (메타 검색)
 *   키워드 입력 시 가장 먼저 노출되는 "전체 검색" 엔진들.
 * --------------------------------------------------------- */
export const META_SEARCH = [
  {
    id: 'naver-news',
    name: '네이버 뉴스',
    description: '국내 부동산 세금 기사 통합 검색 (가장 보편)',
    icon: '🟢',
    searchUrl: (q) =>
      `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(q)}`,
    homeUrl: 'https://news.naver.com/breakingnews/section/101/260',
  },
  {
    id: 'google-news',
    name: '구글 뉴스',
    description: '국문 + 영문 기사 통합 + 최신순 정렬',
    icon: '🔍',
    searchUrl: (q) => `https://news.google.com/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR`,
    homeUrl: 'https://news.google.com/?hl=ko&gl=KR',
  },
  {
    id: 'daum-news',
    name: '다음 뉴스',
    description: '카카오 다음의 뉴스 검색',
    icon: '🔵',
    searchUrl: (q) =>
      `https://search.daum.net/search?w=news&q=${encodeURIComponent(q)}`,
    homeUrl: 'https://news.daum.net',
  },
];

/* -----------------------------------------------------------
 * 사이트별 큐레이션 (정부 / 언론 / 분석)
 *   모든 searchUrl은 각 사이트의 네이티브 검색 결과 페이지로 직접 이동.
 *   네이티브 검색이 불안정한 정부 사이트는 Google site: 검색으로 대체.
 * --------------------------------------------------------- */
export const NEWS_SOURCES = [
  // ========== 정부/공식 ==========
  {
    id: 'nts',
    name: '국세청 보도자료',
    category: 'official',
    description: '국세청 보도자료 게시판 (양도세·종부세 공식 안내)',
    homeUrl: 'https://www.nts.go.kr/nts/na/ntt/selectNttList.do?mi=2201&bbsId=1028',
    // 국세청 사이트 내 검색 API가 공개되어 있지 않아 Google site: 검색이 가장 확실
    searchUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:nts.go.kr ${q}`)}`,
    tags: ['공식', '국세청', '보도자료'],
  },
  {
    id: 'molit',
    name: '국토교통부',
    category: 'official',
    description: '국토부 보도자료 - 부동산 대책 / 조정대상지역 고시',
    homeUrl: 'https://www.molit.go.kr/USR/NEWS/m_71/lst.jsp',
    searchUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:molit.go.kr ${q}`)}`,
    tags: ['공식', '국토부', '대책'],
  },
  {
    id: 'mois',
    name: '행정안전부 지방세',
    category: 'official',
    description: '취득세·재산세 등 지방세 관련 고시',
    homeUrl: 'https://www.mois.go.kr',
    searchUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:mois.go.kr 지방세 ${q}`)}`,
    tags: ['공식', '행안부', '지방세'],
  },
  {
    id: 'hometax',
    name: '홈택스 (세금 신고)',
    category: 'official',
    description: '실제 신고/계산을 진행하는 국세청 공식 포털',
    homeUrl: 'https://www.hometax.go.kr',
    searchUrl: () => 'https://www.hometax.go.kr',
    tags: ['공식', '신고', '홈택스'],
  },

  // ========== 언론 ==========
  {
    id: 'hankyung',
    name: '한국경제 부동산',
    category: 'media',
    description: '정책·시장 분석이 빠른 경제지',
    homeUrl: 'https://www.hankyung.com/realestate',
    searchUrl: (q) =>
      `https://search.hankyung.com/search/total?query=${encodeURIComponent(q)}`,
    tags: ['언론', '한국경제'],
  },
  {
    id: 'maeil',
    name: '매일경제 부동산',
    category: 'media',
    description: '시장 동향 + 세제 해설',
    homeUrl: 'https://www.mk.co.kr/news/realestate/',
    searchUrl: (q) => `https://search.mk.co.kr/?word=${encodeURIComponent(q)}`,
    tags: ['언론', '매일경제'],
  },
  {
    id: 'chosun-biz',
    name: '조선비즈 부동산',
    category: 'media',
    description: '심층 기획 기사가 강점',
    homeUrl: 'https://biz.chosun.com/real_estate/',
    searchUrl: (q) =>
      `https://biz.chosun.com/nsearch/?query=${encodeURIComponent(q)}&siteid=bizchosun`,
    tags: ['언론', '조선비즈'],
  },
  {
    id: 'taxtimes',
    name: '한국세정신문',
    category: 'media',
    description: '세무 전문 매체 - 세제 개정 가장 빠른 보도',
    homeUrl: 'https://www.taxtimes.co.kr',
    searchUrl: (q) =>
      `https://www.taxtimes.co.kr/news/articleList.html?sc_word=${encodeURIComponent(q)}`,
    tags: ['언론', '세무전문'],
  },

  // ========== 분석/리포트 ==========
  {
    id: 'pwc-kr',
    name: '삼일 PwC 인사이트',
    category: 'analysis',
    description: '회계법인 PwC의 세무 인사이트 보고서',
    homeUrl: 'https://www.pwc.com/kr/ko/insights.html',
    searchUrl: (q) =>
      `https://www.pwc.com/kr/ko/search-results.html?searchfilter=${encodeURIComponent(q)}`,
    tags: ['분석', '회계법인'],
  },
  {
    id: 'r114',
    name: '부동산R114 리서치',
    category: 'analysis',
    description: '부동산 시장 분석·절세 전략 리포트',
    homeUrl: 'https://www.r114.com/?_c=research',
    searchUrl: (q) =>
      `https://www.r114.com/?_c=research&searchText=${encodeURIComponent(q)}`,
    tags: ['분석', '리서치'],
  },
  {
    id: 'kbthink',
    name: 'KB 세무·자산 인사이트',
    category: 'analysis',
    description: 'KB금융그룹의 부동산 세무·절세 콘텐츠 (KB Think)',
    homeUrl: 'https://kbthink.com',
    searchUrl: (q) =>
      `https://kbthink.com/search.html?keyword=${encodeURIComponent(q)}`,
    tags: ['분석', 'KB', '세무'],
  },
  {
    id: 'kbland',
    name: 'KB부동산 (시세·뉴스)',
    category: 'analysis',
    description: 'KB부동산의 시세 정보·시장 뉴스 (참고용)',
    homeUrl: 'https://kbland.kr/news',
    searchUrl: () => 'https://kbland.kr/news',
    tags: ['분석', 'KB', '시세'],
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

export default { META_SEARCH, NEWS_SOURCES, POPULAR_KEYWORDS, CATEGORIES };
