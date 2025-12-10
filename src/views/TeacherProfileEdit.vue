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
// 1. 아까 만든 모달 불러오기
import ReportModal from '@/components/ReportModal.vue'; 

export default {
  components: { ReportModal }, // 컴포넌트 등록
  data() {
    return {
      // 학부모가 보고 있는 선생님의 정보
      teacher: { 
        id: 1, // 신고할 때 식별하기 위해 ID가 필요합니다
        name: '', 
        contact: '', 
        shortIntro: '', 
        wage: 0, 
        description: '' 
      },
      showReportModal: false // 모달 열림/닫힘 상태
    };
  },
  mounted() {
    // 실제로는 API로 선생님 ID를 조회해서 가져옵니다.
    // 테스트를 위해 임시 데이터를 넣습니다.
    this.teacher = {
      id: 99,
      name: '김선생',
      contact: '010-1234-5678',
      shortIntro: '아이들을 사랑합니다',
      wage: 15000,
      description: '안녕하세요. 꼼꼼하게 아이를 돌봐드리겠습니다.'
    };
  },
  methods: {
    openReportModal() {
      // 로그인 체크 로직을 여기에 넣을 수도 있습니다.
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