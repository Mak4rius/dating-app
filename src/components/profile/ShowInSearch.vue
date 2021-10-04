<template>
  <v-row justify="center">
	<v-col>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
		  block
	      tile
	      x-large  
          dark
		  color="indigo"
          v-bind="attrs"
          v-on="on"
        >
		 Показывать вас в поиске?
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
			Выберете, хотите ли вы быть видны в поиске:
        </v-card-title>
        <v-card-actions>
		<v-row>
		<v-col cols='6'>
          <v-btn
            color="indigo"
            text
            @click="dialog = false"
          >
			Оставить в поиске
          </v-btn>
		</v-col>
		<v-col cols='6'>
		  <v-btn
            color="indigo"
            text
			tile
            @click="dialog = false"
          >
            Убрать из поиска
          </v-btn>
		</v-col>

		</v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>	
	</v-col>
  </v-row>
</template>
<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>