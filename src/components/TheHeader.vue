<template>
  <div class="home-page">
    <TheHeader />

    <main class="main-container">
      <section class="search-section">
        <div class="search-bar" @click="$router.push('/search')">
          <input type="text" placeholder="어떤 돌봄을 찾으시나요?" readonly>
        </div>
      </section>

      <div class="content-grid">
        <section class="recommendation-section">
          <h2>맞춤 돌봄 선생님을 추천해드려요 ✨</h2>
          <div class="recommendation-grid">
            <router-link 
              v-for="teacher in recommendedTeachers" 
              :key="teacher.id" 
              :to="'/teacher/' + teacher.id"
              class="teacher-card-link"
            >
              <div class="teacher-card">
                <div class="teacher-photo"></div>
                <div class="teacher-info">
                  <p class="name">{{ teacher.name }}</p>
                  <p class="tags">{{ teacher.tags }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <aside class="sidebar-section">
          
          <div class="login-block" v-if="!isLoggedIn">
            <p>로그인하고<br>맞춤 정보를 확인하세요!</p>
            <BaseButton @click="$router.push('/login')" type="primary">로그인 / 회원가입</BaseButton>
          </div>

          <div class="user-info-block" v-else>
            <p class="welcome-msg">반가워요, <strong>{{ userName }}</strong>님! 👋</p>
            <div class="user-actions">
              <BaseButton @click="$router.push('/history')" type="secondary">내 돌봄 내역</BaseButton>
              
              <BaseButton @click="$router.push('/parent/profile/edit')" type="outline" style="margin-top: 8px;">
                내 정보 수정
              </BaseButton>

              <button class="logout-link" @click="logout">로그아웃</button>
            </div>
          </div>

          <div class="ad-block">
            <span>광고</span>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue';

export default {
  components: {
    BaseButton,
    TheHeader
  },
  data() {
    return {
      isLoggedIn: false, 
      userName: '',
      recommendedTeachers: [
        { id: 1, name: '김선생님', tags: '#실내놀이 #영어' },
        { id: 2, name: '이선생님', tags: '#등하원 #책읽기' },
        { id: 3, name: '박선생님', tags: '#학습지도 #한글' },
        { id: 4, name: '최선생님', tags: '#야외활동 #미술' },
        { id: 5, name: '정선생님', tags: '#신생아 #실내놀이' },
        { id: 6, name: '강선생님', tags: '#등하원 #영어놀이' },
      ]
    };
  },
 
  mounted() {
    const checkLogin = localStorage.getItem('isLoggedIn');
    if (checkLogin === 'true') {
      this.isLoggedIn = true;
      this.userName = localStorage.getItem('userName') || '회원';
    }
  },
  methods: {
   
    logout() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      this.isLoggedIn = false;
      this.userName = '';
      alert('로그아웃 되었습니다.');
     
      this.$router.go();
    }
  }
}
</script>

<style scoped>

.home-page { background-color: #f8f9fa; }
.main-container { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }
.search-section .search-bar { width: 100%; max-width: 700px; margin: 0 auto 40px auto; background-color: white; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); padding: 8px; cursor: pointer; transition: transform 0.2s; }
.search-section .search-bar:hover { transform: scale(1.02); }
.search-section input { width: 100%; border: none; padding: 15px 25px; border-radius: 50px; font-size: 18px; background-color: transparent; cursor: pointer; }
.search-section input:focus { outline: none; }
.content-grid { display: grid; grid-template-columns: 3fr 1fr; gap: 30px; }
.recommendation-section h2 { font-size: 24px; font-weight: 700; margin-bottom: 25px; }
.recommendation-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; }
.teacher-card { background-color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; width: 100%; height: 100%; }
.teacher-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }
.teacher-photo { height: 180px; background-color: #e9ecef; }
.teacher-info { padding: 20px; }
.teacher-info .name { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.teacher-info .tags { font-size: 14px; color: #868e96; }
.teacher-card-link { text-decoration: none; color: inherit; }
.sidebar-section { display: flex; flex-direction: column; gap: 30px; }
.login-block, .ad-block { background-color: white; border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
.login-block p { font-size: 16px; margin-bottom: 20px; line-height: 1.6; }
.ad-block { display: flex; justify-content: center; align-items: center; min-height: 200px; color: #adb5bd; }


.user-info-block {
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.welcome-msg {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}
.user-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.logout-link {
  background: none;
  border: none;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
  font-size: 13px;
}
.logout-link:hover { color: #333; }


@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
  .sidebar-section { display: none; }
}
</style>