<template>
  <v-card
    :loading="loading"
	elevation="0"
	min-height="100%"
	min-width="100%"
	dark
	shaped
	clipped-left
	color="rgb(255, 0, 0, 0.0)"
  >

  <v-card-title>
	  <p class="text-h2 white--text"> 
		  Настройки профиля "{{this.$store.state.user.name}}"
	  </p>
  </v-card-title>
  <v-row
      class="mb-6"
      >
	  
  <v-col cols="12">
  <ChangeUser/>
  </v-col>

  <v-col cols="12">
  <MyPhotos/>
  </v-col>

  <v-col cols="12">
  <ChangePassword/>
  </v-col>

  <v-col cols="12">
  <ShowInSearch/>
  </v-col>

  <v-col cols="12">
  <QuitThisDevice/>
  </v-col>

  <v-col cols="12">
  <DeleteUser/>
  </v-col>
  </v-row>
  </v-card>
</template>

<script>
  import ChangeUser from '../components/profile/ChangeUser'
  import MyPhotos from '../components/profile/MyPhotos'
  import ChangePassword from '../components/profile/ChangePassword'
  import ShowInSearch from '../components/profile/ShowInSearch'
  import IpHistory from '../components/profile/IpHistory'
  import Settings from '../components/profile/Settings'
  import QuitThisDevice from '../components/profile/QuitThisDevice'
  import DeleteUser from '../components/profile/DeleteUser'

  export default {
    components: {
		ChangeUser,
		MyPhotos,
		ChangePassword,
		ShowInSearch,
		IpHistory,
		Settings,
		QuitThisDevice,
		DeleteUser
	},
    data: () => ({
      loading: false,
      selection: 1,
	  items: [
		{title:"Изменить анкету", link:"/person", icon:"account-settings"},
		{title:"Мои фотографии", link:"/photo", icon:"image"},
		{title:"Сменить пароль", link:"/changepassword", icon:"onepassword"},
		{title:"Показывать в поиске?", link:"/insearch", icon:"account-search"},
		{title:"История входов", link:"/iplog", icon:"location-enter"},
		{title:"Настройки", link:"/settings", icon:"cog-box"},
		{title:"Выход на этом устройвстве", link:"button", function:"logOutHere", icon:"logout"},
		{title:"Удалить анкету", link:"/delete", icon:"delete-alert"},			
	]
    }),

    methods: {
	  handleFunctionCall(functionName){
		  console.log("Handle function invoked!!")
		  this[functionName]()
	  },
      reserve () {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
	  logOutHere(){
		  console.log('Log out function invoked!')
		  this.$store.dispatch('logoutUser')
	  }
    },
  }
</script>