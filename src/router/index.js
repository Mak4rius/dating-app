import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Chats from '../views/Chats.vue'
import Profile from '../views/Profile.vue'
import Search from '../views/Search.vue'
import Services from '../views/Services.vue'
import Delete from '../views/Delete.vue'
import ChangePassword from '../views/ChangePassword.vue'
import Insearch from '../views/Insearch.vue'
import Logging from '../views/Logging.vue'
import Settings from '../views/Settings.vue'
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
    path: '/services',
    name: 'Услуги',
    component: Services,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/delete',
    name: 'Удалить',
    component: Delete,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/changepassword',
    name: 'Сменить пароль',
    component: ChangePassword,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/insearch',
    name: 'Показывать в поиске?',
    component: Insearch,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/iplog',
    name: 'История входов',
    component: Logging,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/settings',
    name: 'Настройки',
    component: Settings,
	beforeEnter(to,from,next){
		// if checkUser is true, then next(), if false then next('/login')
		store.getters.checkUser ? next() : next('/login') 
	}
  },
  {
    path: '/login',
    name: 'Логин',
    component: Login,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Settings
  }
]

const router = new VueRouter({
  routes
})

export default router
