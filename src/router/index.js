import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import OnboardingView from '../views/OnboardingView.vue';
import HomeView from '../views/HomeView.vue';
import SearchView from '../views/SearchView.vue';
import TeacherProfileView from '../views/TeacherProfileView.vue';
import MyCareHistoryView from '../views/MyCareHistoryView.vue';
import ReCareApplyView from '../views/ReCareApplyView.vue';
import ProCareApplyView from '../views/ProCareApplyView.vue';
import ForgetPassView from '../views/ForgetPassView.vue';
import ResetPassView from '../views/ResetPassView.vue';
import CustomerServiceView from '../views/CustomerServiceView.vue';
import TermsView from '../views/TermsView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  // [수정 1] 대문(/)으로 들어오면 홈(/home)으로 가라고 지시
  // (하지만 아래 문지기가 로그인 안 했으면 로그인 창으로 보냄)
  { path: '/', redirect: '/home' }, 
  
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/onboarding', name: 'Onboarding', component: OnboardingView },
  { path: '/home', name: 'Home', component: HomeView },
  { path: '/teacher/:id', name: 'TeacherProfile', component: TeacherProfileView },
  { path: '/search', name: 'Search', component: SearchView },
  { path: '/history', name: 'MyCareHistory', component: MyCareHistoryView },
  { path: '/procareapply', name: 'ProCareApplyView', component: ProCareApplyView },
  { path: '/recareapply', name: 'ReCareApplyView', component: ReCareApplyView },
  { path: '/forgot-password', name: 'ForgetPassView', component: ForgetPassView },
  { path: '/reset-password', name: 'ResetPassView', component: ResetPassView },
  { path: '/customer-service', name: 'customer-service', component: CustomerServiceView },
  { path: '/terms', name: 'terms', component: TermsView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// [수정 2] 문지기(Navigation Guard) 설정
router.beforeEach((to, from, next) => {
  // 1. 로그인 여부 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // 2. 로그인이 필요 없는 페이지 목록 (여기는 그냥 통과)
  const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/terms', '/customer-service'];
  
  // 3. 현재 가려는 곳이 publicPages에 포함되는지 확인
  const authRequired = !publicPages.includes(to.path);

  // 4. 로그인이 필요한 페이지인데, 로그인을 안 했다면? -> 로그인 페이지로 납치
  if (authRequired && !isLoggedIn) {
    next('/login');
  } 
  // 5. 이미 로그인했는데 로그인 페이지로 가려고 하면? -> 홈으로 보냄 (선택사항)
  else if (isLoggedIn && (to.path === '/login' || to.path === '/signup')) {
    next('/home');
  }
  // 6. 그 외에는 정상 이동
  else {
    next();
  }
});

export default router;