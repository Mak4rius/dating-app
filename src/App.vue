<template>
	<v-app>
	<NavigationBar />
	<NavigationDrawer />
    <v-main>
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

<style lang="scss">
main {
	background: linear-gradient(-45deg, #A63446 60%, #1A237E 60%);
	height: 100vh
}
</style>