<template>
  <div class="chat-page">
    <TheHeader />

    <main class="chat-container">
      <!-- 채팅방 헤더 -->
      <ChatRoomHeader :otherName="otherName" />

      <!-- 메시지 목록 -->
      <div class="chat-body" ref="chatBody">
        <ChatMessage
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :myId="myId"
        />
      </div>

      <!-- 입력창 -->
      <ChatInput @send="sendMessage" />
    </main>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import ChatRoomHeader from '@/components/ChatRoomHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'

export default {
  name: 'ChatView',
  components: {
    TheHeader,
    ChatRoomHeader,
    ChatMessage,
    ChatInput
  },
  data() {
    return {
      roomId: '',
      myId: '',
      otherId: '',
      otherName: '상대',
      messages: []
    }
  },
  mounted() {
    // 1) roomId
    this.roomId = this.$route.params.roomId

    // 2) 내 ID
    this.myId = localStorage.getItem('userId') || 'me'

    // 3) 상대 정보
    const roomMeta = JSON.parse(
      localStorage.getItem(`chatRoom:${this.roomId}`) || '{}'
    )
    this.otherId = roomMeta.otherId || 'other'
    this.otherName = roomMeta.otherName || '상대'

    // 4) 메시지 로드
    this.loadMessages()

    // 5) 스크롤
    this.$nextTick(this.scrollToBottom)
  },
  methods: {
    loadMessages() {
      const saved = localStorage.getItem(`chat:${this.roomId}`)
      if (saved) {
        this.messages = JSON.parse(saved)
      } else {
        this.messages = [
          {
            id: 1,
            senderId: this.otherId,
            text: '안녕하세요! 문의 주셔서 감사합니다 :)',
            time: this.nowTime()
          },
          {
            id: 2,
            senderId: this.myId,
            text: '안녕하세요! 돌봄 가능 시간 문의드려요.',
            time: this.nowTime()
          }
        ]
        this.saveMessages()
      }
    },
    saveMessages() {
      localStorage.setItem(
        `chat:${this.roomId}`,
        JSON.stringify(this.messages)
      )
    },
    nowTime() {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    },
    sendMessage(text) {
      const nextId = this.messages.length
        ? this.messages[this.messages.length - 1].id + 1
        : 1

      this.messages.push({
        id: nextId,
        senderId: this.myId,
        text,
        time: this.nowTime()
      })

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
.chat-page {
  background: #f8f9fa;
  min-height: 100vh;
}

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

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
}
</style>