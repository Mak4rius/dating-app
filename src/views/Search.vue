<template>
	  	<BaseScroll/>
</template>

<script>
  import NavigationBar from '../components/NavigationBar'
  import UserCard from '../components/UserCard'
  import SearchBar from '../components/SearchBar'
  import BaseScroll from '../components/BaseScroll'

  export default {
    name: 'Поиск',

    components: {
		NavigationBar,
		UserCard,
		SearchBar,
		BaseScroll
    },
  }
</script>
