<template>
  <div class="history-page">
    <TheHeader />
    <main class="history-container">
      <h1>나의 돌봄 내역</h1>

      <div v-for="item in careHistory" :key="item.id" class="care-item">
        <div class="item-header">
          <span class="teacher-name">{{ item.teacherName }} 선생님과의 돌봄</span>
          <span :class="['status', item.statusClass]">{{ item.statusText }}</span>
        </div>
        <p class="item-period">{{ item.period }}</p>

        <div v-if="reviewForm.visible && reviewForm.targetId === item.id" class="review-form-wrapper">
          <hr>
          <div class="review-form">
            <h4>상세 후기 작성</h4>
            
            <div class="detailed-ratings">
              <div v-for="category in ratingCategories" :key="category.key" class="rating-item">
                <label>{{ category.label }}</label>
                <div class="star-rating">
                  <span v-for="n in 5" :key="n" @click="setDetailedRating(category.key, n)">
                    {{ n <= reviewForm.ratings[category.key] ? '★' : '☆' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label>선생님과의 경험을 공유해주세요.</label>
              <textarea v-model="reviewForm.text" placeholder="솔직한 후기를 남겨주세요."></textarea>
            </div>
            
            <div class="btn-group">
              <BaseButton type="outline" @click="closeReviewForm">취소</BaseButton>
              <BaseButton type="primary" @click="submitReview(item.id)">후기 제출</BaseButton>
            </div>
          </div>
        </div>
        
        <div v-else-if="item.hasReview" class="review-completed-wrapper">
           <p class="completed-msg">✅ 후기 작성이 완료되었습니다.</p>
           </div>

        <div v-else-if="item.status === 'completed'" class="review-button-wrapper">
           <BaseButton type="secondary" @click="openReviewForm(item.id)">후기 등록</BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue';


export default { 
  components: { BaseButton, TheHeader },
  data() {
    return {
    
      careHistory: [
        { 
          id: 1, 
          teacherName: '김선생님', 
          status: 'in-progress', 
          statusText: '진행중', 
          statusClass: 'in-progress',
          period: '2025.10.01 ~ 현재',
          hasReview: false 
        },
        { 
          id: 2, 
          teacherName: '이선생님', 
          status: 'completed', 
          statusText: '종료됨', 
          statusClass: 'completed',
          period: '2025.09.15 ~ 2025.09.30',
          hasReview: false 
        }
      ],
      reviewForm: {
        visible: false,
        targetId: null,
        ratings: { punctuality: 0, preparation: 0, rapport: 0, safety: 0, communication: 0 },
        text: ''
      },
      ratingCategories: [
        { key: 'punctuality', label: '시간 약속:' },
        { key: 'preparation', label: '준비성:' },
        { key: 'rapport', label: '교감 능력:' },
        { key: 'safety', label: '안전 관리:' },
        { key: 'communication', label: '소통 능력:' },
      ]
    };
  },
  methods: {
    openReviewForm(careId) {
     
      this.reviewForm = {
        visible: true,
        targetId: careId,
        ratings: { punctuality: 5, preparation: 5, rapport: 5, safety: 5, communication: 5 },
        text: ''
      };
    },
    closeReviewForm() {
      this.reviewForm.visible = false;
      this.reviewForm.targetId = null;
    },
    setDetailedRating(categoryKey, rating) {
      this.reviewForm.ratings[categoryKey] = rating;
    },
    async submitReview(careId) {
     
      if (!this.reviewForm.text) {
        alert('후기 내용을 입력해주세요.');
        return;
      }

      try {
        
        console.log('후기 전송:', careId, this.reviewForm);
        alert('후기가 등록되었습니다.');

        const targetItem = this.careHistory.find(item => item.id === careId);
        if (targetItem) {
          targetItem.hasReview = true;
        }

        this.closeReviewForm();

      } catch (error) {
        alert('후기 등록 실패');
      }
    }
  }
}
</script>

<style scoped>
.history-page { background-color: #f8f9fa; min-height: 100vh; }
.history-container { max-width: 800px; margin: 30px auto; padding: 20px; }
h1 { font-size: 28px; margin-bottom: 30px; }
.care-item { background-color: white; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.teacher-name { font-size: 20px; font-weight: 600; }
.status { font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 20px; }
.status.in-progress { color: #4CAF50; background-color: #e8f5e9; }
.status.completed { color: #868e96; background-color: #f1f3f5; }
.item-period { font-size: 14px; color: #868e96; }

.review-button-wrapper { margin-top: 20px; text-align: right; }
.review-completed-wrapper { margin-top: 20px; text-align: right; color: #4CAF50; font-weight: bold; }
hr { border: none; border-top: 1px solid #f1f3f5; margin: 25px 0; }
.review-form h4 { font-size: 18px; margin-bottom: 20px; text-align: left; }
.rating-item { display: flex; align-items: center; margin-bottom: 10px; }
.rating-item label { width: 100px; font-weight: 500; text-align: left; }
.star-rating span { font-size: 24px; color: #FFA726; cursor: pointer; margin-right: 2px; }
.input-group { text-align: left; margin-top: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.review-form textarea { width: 100%; min-height: 100px; border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; font-size: 15px; resize: vertical; box-sizing: border-box; }
.btn-group { margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end; }
</style>