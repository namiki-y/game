//
//enemy.js 敵関連
//

//敵
class Enemy extends CharaBase {
  constructor(x,y,vx,vy,t){
    super(x,y,vx,vy)
    if(t==undefined)this.enemytype = rand(0,5)
    else this.enemytype = t;
    this.flag = false;

    if(this.enemytype<4){
      this.w = this.h = 50;
      this.enemylife = 3;
      if(this.enemytype<2)this.vy = 1500;
    }
    else if (this.enemytype==6){
      this.w = this.h = 50;
      this.enemylife = 3;
      this.count=0;
    }
    else if (this.enemytype>4){
      this.w = this.h = 100;
      this.enemylife = 5;
    }
    else{
      this.w = this.h = 150;
      this.enemylife = 8;
    }

    this.r = this.w/2;
    this.reload = 0;
  }

  draw(){
    var enemyx = (this.x>>8) - this.w/2;
    var enemyy = (this.y>>8) - this.h/2;

    if(this.enemytype<4 || this.enemytype==6)ctx.drawImage(enimg,enemyx,enemyy,this.w,this.h);
    else if(this.enemytype==4)ctx.drawImage(enkushamiimg,enemyx,enemyy,this.w,this.h);
    else ctx.drawImage(ensekiimg,enemyx,enemyy,this.w,this.h);

    if(this.reload==0&&this.enemytype!=6){
      if(this.enemytype<=4){
        enemytama.push(new Enemytama(this.x ,this.y +(this.h/2<<8),0,1000))
      }
      if(this.enemytype>=4 && this.enemytype!=6){
        enemytama.push(new Enemytama(this.x - (8<<8),this.y +(this.h/2<<8),-200,1000))
        enemytama.push(new Enemytama(this.x + (8<<8),this.y +(this.h/2<<8),200,1000))
      }
      this.reload = 40;
    }
    else if (this.reload==0&&this.enemytype==6) {
      var an,dx,dy;
      an = Math.atan2(jiki.y-this.y,jiki.x-this.x);
      dx = Math.cos( an )*1000;
      dy = Math.sin( an )*1000;
      enemytama.push(new Enemytama(this.x ,this.y +(this.h/2<<8),dx,dy))
      this.reload = 100;
    }
  }

  update(){
    super.update();

    if(this.enemytype<2){
      if(jiki.x>this.x)this.vx += 8;
      if(jiki.x<this.x)this.vx -= 8;
    }
    else if (this.enemytype==6) {
      this.count++;
      if (this.count==10) {
        this.vx=this.vy=0;
      }

      if(this.count==60){
        if(this.x>jiki.x)this.vx=-100;
        else this.vx=100;
        this.vy=100;
      }
    }else{
      if(jiki.x>this.x)this.vx += 4;
      if(jiki.x<this.x)this.vx -= 4;
    }

    if(this.enemytype!=6 && this.enemytype>=4 && Math.abs(jiki.y-this.y)<(250<<8))this.flag=true;
    if(this.flag && this.vy>-500)this.vy-=30;

    if(this.reload>0)this.reload--;

    if(jiki.damage==0 && checkhit(this.x,this.y,this.r,  jiki.x+(25<<8),jiki.y+(25<<8),jiki.r-5)){
      sound0.currentTime = 0.3;
      sound0.play();
      jiki.life--;
      if(jiki.life == 0)gameend();
      tamakazu=1;
      jiki.damage = 60;
      jiki.flag = 10;
      this.kill = true;
    }
  }
}

//ボス
class Boss extends CharaBase {
  constructor(x,y,vx,vy){
    super(x,y,vx,vy);
    bossflag = false;
    this.bossmoveflag = 0;
    this.w = this.h = 250;
    this.r = this.w/2;
    this.mbosslife = 500;
    this.bosslife = this.mbosslife;
    this.reload = 0;
    this.dr = 90;
    this.count = 0;
  }

  draw(){
    var bossx = (this.x>>8) - this.w/2;
    var bossy = (this.y>>8) - this.h/2;

    ctx.drawImage(enemytamaimg,bossx,bossy,this.w,this.h);

    if(this.bossmoveflag>1){
      var an,dx,dy;
      an=this.dr*Math.PI/180;
      dx=Math.cos(an)*1000;
      dy=Math.sin(an)*1000;
      var x2=(Math.cos(an)*150)<<8;
      var y2=(Math.sin(an)*150)<<8;
      enemytama.push(new Enemytama(this.x+x2 ,this.y+y2,dx,dy,30))
      this.dr+=8;
      if(this.dr>=220)this.dr=-40;
    }

    if(this.bosslife<this.mbosslife/2){
      var c = this.count%300;
      if(c/10<3 && c%10==0){
        var an,dx,dy;
        an=(90+30-c/10*45)*Math.PI/180;
        dx=Math.cos(an)*300;
        dy=Math.sin(an)*300;
        var x2=(Math.cos(an)*150)<<8;
        var y2=(Math.sin(an)*150)<<8;
        enemy.push(new Enemy(this.x+x2 ,this.y+y2,dx,dy,6))
      }
    }
  }

  update(){
    this.count++;
    super.update();

    if(this.reload>0)this.reload--;

    if(this.bossmoveflag==0 &&(this.y<<8)>=100)this.bossmoveflag = 1;

    if (this.bossmoveflag == 1) {
      if((this.vy-=0.7)<=0){
        this.bossmoveflag = 2;
        this.vy = 0;
      }
    }else if(this.bossmoveflag == 2){
      if(this.vx<300)this.vx+=10;
      if(this.x>>8 > canvasWidth-100)this.bossmoveflag = 3;
    }else if(this.bossmoveflag == 3){
      if(this.vx>-300)this.vx-=10;
      if(this.x>>8 < 100)this.bossmoveflag = 2;
    }

    if(jiki.damage==0 && checkhit(this.x,this.y,this.r,  jiki.x+(25<<8),jiki.y+(25<<8),jiki.r-5)){
      sound0.currentTime = 0.3;
      sound0.play();
      jiki.life--;
      if(jiki.life == 0)gameend();
      tamakazu=1;
      jiki.damage = 60;
      jiki.flag = 10;
    }
  }
}

//敵弾
class Enemytama extends CharaBase {
  constructor(x,y,vx,vy,t){
    super(x,y,vx,vy)
    this.w = 20;
    this.h = 20;
    this.r = 5;
    if(t==undefined)this.timer=0;
    else this.timer=t;
  }

  draw(){
    ctx.drawImage(enemytamaimg,this.x>>8,this.y>>8,this.w,this.h)
  }

  update(){
    if(this.timer){
      this.timer--;
      return;
    }
    super.update();

    if(!jiki.maskflag && jiki.damage==0 && checkhit(this.x,this.y,this.r,  jiki.x + (10<<8),jiki.y + (25<<8),jiki.r)){
      sound0.currentTime = 0.3;
      sound0.play();
      jiki.life--;
      if(jiki.life == 0)gameend();
      tamakazu=1;
      jiki.damage = 60;
      jiki.flag = 10;
      this.kill=true;
    }
  }
}
