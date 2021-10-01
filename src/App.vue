<template>
  <v-app>
	<NavigationBar />
	<NavigationDrawer />
    <v-main app>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-main>
	<Footer/>
  </v-app>
</template>

<script>
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import NavigationDrawer from './components/NavigationDrawer.vue'

export default {
  name: 'App',
  components: {
		NavigationBar,
		Footer,
		NavigationDrawer
    },
    data: () => ({
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ]})
}
</script>
