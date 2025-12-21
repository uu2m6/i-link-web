<template>
  <div class="page-container">
    <TheHeader />
    
    <div class="content-wrapper">
      <header class="home-header">
        <h1>👋 안녕하세요, {{ userName }} 선생님!</h1>
        <p>오늘도 아이들과 행복한 시간을 만들어보세요.</p>
        
        <button class="cert-link-btn" @click="$router.push('/onboarding')">
          📄 자격 증명 서류 제출하기 >
        </button>
      </header>

      <section class="request-section">
        <h2>📋 들어온 돌봄 요청</h2>
        <div v-if="requests.length === 0" class="empty-state">
           <p>아직 들어온 요청이 없습니다.</p>
        </div>
        
        <div class="card-list">
          <div 
            v-for="req in requests" 
            :key="req.id" 
            class="request-card"
            @click="goToDetail(req.id)"
          >
            <div class="card-header">
              <span class="badge new">NEW</span>
              <span class="date">{{ formatDate(req.created_at) }}</span>
            </div>
            <div class="card-body">
              <h3>{{ req.parent_name }} 학부모님</h3>
              <div class="info-row">
                <span class="icon">📍</span>
                <span>{{ req.location }}</span>
              </div>
              <div class="info-row">
                <span class="icon">⏰</span>
                <span>{{ formatTime(req.start_time) }} ({{ req.duration }}시간)</span>
              </div>
              <div class="info-row highlight">
                <span class="icon">💰</span>
                <span>{{ formatPay(req.hourly_pay) }}원</span>
              </div>
            </div>
            <button class="detail-btn">확인하기</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';

export default {
  components: { TheHeader },
  data() {
    return {
      userName: '선생님',
      requests: []
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      this.$router.push('/login');
      return;
    }

    this.fetchRequests();
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    },
    formatTime(timeStr) {
      return timeStr ? timeStr.substring(0, 5) : '';
    },
    formatPay(pay) {
      return pay ? pay.toLocaleString() : '0';
    },
    goToDetail(id) {
      this.$router.push(`/teacher/request/${id}`);
    },
    
    async fetchRequests() {
      this.requests = [
        {
          id: 1,
          parent_name: '이영희',
          location: '서울 강남구 역삼동',
          start_time: '14:00:00',
          duration: 3,
          hourly_pay: 45000,
          created_at: '2025-10-20T09:00:00'
        },
        {
          id: 2,
          parent_name: '김철수',
          location: '서울 서초구 반포동',
          start_time: '10:00:00',
          duration: 4,
          hourly_pay: 60000,
          created_at: '2025-10-22T11:00:00'
        }
      ];
    }
  }
};
</script>

<style scoped>
.page-container { background-color: #f8f9fa; min-height: 100vh; }
.content-wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }

.home-header { 
  background-color: white; 
  padding: 30px 20px; 
  border-radius: 15px; 
  margin-bottom: 25px; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-align: center;
}
.home-header h1 { font-size: 1.4rem; color: #333; margin: 0 0 5px 0; }
.home-header p { color: #666; font-size: 0.95rem; margin-bottom: 20px; }

.cert-link-btn {
  background-color: #E8F5E9;
  color: #2E7D32;
  border: 1px solid #4CAF50;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.cert-link-btn:hover {
  background-color: #4CAF50;
  color: white;
}

.request-section h2 { font-size: 1.2rem; margin-bottom: 15px; color: #333; padding-left: 5px; }

.card-list { display: flex; flex-direction: column; gap: 15px; }

.request-card { 
  background: white; 
  padding: 20px; 
  border-radius: 12px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
  cursor: pointer; 
  transition: transform 0.2s; 
  border: 1px solid transparent;
}
.request-card:hover { transform: translateY(-3px); border-color: #4CAF50; }

.card-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.badge.new { background-color: #ff5252; color: white; font-size: 0.7rem; padding: 3px 6px; border-radius: 4px; font-weight: bold; }
.date { color: #888; font-size: 0.85rem; margin-left: auto; }

.card-body h3 { margin: 0 0 10px 0; font-size: 1.1rem; color: #333; }
.info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #555; font-size: 0.95rem; }
.info-row .icon { width: 20px; text-align: center; }
.info-row.highlight { color: #2E7D32; font-weight: bold; margin-top: 10px; }

.detail-btn { width: 100%; margin-top: 15px; padding: 10px; background-color: #f1f3f5; border: none; border-radius: 8px; color: #495057; font-weight: bold; cursor: pointer; }
.detail-btn:hover { background-color: #e9ecef; }

.empty-state { text-align: center; padding: 40px; color: #888; background: white; border-radius: 12px; }
</style>