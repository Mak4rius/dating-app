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
		Изменить пароль
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          Введите новый пароль :
        </v-card-title>
		<v-card-text>
		<v-form  v-model="valid">
		<v-col cols="12">
			<v-text-field v-model="password" required :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Пароль" hint="Минимум 8 символов" counter @click:append="show1 = !show1"></v-text-field>
		</v-col>
		</v-form>
		</v-card-text>
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
		<v-btn text tile block :disabled="!valid" color="indigo" class="white--text"  @click="changePassword">
												<div v-if="loading">Loading</div>
												<div v-else>Изменить пароль</div>
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
import VuePassword from 'vue-password'
import firebase from 'firebase'

  export default {
    components: {
        VuePassword,
    },
    data () {
      return {
    	valid: true,
        dialog: false,
		password: "",
	    show1: false,
		rules: {
		required: value => !!value || "Required.",
		min: v => (v && v.length >= 8) || "Min 8 characters"
		}
      }
    },
	methods: {
		changePassword(){
			const user = firebase.auth().currentUser;
			user.updatePassword(this.password).then(() => {
			// Update successful.
			console.log('Пароль успешно обновлен!')
			}).catch((error) => {
			// An error ocurred
			// ...
			console.log('Произошла ошибка при обновлении пароля!')
			console.log(error)
			})
			this.dialog = false
		}
	}
  }
</script>