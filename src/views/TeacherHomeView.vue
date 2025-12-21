<template>
  <div class="page-container">
    <TheHeader />
    
    <main class="main-container">
      <div class="content-grid">
        
        <section class="request-section">
          <h2>📋 들어온 돌봄 요청</h2>
          
          <div v-if="requests.length === 0" class="empty-state">
             <p>아직 들어온 요청이 없거나, 정보를 불러오는 중입니다.</p>
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

        <aside class="sidebar-section">
          <div class="user-info-block">
            <p class="welcome-msg">
              안녕하세요,<br><strong>{{ userName }}</strong> 선생님! 👩‍🏫
            </p>

            <div class="user-actions">
              <button class="action-btn primary" @click="$router.push('/onboarding')">
                📄 자격 증명 제출
              </button>

              <button class="action-btn outline" @click="$router.push('/profile/edit/teacher')">
                ⚙️ 프로필 수정
              </button>

              <button class="logout-link" @click="logout">
                로그아웃
              </button>
            </div>
          </div>
        </aside>

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
      userName: sessionStorage.getItem('userName') || '선생님',
      requests: []
    };
  },
  async mounted() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      alert('로그인 정보가 확인되지 않습니다. 다시 로그인해주세요.');
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userRole');
      this.$router.push('/login');
      return;
    }
    
    try {
      const userRes = await axios.get('/api/user/me', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true' 
        }
      });
      if (userRes.data.name) {
        this.userName = userRes.data.name;
        sessionStorage.setItem('userName', this.userName);
      }
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
          alert('로그인이 만료되었습니다.');
          this.logout();
      }
    }

    this.fetchRequests(token);
  },
  methods: {
    logout() {
      if(confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('token');
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },
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
    
    async fetchRequests(token) {
      try {
        const response = await axios.get('/api/match/teacher/requests', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        this.requests = response.data;

      } catch (error) {
        console.error(error);
        this.requests = []; 
      }
    }
  }
};
</script>

<style scoped>
.page-container { background-color: #f8f9fa; min-height: 100vh; }
.main-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

.content-grid {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.request-section {
  flex: 3;
}
.request-section h2 { font-size: 1.4rem; margin-bottom: 20px; color: #333; font-weight: 800; }

.empty-state { text-align: center; padding: 60px; color: #888; background: white; border-radius: 15px; border: 1px solid #eee; }

.card-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

.request-card { 
  background: white; 
  padding: 25px; 
  border-radius: 15px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
  cursor: pointer; 
  transition: all 0.2s; 
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
}
.request-card:hover { transform: translateY(-5px); border-color: #4CAF50; box-shadow: 0 8px 20px rgba(76, 175, 80, 0.1); }

.card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.badge.new { background-color: #ff5252; color: white; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; }
.date { color: #888; font-size: 0.9rem; }

.card-body h3 { margin: 0 0 12px 0; font-size: 1.15rem; color: #333; font-weight: 700; }
.info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #555; font-size: 0.95rem; }
.info-row .icon { width: 20px; text-align: center; }
.info-row.highlight { color: #2E7D32; font-weight: bold; margin-top: 12px; font-size: 1.1rem; }

.detail-btn { margin-top: auto; padding: 12px; background-color: #f1f8e9; border: none; border-radius: 10px; color: #2E7D32; font-weight: bold; cursor: pointer; margin-top: 20px; }
.detail-btn:hover { background-color: #dcedc8; }

.sidebar-section {
  flex: 1;
  min-width: 280px;
  position: sticky;
  top: 20px;
}

.user-info-block {
  background-color: white;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid #f1f3f5;
}

.welcome-msg { font-size: 1.1rem; margin-bottom: 25px; color: #333; line-height: 1.5; }
.welcome-msg strong { color: #4CAF50; font-size: 1.3rem; }

.user-actions { display: flex; flex-direction: column; gap: 12px; }

.action-btn {
  padding: 14px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
}
.action-btn.primary:hover { background-color: #43A047; transform: translateY(-2px); }

.action-btn.outline {
  background-color: white;
  border-color: #ddd;
  color: #555;
}
.action-btn.outline:hover { border-color: #4CAF50; color: #4CAF50; background-color: #f1f8e9; }

.logout-link {
  background: none;
  border: none;
  color: #adb5bd;
  text-decoration: underline;
  cursor: pointer;
  font-size: 13px;
  margin-top: 10px;
}
.logout-link:hover { color: #868e96; }

@media (max-width: 900px) {
  .content-grid { flex-direction: column-reverse; }
  .request-section, .sidebar-section { width: 100%; flex: none; }
  .sidebar-section { position: static; margin-bottom: 30px; }
}
</style>