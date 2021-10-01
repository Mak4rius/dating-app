<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
	elevation="24"
	height = "500"
	outlined
	app
  >
  <v-row
	align="center"
	no-gutters>

<v-col
        cols="12"
        sm="6"
        md="8">
<v-card-title>{{name}} <v-divider
	class="mx-4"
	vertical
></v-divider> {{city}} 
<v-divider
	class="mx-4"
	vertical
></v-divider> {{age}} 
<v-divider
	class="mx-4"
	vertical
></v-divider> 		
<v-icon v-if="sex == 0"
large
color="black accent-4">mdi-human-male
</v-icon> 
<v-icon v-if="sex == 1"
large
color="black accent-4">mdi-human-female
</v-icon>  
</v-card-title>

<v-card-text>
	<v-chip-group
	class="text-center"
	>

	<v-chip
	class="ma-2"
	:input-value="active"
	text-color="deep-purple accent-4"
	color="deep-purple accent-4"
	outlined
	label
	>
	<v-icon
	color="deep-purple accent-4">mdi-human-male-height
	</v-icon>
	Рост: {{height}} сантиметров.
	</v-chip>
	<v-chip
	class="ma-2"
	:input-value="active"
	text-color="deep-purple accent-4"
	color="deep-purple accent-4"
	outlined
	label
	>
	<v-icon
	color="deep-purple accent-4">mdi-weight-kilogram
	</v-icon>
		<v-spacer></v-spacer>
	Вес: {{weight}} килограмм.
	</v-chip>		
	</v-chip-group>
</v-card-text>
</v-col>
<v-col 
   
 align-self="end">
	<v-spacer></v-spacer>
	<v-avatar
	class="profile"
	color="grey"
	size="260"
	fill-height
	tile
	>
	  <v-carousel 
  hide-delimiter-background
  show-arrows-on-hover
  delimiter-icon="mdi-minus"
  max-height="150"
  >
    <v-carousel-item
      v-for="(photo,i) in photos"
      :key="i"
      :src="photo.src"
    ></v-carousel-item>
  </v-carousel>
	</v-avatar>
</v-col>
</v-row>
	
<v-row>
	<v-col>
	<v-divider></v-divider>
	<v-card-actions>
		<v-btn
	color="deep-purple accent-4"
	text
	@click="reserve"
	block
	>
	<v-icon
	large
	color="deep-purple accent-4">mdi-chat-processing
	</v-icon>
		Написать сообщение
	</v-btn>	  
	</v-card-actions>
		</v-col>
</v-row>

</v-card>
</template>

<script>

  export default {
    data: () => ({
      loading: false,
      selection: 1,
	  name: "Катя",
	  city: "Moscow",
	  age: "23",
	  sex: "0",
	  weight: "75",
	  height: "89",
	  last_connection: "24.05.2020",
	  photos: [
		{
		src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
		},
		{
		src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
		},
		{
		src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
		},
		{
		src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
		},
	  ],
    }),

    methods: {
      reserve () {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
    },
  }
</script>