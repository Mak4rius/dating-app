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


Vue.use(Chat)

Vue.use(VueTyperPlugin)

Vue.use(VueCardCarousel)
Vue.config.productionTip = false

new Vue({
	router,
	store,
	vuetify,
	created () {
		// Configuration
		let config = {
			apiKey: "AIzaSyA9jZYtrTl7qUkq8PnPimIXORhCP41M728",
			authDomain: "web-app-e7c86.firebaseapp.com",
			databaseURL: "https://web-app-e7c86-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "web-app-e7c86",
			storageBucket: "web-app-e7c86.appspot.com",
			messagingSenderId: "990912086423",
			appId: "1:990912086423:web:11322d4938f2f7eaf084d2",
			measurementId: "G-3JQG0H1JBW"
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










