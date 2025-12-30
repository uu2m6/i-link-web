<template>
  <div class="page-container">
    <TheHeader />
    
    <main class="main-container">
      <div class="content-grid">
        
        <section class="request-section">
          <div class="section-header-row">
            <h2>📋 들어온 돌봄 요청 (대기중)</h2>
            <button class="view-history-link" @click="$router.push('/teacher/history')">
              전체보기 >
            </button>
          </div>
          
          <div v-if="isLoading" class="loading-state">
             <p>요청 내역을 불러오는 중입니다...</p>
          </div>
          <div v-else-if="requests.length === 0" class="empty-state">
             <p>현재 대기 중인 요청이 없습니다.</p>
          </div>
          
          <div v-else class="card-list">
            <div 
              v-for="req in requests" 
              :key="req.match_id" 
              class="request-card"
              @click="goToDetail(req.match_id)"
            >
              <div class="card-header">
                <span class="badge new">NEW</span>
                <span class="date">{{ req.date_time }}</span>
              </div>
              <div class="card-body">
                <h3>{{ req.parent_name }}</h3>
                <div class="info-row">
                  <span class="icon">📍</span>
                  <span>{{ req.location || '주소 정보 없음' }}</span>
                </div>
                
                <div class="info-row">
                  <span class="icon">🔖</span>
                  <span>{{ req.display_status }}</span>
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
              <button 
                class="action-btn" 
                :class="certBtnClass"
                @click="handleCertClick"
              >
                {{ certBtnText }}
              </button>

              <button class="action-btn outline" @click="$router.push('/teacher/history')">
                📂 내역 관리
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
      certStatus: {
        registered: false,
        verified: false
      },
      requests: [],
      isLoading: false
    };
  },
  computed: {
    certBtnClass() {
      if (this.certStatus.verified) return 'verified'; 
      if (this.certStatus.registered) return 'pending';
      return 'primary';
    },
    certBtnText() {
      if (this.certStatus.verified) return '✅ 자격 인증 완료';
      if (this.certStatus.registered) return '⏳ 심사 대기 중';
      return '📄 자격 증명 제출';
    }
  },
  async mounted() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      alert('로그인 정보가 확인되지 않습니다. 다시 로그인해주세요.');
      this.logout();
      return;
    }

    this.fetchCertStatus(token);
    this.fetchRequests(token);
  },
  methods: {
    async fetchCertStatus(token) {
      try {
        const res = await axios.get('/api/certificate/me', {
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        this.certStatus.registered = res.data.certificate_registered; 
        this.certStatus.verified = res.data.is_verified; 
      } catch (error) {
        console.warn("증명서 상태 확인 실패:", error);
      }
    },

    async fetchRequests(token) {
      this.isLoading = true;
      try {

        const res = await axios.get('/api/match/sitter/list', {
          params: { filter_status: 'pending' },
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });

        this.requests = res.data;
        
      } catch (error) {
        console.error("요청 리스트 로드 실패:", error);
      } finally {
        this.isLoading = false;
      }
    },

    handleCertClick() {
      if (this.certStatus.verified) {
        alert("이미 자격 인증이 완료되었습니다. 활동이 가능합니다! 🎉");
      } else if (this.certStatus.registered) {
        alert("제출하신 서류를 관리자가 심사 중입니다. 조금만 기다려주세요.");
      } else {
        this.$router.push('/onboarding');
      }
    },

    logout() {
      if(confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('token');
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },
    
    goToDetail(id) {
      this.$router.push(`/teacher/request/${id}`);
    }
  }
};
</script>
<style scoped>
/* 페이지 기본 배경 */
.page-container { background-color: #f8f9fa; min-height: 100vh; }
.main-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

/* 그리드 레이아웃 (좌: 요청목록, 우: 사이드바) */
.content-grid {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* --- 왼쪽 섹션 --- */
.request-section { flex: 3; }

.section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header-row h2 { margin: 0; font-size: 1.4rem; color: #333; font-weight: 800; }
.view-history-link { background: none; border: none; color: #666; font-weight: bold; cursor: pointer; font-size: 0.95rem; }
.view-history-link:hover { color: #4CAF50; text-decoration: underline; }

.empty-state { text-align: center; padding: 60px; color: #888; background: white; border-radius: 15px; border: 1px solid #eee; }

/* 카드 리스트 그리드 */
.card-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

/* 개별 요청 카드 스타일 */
.request-card { 
  background: white; padding: 25px; border-radius: 15px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s; 
  border: 1px solid #f1f3f5; display: flex; flex-direction: column;
}
.request-card:hover { transform: translateY(-5px); border-color: #4CAF50; box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15); }

.card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.badge.new { background-color: #ff5252; color: white; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; }
.date { color: #888; font-size: 0.9rem; }

.card-body h3 { margin: 0 0 12px 0; font-size: 1.15rem; color: #333; font-weight: 700; }
.info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #555; font-size: 0.95rem; }
.info-row.highlight { color: #2E7D32; font-weight: bold; margin-top: 12px; font-size: 1.1rem; }

.detail-btn { 
  margin-top: auto; padding: 12px; 
  background-color: #f1f8e9; border: none; border-radius: 10px; 
  color: #2E7D32; font-weight: bold; cursor: pointer; margin-top: 20px; 
  transition: background 0.2s;
}
.detail-btn:hover { background-color: #dcedc8; }

/* --- 오른쪽 사이드바 --- */
.sidebar-section {
  flex: 1;
  min-width: 280px;
  position: sticky;
  top: 20px;
}
.user-info-block {
  background-color: white; border-radius: 20px; padding: 30px 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); text-align: center; border: 1px solid #f1f3f5;
}
.welcome-msg { font-size: 1.1rem; margin-bottom: 25px; color: #333; line-height: 1.5; }
.welcome-msg strong { color: #4CAF50; font-size: 1.3rem; }

.user-actions { display: flex; flex-direction: column; gap: 12px; }

/* 사이드바 버튼 스타일 */
.action-btn {
  padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer;
  font-size: 0.95rem; transition: all 0.2s; border: 1px solid transparent; width: 100%;
}
.action-btn.primary { background-color: #4CAF50; color: #ffffff; }
.action-btn.pending { background-color: #E8F5E9; color: #2E7D32; cursor: default; }
.action-btn.verified { background-color: #E8F5E9; color: #2E7D32; cursor: default; border: 1px solid #C8E6C9; }

.action-btn.outline { background-color: #FFFFFF; border: 1px solid #ddd; color: #555; }
.action-btn.outline:hover { border-color: #4CAF50; color: #4CAF50; background-color: #f1f8e9; }

.logout-link { 
  background: none; border: none; color: #adb5bd; 
  text-decoration: underline; cursor: pointer; font-size: 13px; margin-top: 10px; 
}
.logout-link:hover { color: #868e96; }

/* 반응형 (모바일) */
@media (max-width: 900px) {
  .content-grid { flex-direction: column-reverse; }
  .request-section, .sidebar-section { width: 100%; flex: none; }
  .sidebar-section { position: static; margin-bottom: 30px; }
}
</style>