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
            <BaseButton
              type="primary"
              @click="$router.push('/login')"
            >
              로그인 / 회원가입
            </BaseButton>
          </div>

          <div class="user-info-block" v-else>
            <p class="welcome-msg">
              반가워요, <strong>{{ userName }}</strong>님! 👋
            </p>

            <div class="user-actions">
              <BaseButton
                type="secondary"
                @click="$router.push('/history')"
              >
                내 돌봄 내역
              </BaseButton>

              <BaseButton
                type="outline"
                @click="$router.push('/profile/edit/parent')"
              >
                프로필 수정
              </BaseButton>

              <button class="logout-link" @click="logout">
                로그아웃
              </button>
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
import BaseButton from '../components/BaseButton.vue'
import TheHeader from '../components/TheHeader.vue'

export default {
  components: {
    BaseButton,
    TheHeader
  },
  data() {
    return {
      isLoggedIn: false,
      userName: sessionStorage.getItem('userName') || '학부모',
      recommendedTeachers: [
        { id: 1, name: '김선생님', tags: '#실내놀이 #영어' },
        { id: 2, name: '이선생님', tags: '#등하원 #책읽기' },
        { id: 3, name: '박선생님', tags: '#학습지도 #한글' },
        { id: 4, name: '최선생님', tags: '#야외활동 #미술' },
        { id: 5, name: '정선생님', tags: '#신생아 #실내놀이' },
        { id: 6, name: '강선생님', tags: '#등하원 #영어놀이' }
      ]
    }
  },
  mounted() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userName') || '회원';
    } else {
      this.isLoggedIn = false;
    }
  },
  methods: {
    logout() {
        localStorage.removeItem('token');
        sessionStorage.clear();
        this.isLoggedIn = false;
        this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.home-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px 20px;
}

.search-section {
  padding: 40px 0;
  text-align: center;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 50px;
  padding: 15px 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.search-bar:hover {
  border-color: #FBBF24;
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(251, 191, 36, 0.15);
}

.search-bar input {
  width: 100%;
  border: none;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  background: transparent;
  color: #333;
}

.content-grid {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.recommendation-section {
  flex: 3;
}

.recommendation-section h2 {
  font-size: 22px;
  font-weight: 800;
  color: #333;
  margin-bottom: 20px;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.teacher-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.teacher-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.teacher-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.teacher-photo {
  height: 160px;
  background-color: #f1f3f5; 
  background-image: url('https://via.placeholder.com/300x200?text=Teacher');
  background-size: cover;
  background-position: center;
}

.teacher-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.tags {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.sidebar-section {
  flex: 1;
  min-width: 300px;
  position: sticky;
  top: 20px;
}

.login-block,
.user-info-block,
.ad-block {
  background-color: white;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #f1f3f5;
}

.login-block p {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
  font-weight: 500;
}

.welcome-msg {
  font-size: 18px;
  margin-bottom: 25px;
  color: #333;
}
.welcome-msg strong {
  color: #F59E0B;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logout-link {
  background: none;
  border: none;
  color: #adb5bd;
  text-decoration: underline;
  cursor: pointer;
  font-size: 13px;
  margin-top: 15px;
  transition: color 0.2s;
}
.logout-link:hover {
  color: #868e96;
}

.ad-block {
  height: 200px;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #adb5bd;
  font-weight: bold;
}

@media (max-width: 900px) {
  .content-grid {
    flex-direction: column;
  }
  
  .recommendation-section,
  .sidebar-section {
    width: 100%;
    flex: none;
  }

  .sidebar-section {
    min-width: auto;
    position: static;
    order: -1;
  }

  .recommendation-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .recommendation-grid {
    grid-template-columns: 1fr;
  }
}
</style>