<template>
	<v-navigation-drawer 
	v-if="$route.fullPath === '/search' || $route.fullPath === '/history'"
	  app
	  class="deep-purple accent-4"
	  dark
	  v-model="drawer"
	  width="25%"
	  floating
      permanent
	  >

	  <SearchForm/>		 

   </v-navigation-drawer>
</template>

<script>
import SearchForm from "./SearchForm.vue"

export default {
  components: {
	  SearchForm
  },
  computed: {
	  currentRouteName(){
		  return this.$route.name
	  }
  },
  name: 'App',
    data: () => ({
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ]})
}
</script>
