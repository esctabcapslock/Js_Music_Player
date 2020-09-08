function second2text(x) {
    var 시 = Math.floor(x / 3600);
    var 분 = Math.floor((Math.floor(x / 60)) % 60);
    var 초 = Math.floor(x % 60);

    if (초 < 10) 초 = `0${초}`;
    if (분 < 10) 분 = `0${분}`;

    if (시) return `${시}:${분}:${초}`;
    else return `${분}:${초}`;
}

var 시간표시형식 = true;

function this_형식() {
    시간표시형식 = !시간표시형식;
}

function this_play() {
    if (playing_music.paused){
        playing_music.play();
        document.getElementById("재생정지").innerHTML="정지";
        document.head.getElementsByTagName("link")[0].href = "/png/재생.png";
    } 
    else{
        playing_music.pause();
        document.getElementById("재생정지").innerHTML="재생";
        document.head.getElementsByTagName("link")[0].href = "/png/보류.png";
    } 
}

var a;
a = setInterval(() => {
    if (playing_music.src) {
        var 현재시간 = playing_music.currentTime;
        var 총총시간 = playing_music.duration;

        var 총시간 = !isFinite(총총시간) ? 현재시간 :총총시간;
        //console.log("시간",현재시간, 총총시간,"->",총시간);
        if ( isFinite(현재시간/총시간*100)){
        document.getElementById("상태바안").style.width = `${현재시간/총시간*100}%`;
        }

        document.getElementById("상태시간").innerHTML = 시간표시형식 ? second2text(현재시간) : '-' + second2text(총시간 - 현재시간);

        //다음곡 자동재생
        if (현재시간== 총총시간){
            playmusic();
            change_queue();
        }
    }
}, 200);

document.getElementById("상태바").addEventListener("mousedown", (e) => {
    var 이동시간 = e.offsetX / document.getElementById('상태바').offsetWidth;
    if (isFinite(playing_music.duration)) playing_music.currentTime =  이동시간*playing_music.duration;
    else playing_music.currentTime =  이동시간*playing_music.currentTime;
})

var 반복여부 = false;

function this_loop() {
    if (반복여부) {
        document.getElementById("반복").innerHTML = "반복X"
        반복여부 = !반복여부;
        playing_music.loop = false;
    } else {
        document.getElementById("반복").innerHTML = "반복O"
        반복여부 = !반복여부;
        playing_music.loop = true;
    }
}

document.body.addEventListener("keydown",(e)=>{
   //console.log(e.key);
    if(e.ctrlKey) return;

    var is입력중 = (e.target.id=="입력내용");

    if (!is입력중&&e.key=="ArrowRight") playing_music.currentTime+=5.;
    else if (!is입력중&&e.key=="ArrowLeft"){
        console.log(playing_music.currentTime);
        playing_music.currentTime-=5.;
    } 
    else if (e.key=="ArrowUp"){
        var 볼륨 = playing_music.volume;
        볼륨+=0.07;
        if(볼륨>1)볼륨=1;
        document.getElementById("볼륨안").style.width = 볼륨*80 + "px";
        playing_music.volume = 볼륨;
    }
    else if (e.key=="ArrowDown"){
        var 볼륨 =playing_music.volume;
        볼륨-=0.07;
        if(볼륨<0)볼륨=0;
        document.getElementById("볼륨안").style.width = 볼륨*80 + "px";
        playing_music.volume = 볼륨;
    }
    else if ((!is입력중)&&(e.key.toString().trim()=="")){
        this_play();
    }

    else if (!is입력중&&e.key=="Backspace"){
        //console.log(e.key);
        e.returnValue = false; //브라우저키 무효화
        var input = document.getElementById("입력내용");
        input.value=input.value.substring(0,input.value.length-1);
        song_search();
    }
    else if (!is입력중&&e.key.trim().length==1){
        document.getElementById("입력내용").value+=e.key.toString();
        song_search();
        document.getElementById("입력내용").click();
    }
});