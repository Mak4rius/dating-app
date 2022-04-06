export default class Chat {
	constructor (
	  room_id,
	  room_name,
	  last_message,
	  users,
	) {
		this.room_id = room_id
		this.room_name = room_name
		this.last_message = last_message
		this.users = users
	}
}
