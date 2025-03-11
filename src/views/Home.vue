<template>
  <el-container class="home">
    <el-header class="header">
      <h1>前端面试题库</h1>
      <el-button type="primary" :icon="Refresh" @click="refreshQuestions" class="refresh-btn">
        刷新题目
      </el-button>
    </el-header>
    <el-main>
      <el-row :gutter="20" class="question-list">
        <el-col v-for="category in questionCategories" 
                :key="category.title"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                :xl="6">
          <template v-for="question in category.questions" :key="question.id">
            <el-card class="question-card" shadow="hover">
              <div class="question-title">{{ question.title }}</div>
              <el-collapse v-model="question.showAnswer">
                <el-collapse-item name="1">
                  <template #title>
                    <el-button type="primary" link class="view-answer-btn">
                      {{ question.showAnswer ? '收起答案' : '查看答案' }}
                    </el-button>
                  </template>
                  <div v-html="question.renderedAnswer" class="answer-content"></div>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </template>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import { Refresh } from '@element-plus/icons-vue'
import jsQuestions from '../datalist/js.json'
import vueQuestions from '../datalist/vue.json'
import reactQuestions from '../datalist/react.json'
import codeQuestions from '../datalist/code.json'

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
})

const questionCategories = ref([])

const getRandomQuestions = (questions, min = 3, max = 5) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  return [...questions].sort(() => 0.5 - Math.random()).slice(0, count)
}

const refreshQuestions = () => {
  const categories = [
    { title: 'JavaScript 基础', questions: jsQuestions },
    { title: 'Vue.js 相关', questions: vueQuestions },
    { title: 'React 相关', questions: reactQuestions },
    { title: '编程题', questions: codeQuestions }
  ]

  questionCategories.value = categories.map(category => ({
    title: category.title,
    questions: getRandomQuestions(category.questions).map(q => ({
      ...q,
      showAnswer: false,
      renderedAnswer: md.render(q.answer)
    }))
  }))
}

onMounted(() => {
  refreshQuestions()
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background-color: #f5f7fa;
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
    font-weight: 600;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    .refresh-btn {
      width: 100%;
    }
  }
}

.question-list {
  margin: 2rem auto;
  max-width: 1400px;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin: 1rem auto;
  }
}

.question-card {
  margin-bottom: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .question-title {
    font-size: 1.1rem;
    color: #2c3e50;
    font-weight: 500;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      border: none;
      padding: 0;
      height: auto;
    }

    .el-collapse-item__wrap {
      border: none;
    }

    .el-collapse-item__content {
      padding: 1rem 0;
    }
  }

  .view-answer-btn {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    width: 100%;
    justify-content: center;
  }
}

.answer-content {
  color: #4a5568;
  line-height: 1.6;

  :deep(pre) {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1rem 0;
  }

  :deep(p) {
    margin: 0.8rem 0;
  }

  :deep(ul), :deep(ol) {
    padding-left: 1.5rem;
    margin: 1rem 0;
  }

  :deep(code) {
    background-color: #f1f1f1;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }
}
</style>