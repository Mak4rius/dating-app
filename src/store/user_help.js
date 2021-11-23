export default class User {
	constructor (
		_id, 
		username, 
		age, 
		sex, 
		city,
		height,
		weight,
		telegram,
		whatsup,
		phone,
		photos,
		online,
		lastChanged
		) 
		{
		this._id = _id
		this.username = username
		this.age = age
		this.sex = sex
		this.city = city
		this.height = height
		this.weight = weight
		this.telegram = telegram
		this.whatsup = whatsup
		this.phone = phone
		this.photos = photos 
		this.online = online
		this.lastChanged = lastChanged
 	}
}