<template>
	<v-navigation-drawer 
	v-if="$route.fullPath === '/search' || $route.fullPath === '/history'"
      color="indigo darken-4"
	  dark
	  width="100%"
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
