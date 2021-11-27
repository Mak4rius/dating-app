import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import vuetify from './plugins/vuetify'
import firebase from "firebase"
import VueTyperPlugin from 'vue-typer'
import Chat from 'vue-beautiful-chat'
import Vuex from 'vuex'
import VueCardCarousel from "vue-card-carousel"
import FlatSurfaceShader from 'vue-flat-surface-shader'



Vue.use(Chat)

Vue.use(VueTyperPlugin)
Vue.use(VueCardCarousel)
Vue.use(FlatSurfaceShader)
Vue.config.productionTip = false

new Vue({
	router,
	store,
	vuetify,
	created () {
		// Configuration
		let config = {
			apiKey: "AIzaSyAqdskTz4-faAkbNMvWzpeBnxFvLUcIZUo",
			authDomain: "my-project-4da3c.firebaseapp.com",
			projectId: "my-project-4da3c",
			storageBucket: "my-project-4da3c.appspot.com",
			messagingSenderId: "685608924114",
			appId: "1:685608924114:web:99c10666f0cd963d060e0b",
			measurementId: "G-KBKZJCDVFP"
		}
		// Firebase Initialize
		firebase.initializeApp(config)
	
		// Auth Check
		firebase.auth().onAuthStateChanged((user) => {
		  if (user) {
				this.$store.dispatch('loggedUser', user) 
		  } 
		})
	  },
	render: h => h(App)
  }).$mount('#app')










