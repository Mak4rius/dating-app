<template>
	<v-card 
	color="rgb(255, 0, 0, 0)"
    class="overflow-y-auto mx-auto"
	height="100%"
	width="100%"
	align="center">
	<v-container>
        <v-row             
		align="center"
        >
 	    <v-col
		v-for="user in user_list"
        :key="user"
        sm="6"
        md="5"
        offset-md="2"
        lg="6"
        offset-lg="0">

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
		lastUserId: null,
		userLimit: 5,
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
		user_list: [], 
		cards: ['Today', 'Yesterday'],
		drawer: null,
		links: [
			['mdi-inbox-arrow-down', 'Inbox'],
			['mdi-send', 'Send'],
			['mdi-delete', 'Trash'],
			['mdi-alert-octagon', 'Spam'],
      			],
   		 }),
	created() {
		this.$root.$refs.BaseScroll = this
		firebase.firestore().collection('users')
		.orderBy('age','asc')
		.limit(this.userLimit)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc)=> {
				const data = {
					_id: doc.data()._id,
					username: doc.data().username,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight,
					telegram: doc.data().telegram,
					whatsup: doc.data().whatsup,
					phone: doc.data().phone,
					photos: doc.data().photos,
					online: doc.data().online,
					lastChanged: doc.data().lastChanged
				}
				this.user_list.push(data)
			})
		})
	},
	mounted() {
		this.$root.$on('changeSearch', (sex, city, lowerBound, upperBound, telegram, whatsup, online) => {
			
			this.sex = sex
			this.city = city 
			this.lowerBound = lowerBound
			this.upperBound = upperBound
			this.telegram = telegram
			this.whatsup = whatsup
			this.online = online

			this.user_list = []
			this.lastUserId = null
			
			if(!(telegram && whatsup)){
				this.sortingOnSearch(sex, city, lowerBound, upperBound)
			}
			else if(telegram && whatsup){
				this.sortingSocialNetworksOnSearch(sex, city, lowerBound, upperBound, online)
			}
			else if(telegram){
				this.sortingTelegramOnSearch(sex, city, lowerBound, upperBound, online)
			}
			else if(whatsup){
				this.sortingWhatsupOnSearch(sex, city, lowerBound, upperBound, online)
			}
		})
	},
	components: {
	HistoryCard,
	UserCard,
	},
	methods: {

		//------------------------------------------------------------------------------
		//  Simple search based on city and sex
		async sortingOnSearch(sex, city, lowerBound, upperBound){
			if(sex == 'Девушку' || sex == 'Мужчину'){
				var sexOption = (sex === 'Девушку') ? '1' : '0'
				firebase.firestore().collection('users')
				.where('city','==',city)
				.where('sex','==', sexOption)
				.where('age','>=',lowerBound)
				.where('age','<=',upperBound)
				.orderBy('age', 'asc')
				.limit(this.userLimit)
				.get().then((querySnapshot) => {
					let counter = 0
					querySnapshot.forEach((doc)=> {

					counter = counter + 1 
					if(counter === this.userLimit){
						this.lastUserId = doc.data()._id
					}
					const data = {
						id: doc.data()._id,
						name: doc.data().username,
						age: doc.data().age,
						city: doc.data().city,
						sex: doc.data().sex, 
						height: doc.data().height,
						weight: doc.data().weight,
						telegram: doc.data().telegram,
						whatsup: doc.data().whatsup,
						phone: doc.data().phone,
						photos: doc.data().photos,
						online: doc.data().online,
						lastChanged: doc.data().lastChanged
					}

					this.user_list.push(data)
					})
					})
			}
			else{
					firebase.firestore().collection('users')
					.where('city','==',city)
					.where('age','>=',lowerBound)
					.where('age','<=',upperBound)
					.orderBy('age', 'asc')
					.limit(this.userLimit)
					.get().then((querySnapshot) => {
						let counter = 0
						querySnapshot.forEach((doc)=> {

						counter = counter + 1 
						if(counter === this.userLimit){
							this.lastUserId = doc.data()._id
						}
						const data = {
							id: doc.data()._id,
							name: doc.data().username,
							age: doc.data().age,
							city: doc.data().city,
							sex: doc.data().sex, 
							height: doc.data().height,
							weight: doc.data().weight,
							telegram: doc.data().telegram,
							whatsup: doc.data().whatsup,
							phone: doc.data().phone,
							photos: doc.data().photos,
							online: doc.data().online,
							lastChanged: doc.data().lastChanged
						}

						this.user_list.push(data)
						})
						})
			}
		},
		async sortingOnScroll(sex, city, lowerBound, upperBound){
			if(sex == 'Девушку' || sex == 'Мужчину'){
			var sexOption = (sex === 'Девушку') ? '1' : '0'
			firebase.firestore().collection('users')
			.where('city','==',city)
			.where('sex','==', sexOption)
			.where('age','>=',lowerBound)
			.where('age','<=',upperBound)
			.orderBy('age', 'asc')
			.startAfter(this.lastUserId)
			.limit(this.userLimit)
			.get().then((querySnapshot) => {
				let counter = 0
				querySnapshot.forEach((doc)=> {

				counter = counter + 1 
				if(counter === this.userLimit){
					this.lastUserId = doc.data()._id
				}
				const data = {
					id: doc.data()._id,
					name: doc.data().username,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight,
					telegram: doc.data().telegram,
					whatsup: doc.data().whatsup,
					phone: doc.data().phone,
					photos: doc.data().photos,
					online: doc.data().online,
					online: doc.data().online,
					lastChanged: doc.data().lastChanged
				}

				this.user_list.push(data)
				})
				})

			}
			else{
			firebase.firestore().collection('users')
			.where('city','==',city)
			.where('age','>=',lowerBound)
			.where('age','<=',upperBound)
			.orderBy('age', 'asc')
			.startAfter(this.lastUserId)
			.limit(this.userLimit)
			.get().then((querySnapshot) => {
				let counter = 0
				querySnapshot.forEach((doc)=> {

				counter = counter + 1 
				if(counter === this.userLimit){
					this.lastUserId = doc.data()._id
				}
				const data = {
					id: doc.data()._id,
					name: doc.data().username,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight,
					telegram: doc.data().telegram,
					whatsup: doc.data().whatsup,
					phone: doc.data().phone,
					photos: doc.data().photos,
					online: doc.data().online,
					online: doc.data().online,
					lastChanged: doc.data().lastChanged
				}

				this.user_list.push(data)
				})
				})
			}
		},

		//------------------------------------------------------------------------------
		//	 Simple search based on city, sex, online statues, and presence of telegram
		async sortingTelegramOnSearch(sex, city, lowerBound, upperBound, online){
			if(online){

				var sexOption = (sex === 'Девушку') ? '1' : '0'

				firebase.firestore().collection('users')
				.where('city','==',city)
				.where('sex','==', sexOption)
				.where('age','>=',lowerBound)
				.where('age','<=',upperBound)
				.where('online','==',true)
				.orderBy('age', 'asc')
				.get().then((querySnapshot) => {
					querySnapshot.forEach((doc)=> {
					if(doc.data().telegram != "None"){
						const data = {
							id: doc.data()._id,
							name: doc.data().username,
							age: doc.data().age,
							city: doc.data().city,
							sex: doc.data().sex, 
							height: doc.data().height,
							weight: doc.data().weight,
							telegram: doc.data().telegram,
							whatsup: doc.data().whatsup,
							phone: doc.data().phone,
							photos: doc.data().photos,
							online: doc.data().online,
							lastChanged: doc.data().lastChanged
						}
						this.user_list.push(data)
						}
					})
				})
			}
			else{
				var sexOption = (sex === 'Девушку') ? '1' : '0'

				firebase.firestore().collection('users')
				.where('city','==',city)
				.where('sex','==', sexOption)
				.where('age','>=',lowerBound)
				.where('age','<=',upperBound)
				.orderBy('age', 'asc')
				.get().then((querySnapshot) => {
					querySnapshot.forEach((doc)=> {
					if(doc.data().telegram != "None"){
						const data = {
							id: doc.data()._id,
							name: doc.data().username,
							age: doc.data().age,
							city: doc.data().city,
							sex: doc.data().sex, 
							height: doc.data().height,
							weight: doc.data().weight,
							telegram: doc.data().telegram,
							whatsup: doc.data().whatsup,
							phone: doc.data().phone,
							photos: doc.data().photos,
							online: doc.data().online,
							lastChanged: doc.data().lastChanged
						}
						this.user_list.push(data)
						}
					})
				})
			}
		},
		async sortingTelegramOnScroll(sex, city, lowerBound, upperBound, online){

		},

		//------------------------------------------------------------------------------
		//	 Simple search based on city, sex, online status, and presence of whatsup
		async sortingWhatsupOnSearch(sex, city, lowerBound, upperBound, online){

		},
		async sortingWhatsupOnScroll(sex, city, lowerBound, uppperBound, online){
		
		},

		//------------------------------------------------------------------------------
		//	 Simple search based on presence of all social networks and online status.
		async sortingSocialNetworksOnSearch(sex, city, lowerBound, upperBound, online){

		},
		async sortingSocialNetworksOnScroll(sex, city, lowerBound, upperBound, online){

		},

		//------------------------------------------------------------------------------
		//	 Simple search based on online status
		async sortingOnlineOnSearch(sex, city, lowerBound, upperBound, online){

		},
		async sortingOnlineOnSearch(){

		}

	}
  }
</script>