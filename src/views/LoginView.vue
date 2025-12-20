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
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue';

export default {
  components: { BaseButton, TheHeader },
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

        // 1. 로그인 (토큰 발급)
        const response = await axios.post('/api/auth/token', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        const data = response.data;
        const token = data.access_token || data.token;
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', token);

        let userName = '회원';
        let userRole = 'parent';

        // 서버 응답에 이미 이름이 있는지 확인
        if (data.name) userName = data.name;
        if (data.role) userRole = data.role;

        // 2. 이름이 없다면 추가 요청 (주소 변경: users/me -> auth/me)
        if (userName === '회원') {
          try {
            // [수정] 404 에러가 났던 /api/users/me 대신 /api/auth/me 로 시도
            const meResponse = await axios.get('/api/auth/me', {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'
              }
            });
            
            if (meResponse.data.name) userName = meResponse.data.name;
            if (meResponse.data.role) userRole = meResponse.data.role;
            if (meResponse.data.id) localStorage.setItem('userId', meResponse.data.id);

          } catch (e) {
            // 여기서는 에러가 나도 무시하고 진행 (로그인은 시켜줘야 함)
            console.log('추가 정보 조회 실패, 기본값 사용');
          }
        }

        localStorage.setItem('userName', userName);
        localStorage.setItem('userRole', userRole);

        alert(`${userName}님 환영합니다!`);

        if (userRole === 'sitter') {
          this.$router.push('/teacher-home'); 
        } else {
          this.$router.push('/'); 
        }

      } catch (error) {
        console.error(error);
        alert('아이디 또는 비밀번호를 확인해주세요.');
      } finally {
        this.isLoggingIn = false;
      }
    }
  }
}
</script>

<style scoped>
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
</style>