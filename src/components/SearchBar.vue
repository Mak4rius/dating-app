<template>
  <v-card
    class="mx-auto ma-0"
	elevation="24"
	max-height="800"
	max-width="90%"
	outlined
	color="grey darken-4"
	dark
	app
  >
  <v-form>
  <v-container>
  <v-row>

  <!--
	  First element in the row
  -->
  <v-col
        cols="12"
        sm="6"
        md="8"
  >
  <v-card
    :loading="loading"
    class="mx-auto my-12"
	color="grey darken-4 "
	dark
  >
      <p class="text-h2" text-color="white">
        	<vue-typer
			:text='["Arya Stark","Jon Snow","Daenerys Targaryen","Melisandre","Tyrion Lannister"]'
			:repeat='Infinity'
			:shuffle='false'
			initial-action='typing'
			:pre-type-delay='70'
			:type-delay='70'
			:pre-erase-delay='2000'
			:erase-delay='250'
			erase-style='select-all'
			:erase-on-complete='false'
			caret-animation='solid'
			></vue-typer>
      </p>
  <v-card-title>
  </v-card-title>
  </v-card>
  </v-col>

  <!--
	  First element in the row
  -->
  <v-col>
	<v-select
		:items="sex"
		label="Кого ищете?"
	>
		<template v-slot:item="{ item, attrs, on }">
		<v-list-item
			v-bind="attrs"
			v-on="on"
		>
			<v-list-item-title
			:id="attrs['aria-labelledby']"
			v-text="item"
			></v-list-item-title>
		</v-list-item>
		</template>
	</v-select>

	<v-select
		:items="cities"
		label="Откуда?"
	>
		<template v-slot:item="{ item, attrs, on }">
		<v-list-item
			v-bind="attrs"
			v-on="on"
		>
			<v-list-item-title
			:id="attrs['aria-labelledby']"
			v-text="item"
			></v-list-item-title>
		</v-list-item>
		</template>
	</v-select>

	<v-text-field
	:value="range[0]"
	class="mt-0 pt-0"
	hide-details
	single-line
	type="number"
	style="width: 60px"
	@change="$set(range, 0, $event)"
	></v-text-field>

	<v-text-field
	:value="range[1]"
	class="mt-0 pt-0"
	hide-details
	single-line
	type="number"
	style="width: 60px"
	@change="$set(range, 1, $event)"
	></v-text-field>

	</v-col>
    
    </v-row>
    </v-container>
    </v-form>

    <v-divider></v-divider>
	<v-row
	align="center"
    justify="space-around">
	<v-col>
      <v-btn
	    x-large
        :disabled="autoUpdate"
        :loading="isUpdating"
        color="grey darken-4"
        depressed
        @click="isUpdating = true"
		block
      >
        <v-icon left>
          fa-search
        </v-icon>
		  Искать
      </v-btn>
  </v-col>
  </v-row>
  <v-card
    v-scroll.self="onScroll"
    class="overflow-y-auto"
	height="600"
  >
	<div
	v-for="n in 10"
	:key="n"
	>
  <v-container>
  <v-row
      class="mb-6"
      no-gutters>
  <v-col
         sm="6"
        md="5"
        offset-md="2"
        lg="6"
        offset-lg="0">
  <v-card
    :loading="loading"
	elevation="24"
	width = "485"
	height = "760"
	outlined
	app
	dark
	color="grey darken-4 text--white"
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

    <v-card-title >{{name}}</v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-title> {{city}}         
	<v-divider
      class="mx-4"
      vertical
    ></v-divider>      
	{{age}} лет 
		<v-spacer></v-spacer>
		    <v-divider
      class="mx-4"
      vertical
    ></v-divider>
		<v-icon v-if="sex == 0"
	  	large
		color="white">mdi-human-male
	 	</v-icon> 
		<v-icon v-if="sex == 1"
	  	large
		color="white">mdi-human-female
		</v-icon>
	 </v-card-title>

    <v-card-text>
      <v-chip-group
		class="text-center"
      >

		<v-chip
		class="ma-2"
        :input-value="active"
		text-color="white"
        color="white"
        outlined
		label
		>
		<v-icon
		color="white">mdi-human-male-height
	 	</v-icon>
		Рост: {{height}} сантиметров.
		</v-chip>


		<v-chip
		class="ma-2"
        :input-value="active"
		text-color="white"
        color="white"
        outlined
		label
		>
		<v-icon
		color="white">mdi-weight-kilogram
	 	</v-icon>
		 <v-spacer></v-spacer>
		Вес: {{weight}} килограмм.
		</v-chip>		
	
		
      </v-chip-group>
    </v-card-text>

	<v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <v-btn
        color="white"
        text
        @click="reserve"
		block
      >
	  <v-icon
	  	large
		color="white">mdi-chat-processing
	 </v-icon>
	    Написать сообщение
      </v-btn>
	  
    </v-card-actions>
  </v-card>			
  </v-col>
  <v-col
        sm="6"
        md="5"
        offset-md="2"
        lg="6"
        offset-lg="0">
  <v-card
    :loading="loading"
	elevation="24"
	width = "485"
	height = "760"
	outlined
	app
	dark
	color="grey darken-4 text--white"
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

    <v-card-title >{{name}}</v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-title> {{city}}         
	<v-divider
      class="mx-4"
      vertical
    ></v-divider>      
	{{age}} лет 
		<v-spacer></v-spacer>
		    <v-divider
      class="mx-4"
      vertical
    ></v-divider>
		<v-icon v-if="sex == 0"
	  	large
		color="white">mdi-human-male
	 	</v-icon> 
		<v-icon v-if="sex == 1"
	  	large
		color="white">mdi-human-female
		</v-icon>
	 </v-card-title>

    <v-card-text>
      <v-chip-group
		class="text-center"
      >

		<v-chip
		class="ma-2"
        :input-value="active"
		text-color="white"
        color="white"
        outlined
		label
		>
		<v-icon
		color="white">mdi-human-male-height
	 	</v-icon>
		Рост: {{height}} сантиметров.
		</v-chip>


		<v-chip
		class="ma-2"
        :input-value="active"
		text-color="white"
        color="white"
        outlined
		label
		>
		<v-icon
		color="white">mdi-weight-kilogram
	 	</v-icon>
		 <v-spacer></v-spacer>
		Вес: {{weight}} килограмм.
		</v-chip>		
	
		
      </v-chip-group>
    </v-card-text>

	<v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <v-btn
        color="white"
        text
        @click="reserve"
		block
      >
	  <v-icon
	  	large
		color="white">mdi-chat-processing
	 </v-icon>
	    Написать сообщение
      </v-btn>
	  
    </v-card-actions>
  </v-card>
  </v-col>
  </v-row>
    </v-container>
	</div>
  </v-card>
  </v-card>
