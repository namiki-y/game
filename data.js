//
//data.js データ
//

//読込
var miseimg = new Image();
miseimg.src ="image/mise.png"
var ie1img = new Image();
ie1img.src ="image/ie1.png"
var ie2img = new Image();
ie2img.src ="image/ie2.png"
var kiimg = new Image();
kiimg.src ="image/ki.png"
var meimg = new Image();
meimg.src ="image/図2.png"
var maskedimg = new Image();
maskedimg.src = "image/masked.png"
var enimg = new Image();
enimg.src ="image/netu.png"
var ensekiimg = new Image();
ensekiimg.src = "image/seki.png"
var enkushamiimg = new Image();
enkushamiimg.src = "image/kushami.png"
var tamaimg = new Image();
tamaimg.src = "image/tyusha.png"
var enemytamaimg = new Image();
enemytamaimg.src ="image/virus.png"
var item1img = new Image();
item1img.src ="image/mask.png"
var item2img = new Image();
item2img.src ="image/shoudoku.png"
var clearimg = new Image();
clearimg.src ="image/clear.png"
var bgm = new Audio();
bgm.src = "sound/Watch_Me!_Watch_Watch_Me!_.mp3"
var sound0 = new Audio();
sound0.src = "sound/戦隊被弾_2.mp3"
var sound1 = new Audio();
sound1.src = "sound/HP回復.mp3"
var sound2 = new Audio();
sound2.src = "sound/破滅・壊滅的なワンショット音.mp3"

var exlist = [
  "image/exp1.png",
  "image/exp2.png",
  "image/exp3.png",
  "image/exp4.png",
  "image/exp5.png",
  "image/exp6.png",
  "image/exp7.png",
  "image/exp8.png",
  "image/exp9.png",
  "image/exp10.png",
  "image/exp11.png",
]

var eximg = [];
for(var i = 0;i<exlist.length;i++){
  var image = new Image();
  image.src = exlist[i];
  eximg.push(image);
}
