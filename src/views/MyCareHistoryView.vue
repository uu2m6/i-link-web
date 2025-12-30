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

        <!-- 후기 작성/수정 영역 -->
        <div
          v-if="reviewForm.visible && reviewForm.targetId === item.id"
          class="review-form-wrapper"
        >
          <hr />
          <div class="review-form">
            <h4>{{ item.hasReview ? '후기 수정하기' : '새 후기 작성' }}</h4>

            <div class="detailed-ratings">
              <div
                v-for="category in ratingCategories"
                :key="category.key"
                class="rating-item"
              >
                <label>{{ category.label }}</label>
                <div class="star-rating">
                  <span
                    v-for="n in 5"
                    :key="n"
                    @click="setDetailedRating(category.key, n)"
                  >
                    {{ n <= reviewForm.ratings[category.key] ? '★' : '☆' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label>선생님과의 경험을 공유해주세요.</label>
              <textarea
                v-model="reviewForm.text"
                placeholder="솔직한 후기를 남겨주세요."
              ></textarea>
            </div>

            <div class="btn-group">
              <BaseButton type="outline" @click="closeReviewForm">
                닫기
              </BaseButton>
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
            <!-- 채팅 버튼 -->
            <button class="btn-chat" @click="openChat(item)">
              💬 채팅하기
            </button>

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

            <span v-else-if="item.status === 'rejected'" class="rej-msg">
              ❌ 선생님이 거절했습니다
            </span>
          </div>
        </div>
      </div>

      <!-- 신고 모달 -->
      <ReportModal
        :isVisible="reportModal.visible"
        :targetName="reportModal.targetName"
        :targetId="reportModal.targetId"
        @close="closeReportModal"
      />

      <!-- 거절 알림 모달 -->
      <GlobalModal
        :visible="rejectModal.visible"
        :message="rejectModal.message"
        @close="closeRejectModal"
        @confirm="confirmRejectModal"
      />
    </main>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import TheHeader from '../components/TheHeader.vue'
import ReportModal from '@/components/ReportModal.vue'
import GlobalModal from '@/components/GlobalModal.vue'

export default {
  components: { BaseButton, TheHeader, ReportModal, GlobalModal },

  data() {
    return {
      careHistory: [
        {
          id: 1,
          teacherName: '김선생님',
          status: 'pending',
          statusText: '승인 대기',
          period: '2025.10.15 (예정)',
          hasReview: false,
          savedReview: null
        },
        {
          id: 2,
          teacherName: '박선생님',
          status: 'in-progress',
          statusText: '진행중',
          period: '2025.10.01 ~ 현재',
          hasReview: false,
          savedReview: null
        },
        {
          id: 3,
          teacherName: '이선생님',
          status: 'completed',
          statusText: '종료됨',
          period: '2025.09.15 ~ 2025.09.30',
          hasReview: true,
          savedReview: {
            ratings: {
              punctuality: 5,
              preparation: 4,
              rapport: 5,
              safety: 5,
              communication: 4
            },
            text: '아이랑 너무 잘 놀아주셨어요!'
          }
        }
      ],

      reportModal: {
        visible: false,
        targetName: '',
        targetId: null
      },

      reviewForm: {
        visible: false,
        targetId: null,
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
        { key: 'preparation', label: '준비성:' },
        { key: 'rapport', label: '교감 능력:' },
        { key: 'safety', label: '안전 관리:' },
        { key: 'communication', label: '소통 능력:' }
      ],

      rejectModal: {
        visible: false,
        message: '',
        targetCareId: null
      }
    }
  },

  mounted() {
    this.checkRejectedAndPopup()
  },

  methods: {
    /* ---------- 채팅 ---------- */
    openChat(item) {
      const parentId = sessionStorage.getItem('userId') || 'parent'
      const sitterId = `sitter_${item.id}`
      const roomId = `${parentId}_${sitterId}`

      const key = `chatRoom:${roomId}`
      if (!localStorage.getItem(key)) {
        localStorage.setItem(
          key,
          JSON.stringify({
            otherId: sitterId,
            otherName: item.teacherName
          })
        )
      }

      this.$router.push(`/chat/${roomId}`)
    },

    /* ---------- 신고 ---------- */
    openReportModal(item) {
      this.reportModal.visible = true
      this.reportModal.targetName = item.teacherName
      this.reportModal.targetId = item.id
    },
    closeReportModal() {
      this.reportModal.visible = false
    },

    /* ---------- 후기 ---------- */
    openReviewForm(item) {
      this.reviewForm.visible = true
      this.reviewForm.targetId = item.id

      if (item.hasReview && item.savedReview) {
        this.reviewForm.ratings = { ...item.savedReview.ratings }
        this.reviewForm.text = item.savedReview.text
      } else {
        this.reviewForm.ratings = {
          punctuality: 5,
          preparation: 5,
          rapport: 5,
          safety: 5,
          communication: 5
        }
        this.reviewForm.text = ''
      }
    },
    closeReviewForm() {
      this.reviewForm.visible = false
      this.reviewForm.targetId = null
    },
    setDetailedRating(key, value) {
      this.reviewForm.ratings[key] = value
    },
    submitReview(item) {
      alert('후기가 저장되었습니다.')
      item.hasReview = true
      item.savedReview = {
        ratings: { ...this.reviewForm.ratings },
        text: this.reviewForm.text
      }
      this.closeReviewForm()
    },

    /* ---------- 거절 팝업 ---------- */
    checkRejectedAndPopup() {},
    closeRejectModal() {
      this.rejectModal.visible = false
    },
    confirmRejectModal() {
      this.closeRejectModal()
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
.care-item {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-chat {
  background: none;
  border: none;
  color: #F59E0B;
  font-weight: bold;
  cursor: pointer;
}
.btn-chat:hover {
  text-decoration: underline;
}
</style>
