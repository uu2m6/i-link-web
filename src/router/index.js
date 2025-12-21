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
import axios from 'axios';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
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
  { path: '/profile/edit/parent', name: 'ParentProfileEdit', component: ParentProfileEdit },
  { path: '/profile/edit/teacher', name: 'TeacherProfileEdit', component: TeacherProfileEdit },
  { path: '/teacher-home', name: 'TeacherHome', component: TeacherHomeView },
  { path: '/teacher/request/:id', name: 'TeacherRequestDetail', component: TeacherRequestDetailView },
  { path: '/teacher/history', name: 'TeacherHistory', component: TeacherHistoryView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const role = sessionStorage.getItem('userRole'); 
  const token = localStorage.getItem('token');

  const publicPages = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/terms',
    '/customer-service'
  ];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !isLoggedIn) {
    next('/login');
    return;
  }

  if (isLoggedIn && (to.path === '/login' || to.path === '/signup')) {
    if (role === 'sitter') {
      try {
        const res = await axios.get('/api/user/me', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'
            }
        });
        
        const userData = res.data;
        if ((!userData.certifications || userData.certifications.length === 0) && to.path !== '/onboarding') {
             next('/onboarding');
             return;
        }
      } catch (e) {
        console.error(e);
      }
      next('/teacher-home');
    } else {
      next('/home');
    }
    return;
  }

  next();
});

export default router;