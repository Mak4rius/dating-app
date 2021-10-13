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
		Добавить/Изменить фото
        </v-btn>
      </template>
      <v-card>
		<v-card-title class="text-h5">
          Добавте ваши фотки:
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
            @click="dialog = false"
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
		  this.dialog = false
	  },
      update (file) {
        // handle file here. File will be an object.
        // If multiple prop is true, it will return an object array of files.
      }
	}	
}
</script>