//
//jiki.js 自機関連
//

//自機

class Jiki {
  constructor(){
    this.w =this.h = 50;
    this.x = (canvasWidth/2-this.w/2)<<8;
    this.y = canvasHeight - 70<<8;
    this.r = 5;
    this.speed = 768;
    this.reload = 0;
    this.damage = 0;
    this.flag = 0;
    this.count = 0;
    this.life = 3;
    this.maskflag = false;
    this.mask;
  }

  draw(){
    if(this.damage>0 && (this.count&1))return;
    if (this.maskflag)ctx.drawImage(maskedimg,this.x>>8,this.y>>8,this.w,this.h);
    else ctx.drawImage(meimg,this.x>>8,this.y>>8,this.w,this.h);
  }

  update(){
    this.count += 0.2;
    if(this.damage>0)this.damage--;
    if(this.flag>0)this.flag--;

    if(key[17] && this.reload == 0){
      if(tamakazu==1)tama.push(new Tama(this.x+(25<<8),this.y,0,-2000))
      else if (tamakazu==2) {
        tama.push(new Tama(this.x+(10<<8),this.y,0,-2000));
        tama.push(new Tama(this.x+(40<<8),this.y,0,-2000));
      }
      this.reload = 7;
    }
    if(this.reload >0)this.reload --;
    if (key[37] && this.x >0)this.x -= this.speed;
    if (key[38] && this.y >0)this.y -= this.speed;
    if (key[39] && this.x <canvasWidth -this.w<<8)this.x += this.speed;
    if (key[40] && this.y <canvasHeight -this.h<<8)this.y += this.speed;
  }
}

//弾
class Tama extends CharaBase {
  constructor(x,y,vx,vy){
    super(x,y,vx,vy)
    this.w = this.h = 30;
    this.r = 4;
  }

  draw(){
    var tamax = (this.x>>8) - this.w/2;
    var tamay = (this.y>>8) - this.h/2;

    ctx.drawImage(tamaimg,tamax,tamay,this.w,this.h)
  }

  update(){
    super.update();

    for(var i = 0;i<enemy.length;i++){
      if(!enemy[i].kill){
        if(checkhit(this.x,this.y,this.r,  enemy[i].x,enemy[i].y,enemy[i].r)){
          enemy[i].enemylife--;
          this.kill=true;

          if(enemy[i].enemylife==0){
            sound1.pause();
            sound1.currentTime = 0;
            sound1.volume = 1;
            sound1.play();
            if(enemy[i].enemytype<4)score++;
            else if(enemy[i].enemytype>4)score+=2;
            else if(enemy[i].enemytype==4)score+=3;
            enemy[i].kill=true;
            expl(enemy[i].x-(enemy[i].w/2<<8),enemy[i].y-(enemy[i].w/2<<8),enemy[i].vx>>2,enemy[i].vy>>2,enemy[i].w,10)

            if(rand(1,30) == 1 && !bosssen)item.push(new Item(enemy[i].x,enemy[i].y,0,0,1));
            else if (rand(1,30)==2)item.push(new Item(enemy[i].x,enemy[i].y,0,0,2));
            else if (rand(1,40)==3)item.push(new Item(enemy[i].x,enemy[i].y,0,0,3));
          }

          break;
        }
      }
    }

    for(var i = 0;i<boss.length;i++){
    if(checkhit(this.x,this.y,this.r,  boss[i].x,boss[i].y,boss[i].r)){

        boss[i].bosslife--;
        this.kill=true;

      if(boss[i].bosslife==0){
        bossgekihaflag = true;
        sound1.play();
        score+=100;
        boss[i].kill = true;
        expl(boss[i].x-(boss[i].w/2<<8),boss[i].y-(boss[i].w/2)>>8,0,0,boss[i].w,40)
        expl(boss[i].x-(boss[i].w/2<<8),boss[i].y-(boss[i].w/2)>>8,0,0,boss[i].w,40)

        item.push(new Item(boss[i].x,boss[i].y,0,0,100));
        bosssen=false;
      }
    }
  }
  }
}
