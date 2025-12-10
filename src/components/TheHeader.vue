<template>
  <header class="main-header">
    <div class="logo" @click="goHome">
      <span class="logo-icon" v-if="showIcon">🔗</span>
      아이Link
    </div>

    <nav class="header-nav">
      <router-link to="/customer-service">고객센터</router-link>
      <span>|</span>
      <router-link to="/terms">이용규정</router-link>
      
      <span>|</span>
      <a @click="goToEditPage">내 정보 수정</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  props: {
    showIcon: { type: Boolean, default: false }
  },
  methods: {
    goHome() {
      this.$router.push('/'); 
    },
    // [추가] 내 정보 수정 페이지 이동 로직
    goToEditPage() {
      // 1. 로그인 정보 확인
      const userStr = localStorage.getItem('user');
      
      // 로그인이 안 되어 있다면 로그인 페이지로 이동
      if (!userStr) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }

      // 2. 유저 타입(학부모/선생님)에 따라 다른 페이지로 이동
      try {
        const user = JSON.parse(userStr);
        if (user.type === 'teacher') {
          this.$router.push('/profile/edit/teacher'); // 선생님용 수정 페이지
        } else {
          this.$router.push('/profile/edit/parent');  // 학부모용 수정 페이지
        }
      } catch (e) {
        console.error('유저 정보 파싱 오류', e);
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped>
.main-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background-color: white; border-bottom: 1px solid #e9ecef; height: 60px; box-sizing: border-box; }
.logo { font-size: 20px; font-weight: 800; color: #FBBF24; cursor: pointer; display: flex; align-items: center; }
.logo-icon { margin-right: 5px; font-size: 24px; }
.header-nav a { color: #868e96; font-size: 14px; text-decoration: none; cursor: pointer; transition: color 0.2s; }
.header-nav a:hover { color: #FBBF24; }
.header-nav span { margin: 0 10px; color: #dee2e6; }
</style>