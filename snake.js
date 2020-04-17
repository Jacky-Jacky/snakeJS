

var WALL = -1;
var EMPTY = 0;
var SNAKE = 1;
var FOOD = 2;

var WORLD = [];

var LOOP;
var score = 0;

var snakeCoord;

var woldObject;
var dimensions;
var snakeDirection = [0,1]; //Direction du snake (x,y)

class world{
	constructor(dimensions,delay,walls,food,snake){
		this.dimensions = dimensions;
		this.delay = delay;
		this.walls = walls;
		this.food = food;
		this.snake = snake;
	}
}


var divMenu;
var divGame;
var divLevels;
var divEnd;


window.addEventListener("load",function(){
	
	var b1 = document.getElementById("1");
	b1.addEventListener("click",function(){
		divLevels.style.display = 'none';
		divGame.style.display = 'flex';
		loadLevel("1");
	});

	var b2 = document.getElementById("2");
	b2.addEventListener("click",function(){
		divLevels.style.display = 'none';
		divGame.style.display = 'flex';
		loadLevel("2");
	});

	var b3 = document.getElementById("3");
	b3.addEventListener("click",function(){
		divLevels.style.display = 'none';
		divGame.style.display = 'flex';
		loadLevel("3");
	});

	var b4 = document.getElementById("4");
	b4.addEventListener("click",function(){
		divLevels.style.display = 'none';
		divGame.style.display = 'flex';
		loadLevel("4");
	});


	divMenu = document.getElementById("div-menu");
	divGame = document.getElementById("div-game");
	divLevels = document.getElementById("div-levels");
	divEnd = document.getElementById("div-end");

	divGame.style.display = 'none';
	divEnd.style.display = 'none';
	divLevels.style.display = 'none';


	document.getElementById("load-levels-button").addEventListener("click",function(){
		divMenu.style.display = 'none';
		divLevels.style.display = 'flex';

	});

	document.getElementById("back-button").addEventListener("click",function(){
		divLevels.style.display = 'none';
		divMenu.style.display = 'flex';

	});



	document.getElementById("play-random-button").addEventListener("click",function(){
		divMenu.style.display = 'none';
		divGame.style.display = 'flex';

		if(LOOP){
			clearInterval(LOOP);
		}
		loadLevel("random");
	});

	document.getElementById("back-button-lose").addEventListener("click",function(){
		divEnd.style.display = 'none';
		divMenu.style.display = 'flex';

	});

	//Commande
	document.addEventListener("keydown",function(e){
		if(e.key == "ArrowDown"){
			snakeDirection = [0,1];
		}else if(e.key == "ArrowUp"){
			snakeDirection = [0,-1];
		}else if(e.key == "ArrowRight"){
			snakeDirection = [1,0];
		}else if(e.key == "ArrowLeft"){
			snakeDirection = [-1,0];
		}
		
	});


	
	




});


function loadLevel(idLevel){
	if(idLevel == "random"){
		generateLevel(generateRandomLevel());


	}else{
		var req = new XMLHttpRequest();
		var url = "levels/";
		var data;
		var w;
		req.open("GET", url+idLevel+".json");
		req.addEventListener("error", function() {
		    console.log("Échec de chargement du niveau");
		});
		req.addEventListener("load",function() {
		    if (req.status === 200) {
		      	data = JSON.parse(req.responseText);
		      	dimensions = data.dimensions;
				delay = data.delay;
				walls = data.walls;
				snakeCoord = data.snake;
				food = data.food;
				w = new world(data.dimensions,data.delay,data.walls,data.food,data.snake);
				generateLevel(w);

				

		    } else {
		      	console.log("Erreur " + req.status);
		      	dataHasLoad = false;
		    }
		});
		req.send();
		return data;
	}
	
}






function displayLevel(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var dimCase = [canvas.width/dimensions[0],canvas.height/dimensions[1]];



	for(var i=0;i<dimensions[0];i++){
		for(var j=0;j<dimensions[1];j++){

			if(WORLD[i][j] == EMPTY){
				if((i+j)%2 == 0){
					ctx.strokeStyle = "#009c4e";
					ctx.fillStyle = "#009c4e";
				}else{
					ctx.strokeStyle = "#00de6f";
					ctx.fillStyle = "#00de6f";
				}
				ctx.fillRect(i*dimCase[0],j*dimCase[1],dimCase[0],dimCase[1]);
				
			}else if (WORLD[i][j] == SNAKE){
				ctx.strokeStyle = "blue";
				ctx.fillStyle = "blue";
				ctx.fillRect(i*dimCase[0],j*dimCase[1],dimCase[0],dimCase[1]);

			}else if (WORLD[i][j] == FOOD){
				ctx.strokeStyle = "red";
				ctx.fillStyle = "red";
				ctx.fillRect(i*dimCase[0],j*dimCase[1],dimCase[0],dimCase[1]);

			}else if (WORLD[i][j] == WALL){
				ctx.strokeStyle = "black";
				ctx.fillStyle = "black";
				ctx.fillRect(i*dimCase[0],j*dimCase[1],dimCase[0],dimCase[1]);
			}
			
			

		}
	}
}


