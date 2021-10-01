<template>
  <v-card
    :loading="loading"
    class="mx-auto mt-12 mb-12"
	elevation="24"
	max-height="89%"
	max-width="80%"
	outlined
	app
	dark
	color="indigo"
  >

  <v-card-title>
	  <p class="text-h2 white--text align-center"
	    justify="center"
		align="center"> 
		  Услуги
	  </p>
  </v-card-title>
  <v-row
  v-for="item in items"
  :key="item"
      class="mb-6 white--text"
      justify="center"
      no-gutters>
  <v-btn block      
   	  class="ma-2"
	  tile
	  x-large  
      color="indigo" v-if="item.link === 'button'">
	  {{item.title}}
  <v-icon>mdi-{{item.icon}}</v-icon>
  </v-btn>
  <v-btn block       
  	  class="ma-2"
	  x-large  
	  tile
      color="indigo"
	  :to="item.link" 
	  v-if="item.link !== 'button'">
	 {{item.title}} 
  <v-icon>mdi-{{item.icon}}</v-icon>
  </v-btn>
  </v-row>
  </v-card>
</template>

<script>
  import NavigationBar from '../components/NavigationBar'

  export default {
	name: 'Услуги',
	components: {
		NavigationBar,
	},
    data: () => ({
      loading: false,
      selection: 1,
	  items: [
		{title:"Кошелек", link:"/wallet", icon:"account-settings"},
		{title:"Премиум-аккаунт", link:"/premium", icon:"image"},
		{title:"Поднятие анкеты", link:"/up", icon:"onepassword"},
		{title:"Топ (закрепление анкеты)", link:"/top", icon:"account-search"},
		{title:"Кто онлайн?", link:"/whoisonline", icon:"location-enter"},
		{title:"Пополнить контакты", link:"/contacts", icon:"cog-box"},
		{title:"Режим инкогнито", link:"/incognito", icon:"logout"},
		{title:"Удаление переписок", link:"/deleteall", icon:"delete-alert"},			
	]
    }),

    methods: {
      reserve () {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
    },
  }
</script>
