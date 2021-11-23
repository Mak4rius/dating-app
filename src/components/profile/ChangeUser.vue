<template>
  <v-row justify="center" app>
	<v-col cols="12">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="650px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
	      rounded
	      x-large  
          dark
		  block
		  color="indigo darken-4"
		  elevation="24"
          v-bind="attrs"
          v-on="on"
        >
           Изменить анкету
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Изменение профиля</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6" >
			  <v-text-field v-model="name" :rules="[rules.required]" label="Имя" maxlength="20" required></v-text-field>
			  </v-col>
			  <v-radio-group
					v-model="radios"
					row
					>
					<v-col cols="6" sm="6" md="6">
					<v-radio
						label="Мужчина"
						value="0"
					></v-radio>
					</v-col>
					<v-col cols="12" sm="6" md="6">
					<v-radio
						label="Женщина"
						value="1"
					></v-radio>
					</v-col>
			  </v-radio-group>
			  <v-col cols="6">
			  <v-text-field v-model="age" type="number" :rules="[rules.required]" label="Возраст" maxlength="2" required></v-text-field>
			  </v-col>		
			  <v-col cols="6">
			  <v-slider
			   dense
			   v-model="age"
			   min="18"
			   max="75"
			   :label="thumb-color"
			   :thumb-color="red"
				></v-slider>
			  </v-col>		
              <v-col cols="6">
                    <v-text-field v-model="height" type="number" :rules="[rules.required]" label="Рост ( в сантиметрах )" maxlength="3" required></v-text-field>
              </v-col>
			  <v-col cols="6" >
						<v-slider
						v-model="height"
						min="0"
						max="225"
						:label="thumb-color"
						:thumb-color="red"
						></v-slider>
			  </v-col>
              <v-col cols="6">
					<v-text-field v-model="weight" type="number" :rules="[rules.required]" label="Вес ( в киллограмах ) " maxlength="3" required></v-text-field>                  
              </v-col>
			  <v-col cols="6">
					<v-slider
					v-model="weight"
					min="0"
					max="140"
					:label="thumb-color"
					:thumb-color="red"
					></v-slider>
				</v-col>
              <v-col
                cols="12"

              >
						<v-select
				:items="cities"
				v-model="city"
				label="Выберите ваш город:"
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
          </v-container>
        </v-card-text>
        <v-card-actions>
		  <v-row>
		  <v-col cols='6'>
          <v-btn
            color="indigo"
            text
			block
			x-large
            @click="dialog = false"
          >
            Не сохранять
          </v-btn>
		  </v-col>
		  <v-col cols='6'>
          <v-btn
            color="indigo"
            text
			block
			x-large
            @click="changeUserDetails"
          >
            Сохранить 
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
import firebase from "firebase"

  export default {
	beforeMount(){
		this.username = this.$store.state.user.username
		this.age = this.$store.state.user.age
		this.city = this.$store.state.user.city
		this.height = this.$store.state.user.height
		this.weight = this.$store.state.user.weight
		this.radios = this.$store.state.user.sex
	},
	methods: {
		changeUserDetails(){
			this.$store.state.user.username = this.username
			this.$store.state.user.age = this.age
			this.$store.state.user.city = this.city
			this.$store.state.user.height = this.height
			this.$store.state.user.weight = this.weight
			this.$store.state.user.sex = this.radios
			firebase.firestore().collection('users').doc(this.$store.state.user._id)
			.update({username: this.username,
					 age: this.age, 
					 city: this.city, 
					 height: this.height,
					 weight: this.weight, 
					 sex: this.radios
			}).then(() => {
				console.log("Данные пользователя обновились!")
			})
			.catch((error) => {
				// The document probably doesn't exist.
				console.error("Произошла ошибка: ", error)
			})
			this.dialog = false
		}
	},
    data: () => ({
      dialog: false,
	  name: "",
	  age: "",
	  city:"",
	  height: "",
	  weight: "",
	  radios: "",
	  show1: false,
      rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 8) || "Min 8 characters"
    	},
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
]
    }),
  }
</script>
