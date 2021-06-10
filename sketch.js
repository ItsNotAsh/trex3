var PLAY = 1;
var END = 0;
var TREVERCE = 2
var gameState = PLAY;

var trex;
var trex_run, trex_run_r;
var trex_collided, trex_collided_r;

var ground, groundImg, invisGround;

var cloudGroup, cloudGroupR, cloudImg;
var cacti, cactiR, cactiGroup, cactiGroupR;
var cacti1, cacti2, cacti3, cacti4, cacti5, cacti6;

var score;
var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload(){

  trex_run = loadAnimation("trex/trex1.png", "trex/trex2.png","trex/trex3.png");
  trex_collided = loadAnimation("trex/trex_collided.png");
  
  trex_run_r = loadAnimation("trexR/trex1_r.png", "trexR/trex2_r.png", "trexR/trex3_r.png");
  trex_collided_r = loadAnimation("trexR/trex_collided_r.png");

  groundImg = loadImage("elements/ground.png");
  cloudImg = loadImage("elements/cloud.png");

  cacti1 = loadImage("cacti/cacti1.png");
  cacti2 = loadImage("cacti/cacti2.png");
  cacti3 = loadImage("cacti/cacti3.png");
  cacti4 = loadImage("cacti/cacti4.png");
  cacti5 = loadImage("cacti/cacti5.png");
  cacti6 = loadImage("cacti/cacti6.png");

  restartImg = loadImage("elements/restart.png");
  gameOverImg = loadImage("elements/gameOver.png");

  jumpSound = loadSound("sounds/jump.mp3");
  dieSound = loadSound("sounds/die.mp3");
  checkPointSound = loadSound("sounds/checkPoint.mp3");

}

function setup(){
    createCanvas(1050, 500);
    
  trex = createSprite(70, 430, 20, 50);
  trex.addAnimation("running", trex_run);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("running_r", trex_run_r);
  trex.scale = 0.9;

  ground = createSprite(525, 480, 1050, 10);
  ground.addImage("ground", groundImg);

  invisGround = createSprite(525, 490, 1050, 5);
  invisGround.visible = false;

  gameOver = createSprite(550, 250);
  gameOver.addImage(gameOverImg);

  restart = createSprite(550, 300);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.7
  restart.scale = 0.7

  cactiGroup = createGroup();
  cloudGroup = createGroup();
  cactiGroupR = createGroup();
  cloudGroupR = createGroup();

  score = 0;

}

function draw(){
    background(180);

    if(score > 100 && score < 200){
      background("#ff7d7a");
   }

    stroke("black");
    fill("black");
    textSize(20);
    text("Score: "+ score, 950, 50)

    if(gameState === PLAY){

      gameOver.visible = false;
      restart.visible = false;

      ground.velocityX = -(4 + 3* score/100)

      score += Math.round(getFrameRate()/60);

      if(score> 0 && score%100 === 0){
         checkPointSound.play();
      }

      if(ground.x < 0){
         ground.x = ground.width/2;
      }

      if(keyDown("space")&& trex.y >= 250){
         trex.velocityY = -12;
         jumpSound.play();
      }

      trex.velocityY = trex.velocityY + 0.8

      spawnCacti();
      spawnClouds();

      cactiGroupR.destroyEach();
      cloudGroupR.destroyEach();

      if(score> 100 && score < 200){
         gameState = TREVERCE;
      }      

      if(cactiGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
      }

    }
    else if(gameState === TREVERCE){

      trex.changeAnimation("running_r", trex_run_r);
      trex.x = 950;

      ground.velocityX = +(4 + 3* score/100);
      if(ground.x > 500){
        ground.x = 100
      }

      if(keyDown("space")&& trex.y >= 250){
        trex.velocityY = -12;
        jumpSound.play();
     }

     trex.velocityY = trex.velocityY + 0.8

     score += Math.round(getFrameRate()/60);

      if(score> 0 && score%100 === 0){
         checkPointSound.play();
      }

      if(score> 200 && score < 300){
        gameState = PLAY
      }

      /*if(cactiGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
      }*/

      spawnCactiR();
      spawnCloudsR();

      cactiGroup.destroyEach();
      cloudGroup.destroyEach();

    }
    else if(gameState === END){

      gameOver.visible = true;
      restart.visible = true;

      trex.changeAnimation("collided", trex_collided)

      if(mousePressedOver(restart)){
         reset();
      }

      ground.velocityX = 0;
      trex.velocityY = 0;

      cactiGroup.setLifetimeEach(-1);
      cloudGroup.setLifetimeEach(-1);

      cactiGroup.setVelocityXEach(0);
      cloudGroup.setVelocityXEach(0);
    }

    trex.collide(invisGround);    

    drawSprites();
}

function reset(){

  gameState = PLAY
  cactiGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trex_run);
  score = 0;

}

function spawnCacti(){
  if (frameCount % 150 === 0){
    cacti = createSprite(1050,460,10,40);
    cacti.velocityX = -(4 + score/100);
    
     //generate random obstacles
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: cacti.addImage(cacti1);
               break;
       case 2: cacti.addImage(cacti2);
               break;
       case 3: cacti.addImage(cacti3);
               break;
       case 4: cacti.addImage(cacti4);
               break;
       case 5: cacti.addImage(cacti5);
               break;
       case 6: cacti.addImage(cacti6);
               break;
       default: break;
     }
    
     //assign scale and lifetime to the obstacle           
     cacti.scale = 0.9;
     cacti.lifetime = 600;
    
    //add each obstacle to the group
     cactiGroup.add(cacti);
  }
 }

 function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloud = createSprite(1050,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImg);
    //cloud.scale = 0.10;
    cloud.velocityX = -4;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudGroup.add(cloud);
  }
}

function spawnCactiR(){
  if (frameCount % 100 === 0){
    cactiR = createSprite(0,460,10,40);
    cactiR.velocityX = +(4 + score/100);
    
     //generate random obstacles
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: cactiR.addImage(cacti1);
               break;
       case 2: cactiR.addImage(cacti2);
               break;
       case 3: cactiR.addImage(cacti3);
               break;
       case 4: cactiR.addImage(cacti4);
               break;
       case 5: cactiR.addImage(cacti5);
               break;
       case 6: cactiR.addImage(cacti6);
               break;
       default: break;
     }
    
     //assign scale and lifetime to the obstacle           
     cactiR.scale = 0.9;
     cactiR.lifetime = 600;
    
    //add each obstacle to the group
     cactiGroupR.add(cactiR);
  }
 }

 function spawnCloudsR() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloudR = createSprite(0,120,40,10);
    cloudR.y = Math.round(random(80,120));
    cloudR.addImage(cloudImg);
    //cloud.scale = 0.10;
    cloudR.velocityX = +4;
    
     //assign lifetime to the variable
    cloudR.lifetime = 600;
    
    //adjust the depth
    cloudR.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudGroupR.add(cloudR);
  }
}