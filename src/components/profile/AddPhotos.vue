<template>
  <v-row justify="center">
	<v-col>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
		  block
	      rounded
	      x-large  
          dark
		  color="indigo darken-4"
		  elevation="24"
          v-bind="attrs"
          v-on="on"
        >
		Добавить фото
        </v-btn>
      </template>
      <v-card>
		<v-card-title class="text-h5">
          Добавьте ваши фотки:
        </v-card-title>
		 <v-card-actions>
			<v-file-input
			v-model="photos"
			accept="image/*"
			label="Нажмите чтобы добавить фото"
			chips
			counter
			multiple
			prepend-icon="mdi-camera"
			filled
			small-chips
			truncate-length="50"
			></v-file-input>
		 </v-card-actions>
		 <v-card-actions>
			 		<v-row>
		<v-col cols='6'>
          <v-btn
            color="indigo"
            text
            @click="quit"
          >
            Не сохранять фотки
          </v-btn>
		</v-col>
		<v-col cols='6'>
		  <v-btn
            color="indigo"
            text
			tile
            @click="savePhotos"
          >
            Сохранить фотки
          </v-btn>
		</v-col>

		</v-row>
		 </v-card-actions>
      </v-card>
    </v-dialog>
	</v-col>
  </v-row>
</template>

<script>
import UploadButton from 'vuetify-upload-button'
import { Ripple } from 'vuetify/lib/directives'
import firebase from "firebase"

export default {
	 data () {
      return {
		photos:[],
        dialog: false,
      }
    },
	directives : {
     Ripple
  	},
	components: {
      'upload-btn': UploadButton
    },
	methods: {
	  savePhotos(){
		  console.log("New thing!!")
		  this.$store.state.user.photos.forEach((photo) => {console.log(photo)})
		  console.log("The newest thing!")
		  console.log(this.$store.state.user.photos)
		  var timestamp = new Date().getTime()
		  this.photos.forEach((photo, index) =>  {
		   var storageRef = firebase.storage().ref(this.$store.state.user.id + (timestamp + index).toString() ) 
		   storageRef.put(photo).then((snapshot) => {
			   snapshot.ref.getDownloadURL().then((downloadURL) => {
				   this.$store.state.user.photos.push(downloadURL) 
				   firebase.firestore().collection('users').doc(this.$store.state.user.id).update({ photos:  firebase.firestore.FieldValue.arrayUnion(downloadURL) })
			   })})
		   })
		  
		  this.$store.state.user.photos.forEach((photo) => {console.log(photo)})
		  console.log("Over!")
		  this.photos = []
		  this.dialog = false
	  },
	  quit(){
		this.photos = []
		this.dialog = false
	  },
      update (file) {
        // handle file here. File will be an object.
        // If multiple prop is true, it will return an object array of files.

      }
	}	
}
</script>