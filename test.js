
/**
* Examples:
*
* Add Room Bathroom          add new room
* Add Room Kitchen       
* Add Item Kettle            add item to last room
* Select Room Bathroom       select room
* Add Item Toilet            add item to selected room (last room)
* Add Item Bowl to Kitchen   add item to given room
*/

$(function() {
	$start = $('#start');
	$rooms = $('#rooms');
	speaking = false;

	rooms = [];
	items = [];

	Sys = function() {
		this.roomTemplate = _.template($('#roomTemplate').html());
		this.itemTemplate = _.template($('#itemTemplate').html());
		this.selectedRoom = null;
	};

	Sys.prototype.findRoom = function(name) {
		if (_.isObject(name)) {
			return name;
		}
		found = _.where(rooms, {name:name});
		if ( ! found) {
			return false;
		}
		return found[0];
	}

	Sys.prototype.selectRoom = function(name) {
		this.selectedRoom = this.findRoom(name);
		if ( ! this.selectedRoom) {
			return console.log('no room found - ', name);
		}

		$('.room').removeClass('selected');
		$('#room-'+this.selectedRoom.id).addClass('selected');
	};

	Sys.prototype.addRoom = function(name) {
		room = {
			id: _.uniqueId(),
			name: name
		};
		rooms.push(room);

		$rooms.append(this.roomTemplate(room));
		this.selectRoom(room);
	};

	Sys.prototype.removeRoom = function(name) {
		room = this.findRoom(name) || this.selectedRoom;
		if ( ! room) {
			return console.log('no room found - ', name);
		}

		rooms = _.without(rooms, room);
		$('#room-'+room.id).remove();

		items = _.reject(items, function(i) {
			return i == room.id;
		});

		if (room == this.selectedRoom) {
			this.selectRoom(_.first(rooms));
		}
	}

	Sys.prototype.addItem = function(name) {
		room = this.selectedRoom;
		item = {
			id: _.uniqueId(),
			name: name,
			room_id: room.id
		};
		items.push(item);

		$room = $('#room-'+room.id+'-items');
		$room.append(this.itemTemplate(item));
	}

	Sys.prototype.add

	sys = new Sys;

	Interpreter = function(topResult, result) {
		words = _.without(topResult.transcript.trim().split(' '), 'a', 'called', 'named');
		length = words.length;
		firstW = words[0];
		lastW = words[length - 1];

		if (firstW == 'add' && length > 1) {
			secondW = words[1];
			if (secondW == 'room' && length > 2) {
				remainW = words.slice(2).join(' ');
				return sys.addRoom(remainW);
			}
			else if (secondW == 'item' && length > 2) {
				remainW = words.slice(2).join(' ');
				return sys.addItem(remainW);
			}
		}
		else if (firstW == 'remove' && length > 1) {
			secondW = words[1];
			if (secondW == 'room') {
				remainW = null;
				if (length > 2) {
					remainW = words.slice(2).join(' ');
				}
				return sys.addRoom(remainW);
			}
		}
		else if (firstW == 'select' && length > 2) {
			secondW = words[1];
			if (secondW == 'room') {
				remainW = words.slice(2).join(' ');
				return sys.selectRoom(remainW);
			}
		}

		console.log('commands not recognised');
	};

	SpeechRecognition = window.webkitSpeechRecognition;

	if (SpeechRecognition) {

		recog = new SpeechRecognition;
		recog.maxAlternatives = 2;
		recog.continuous = true;

		console.log('speech ready');

		$start.on('click', function() {
			if (speaking) {
				speaking = false;
				recog.stop();
				$start.toggleClass('listening');
				console.log('speech stop');
			}
			else {
				speaking = true;
				recog.start();
				$start.toggleClass('listening');
				console.log('speech start');
			}
		});

		recog.onerror = function() {
			console.log('speech error. try again');
		};

		recog.onnomatch = function() {
			console.log('no match. try again');
		};

		recog.onresult = function(event) {
			if ( ! event.results.length) {
				return console.log('nothing');
			}

			results = event.results[event.results.length - 1];
			topResult = results[0];

			if (topResult.confidence < 0.5) {
				return console.log('poor result. try again');
			}

			Interpreter(topResult, results);
		}


	}
	else {
		console.log('no speech :(');
	}

});
