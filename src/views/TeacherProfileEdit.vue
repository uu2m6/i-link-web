<template>
  <div class="page-container">
    <div class="profile-card">
      <header class="profile-header primary-bg">
        <h1>{{ teacher.name }} 선생님 프로필</h1>
      </header>
      
      <div class="profile-body">
        <div class="info-section">
          <h3>기본 정보</h3>
          <p><strong>이름:</strong> {{ teacher.name }}</p>
          <p><strong>연락처:</strong> {{ teacher.contact }}</p>
        </div>

        <hr />

        <div class="expert-section">
          <h3>전문성 정보</h3>
          <p class="tag">💡 {{ teacher.shortIntro }}</p>
          <p><strong>희망 시급:</strong> {{ teacher.wage.toLocaleString() }}원</p>
          
          <div class="description-box">
            <h4>상세 소개</h4>
            <p>{{ teacher.description }}</p>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary full-width">매칭 신청하기</button>
          
          <button class="btn-danger full-width" @click="openReportModal">
            🚨 이 사용자 신고하기
          </button>
        </div>
      </div>
    </div>

    <ReportModal 
      :isVisible="showReportModal" 
      :targetName="teacher.name"
      :targetId="teacher.id"
      @close="showReportModal = false"
    />
  </div>
</template>

<script>
import ReportModal from '@/components/ReportModal.vue';

export default {
  components: { ReportModal },
  data() {
    return {
      teacher: {
        id: null,
        name: '',
        contact: '',
        shortIntro: '',
        wage: 0,
        description: ''
      },
      showReportModal: false
    };
  },
  async mounted() {
    const teacherId = this.$route.params.id;
    if (teacherId) {
      await this.fetchTeacherData(teacherId);
    }
  },
  methods: {
    async fetchTeacherData(id) {
      try {
        const response = await fetch(`/api/teachers/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) {
          throw new Error('네트워크 응답에 문제가 발생했습니다.');
        }

        const data = await response.json();
        this.teacher = data;
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    },
    openReportModal() {
      this.showReportModal = true;
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex; justify-content: center; padding: 20px;
}
.profile-card {
  width: 100%; max-width: 500px;
  border: 1px solid #ddd; border-radius: 8px; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.profile-header {
  background-color: #4CAF50; /* primary-bg 예시 */
  color: white; padding: 15px; text-align: center;
}
.profile-body { padding: 20px; }
.info-section, .expert-section { margin-bottom: 20px; }
.tag {
  background: #e8f5e9; color: #2e7d32; padding: 5px 10px;
  border-radius: 15px; display: inline-block; font-weight: bold;
}
.description-box {
  background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;
  white-space: pre-line; /* 줄바꿈 적용 */
}
.action-buttons {
  display: flex; flex-direction: column; gap: 10px; margin-top: 30px;
}
.btn-primary {
  background-color: #4CAF50; color: white; padding: 12px;
  border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;
}
.btn-danger {
  background-color: white; color: #ff4d4f; padding: 12px;
  border: 1px solid #ff4d4f; border-radius: 5px; cursor: pointer; font-size: 1rem;
}
.btn-danger:hover { background-color: #fff1f0; }
.full-width { width: 100%; }
</style>