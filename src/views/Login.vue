<template>
            <v-card max-width="800px" elevation="24" min-width="360px" outlined height='600px' class="mx-auto mt-10" shaped app>
                <v-tabs v-model="tab" show-arrows background-color="indigo" icons-and-text dark grow>
                    <v-tabs-slider color="white"></v-tabs-slider>
                    <v-tab v-for="i in tabs" :key="i">
                        <v-icon large>{{ i.icon }}</v-icon>
                        <div class="caption py-1">{{ i.name }}</div>
                    </v-tab>
                    <v-tab-item>
                        <v-card>
                            <v-card-text>
                                <v-form ref="loginForm" v-model="valid" lazy-validation>
                                    <v-row>
										<v-col cols="12">
											<v-spacer></v-spacer>
                                        </v-col>
										<v-col cols="12">
											<v-spacer></v-spacer>
                                        </v-col>
										<v-col cols="12">
											<v-spacer></v-spacer>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="Почта" required ></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Пароль" hint="Минимум 8 символов" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
										<v-col cols="12">
											<v-spacer></v-spacer>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                        </v-col>
                                        <v-col cols="12">
                                            <v-btn x-large block :disabled="!valid" color="indigo" class="ma-2 white--text" @click="login">
												<div v-if="loading">Loading</div>
												<div v-else>Залогиниться</div>
											</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card>
                            <v-card-text>
                                <v-form ref="registerForm" v-model="valid" lazy-validation>
                                    <v-row dense>
                                        <v-col cols="12" sm="3" md="3">
                                            <v-text-field v-model="firstName" :rules="[rules.required]" label="Имя" maxlength="20" required></v-text-field>
                                        </v-col>
										<v-col cols="12" sm="3" md="3">
                                        <v-text-field v-model="age" :rules="[rules.required]" label="Возраст" maxlength="20" required></v-text-field>
                                        </v-col>
										<v-radio-group
										v-model="radios"
										row
										>
										<v-col cols="12" sm="6" md="6">
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
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="height" :rules="[rules.required]" label="Рост" maxlength="20" required></v-text-field>
                                        </v-col>
										<v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="weight" :rules="[rules.required]" label="Вес" maxlength="20" required></v-text-field>
                                        </v-col>
										<v-col cols="12" sm="6" md="6">
										<v-slider
										dense
										v-model="height"
										min="0"
										max="225"
										:label="thumb-color"
										:thumb-color="red"
										></v-slider>
										</v-col>
										<v-col cols="12" sm="6" md="6">
										<v-slider
										dense
										v-model="weight"
										min="0"
										max="140"
										:label="thumb-color"
										:thumb-color="red"
										></v-slider>
										</v-col>
										<v-col>
										<v-select
											:items="cities"
											v-model="hometown"
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
                                        <v-col cols="12">
                                            <v-text-field v-model="email" :rules="emailRules" label="Почта" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Пароль" hint="Минимум 8 символов" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Подтвердите пароль" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-btn x-large block :disabled="!valid" color="indigo" class="white--text"  @click="register">
												<div v-if="loading">Loading</div>
												<div v-else>Зарегестрироваться</div>
												</v-btn>
                                        </v-col>
										<v-col cols="12">
											<v-divider></v-divider>
                                   	    </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-card>
</template>

<script>

export default {
  name: 'Login',
  data: () => ({
	radios: null,
	dialog: true,
    tab: 0,
    tabs: [
        {name:"Login", icon:"mdi-account"},
        {name:"Register", icon:"mdi-account-outline"}
    ],
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
    valid: true,
	items: ['Женщина', 'Мужчина'],
    firstName: "",
    age: "",
	height: "",
	weight: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    emailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],

    show1: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 8) || "Min 8 characters"
    }
  }),
  // Promise is a proxy value not necessarily known when the promis is created
  // Promise is always in one of those states : pending, fulfilled, rejected
  // 		Pending: initial state, neither fulfilled nor rejected
  // 		Fulfilled: meaning that the operation wsas completed successfully
  //		Rejected: meaning that the operation failed
  methods: {
	  register(){
		  	  const user = {
					email: this.email,
					password: this.password,
					name: this.firstName,
					age: this.age,
					city: this.hometown,
					sex: this.radios,
					height: this.height,
					weight: this.weight
				}
		  	  this.$store.dispatch('registerUser', 
				user)
				.then(() => {
					console.log('REGISTER!')
					this.$router.push('/')
				})
				.catch(err => {
					console.log(err)
					console.log('NOT REGISTERED!')
				})

	  },
	  login(){
		  const user = {
			  email: this.loginEmail,
			  password: this.loginPassword
		  }
		  this.$store.dispatch('loginUser', user)
				.then(() => {
					console.log('LOGGED IN!')
					console.log(this.$store.state.user)
					this.$router.push('/')
				})
				.catch(err => {
					console.log('NOT LOGGED IN!')
				})
	  }
  },
  computed: {
	  loading() {
		  return this.$store.getters.loading // return the loading getter from common.js file
	  }
  }
}
</script>