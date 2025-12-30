<template>
  <div class="manage-page">
    <TheHeader />

    <main class="manage-container">
      <div class="page-header">
        <h1>📨 받은 돌봄 신청 내역</h1>
        <p>선생님에게 들어온 의뢰를 관리해보세요.</p>
      </div>

      <div class="tabs">
        <button 
          :class="{ active: currentFilter === 'all' }" 
          @click="changeFilter('all')"
        >
          전체
        </button>
        <button 
          :class="{ active: currentFilter === 'pending' }" 
          @click="changeFilter('pending')"
        >
          대기중 
        </button>
        <button 
          :class="{ active: currentFilter === 'confirmed' }" 
          @click="changeFilter('confirmed')"
        >
          확정됨
        </button>
      </div>

      <div v-if="isLoading" class="msg">내역을 불러오는 중입니다...</div>
      <div v-else-if="requests.length === 0" class="msg">해당하는 내역이 없습니다.</div>

      <div v-else class="request-list">
        <div
          v-for="req in requests"
          :key="req.match_id"
          class="request-card"
          :class="{ highlight: req.is_pending }"
          @click="goToDetail(req.match_id)"
        >
          <div class="card-header">
            <span class="parent-name">{{ req.parent_name }}</span>
            
            <span :class="['status-badge', req.status]">
              {{ req.display_status }}
            </span>
          </div>

          <div class="card-body">
            <p><strong>📍 장소:</strong> {{ req.location || '주소 정보 없음' }}</p>
            
            <p class="date-info">요청일: {{ req.date_time }}</p>
            
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import TheHeader from '../components/TheHeader.vue';

export default {
  components: { TheHeader },
  data() {
    return {
      currentFilter: 'all', 
      requests: [],
      isLoading: false
    };
  },
  async mounted() {
    await this.fetchRequests();
  },
  methods: {
    changeFilter(filter) {
      this.currentFilter = filter;
      this.fetchRequests();
    },

    async fetchRequests() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/api/match/sitter/list', {
          params: { filter_status: this.currentFilter },
          headers: { 
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true' 
          }
        });
        
        this.requests = res.data;

      } catch (error) {
        console.error("목록 로드 실패:", error);
      } finally {
        this.isLoading = false;
      }
    },

    goToDetail(matchId) {
      this.$router.push(`/teacher/request/${matchId}`);
    },
  }
}
</script>
<style scoped>
.manage-page { background-color: #f8f9fa; min-height: 100vh; }
.manage-container { max-width: 600px; margin: 0 auto; padding: 20px; }

.tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: #eee;
  border-radius: 8px;
  font-weight: bold;
}
.tabs button.active {
  background: #4CAF50;
  color: white;
}

.request-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #eee;
}
.request-card.highlight {
  border: 2px solid #FF9800;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.parent-name { font-weight: bold; }

.btn-chat {
  margin-top: 10px;
  background: none;
  border: none;
  color: #F59E0B;
  font-weight: bold;
  cursor: pointer;
}
.btn-chat:hover {
  text-decoration: underline;
}

.btn-report {
  margin-top: 10px;
  background: none;
  border: none;
  color: #ff4d4f;
  font-weight: bold;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.btn-accept {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
}
.btn-reject {
  background: #ffebee;
  color: #d32f2f;
  border: none;
  padding: 10px;
  border-radius: 8px;
}

.status-msg {
  margin-top: 15px;
  text-align: center;
  color: #888;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #888;
}
</style>
