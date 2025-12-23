<template>
  <div class="chat-list-page">
    <TheHeader />

    <main class="chat-list-container">
      <h1 class="title">💬 내 채팅</h1>

      <div v-if="rooms.length === 0" class="empty">
        아직 채팅이 없습니다.
      </div>

      <div
        v-for="room in rooms"
        :key="room.roomId"
        class="chat-room-item"
        @click="openRoom(room.roomId)"
      >
        <div class="room-info">
          <div class="name">{{ room.otherName }}</div>
          <div class="last-msg">{{ room.lastMessage }}</div>
        </div>
        <div class="time">{{ room.lastTime }}</div>
      </div>
    </main>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'

export default {
  name: 'ChatListView',
  components: { TheHeader },
  data() {
    return {
      rooms: []
    }
  },
  mounted() {
    this.loadRooms()
  },
  methods: {
    loadRooms() {
      const myId = sessionStorage.getItem('userId') || 'parent'
      const rooms = []

      // localStorage 전체를 훑어서 chatRoom:* 찾기
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (!key.startsWith('chatRoom:')) continue

        const roomId = key.replace('chatRoom:', '')
        if (!roomId.includes(myId)) continue

        const meta = JSON.parse(localStorage.getItem(key))
        const messages = JSON.parse(localStorage.getItem(`chat:${roomId}`) || '[]')
        const last = messages[messages.length - 1]

        rooms.push({
          roomId,
          otherName: meta.otherName || '상대',
          lastMessage: last ? last.text : '(메시지 없음)',
          lastTime: last ? last.time : ''
        })
      }

      this.rooms = rooms
    },
    openRoom(roomId) {
      this.$router.push(`/chat/${roomId}`)
    }
  }
}
</script>

<style scoped>
.chat-list-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.chat-list-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 60px;
}

.chat-room-item {
  background: white;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.chat-room-item:hover {
  background: #fffbea;
}

.room-info .name {
  font-weight: 700;
  margin-bottom: 6px;
}

.last-msg {
  font-size: 14px;
  color: #666;
}

.time {
  font-size: 12px;
  color: #999;
}
</style>
