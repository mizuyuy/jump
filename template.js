/* オブジェクト宣言 */
const Scenes = {
  gamemain: "game main",
  gameover: "game over"
};

/* クラス宣言 */
class Splite {
  image = new Image();
  posx = 0;
  posy = 0;
  speed = 0;
  accele = 0;
  r = 0;

  draw(g) {
    g.drawImage(
      this.image,
      this.posx - this.image.width/2,
      this.posy - this.image.height/2
    );
  }
};

/* 変数宣言 */
let canvas, g;

let player;
let enemy;

let score = 0;
let scene;
let frame_count;
let bound;

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  player = new Splite();
  player.posx = 100;
  player.posy = 400;
  player.r = 16;
  player.image.src = "./reimu.png";
  player.speed = 0;
  player.accele = 0;

  enemy = new Splite();
  enemy.posx = 600;
  enemy.posy = 400;
  enemy.r = 16;
  enemy.image.src = "./marisa.png";
  enemy.speed = 5;
  enemy.accele = 0;

  score = 0;
  scene = Scenes.gamemain;
  frame_count = 0;
  bound = false;
}

function keydown(e) {
  if(player.speed == 0) {
    player.speed = -20;
  }
  player.accele = 1.5;
}

function gameloop() {
  update();
  draw();
}

function update() {
  if (scene == Scenes.gamemain){
    player.speed += player.accele;
    player.posy += player.speed;
    if (player.posy > 400) {
      player.posy = 400;
      player.speed = 0;
      player.accele = 0;
    }

    enemy.posx -= enemy.speed;
    if (enemy.posx < -100) {
      enemy.posx = 600;
      score += 100;
    }

    //当たり判定
    let diff_x = player.posx - enemy.posx; 
    let diff_y = player.posy - enemy.posy;
    let distance = Math.sqrt(diff_x * diff_x + diff_y *   diff_y);
    if (distance < (player.r + enemy.r)) {
      //当たった時
      scene = Scenes.gameover;
      player.speed = -20;
      player.accele = 0.5;
      frame_count = 0;
    }

  } else if (scene == Scenes.gameover) {
    player.speed += player.accele;
    player.posy += player.speed;

    if (player.posx < 20 || player.posx > 460) {
      bound = !bound;
    }
    if (bound) {
      player.posx += 30;
    } else {
      player.posx -= 30;
    }
    enemy.posx -= enemy.speed;
  } else {
    //想定外
  }

  frame_count++;
}

function draw() {
  //背景
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(0, 0, 480, 480);
  if (scene == Scenes.gamemain) {
    //プレイヤー
    player.draw(g);
    //敵
    enemy.draw(g);
    //スコア
    g.fillStyle = "rgb(255,255,255)";
    g.font = "16pt Arial";
    var score_label = "SCORE : " + score;
    var score_label_width = g.measureText(score_label).width;
    g.fillText(score_label, 460 - score_label_width, 40);
  } else if (scene == Scenes.gameover) {
    if (frame_count < 120) {
      g.save();
      g.translate(player.posx, player.posy);
      g.rotate(((frame_count % 30) * Math.PI * 2) / 30);
      g.drawImage(
        player.image, 
        -player.image.width/2,
        -player.image.height/2,
        player.image.width + frame_count,
        player.image.height + frame_count
      );
      g.restore();
    }
    //敵
    enemy.draw(g);

    //ゲームオーバ
    g.fillStyle = "rgb(255,255,255)";
    g.font = "48pt Arial";
    var score_label = "GAME OVER";
    var score_label_width = g.measureText(score_label).width;
    g.fillText(score_label, 240 - score_label_width / 2, 240);
  }
}
