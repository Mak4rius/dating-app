<template>
  <v-form >
  <v-container>
  <v-row>
	<v-chip
      class="mt-8 ml-7"
      color="indigo"
	  text
      text-color="white"
    >
     <h1>Кого ищете:</h1> 
    </v-chip>
	<v-col> 
	<v-select
		:items="sex"
		v-model="selectedSex"
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
	</v-col>
  </v-row>
  <v-row>
	<v-chip
      class="mt-8  ml-7"
      color="indigo"
      text
      text-color="white"
    >
	<h1>Из города:</h1>
    </v-chip>
	<v-col>
	<v-select
		:items="cities"
		label="Откуда?"
		v-model="selectedCity"
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
	</v-col>
  </v-row>
  
  <v-row>
	<v-col cols="24">
	<v-range-slider
		v-model="range"
		class="ma-4"
  		hint="Выберите желаемый возраст партнера"
  		max="98"
  		min="18"
	>
	   <template v-slot:prepend>
   	   
   <v-chip
      class="ma-0"
      color="indigo"
      text
      text-color="white"
    >
      <h1>Возраст от:</h1>
    </v-chip>
	<v-text-field
	:value="range[0]"
	class="ma-0 ml-2 pt-0"
	hide-details
	single-line
	type="number"
	style="width:60px"
	@change="$set(range, 0, $event)"
	></v-text-field>
	<v-chip
      class="ma-0 ml-2"
      color="indigo"
      text
      text-color="white"
    >
      <h1>до</h1>
    </v-chip>
	<v-text-field
	:value="range[1]"
	class="ma-0 ml-2 pt-0"
	hide-details
	single-line
	type="number"
	style="width: 60px"
	@change="$set(range, 1, $event)"
	></v-text-field>
	</template>
	</v-range-slider>
	</v-col>
  </v-row>
  
  <v-row cols='12' >

		  	<v-chip
			color="indigo"
			class="ml-3 mt-2"
			text
			large
			text-color="white"
			>
			<h1>Дополнительные настройки :</h1>
			</v-chip>

		  	<v-chip
			class="ml-4 mt-2"
			color="indigo"
			text
			label
			large
			text-color="white"
			>
		    <v-switch
		      inset
              v-model="whatsup"
              label="Наличие What's App"
              color="indigo darken-3"
            ></v-switch>
    		</v-chip>

		  	<v-chip
			color="indigo"
			class="ml-3 mt-2"
			text
			label
			text-color="white"
			large
			>
		    <v-switch
		      inset
              v-model="telegram"
              label="Наличие Telegram"
              color="indigo darken-3"
            ></v-switch>
    		</v-chip>

		  	<v-chip
			color="indigo"
			text
			dark
			class="ml-3 mt-2"
			label
			text-color="white"
			large
			>
		    <v-switch
			  inset
              v-model="online"
              label="Показать, кто сейчас на сайте ?"
              color="indigo darken-3"
            ></v-switch>
    		</v-chip>

  </v-row>

  <v-row>
	  <v-col>
      <v-btn
	    x-large
        :disabled="autoUpdate"
        :loading="isUpdating"
        outlined
        color="white"
        depressed
        @click="getUsers"
		block
      >
        <v-icon left>
          fa-search
        </v-icon>
		  Искать
      </v-btn>
	  </v-col>
  </v-row>
 </v-container>
 </v-form>
</template>

<script>
  export default {
	components: {
	},
    data: () => ({
	range: [18, 98],
	selectedSex: 'Не важно',
	selectedCity: 'Москва', 
	lowerBound: '18',
	upperBound: '28',
	telegram: false,
	whatsup: false,
	online: false,
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
    },
	methods: {
		getUsers(){
			console.log("first age", this.range[0]+1)
			var lowerBound = this.range[0]
			var upperBound = this.range[1]
			console.log(this.telegram)
			this.$root.$emit('changeSearch', 
			this.selectedSex,
			this.selectedCity, 
			lowerBound, 
			upperBound,
			this.telegram,
			this.whatsup,
			this.online
			)
		}
	}
  }
</script>

