<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-card">
      <h3>🚨 사용자 신고</h3>
      <p>신고 대상: <strong>{{ targetName }}</strong></p>

      <select v-model="reason" class="full-width">
        <option disabled value="">신고 사유를 선택하세요</option>
        <option>욕설/비하 발언</option>
        <option>시간 약속 위반 (노쇼)</option>
        <option>성희롱</option>
        <option>기타</option>
      </select>

      <textarea v-model="details" placeholder="내용을 입력해주세요" rows="4" class="full-width"></textarea>

      <div class="btn-group">
        <button @click="$emit('close')">취소</button>
        <button @click="submitReport" class="btn-red">신고 접수</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 부모(화면)에서 받아올 데이터들
  props: ['isVisible', 'targetName', 'targetId'],
  data() {
    return { reason: '', details: '' }
  },
  methods: {
    submitReport() {
      if (!this.reason) return alert("사유를 선택해주세요!");
      // 여기에 서버로 신고 전송하는 코드(axios)가 들어갑니다.
      alert(`${this.targetName}님에 대한 신고가 접수되었습니다.`);
      this.$emit('close'); // 창 닫기
    }
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; }
.modal-card { background:white; padding:20px; border-radius:10px; width:300px; }
.full-width { width: 100%; margin-bottom: 10px; padding: 5px; }
.btn-red { background-color: #ff4d4f; color: white; border: none; }
.btn-group { display: flex; justify-content: space-between; margin-top: 10px; }
</style>