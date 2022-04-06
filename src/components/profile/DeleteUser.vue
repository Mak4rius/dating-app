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
            @click="deleteAccount"
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
import firebase from "firebase"

  export default {
    data () {
      return {
        dialog: false,
      }
    },
	methods: {
		deleteAccount(){
			const user = firebase.auth().currentUser
			user.delete().then(() => {
				console.log("Логин и Пароль пользователя успешно удалены!")
				}).catch((error) => {
				console.error("Ошибка при удалении пользователя #2: ", error)
				})
			firebase.firestore().collection("users").doc(this.$store.state.user._id).delete().then(() => {
				console.log("Пользователь успешно удален из базы данных!")
			}).catch((error) => {
				console.error("Ошибка при удалении пользователя #1: ", error)
			})
			this.dialog = false
		}
	},
  }
</script>