<template>
  <v-card
	elevation="24"
	width = "485"
	height = "765"
	outlined
	dark
	color="indigo darken-4 text--white"
  >

  <v-carousel 
  hide-delimiter-background
  show-arrows-on-hover
  delimiter-icon="mdi-minus"
  max-height="125"
  >
    <v-carousel-item
      v-for="(photo,i) in photos"
      :key="i"
      :src="photo"
    ></v-carousel-item>
  </v-carousel>

    <v-card-title >{{name}}</v-card-title>

    <v-divider class="mx-4 white"></v-divider>

    <v-card-title> {{city}}          
	<v-divider
      class="mx-4 white"
      vertical
    ></v-divider>      
	{{age}} лет 
		<v-spacer></v-spacer>
		    <v-divider
      class="mx-4 white"
      vertical
    ></v-divider>
		<v-icon v-if="sex == 0"
	  	large
		color="white">mdi-human-male
	 	</v-icon> 
		<v-icon v-if="sex == 1"
	  	large
		color="white">mdi-human-female
		</v-icon>
	 </v-card-title>

    <v-card-text>
      <v-chip-group
		class="text-center"
      >
		<v-chip
		class="ma-2"
        :input-value="active"
		text-color="white"
        color="white"
        outlined
		label
		>
		<v-icon
		color="white">mdi-human-male-height
	 	</v-icon>
		Рост: {{height}} сантиметров.
		</v-chip>

		<v-chip
		class="ma-2"
        :input-value="active"
		text-color="white"
        color="white"
        outlined
		label
		>
		<v-icon
		color="white">mdi-weight-kilogram
	 	</v-icon>
		 <v-spacer></v-spacer>
		Вес: {{weight}} килограмм.
		</v-chip>		
	
		
      </v-chip-group>
    </v-card-text>

	<v-divider class="mx-4 white"></v-divider>

    <v-card-actions>
      <v-btn
        color="white"
        text
        @click="sendMessage"
		block
      >
	  <v-icon
	  	large
		color="white">mdi-chat-processing
	 </v-icon>
	    Написать сообщение
      </v-btn>
	  
    </v-card-actions>
  </v-card>
</template>

<script>
  import firebase from "firebase"

  export default {	
	props: ['id', 'name', 'city', 'age', 'sex', 'height', 'weight', 'photos'],
    data: () => ({
      loading: false
    }),

    methods: {
		async sendMessage() {
			var thread_id = 0
			console.log('MESSAGE SENDED', this.name, this.id)
			if(this.id > this.$store.state.user.id){
				thread_id = this.$store.state.user.id + this.id
			}else{
				thread_id = this.id + this.$store.state.user.id
			}

			var docRef = await firebase.firestore().collection("chats").doc(thread_id)

			docRef.get().then((doc) => {
				if (doc.exists) {
					console.log("Document data:", doc.data())
				} else {
					console.log("No such document!")
					console.log("Will create this document")
					var createdRoom = firebase.firestore().collection("chats")
					.doc(thread_id)
					.set({
					users: [this.$store.state.user.id, this.id],
					firstUser: {
						name: this.$store.state.user.name,
						id: this.$store.state.user.id
					},
					secondUser: {
						name: this.name,
						id: this.id
					}
					})
					console.log("Chat room created")
					console.log("FINISH!")
					this.$router.push('/chats')
				}
			}).catch((error) => {
				console.log("Error getting document:", error);
			})

			
		}
  }}
</script>