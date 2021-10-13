<template>
  <v-footer
    color="indigo darken-4"
	dark
  >
	<v-row no-gutters>
      <v-col
        class=" indigo darken-4 py-4 text-center white--text"
        cols="12"
      >
	        <div class="body-1 white--text pt-6 pt-md-0 text-center">
            &copy; 2020, сделано с
            <v-icon size="18">
              mdi-heart
            </v-icon>
            <a href="https://www.creative-tim.com">Creative Tim</a> для лучших знакомств :).
          </div>
        </v-col>
    </v-row>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',
    data: () => ({
      links: [
        {
          href: '#',
          text: 'Creative Tim',
        },
        {
          href: '#',
          text: 'About Us',
        },
        {
          href: '#',
          text: 'Blog',
        },
        {
          href: '#',
          text: 'Licenses',
        },
      ],
    }),
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>