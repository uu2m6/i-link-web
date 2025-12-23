<template>
  <div class="chat-page">
    <TheHeader />

    <main class="chat-container">
      <!-- 채팅방 헤더 -->
      <div class="chat-room-header">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="room-title">
          <div class="name">{{ otherName }}</div>
          <div class="sub">1:1 채팅</div>
        </div>
      </div>

      <!-- 메시지 목록 -->
      <div class="chat-body" ref="chatBody">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="msg-row"
          :class="{ mine: msg.senderId === myId }"
        >
          <div class="bubble">
            <div class="text">{{ msg.text }}</div>
            <div class="time">{{ msg.time }}</div>
          </div>
        </div>
      </div>

      <!-- 입력창 -->
      <form class="chat-input" @submit.prevent="sendMessage">
        <input
          v-model="draft"
          type="text"
          placeholder="메시지를 입력하세요…"
        />
        <button type="submit" :disabled="!draft.trim()">전송</button>
      </form>
    </main>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'

export default {
  name: 'ChatView',
  components: { TheHeader },
  data() {
    return {
      roomId: '',
      myId: '',
      otherId: '',
      otherName: '상대',

      draft: '',
      messages: []
    }
  },
  mounted() {
    // 1) roomId 받기
    this.roomId = this.$route.params.roomId

    // 2) 내 정보(로그인 사용자)
    // 이미 LoginView에서 userId 저장함
    this.myId = localStorage.getItem('userId') || 'me'

    // 3) 상대 정보 (1단계: localStorage에 저장된 정보가 있으면 사용)
    const roomMeta = JSON.parse(localStorage.getItem(`chatRoom:${this.roomId}`) || '{}')
    this.otherId = roomMeta.otherId || 'other'
    this.otherName = roomMeta.otherName || '상대'

    // 4) 채팅 로드 (localStorage)
    this.loadMessages()

    // 5) 스크롤 아래로
    this.$nextTick(this.scrollToBottom)
  },
  methods: {
    loadMessages() {
      const saved = localStorage.getItem(`chat:${this.roomId}`)
      if (saved) {
        this.messages = JSON.parse(saved)
      } else {
        // 첫 진입 기본 더미 메시지
        this.messages = [
          { id: 1, senderId: this.otherId, text: '안녕하세요! 문의 주셔서 감사합니다 :)', time: this.nowTime() },
          { id: 2, senderId: this.myId, text: '안녕하세요! 돌봄 가능 시간 문의드려요.', time: this.nowTime() }
        ]
        this.saveMessages()
      }
    },
    saveMessages() {
      localStorage.setItem(`chat:${this.roomId}`, JSON.stringify(this.messages))
    },
    nowTime() {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    },
    sendMessage() {
      const text = this.draft.trim()
      if (!text) return

      const nextId = this.messages.length ? this.messages[this.messages.length - 1].id + 1 : 1
      this.messages.push({
        id: nextId,
        senderId: this.myId,
        text,
        time: this.nowTime()
      })

      this.draft = ''
      this.saveMessages()

      this.$nextTick(this.scrollToBottom)
    },
    scrollToBottom() {
      const el = this.$refs.chatBody
      if (el) el.scrollTop = el.scrollHeight
    }
  }
}
</script>

<style scoped>
.chat-page { background: #f8f9fa; min-height: 100vh; }

.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.chat-room-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  background: white;
}
.back-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
}
.room-title .name { font-weight: 800; }
.room-title .sub { font-size: 12px; color: #888; margin-top: 2px; }

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
}

.msg-row {
  display: flex;
  margin: 8px 0;
}
.msg-row.mine {
  justify-content: flex-end;
}
.bubble {
  max-width: 70%;
  background: white;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}
.msg-row.mine .bubble {
  background: #fff7e6;
  border-color: #ffe1a3;
}

.text { white-space: pre-wrap; line-height: 1.4; }
.time { font-size: 11px; color: #999; margin-top: 6px; text-align: right; }

.chat-input {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid #eee;
  background: white;
}
.chat-input input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  outline: none;
}
.chat-input input:focus {
  border-color: #FBBF24;
  box-shadow: 0 0 0 3px rgba(251,191,36,0.18);
}
.chat-input button {
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  font-weight: 800;
  cursor: pointer;
  background: #FBBF24;
}
.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>