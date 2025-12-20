<template>
  <div>
    <TheHeader />
    <main class="auth-layout">
      <div class="login-card">
        <div class="logo">
          <span class="logo-icon">🔗</span>
          <span class="logo-text">아이Link</span>
        </div>
        <p class="tagline">아이와 세상을 연결하는 다리</p>

        <form @submit.prevent="login">
          <div class="input-group">
            <label for="identifier">이메일 (아이디)</label>
            <input 
              type="text" 
              id="identifier" 
              v-model="identifier" 
              placeholder="이메일 또는 휴대폰 번호 입력" 
              autocomplete="username"
            />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="비밀번호를 입력하세요" 
              autocomplete="current-password"
            />
          </div>

          <BaseButton type="primary" :disabled="isLoggingIn">
            {{ isLoggingIn ? '로그인 중...' : '로그인' }}
          </BaseButton>
        </form>

        <BaseButton
          @click="$router.push('/signup')"
          type="outline"
          style="margin-top: 10px;"
        >
          회원가입
        </BaseButton>
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
      identifier: '',
      password: '',
      isLoggingIn: false
    }
  },
  methods: {
    async login() {
      if (!this.identifier || !this.password) {
        alert('아이디와 비밀번호를 모두 입력해주세요.')
        return
      }

      this.isLoggingIn = true

      try {
        const formData = new URLSearchParams()
        formData.append('username', this.identifier)
        formData.append('password', this.password)

        const response = await axios.post('/api/auth/token', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'ngrok-skip-browser-warning': 'true'
          }
        })

// 백엔드가 수정되었다면 response.data 안에 name이 들어있습니다.
        const data = response.data

        // 로그인 상태 + 역할 저장
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('userRole', data.role) // parent | sitter
        
        // [핵심] 서버에서 준 이름을 바로 저장합니다.
        localStorage.setItem('userName', data.name)

        if (data.user_id) {
          localStorage.setItem('userId', data.user_id)
        }

        alert(`${data.name}님 환영합니다!`)

        // 역할별 최초 이동
        if (data.role === 'sitter') {
          this.$router.push('/teacher-home')
        } else {
          // 부모는 router가 역할 분기
          this.$router.push('/')
        }

      } catch (error) {
        console.error(error)
        alert('아이디 또는 비밀번호를 확인해주세요.')
      } finally {
        this.isLoggingIn = false
      }
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 그대로 */
</style>
