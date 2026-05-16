// 2026년 부동산 세제 정책 요약 데이터
// 정책 카드 데이터 — 1번 탭(정책 정리)에서 렌더됨.
// 출처 링크는 모두 정부/국세청/공신력 있는 매체로 한정.

export const POLICY_OVERVIEW = {
  title: '2026년 한국 부동산 세제 한눈에 보기',
  summary:
    '2026년에도 다주택 중과 한시 유예가 5월 9일로 종료되고, 종부세 공정시장가액비율 60%·기본공제(1세대1주택 12억/일반 9억)는 유지됩니다. 1세대1주택자 재산세 특례세율(-0.05%p)도 2026년 말까지 연장됐고, 생애최초 취득세 200만원 감면(인구감소지역 300만원)도 유지됩니다.',
  baseYear: 2026,
  effectiveDate: '2026-01-01',
};

export const POLICY_CATEGORIES = [
  {
    id: 'acquisition',
    icon: '🏠',
    title: '취득세 (Acquisition Tax)',
    summary:
      '1주택 표준세율은 6억 이하 1%, 6~9억 누진식, 9억 초과 3%. 2025년 10·15 대책 이후 다주택 중과(2주택 8%, 3주택 12%)가 더 폭넓게 적용됩니다.',
    keyPoints: [
      {
        label: '표준세율 (1주택)',
        value: '1% / 누진식 / 3%',
        detail:
          '6억 이하 1%, 6~9억은 (취득가액×2/3억원−3)% 누진식, 9억 초과 3%',
      },
      {
        label: '다주택 중과 (조정대상지역)',
        value: '2주택 8% / 3주택+ 12%',
        detail: '2025.10.15 대책으로 비조정지역도 동일하게 강화 적용',
      },
      {
        label: '생애최초 감면 (2026 연장)',
        value: '200만원 한도',
        detail:
          '소득요건 폐지, 가액 12억 이하, 인구감소지역은 300만원까지. 3년 내 처분 시 추징.',
      },
      {
        label: '부가세',
        value: '농특세 + 지방교육세',
        detail:
          '농특세: 전용 85㎡ 초과 시 취득세의 10% / 지방교육세: 표준세율 적용 시 취득세의 약 10%',
      },
    ],
    sources: [
      {
        label: '국세청 - 양도세/취득세 안내',
        url: 'https://www.nts.go.kr',
      },
      {
        label: '행정안전부 - 생애최초 감면 운영기준 (2026-3호)',
        url: 'https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000016&nttId=123270',
      },
      {
        label: '한국세정신문 - 2026년 달라지는 지방세',
        url: 'https://www.taxtimes.co.kr/news/article.html?no=273135',
      },
    ],
  },

  {
    id: 'property',
    icon: '🏘️',
    title: '재산세 (Property Tax)',
    summary:
      '주택분 재산세는 공시가격 × 공정시장가액비율(일반 60%, 1주택 43~45%) × 누진세율(0.1~0.4%). 1세대1주택 특례세율(공시 9억 이하, 구간별 -0.05%p)이 2026년 말까지 연장됐습니다.',
    keyPoints: [
      {
        label: '공정시장가액비율 (2026)',
        value: '일반 60% / 1주택 43~45%',
        detail:
          '1주택 특례: 공시 3억 이하 43%, 6억 이하 44%, 6억 초과 45%',
      },
      {
        label: '일반세율 (누진)',
        value: '0.1% → 0.4%',
        detail:
          '6천만원 이하 0.1% / 1.5억 이하 0.15% / 3억 이하 0.25% / 3억 초과 0.4%',
      },
      {
        label: '1주택 특례세율 (9억 이하)',
        value: '0.05% → 0.35%',
        detail: '각 구간에서 0.05%p 인하. 2026년 말까지 연장.',
      },
      {
        label: '납부시기',
        value: '7월(50%) + 9월(50%)',
        detail: '20만원 이하 시 7월 일괄 부과',
      },
    ],
    sources: [
      {
        label: '서울ETAX - 재산세 안내',
        url: 'https://etax.seoul.go.kr/jsp/CtView.jsp?ctPage=/info/CON03_02_03_15.html',
      },
      {
        label: '지방세법 시행령',
        url: 'https://www.law.go.kr/LSW/lumLsLinkPop.do?lspttninfSeq=120262',
      },
    ],
  },

  {
    id: 'comprehensive',
    icon: '🏢',
    title: '종합부동산세 (종부세)',
    summary:
      '6월 1일 기준 인별 합산 공시가격이 기준 초과 시 부과. 공정시장가액비율 60% 유지, 1세대1주택자 12억/일반 9억 기본공제. 2주택 이하는 0.5~2.7%, 3주택 이상은 0.5~5.0%.',
    keyPoints: [
      {
        label: '기본공제',
        value: '1주택 12억 / 일반 9억',
        detail: '인별 공시가격 합산에서 차감. 부부 공동명의는 각자 9억씩 = 18억',
      },
      {
        label: '공정시장가액비율',
        value: '60%',
        detail: '2023년 80% → 60%로 인하 후 2026년에도 60% 유지',
      },
      {
        label: '세율 (2주택 이하)',
        value: '0.5% ~ 2.7%',
        detail: '과세표준 3억/6억/12억/25억/50억/94억 구간별 누진',
      },
      {
        label: '세율 (3주택 이상)',
        value: '0.5% ~ 5.0%',
        detail: '12억 초과부터 중과 적용 (12~25억 2.0% 등)',
      },
      {
        label: '1주택자 세액공제',
        value: '최대 80%',
        detail: '고령자 공제(20~40%) + 장기보유 공제(20~50%), 합산 80% 한도',
      },
    ],
    sources: [
      {
        label: '국세청 - 종합부동산세 세율',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2354&cntntsId=7736',
      },
      {
        label: '국세청 - 종부세 세액계산 흐름도',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7735&mi=2353',
      },
      {
        label: '국토교통부 - 종부세 정책',
        url: 'https://www.molit.go.kr/policy/stable/sta_b_01.jsp',
      },
    ],
  },

  {
    id: 'capitalGains',
    icon: '💰',
    title: '양도소득세 (Capital Gains Tax)',
    summary:
      '기본세율 6~45% 누진. 1세대1주택 12억 이하 비과세(2년 보유, 조정지역 2년 거주 추가). 다주택 중과 한시 유예는 2026년 5월 9일로 종료, 5월 10일부터 +20~30%p 중과 재개 예정.',
    keyPoints: [
      {
        label: '기본세율 (2년 이상)',
        value: '6% ~ 45%',
        detail:
          '1,400만/5,000만/8,800만/1.5억/3억/5억/10억 구간 누진. 누진공제 적용.',
      },
      {
        label: '단기보유 중과',
        value: '70% / 60%',
        detail: '1년 미만 70%, 1~2년 미만 60% (기본세율 비교 후 큰 금액)',
      },
      {
        label: '다주택 중과 재개',
        value: '2026.05.10 ~',
        detail:
          '한시 유예 종료. 조정대상지역 2주택자 +20%p, 3주택 이상 +30%p',
      },
      {
        label: '1세대1주택 비과세',
        value: '12억 이하',
        detail: '12억 초과분만 과세. 보유 2년, 조정지역은 거주 2년 추가 필요.',
      },
      {
        label: '장기보유특별공제',
        value: '최대 80%',
        detail:
          '일반: 보유 연 2%, 최대 30%(15년) / 1주택 특례: 보유 4%+거주 4%, 합산 80%',
      },
      {
        label: '기본공제',
        value: '연 250만원',
        detail: '인별·과세기간별 1회 한도',
      },
    ],
    sources: [
      {
        label: '국세청 - 양도소득세 세율',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2312&cntntsId=7711',
      },
      {
        label: '국세청 - 장기보유특별공제율',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2311&cntntsId=7710',
      },
      {
        label: '삼일 PwC - 다주택자 세금 가이드',
        url: 'https://www.pwc.com/kr/ko/insights/issue-brief/one-point-tax-05.html',
      },
    ],
  },
];

