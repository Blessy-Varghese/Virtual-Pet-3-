//Create variables here
var dog, happyDog, database, foodS;
var fedTime, lastFed, foodObj,foodStock;
var gameState;
var feed,addfood;
function preload()
{
  //load images here
  dogImage=loadImage("Dog.png");
  happyDogImage=loadImage("happydog.png");
  bedroom=loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
}

function setup() {
  createCanvas(1000, 600);
  
  database=firebase.database();

  foodObj=new Food();

  dog=createSprite(700,200);
  dog.addImage(dogImage);
  dog.scale=0.3;

  var foodStock=database.ref("Food");
  foodStock.on("value",function(data){
  foodS=data.val();
  });

  var feedTime=database.ref("FeedTime");
  feedTime.on("value", function(data){
  lastFed=data.val();
  });

  feed=createButton("Feed The Dog");
  feed.position(600,50);
  feed.mousePressed(feedDog);

 addfood=createButton("Add Food");
  addfood.position(300,50);
  addfood.mousePressed(addFood);

  //to read gameState from db
  var gameStateRef=database.ref("gameState");
  gameStateRef.on("value",function(data){
  gameState=data.val();
  });

}


function draw() {  
background(46, 139, 87);
drawSprites();


currentTime=hour();

if(currentTime===lastFed+1){
  foodObj.garden();
  update("playing");
 

} else if(currentTime===lastFed+2){
  foodObj.bedroom();
  update("sleeping");
 
  
} else if(currentTime>lastFed+2 && currentTime<lastFed+4){
  foodObj.washroom();
  update("bathing");
 
  
} else{
  update("hungry");
  foodObj.display();
}

if(gameState!="hungry"){
  feed.hide();
  addfood.hide();
  dog.remove();
} else{
  feed.show();
  addfood.show();
  dog.addImage(dogImage);
}

foodObj.updateFoodStock(foodS);

  fill(255);
  textSize(15);
  if(lastFed>=12){
    text("Last fed : "+lastFed%12 + " PM",450,30);
  }else if(lastFed==0){
    text("Last fed : 12 AM",450,30);
  }else if(lastFed<=12){
    text("Last fed : "+lastFed + " AM",450,30);
  }

  //foodObj.display();
}


function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
  
}

function feedDog(){
  dog.addImage(happyDogImage);
if(foodObj.getFoodStock()>0){
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });
}
}

function update(state){
  database.ref("/").update({
      gameState:state
    });
}
