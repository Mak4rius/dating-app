<template>
		<v-card 
		height="100vh"
		fluid
		class="mx-auto">
<chat-window :currentUserId="currentUserId" 
			 :height="height"
			 :rooms="rooms" 
			 :messages="messages"
			 :messagesLoaded="messagesLoaded"
			 :roomsLoaded="roomsLoaded"
			 :show-new-messages-divider="false"
			 :text-messages="{
								ROOMS_EMPTY: 'Нет диалогов',
								ROOM_EMPTY: 'Диалог не выбран',
								NEW_MESSAGES: 'Новые сообщения',
								MESSAGE_DELETED: 'Это сообщение было удалено',
								MESSAGES_EMPTY: 'Нет сообщений',
								CONVERSATION_STARTED: 'Диалог начался :',
								TYPE_MESSAGE: 'Сообщение...',
								SEARCH: 'Поиск',
								IS_ONLINE: 'онлайн',
								LAST_SEEN: 'последнее подключение ',
								IS_TYPING: 'печатает...'
							 }"
			 @send-message="sendMessage"
			 @fetch-messages="fetchMessages"/>
		</v-card>
</template>

<script>
  import ChatWindow from 'vue-advanced-chat'
  import 'vue-advanced-chat/dist/vue-advanced-chat.css'
  import firebase from "firebase"

  export default {
	methods:{
		async fetchMessages({room, options={}}){
			this.messages = []
			this.messagesLoaded = false
			var info = room.roomId
			this.currentRoomId = info
			console.log("bullshit")
			
			var messages = firebase.firestore().collection("messages").doc(this.currentRoomId).collection("messages")

			messages.where("senderId", "!=", this.$store.state.user.id).where("seen", "==", false).get().then((docSnapshot) => {
				console.log('outside loop')
				docSnapshot.forEach((doc) => {
					console.log('inside loop')
					console.log(doc.data().seen)
					console.log(doc.data().username)
					console.log(doc.data().content)
					messages.doc(doc.id).update({
						seen:true
						})
				})
			})
			
			messages.orderBy("timestamp").get().then((docSnapshot) => {
				docSnapshot.forEach((message) => {
				const british_date_format = message.data().timestamp.toDate().toLocaleDateString('en-GB')
				this.messages.push(message.data())
				const last_index = this.messages.length - 1
				this.messages[last_index].timestamp = british_date_format 
				console.log(this.messages[last_index].timestamp)
			})
			this.messagesLoaded = true
			})
		},

		async sendMessage(roomId, content, files, replyMessage, usersTag){
				/*
				*/

				var info = roomId

				var fileTemplate = 
					{
						name: "Example",
						size: 0,
						type: 'png',
						audio: false, 
						duration: 0, 
						url: 'ex.com',
						preview: 'ex.com'
					}	

				console.log("Your message is:")
				if(replyMessage == null){

						var OuterMessageTemplate =

									{
									_id: info.roomId,
									content: info.content,
									senderId: this.$store.state.user.id,
									username: this.$store.state.user.name,
									timestamp: null,
									saved: true,
									distributed: true,
									seen: false, 
									}

						var InnerMessageTemplate =

									{
									_id: info.roomId,
									content: info.content,
									senderId: this.$store.state.user.id,
									username: this.$store.state.user.name,
									timestamp: null,
									saved: true,
									distributed: true,
									seen: false, 
									}

					
						var userDate = new Date()

						InnerMessageTemplate.timestamp = userDate.toLocaleDateString('en-GB')
						this.messages.push(InnerMessageTemplate)

						var firestoreDate = firebase.firestore.Timestamp.fromDate(userDate)
						OuterMessageTemplate.timestamp = firestoreDate
						var request = await firebase.firestore().collection('messages').doc(info.roomId).collection('messages').doc().set(OuterMessageTemplate)

				}else{
					var replyTemplate = 
					{
						content: replyMessage.content,
						senderId: replyMessage.senderId,
					}
					if(replyMessage.files.length > 0){

					}
				}
			}
	},
	async beforeMount(){
		console.log(this.$store.state.user.id)
		this.currentUserId = this.$store.state.user.id
		
		var chat_rooms = await firebase.firestore()
		.collection('chats')
		.where("users", "array-contains", this.$store.state.user.id)
		.get()
		
		chat_rooms.forEach((doc) => {
			var roomTemplate = 
					{
					roomId: null,
					roomName: 'Room 1',
					lastMessage: {
					content: 'Last message received',
					senderId: 1234,
					username: 'John Doe',
					timestamp: null,
					},
					users: [
					{
						_id: 1234,
						username: 'John Doe',
						status: {
						state: 'online',
						lastChanged: 'today, 14:30'
						}
					},
					{
						_id: 4321,
						username: 'John Snow',
						status: {
						state: 'online',
						lastChanged: '14 July, 20:00'
						}
					}
					]
 				}	
			
			firebase.firestore().collection('messages').doc(doc.id)
			.collection('messages')
			.orderBy('timestamp', 'desc')
			.limit(1)
			.get().then((info) => {
				info.forEach((response) => {
				roomTemplate.lastMessage.content = response.data().content
				roomTemplate.lastMessage.senderId = response.data().senderId
				roomTemplate.lastMessage.username = response.data().username
				var wordlyTimestamp = response.data().timestamp.toDate().toLocaleDateString('en-GB')
				roomTemplate.lastMessage.timestamp = wordlyTimestamp
				})
			})

			if(doc.data().firstUser.name === this.$store.state.user.name){
				roomTemplate.roomId = doc.id
				roomTemplate.timestamp = firebase.firestore.FieldValue.serverTimestamp()
				roomTemplate.roomName = doc.data().secondUser.name
				roomTemplate.users[0]._id = doc.data().secondUser.id
				roomTemplate.users[0].username = doc.data().secondUser.name
				firebase.firestore()
				.collection('users')
				.doc(doc.data().secondUser.id)
				.get().then((fire_state) => {
					if(fire_state.data().online == 'true'){
					roomTemplate.users[0].status.state = 'online'
					}else{
					roomTemplate.users[0].status.state = 'offline'
					}
					roomTemplate.users[0].status.lastChanged = fire_state.data().lastChanged.toDate().toLocaleDateString('en-GB')
				})
				roomTemplate.username = doc.data().secondUser.name
				console.log(roomTemplate.users[0].status.state)
			}
			else{
				roomTemplate.roomId = doc.id
				roomTemplate.timestamp = firebase.firestore.FieldValue.serverTimestamp()
				roomTemplate.roomName = doc.data().firstUser.name
				roomTemplate.users[1]._id = doc.data().firstUser.id 
				roomTemplate.users[1].username = doc.data().firstUser.name
				firebase.firestore()
				.collection('users')
				.doc(doc.data().firstUser.id)
				.get().then((fire_state) => {
					if(fire_state.data().online == 'true'){
					roomTemplate.users[1].status.state = 'online'
					}else{
					roomTemplate.users[1].status.state = 'offline'
					}
					roomTemplate.users[1].status.lastChanged = fire_state.data().lastChanged.toDate().toLocaleDateString('en-GB')
				})
				roomTemplate.username = doc.data().firstUser.name
				console.log(roomTemplate.users[1].status.state)
			}
			this.rooms.push(roomTemplate)
		})

		this.roomsLoaded = true
	},
	created () {

	},
    data: () => ({
      cards: ['Today', 'Yesterday'],
	  roomsLoaded: false,
	  messagesLoaded: true,
      drawer: null,
      currentUserId: null,
	  currentRoomId: null,
	  height: '100vh',
	  rooms: [],
	  messages:[],
      links: [
        ['mdi-inbox-arrow-down', 'Inbox'],
        ['mdi-send', 'Send'],
        ['mdi-delete', 'Trash'],
        ['mdi-alert-octagon', 'Spam'],
      ],
    }),
	components: {
      ChatWindow
    }
  }

</script>


<!-- Rooms prop 
rooms="[
  {
    roomId: 1,
    roomName: 'Room 1',
    lastMessage: {
      content: 'Last message received',
      sender_id: 1234,
      username: 'John Doe',
      timestamp: '10:20',
      date: 123242424,
      seen: false,
      new: true
    },
    users: [
      {
        _id: 1234,
        username: 'John Doe',
        status: {
          state: 'online',
          last_changed: 'today, 14:30'
        }
      },
      {
        _id: 4321,
        username: 'John Snow',
        status: {
          state: 'offline',
          last_changed: '14 July, 20:00'
        }
      }
    ],
    typingUsers: [ 4321 ]
  }
]"
-->