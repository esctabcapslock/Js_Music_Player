var title_ch = {
    t: 0,
    T: 150,
    _: "▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏",
    a: -1,
    play: function () {
        if (this.a==-1) {
            this.a = setInterval(() => {
                this.t += 1
                document.title = this._.substr(0, 10 + Math.abs(parseInt(this.t % this.T - this.T / 2)))
            }, 5)
        } else {
            clearInterval(this.a);
            document.title="♪ 음악을 들어용"
            this.a=-1   
        }
    },
    hidden:function(){
        var id=x=>document.getElementById(x);
        id('입력내용').value=id('list_in').innerHTML=id('queuelist').innerHTML=id('가수이름').innerHTML = document.title = '​'
        id('이미지').style.backgroundImage= "url(\"png/래코드판.png\")"
    }
}
//parseInt this.t / this.T * this.T + this.T / 2 - this.
//"▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉",
//title_ch.play()