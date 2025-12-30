<template>
  <div class="profile-page">
    <TheHeader />

    <main class="profile-container">
      <!-- 프로필 카드 -->
      <section class="profile-header-card">
        <div class="profile-image-wrapper">
          <div class="profile-placeholder"></div>
        </div>
        <div class="profile-summary">
          <div class="name-row">
            <h1 class="name">{{ teacher.name }} 선생님</h1>
            <span class="badge">인증 완료 ✅</span>
          </div>
          <p class="one-liner">"{{ teacher.oneLiner }}"</p>
          <div class="tags-row">
            <span v-for="tag in teacher.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </section>

      <!-- 기본 정보 -->
      <section class="info-grid">
        <div class="info-card">
          <h3>기본 정보</h3>
          <ul class="info-list">
            <li><span class="label">나이</span><span class="value">{{ teacher.age }}세</span></li>
            <li><span class="label">성별</span><span class="value">{{ teacher.gender }}</span></li>
            <li><span class="label">거주지</span><span class="value">{{ teacher.location }}</span></li>
          </ul>
        </div>

        <div class="info-card">
          <h3>활동 조건</h3>
          <ul class="info-list">
            <li>
              <span class="label">희망 시급</span>
              <span class="value highlight">{{ teacher.wage.toLocaleString() }}원</span>
            </li>
            <li><span class="label">활동 가능</span><span class="value">{{ teacher.availableDays }}</span></li>
            <li>
              <span class="label">CCTV 동의</span>
              <span class="value">{{ teacher.cctv ? '가능 ⭕' : '불가능 ❌' }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- 소개 -->
      <section class="intro-section card-style">
        <h3>선생님 소개</h3>
        <p class="intro-text">{{ teacher.introduction }}</p>
      </section>

      <!-- ⭐ 후기 수치화 + 재매칭 확률 -->
      <ReviewStats
        :stats="reviewStats"
        :rematchProbability="rematchProbability"
      />
    </main>

    <!-- 하단 액션바 -->
    <div class="bottom-action-bar">
      <BaseButton type="secondary" class="chat-btn" @click="startChat">
        💬 채팅하기
      </BaseButton>

      <BaseButton type="primary" class="match-btn" @click="startMatching">
        매칭 신청하기
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import TheHeader from '../components/TheHeader.vue'
import ReviewStats from '@/components/ReviewStats.vue'

export default {
  components: {
    BaseButton,
    TheHeader,
    ReviewStats
  },

  data() {
    return {
      /* 선생님 기본 정보 */
      teacher: {
        id: this.$route.params.id,
        name: '김선생님',
        age: 26,
        gender: '여',
        location: '서울시 강남구',
        oneLiner: '아이와 함께하는 시간이 가장 행복한 선생님입니다!',
        tags: ['#실내놀이', '#영어', '#에너지넘침'],
        wage: 15000,
        availableDays: '월, 수, 금 (오후)',
        cctv: true,
        introduction:
          '아이들의 눈높이에서 소통하며 믿고 맡길 수 있는 돌봄을 제공합니다.'
      },

      /* ⭐ 후기 평균 점수 (백엔드 sitter_profile 대응) */
      reviewStats: {
        avg_time_punctuality: 0,
        avg_preparedness_activity: 0,
        avg_communication_with_child: 0,
        avg_safety_management: 0,
        avg_communication_skill: 0
      },

      /* 🔁 재매칭 확률 */
      rematchProbability: null
    }
  },

  methods: {
    startMatching() {
      alert('매칭 신청이 완료되었습니다.')
      this.$router.push('/history')
    },

    startChat() {
      const parentId = sessionStorage.getItem('userId') || 'parent'
      const sitterId = `sitter_${this.teacher.id}`
      const roomId = `${parentId}_${sitterId}`

      localStorage.setItem(
        `chatRoom:${roomId}`,
        JSON.stringify({
          otherId: sitterId,
          otherName: this.teacher.name
        })
      )

      this.$router.push(`/chat/${roomId}`)
    }
  }
}
</script>

<style scoped>
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
}
.chat-btn { min-width: 140px; }
.match-btn { min-width: 160px; }
</style>
