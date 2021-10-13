<template>
  <v-row justify="center">
	<v-col>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="580"
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
          Удалить свой аккаунт
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
         	Выберите хотите ли вы удалить свой аккаунт?
        </v-card-title>
        <v-card-actions>
		<v-row>
		<v-col cols='6'>
          <v-btn
            color="indigo"
            text
            @click="dialog = false"
          >
            Не удалять аккаунт
          </v-btn>
		</v-col>
		<v-col cols='6'>
		  <v-btn
            color="indigo"
            text
			tile
            @click="dialog = false"
          >
            Удалить аккаунт
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
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>