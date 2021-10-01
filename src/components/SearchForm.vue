<template>
  <v-form>
  <v-container>
  <v-row>
	<v-chip
      class="mt-8"
      color="cyan"
      label
      text-color="white"
    >
      Кого ищете?:
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
      class="mt-8"
      color="cyan"
      label
      text-color="white"
    >
      Из города:
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
   <v-chip
      class="mt-4"
      color="cyan"
      label
      text-color="white"
    >
      Возраст от
    </v-chip>
	<v-col>
	<v-text-field
	:value="range[0]"
	class="mt-0 pt-0"
	hide-details
	single-line
	type="number"
	style="width: 60px"
	v-model="lowerBound"
	@change="$set(range, 0, $event)"
	></v-text-field>
	</v-col>

	<v-chip
      class="mt-4"
      color="cyan"
      label
      text-color="white"
    >
      до
    </v-chip>

	<v-col>
	<v-text-field
	:value="range[1]"
	class="mt-0 pt-0"
	hide-details
	single-line
	type="number"
	style="width: 60px"
	v-model="upperBound"
	@change="$set(range, 1, $event)"
	></v-text-field>
	</v-col>
  </v-row>

  <v-row>
	  <v-col>
      <v-btn
	    x-large
        :disabled="autoUpdate"
        :loading="isUpdating"
        color="grey darken-4"
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
	range: [18, 70],
	selectedSex: 'Не важно',
	selectedCity: 'Москва', 
	lowerBound: '18',
	upperBound: '28',
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

			this.$root.$emit('changeSearch', 
			this.selectedSex,
			this.selectedCity, 
			this.lowerBound, 
			this.upperBound)
		}
	}
  }
</script>

