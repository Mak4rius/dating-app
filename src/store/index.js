import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
// We import the helper class that will hold the information about our user. 
import User from "./user_help"
import common from "./common"
import chat from "./chat"

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
	user: null,
  },
  mutations: {
	  setUser(state, payload){
		  state.user = payload
	  },
	  addChat(state, payload){
		  state.user.chats.push(payload)
	  },
	  clearUser(state){
		  state.user = null
	  }
  },
  actions: {
	async getUsers({commit}){
		try{
			const user_collection = await firebase.firestore().collection('users').get()
			console.log(user_collection)
			user_collection.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, " => ", doc.data());
			})
			commit('setUserList', user_collection)

		}catch(e){
			console.log(e)
		}
	},

	async registerUser({commit}, {email, password, username, age, city, sex, height, weight}){
		/**
		 * This function register a user, and pass all the information about the user in the local storage.
		 * user: 
		 * 	_id: user_id
		 * 	username: user_name
		 * 	age: user_age 
		 * 	sex: user_sex 
		 *  height: user_height
		 * 	weight: user_weight
		 * 	telegram: user_telegram
		 * 	whatsup: user_whatsup
		 * 	phone: user_phone
		 * 	photos: array_of_photos
		 * 	online: True if user online, otherwise false
		 */
		commit('clearError')
		commit('setLoading', true)
		try{
		const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
		// We create a blueprint with the set of parameters for our user
		var timestamp = firebase.firestore.FieldValue.serverTimestamp()
		const unique_user = {
			_id: user.user.uid,
			username: username,
			age: age,
			sex: sex,
			city: city,
			height: height,
			weight: weight,
			telegram: 'None', 
			whatsup: 'None',
			phone: 'None',
			photos: [],
			online: true,
			lastChanged: timestamp
		}
		// We add a user, with specific id to collection
		const create_user = await firebase.firestore().collection('users').doc(user.user.uid).set({
			_id: user.user.uid,
			username: unique_user.username,
			age: unique_user.age,
			city: unique_user.city,
			sex: unique_user.sex,
			height: unique_user.height,
			weight: unique_user.weight,
			telegram: unique_user.telegram,
			whatsup: unique_user.whatsup,
			phone: unique_user.phone,
			photos: unique_user.photos,
			online: unique_user.online,
			lastChanged: timestamp
		})	

		const create_status = await firebase.database().ref("/status" + unique_user._id)

		commit('setUser', new User(
			unique_user._id, 
			unique_user.username,
			unique_user.age,
			unique_user.sex,
			unique_user.city,
			unique_user.height,
			unique_user.weight,
			unique_user.telegram,
			unique_user.whatsup,
			unique_user.phone,
			unique_user.photos,
			unique_user.online,
			unique_user.lastChanged
			))
		commit('setLoading', false)
	    }catch(error){
			commit('setLoading',false)
			commit('setError', error.message)
			throw error
		}
	},

	async uploadImages({commit}, {url}){
		/**
		 * This function uploads user's photos to s3 storage and it returns url
		 */
	},
	
	async loginUser({commit}, {email, password}){
		/**
		 * 
		 * This function, logins user in, essentially what it means:
		 * is that we retrieve a value from a database, getting all the info and passing it in local storage.
		 * 
		 * 
		 */
		commit('clearError')
		commit('setLoading', true) // this mutation allow us to show on the button, when pressed loading
		try{
		const user = await firebase.auth().signInWithEmailAndPassword(email, password)
		const updating = await firebase.firestore().collection('users').doc(user.user.uid).update({
			online: true,
			lastChanged: firebase.firestore.FieldValue.serverTimestamp()
		})
		const actual_user = await firebase.firestore().collection('users').doc(user.user.uid).get()

		commit('setUser', new User(
			user.user.uid, 
			actual_user.data().username,
			actual_user.data().age,
			actual_user.data().sex,
			actual_user.data().city,
			actual_user.data().height,
			actual_user.data().weight,
			actual_user.data().telegram,
			actual_user.data().whatsup,
			actual_user.data().phone,
			actual_user.data().photos,
			actual_user.data().online,
			actual_user.data().lastChanged
			))
		commit('setLoading',false)
	    }catch(error){
			commit('setLoading',false)
			commit('setError',error.message)
			throw error
		}
	},
	async loggedUser({commit}, payload){
		const actual_user = await firebase.firestore().collection('users').doc(payload.uid).get()
		console.log(payload.uid)
		commit('setUser', 
			new User(
			payload.uid, 
			actual_user.data().username, 
			actual_user.data().age,
			actual_user.data().sex, 
			actual_user.data().city, 
			actual_user.data().height, 
			actual_user.data().weight,
			actual_user.data().telegram,
			actual_user.data().whatsup,
			actual_user.data().phone,
			actual_user.data().photos,
			actual_user.data().online,
			actual_user.data().lastChanged
			))

	},
	async logoutUser({commit}){
		console.log(this.state.user.uid)
		await firebase.firestore().collection('users').doc(this.state.user._id).update({
			online: false,
			lastChanged: firebase.firestore.FieldValue.serverTimestamp()
			})
		await firebase.auth().signOut()
		commit('clearUser')
		console.log('You are logged out!!!')

	}
  },
  getters:{
	user (state){
		return state.user
	},
	checkUser (state){
		return state.user !== null
	}
  },
  modules: {
	  common,
	  chat
  }
})
