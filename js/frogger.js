var KEYCODE_ENTER = 13;		//useful keycode
	var KEYCODE_SPACE = 32;		//useful keycode
	var KEYCODE_UP = 38;		//useful keycode
	var KEYCODE_LEFT = 37;		//useful keycode
	var KEYCODE_RIGHT = 39;		//useful keycode
	var KEYCODE_DOWN = 40;		//useful keycode
	var KEYCODE_W = 87;			//useful keycode
	var KEYCODE_A = 65;			//useful keycode
	var KEYCODE_D = 68;			//useful keycode
	var KEYCODE_S = 83;			//useful keycode
	
	// GAME VARS
	
	function frogOutOfScreen(x) {
		return (x <= 19 || x > 780);
	}
	
	function randBetween(min, max) {
		n = max - min;
		return Math.floor(Math.random() * n) + min;
	}
	
	function objectRow(n_objects, speed, init_y, sprite, distribution, min_space_between)
	{
		this.n_objects = n_objects;
		this.obj_array = new Array(n_objects);
		this.speed = speed;
		this.frog_to_object_y = init_y+19;

		for (var i = 0;i < n_objects;i++) {
			if (sprite == "turtle_big") {
				this.obj_array[i] = new createjs.Sprite(turtle_big_ss, "swim");
			}
			else if (sprite == "turtle_small") {
				this.obj_array[i] = new createjs.Sprite(turtle_small_ss, "swim");
			}
			else if (sprite == "log_small") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("log_small"));
			}
			else if (sprite == "log_medium") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("log_medium"));
			}
			else if (sprite == "log_big") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("log_big"));
			}
			else if (sprite == "car1") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("car1"));
			}
			else if (sprite == "car2") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("car2"));
			}
			else if (sprite == "car3") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("car3"));
			}
			else if (sprite == "car4") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("car4"));
			}
			else if (sprite == "car5") {
				this.obj_array[i] = new createjs.Bitmap(loader.getResult("car5"));
			}
			else if(sprite == "end_leaf" || sprite == "end_leaf_mask") {
				this.obj_array[i] = new createjs.Shape();
				if (sprite == "end_leaf")
					var color = "#22B14C";
				else
					var color = "#ff0000";
				this.obj_array[i].graphics.beginFill(color).drawCircle(20, 20, 20);
				this.obj_array[i].x = Math.floor(800/n_objects);
			}
			this.obj_array[i].y = init_y;
			stage.addChild(this.obj_array[i]);
		}

		// Set initial x position
		if (sprite != "end_leaf" && sprite != "end_leaf_mask")
			this.sprite_w = this.obj_array[0].getBounds().width;
		else
			this.sprite_w = 40;
		this.row_width = 800 + 2*this.sprite_w; // objects can go out of screen
		var split_row = Math.floor(this.row_width / this.n_objects);
		
		for (i = 0;i < this.n_objects;i++) { // Offset so objects can go out of screen
			this.obj_array[i].regX += this.sprite_w;
		}

		var distribution = distribution || "uniform";
		if (distribution == "uniform") {
			for (var i = 0;i < this.n_objects;i++) {
				this.obj_array[i].x = split_row * i;
			}
		}
		else if (distribution == "random") {
			var min_space_between = min_space_between || 40;
			for (var i = 0;i < this.n_objects;i++) {
				var x = randBetween(i*split_row, (i+1)*split_row - min_space_between - this.sprite_w);
				this.obj_array[i].x = x;
			}		
		}
		
		this.updatePosition = function() {
			for (var i = 0;i < n_objects;i++) {
				this.obj_array[i].x = (this.obj_array[i].x + Math.floor(this.speed*speed_mod) + this.row_width) % this.row_width;
			}
		}
		
		this.makeVisible = function() {
			for (var i = 0;i < n_objects;i++) {
				this.obj_array[i].alpha = 1;
			}
		}
		
		// 0 -> Not on same row; 1 -> Touching; -1 -> Not touching;
		this.isTouchingFrog = function() {
			if (frog.sprite.y != this.frog_to_object_y) return 0; 
			for (var i = 0;i < this.n_objects;i++) {
				if (this.obj_array[i].x-this.sprite_w < frog.x+10 && this.obj_array[i].x > frog.x-10)
					return 1;
			}
			return -1;
		}
		
		this.whichObjectTouching = function() {
			if (frog.sprite.y != this.frog_to_object_y) return -1; 
			for (var i = 0;i < this.n_objects;i++) {
				if (this.obj_array[i].x-this.sprite_w < frog.x+10 && this.obj_array[i].x > frog.x-10)
					return i;
			}
			return -1;
		}
		
	}

	
	/* 
		Creates a container holding the background and adds it to the stage
	*/
	function init_background() 
	{
		// Background painting
		var header = new createjs.Shape();
		header.graphics.beginFill("#555555").drawRect(0, 0, 800, 40);		

		var water = new createjs.Shape();
		water.graphics.beginFill("#3F48CC").drawRect(0, 40, 800, 240);

		var middle = new createjs.Shape();
		middle.graphics.beginFill("#A349A4").drawRect(0, 280, 800, 40);

		var road = new createjs.Shape();
		road.graphics.beginFill("black").drawRect(0, 320, 800, 200);

		var bottom = new createjs.Shape();
		bottom.graphics.beginFill("#A349A4").drawRect(0, 520, 800, 40);
		
		var footer = new createjs.Shape();
		footer.graphics.beginFill("#555555").drawRect(0, 560, 800, 40);
		
		// Adding background elements to canvas
		background = new createjs.Container();
		background.addChild(header, water, middle, road, bottom, footer);
		stage.addChild(background);
	}
	/* 
		End painting background
	*/
	
	/* 
		Load assets - spritesheets, sounds etc. 
		When finished loading calls handleComplete
	*/
	function init()
	{
		stage = new createjs.Stage("froggerCanvas");
		
		manifest = [
			{src: "frog_anim.png", id: "frog"},
			{src: "car1.png", id:"car1"},
			{src: "car2.png", id:"car2"},
			{src: "car3.png", id:"car3"},
			{src: "car4.png", id:"car4"},
			{src: "car5.png", id:"car5"},
			{src: "turtle.png", id:"turtles"},
			{src: "turtle_mini.png", id:"turtles_mini"},
			{src: "log_114.png", id:"log_small"},
			{src: "log_171.png", id:"log_medium"},
			{src: "log_228.png", id:"log_big"},
			{src: "frog_single.png", id:"frog_single"},
			{src: "snd_splat.mp3", id:"splat"},
			{src: "snd_traffic.mp3", id:"traffic"},
			{src: "snd_river.mp3", id:"river"}
		];
		loader = new createjs.LoadQueue(true, "./assets/");
		loader.installPlugin(createjs.Sound);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest);
	}
	
	/* 
		When everything loaded paint background, load sprites from spritesheets and add to stage
	*/
	function init_turtles_big()
	{
		turtle_big_ss = new createjs.SpriteSheet({
			framerate:8,
			"images": [loader.getResult("turtles")],
			"frames": {"width":150, "height":38, "count":8, "regX":0, "regY":0, "spacing":0, "margin":0},
			"animations": {
				"swim": [0, 2, "swim"],
				"dive": [2, 5, "stayUnder"],
				"stayUnder": 5,
				"submerge": [5, 7, "swim"]
			}
		});
		turtles_big = new objectRow(4, -4, (6*40)+1, "turtle_big");
	}
	function init_turtles_small() 
	{
		turtle_small_ss = new createjs.SpriteSheet({
			framerate:8,
			"images": [loader.getResult("turtles_mini")],
			"frames": {"width":100, "height":38, "count":8, "regX":0, "regY":0, "spacing":0, "margin":0},
			"animations": {
				"swim": [0, 2, "swim"],
				"dive": [2, 5, "stayUnder"],
				"stayUnder": 5,
				"submerge": [5, 7, "swim"]
			}
		});
		turtles_small = new objectRow(5, -4, (3*40)+1, "turtle_small");	
	}
	function init_logs_big()
	{
		log_big = new objectRow(3, 4, (4*40)+1, "log_big", "random", 10);
	}
	function init_logs_medium() 
	{
		log_medium = new objectRow(3, 3, (2*40)+1, "log_medium", "random", 10);
	}
	function init_logs_small() 
	{
		log_small = new objectRow(5, 2, (5*40)+1, "log_small", "random", 10);
	}
	function init_end_leaves() 
	{
		end_mask = new objectRow(6, 0, (1*40)+1, "end_leaf_mask");
		end_leaves = new objectRow(6, 0, (1*40)+1, "end_leaf");
	}
	
	function init_platforms() 
	{
		init_turtles_big();
		init_turtles_small();
		init_logs_big();
		init_logs_medium();
		init_logs_small();
		init_end_leaves();
	}
	
	function init_frog()
	{
		frog = new frog_object();
	}
	
	function frog_object()
	{
		this.x = (5*40)+20;
		this.y = (13*40)+20;
		
		frogSpriteSheet = new createjs.SpriteSheet({
			framerate:20,
			"images": [loader.getResult("frog")],
			"frames": {"width":38, "height":44, "count":4, "regX":19, "regY":19, "spacing":0, "margin":0},
			"animations": {
				"wait": 0,
				"move": [0, 3, "wait"]
			}
		});
		
		this.sprite = new createjs.Sprite(frogSpriteSheet, "wait");
		
		this.resetFrog = function() {
			this.sprite.rotation = 0;
			this.x = (5*40)+20;
			this.y = (13*40)+20;
			createjs.Tween.get(this.sprite).to({x:this.x, y:this.y}, 1);
			wait_respawn = false;
			stage.update();
		}
		
		this.resetFrogFast = function() {
			createjs.Ticker.removeEventListener("tick", tick);	
			setTimeout(function () {
				frog.sprite.rotation = 0;		
				frog.x = (5*40)+20;
				frog.y = (13*40)+20;
				frog.sprite.x = frog.x;
				frog.sprite.y = frog.y;
				stage.update();
				wait_respawn = false;
				createjs.Ticker.addEventListener("tick", tick);
			}, 105);
		}
		
		/* 
		Frog movement functions
		*/
		this.moveRigth = function () {
			this.sprite.rotation = 90;
			if (this.x > 740) 
				this.x = 780;
			else
				this.x += 40;
			this.sprite.gotoAndPlay("move");
			createjs.Tween.get(this.sprite).to({x:this.x}, 100);
		}
		this.moveLeft = function () {
			this.sprite.rotation = -90;
			if (this.x < 60) 
				this.x = 20;
			else
				this.x -= 40;
			this.sprite.gotoAndPlay("move");
			createjs.Tween.get(this.sprite).to({x:this.x}, 100);
		}
		this.moveUp = function () {
			this.sprite.rotation = 0;
			if (this.y < 80) return;
			this.y -= 40;
			this.sprite.gotoAndPlay("move");
			createjs.Tween.get(this.sprite).to({y:this.y}, 100);	
		}
		this.moveDown = function () {
			this.sprite.rotation = 180;
			if (this.y > 520) return;
			this.y += 40;
			this.sprite.gotoAndPlay("move");
			createjs.Tween.get(this.sprite).to({y:this.y}, 100);
		}
		/* 
			End frog movement functions
		*/
		
		this.resetFrog();
		stage.addChild(this.sprite);
	}
	
	function init_cars() 
	{
		cars = new Array(5);
		var carSpeed = [-6, +4, -4, +4, -5];
		for (var i = 0;i < 5;i++) {
			cars[i] = new objectRow(3, carSpeed[i], ((8+i)*40)+1, "car"+(5-i), "random", 160);
		}
	}
	
	function init_player()
	{
		player_dead = false;
		player_won  = false;
		score		= 0;
		level		= 1;
		score_mod   = 1.0;
		speed_mod	= 1;
		lives 		= 3;
		wait_respawn = false;
		leaves_cleared = new Array(end_leaves.obj_array.length);
		reset_leaves();
	}
	
	function reset_leaves() {
		if (leaves_cleared != "undefined")
			for (var i = 0;i < leaves_cleared.length;i++) {
				leaves_cleared[i] = false;
				end_leaves.obj_array[i].alpha = 1;
			}
	}
	
	function check_leaves() {
		if (leaves_cleared != "undefined") {
			for (var i = 1;i < leaves_cleared.length;i++) {
				if (leaves_cleared[i] == false) return false;
			}
			return true;
		}
	}
	
	function init_hud() 
	{
		hud_score = new createjs.Text("Score:"+score, "bold 39px Arial", "#00ff00");
		hud_score.x = 10;
		hud_score.y = 2;
		stage.addChild(hud_score);
		
		hud_lives = new Array(lives);
		for (var i = 0;i < lives;i++) {
			hud_lives[i] = new createjs.Bitmap(loader.getResult("frog_single"));
			hud_lives[i].x = (800 - lives*43) + 43*i;
			hud_lives[i].y = 1;
			stage.addChild(hud_lives[i]);
		}
	}
	
	function show_welcome_message()
	{
		wm_container = new createjs.Container();
		
		var wm_background = new createjs.Shape();
		wm_background.graphics.beginFill("#00ff00").drawRect(0, 0, 800, 600);
		
		var wm_text = new createjs.Text("Welcome to frogger!\nPress ENTER to play!", "bold 36px Arial", "#000000");
		wm_text.textAlign = "center";
		wm_text.textBaseline = "middle";
		wm_text.x = 400;
		wm_text.y = 300;
		
		wm_container.addChild(wm_background, wm_text);
		stage.addChild(wm_container);
	}
	
	function confirm_upload_message()
	{
		cu_container = new createjs.Container();
		
		var cu_background = new createjs.Shape();
		cu_background.graphics.beginFill("#00ff00").drawRect(0, 0, 800, 600);
		
		var cu_text = new createjs.Text("Welcome to frogger!\nPress ENTER to play!", "bold 36px Arial", "#000000");
		wm_text.textAlign = "center";
		wm_text.textBaseline = "middle";
		wm_text.x = 400;
		wm_text.y = 300;
		
		wm_container.addChild(wm_background, wm_text);
		stage.addChild(wm_container);
	}
	
	function handleComplete () 
	{
		
		init_background(); // Paints background an adds it to canvas
		init_platforms();
		init_frog();
		init_cars();
		init_player();
		init_hud();
		show_welcome_message();
		snd_traffic = createjs.Sound.play("traffic", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 1});
		snd_river =createjs.Sound.play("river", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0});
		
		stage.update();	
	}

	/* Dead menu */
	function show_dead_menu() {	
		if (createjs.Ticker.hasEventListener("tick"))
			createjs.Ticker.removeEventListener("tick", tick);	
		menu_container = new createjs.Container();
		
		var menu_background = new createjs.Shape();
		menu_background.graphics.beginFill("#00ff00").drawRect(0, 40, 800, 560);
		
		var menu_text = new createjs.Text("YOU'RE DEAD!\n\n\nPlay again\n\nUpload highscore", "bold 36px Arial", "#000000");
		menu_text.textAlign = "center";
		menu_text.textBaseline = "middle";
		menu_text.x = 400;
		menu_text.y = 200;
		
		var play_again = new createjs.Shape();
		play_again.graphics.beginFill("#ffff00").drawRect(0, 270, 800, 70);
		
		var upload = new createjs.Shape();
		upload.graphics.beginFill("#ffff00").drawRect(0, 345, 800, 70);
		
		menu_container.addChild(menu_background, play_again, upload, menu_text);
		stage.addChild(menu_container);
		
		play_again_f = function() { 
			frog.resetFrog();
			stage.removeChild(menu_container);
			player_dead = false;
			reset_leaves();
			score = 0;
			level = 1;
			lives = 3;
			score_mod = speed_mod = 1;
			for (i = 0;i < lives;i++) {
				hud_lives[i].alpha = 1;
			}
			createjs.Ticker.addEventListener("tick", tick);
			show_level();
		}
		play_again.addEventListener("click", play_again_f);
		
		upload_f = function() { 
			var return_code = 0;
			gameId = document.location.toString().split("game_id=")[1];
			url = "http://localhost/RWAProjekt/JSPostTest.php?score="+score+"&game_id="+gameId;
			menu_text.text = "YOU'RE DEAD!\n\n\nPlay again\n\nSending score...";
			stage.update();
			jx.load(url, function(data) {
				menu_text.text = "YOU'RE DEAD!\n\n\nPlay again\n\nScore sent...\n\n"+data;
				if (upload.hasEventListener("click")) upload.removeEventListener("click", upload_f);
				stage.update();
			},'text');
			stage.update();
		}
		upload.addEventListener("click", upload_f);
	}
	/* End dead menu */
	
	function play_dead_sound() 
	{
		createjs.Sound.play("splat", {interrupt: createjs.Sound.INTERRUPT_NONE, volume: 0.5});
	}
	
	function show_level() {
		if (createjs.Ticker.hasEventListener("tick"))
			createjs.Ticker.removeEventListener("tick", tick);
		game_paused = true;
		level_container = new createjs.Container();
		
		var level_background = new createjs.Shape();
		level_background.graphics.beginFill("#00ff00").drawRect(0, 0, 800, 600);
		
		var level_text = new createjs.Text("LEVEL "+level, "bold 40px Arial", "#000000");
		level_text.textAlign = "center";
		level_text.textBaseline = "middle";
		level_text.x = 400;
		level_text.y = 300;
		
		level_container.addChild(level_background, level_text);
		stage.addChild(level_container);
		
		frog.resetFrog();
		reset_leaves();
		setTimeout(function () {
			stage.removeChild(level_container);
			game_paused = false;
			createjs.Ticker.addEventListener("tick", tick); // Start game timer
		}, 2000);
	}
	
	function snd_set(handle, vol) {
		if (handle.volume == vol) return;		
		if (typeof(snd_int) == "undefined") {
			if (handle.volume < vol) {
				snd_int = setInterval(function () {
					handle.volume += 0.1;
					if (handle.volume > vol-0.2) {
						handle.volume = vol;
						clearInterval(snd_int);
						delete snd_int;
					}
				}, 50);
			}
			else {
				snd_int = setInterval(function () {
					handle.volume -= 0.1;
					if (handle.volume < vol+0.2) {
						handle.volume = vol;
						clearInterval(snd_int);
						delete snd_int;
					}
				}, 50);
			}
		}
	}
	
	function tick(event) { 
		//Sound thingy
		if (frog.y < 280) {	
			snd_set(snd_traffic, 0);
			snd_set(snd_river, 0.7);
		}
		else if (frog.y > 320) {
			snd_set(snd_traffic, 0.7);
			snd_set(snd_river, 0);
		}
		else {
			snd_set(snd_traffic, 0.2);
			snd_set(snd_river, 0.4);
		}
		
		// Move cars
		for (var i = 0;i < 5;i++) {
			cars[i].updatePosition();
		}
		turtles_big.updatePosition();
		turtles_small.updatePosition();
		log_small.updatePosition();
		log_medium.updatePosition();
		log_big.updatePosition();
		
		/* Collision detection */
		for (var i = 0;i < 5;i++) {
			if (cars[i].isTouchingFrog() == 1) {
				player_dead = true;
			}
		}
		
		var platform_objects = new Array(turtles_big, turtles_small, log_small, log_medium, log_big);
		for (var i = 0;i < platform_objects.length;i++) {
			var touch = platform_objects[i].isTouchingFrog();
			switch (touch) {
				case 1: // Same row, touching frog
					if (frogOutOfScreen(frog.x + Math.floor(platform_objects[i].speed*speed_mod))) {
						player_dead = true;
					}
					else {
						frog.x += Math.floor(platform_objects[i].speed*speed_mod);
						frog.sprite.x += Math.floor(platform_objects[i].speed*speed_mod);
					}
					break;
				case -1: // Same row, not touching
					player_dead = true;
				case 0: // Not on the same row
					break;
			}
		}
		
		var touch = end_leaves.isTouchingFrog();
		switch (touch) {
			case 1: // Same row, touching frog
				var which_leaf = end_leaves.whichObjectTouching();
				end_leaves.obj_array[which_leaf].alpha = 0;
				leaves_cleared[which_leaf] = true;
				player_won = check_leaves();
				setTimeout(function () {frog.resetFrogFast()}, 110);
				break;
			case -1: // Same row, not touching
				player_dead = true;
			case 0: // Not on the same row
				break;
		}
		
		/* Handle dying */
		if (player_dead && !wait_respawn) {
			play_dead_sound();
			wait_respawn = true;
			player_dead = false;
			if (--lives) {
				hud_lives[lives].alpha = 0;
				frog.resetFrogFast();
			}
			else {
				show_dead_menu();
				player_dead = false;
			}
		}
		
		/* Handle winning */
		if (player_won) {
			frog.resetFrog();
			score += Math.floor(score_mod * level * 1000);
			score_mod *= 1.1;
			speed_mod *= 1.2;
			level += 1;
			show_level();
			hud_score.text = "Score:"+score;
			player_won = false;
		}
		
		stage.update(event);
	}
	
	/* 
		Welcome screen handle
	*/
	enter_key_handled = false;
	function handleEnterKey() 
	{
		if (enter_key_handled == true) return;
		enter_key_handled = true;
		stage.removeChild(wm_container);
		show_level();
		stage.update();
	}
	
	/* 
		Keypress handling 
	*/
	preventKeypressRepeating = true; // This is going to prevent repeating of keypresses if user holds down a key
	game_paused = true;
	function keyDown(event) 
	{
		event.preventDefault();
		if (!preventKeypressRepeating) return;
		preventKeypressRepeating = false;
		
		if (!event) {
			var event = window.event;
		}
		switch (event.keyCode) {
			case KEYCODE_A:
			case KEYCODE_LEFT:
				if (typeof(frog) != "undefined" && !game_paused)
					frog.moveLeft();
				break;
			case KEYCODE_D:
			case KEYCODE_RIGHT:
				if (typeof(frog) != "undefined" && !game_paused)
					frog.moveRigth();
				break;
			case KEYCODE_W:
			case KEYCODE_UP:
				if (typeof(frog) != "undefined" && !game_paused)
					frog.moveUp();
				break;
			case KEYCODE_S:
			case KEYCODE_DOWN:
				if (typeof(frog) != "undefined" && !game_paused)
					frog.moveDown();
				break;
			case KEYCODE_ENTER:
				handleEnterKey();
				break;
		}
	}
	function keyUp(event) 
	{
		preventKeypressRepeating = true; // Wait for user to release key before allowing another movement
	}
	
	document.addEventListener("keydown", keyDown, false);
	document.addEventListener("keyup", keyUp, false);
	/* End keypress handling */
	