<template>
  <div>
    <TheHeader />
    <main class="auth-layout">
      <div class="login-card">
        <div class="logo">
          <span class="logo-icon">🔗</span>
          <span class="logo-text">아이Link</span>
        </div>
        <p class="tagline">아이와 세상을 연결하는 다리</p>

        <form @submit.prevent="login">
          <div class="input-group">
            <label for="identifier">이메일 (아이디)</label>
            <input 
              type="text" 
              id="identifier" 
              v-model="identifier" 
              placeholder="이메일 또는 휴대폰 번호 입력" 
              autocomplete="username"
            />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="비밀번호를 입력하세요" 
              autocomplete="current-password"
            />
          </div>

          <BaseButton type="primary" :disabled="isLoggingIn">
            {{ isLoggingIn ? '로그인 중...' : '로그인' }}
          </BaseButton>
        </form>

        <BaseButton @click="$router.push('/signup')" type="outline" style="margin-top: 10px;">회원가입</BaseButton>

        <router-link to="/forgot-password" class="footer-text">비밀번호를 잊으셨나요?</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue';

export default {
  components: {
    BaseButton,
    TheHeader
  },
  data() {
    return {
      identifier: '',
      password: '',
      isLoggingIn: false
    };
  },
  methods: {
    async login() {
      if (!this.identifier || !this.password) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }

      this.isLoggingIn = true;

      try {
        const formData = new URLSearchParams();
        formData.append('username', this.identifier);
        formData.append('password', this.password);

        // 1. 로그인 요청
        const response = await axios.post('/api/auth/token', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        // 2. 데이터 분해
        const { access_token, role, name, user_id } = response.data;

        // 3. [핵심] 죽어도 일단 실행해봄 (저장 시도)
        try {
          localStorage.setItem('isLoggedIn', 'true');
          if (access_token) localStorage.setItem('token', access_token);
          if (role) localStorage.setItem('userRole', role);
          if (user_id) localStorage.setItem('userId', user_id);
          
          const userName = name ? name : this.identifier.split('@')[0];
          localStorage.setItem('userName', userName);
        } catch (e) {
          console.error('저장소 에러 무시함:', e);
        }

        // 4. [강제 이동] Vue 라우터가 아니라 브라우저 자체를 이동시킴
        alert('로그인 성공! 홈으로 이동합니다.'); // 성공 확인용 알림
        window.location.href = '/'; // <--- 이게 "핵폭탄" 코드입니다. 무조건 이동합니다.

      } catch (error) {
        console.error('로그인 에러:', error);
        
        if (error.response) {
          if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
             console.log('ngrok 경고 페이지 (무시)');
          } else if (error.response.status === 401 || error.response.status === 400) {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
          } else {
            alert('로그인 중 오류가 발생했습니다.');
          }
        } else {
          alert('서버와 연결할 수 없습니다.');
        }
      } finally {
        this.isLoggingIn = false;
      }
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.auth-layout { display: flex; justify-content: center; align-items: center; padding: 60px 20px; min-height: calc(100vh - 75px); background-color: #f8f9fa; }
.login-card { width: 100%; max-width: 420px; padding: 40px; background-color: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); text-align: center; }
.logo { display: flex; justify-content: center; align-items: center; margin-bottom: 25px; }
.logo-icon { font-size: 38px; margin-right: 10px; color: #FFA726; }
.logo-text { font-size: 36px; font-weight: 800; color: #333; }
.tagline { font-size: 18px; color: #666; margin-bottom: 40px; line-height: 1.5; }
.input-group { text-align: left; margin-bottom: 20px; }
.input-group label { display: block; font-size: 14px; color: #555; margin-bottom: 8px; font-weight: 500; }
.input-group input { width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 10px; font-size: 16px; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
.input-group input:focus { outline: none; border-color: #FFA726; box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.2); }
.footer-text { font-size: 14px; color: #888; margin-top: 30px; cursor: pointer; text-decoration: none; display: inline-block; }
.footer-text:hover { color: #FFA726; text-decoration: underline; }
</style>