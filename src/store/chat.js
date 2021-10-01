import firebase from "firebase"

export default{
	state: {
		chats: null
	},
	mutations: {
		getChats(state, payload){
			state.chats = payload
		}, 
	  },
	actions: {

	  },
    getters:{

	  },
}