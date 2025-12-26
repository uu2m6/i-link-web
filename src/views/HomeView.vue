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
          
          <div v-if="!isLoggedIn">
            <h2>맞춤 돌봄 선생님을 추천해드려요 ✨</h2>
            <div class="recommendation-grid">
              <div v-for="teacher in recommendedTeachers" :key="teacher.id" class="teacher-card" @click="$router.push('/teacher/'+teacher.id)">
                <div class="teacher-photo"></div>
                <div class="teacher-info">
                  <p class="name">{{ teacher.name }}</p>
                  <p class="tags">{{ teacher.tags }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="section-header-row">
              <h2>📋 내 돌봄 신청 현황</h2>
              <button class="view-history-link" @click="$router.push('/history')">
                전체 내역 보기 >
              </button>
            </div>
            
            <div v-if="myMatches.length === 0" class="empty-state">
              <p>신청한 돌봄 내역이 없습니다.</p>
              <button class="apply-btn" @click="$router.push('/search')">선생님 찾으러 가기</button>
            </div>

            <div class="match-list" v-else>
              <div v-for="match in myMatches" :key="match.match_id" class="match-card">
                <div class="match-header">
                  <span class="status-badge" :class="getStatusClass(match.status_tag)">
                    {{ match.status_tag }}
                  </span>
                  <span class="date">{{ match.date_info }}</span>
                </div>
                <div class="match-body">
                  <h3>{{ match.sitter_name }}</h3>
                  <p>{{ match.status_description }}</p>
                </div>
                <button v-if="match.show_review_button" class="action-btn">후기 작성</button>
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
      // 더미 데이터 (화면 확인용)
      myMatches: [
        {
          match_id: 101,
          sitter_name: '김민지 선생님',
          status_tag: '승인 대기',
          status_description: '선생님 수락을 기다리고 있습니다.',
          date_info: '2025.12.25 (예정)',
          show_review_button: false
        },
        {
          match_id: 102,
          sitter_name: '이수현 선생님',
          status_tag: '진행중',
          status_description: '현재 돌봄 서비스가 진행 중입니다.',
          date_info: '2025.12.20 ~ 진행중',
          show_review_button: false
        },
        {
          match_id: 103,
          sitter_name: '박지성 선생님',
          status_tag: '종료됨',
          status_description: '돌봄이 종료되었습니다.',
          date_info: '2025.12.10',
          show_review_button: true
        }
      ], 
      recommendedTeachers: [
        { id: 1, name: '김선생님', tags: '#실내놀이 #영어' },
        { id: 2, name: '이선생님', tags: '#등하원 #책읽기' },
        { id: 3, name: '박선생님', tags: '#학습지도 #한글' }
      ]
    }
  },
  async mounted() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      this.isLoggedIn = true;
      
      try {
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
      
      // 실제 API가 연결되면 아래 주석을 해제하여 사용
      // await this.fetchMyMatches(token);

    } else {
      this.isLoggedIn = false;
    }
  },
  methods: {
    async fetchMyMatches(token) {
      try {
        const res = await axios.get('/api/match/parent/list', {
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.data && res.data.length > 0) {
            this.myMatches = res.data;
        }
      } catch (error) {
        console.error("매칭 내역 로드 실패:", error);
      }
    },
    logout() {
        if(confirm('로그아웃 하시겠습니까?')) {
          localStorage.removeItem('token');
          sessionStorage.clear();
          this.isLoggedIn = false;
          this.$router.push('/login');
        }
    },
    getStatusClass(status) {
      if (status === '진행중') return 'ongoing';
      if (status === '종료됨') return 'done';
      return 'pending'; // 승인 대기
    }
  }
}
</script>

<style scoped>
/* 페이지 전체 배경 */
.home-page { 
  background-color: #f8f9fa; 
  min-height: 100vh; 
}

/* 메인 컨테이너 */
.main-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 20px 60px 20px; 
}

/* 검색바 영역 */
.search-section { padding: 40px 0; text-align: center; }
.search-bar { 
  max-width: 600px; 
  margin: 0 auto; 
  background: white; 
  border-radius: 50px; 
  padding: 15px 25px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  border: 1px solid #eee; 
  transition: box-shadow 0.2s;
}
.search-bar:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.search-bar input { width: 100%; border: none; font-size: 16px; outline: none; cursor: pointer; }
.search-icon { font-size: 1.2rem; }

/* 레이아웃 그리드 (왼쪽: 메인, 오른쪽: 사이드바) */
.content-grid { 
  display: flex; 
  gap: 30px; 
  align-items: flex-start; /* 위쪽 정렬 */
}

.main-content-section { flex: 3; } /* 왼쪽 넓게 */
.sidebar-section { 
  flex: 1; 
  min-width: 280px; 
  position: sticky; 
  top: 20px; 
} /* 오른쪽 좁게 */

/* 섹션 헤더 (제목 + 전체보기 버튼) */
.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-header-row h2 { margin: 0; font-size: 1.4rem; color: #333; font-weight: 800; }
.view-history-link {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
}
.view-history-link:hover { color: #F59E0B; text-decoration: underline; }

/* 카드 스타일 (중요) */
.match-list { display: flex; flex-direction: column; gap: 20px; }

.match-card { 
  background: white; 
  padding: 25px; 
  border-radius: 15px; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.03); 
  border: 1px solid #eee; 
  transition: transform 0.2s;
}
.match-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); }

.match-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.status-badge { padding: 5px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
/* 상태별 뱃지 색상 */
.status-badge.pending { background: #FFF3E0; color: #F57C00; } /* 주황 */
.status-badge.ongoing { background: #E8F5E9; color: #2E7D32; } /* 초록 */
.status-badge.done { background: #F1F3F5; color: #868E96; } /* 회색 */

.date { font-size: 0.9rem; color: #999; }

.match-body h3 { margin: 0 0 8px 0; font-size: 1.2rem; color: #333; font-weight: 700; }
.match-body p { margin: 0; color: #666; font-size: 0.95rem; }

.action-btn { 
  margin-top: 15px; 
  padding: 10px 16px; 
  background: #FFF8E1; 
  color: #F59E0B; 
  border: 1px solid #FFE082; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: bold; 
  font-size: 0.9rem;
}
.action-btn:hover { background: #FFECB3; }

/* 빈 상태 */
.empty-state { background: white; padding: 60px; border-radius: 15px; text-align: center; color: #888; border: 1px solid #eee; }
.apply-btn { margin-top: 20px; padding: 12px 24px; background: #FBBF24; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 1rem; }
.apply-btn:hover { background-color: #F59E0B; }

/* 사이드바 스타일 */
.sidebar-card {
  background: white; 
  border-radius: 20px; 
  padding: 30px 25px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
  text-align: center; 
  margin-bottom: 20px; 
  border: 1px solid #f1f3f5; 
}
.ad-block { height: 180px; background: #e9ecef; display: flex; align-items: center; justify-content: center; color: #adb5bd; font-weight: bold; }

.welcome-msg { font-size: 1.1rem; margin-bottom: 25px; color: #333; }
.welcome-msg strong { color: #F59E0B; font-size: 1.3rem; }

.user-actions { display: flex; flex-direction: column; gap: 12px; }
.logout-link { background: none; border: none; color: #adb5bd; text-decoration: underline; cursor: pointer; margin-top: 10px; font-size: 0.85rem; }

/* 반응형 (모바일) */
@media (max-width: 900px) {
  .content-grid { flex-direction: column; }
  .main-content-section, .sidebar-section { width: 100%; }
  .sidebar-section { order: -1; margin-bottom: 20px; }
}
</style>