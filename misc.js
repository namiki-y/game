//
//misc.js その他
//

//ステージ
var stage;
var enemypar = 60;

//ランダム
function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

//キーボード押されたとき
document.onkeydown = function(e){
  key[e.keyCode] = true;
  if(e.keyCode ==40)event.preventDefault();
}
//キーボード離したとき
document.onkeyup = function(e){
  key[e.keyCode] = false;
}

//星の数
const starMax = 3;

//背景
class Star {
  constructor(hx,i){
    this.haikeitype = i;
    if(this.haikeitype==0){
      this.w = 88;
      this.h = 45;
      this.x = 80<<8;
      this.y = 330<<8;
      this.vy = -20;
      this.newx = 420;
    }
    else if(this.haikeitype==1){
      this.w = 8;
      this.h = 15;
      this.x = hx<<8;
      this.y = 340<<8;
      this.vy = -20;
    }
    else if (this.haikeitype==2) {
      this.w = 6;
      this.h = 12;
      this.x = hx<<8;
      this.y = 360<<8;
      this.vy = -20;
    }
    else if(this.haikeitype==3){
      this.newx = hx;
      this.w = 38;
      this.h = 20;
      this.x = canvasWidth-this.w-this.newx<<8;
      this.y = 330<<8;
      this.vy = -20;
    }
    else if(this.haikeitype==4){
      this.newx = hx;
      this.w = 28;
      this.h = 30;
      this.x = canvasWidth-this.w-this.newx<<8;
      this.y = 330<<8;
      this.vy = -20;
    }
  }

  draw(){
    var x = this.x>>8;
    var y = this.y>>8;
    if (this.haikeitype==0)ctx.drawImage(miseimg,x,y,this.w,this.h);
    else if(this.haikeitype==1||this.haikeitype==2)ctx.drawImage(kiimg,x,y,this.w,this.h);
    else if(this.haikeitype==3)ctx.drawImage(ie1img,x,y,this.w,this.h);
    else if(this.haikeitype==4)ctx.drawImage(ie2img,x,y,this.w,this.h);
  }

  update(){
    if(this.haikeitype==0||this.haikeitype==3||this.haikeitype==4)this.x = canvasWidth-this.w-this.newx<<8;
    this.y += this.vy;
    this.w *=1.006;
    this.h *=1.006;
    if((this.y>>8)+this.h>=550)this.kill = true;
  }
}

//共通
class CharaBase {
  constructor(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kill = false;
  }

  update(){
    this.x += this.vx;
    this.y += this.vy;

    if(this.x<0 || this.x>canvasWidth<<8
      || this.y<0 || this.y>canvasHeight<<8)this.kill = true;
  }
}

//アイテム
class Item extends CharaBase {
  constructor(x,y,vx,vy,t){
    super(x,y,vx,vy);
    this.itemtype = t;
    this.itemkill = setTimeout(killer,5000);

    if(this.itemtype==1){
      this.w = 35;
      this.h = 20;
    }
    else if (this.itemtype==2) {
      this.w = 20;
      this.h = 40;
    }
    else if (this.itemtype==3) {
      this.w = 40;
      this.h = 40;
    }
  }

  draw(){
    if(this.itemtype==1)ctx.drawImage(item1img,this.x>>8,this.y>>8,this.w,this.h);
    else if (this.itemtype==2) ctx.drawImage(item2img,this.x>>8,this.y>>8,this.w,this.h);
    else if (this.itemtype==3) ctx.drawImage(tamaimg,this.x>>8,this.y>>8,this.w,this.h);
  }

  update(){
    super.update();
    if(checkhit2(this.x,this.y,this.w,this.h,  jiki.x,jiki.y,jiki.w,jiki.h)){
      if(this.itemtype==1){
        jiki.maskflag = true;
        clearTimeout(jiki.maskend);
        jiki.maskend = setTimeout(maskender,15000);
        this.kill=true;
        clearTimeout(this.itemkill);
      }
      else if (this.itemtype==2) {
        if(jiki.life<5)jiki.life++;
        this.kill=true;
        clearTimeout(this.itemkill);
      }
      else if (this.itemtype==3) {
        tamakazu = 2;
        this.kill=true;
        clearTimeout(this.itemkill);
      }
    }
  }
}

function maskender(){
  jiki.maskflag = false;
}

function killer(){
  item[0].kill = true;
}

//爆発
class Exp extends CharaBase {
  constructor(x,y,vx,vy,w){
    super(x,y,vx,vy);
    this.w = w;
    this.count = this.counta = 0;
  }

  draw(){
    ctx.drawImage(eximg[this.count],this.x>>8,this.y>>8,this.w,this.w)

  }

  update(){
    super.update();

    this.counta++;
    if(this.counta == 2){
      this.count++;
      this.counta = 0;
    if(this.count ==11)this.kill=true;
  }
  }
}

//爆発2
function expl(x,y,vx,vy,w,h){
  for(var i = 0; i< 10; i++){
    var evx = vx+ (rand(-h,h)<<5);
    var evy = vy+ (rand(-h,h)<<5);
    exp.push(new Exp(x,y,evx,evy,w))
  }
}

