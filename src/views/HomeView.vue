<template>
  <div class="home-page">
    <TheHeader />

    <main class="main-container">
      <section class="search-section">
        <div class="search-bar" @click="$router.push('/search')">
          <input type="text" placeholder="어떤 돌봄을 찾으시나요?" readonly>
        </div>
      </section>

      <div class="content-grid">
        <section class="main-content-section">
          
          <!-- 비로그인 -->
          <div v-if="!isLoggedIn">
            <h2>맞춤 돌봄 선생님을 추천해드려요 ✨</h2>
            <div class="recommendation-grid">
              <div
                v-for="teacher in recommendedTeachers"
                :key="teacher.id"
                class="teacher-card"
                @click="$router.push('/teacher/' + teacher.id)"
              >
                <div class="teacher-photo"></div>
                <div class="teacher-info">
                  <p class="name">{{ teacher.name }}</p>
                  <p class="tags">{{ teacher.tags }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 로그인 -->
          <div v-else>
            <div class="section-header-row">
              <h2>📋 내 돌봄 신청 현황</h2>
              <button class="view-history-link" @click="$router.push('/history')">
                전체 내역 보기 >
              </button>
            </div>
            
            <div v-if="myMatches.length === 0" class="empty-state">
              <p>신청한 돌봄 내역이 없습니다.</p>
              <button class="apply-btn" @click="$router.push('/search')">
                선생님 찾으러 가기
              </button>
            </div>

            <div class="match-list" v-else>
              <div
                v-for="match in myMatches"
                :key="match.match_id"
                class="match-card"
              >
                <div class="match-header">
                  <span
                    class="status-badge"
                    :class="getStatusClass(match.status_tag)"
                  >
                    {{ match.status_tag }}
                  </span>
                  <span class="date">{{ match.date_info }}</span>
                </div>
                <div class="match-body">
                  <h3>{{ match.sitter_name }}</h3>
                  <p>{{ match.status_description }}</p>
                </div>
                <button
                  v-if="match.show_review_button"
                  class="action-btn"
                >
                  후기 작성
                </button>
              </div>
            </div>
          </div>

        </section>

        <!-- 사이드바 -->
        <aside class="sidebar-section">
          
          <div class="login-block" v-if="!isLoggedIn">
            <p>로그인하고<br>맞춤 정보를 확인하세요!</p>
            <BaseButton type="primary" @click="$router.push('/login')">
              로그인 / 회원가입
            </BaseButton>
          </div>

          <div class="user-info-block" v-else>
            <p class="welcome-msg">
              반가워요, <strong>{{ userName }}</strong>님! 👋
            </p>

            <div class="user-actions">
              <BaseButton type="primary" @click="$router.push('/history')">
                📋 내 돌봄 내역
              </BaseButton>

              <BaseButton type="secondary" @click="$router.push('/chats')">
                💬 내 채팅
              </BaseButton>

              <BaseButton
                type="outline"
                @click="$router.push('/profile/edit/parent')"
              >
                ⚙️ 내 정보 수정
              </BaseButton>

              <button class="logout-link" @click="logout">
                로그아웃
              </button>
            </div>
          </div>

          <div class="ad-block"><span>광고</span></div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import BaseButton from '../components/BaseButton.vue'
import TheHeader from '../components/TheHeader.vue'

export default {
  components: { BaseButton, TheHeader },
  data() {
    return {
      isLoggedIn: false,
      userName: sessionStorage.getItem('userName') || '학부모',
      myMatches: [
        {
          match_id: 101,
          sitter_name: '김민지 선생님',
          status_tag: '승인 대기',
          status_description: '선생님 수락을 기다리고 있습니다.',
          date_info: '2025.12.25 (예정)',
          show_review_button: false
        },
        {
          match_id: 102,
          sitter_name: '이수현 선생님',
          status_tag: '진행중',
          status_description: '현재 돌봄 서비스가 진행 중입니다.',
          date_info: '2025.12.20 ~ 진행중',
          show_review_button: false
        },
        {
          match_id: 103,
          sitter_name: '박지성 선생님',
          status_tag: '종료됨',
          status_description: '돌봄이 종료되었습니다.',
          date_info: '2025.12.10',
          show_review_button: true
        }
      ],
      recommendedTeachers: [
        { id: 1, name: '김선생님', tags: '#실내놀이 #영어' },
        { id: 2, name: '이선생님', tags: '#등하원 #책읽기' },
        { id: 3, name: '박선생님', tags: '#학습지도 #한글' }
      ]
    }
  },
  async mounted() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

    if (token) {
      this.isLoggedIn = true

      try {
        const userRes = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
        if (userRes.data.name) {
          this.userName = userRes.data.name
          sessionStorage.setItem('userName', this.userName)
        }
      } catch (e) {
        console.warn('내 정보 로드 실패, 기본값 사용')
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      sessionStorage.clear()
      this.isLoggedIn = false
      this.$router.push('/login')
    },
    getStatusClass(status) {
      if (status === '진행중') return 'ongoing'
      if (status === '종료됨') return 'done'
      return 'pending'
    }
  }
}
</script>

<style scoped>
.home-page { background-color: #f8f9fa; min-height: 100vh; }
.main-container { max-width: 1200px; margin: 0 auto; padding: 0 20px 60px 20px; }
</style>
