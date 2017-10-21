// Set up canvas
var gameCanvas = document.getElementById("game"),
    ctx = gameCanvas.getContext("2d");

var view = {
  coins: document.getElementById("coins"),
};


// Main game object
var game = {
  FPS: 30,
  lastFrameTime: 0, // Variable for rAF Polyfill
  time: 0, // Running time in seconds
  enemies: [],
  spawnDelay: 2, // In seconds
  maxEnemiesAtOnce: 10,
  lastSpawnTime: 0,
  spawnEnemy: function(){
    if(this.enemies.length < this.maxEnemiesAtOnce){
      this.enemies.push(new Enemy(getRandInt(30, 370), 25, 50, 50, 2, 100));
    }
  },
  click: function(x, y){
    for(var i in this.enemies){
      var enemy = this.enemies[i];
      if((x >= enemy.x && x <= enemy.x + enemy.w)
      && (y >= enemy.y && y <= enemy.y + enemy.h)){
        player.hitEnemy(enemy);
        break;
      }
    }
  }
};

var player = {
  coins: 0,
  attackStr: 100,
  hitEnemy: function(enemyObj){
    enemyObj.HP -= this.attackStr;

    if (enemyObj.HP <= 0){
      enemyObj.die();
    }
  }
};

//== CONTROLS ==
gameCanvas.addEventListener("mousedown", function(ev){
  game.click(ev.layerX, ev.layerY);
});

// Enemy factory function
var Enemy = function(x, y, h, w, spd, maxHP){
  this.id = game.enemies.length;

  this.x = x; this.y = y; this.h = h; this.w = w; this.spd = spd;
  this.maxHP = maxHP;
  this.HP = maxHP;

  this.die = function(){
    for(var i in game.enemies){
      enemy = game.enemies[i];
      if (enemy.id == this.id) {
        game.enemies.splice(i, 1);
		player.coins++;
        break;
      }
    }
  }
};

// TEST

//

(function gameLoop(time){                    // Game loop
  requestAnimationFrame(gameLoop);           //
  //---------------------------Execute every second---------------------------
  if(game.time <= time/1000){                // Execute every second
    game.time += 1;                          //
    // Update
    if(game.lastSpawnTime + game.spawnDelay <= game.time){ //
      game.lastSpawnTime += game.spawnDelay;               // Spawn enemy
      game.spawnEnemy();                                   //
    };
  }
  //---------------------------Execute every frame-----------------------------
  if(game.lastFrameTime <= time){            //
    game.lastFrameTime += 1000 / game.FPS;   //

    // Update coins
    view.coins.innerHTML = player.coins;

    ctx.clearRect(0, 0, 700, 700);

    //Enemies update
    for(var i in game.enemies){
      var enemy = game.enemies[i];
      if(enemy.y >= gameCanvas.height + enemy.h * 3){
        game.enemies.splice(i, 1);
        continue;
      }

      enemy.y += enemy.spd;
      ctx.fillRect(enemy.x, enemy.y, enemy.h, enemy.w);
    }
  }
})();

// == HELPER FUNCTIONS ==
function getRandInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