function generateLevel(w){
	
	if(w){
		woldObject = w;
		WORLD = []
		//generation du WORLD EMPTY
		for(var i=0;i<w.dimensions[0];i++){
			var tempLigne = [];
			for(var j=0;j<w.dimensions[1];j++){
				tempLigne.push(EMPTY);
			}
			WORLD.push(tempLigne);
		}

		for(var i = 0;i<(w.walls).length;i++){
			WORLD[w.walls[i][0]][w.walls[i][1]] = WALL;
		}


		for(var i = 0;i<w.snake.length;i++){
			WORLD[w.snake[i][0]][w.snake[i][1]] = SNAKE;
		}

		snakeCoord = w.snake;



		WORLD[w.food[0][0]][w.food[0][1]] = FOOD;

		
		displayLevel();
		LOOP = setInterval(loop,w.delay);

	}else{
		console.log("Erreur de chargement du niveau lors de la generation");
	}

}


function moveSnake(){
	if(snakeCoord[0][0]+snakeDirection[0] < 0 || snakeCoord[0][0]+snakeDirection[0] >= dimensions[1] ||snakeCoord[0][1]+snakeDirection[1] < 0 || snakeCoord[0][1]+snakeDirection[1] >= dimensions[1] || WORLD[snakeCoord[0][0]+snakeDirection[0]][snakeCoord[0][1]+snakeDirection[1]] == WALL || WORLD[snakeCoord[0][0]+snakeDirection[0]][snakeCoord[0][1]+snakeDirection[1]] == SNAKE){
		clearInterval(LOOP);
		return false;
	}

	if(WORLD[snakeCoord[0][0]+snakeDirection[0]][snakeCoord[0][1]+snakeDirection[1]] == FOOD){
		score+=1;
		document.getElementById("score").innerHTML = score;
		generateFood();
	}

	//Snake Update
	if(WORLD[snakeCoord[0][0]+snakeDirection[0]][snakeCoord[0][1]+snakeDirection[1]] != FOOD){
		WORLD[snakeCoord[snakeCoord.length-1][0]][snakeCoord[snakeCoord.length-1][1]] = EMPTY;
		snakeCoord.pop();

	}
	
	snakeCoord.unshift([snakeCoord[0][0]+snakeDirection[0],snakeCoord[0][1]+snakeDirection[1]]);
	WORLD[snakeCoord[0][0]][snakeCoord[0][1]] = SNAKE;

	return true;

}


function loop(){

	if(!moveSnake()){
		console.log("Perdu!!! " + score);
		clearInterval(LOOP);
		divGame.style.display = 'none';
		divEnd.style.display = 'flex';
		document.getElementById("end-score").innerHTML = score;
		score = 0;
	}else{
		displayLevel();
		if(Math.random() > 0.95 && woldObject.delay>100){
			console.log("UP");
			clearInterval(LOOP);
			woldObject.delay = woldObject.delay-Math.random()*50;
			LOOP = setInterval(loop,woldObject.delay);
		}
	}
	
}


function generateRandomLevel(){
	var seed = Math.random()*50000+1;
	var delayGen = Math.random()*800+200;
	var d = Math.floor(PerlinNoise.noise(seed, .1, .8)*50+10);
	var dim = [d,d];
	dimensions = dim;
	wallsGen = [];
	foodGen = [];
	snakeGen = [];
	snakeDirection = [-1,0];
	for(var x=0;x<dim[0];x++){
		for(var y=0;y<dim[1];y++){
			var noiseValue = PerlinNoise.noise(seed+x*0.1, seed+y*0.1, .8)
			if(noiseValue > 0.7){
				wallsGen.push([x,y]);
			}
			if(noiseValue>0.6 && noiseValue<0.7 && foodGen.length == 0 && y>dimensions[0]/2 && x>dimensions[0]/2){
				foodGen.push([x,y]);
			}
			if(x>1 && x<dim[0]-1 && noiseValue < 0.5 && PerlinNoise.noise(seed+(x-1)*0.01, seed+y*0.01, .8) && PerlinNoise.noise(seed+(x+1)*0.01, seed+y*0.01, .8)){
				snakeGen = [[x-1,y],[x,y],[x+1,y]];
			}
		}
	}

	if(snakeGen.length == 0 || foodGen.length == 0){
		return generateRandomLevel()
	}

	return new world(dim,delayGen,wallsGen,foodGen,snakeGen);


}


function generateFood(){
	var coord = [Math.floor(Math.random() * WORLD.length),Math.floor(Math.random() * WORLD.length)]
	while(WORLD[coord[0]][coord[1]]!=EMPTY){
		coord = [Math.floor(Math.random() * WORLD.length),Math.floor(Math.random() * WORLD.length)]
	}
	WORLD[coord[0]][coord[1]] = FOOD;
}