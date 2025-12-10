<template>
  <div class="history-page">
    <TheHeader />
    <main class="history-container">
      <h1>나의 돌봄 내역 (학부모용)</h1>

      <div v-for="item in careHistory" :key="item.id" class="care-item">
        
        <div class="item-header">
          <span class="teacher-name">{{ item.teacherName }} 선생님과의 돌봄</span>
          <span :class="['status', item.status]">{{ item.statusText }}</span>
        </div>
        <p class="item-period">{{ item.period }}</p>

        <div v-if="reviewForm.visible && reviewForm.targetId === item.id" class="review-form-wrapper">
          <hr>
          <div class="review-form">
            <h4>{{ item.hasReview ? '후기 수정하기' : '새 후기 작성' }}</h4>
            
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
              <BaseButton type="outline" @click="closeReviewForm">닫기</BaseButton>
              <BaseButton type="primary" @click="submitReview(item)">
                {{ item.hasReview ? '수정 완료' : '후기 등록' }}
              </BaseButton>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <button class="btn-report" @click="openReportModal(item)">
            🚨 신고하기
          </button>

          <div class="right-actions">
            
            <span v-if="item.status === 'pending'" class="pending-msg">
              ⏳ 선생님 수락 대기 중
            </span>

            <button 
              v-else-if="item.status === 'completed' && item.hasReview" 
              class="btn-text-action"
              @click="openReviewForm(item)"
            >
              📝 내 후기 보기/수정
            </button>
            
            <BaseButton 
              v-else-if="item.status === 'completed' && !item.hasReview" 
              type="secondary" 
              @click="openReviewForm(item)"
            >
              후기 등록
            </BaseButton>

            <span v-else-if="item.status === 'in-progress'" class="ing-msg">
              현재 돌봄 진행 중
            </span>

          </div>
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
// 필요한 컴포넌트 임포트
import BaseButton from '../components/BaseButton.vue';
import TheHeader from '../components/TheHeader.vue';
import ReportModal from '@/components/ReportModal.vue'; 

