// 패럴랙스 속도: 0이면 일반 스크롤과 동일, 값이 클수록 배경이 더 느리게 움직임
const PARALLAX_SPEED = 0.35;

const progressBar = document.getElementById('progressBar');
const heroBg = document.getElementById('heroBg');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== [효과 1] 아래에서 위로 페이드인 =====
// 요소가 화면에 들어오면 is-visible 클래스를 붙이고, CSS transition이 애니메이션을 처리
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // 한 번 나타난 요소는 다시 감시하지 않음
    });
  },
  { rootMargin: '0px 0px -12% 0px' } // 화면 하단 12% 지점을 지날 때 시작
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== 스크롤에 따라 매 프레임 갱신되는 효과 =====
function updateOnScroll() {
  const scrollY = Math.max(window.scrollY, 0); // iOS 바운스로 음수가 되는 경우 방지

  // [효과 2] 히어로 배경 패럴랙스: 스크롤의 일부만큼 배경을 아래로 밀어 더 느리게 보이게 함
  if (!prefersReducedMotion) {
    heroBg.style.transform = `translate3d(0, ${scrollY * PARALLAX_SPEED}px, 0)`;
  }

  // [효과 3] 스크롤 진행률 프로그래스 바: 진행률(0~1)만큼 가로로 늘림
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0;
  progressBar.style.transform = `scaleX(${progress})`;

  ticking = false;
}

// 스크롤 이벤트가 몰려도 화면을 그리는 프레임당 한 번만 계산하도록 제한
let ticking = false;

function requestUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateOnScroll);
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
updateOnScroll(); // 새로고침으로 중간 위치에서 시작해도 바로 반영
