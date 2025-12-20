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
        <section class="recommendation-section">
          <h2>맞춤 돌봄 선생님을 추천해드려요 ✨</h2>
          <div class="recommendation-grid">
            <router-link 
              v-for="teacher in recommendedTeachers" 
              :key="teacher.id" 
              :to="'/teacher/' + teacher.id"
              class="teacher-card-link"
            >
              <div class="teacher-card">
                <div class="teacher-photo"></div>
                <div class="teacher-info">
                  <p class="name">{{ teacher.name }}</p>
                  <p class="tags">{{ teacher.tags }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <aside class="sidebar-section">
          
          <!-- 로그인 전 -->
          <div class="login-block" v-if="!isLoggedIn">
            <p>로그인하고<br>맞춤 정보를 확인하세요!</p>
            <BaseButton
              type="primary"
              @click="$router.push('/login')"
            >
              로그인 / 회원가입
            </BaseButton>
          </div>

          <!-- 로그인 후 (학부모) -->
          <div class="user-info-block" v-else>
            <p class="welcome-msg">
              반가워요, <strong>{{ userName }}</strong>님! 👋
            </p>

            <div class="user-actions">
              <BaseButton
                type="secondary"
                @click="$router.push('/history')"
              >
                내 돌봄 내역
              </BaseButton>

              <BaseButton
                type="outline"
                @click="$router.push('/profile/edit/parent')"
              >
                프로필 수정
              </BaseButton>

              <button class="logout-link" @click="logout">
                로그아웃
              </button>
            </div>
          </div>

          <div class="ad-block">
            <span>광고</span>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import TheHeader from '../components/TheHeader.vue'

export default {
  components: {
    BaseButton,
    TheHeader
  },
  data() {
    return {
      isLoggedIn: false,
      userName: '',
      recommendedTeachers: [
        { id: 1, name: '김선생님', tags: '#실내놀이 #영어' },
        { id: 2, name: '이선생님', tags: '#등하원 #책읽기' },
        { id: 3, name: '박선생님', tags: '#학습지도 #한글' },
        { id: 4, name: '최선생님', tags: '#야외활동 #미술' },
        { id: 5, name: '정선생님', tags: '#신생아 #실내놀이' },
        { id: 6, name: '강선생님', tags: '#등하원 #영어놀이' }
      ]
    }
  },
  mounted() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true
      this.userName = localStorage.getItem('userName') || '회원'
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userName')
      localStorage.removeItem('user')
      alert('로그아웃 되었습니다.')
      this.$router.go()
    }
  }
}
</script>

<style scoped>
</style>