export default { 
  components: { BaseButton, TheHeader, ReportModal },
  data() {
    return {
      // 1. 돌봄 내역 데이터 (모든 상황을 테스트하기 위한 더미 데이터)
      careHistory: [ 
        { 
          id: 1, 
          teacherName: '김선생님', 
          status: 'pending',        // [대기중]
          statusText: '승인 대기', 
          period: '2025.10.15 (예정)',
          hasReview: false,
          savedReview: null 
        },
        { 
          id: 2, 
          teacherName: '박선생님', 
          status: 'in-progress',    // [진행중]
          statusText: '진행중', 
          period: '2025.10.01 ~ 현재',
          hasReview: false,
          savedReview: null
        },
        { 
          id: 3, 
          teacherName: '이선생님', 
          status: 'completed',      // [완료 & 후기 있음]
          statusText: '종료됨', 
          period: '2025.09.15 ~ 2025.09.30',
          hasReview: true,       
          // 기존 작성 내용 (수정 시 불러올 데이터)
          savedReview: {
            ratings: { punctuality: 5, preparation: 4, rapport: 5, safety: 5, communication: 4 },
            text: '아이랑 너무 잘 놀아주셨어요! 다음에도 또 부탁드리고 싶습니다.'
          }
        },
        { 
          id: 4, 
          teacherName: '최선생님', 
          status: 'completed',      // [완료 & 후기 없음]
          statusText: '종료됨', 
          period: '2025.08.01 ~ 2025.08.05',
          hasReview: false,       
          savedReview: null
        }
      ],
      
      // 2. 신고 모달 상태
      reportModal: {
        visible: false,
        targetName: '',
        targetId: null
      },

      // 3. 후기 폼 상태
      reviewForm: {
        visible: false,
        targetId: null,
        ratings: { punctuality: 0, preparation: 0, rapport: 0, safety: 0, communication: 0 },
        text: ''
      },
      // 별점 카테고리 정의
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
    // --- 신고 모달 관련 메서드 ---
    openReportModal(item) {
      this.reportModal.targetName = item.teacherName;
      this.reportModal.targetId = item.id;
      this.reportModal.visible = true;
    },
    closeReportModal() {
      this.reportModal.visible = false;
      this.reportModal.targetName = '';
      this.reportModal.targetId = null;
    },

    // --- 후기 관련 메서드 ---
    
    // 후기 창 열기 (작성 or 수정)
    openReviewForm(item) {
      this.reviewForm.visible = true;
      this.reviewForm.targetId = item.id;

      // [핵심] 기존 후기가 있으면 내용을 불러옴 (수정 모드)
      if (item.hasReview && item.savedReview) {
        this.reviewForm.ratings = { ...item.savedReview.ratings };
        this.reviewForm.text = item.savedReview.text;
      } else {
        // 없으면 초기화 (작성 모드)
        this.reviewForm.ratings = { punctuality: 5, preparation: 5, rapport: 5, safety: 5, communication: 5 };
        this.reviewForm.text = '';
      }
    },
    
    closeReviewForm() {
      this.reviewForm.visible = false;
      this.reviewForm.targetId = null;
    },

    setDetailedRating(categoryKey, rating) {
      this.reviewForm.ratings[categoryKey] = rating;
    },

    // 후기 저장 및 수정 처리
    async submitReview(item) {
      if (!this.reviewForm.text) {
        alert('후기 내용을 입력해주세요.');
        return;
      }

      // 서버 통신 시뮬레이션
      console.log(`${item.hasReview ? '수정' : '등록'} 요청:`, item.id, this.reviewForm);
      alert(item.hasReview ? '후기가 수정되었습니다.' : '후기가 등록되었습니다.');

      // 프론트엔드 데이터 즉시 업데이트 (새로고침 없이 반영)
      item.hasReview = true;
      item.savedReview = {
        ratings: { ...this.reviewForm.ratings },
        text: this.reviewForm.text
      };

      this.closeReviewForm();
    }
  }
}
</script>

<style scoped>
.history-page { background-color: #f8f9fa; min-height: 100vh; }
.history-container { max-width: 800px; margin: 30px auto; padding: 20px; }
h1 { font-size: 28px; margin-bottom: 30px; }
.care-item { background-color: white; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }

/* 헤더 & 상태 뱃지 스타일 */
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.teacher-name { font-size: 20px; font-weight: 600; }
.status { font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 20px; }

/* 상태별 색상 */
.status.in-progress { color: #4CAF50; background-color: #e8f5e9; } /* 진행중: 초록 */
.status.completed { color: #868e96; background-color: #f1f3f5; }   /* 완료: 회색 */
.status.pending { color: #FF9800; background-color: #FFF3E0; }     /* 대기: 주황 */

.item-period { font-size: 14px; color: #868e96; }

/* 하단 버튼 영역 */
.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f1f3f5;
}

/* 신고 버튼 */
.btn-report {
  background: none; border: none; color: #ff4d4f;
  font-weight: 600; font-size: 14px; cursor: pointer;
  padding: 5px 10px; border-radius: 6px; transition: background 0.2s;
}
.btn-report:hover { background-color: #fff1f0; }

.right-actions { display: flex; align-items: center; }

/* 상태 메시지 텍스트 */
.pending-msg { color: #FF9800; font-weight: bold; font-size: 14px; }
.ing-msg { color: #4CAF50; font-weight: bold; font-size: 14px; }

/* 텍스트형 버튼 (후기 수정용) */
.btn-text-action {
  background: none; border: none;
  color: #2196F3;
  font-weight: bold; font-size: 14px; cursor: pointer;
  text-decoration: underline;
}
.btn-text-action:hover { color: #1976D2; }

/* 후기 작성 폼 스타일 */
hr { border: none; border-top: 1px solid #f1f3f5; margin: 25px 0; }
.review-form-wrapper { margin-top: 20px; animation: slideDown 0.3s ease-out; }
.review-form h4 { font-size: 18px; margin-bottom: 20px; text-align: left; }
.rating-item { display: flex; align-items: center; margin-bottom: 10px; }
.rating-item label { width: 100px; font-weight: 500; text-align: left; }
.star-rating span { font-size: 24px; color: #FFA726; cursor: pointer; margin-right: 2px; }
.input-group { text-align: left; margin-top: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.review-form textarea { width: 100%; min-height: 100px; border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; font-size: 15px; resize: vertical; box-sizing: border-box; }
.btn-group { margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end; }



@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>