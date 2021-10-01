<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row 
	justify='center'
	align='center'>
      <v-col
        cols="12"
        md="7"
      >
        <base-material-card>
		<ProfileSetting/>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
		class="align-center justify-center ml-13"
      >
        <base-material-card
          class="v-card-profile"
          avatar="../assets/logo.svg"
        >
			<UserCard
			:id="this.$store.state.user.id"
			:name="this.$store.state.user.name"
			:city="this.$store.state.user.city"
			:age="this.$store.state.user.age"
			:sex="this.$store.state.user.sex"
			:height="this.$store.state.user.height"
			:weight="this.$store.state.user.weight"
			/>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  import UserCard from "../components/UserCard.vue"
  import ProfileSetting from "../components/ProfileSetting.vue"

  export default {
	name: "Александр",
    components: {
		UserCard,
		ProfileSetting,
	}
  }
</script>