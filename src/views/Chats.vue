<template>
		<v-card 
		height="100vh"
		fluid
		class="mx-auto">

		<chat-window
			:height="height"
			:styles="styles"
			:current-user-id="this.$store.state.user._id"
			:room-id="roomId"
			:rooms="loadedRooms"
			:loading-rooms="loadingRooms"
			:messages="messages"
			:messages-loaded="messagesLoaded"
			:rooms-loaded="roomsLoaded"
			:room-actions="roomActions"
			:menu-actions="menuActions"
			:room-message="roomMessage"
			:templates-text="templatesText"
			:show-add-room='false'
			:messageActions="[
				{
					name: 'replyMessage',
					title: 'Ответить'
				}
				]"
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
				LAST_SEEN: 'Был онлайн ',
				IS_TYPING: 'печатает...'
				}"
			@fetch-more-rooms="fetchMoreRooms"
			@fetch-messages="fetchMessages"
			@send-message="sendMessage"
			@edit-message="editMessage"
			@delete-message="deleteMessage"
			@add-room="addRoom"
			@room-action-handler="menuActionHandler"
			@menu-action-handler="menuActionHandler"
			@typing-message="typingMessage"
			@toggle-rooms-list="$emit('show-demo-options', $event.opened)"
		>
		</chat-window>
		</v-card>
</template>

