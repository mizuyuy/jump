
/* 変数宣言 */
let canvas, g;

let player_x = 0;
let player_y = 0;
let player_img = new Image();
let player_r = 0;
let player_speed = 0;
let accele = 0;

let enemy_x = 0;
let enemy_y = 0;
let enemy_img = new Image();
let enemy_r = 0;
let enemy_speed = 0;

let score = 0;
let scene;
let frame_count;
let bound;

const Scenes = {
  gamemain: "game main",
  gameover: "game over"
};

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
  player_x = 100;
  player_y = 400;
  player_img.src = "./reimu.png";
  player_r = 16;
  player_speed = 0;
  accele = 0;

  enemy_x = 600;
  enemy_y = 400;
  enemy_img.src = "./marisa.png";
  enemy_r = 16;
  enemy_speed = 5;

  score = 0;
  scene = Scenes.gamemain;
  frame_count = 0;
  bound = false;
}

function keydown(e) {
  if(player_speed == 0) {
    player_speed = -20;
  }
  accele = 1.5;
}

function gameloop() {
  update();
  draw();
}

function update() {
  if (scene == Scenes.gamemain){
    player_speed += accele;
    player_y += player_speed;
    if (player_y > 400) {
      player_y = 400;
      player_speed = 0;
      accele = 0;
    }

    enemy_x -= enemy_speed;
    if (enemy_x < -100) {
      enemy_x = 600;
      score += 100;
    }

    //当たり判定
    let diff_x = player_x - enemy_x; 
    let diff_y = player_y - enemy_y;
    let distance = Math.sqrt(diff_x * diff_x + diff_y *   diff_y);
    if (distance < (player_r + enemy_r)) {
      //当たった時
      scene = Scenes.gameover;
      player_speed = -20;
      accele = 0.5;
      frame_count = 0;
    }

  } else if (scene == Scenes.gameover) {
    player_speed += accele;
    player_y += player_speed;

    if (player_x < 20 || player_x > 460) {
      bound = !bound;
    }
    if (bound) {
      player_x += 30;
    } else {
      player_x -= 30;
    }
    enemy_x += enemy_speed;
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
    g.drawImage(
      player_img, 
      player_x - player_img.width/2,
      player_y - player_img.height/2 
    );
    //敵
    g.drawImage(
      enemy_img, 
      enemy_x - enemy_img.width/2,
      enemy_y - enemy_img.height/2 
    );
    //スコア
    g.fillStyle = "rgb(255,255,255)";
    g.font = "16pt Arial";
    var score_label = "SCORE : " + score;
    var score_label_width = g.measureText(score_label).width;
    g.fillText(score_label, 460 - score_label_width, 40);
  } else if (scene == Scenes.gameover) {
    if (frame_count < 120) {
      g.save();
      g.translate(player_x, player_y);
      g.rotate(((frame_count % 30) * Math.PI * 2) / 30);
      g.drawImage(
        player_img, 
        -player_img.width/2,
        -player_img.height/2,
        player_img.width + frame_count,
        player_img.height + frame_count
      );
      g.restore();
    }
    //敵
    g.drawImage(
      enemy_img, 
      enemy_x - enemy_img.width/2,
      enemy_y - enemy_img.height/2 
    );
    //ゲームオーバ
    g.fillStyle = "rgb(255,255,255)";
    g.font = "48pt Arial";
    var score_label = "GAME OVER";
    var score_label_width = g.measureText(score_label).width;
    g.fillText(score_label, 240 - score_label_width / 2, 240);
  }
}
