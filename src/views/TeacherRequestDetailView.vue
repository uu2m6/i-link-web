<template>
  <div class="detail-page">
    <TheHeader />
    <main class="detail-container">
      <div class="detail-card">
        <header class="card-header">
          <span class="tag-new">신규 신청</span>
          <h2>{{ request.parentName }} 학부모님의 요청</h2>
        </header>

        <div class="info-section">
          <div class="info-row">
            <span class="label">📅 일시</span>
            <span class="value">{{ request.date }} / {{ request.time }}</span>
          </div>
          <div class="info-row">
            <span class="label">📍 장소</span>
            <span class="value">{{ request.location }}</span>
          </div>
          <div class="info-row">
            <span class="label">💰 예상 수익</span>
            <span class="value highlight">{{ request.pay?.toLocaleString() }}원</span>
          </div>
        </div>

        <div class="message-box">
          <h4>학부모님 메시지:</h4>
          <p>"{{ request.message }}"</p>
        </div>

        <div class="action-buttons">
          <button class="btn-reject" @click="goBack">목록으로</button>
          <button class="btn-accept" @click="handleAccept">수락하기</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';

export default {
  components: { TheHeader },
  data() {
    return {
      request: {
        id: 0,
        parentName: '',
        date: '',
        time: '',
        location: '',
        pay: 0,
        message: ''
      }
    };
  },
  mounted() {
    // URL에서 ID를 가져옴
    const id = this.$route.params.id;
    this.fetchRequestDetail(id);
  },
  methods: {
    fetchRequestDetail(id) {
      // 실제로는 API 호출 (여기선 더미 데이터)
      // id를 이용해 서버에서 데이터를 가져오세요.
      this.request = {
        id: id,
        parentName: '이영희',
        date: '2025.10.20',
        time: '14:00 (3시간)',
        location: '서울 강남구 역삼동',
        pay: 45000,
        message: '아이가 낯을 좀 가리는데 잘 부탁드려요.'
      };
    },
    handleAccept() {
      alert('신청을 수락했습니다!');
      this.$router.push('/teacher-home');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.detail-page { background-color: #f8f9fa; min-height: 100vh; }
.detail-container { padding: 40px 20px; display: flex; justify-content: center; }
.detail-card { width: 100%; max-width: 500px; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.card-header { text-align: center; margin-bottom: 30px; }
.tag-new { background: #ff4d4f; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.card-header h2 { margin-top: 15px; font-size: 22px; color: #333; }
.info-section { margin-bottom: 30px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; }
.info-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 16px; }
.info-row:last-child { margin-bottom: 0; }
.label { color: #888; font-weight: 500; }
.value { color: #333; font-weight: 600; }
.value.highlight { color: #4CAF50; font-size: 18px; }
.message-box { background: #f1f3f5; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
.message-box h4 { margin-bottom: 10px; font-size: 14px; color: #666; }
.message-box p { font-size: 16px; line-height: 1.5; color: #333; font-style: italic; }
.action-buttons { display: flex; gap: 10px; }
.action-buttons button { flex: 1; padding: 15px; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; }
.btn-reject { background: #e9ecef; color: #666; }
.btn-accept { background: #4CAF50; color: white; }
</style>