function updateobj(obj) {
  for(var i = obj.length-1;i>=0;i--){
    obj[i].update();
    if(obj[i].kill)obj.splice(i,1);
  }
}

//当たり判定
function checkhit(x1,y1,r1, x2,y2,r2){
  //円同士
  var a =(x1-x2)>>8;
  var b =(y1-y2)>>8;
  var r =r1+r2;

  return r*r >= a*a+b*b;
}

function checkhit2(x1,y1,w1,h1, x2,y2,w2,h2){
  //矩形同士
  var left1   = x1>>8;
  var right1  = left1+w1;
  var top1    = y1>>8;
  var bottom1 = top1+h1;

  var left2   = x2>>8;
  var right2  = left2+w2;
  var top2    = y2>>8;
  var bottom2 = top2+h2;

  return(
    left1   <= right2 &&
    right1  >= left2 &&
    top1    <= bottom2 &&
    bottom1 >= top2
  )
}

//ゲーム開始
function gamestart(){
  nanidoAria.style.display="none";
  //難易度の設定
  if (nanido==0) {
    enemypar=80;
    enemyTamaKankaku = 60;
    bossTamaKankaku = 320;
    bossTamaKankaku2=20;
    bossEnemy=1;
  }
  else if (nanido==1) {
    enemypar=70;
    enemyTamaKankaku=50;
    bossTamaKankaku = 270;
    bossTamaKankaku2=15;
    bossEnemy=2;
  }
  else{
    enemypar=60;
    enemyTamaKankaku=40;
    bossTamaKankaku=220;
    bossTamaKankaku2=8;
    bossEnemy=3;
  }

  clearInterval(game);
  bgm.volume = 0.5;
  bgm.loop = true;
  bgm.play();
  document.getElementById("myCanvas").removeEventListener('click',gamestart);
  game = setInterval(gameloop,gameSpeed);
  stage = setInterval(stageikou,30000);
　document.addEventListener("touchmove", mobile_no_scroll, { passive: false });
}

//ゲーム終了
function gameend(){
  clearInterval(game);
  clearInterval(stage);
  bgm.pause();
  bgm.currentTime = 0;
  init();
  game = setInterval(gameOver,gameSpeed);
  canvas.addEventListener('click',openstart);

  if(score>highscore)localStorage.setItem("highScore-ysgame01",score);
}

//スタート画面表示
function openstart(){
  clearInterval(game);
  canvas.removeEventListener('click',openstart);
  gameinit();
  init();
  game = setInterval(start,gameSpeed);

  //記録
  highscore = Number(localStorage.getItem("highScore-ysgame01"));
  if(localStorage.getItem("bossGekiha-ysgame01-easy")) bossgekiha = "EASY CLEAR<br>";
  if(localStorage.getItem("bossGekiha-ysgame01-normal")) bossgekiha += "NORMAL CLEAR<br>";
  if(localStorage.getItem("bossGekiha-ysgame01-hard")) bossgekiha += "HARD CLEAR";

  document.getElementById('highscore').innerHTML = "HIGHSCORE：" + highscore.toLocaleString();
  document.getElementById('boss').innerHTML = bossgekiha;

  if(nanido==0){
    easy.style.display="block";
    eDown.style.display="inline";
  }
  else if (nanido==1){
    normal.style.display="block";
    nDown.style.display="inline";
  }
  else {
    hard.style.display="block";
    hDown.style.display="inline";
  }

  nanidoAria.style.display="block";
  nanidoAria.addEventListener("click",nanidoSentaku);
}

//難易度
function nanidoSentaku(){
  nanidoAria.removeEventListener("click",nanidoSentaku);
  easy.style.display = normal.style.display = hard.style.display = "block";
  eDown.style.display = nDown.style.display = hDown.style.display="none";

  easy.addEventListener("click",easySelect);
  normal.addEventListener("click",normalSelect);
  hard.addEventListener("click",hardSelect);
}

function easySelect(){
  nanido=0;

  normal.style.display="none";
  hard.style.display="none";
  eDown.style.display ="inline";

  easy.removeEventListener("click",easySelect);
  normal.removeEventListener("click",normalSelect);
  hard.removeEventListener("click",hardSelect);

  setTimeout(function(){nanidoAria.addEventListener("click",nanidoSentaku);},500);
}

function normalSelect(){
    nanido=1;

    easy.style.display="none";
    hard.style.display="none";
    nDown.style.display ="inline";

    easy.removeEventListener("click",easySelect);
    normal.removeEventListener("click",normalSelect);
    hard.removeEventListener("click",hardSelect);

    setTimeout(function(){nanidoAria.addEventListener("click",nanidoSentaku);},500);
}

function hardSelect(){
    nanido=2;

    normal.style.display="none";
    easy.style.display="none";
    hDown.style.display ="inline";

    easy.removeEventListener("click",easySelect);
    normal.removeEventListener("click",normalSelect);
    hard.removeEventListener("click",hardSelect);

    setTimeout(function(){nanidoAria.addEventListener("click",nanidoSentaku);},500);
}