<script>
  import ChatWindow from 'vue-advanced-chat'
  import 'vue-advanced-chat/dist/vue-advanced-chat.css'
  import firebase from "firebase"
  import { parseTimestamp, formatTimestamp } from '@/utils/dates'

  export default {
	components: {
      ChatWindow
    },
	emits: ['show-demo-options'],
    data: () => ({
		height: '100vh',
		roomsPerPage: 15,
		rooms: [],
		roomId: '',
		startRooms: null,
		endRooms: null,
		roomsLoaded: false,
		loadingRooms: true,
		allUsers: [],
		loadingLastMessageByRoom: 0,
		roomsLoadedCount: false,
		selectedRoom: null,
		messagesPerPage: 20,
		messages: [],
		messagesLoaded: false,
		roomMessage: '',
		lastLoadedMessage: null,
		previousLastLoadedMessage: null,
		roomsListeners: [],
		listeners: [],
		typingMessageCache: '',
		disableForm: false,
		addNewRoom: null,
		addRoomUsername: '',
		inviteRoomId: null,
		invitedUsername: '',
		removeRoomId: null,
		removeUserId: '',
		removeUsers: [],
		roomActions: [
			{ name: 'deleteRoom', title: 'Удалить чат' }
			],
		menuActions: [
			{ name: 'deleteRoom', title: 'Удалить чат' }
		],
		styles: { container: { borderRadius: '4px' } },
		templatesText: [
			{
				tag: 'help',
				text: 'This is the help'
			},
			{
				tag: 'action',
				text: 'This is the action'
			},
			{
				tag: 'action 2',
				text: 'This is the second action'
			}
		]
	}),
	
	computed: {
		loadedRooms() {
			return this.rooms.slice(0, this.roomsLoadedCount)
		},
		screenHeight() {
			return this.isDevice ? window.innerHeight + 'px' : 'calc(100vh - 80px)'
		}
	},
	mounted() {
		this.fetchRooms()
		firebase.firestore().collection('users').doc(this.$store.state.user._id).update({online: true})
	},
	methods: {
		resetRooms() {
			this.loadingRooms = true
			this.loadingLastMessageByRoom = 0
			this.roomsLoadedCount = 0
			this.rooms = []
			this.roomsLoaded = true
			this.startRooms = null
			this.endRooms = null
			this.roomsListeners.forEach(listener => listener())
			this.roomsListeners = []
			this.resetMessages()
		},
		resetMessages() {
			this.messages = []
			this.messagesLoaded = false
			this.lastLoadedMessage = null
			this.previousLastLoadedMessage = null
			this.listeners.forEach(listener => listener())
			this.listeners = []
		},
		fetchRooms() {
			this.resetRooms()
			this.fetchMoreRooms()
		},
		async fetchMoreRooms() {
			const ROOMS_PATH = 'chatRooms'
			const USERS_PATH = 'users'

			if (this.endRooms && !this.startRooms) {
				this.roomsLoaded = true
				return
			}
			
			if(this.startRooms){
				const query =  firebase.firestore().collection(ROOMS_PATH)
				.where(USERS_PATH, 'array-contains', this.$store.state.user._id)
				.orderBy('lastUpdated', 'desc')
				.limit(this.roomsPerPage)
				.startAfter(this.startRooms)

				const rooms = await query.get()

				this.roomsLoaded = rooms.empty || rooms.size < this.roomsPerPage
				if (this.startRooms) this.endRooms = this.startRooms
				this.startRooms = rooms.docs[rooms.docs.length - 1]
				const roomUserIds = []
				rooms.forEach(room => {
					room.data().users.forEach(userId => {
						const foundUser = this.allUsers.find(user => user?._id === userId)
						if (!foundUser && roomUserIds.indexOf(userId) === -1) {
							roomUserIds.push(userId)
						}
					})
				})
				// this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
				const rawUsers = []
				roomUserIds.forEach(userId => {
					const promise = firebase.firestore()
					.collection('users')
					.doc(userId)
					.get().then((user) => user.data())
					rawUsers.push(promise)
				})
				this.allUsers = [...this.allUsers, ...(await Promise.all(rawUsers))]
				const roomList = {}
				rooms.forEach(room => {
					roomList[room.id] = { ...room.data(), users: [] }
					room.data().users.forEach(userId => {
						const foundUser = this.allUsers.find(user => user?._id === userId)
						if (foundUser) roomList[room.id].users.push(foundUser)
					})
				})
				const formattedRooms = []
				Object.keys(roomList).forEach(key => {
					const room = roomList[key]
					const roomContacts = room.users.filter(
						user => user._id !== this.$store.state.user._id
					)
					room.roomName =
						roomContacts.map(user => user.username).join(', ') || 'Myself'
					const roomAvatar =
						roomContacts.length === 1 && roomContacts[0].avatar
							? roomContacts[0].avatar
							: require('@/assets/mac1024.png')
					formattedRooms.push({
						...room,
						roomId: key,
						avatar: roomAvatar,
						index: room.lastUpdated.seconds,
						lastMessage: {
							content: 'Room created',
							timestamp: formatTimestamp(
								new Date(room.lastUpdated.seconds),
								room.lastUpdated
							)
						}
					})
				})
				this.rooms = this.rooms.concat(formattedRooms)
				formattedRooms.forEach(room => this.listenLastMessage(room))
				if (!this.rooms.length) {
					this.loadingRooms = false
					this.roomsLoadedCount = 0
				}
				this.listenUsersOnlineStatus(formattedRooms)
				this.listenRooms(query)


			}else{
				const query =  firebase.firestore().collection(ROOMS_PATH)
				.where(USERS_PATH, 'array-contains', this.$store.state.user._id)
				.orderBy('lastUpdated', 'desc')
				.limit(this.roomsPerPage)

				const rooms = await query.get()

				// this.incrementDbCounter('Fetch Rooms', rooms.size)
				
				this.roomsLoaded = rooms.empty || rooms.size < this.roomsPerPage
				if (this.startRooms) this.endRooms = this.startRooms
				this.startRooms = rooms.docs[rooms.docs.length - 1]
				const roomUserIds = []
				rooms.forEach(room => {
					room.data().users.forEach(userId => {
						const foundUser = this.allUsers.find(user => user?._id === userId)
						if (!foundUser && roomUserIds.indexOf(userId) === -1) {
							roomUserIds.push(userId)
						}
					})
				})
				// this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
				const rawUsers = []
				roomUserIds.forEach(userId => {
					const promise = firebase.firestore().collection('users')
					.doc(userId).get().then((user) => user.data())
					rawUsers.push(promise)
				})
				this.allUsers = [...this.allUsers, ...(await Promise.all(rawUsers))]
				const roomList = {}
				rooms.forEach(room => {
					roomList[room.id] = { ...room.data(), users: [] }
					room.data().users.forEach(userId => {
						const foundUser = this.allUsers.find(user => user?._id === userId)
						if (foundUser) roomList[room.id].users.push(foundUser)
					})
				})
				const formattedRooms = []
				Object.keys(roomList).forEach(key => {
					const room = roomList[key]
					const roomContacts = room.users.filter(
						user => user._id !== this.$store.state.user._id
					)
					room.roomName =
						roomContacts.map(user => user.username).join(', ') || 'Myself'
					const roomAvatar =
						roomContacts.length === 1 && roomContacts[0].avatar
							? roomContacts[0].avatar
							: require('@/assets/logo.png')
					formattedRooms.push({
						...room,
						roomId: key,
						avatar: roomAvatar,
						index: room.lastUpdated.seconds,
						lastMessage: {
							content: 'Room created',
							timestamp: formatTimestamp(
								new Date(room.lastUpdated.seconds),
								room.lastUpdated
							)
						}
					})
				})
				this.rooms = this.rooms.concat(formattedRooms)
				formattedRooms.forEach(room => this.listenLastMessage(room))
				if (!this.rooms.length) {
					this.loadingRooms = false
					this.roomsLoadedCount = 0
				}
				this.listenUsersOnlineStatus(formattedRooms)
				this.listenRooms(query)

			}
			setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
		},
		listenLastMessage(room) {

			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
					return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
				}

			const listener = 
				firebase
				.firestore()
				.collection(MESSAGE_PATH(room.roomId))
				.orderBy('timestamp', 'desc')
				.limit(1)
				.onSnapshot((messages) => {
					// this.incrementDbCounter('Listen Last Room Message', messages.size)
					messages.forEach(message => {
						const lastMessage = this.formatLastMessage(message.data())
						const roomIndex = this.rooms.findIndex(
							r => room.roomId === r.roomId
						)
						this.rooms[roomIndex].lastMessage = lastMessage
						this.rooms = [...this.rooms]
					})
					if (this.loadingLastMessageByRoom < this.rooms.length) {
						this.loadingLastMessageByRoom++
						if (this.loadingLastMessageByRoom === this.rooms.length) {
							this.loadingRooms = false
							this.roomsLoadedCount = this.rooms.length
						}
					}
				})
			this.roomsListeners.push(listener)
		},
		formatLastMessage(message) {
			if (!message.timestamp) return
			let content = message.content
			if (message.files?.length) {
				const file = message.files[0]
				content = `${file.name}.${file.extension || file.type}`
			}
			return {
				...message,
				...{
					content,
					timestamp: formatTimestamp(
						new Date(message.timestamp.seconds * 1000),
						message.timestamp
					),
					distributed: true,
					seen: message.sender_id === this.$store.state.user._id ? message.seen : null,
					new:
						message.sender_id !== this.$store.state.user._id &&
						(!message.seen || !message.seen[this.$store.state.user._id])
				}
			}
		},
		fetchMessages({ room, options = {} }) {
			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
					return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
				}

			this.$emit('show-demo-options', false)

			if (options.reset) {
				this.resetMessages()
				this.roomId = room.roomId
			}

			if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
				this.messagesLoaded = true
				return
			}

			this.selectedRoom = room.roomId

			if(this.lastLoadedMessage){

			const query = firebase.firestore()
			.collection(MESSAGE_PATH(room.roomId))
			.orderBy('timestamp', 'desc')
			.limit(this.messagesPerPage)
			.startAfter(this.lastLoadedMessage)
			.get()

			query.then(messages => {
				// this.incrementDbCounter('Fetch Room Messages', messages.size)
				//if (this.selectedRoom !== room.roomId) return
				if (messages.empty || messages.docs.length < this.messagesPerPage) {
					setTimeout(() => (this.messagesLoaded = true), 0)
				}

				if (options.reset) this.messages = []

				messages.forEach(message => {
					const formattedMessage = this.formatMessage(room, message)
					this.messages.unshift(formattedMessage)
				})

				if (this.lastLoadedMessage) {
					this.previousLastLoadedMessage = this.lastLoadedMessage
				}
				this.lastLoadedMessage = messages.docs[messages.docs.length - 1]

				if(this.lastLoadedMessage && this.previousLastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.startAt(this.lastLoadedMessage)
					.endAt(this.previousLastLoadedMessage).onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
				else if(this.lastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.startAt(this.lastLoadedMessage).onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)

				}
				else if(this.previousLastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.endAt(this.previousLastLoadedMessage).onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
				else{
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp').onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
			})

			}
			else if(this.messagesPerPage){
			
			const query = firebase.firestore()
			.collection(MESSAGE_PATH(room.roomId))
			.orderBy('timestamp', 'desc')
			.limit(this.messagesPerPage)
			.get()

			query.then(messages => {
				// this.incrementDbCounter('Fetch Room Messages', messages.size)
				if (this.selectedRoom !== room.roomId) return
				if (messages.empty || messages.docs.length < this.messagesPerPage) {
					setTimeout(() => (this.messagesLoaded = true), 0)
				}
				if (options.reset) this.messages = []
				messages.forEach(message => {
					const formattedMessage = this.formatMessage(room, message)
					this.messages.unshift(formattedMessage)
				})
				if (this.lastLoadedMessage) {
					this.previousLastLoadedMessage = this.lastLoadedMessage
				}
				this.lastLoadedMessage = messages.docs[messages.docs.length - 1]
				// ************************** SHIT DROPS DOWN ******************************

				if(this.lastLoadedMessage && this.previousLastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.startAt(this.lastLoadedMessage)
					.endAt(this.previousLastLoadedMessage).onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
				else if(this.lastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.startAt(this.lastLoadedMessage).onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)

				}
				else if(this.previousLastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.endAt(this.previousLastLoadedMessage).onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
				else{
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp').onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
			})

			}
			else{
			const query = firebase.firestore()
			.collection(MESSAGE_PATH(room.roomId))
			.get()
			
			query.then(messages => {
				// this.incrementDbCounter('Fetch Room Messages', messages.size)
				if (this.selectedRoom !== room.roomId) return
				if (messages.empty || messages.docs.length < this.messagesPerPage) {
					setTimeout(() => (this.messagesLoaded = true), 0)
				}
				if (options.reset) this.messages = []
				messages.forEach(message => {
					const formattedMessage = this.formatMessage(room, message)
					this.messages.unshift(formattedMessage)
				})
				if (this.lastLoadedMessage) {
					this.previousLastLoadedMessage = this.lastLoadedMessage
				}
				this.lastLoadedMessage = messages.docs[messages.docs.length - 1]

				if(this.lastLoadedMessage && this.previousLastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.startAt(this.lastLoadedMessage)
					.endAt(this.previousLastLoadedMessage)
					.onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
				else if(this.lastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.startAt(this.lastLoadedMessage)
					.onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
				else if(this.previousLastLoadedMessage){
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.endAt(this.previousLastLoadedMessage)
					.onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}else{
					const listener = firebase.firestore()
					.collection(MESSAGE_PATH(room.roomId))
					.orderBy('timestamp')
					.onSnapshot((querySnapshot) => {
						this.listenMessages(querySnapshot, room)
					})
					this.listeners.push(listener)
				}
			})
			}
		},
		listenMessages(messages, room){
			messages.forEach(message => {
				const formattedMessage = this.formatMessage(room, message)
				const messageIndex = this.messages.findIndex(m => m._id === message.id)
				console.log('listend messages')
				if (messageIndex === -1) {
					this.messages = this.messages.concat([formattedMessage])
				} else {
					this.messages[messageIndex] = formattedMessage
					this.messages = [...this.messages]
				}
				this.markMessagesSeen(room, message)
			})
		},
		markMessagesSeen(room, message) {
			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
					return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
				}

			if (
				message.data().sender_id !== this.$store.state.user._id &&
				(!message.data().seen || !message.data().seen[this.$store.state.user._id])
			) {
				firebase.firestore().collection(MESSAGE_PATH(room.roomId)).doc(message.id).update({
					[`seen.${this.$store.state.user._id}`]: new Date()
				})
			}
		},
		formatMessage(room, message) {
			const senderUser = room.users.find(
				user => message.data().sender_id === user._id
			)
			const { timestamp } = message.data()
			const formattedMessage = {
				...message.data(),
				...{
					senderId: message.data().sender_id,
					_id: message.id,
					seconds: timestamp.seconds,
					timestamp: parseTimestamp(timestamp, 'HH:mm'),
					date: parseTimestamp(timestamp, 'DD MMMM YYYY'),
					username: senderUser ? senderUser.username : null,
					// avatar: senderUser ? senderUser.avatar : null,
					distributed: true
				}
			}
			if (message.data().replyMessage) {
				formattedMessage.replyMessage = {
					...message.data().replyMessage,
					...{
						senderId: message.data().replyMessage.sender_id
					}
				}
			}
			return formattedMessage
		},
		async sendMessage({ content, roomId, files, replyMessage }) {

			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
					return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
				}

			const message = {
				sender_id: this.$store.state.user._id,
				content,
				timestamp: new Date()
			}
			if (files) {
				message.files = this.formattedFiles(files)
			}
			if (replyMessage) {
				message.replyMessage = {
					_id: replyMessage._id,
					content: replyMessage.content,
					sender_id: replyMessage.senderId
				}
				if (replyMessage.files) {
					message.replyMessage.files = replyMessage.files
				}
			}

			const { id } = await firebase.firestore().collection(MESSAGE_PATH(roomId)).doc()
			console.log(id)
			await firebase.firestore().collection(MESSAGE_PATH(roomId)).doc(id).set(message)
			
			if (files) {
				for (let index = 0; index < files.length; index++) {
					await this.uploadFile({ file: files[index], messageId: id, roomId })
				}
			}
			firebase.firestore().collection('chatRooms').doc(roomId).update({ lastUpdated: new Date() })
			// given room id and data we update document 
			// with roomRef(roomId) and data 
		},
		async editMessage({ messageId, newContent, roomId, files }) {
			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
				return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
			}

			const newMessage = { edited: new Date() }
			newMessage.content = newContent
			if (files) {
				newMessage.files = this.formattedFiles(files)
			} else {
				newMessage.files = firestoreService.deleteDbField
			}
			await firebase.firestore().collection(MESSAGE_PATH(roomId)).doc(messageId).update(newMessage)
			// updateMessages( roomId, messageId, newMessage )
			if (files) {
				for (let index = 0; index < files.length; index++) {
					if (files[index]?.blob) {
						await this.uploadFile({ file: files[index], messageId, roomId })
					}
				}
			}
		},	
		async deleteMessage({ message, roomId }) {

			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
				return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
			}

			await firebase.firestore().collection(MESSAGE_PATH(roomId)).doc(message._id).update({deleted: new Date()})

			const { files } = message
			if (files) {
				files.forEach(file => {
					// TODO: Add function to deleter from database
					//storageService.deleteFile(this.currentUserId, message._id, file)
				})
			}
		},
		async loadRoom(query) {
			query.forEach(async room => {
				if (this.loadingRooms) return
				await firebase.firestore().collection('chatRooms').doc(room.id).update({ lastUpdated: new Date() })
				this.roomId = room.id
				this.fetchRooms()
			})
		},
		menuActionHandler({ action, roomId }) {
			switch (action.name) {
				case 'inviteUser':
					return this.inviteUser(roomId)
				case 'removeUser':
					return this.removeUser(roomId)
				case 'deleteRoom':
					return this.deleteRoom(roomId)
			}
		},
		typingMessage({ message, roomId }) {
			const TYPING_USERS_FIELD = 'typingUsers'
			if (roomId) {
				if (message?.length > 1) {
					this.typingMessageCache = message
					return
				}
				if (message?.length === 1 && this.typingMessageCache) {
					this.typingMessageCache = message
					return
				}
				this.typingMessageCache = message

				const action = message ? 'add' : 'remove'
				const arrayUpdate = action === 'add' ? firebase.firestore.FieldValue.arrayUnion(this.$store.state.user._id) : firebase.firestore.FieldValue.arrayRemove(this.$store.state.user._id)
				firebase.firestore().collection('chatRooms').doc(roomId).update({[TYPING_USERS_FIELD] : arrayUpdate})
			}
		},
		async listenRooms(query) {
			const listener = query.onSnapshot((rooms) => {
				rooms.forEach(room => {
					const foundRoom = this.rooms.find(r => r.roomId === room.id)
					if (foundRoom) {
						foundRoom.typingUsers = room.data().typingUsers
						foundRoom.index = room.data().lastUpdated.seconds
					}  
				})
			})
			this.roomsListeners.push(listener)
		},
		listenUsersOnlineStatus(rooms) {
			rooms.forEach(room => {
				room.users.forEach(user => {
					const listener = firebase.database().ref('/status'+ user._id)
					.on('value', (snapshot) => {
						if(!snapshot || !snapshot.val()) return 
						const lastChanged = formatTimestamp(
								new Date(snapshot.val().lastChanged),
								new Date(snapshot.val().lastChanged)
						)
						user.status = { ...snapshot.val(), lastChanged }
						const roomIndex = this.rooms.findIndex(
								r => room.roomId === r.roomId
						)
						this.rooms[roomIndex] = room
						this.rooms = [...this.rooms]
					})
					this.roomsListeners.push(listener)
				})
			})
		},
		addRoom() {
			this.resetForms()
			this.addNewRoom = true
		},
		async createRoom() {
			this.disableForm = true
			const { id } = await firebase.firestore().collection('users').doc({username: this.addRoomUsername})

			await firebase.firestore().collection('users').doc(id).update({ _id: id })
			await firebase.firestore().collection('chatRooms').doc().set({
				users: [id, this.$store.state.user._id],
				lastUpdated: new Date()
			})
			this.addNewRoom = false
			this.addRoomUsername = ''
			this.fetchRooms()
		},
		inviteUser(roomId) {
			this.resetForms()
			this.inviteRoomId = roomId
		},
		async addRoomUser() {
			const ROOM_USERS_FIELD = 'users'

			this.disableForm = true
			const { id } = await firebase.firestore().collection('users').doc().set({ username: this.invitedUsername })
			await firebase.firestore().collection('users').doc(id).update({ _id: id })
			await firebase.firestore().collection('chatRooms').doc(this.inviteRoomId).update({
				[ROOM_USERS_FIELD]: firebase.firestore.FieldValue.arrayUnion(id)
			})

			this.inviteRoomId = null
			this.invitedUsername = ''
			this.fetchRooms()
		},
		removeUser(roomId) {
			this.resetForms()
			this.removeRoomId = roomId
			this.removeUsers = this.rooms.find(room => room.roomId === roomId).users
		},
		async deleteRoomUser() {

			const ROOM_USERS_FIELD = 'users'

			this.disableForm = true
			await firebase.firestore().collection('chatRooms').doc(this.removeRoomId).update({
				[ROOM_USERS_FIELD]: firebase.firestore.FieldValue.arrayRemove(this.removeUserId)
			})

			this.removeRoomId = null
			this.removeUserId = ''
			this.fetchRooms()
		},
		async deleteRoom(roomId) {
			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
				return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
			}
			
			if(this.lastLoadedMessage){
				firebase.firestore().collection(MESSAGE_PATH(roomId))
				.orderBy('timestamp', 'desc')
				.limit(this.messagesPerPage)
				.startAfter(this.lastLoadedMessage)
				.get()
				.then((messages) => {
					messages.forEach(message => {
						firebase.firestore().collection(MESSAGE_PATH(roomId)).doc(message.id).delete()
						if (message.data().files) {
							message.data().files.forEach(file => {
								//storageService.deleteFile(this.currentUserId, message.id, file)
							})
						}
					})
				})
				await firebase.firestore().collection('chatRooms').doc(roomId).delete()
				this.fetchRooms()
			}
			else if(this.messagesPerPage){
				firebase.firestore().collection(MESSAGE_PATH(roomId))
				.orderBy('timestamp', 'desc')
				.limit(this.messagesPerPage)
				.get()
				.then((messages) => {
					messages.forEach(message => {
						firebase.firestore().collection(MESSAGE_PATH(roomId)).doc(message.id).delete()
						if (message.data().files) {
							message.data().files.forEach(file => {
								storageService.deleteFile(this.$store.state.user._id, message.id, file)
							})
						}
					})
				})
				await firebase.firestore().collection('chatRooms').doc(roomId).delete()
				this.fetchRooms()
			}else{
				firebase.firestore().collection(MESSAGE_PATH(roomId)).get().then((messages) => {
					messages.forEach(message => {
						firebase.firestore().collection(MESSAGE_PATH(roomId)).doc(message.id).delete()
						if (message.data().files) {
							message.data().files.forEach(file => {
								storageService.deleteFile(this.$store.state.user._id, message.id, file)
							})
						}
					})
				})
							
				await firebase.firestore().collection('chatRooms').doc(roomId).delete()
				this.fetchRooms()
			}


		},
		resetForms() {
			this.disableForm = false
			this.addNewRoom = null
			this.addRoomUsername = ''
			this.inviteRoomId = null
			this.invitedUsername = ''
			this.removeRoomId = null
			this.removeUserId = ''
		}
  	}
  }
</script>