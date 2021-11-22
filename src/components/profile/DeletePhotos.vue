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
		Удалить фото
        </v-btn>
      </template>
      <v-card>
		<v-card-title class="text-h5">
          Удалите ваши фотки:
        </v-card-title>
		<v-card-text>
		<v-carousel v-model="carouselIndex" hide-delimiters>
			<v-carousel-item
			v-for="(photo,i) in this.$store.state.user.photos"
			:key="i"
			:src="photo"
			transition="fade-transition"
			></v-carousel-item>
		</v-carousel>		
		<v-col cols="12">
			<v-btn color="indigo" dark x-large block  @click="deleteImage"> Удалить фото </v-btn>
		</v-col>
		<v-divider></v-divider>
		</v-card-text>
		<v-card-actions>
		<v-row>
		<v-col cols='6'>
          <v-btn
            color="indigo"
            text
            @click="quit"
          >
            Не сохранять 
          </v-btn>
		</v-col>
		<v-col cols='6'>
		  <v-btn
            color="indigo"
            text
			tile
            @click="savePhotos"
          >
            Сохранить изменения
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
	  deleteImage(){
		  let removed_image = this.$store.state.user.photos[this.carouselIndex]
		  this.$store.state.user.photos.splice(this.carouselIndex, this.carouselIndex)
		  firebase.firestore().collection('users').doc(this.$store.state.user.id).update({
			  photos: firebase.firestore.FieldValue.arrayRemove(removed_image)
		  })
	  },
	  savePhotos(){
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