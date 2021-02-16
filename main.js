//キャンバス
var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

var canvasWidth = 600;
var canvasHeight = 550;
canvas.width=canvasWidth;
canvas.height=canvasHeight;

//ゲームスピード
const gameSpeed = 1000/60;

//初期化
function init(){
  star[0] = new Star(0,0);
  star[1] = new Star(420,3);
  star[2] = new Star(380,1);
  star[3] = new Star(300,2);
}

//オブジェクト
var star = [];
var key = [];
var tama =[];
var jiki = new Jiki();
var enemy = [];
var enemytama =[];
var score =0;
var exp = [];
var item = [];
var game;
var bossflag = false;
var boss =[];
var itemkill;
var bossgekihaflag;
var nanido = 0;
var nanidoAria = document.getElementById("nanido");
var easy = document.getElementById("easy");
var normal = document.getElementById("normal");
var hard = document.getElementById("hard");
var eDown = document.getElementById("e");
var nDown = document.getElementById("n");
var hDown = document.getElementById("h");
var stageCount=0;
var enemyTamaKankaku=40;
var bossTamaKankaku=220;
var bossTamaKankaku2=8;
var bossEnemy=3;

//メインループ
function gameloop() {
if(bossflag)boss.push(new Boss((canvasWidth/2)<<8,0,0,200));
  //移動
  updateobj(star);
  updateobj(tama);
  updateobj(enemy);
  jiki.update();
  updateobj(enemytama);
  updateobj(exp);
  updateobj(item);
  updateobj(boss);

  //描画
  if (jiki.flag==0) {
    if(bosssen)ctx.fillStyle ="black";
    else if(enemypar<=45)ctx.fillStyle ="#FF9933";
    else ctx.fillStyle ="#00FFFF";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle ="green";
    ctx.fillRect(0,canvasHeight-200,canvasWidth,canvasHeight-150);
    ctx.fillStyle ="lime";
    ctx.fillRect(0,canvasHeight-150,canvasWidth,canvasHeight);
  }
  else {
    ctx.fillStyle ="red";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
  }

  //敵出現
  if(!bosssen){
    if(rand(0,enemypar) ==1)
    enemy.push(new Enemy(rand(0,canvasWidth)<<8,0,0,rand(300,1200)))
  }

  //背景の更新
  if(rand(0,80)==1)
  star.push(new Star(rand(300,500),rand(1,2)));
  if(rand(0,100)==1)
  star.push(new Star(rand(350,550),rand(3,4)));

  //各オブジェクトの描画
  for(var i = star.length-1;i>=0;i--)star[i].draw();
  for(var i = 0;i<tama.length;i++)tama[i].draw();
  jiki.draw();
  for(var i = 0;i<enemy.length;i++)enemy[i].draw();
  for(var i = 0;i<enemytama.length;i++)enemytama[i].draw();
  for(var i = 0;i<exp.length;i++)exp[i].draw();
  for(var i = 0;i<item.length;i++)item[i].draw();
  for(var i = 0;i<boss.length;i++)boss[i].draw();

  //ボスHP表示
  if (bosssen) {
    var sz = (canvasWidth-20)*boss[0].bosslife/boss[0].mbosslife;
    var sz2 = (canvasWidth-20);

    ctx.fillStyle = "rgba(255,0,0,0.5)"
    ctx.fillRect(10,10,sz,10);
    ctx.strokeStyle = "rgba(255,0,0,0.9)"
    ctx.strokeRect(10,10,sz2,10);
  }

  //デバッグ
  var DEBUG =true;

  if (DEBUG) {
    ctx.font = "20px 'Impact'";
    if(bosssen)ctx.fillStyle = "white";
    else ctx.fillStyle = "black";
    ctx.fillText("残　　" + jiki.life,20,20);
    ctx.fillText("score  " + score,180,20);
  }
}

window.onload = openstart();
