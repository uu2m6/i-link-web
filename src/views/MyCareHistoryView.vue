<template>
  <div class="history-page">
    <TheHeader />
    <main class="history-container">
      <h1>나의 돌봄 내역</h1>

      <!-- 돌봄 내역 아이템 1 (진행중) -->
      <div class="care-item">
        <div class="item-header">
          <span class="teacher-name">김선생님과의 돌봄</span>
          <span class="status in-progress">진행중</span>
        </div>
        <p class="item-period">2025.10.01 ~ 현재</p>
      </div>

      <!-- 돌봄 내역 아이템 2 (종료됨) -->
      <div class="care-item">
        <div class="item-header">
          <span class="teacher-name">이선생님과의 돌봄</span>
          <span class="status completed">종료됨</span>
        </div>
        <p class="item-period">2025.09.15 ~ 2025.09.30</p>
        
        <div v-if="reviewForm.visible && reviewForm.id === 2" class="review-form-wrapper">
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
              <label>선생님과의 경험을 공유해주세요. (선택 사항)</label>
              <textarea v-model="reviewForm.text" placeholder="좋았던 점, 아쉬웠던 점 등을 자유롭게 작성해주세요."></textarea>
            </div>
            
            <BaseButton type="primary" @click="submitReview">후기 제출</BaseButton>
          </div>
        </div>
        
        <div v-else class="review-button-wrapper">
           <BaseButton type="secondary" @click="showReviewForm(2)">후기 등록</BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue';

export default { 
  components: { 
    BaseButton,
    TheHeader
  },
  data() {
    return {
      reviewForm: {
        visible: false,
        id: null,
        ratings: {
          punctuality: 0,
          preparation: 0,
          rapport: 0,
          safety: 0,
          communication: 0
        },
        text: ''
      },
      ratingCategories: [
        { key: 'punctuality', label: '시간 약속:' },
        { key: 'preparation', label: '준비성/적극성:' },
        { key: 'rapport', label: '아이와의 교감:' },
        { key: 'safety', label: '안전 관리:' },
        { key: 'communication', label: '소통 능력:' },
      ]
    };
  },
  methods: {
    showReviewForm(careId) {
      this.reviewForm.visible = true;
      this.reviewForm.id = careId;
    },
    setDetailedRating(categoryKey, rating) {
      this.reviewForm.ratings[categoryKey] = rating;
    },
    submitReview() {

      console.log('제출할 후기 데이터:', {
        careId: this.reviewForm.id,
        ratings: this.reviewForm.ratings,
        text: this.reviewForm.text,
      });

      alert('소중한 후기가 등록되었습니다.');

      this.reviewForm.visible = false;
      this.reviewForm.id = null;
      this.reviewForm.ratings = { punctuality: 0, preparation: 0, rapport: 0, safety: 0, communication: 0 };
      this.reviewForm.text = '';
    }
  }
}
</script>

<style scoped>
.history-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}
.history-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}
h1 {
  font-size: 28px;
  margin-bottom: 30px;
}
.care-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.teacher-name {
  font-size: 20px;
  font-weight: 600;
}
.status {
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 20px;
}
.status.in-progress {
  color: #4CAF50;
  background-color: #e8f5e9;
}
.status.completed {
  color: #868e96;
  background-color: #f1f3f5;
}
.item-period {
  font-size: 14px;
  color: #868e96;
}
.review-button-wrapper {
  margin-top: 20px;
  text-align: right;
}
hr {
  border: none;
  border-top: 1px solid #f1f3f5;
  margin: 25px 0;
}
.review-form-wrapper {
  margin-top: 10px;
}
.review-form h4 {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: left;
}
.detailed-ratings {
  margin-bottom: 25px;
}
.rating-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.rating-item label {
  width: 120px;
  font-weight: 500;
}
.star-rating {
  display: flex;
}
.star-rating span {
  font-size: 24px;
  color: #FFA726;
  cursor: pointer;
  margin-right: 3px;
}
.input-group {
  text-align: left;
}
.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
.review-form textarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  font-size: 16px;
  resize: vertical;
}
.review-form .base-button {
  margin-top: 15px;
  width: auto;
  float: right;
}
</style>