// 2026년 핵심 변화 요약 (정책 탭 상단 알림용)
export const KEY_CHANGES_2026 = [
  {
    date: '2026-01-01',
    title: '생애최초 주택 구입 취득세 감면 연장',
    description:
      '소득요건 폐지된 200만원 한도 감면이 유지되며, 인구감소지역은 300만원까지 확대됩니다.',
    importance: 'high',
  },
  {
    date: '2026-01-01',
    title: '1세대1주택자 재산세 특례세율 연장',
    description: '공시가격 9억 이하 1주택자 특례세율(-0.05%p)이 2026년 말까지 연장됩니다.',
    importance: 'medium',
  },
  {
    date: '2026-05-10',
    title: '다주택자 양도세 중과 재개 예정 ⚠️',
    description:
      '2022년부터 한시 유예됐던 다주택자 양도세 중과가 5월 9일로 종료. 5월 10일 이후 양도분부터 +20~30%p 중과세율이 다시 적용됩니다.',
    importance: 'critical',
  },
  {
    date: '2026',
    title: '종부세 공정시장가액비율 60% 유지',
    description: '공시가격 인상에 따라 실제 세액은 늘어날 수 있으나, 비율 자체는 60%로 동결.',
    importance: 'medium',
  },
];

export default { POLICY_OVERVIEW, POLICY_CATEGORIES, KEY_CHANGES_2026 };
