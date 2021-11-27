<template>
	<v-app>
	<NavigationBar />
	<NavigationDrawer />
    <v-main>
           <router-view> 
		   </router-view>
    </v-main>
	<Footer/>
  </v-app>
</template>

<script>
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import NavigationDrawer from './components/NavigationDrawer.vue'
import firebase from 'firebase'

export default {
  name: 'App',
  components: {
		NavigationBar,
		Footer,
		NavigationDrawer,
    },
	created () {    

        window.addEventListener('beforeunload', 
		firebase.firestore().collection('users').doc(this.$store.state.user._id).update({online:false}))  
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
	background: linear-gradient(#1A237E,#283593,#303F9F, #3949AB);
	height: 100vh
}
</style>