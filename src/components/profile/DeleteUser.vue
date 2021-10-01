<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
		  class="ma-2"
	      tile
	      x-large  
          dark
		  color="indigo"
          v-bind="attrs"
          v-on="on"
        >
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          Чтобы поменять пароль пройдите по ссылке отправленной вам!
        </v-card-title>
        <v-card-actions>
		<v-row>
		<v-col cols='6'>
          <v-btn
            color="indigo"
            text
            @click="dialog = false"
          >
            Не изменять пароль
          </v-btn>
		</v-col>
		<v-col cols='6'>
		  <v-btn
            color="indigo"
            text
			tile
            @click="dialog = false"
          >
            Изменить пароль
          </v-btn>
		</v-col>

		</v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>