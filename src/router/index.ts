import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Room from '@/views/Room.vue';
import SignUp from '@/views/SignUp.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/room/:id', name: 'room', props: true, component: Room },
  { path: '/signUp', name: 'signUp', component: SignUp },
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
