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

// 채팅 관련 뷰
import ChatView from '../views/ChatView.vue';
import ChatListView from '../views/ChatListView.vue';
const routes = [
  {
    path: '/',
    redirect: '/login'
  },

  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/onboarding', name: 'Onboarding', component: OnboardingView },

  // 학부모 홈
  { path: '/home', name: 'Home', component: HomeView },

  // 선생님 프로필 (학부모가 보는 화면)
  { path: '/teacher/:id', name: 'TeacherProfile', component: TeacherProfileView },

  { path: '/search', name: 'Search', component: SearchView },

  // 학부모 내역
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

  // 선생님 전용
  { path: '/teacher-home', name: 'TeacherHome', component: TeacherHomeView },
  { path: '/teacher/request/:id', name: 'TeacherRequestDetail', component: TeacherRequestDetailView },
  { path: '/teacher/history', name: 'TeacherHistory', component: TeacherHistoryView },

  // 채팅
  { path: '/chats', name: 'ChatList', component: ChatListView }, // 채팅 목록
  { path: '/chat/:roomId', name: 'Chat', component: ChatView },  // 1:1 채팅방

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const role = sessionStorage.getItem('userRole'); // parent | sitter

  const publicPages = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/terms',
    '/customer-service'
  ];
  const authRequired = !publicPages.includes(to.path);

  // 로그인 안 했는데 보호 페이지 접근
  if (authRequired && !isLoggedIn) {
    next('/login');
    return;
  }

  // 로그인 상태에서 로그인/회원가입 접근 시
  if (isLoggedIn && (to.path === '/login' || to.path === '/signup')) {
    if (role === 'sitter') {
      next('/teacher-home');
    } else {
      next('/home');
    }
    return;
  }

  next();
});

export default router;
