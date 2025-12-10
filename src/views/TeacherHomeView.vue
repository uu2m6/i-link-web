<template>
  <div class="home-container">
    <TheHeader /> <main class="main-content">
      <section class="welcome-banner">
        <h2>안녕하세요, {{ teacherName }} 선생님! ☀️</h2>
        <p>오늘도 아이들과 함께 행복한 시간을 만들어보세요.</p>
      </section>

      <section class="request-section">
        <div class="section-header">
          <h3>📨 최근 들어온 돌봄 신청</h3>
          <router-link to="/history" class="link-more">전체보기 ></router-link>
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
              <p>⏰ {{ req.time }} ({{ req.hours }}시간)</p>
              <p class="wage">💰 {{ req.totalPay.toLocaleString() }}원</p>
            </div>

            <button class="btn-check">확인하기</button>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stat-box">
          <span>이번 달 수익</span>
          <strong>540,000원</strong>
        </div>
        <div class="stat-box">
          <span>진행 확정</span>
          <strong>3건</strong>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'; // 헤더 경로에 맞게 수정

export default {
  components: { TheHeader },
  data() {
    return {
      teacherName: '김선생',
      allRequests: [] // 전체 데이터를 담을 곳
    };
  },
  computed: {
    // [핵심 로직] 전체 데이터 중 최신 6개만 자르기
    recentRequests() {
      // 날짜순 정렬 후 6개 자르기 (API가 정렬해서 준다면 slice만 해도 됨)
      return this.allRequests.slice(0, 6);
    }
  },
  mounted() {
    this.fetchRequests();
  },
  methods: {
    fetchRequests() {
      // API 호출 대신 더미 데이터 사용
      const dummyData = [
        { id: 101, parentName: '이영희', date: '2025-10-20', time: '14:00', hours: 3, location: '서울 강남구', totalPay: 45000, isNew: true },
        { id: 102, parentName: '박철수', date: '2025-10-21', time: '10:00', hours: 2, location: '서울 서초구', totalPay: 30000, isNew: true },
        { id: 103, parentName: '최민수', date: '2025-10-22', time: '16:00', hours: 4, location: '경기 성남시', totalPay: 60000, isNew: false },
        { id: 104, parentName: '강수진', date: '2025-10-23', time: '13:00', hours: 3, location: '서울 송파구', totalPay: 45000, isNew: false },
        { id: 105, parentName: '홍길동', date: '2025-10-25', time: '09:00', hours: 5, location: '서울 강동구', totalPay: 75000, isNew: false },
        { id: 106, parentName: '김나영', date: '2025-10-26', time: '18:00', hours: 2, location: '서울 마포구', totalPay: 30000, isNew: false },
        { id: 107, parentName: '오지호', date: '2025-10-28', time: '15:00', hours: 3, location: '서울 용산구', totalPay: 45000, isNew: false }, // 7번째라 안 보임
      ];
      this.allRequests = dummyData;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    },
    goToDetail(id) {
      // 신청 상세 페이지나 내역 페이지로 이동
      // this.$router.push(`/history`); 혹은
      this.$router.push(`/request/${id}`); // 상세 페이지가 있다면
    }
  }
};
</script>

<style scoped>
.home-container { background-color: #f8f9fa; min-height: 100vh; }
.main-content { max-width: 800px; margin: 0 auto; padding: 20px; }

/* 1. 배너 스타일 */
.welcome-banner {
  background-color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.welcome-banner h2 { margin: 0 0 10px 0; color: #333; }
.welcome-banner p { margin: 0; color: #666; }

/* 2. 섹션 공통 */
.request-section, .stats-section { margin-bottom: 30px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-header h3 { margin: 0; font-size: 1.2rem; font-weight: bold; }
.link-more { color: #868e96; text-decoration: none; font-size: 0.9rem; }
.link-more:hover { color: #333; }

/* 3. 그리드 카드 스타일 */
.request-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* 반응형 그리드 */
  gap: 15px;
}

.request-card {
  background: white; padding: 20px; border-radius: 12px;
  border: 1px solid #eee; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column; justify-content: space-between;
}
.request-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); }

.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.tag-new { background: #ff4d4f; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
.date { color: #888; font-size: 0.9rem; }
.parent-name { margin: 0 0 10px 0; font-size: 1.1rem; color: #333; }

.card-info p { margin: 5px 0; font-size: 0.95rem; color: #555; }
.card-info .wage { font-weight: bold; color: #4CAF50; margin-top: 10px; }

.btn-check {
  margin-top: 15px; width: 100%; padding: 8px;
  background-color: #f1f3f5; border: none; border-radius: 6px;
  color: #495057; font-weight: bold; cursor: pointer;
}
.btn-check:hover { background-color: #e9ecef; }

/* 4. 통계 박스 스타일 */
.stats-section { display: flex; gap: 15px; }
.stat-box {
  flex: 1; background: #4CAF50; color: white; padding: 20px;
  border-radius: 12px; display: flex; flex-direction: column; gap: 5px;
}
.stat-box span { font-size: 0.9rem; opacity: 0.9; }
.stat-box strong { font-size: 1.5rem; }

/* 모바일 대응 */
@media (max-width: 600px) {
  .request-grid { grid-template-columns: 1fr 1fr; } /* 모바일에서 2열 */
}
@media (max-width: 480px) {
  .request-grid { grid-template-columns: 1fr; } /* 아주 작은 화면 1열 */
}
</style>