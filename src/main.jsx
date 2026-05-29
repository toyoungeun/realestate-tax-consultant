import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

/**
 * 하루에 한 번 강제 새로고침 (캐시 무시)
 *
 *  - 정적 호스팅(GitHub Pages)에서 브라우저가 index.html / JS 번들을 캐싱하면
 *    배포된 최신 정책 데이터가 즉시 반영되지 않는 문제 방지.
 *  - 같은 날 두 번째 방문부터는 새로고침하지 않음.
 *  - 같은 세션 내 reload 루프 방지를 위해 sessionStorage 가드 사용.
 */
(function dailyFreshLoad() {
  try {
    // KST 기준 YYYY-MM-DD
    const todayKst = new Date(Date.now() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const KEY_LAST = 'rtc.lastFreshLoadDate';
    const KEY_GUARD = 'rtc.refreshedThisSession';
    const last = localStorage.getItem(KEY_LAST);

    if (last !== todayKst && !sessionStorage.getItem(KEY_GUARD)) {
      // 첫 방문이거나 어제와 다른 날 → 캐시 무시 새로고침 1회
      localStorage.setItem(KEY_LAST, todayKst);
      sessionStorage.setItem(KEY_GUARD, '1');

      // 캐시 버스팅 쿼리(?v=YYYY-MM-DD)로 index.html을 새로 받음
      const url = new URL(window.location.href);
      url.searchParams.set('v', todayKst);
      window.location.replace(url.toString());
      return; // 이후 코드는 새 로드에서 실행
    }

    // 화면 어딘가에서 노출할 수 있도록 글로벌 변수로 저장
    window.__RTC_DATA_DATE__ = todayKst;
  } catch (e) {
    // localStorage 등 사용 불가 환경에선 조용히 무시
    console.warn('daily fresh-load skipped:', e);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