//スタート画面
function start(){
  canvas.addEventListener('click',gamestart);
  ctx.font = "40px 'Impact'";
  ctx.fillStyle ="#00FFFF";
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle ="green";
  ctx.fillRect(0,canvasHeight-200,canvasWidth,canvasHeight-150);
  ctx.fillStyle ="lime";
  ctx.fillRect(0,canvasHeight-150,canvasWidth,canvasHeight);
  ctx.drawImage(miseimg,30,canvasHeight-250,250,140);
  ctx.drawImage(kiimg,canvasWidth-150,canvasHeight-300,120,180);
  ctx.drawImage(kiimg,canvasWidth-250,canvasHeight-200,120,180);

  ctx.fillStyle = "black";
  var s = "click   START!";
  var w = ctx.measureText(s).width;
  var x = canvasWidth/2 - w/2;
  var y = 100;
  ctx.fillText(s,x,y);
}

//ゲームオーバー
function gameOver(){
  ctx.font = "30px 'Impact'";
  ctx.fillStyle ="#00FFFF";
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle ="green";
  ctx.fillRect(0,canvasHeight-200,canvasWidth,canvasHeight-150);
  ctx.fillStyle ="lime";
  ctx.fillRect(0,canvasHeight-150,canvasWidth,canvasHeight);
  ctx.drawImage(miseimg,30,canvasHeight-250,250,140);
  ctx.drawImage(kiimg,canvasWidth-150,canvasHeight-300,120,180);
  ctx.drawImage(kiimg,canvasWidth-250,canvasHeight-200,120,180);


  ctx.fillStyle = "black";
  var s = "GAME OVER";
  var w = ctx.measureText(s).width;
  var x = canvasWidth/2 - w/2;
  var y = 100;
  ctx.fillText(s,x,y);

  s = "score  "+score;
  w = ctx.measureText(s).width;
  x = canvasWidth/2 - w/2;
  y =150;
  ctx.fillText(s,x,y);
}

//クリア
function gameClear(){
  clearInterval(game);
  clearInterval(stage);
  bgm.pause();
  bgm.currentTime = 0;
  init();
  canvas.addEventListener('click',openstart);
  game = setInterval(clearGamen,gameSpeed);

  if(score>highscore)localStorage.setItem("highScore-ysgame01",score);
  if(nanido == 0 && bossgekihaflag )localStorage.setItem("bossGekiha-ysgame01-easy",true);
  else if (nanido == 1 && bossgekihaflag) localStorage.setItem("bossGekiha-ysgame01-normal",true);
  else if (nanido == 2 && bossgekihaflag) localStorage.setItem("bossGekiha-ysgame01-hard",true);
}

function clearGamen(){
  ctx.fillStyle="white";
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  ctx.drawImage(clearimg,0,0,canvasWidth,canvasHeight);

  ctx.font = "60px 'Impact'";
  ctx.fillStyle="black";
  s = "score  "+score;
  w = ctx.measureText(s).width;
  x = canvasWidth/2 - w/2;
  y =320;
  ctx.fillText(s,x,y);
}

//初期化
function gameinit(){
  star = [];
  key = [];
  tama =[];
  enemy = [];
  enemytama =[];
  score =0;
  exp = [];
  enemypar = 60;
  delete jiki;
  jiki = new Jiki;
  boss = [];
  item = [];
  bossflag = false;
  tamakazu = 1;
  bosssen=false;
  stageCount=0;
}

//スマホ対応
var hasshabutton = document.getElementById("ctrlbutton");
var idoubutton = document.getElementById("movebutton");

function hassha() {
  key[17] = true;
}

function hasshastop() {
  key[17] = false;
}

hasshabutton.addEventListener("touchstart",hassha);
hasshabutton.addEventListener("touchend",hasshastop);

function idou() {
  event.preventDefault();
  var touchObject = event.changedTouches[0] ;
	var touchX = touchObject.pageX ;
	var touchY = touchObject.pageY ;

	// 要素の位置を取得
	var clientRect = idoubutton.getBoundingClientRect() ;
	var positionX = clientRect.left + window.pageXOffset ;
	var positionY = clientRect.top + window.pageYOffset ;

	// 要素内におけるタッチ位置を計算
	var x = touchX - positionX ;
	var y = touchY - positionY ;

  if(x<=37)key[37] = true;
  else key[37] = false;
  if(x>=73)key[39] = true;
  else key[39] = false;

  if(y<=37)key[38] = true;
  else key[38] = false;
  if(y>73)key[40] = true;
  else key[40] = false;
}

function idoustop() {
  key[37] = key[38] = key[39] = key[40] = false;
}

idoubutton.addEventListener("touchstart",idou);
idoubutton.addEventListener("touchmove",idou);
idoubutton.addEventListener("touchend",idoustop);

var highscore;
var bossgekiha="";

//ステージ移行
function stageikou(){
  enemypar-=5;
  stageCount++;
  if(stageCount==5){
    bossflag=true;
    bosssen=true;
  }
}

function mobile_no_scroll(event) {
    // ２本指での操作の場合
    if (event.touches.length >= 2) {
        // デフォルトの動作をさせない
        event.preventDefault();
    }
}
