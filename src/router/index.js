import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/RandomQuestions',
    name: 'RandomQuestions',
    component: () => import('../views/RandomQuestions.vue')
  },
  {
    path: '/mock-interview',
    name: 'MockInterview',
    component: () => import('../views/MockInterview.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router