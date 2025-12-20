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
  props: ['isVisible', 'targetName', 'targetId'],
  data() {
    return { reason: '', details: '' }
  },
  // [수정 핵심] watch를 추가하여 모달이 열릴 때마다 데이터를 초기화합니다.
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.reason = '';
        this.details = '';
      }
    }
  },
  methods: {
    submitReport() {
      if (!this.reason) return alert("사유를 선택해주세요!");
      // 실제 API 연동 시 targetId와 함께 전송
      console.log(`신고 대상 ID: ${this.targetId}, 사유: ${this.reason}, 내용: ${this.details}`);
      
      alert(`${this.targetName}님에 대한 신고가 접수되었습니다.`);
      this.$emit('close'); 
    }
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index: 1000; }
.modal-card { background:white; padding:20px; border-radius:10px; width:300px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.full-width { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px; }
.btn-red { background-color: #ff4d4f; color: white; border: none; font-weight: bold; }
.btn-group { display: flex; justify-content: space-between; margin-top: 10px; gap: 10px; }
.btn-group button { flex: 1; padding: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #ddd; background: white; }
.btn-group .btn-red { border: none; }
</style>