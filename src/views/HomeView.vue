<template>
  <div class="home-page">
    <TheHeader />

    <main class="main-container">
      <section class="search-section">
        <div class="search-bar" @click="$router.push('/search')">
          <input type="text" placeholder="어떤 돌봄을 찾으시나요?" readonly>
          <span class="search-icon">🔍</span>
        </div>
      </section>

      <div class="content-grid">
        <section class="main-content-section">
          
          <div class="recommend-section">
            <div class="section-header-row">
              <h2>
                {{ isLoggedIn ? userName + '님을 위한 맞춤 선생님 ✨' : '맞춤 돌봄 선생님을 추천해드려요 ✨' }}
              </h2>
            </div>
            
            <div class="recommendation-grid">
              <div 
                v-for="teacher in recommendedTeachers" 
                :key="teacher.id" 
                class="teacher-card" 
                @click="$router.push('/teacher/'+teacher.id)"
              >
                <div class="teacher-photo">
                  <div class="placeholder-img"></div>
                </div>
                <div class="teacher-info">
                  <p class="name">{{ teacher.name }}</p>
                  <p class="location">📍 {{ teacher.location }}</p>
                  <p class="tags">{{ teacher.tags }}</p>
                  <p class="wage">{{ teacher.wage.toLocaleString() }}원/시</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        <aside class="sidebar-section">
          
          <div class="sidebar-card login-block" v-if="!isLoggedIn">
            <p>로그인하고<br>맞춤 정보를 확인하세요!</p>
            <BaseButton type="primary" @click="$router.push('/login')">로그인 / 회원가입</BaseButton>
          </div>

          <div class="sidebar-card user-info-block" v-else>
            <p class="welcome-msg">
              반가워요, <strong>{{ userName }}</strong>님! 👋
            </p>
            <div class="user-actions">
              <BaseButton type="primary" @click="$router.push('/history')">📋 내 돌봄 내역</BaseButton>
              <BaseButton type="outline" @click="$router.push('/profile/edit/parent')">⚙️ 내 정보 수정</BaseButton>
              <button class="logout-link" @click="logout">로그아웃</button>
            </div>
          </div>
          
          <div class="sidebar-card ad-block"><span>광고 영역</span></div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import BaseButton from '../components/BaseButton.vue'
import TheHeader from '../components/TheHeader.vue'

export default {
  components: { BaseButton, TheHeader },
  data() {
    return {
      isLoggedIn: false,
      userName: sessionStorage.getItem('userName') || '학부모',
      
      // 추천 선생님 데이터 (더미)
      recommendedTeachers: [
        { id: 1, name: '김선생님', location: '서울 강남구', wage: 15000, tags: '#실내놀이 #영어' },
        { id: 2, name: '이선생님', location: '서울 서초구', wage: 14000, tags: '#등하원 #책읽기' },
        { id: 3, name: '박선생님', location: '경기 성남시', wage: 13000, tags: '#학습지도 #한글' },
        { id: 4, name: '최선생님', location: '서울 송파구', wage: 16000, tags: '#체육 #야외활동' },
        { id: 5, name: '정선생님', location: '서울 마포구', wage: 15000, tags: '#미술 #만들기' },
        { id: 6, name: '강선생님', location: '서울 강동구', wage: 13500, tags: '#돌봄 #간식' }
      ]
    }
  },
  async mounted() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      this.isLoggedIn = true;
      try {
        // 유저 이름 가져오기
        const userRes = await axios.get('/api/user/me', {
           headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if(userRes.data.name) {
          this.userName = userRes.data.name;
          sessionStorage.setItem('userName', this.userName);
        }
      } catch (e) {
        console.warn("내 정보 로드 실패, 기본값 사용");
      }
    } else {
      this.isLoggedIn = false;
    }
  },
  methods: {
    logout() {
        if(confirm('로그아웃 하시겠습니까?')) {
          localStorage.removeItem('token');
          sessionStorage.clear();
          this.isLoggedIn = false;
          this.$router.push('/login');
        }
    }
  }
}
</script>

<style scoped>
/* 페이지 전체 스타일 */
.home-page { background-color: #f8f9fa; min-height: 100vh; }
.main-container { max-width: 1200px; margin: 0 auto; padding: 0 20px 60px 20px; }

/* 검색바 */
.search-section { padding: 40px 0; text-align: center; }
.search-bar { 
  max-width: 600px; margin: 0 auto; background: white; border-radius: 50px; 
  padding: 15px 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
  cursor: pointer; display: flex; align-items: center; border: 1px solid #eee; 
}
.search-bar input { width: 100%; border: none; font-size: 16px; outline: none; cursor: pointer; }
.search-icon { font-size: 1.2rem; }

/* 레이아웃 (왼쪽 컨텐츠 + 오른쪽 사이드바) */
.content-grid { display: flex; gap: 30px; align-items: flex-start; }
.main-content-section { flex: 3; }
.sidebar-section { flex: 1; min-width: 280px; position: sticky; top: 20px; }

/* 섹션 헤더 */
.section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header-row h2 { margin: 0; font-size: 1.4rem; color: #333; font-weight: 800; }

/* 추천 선생님 리스트 */
.recommend-section { margin-top: 0; }
.recommendation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }

.teacher-card { 
  background: white; border-radius: 15px; overflow: hidden; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s; border: 1px solid #f1f3f5;
}
.teacher-card:hover { transform: translateY(-5px); border-color: #FBBF24; }

.teacher-photo { height: 160px; background-color: #f1f3f5; position: relative; }
.placeholder-img { width: 100%; height: 100%; background: #e9ecef; display: flex; align-items: center; justify-content: center; color: #adb5bd; font-size: 2rem; }
.teacher-info { padding: 15px; }
.teacher-info .name { font-weight: bold; font-size: 1.1rem; margin: 0 0 5px 0; color: #333; }
.teacher-info .location { font-size: 0.9rem; color: #888; margin-bottom: 8px; }
.teacher-info .tags { font-size: 0.85rem; color: #666; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.teacher-info .wage { font-weight: bold; color: #F59E0B; font-size: 1rem; text-align: right; margin: 0; }

/* 사이드바 스타일 */
.sidebar-card { 
  background: white; border-radius: 20px; padding: 30px 25px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; margin-bottom: 20px; border: 1px solid #f1f3f5; 
}
.ad-block { height: 200px; background: #e9ecef; display: flex; align-items: center; justify-content: center; color: #adb5bd; font-weight: bold; }
.welcome-msg { font-size: 1.1rem; margin-bottom: 25px; color: #333; }
.welcome-msg strong { color: #F59E0B; font-size: 1.3rem; }
.user-actions { display: flex; flex-direction: column; gap: 12px; }
.logout-link { background: none; border: none; color: #adb5bd; text-decoration: underline; cursor: pointer; margin-top: 10px; font-size: 0.85rem; }

/* 반응형 */
@media (max-width: 900px) {
  .content-grid { flex-direction: column; }
  .main-content-section, .sidebar-section { width: 100%; }
  .sidebar-section { order: -1; margin-bottom: 20px; }
}
</style>