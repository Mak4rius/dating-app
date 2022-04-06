import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import vuetify from './plugins/vuetify'
import firebase from "firebase"
import VueTyperPlugin from 'vue-typer'
import Chat from 'vue-beautiful-chat'
import Vuex from 'vuex'
import VueCardCarousel, { f } from "vue-card-carousel"
import FlatSurfaceShader from 'vue-flat-surface-shader'
import VueOnlineProp from "vue-online-prop"


Vue.use(VueOnlineProp)
Vue.use(Chat)
Vue.use(VueTyperPlugin)
Vue.use(VueCardCarousel)
Vue.use(FlatSurfaceShader)
Vue.config.productionTip = false

var vm = new Vue({
	router,
	store,
	vuetify,
	created () {
		// Configuration
		let config = {
			apiKey: "AIzaSyAqdskTz4-faAkbNMvWzpeBnxFvLUcIZUo",
			authDomain: "my-project-4da3c.firebaseapp.com",
			databaseURL: "https://my-project-4da3c-default-rtdb.europe-west1.firebasedatabase.app",
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
				this.$store.dispatch('loggedUser', user).then((result) => {
					var timestamp = firebase.firestore.FieldValue.serverTimestamp()
		
					const isOfflineForDatabase = {
						state: 'offline',
						last_changed: timestamp,
					}
					const isOnlineForDatabase = {
						state: 'online',
						last_changed: timestamp,
					}
			
					var connectedRef = firebase.database().ref(".info/connected")
					if(this.$store.state.user){
						firebase.database().ref('/status' + this.$store.state.user._id).onDisconnect().set(isOfflineForDatabase)
					}
					connectedRef.on("value", (snap) => {
					  if (snap.val() === true) {
						console.log("connected", this.$store.state.user)
						if(this.$store.state.user){
							console.log('write online in database')
							firebase.database().ref('/status' + this.$store.state.user._id).set(isOnlineForDatabase)
							firebase.firestore().collection('users').doc(this.state.user._id).update({
								online: true,
								lastChanged: timestamp
							})
						}
					  } else {
						console.log("not connected")
						if(this.$store.state.user){
							console.log('write offline in database')
							firebase.database().ref('/status' + this.$store.state.user._id).set(isOfflineForDatabase)
							firebase.firestore().collection('users').doc(this.state.user._id).update({
								online: false,
								lastChanged: timestamp
							})
						}
					  }
					})
				})
		  } 
		})
	  },
	render: h => h(App)
  }).$mount('#app')










