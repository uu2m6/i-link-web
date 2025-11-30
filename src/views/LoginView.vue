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

        <div class="input-group">
          <label for="identifier">이메일 또는 휴대폰 번호</label>
          <input type="text" id="identifier" v-model="identifier" placeholder="이메일 또는 휴대폰 번호 입력" />
        </div>

        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요" />
        </div>

        <BaseButton @click="login" type="primary">로그인</BaseButton>
        <BaseButton @click="$router.push('/signup')" type="outline">회원가입</BaseButton>

        <router-link to="/forgot-password" class="footer-text">비밀번호를 잊으셨나요?</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue'; // 헤더 컴포넌트 추가

export default {
  emits: ['show-modal'],
  components: {
    BaseButton,
    TheHeader // 헤더 컴포넌트 등록
  },
  data() {
    return {
      identifier: '',
      password: '',
    };
  },
// <script> 부분의 methods를 이렇게 수정하세요

methods: {
  login() {
    console.log('로그인 시도:', this.identifier, this.password);

    // [수정됨] 로그인 성공 시 브라우저에 저장 (임시 토큰 역할)
    localStorage.setItem('isLoggedIn', 'true'); 
    localStorage.setItem('userName', '홍길동'); // 사용자 이름 예시

    const isFirstLogin = true; 
    const userType = 'teacher'; 

    if (isFirstLogin && userType === 'teacher') {
      this.$router.push('/onboarding');
    } else {
      this.$router.push('/'); // 홈으로 이동
    }
  }
}
}
</script>

<style scoped>
/* 새롭게 변경된 레이아웃 스타일 */
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px; /* 헤더 아래 여백 */
  min-height: calc(100vh - 75px); /* 헤더 높이를 제외한 전체 높이 */
  background-color: #f8f9fa; /* 순백색(#fff) 대신 아주 연한 회색 배경 */
}

/* 기존 카드 스타일은 거의 그대로 유지 (그림자 효과가 흰색 카드와 배경을 구분해줌) */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background-color: white; /* 카드는 순백색 */
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}
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