<template>
  <div class="home-container">
    <TheHeader /> 
    
    <main class="main-content">
      <section class="welcome-banner">
        <div class="banner-text">
          <h2>안녕하세요, {{ teacherName }} 선생님! ☀️</h2>
          <p>오늘도 아이들과 함께 행복한 시간을 만들어보세요.</p>
        </div>
        
        <button class="btn-edit-profile" @click="$router.push('/profile/edit/teacher')">
          ✏️ 내 정보 수정
        </button>
      </section>

      <section class="request-section">
        <div class="section-header">
          <h3>📨 최근 들어온 돌봄 신청</h3>
          <router-link to="/teacher/history" class="link-more">전체보기 ></router-link>
        </div>

        <div v-if="recentRequests.length === 0" class="empty-state">
          <p>아직 도착한 신청이 없어요.</p>
        </div>

        <div v-else class="request-grid">
          <div 
            v-for="req in recentRequests" 
            :key="req.id" 
            class="request-card"
            @click="goToDetail(req.id)"
          >
            <div class="card-header">
              <span class="tag-new" v-if="req.isNew">NEW</span>
              <span class="date">{{ formatDate(req.date) }}</span>
            </div>
            
            <h4 class="parent-name">{{ req.parentName }} 학부모님</h4>
            
            <div class="card-info">
              <p>📍 {{ req.location }}</p>
              <p>⏰ {{ req.time }}</p>
              <p class="wage">💰 {{ req.pay.toLocaleString() }}원</p>
            </div>

            <button class="btn-check">확인하기</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';

export default {
  components: { TheHeader },
  data() {
    return {
      teacherName: '',
      recentRequests: [
        {
          id: 1,
          isNew: true,
          date: '2025-10-20',
          parentName: '이영희',
          location: '서울 강남구 역삼동',
          time: '14:00 (3시간)',
          pay: 45000
        },
        {
          id: 2,
          isNew: false,
          date: '2025-10-22',
          parentName: '김철수',
          location: '서울 서초구 반포동',
          time: '10:00 (4시간)',
          pay: 60000
        },
        // [테스트용] 카드가 가로로 잘 뜨는지 확인하기 위해 더미 데이터 추가
        {
          id: 3,
          isNew: false,
          date: '2025-10-23',
          parentName: '박민수',
          location: '서울 송파구 잠실동',
          time: '13:00 (2시간)',
          pay: 30000
        },
        {
          id: 4,
          isNew: true,
          date: '2025-10-25',
          parentName: '최유리',
          location: '서울 강동구 천호동',
          time: '09:00 (5시간)',
          pay: 75000
        }
      ]
    };
  },
  mounted() {
    this.teacherName = localStorage.getItem('userName') || '선생님';
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    },
    goToDetail(id) {
      this.$router.push(`/teacher/request/${id}`);
    }
  }
};
</script>

<style scoped>
.home-container { background-color: #f8f9fa; min-height: 100vh; }

/* [수정 1] 컨테이너 너비를 600px -> 1200px로 넓힘 */
.main-content { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 20px; 
}

.welcome-banner {
  background-color: #4CAF50;
  color: white;
  padding: 30px 25px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 20px rgba(76, 175, 80, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-banner h2 { font-size: 1.5rem; margin-bottom: 10px; font-weight: 800; }
.welcome-banner p { font-size: 1rem; opacity: 0.9; }

.btn-edit-profile {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px 15px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  transition: background 0.2s;
}
.btn-edit-profile:hover { background-color: rgba(255, 255, 255, 0.3); }

.request-section { margin-top: 20px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-header h3 { font-size: 1.2rem; color: #333; font-weight: 700; }
.link-more { color: #888; font-size: 0.9rem; text-decoration: none; }

.empty-state { text-align: center; color: #aaa; padding: 40px; background: white; border-radius: 15px; }

/* [수정 2] 그리드 설정: 한 줄에 3개씩 배치 (반응형) */
.request-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); /* PC에서는 3개씩 */
  gap: 20px; 
}

.request-card {
  background: white; padding: 20px; border-radius: 15px;
  border: 1px solid #eee; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column; justify-content: space-between;
}
.request-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); }

.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.tag-new { background: #ff4d4f; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
.date { color: #888; font-size: 0.9rem; }
.parent-name { margin: 0 0 10px 0; font-size: 1.1rem; color: #333; }

.card-info p { margin: 5px 0; font-size: 0.95rem; color: #555; }
.card-info .wage { font-weight: bold; color: #4CAF50; margin-top: 10px; }

.btn-check {
  margin-top: 15px; width: 100%; padding: 8px;
  background-color: #f1f3f5; border: none; border-radius: 6px;
  color: #555; font-weight: bold; cursor: pointer;
}
.btn-check:hover { background-color: #e9ecef; }

/* [수정 3] 모바일 화면(폭 900px 이하)에서는 다시 세로로 1개씩 보이게 설정 */
@media (max-width: 900px) {
  .request-grid {
    grid-template-columns: 1fr; /* 모바일: 1열 */
  }
}
</style>