</template>

<script>
  import UserCard from "./UserCard"
  export default {
	components: {
		UserCard
	},
    data: () => ({
	range: [18, 70],
    sex: [ 'Не важно','Мужчину', 'Девушку'],
	cities: [
'Абакан'
,'Адлер'
,'Азов'
,'Анапа'
,'Ангарск'
,'Артем'
,'Архангельск'
,'Астрахань'
,'Барнаул'
,'Белгород'
,'Белово'
,'Белореченск'
,'Бердск'
,'Бийск'
,'Благовещенск'
,'Братск'
,'Брянск'
,'Великий Новгород'
,'Владивосток'
,'Владикавказ'
,'Владимир'
,'Волгоград'
,'Волгодонск'
,'Волжск'
,'Волжский'
,'Вологда'
,'Воркута'
,'Воронеж'
,'Выборг'
,'Гатчина'
,'Геленджик'
,'Горячий Ключ'
,'Гусь-Хрустальный'
,'Дзержинск'
,'Димитровград'
,'Дубна'
,'Евпатория'
,'Екатеринбург'
,'Елец'
,'Жигулевск'
,'Зеленоград'
,'Златоуст'
,'Иваново'
,'Ижевск'
,'Иркутск'
,'Йошкар-Ола'
,'Казань'
,'Калининград'
,'Калуга'
,'Каменск-Уральск'
,'Камень-на-Оби'
,'Кемерово'
,'Керчь'
,'Кимры'
,'Киров'
,'Кисловодск'
,'Ковров'
,'Коломна'
,'Комсомольск-на-Амуре'
,'Кострома'
,'Котлас'
,'Краснодар'
,'Красноярск'
,'Курган'
,'Курск'
,'Липецк'
,'Магадан'
,'Магнитогорск'
,'Майкоп'
,'Махачкала'
,'Минеральные Воды'
,'Москва'
,'Мурманск'
,'Муром'
,'Набережные Челны'
,'Нальчик'
,'Находка'
,'Нижневартовск'
,'Нижний Новгород'
,'Нижний Тагил'
,'Новокузнецк'
,'Новомосковск'
,'Новороссийск'
,'Новосибирск'
,'Новоуральск'
,'Новочеркасск'
,'Новый Уренгой'
,'Норильск'
,'Ноябрьск'
,'Обнинск'
,'Озерск'
,'Омск'
,'Орел'
,'Оренбург'
,'Орск'
,'Пенза'
,'Пермь'
,'Петергоф'
,'Петрозаводск'
,'Петропавловск-Камчатский'
,'Подольск'
,'Псков'
,'Пушкин'
,'Пятигорск'
,'Ростов'
,'Ростов-на-Дону'
,'Рязань'
,'Самара'
,'Санкт-Петербург'
,'Саранск'
,'Саратов'
,'Севастополь'
,'Северск'
,'Сергиев Посад'
,'Серпухов'
,'Симферополь'
,'Смоленск'
,'Солнечногорск'
,'Сочи'
,'Ставрополь'
,'Старый Оскол'
,'Ступино'
,'Сургут'
,'Сыктывкар'
,'Таганрог'
,'Тамбов'
,'Тверь'
,'Тольятти'
,'Томск'
,'Туапсе'
,'Тула'
,'Тюмень'
,'Улан-Удэ'
,'Ульяновск'
,'Уссурийск'
,'Усть-Илимск'
,'Уфа'
,'Ухта'
,'Феодосия'
,'Хабаровск'
,'Ханты-Мансийск'
,'Чебоксары'
,'Челябинск'
,'Череповец'
,'Черкесск'
,'Чита'
,'Шахты'
,'Южно-Сахалинск'
,'Якутск'
,'Ялта'
,'Ярославль'
],
    }),
	components: {
    }
  }
</script>

