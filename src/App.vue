<template>
  <div id="app">
    <el-button type="primary" @click="goToRandomQuestions">随机题目</el-button>
    <el-button type="primary" @click="goToMockInterview">模拟面试</el-button>
    <router-view style="margin-top: 100px"/>
  </div>
</template>

<script>
export default {
  methods: {
    goToRandomQuestions() {
      this.$router.push('/RandomQuestions');
    },
    goToMockInterview() {
      this.$router.push('/mock-interview');
    }
  }
};
</script>

