<template>
  <div class="manage-page">
    <TheHeader />
    <main class="manage-container">
      <h1>돌봄 신청 관리</h1>
      
      <div class="tabs">
        <button :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">전체</button>
        <button :class="{ active: currentFilter === 'pending' }" @click="currentFilter = 'pending'">대기중 🔥</button>
        <button :class="{ active: currentFilter === 'confirmed' }" @click="currentFilter = 'confirmed'">진행/완료</button>
      </div>

      <div class="request-list">
        <div 
          v-for="req in filteredRequests" 
          :key="req.id" 
          class="request-card"
          :class="{ 'highlight': req.status === 'pending' }" 
        >
          <div class="card-header">
            <span class="parent-name">{{ req.parentName }} 학부모님</span>
            <span :class="['status-badge', req.status]">{{ getStatusText(req.status) }}</span>
          </div>

          <div class="card-body">
            <p><strong>📅 일시:</strong> {{ req.date }} / {{ req.time }}</p>
            <p><strong>📍 장소:</strong> {{ req.location }}</p>
            <p><strong>💰 예상 수익:</strong> {{ req.pay.toLocaleString() }}원</p>
            <p class="message">"{{ req.message }}"</p>
          </div>

          <div v-if="req.status === 'pending'" class="action-buttons">
            <button class="btn-reject" @click="handleReject(req.id)">거절하기</button>
            <button class="btn-accept" @click="handleAccept(req.id)">수락하기</button>
          </div>

          <div v-else-if="req.status === 'in-progress'" class="info-msg">
            ✅ 매칭이 확정되어 진행 중입니다.
          </div>
          
          <div v-else-if="req.status === 'rejected'" class="info-msg rejected">
            ❌ 거절한 요청입니다.
          </div>

          <div class="report-area">
            <button class="btn-text-report" @click="openReportModal(req)">
              🚨 학부모 신고하기
            </button>
          </div>
        </div>
        
        <div v-if="filteredRequests.length === 0" class="empty-state">
          <p>해당하는 신청 내역이 없습니다.</p>
        </div>
      </div>

      <ReportModal 
        :isVisible="reportModal.visible"
        :targetName="reportModal.targetName"
        :targetId="reportModal.targetId"
        @close="closeReportModal"
      />
    </main>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import ReportModal from '@/components/ReportModal.vue';

export default {
  components: { TheHeader, ReportModal },
  data() {
    return {
      currentFilter: 'all',
      // 신고 모달 상태
      reportModal: {
        visible: false,
        targetName: '',
        targetId: null
      },
      // 더미 데이터 (실제로는 API에서 가져옵니다)
      requests: [
        {
          id: 1,
          parentName: '이영희',
          status: 'pending',
          date: '2025.10.20',
          time: '14:00 (3시간)',
          location: '서울 강남구 역삼동',
          pay: 45000,
          message: '아이가 낯을 좀 가리는데 잘 부탁드려요.'
        },
        {
          id: 2,
          parentName: '박철수',
          status: 'in-progress',
          date: '2025.10.18',
          time: '10:00 (2시간)',
          location: '서울 서초구 반포동',
          pay: 30000,
          message: '시간 엄수 부탁드립니다.'
        },
        {
          id: 3,
          parentName: '최민수',
          status: 'rejected',
          date: '2025.10.15',
          time: '09:00 (4시간)',
          location: '서울 송파구 잠실동',
          pay: 60000,
          message: ''
        }
      ]
    };
  },
  computed: {
    filteredRequests() {
      if (this.currentFilter === 'all') return this.requests;
      if (this.currentFilter === 'pending') return this.requests.filter(r => r.status === 'pending');
      if (this.currentFilter === 'confirmed') return this.requests.filter(r => r.status === 'in-progress' || r.status === 'completed');
      return this.requests;
    }
  },
  methods: {
    getStatusText(status) {
      const map = {
        'pending': '승인 대기',
        'in-progress': '진행중',
        'completed': '완료됨',
        'rejected': '거절됨'
      };
      return map[status] || status;
    },
    
    // 수락 로직
    handleAccept(id) {
      if (confirm('이 돌봄 신청을 수락하시겠습니까?')) {
        const target = this.requests.find(r => r.id === id);
        if (target) {
          target.status = 'in-progress'; 
          alert('신청을 수락했습니다! 학부모님께 알림이 전송됩니다.');
        }
      }
    },

    // 거절 로직
    handleReject(id) {
      if (confirm('정말 거절하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        const target = this.requests.find(r => r.id === id);
        if (target) {
          target.status = 'rejected';
          alert('신청을 거절했습니다.');
        }
      }
    },

    // 신고 모달 열기
    openReportModal(req) {
      this.reportModal.targetName = req.parentName;
      this.reportModal.targetId = req.id;
      this.reportModal.visible = true;
    },
    
    // 신고 모달 닫기
    closeReportModal() {
      this.reportModal.visible = false;
      this.reportModal.targetName = '';
      this.reportModal.targetId = null;
    }
  }
};
</script>

<style scoped>
.manage-page { background-color: #f8f9fa; min-height: 100vh; }
.manage-container { max-width: 600px; margin: 0 auto; padding: 20px; }

h1 { font-size: 1.5rem; margin-bottom: 20px; }

.tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tabs button {
  flex: 1; padding: 10px; border: none; background: #eee; border-radius: 8px;
  cursor: pointer; font-weight: bold; color: #666; transition: 0.2s;
}
.tabs button.active { background: #4CAF50; color: white; }

.request-card {
  background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #eee;
}
.request-card.highlight { border: 2px solid #FF9800; }

.card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.parent-name { font-size: 1.1rem; font-weight: bold; }

.status-badge { font-size: 0.8rem; padding: 4px 8px; border-radius: 12px; font-weight: bold; }
.status-badge.pending { background: #FFF3E0; color: #FF9800; }
.status-badge.in-progress { background: #E8F5E9; color: #4CAF50; }
.status-badge.rejected { background: #FFEBEE; color: #D32F2F; }

.card-body p { margin: 5px 0; color: #555; font-size: 0.95rem; }
.card-body .message { 
  background: #f9f9f9; padding: 10px; border-radius: 5px; 
  margin-top: 10px; font-style: italic; color: #666; 
}

.action-buttons { display: flex; gap: 10px; margin-top: 20px; }
.action-buttons button {
  flex: 1; padding: 12px; border: none; border-radius: 8px;
  font-weight: bold; cursor: pointer; font-size: 1rem;
}
.btn-accept { background: #4CAF50; color: white; }
.btn-accept:hover { background: #43A047; }
.btn-reject { background: #ffebee; color: #d32f2f; }
.btn-reject:hover { background: #ffcdd2; }

.info-msg { margin-top: 15px; text-align: center; color: #4CAF50; font-weight: bold; font-size: 0.9rem; }
.info-msg.rejected { color: #d32f2f; }

/* 신고 버튼 스타일 */
.report-area {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f1f3f5;
  text-align: right;
}
.btn-text-report {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
.btn-text-report:hover { color: #d32f2f; }

.empty-state { text-align: center; padding: 40px 0; color: #888; }
</style>