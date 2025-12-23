<template>
  <div class="page-container">
    <TheHeader />
    
    <main class="main-container">
      <div class="content-grid">
        
        <section class="request-section">
          <div class="section-header-row">
            <h2>📋 들어온 돌봄 요청</h2>
            <button class="view-history-link" @click="$router.push('/teacher/history')">
              전체보기 >
            </button>
          </div>
          
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

        <!-- 👉 오른쪽 사이드바 -->
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

              <button
                class="action-btn outline"
                @click="$router.push('/chats')"
              >
                💬 내 채팅
              </button>

              <button
                class="action-btn outline"
                @click="$router.push('/teacher/history')"
              >
                📂 내역 관리
              </button>

              <button
                class="action-btn outline"
                @click="$router.push('/profile/edit/teacher')"
              >
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
      requests: [] 
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
    this.fetchRequests();
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
    fetchRequests() {
      // 더미 데이터
      this.requests = [
        {
          id: 1,
          parent_name: '이영희',
          location: '서울 강남구 역삼동',
          start_time: '14:00:00',
          duration: 3,
          hourly_pay: 15000,
          created_at: '2025-12-20T09:00:00'
        },
        {
          id: 2,
          parent_name: '박철수',
          location: '서울 서초구 반포동',
          start_time: '10:00:00',
          duration: 4,
          hourly_pay: 18000,
          created_at: '2025-12-21T11:00:00'
        }
      ];
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
    }
  }
};
</script>

<style scoped>
.page-container { background-color: #f8f9fa; min-height: 100vh; }
.main-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.content-grid { display: flex; gap: 30px; align-items: flex-start; }
</style>
