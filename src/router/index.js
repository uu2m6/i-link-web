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
import ParentProfileEdit from '../views/ParentProfileEdit.vue';
import TeacherProfileEdit from '../views/TeacherProfileEdit.vue';
import TeacherHomeView from '@/views/TeacherHomeView.vue';
import TeacherRequestDetailView from '../views/TeacherRequestDetailView.vue';
import TeacherHistoryView from '../views/TeacherHistoryView.vue';

const routes = [
  { path: '/', redirect: '/home' }, 
  
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/onboarding', name: 'Onboarding', component: OnboardingView },
  { path: '/home', name: 'Home', component: HomeView },
  
  // 선생님 프로필 상세 (학부모가 보는 화면)
  { path: '/teacher/:id', name: 'TeacherProfile', component: TeacherProfileView },
  
  { path: '/search', name: 'Search', component: SearchView },
  
  // 학부모용 내역
  { path: '/history', name: 'MyCareHistory', component: MyCareHistoryView },
  
  { path: '/procareapply', name: 'ProCareApplyView', component: ProCareApplyView },
  { path: '/recareapply', name: 'ReCareApplyView', component: ReCareApplyView },
  { path: '/forgot-password', name: 'ForgetPassView', component: ForgetPassView },
  { path: '/reset-password', name: 'ResetPassView', component: ResetPassView },
  { path: '/customer-service', name: 'customer-service', component: CustomerServiceView },
  { path: '/terms', name: 'terms', component: TermsView },

  // 프로필 수정
  { path: '/profile/edit/parent', name: 'ParentProfileEdit', component: ParentProfileEdit },
  { path: '/profile/edit/teacher', name: 'TeacherProfileEdit', component: TeacherProfileEdit },
  
  // 선생님 전용 페이지들
  { path: '/teacher-home', name: 'TeacherHome', component: TeacherHomeView },
  { path: '/teacher/request/:id', name: 'TeacherRequestDetail', component: TeacherRequestDetailView },
  
  // [중요] 선생님용 내역 페이지
  { path: '/teacher/history', name: 'TeacherHistory', component: TeacherHistoryView },

  // [필수 수정] 404 에러 페이지는 반드시 '가장 마지막'에 있어야 합니다.
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 로그인이 필요 없는 페이지 목록
  const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/terms', '/customer-service'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !isLoggedIn) {
    next('/login');
  } 
  else if (isLoggedIn && (to.path === '/login' || to.path === '/signup')) {
    next('/home');
  } 
  else {
    next();
  }
});

export default router;