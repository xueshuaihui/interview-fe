<template>
  <el-container class="mock-interview">
    <el-header class="header">
      <h1>模拟面试</h1>
      <el-button type="primary" :icon="Refresh" @click="refreshContent" class="refresh-btn">
        刷新
      </el-button>
    </el-header>
    <el-main class="markdown-container">
      <div 
        v-if="renderedContent"
        v-html="renderedContent"
        class="fullscreen-markdown"
      />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mockInterData from '../datalist/mockInter.json'
import MarkdownIt from 'markdown-it'


const content = ref('')
const renderedContent = ref('')
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    return '<pre class="code-block"><code>' + str + '</code></pre>'
  }
})

const refreshContent = () => {
  const randomQuestion = mockInterData[Math.floor(Math.random() * mockInterData.length)]
  content.value = randomQuestion.answer
  renderedContent.value = md.render(content.value)
}

onMounted(() => {
  refreshContent()
})
</script>

<style lang="scss" scoped>
.markdown-content {
  h1, h2, h3 {
    color: #2c3e50;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  pre {
    background-color: #f6f8fa;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  blockquote {
    border-left: 4px solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
    margin: 1em 0;
  }
}

.mock-interview {
  min-height: 100vh;
  background-color: #f5f7fa;

  .el-main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

  h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.8rem;
  }

  .refresh-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

.markdown-container {
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 2rem;
}

.fullscreen-markdown {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  text-align: left;

  h1, h2, h3 {
    color: #2c3e50;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
    margin-top: 1.5em;
  }

  pre.code-block {
    background-color: #f6f8fa;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    code {
      background: transparent;
      padding: 0;
    }
  }

  code:not(pre code) {
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  blockquote {
    border-left: 4px solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
    margin: 1em 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    td, th {
      border: 1px solid #dfe2e5;
      padding: 0.6em 1em;
    }
    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }
}

.answer-content {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.95rem;

  :deep(code) {
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  :deep(pre) {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
  }
}
</style>