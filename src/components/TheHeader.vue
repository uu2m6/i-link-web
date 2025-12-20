<template>
  <header class="main-header">
    <div class="logo" @click="goHome">
      <span class="logo-icon" v-if="showIcon">🔗</span>
      아이Link
    </div>

    <nav class="header-nav">
      <router-link to="/customer-service">고객센터</router-link>
      <span>|</span>
      <router-link to="/terms">이용규정</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  props: {
    showIcon: { type: Boolean, default: false }
  },
  methods: {
    goHome() {
      this.$router.push('/'); 
    }
  }
}
</script>

<style scoped>
.main-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background-color: white; border-bottom: 1px solid #e9ecef; height: 60px; box-sizing: border-box; }
.logo { font-size: 20px; font-weight: 800; color: #FBBF24; cursor: pointer; display: flex; align-items: center; }
.logo-icon { margin-right: 5px; font-size: 24px; }
.header-nav a { color: #868e96; font-size: 14px; text-decoration: none; cursor: pointer; transition: color 0.2s; }
.header-nav a:hover { color: #FBBF24; }
.header-nav span { margin: 0 10px; color: #dee2e6; }
</style>