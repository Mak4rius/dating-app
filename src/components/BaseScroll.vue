<template>
	<v-card 
	color="rgb(255, 0, 0, 0)"
    class="overflow-y-auto mx-auto"
	height="100%"
	width="100%"
	v-scroll.self="onScroll"
	align="center">
	<v-container
	>
	<v-row             
	align="center"
	>
	<v-col
	v-for="user in userList"
	:key="user"
	sm="6"
	md="5"
	offset-md="2"
	lg="6"
	offset-lg="0"
	>

		<UserCard 
		:_id="user._id"
		:username="user.username" 
		:city="user.city" 
		:age="user.age" 
		:sex="user.sex" 
		:height="user.height" 
		:weight="user.weight"
		:photos="user.photos"
		/>
		
	</v-col>
	</v-row>
	</v-container>
	</v-card>

</template>

<script>

  import HistoryCard from '../components/HistoryCard.vue'
  import UserCard from '../components/UserCard.vue'
  import firebase from "firebase"

  export default {
    data: () => ({
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ],
		lastUser: null,
		option: 5,
		userLimit: 3,
		// Parameters required to be known for a succesful search 
		//------------------------------------------------------------------------------
		sex: '',
		city: '',
		lowerBound: '',
		upperBound: '',
		telegram: false,
		whatsup: false,
		online: false,
		//------------------------------------------------------------------------------
		userList: [], 
		cards: ['Today', 'Yesterday'],
		drawer: null,
		links: [
			['mdi-inbox-arrow-down', 'Inbox'],
			['mdi-send', 'Send'],
			['mdi-delete', 'Trash'],
			['mdi-alert-octagon', 'Spam'],
      			],
   		 }),
	async created() {

		this.userList = []
		this.$root.$refs.BaseScroll = this
		
		const query = firebase.firestore().collection('users')
		.orderBy('age','asc')
		.limit(this.userLimit)

		const users = await query.get()

		users.forEach((user)=> {

				const data = {
					_id: user.data()._id,
					username: user.data().username,
					age: user.data().age,
					city: user.data().city,
					sex: user.data().sex, 
					height: user.data().height,
					weight: user.data().weight,
					telegram: user.data().telegram,
					whatsup: user.data().whatsup,
					phone: user.data().phone,
					photos: user.data().photos,
					online: user.data().online,
					lastChanged: user.data().lastChanged
				}

				this.userList.push(data)

			})
		
		this.lastUser = users.docs[users.docs.length - 1]
	},
	mounted() {
		this.$root.$on('changeSearch', (sex, city, lowerBound, upperBound, telegram, whatsup, online) => {
			
			console.log('new')
			this.sex = sex
			this.city = city 
			this.lowerBound = lowerBound
			this.upperBound = upperBound
			this.telegram = telegram
			this.whatsup = whatsup
			this.online = online

			this.lastUser = null 
			this.userList = []
			
			console.log(telegram)
			console.log(whatsup)
			if(telegram && whatsup){
				this.option = 1
				console.log('social networks')
				this.sortingSocialNetworksOnSearch(sex, city, lowerBound, upperBound, online)
			}
			else if(telegram){
				this.option = 2
				console.log('telegram network')
				this.sortingTelegramOnSearch(sex, city, lowerBound, upperBound, online)
			}
			else if(whatsup){
				this.option = 3
				console.log('whatsup')
				this.sortingWhatsupOnSearch(sex, city, lowerBound, upperBound, online)
			}else{
				if(online){
					console.log('no social networks, but online')
					this.option = 4
					this.sortingOnlineOnSearch(sex, city, lowerBound, upperBound)				
				}else{
					console.log('no social networks, but offline')
					this.option = 0
					this.sortingOnSearch(sex, city, lowerBound, upperBound)
				}
			}
		})
	},
	components: {
	HistoryCard,
	UserCard,
	},
	methods: {
		onScroll ({ target: { scrollTop, clientHeight, scrollHeight, offsetHeight }}) {
			let bottomOfWindow = Math.max(window.pageYOffset, scrollTop, scrollTop) + window.innerHeight === offsetHeight
			if ( (scrollTop + clientHeight >= scrollHeight) || (bottomOfWindow)){
				console.log('scrolled to bottom')
				switch(this.option){
					case 0:
						// usual sortingOnSearch
						this.sortingOnScroll()

					case 1:
						// sortingSocialNetworksOnSearch
						this.sortingSocialNetworksOnScroll()

					case 2:
						// sortingTelegramOnSearch
						this.sortingTelegramOnScroll()

					case 3:
						//sortingWhastupOnSearch
						this.sortingWhatsupOnScroll()
					case 4:
						// sortin OnlineOnSearch
						this.sortingOnlineOnScroll()

					default:
						this.searchOnScroll()
				}
			}
    	},
		async searchOnScroll(){
			
			const query = firebase.firestore().collection('users')
			.orderBy('age', 'asc')
			.startAfter(this.lastUser)
			.limit(this.userLimit)

			const users = await query.get()

			users.forEach((user)=> {
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}else{
								const data = {
								_id: user.data()._id,
								username: user.data().username,
								age: user.data().age,
								city: user.data().city,
								sex: user.data().sex, 
								height: user.data().height,
								weight: user.data().weight,
								telegram: user.data().telegram,
								whatsup: user.data().whatsup,
								phone: user.data().phone,
								photos: user.data().photos,
								online: user.data().online,
								lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
				})
			
			if(users.docs[users.docs.length - 1]){
				this.lastUser = users.docs[users.docs.length - 1]
			}

		},
		//------------------------------------------------------------------------------
		//  Simple search based on city and sex
		async sortingOnSearch(sex, city, lowerBound, upperBound){
			if(sex === 'Девушку' || sex === 'Мужчину'){
				var sexOption = (sex === 'Девушку') ? '1' : '0'
				firebase.firestore().collection('users')
				.where('city','==',city)
				.where('sex','==', sexOption)
				.where('age','>=',lowerBound)
				.where('age','<=',upperBound)
				.orderBy('age', 'asc')
				.limit(this.userLimit)
				.get().then((users) => {

					users.forEach((user)=> {
					const data = {
						_id: user.data()._id,
						username: user.data().username,
						age: user.data().age,
						city: user.data().city,
						sex: user.data().sex, 
						height: user.data().height,
						weight: user.data().weight,
						telegram: user.data().telegram,
						whatsup: user.data().whatsup,
						phone: user.data().phone,
						photos: user.data().photos,
						online: user.data().online,
						lastChanged: user.data().lastChanged
					}
					this.userList.push(data)
					})
					if(users.docs[users.docs.length - 1]){
						this.lastUser = users.docs[users.docs.length - 1]
					}
				})
			}
			else{
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.orderBy('age', 'asc')
					.limit(this.userLimit)
					.get().then((users) => {
						
						users.forEach((user)=> {

						const data = {
							_id: user.data()._id,
							username: user.data().username,
							age: user.data().age,
							city: user.data().city,
							sex: user.data().sex, 
							height: user.data().height,
							weight: user.data().weight,
							telegram: user.data().telegram,
							whatsup: user.data().whatsup,
							phone: user.data().phone,
							photos: user.data().photos,
							online: user.data().online,
							lastChanged: user.data().lastChanged
						}
						this.userList.push(data)

						})
						if(users.docs[users.docs.length - 1]){
						this.lastUser = users.docs[users.docs.length - 1]
						}
				})
			}
		},
		async sortingOnScroll(){
			if(this.sex === 'Девушку' || this.sex === 'Мужчину'){
			var sexOption = (this.sex === 'Девушку') ? '1' : '0'
			firebase.firestore().collection('users')
			.where('city','==',this.city)
			.where('sex','==', sexOption)
			.where('age','>=',this.lowerBound)
			.where('age','<=',this.upperBound)
			.orderBy('age', 'asc')
			.startAfter(this.lastUser)
			.limit(this.userLimit)
			.get().then((users) => {
				users.forEach((user)=> {
					if(this.lastUser.data()._id === user.data()._id){
					console.log('We dont add new users no more')
					}else{
						const data = {
							_id: user.data()._id,
							username: user.data().username,
							age: user.data().age,
							city: user.data().city,
							sex: user.data().sex, 
							height: user.data().height,
							weight: user.data().weight,
							telegram: user.data().telegram,
							whatsup: user.data().whatsup,
							phone: user.data().phone,
							photos: user.data().photos,
							online: user.data().online,
							online: user.data().online,
							lastChanged: user.data().lastChanged
						}

						this.userList.push(data)
					}
				})
				if(users.docs[users.docs.length - 1]){
						this.lastUser = users.docs[users.docs.length - 1]
				}
			})
			}
			else{
			firebase.firestore().collection('users')
			.where('city','==',this.city)
			.where('age','>=',this.lowerBound)
			.where('age','<=',this.upperBound)
			.orderBy('age', 'asc')
			.startAfter(this.lastUser)
			.limit(this.userLimit)
			.get().then((users) => {
				users.forEach((user)=> {
				if(this.lastUser.data()._id === user.data()._id){
					console.log('We dont add new users no more')
					}
				else{
					const data = {
						_id: user.data()._id,
						username: user.data().username,
						age: user.data().age,
						city: user.data().city,
						sex: user.data().sex, 
						height: user.data().height,
						weight: user.data().weight,
						telegram: user.data().telegram,
						whatsup: user.data().whatsup,
						phone: user.data().phone,
						photos: user.data().photos,
						online: user.data().online,
						online: user.data().online,
						lastChanged: user.data().lastChanged
					}
					this.userList.push(data)
				}
				})
				if(users.docs[users.docs.length - 1]){
					this.lastUser = users.docs[users.docs.length - 1]
				}
			  })
			}
		},
		//------------------------------------------------------------------------------
		//	 Simple search based on city, sex, online statues, and presence of telegram
		async sortingTelegramOnSearch(sex, city, lowerBound, upperBound, online){
			if(online){
				if(sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}				
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('sex','==', sexOption)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}				
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
			else{
				if(sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.limit(this.userLimit)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('sex','==', sexOption)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.limit(this.userLimit)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
		},
		async sortingTelegramOnScroll(){
			if(this.online){
				if(this.sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}				
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('sex','==', sexOption)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}				
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
			else{
				if(this.sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('sex','==', sexOption)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}

			}
		},
		//------------------------------------------------------------------------------
		//	 Simple search based on city, sex, online status, and presence of whatsup
		async sortingWhatsupOnSearch(sex, city, lowerBound, upperBound, online){
			if(online){
				if(sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('sex','==', sexOption)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
			else{
				if(sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('sex','==', sexOption)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
		},
		async sortingWhatsupOnScroll(){
				
			if(this.online){
				if(this.sex === 'Не важно'){

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('sex','==', sexOption)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
					}
			}
			else{
				if(this.sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==', this.city)
					.where('age','>=', this.lowerBound)
					.where('age','<=', this.upperBound)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==', this.city)
					.where('sex','==', sexOption)
					.where('age','>=', this.lowerBound)
					.where('age','<=', this.upperBound)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
		},
		//------------------------------------------------------------------------------
		//	 Simple search based on presence of all social networks and online status.
		async sortingSocialNetworksOnSearch(sex, city, lowerBound, upperBound, online){
			if(online){
				if(sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (sex === 'Девушку') ? '1' : '0'
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('sex','==', sexOption)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
			else{
				if(sex === 'Не важно'){
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('sex','==', sexOption)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.orderBy('age', 'asc')
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
		},
		async sortingSocialNetworksOnScroll(){
			if(this.online){
				if(this.sex === 'Не важно'){

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'
					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('sex','==', sexOption)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',true)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
			else{
				if(this.sex === 'Не важно'){
					
					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('sex','==', sexOption)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.limit(this.userLimit)
					.get().then((users) => {
						users.forEach((user)=> {
						if(user.data().telegram != "None" && user.data().whatsup != "None"){
							if(this.lastUser.data()._id === user.data()._id){
								console.log('We dont add new users no more')
							}
							else{		
								const data = {
									_id: user.data()._id,
									username: user.data().username,
									age: user.data().age,
									city: user.data().city,
									sex: user.data().sex, 
									height: user.data().height,
									weight: user.data().weight,
									telegram: user.data().telegram,
									whatsup: user.data().whatsup,
									phone: user.data().phone,
									photos: user.data().photos,
									online: user.data().online,
									lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
							}
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
			}
		},
		//------------------------------------------------------------------------------
		//	 Simple search based on online status
		async sortingOnlineOnSearch(sex, city, lowerBound, upperBound){
				if(sex === 'Не важно'){

				firebase.firestore().collection('users')
				.where('online', '==', true)
				.where('city','==',city)
				.where('age','>=',lowerBound)
				.where('age','<=',upperBound)
				.limit(this.userLimit)
				.orderBy('age', 'asc')
				.get().then((users) => {
					console.log(users)
					users.forEach((user) => {
								const data = {
								_id: user.data()._id,
								username: user.data().username,
								age: user.data().age,
								city: user.data().city,
								sex: user.data().sex, 
								height: user.data().height,
								weight: user.data().weight,
								telegram: user.data().telegram,
								whatsup: user.data().whatsup,
								phone: user.data().phone,
								photos: user.data().photos,
								online: user.data().online,
								lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
					})
					if(users.docs[users.docs.length - 1]){
						this.lastUser = users.docs[users.docs.length - 1]
					}
				})
				}else{
				var sexOption = (sex === 'Девушку') ? '1' : '0'

				firebase.firestore().collection('users')
				.where('online', '==', true)
				.where('city','==',city)
				.where('sex','==', sexOption)
				.where('age','>=',lowerBound)
				.where('age','<=',upperBound)
				.limit(this.userLimit)
				.orderBy('age', 'asc')
				.get().then((users) => {
					console.log(users)
					users.forEach((user) => {
								const data = {
								_id: user.data()._id,
								username: user.data().username,
								age: user.data().age,
								city: user.data().city,
								sex: user.data().sex, 
								height: user.data().height,
								weight: user.data().weight,
								telegram: user.data().telegram,
								whatsup: user.data().whatsup,
								phone: user.data().phone,
								photos: user.data().photos,
								online: user.data().online,
								lastChanged: user.data().lastChanged
								}
								this.userList.push(data)
					})
					if(users.docs[users.docs.length - 1]){
						this.lastUser = users.docs[users.docs.length - 1]
					}
				})
				}
		},
		async sortingOnlineOnScroll(){
				if(this.sex === 'Не важно'){

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',this.online)
					.limit(this.userLimit)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.get().then((users) => {
						users.forEach((user)=> {
							if(this.lastUser.data()._id === user.data()._id){
									console.log('We dont add new users no more')
							}else{
								const data = {
								_id: user.data()._id,
								username: user.data().username,
								age: user.data().age,
								city: user.data().city,
								sex: user.data().sex, 
								height: user.data().height,
								weight: user.data().weight,
								telegram: user.data().telegram,
								whatsup: user.data().whatsup,
								phone: user.data().phone,
								photos: user.data().photos,
								online: user.data().online,
								lastChanged: user.data().lastChanged
							}
							this.userList.push(data)
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}else{
					var sexOption = (this.sex === 'Девушку') ? '1' : '0'

					firebase.firestore().collection('users')
					.where('city','==',this.city)
					.where('sex','==', sexOption)
					.where('age','>=',this.lowerBound)
					.where('age','<=',this.upperBound)
					.where('online','==',this.online)
					.limit(this.userLimit)
					.orderBy('age', 'asc')
					.startAfter(this.lastUser)
					.get().then((users) => {
						users.forEach((user)=> {
							if(this.lastUser.data()._id === user.data()._id){
									console.log('We dont add new users no more')
							}else{
								const data = {
								_id: user.data()._id,
								username: user.data().username,
								age: user.data().age,
								city: user.data().city,
								sex: user.data().sex, 
								height: user.data().height,
								weight: user.data().weight,
								telegram: user.data().telegram,
								whatsup: user.data().whatsup,
								phone: user.data().phone,
								photos: user.data().photos,
								online: user.data().online,
								lastChanged: user.data().lastChanged
							}
							this.userList.push(data)
							}
						})
						if(users.docs[users.docs.length - 1]){
							this.lastUser = users.docs[users.docs.length - 1]
						}
					})
				}
		}
	}
  }
</script>