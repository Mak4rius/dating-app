<template>
	<v-card
	color="rgb(255, 0, 0, 0)"
	height="100%"
	class="mx-auto ma-0"
	tile

	>
	<v-container>
	<v-row >
	<v-col>
	<v-card 
	color="rgb(255, 0, 0, 0)"
    class="overflow-y-auto mx-auto"
	height="833"
	align="center">
	<v-container>
        <v-row             
		v-for="user in user_list"
        :key="user"
		align="center"
        >
 	    <v-col
        sm="6"
        md="5"
        offset-md="2"
        lg="6"
        offset-lg="0">

			<UserCard 
			:id="user.id"
			:name="user.name" 
			:age="user.age" 
			:city="user.city" 
			:sex="user.sex" 
			:height="user.height" 
			:weight="user.weight"
			/>

  		</v-col>
 	    <v-col
        sm="6"
        md="5"
        offset-md="2"
        lg="6"
        offset-lg="0">

			<UserCard 
			:id="user.id"
			:name="user.name" 
			:age="user.age" 
			:city="user.city" 
			:sex="user.sex" 
			:height="user.height" 
			:weight="user.weight"
			/>

  		</v-col>
  		</v-row>
 		</v-container>
  		</v-card>
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
		firebase.firestore().collection('users').get().then((querySnapshot) => {
			querySnapshot.forEach((doc)=> {
				const data = {
					id: doc.id,
					name: doc.data().name,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight
				}
				this.user_list.push(data)
			})
		})
	},
	mounted() {
		this.$root.$on('changeSearch', (sex, city, lowerBound, upperBound) => {
			
			this.user_list = []
					
			if(sex == 'Мужчину'){
			console.log(sex)
			firebase.firestore().collection('users')
			.where('city','==',city)
			.where('sex','==', '0')
			.where('age','>=',lowerBound)
			.where('age','<=',upperBound)
			.get().then((querySnapshot) =>
			{	
				querySnapshot.forEach((doc)=> {
				console.log(doc.data())
				const data = {
					id: doc.id,
					name: doc.data().name,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight
				}
				console.log(doc.data().name)
				this.user_list.push(data)
			})
			})

			}
			else if(sex == 'Девушку'){
			console.log(sex)

			firebase.firestore().collection('users')
			.where('city','==',city)
			.where('sex','==', '1')
			.where('age','>=',lowerBound)
			.where('age','<=',upperBound)
			.get().then((querySnapshot) =>
			{
				querySnapshot.forEach((doc)=> {
				const data = {
					id: doc.id,
					name: doc.data().name,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight
				}
				console.log(doc.data().name)
				this.user_list.push(data)
			})
			})

			}
			else{
			console.log(sex)

			firebase.firestore().collection('users')
			.where('city','==',city)
			.where('age','>=',lowerBound)
			.where('age','<=',upperBound)
			.get().then((querySnapshot) =>
			{
				querySnapshot.forEach((doc)=> {
				const data = {
					id: doc.id,
					name: doc.data().name,
					age: doc.data().age,
					city: doc.data().city,
					sex: doc.data().sex, 
					height: doc.data().height,
					weight: doc.data().weight
				}
				console.log(doc.data().name)
				this.user_list.push(data)
			})
			})
			console.log(this.user_list)
			}

		})
	},
	components: {
	HistoryCard,
	UserCard,
	},
	methods: {
		async sortUserCards(sex, city, lowerBound, upperBound){

		}

 	}
  }
</script>