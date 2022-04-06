import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Chats from '../views/Chats.vue'
import Profile from '../views/Profile.vue'
import Search from '../views/Search.vue'
import Login from '../views/Login.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Главная',
    component: Home,
  },
  {
    path: '/chats',
    name: 'Диалоги',
    component: Chats,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/profile',
    name: 'Профиль',
    component: Profile,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/search',
    name: 'Поиск',
    component: Search
  },
  {
    path: '/login',
    name: 'Логин',
    component: Login,
  }
]

const router = new VueRouter({
  routes
})

export default router
