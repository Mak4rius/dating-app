<template>
  <v-card outlined dark tile color="indigo darken-4" >
    <v-card-title class="text-center justify-center py-6">
	      <p class="text-h2" text-color="white">
        	<vue-typer
			:text='[" Dating "]'
			:repeat='0'
			:shuffle='false'
			initial-action='typing'
			:pre-type-delay='70'
			:type-delay='70'
			:pre-erase-delay='2000'
			:erase-delay='250'
			erase-style='select-all'
			:erase-on-complete='false'
			caret-animation='smooth'
			></vue-typer>
      </p>
    </v-card-title>
    <v-tabs
      v-model="tab"
	  dark
	  background-color="indigo darken-4"
	  icons-and-text
	  centered
    >
	<v-tabs-slider></v-tabs-slider>
      <v-tab
        v-for="item in items"
        :key="item"
		:to="item.link"
      >
        {{ item.title }}
	      <v-badge
		  :content="messages"
          :value="messages"
		  color="indigo darken-2"
		  inline
		  v-if="item.title === 'Диалоги'"
     	>
		<v-icon>mdi-{{item.icon}}</v-icon>
		</v-badge>
		<v-icon v-if="item.title != 'Диалоги'">mdi-{{item.icon}}</v-icon>
      </v-tab>
    </v-tabs>
  	</v-card>
</template>

<script>

import firebase from 'firebase'

export default {
	data(){
		return{
			messages: 0,
			listeners: [],
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
			tab: null,
			drawer:false,
			items: [
				{title:"Главная", link:"/", icon:"home"},
				{title:"Профиль", link:"/profile", icon:"account"},
				{title:"Диалоги", link:"/chats", icon:"chat-processing"},
				{title:"Поиск", link:"/search", icon:"account-search"},
					
			]
			// Add after the development	{title:"Услуги", link:"/services", icon:"account-cash"},	
		}
	},
	computed: {
		checkUser(){
			// This function checks if the user is logged in
			// It used in order to display or not displa
			return this.$store.getters.checkUser
		},
		showNotifications(){
			if(this.$route.name === 'Диалоги'){
				return false
			}else{
				true
			}
		}
	},
	mounted() {
		 setTimeout(() => {this.fetchMessages()}, 1000)
	},
	updated(){
		 setTimeout(() => {this.fetchMessages()}, 50000)
	},
	methods: {
		async logOust(){
			this.$store.dispatch('logoutUser')
		},
		resetCounter(){
			this.messages = 0
		},
		fetchMessages(){

			this.messages = 0 
			const ROOMS_PATH = 'chatRooms'
			const MESSAGES_PATH = 'messages'
			const MESSAGE_PATH = roomId => {
					return `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`
				}
			console.log(this.$route.name)
			firebase.firestore().collection(ROOMS_PATH).get().then((querySnapshot) => {
				querySnapshot.forEach(room => {
					const currentId = this.$store.state.user._id
					if(currentId === room.data().users[0] || currentId === room.data().users[1]){
						firebase.firestore().collection(MESSAGE_PATH(room.id)).onSnapshot((messages) => {
							this.messages = 0
							messages.forEach(message => {
								if(message.data().sender_id != currentId){
									if(!message.data().seen){
										this.messages = this.messages + 1
									}
								}
							})
					})
					}
				})
			})
		},
	}
}
</script>

<style>
.vue-typer {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.vue-typer .custom.char {
  color: #FFFF;
  background-color: #1A237E;
}
.vue-typer .custom.char.selected {
  background-color: #1A237E;
}

.vue-typer .custom.caret {
  width: 8px;
  background-color: #FFFF;
  display: inline-block;
}
</style>