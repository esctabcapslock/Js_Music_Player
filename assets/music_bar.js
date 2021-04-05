var 시간표시형식 = true;
// 시간표시형식 변경
function this_형식() {시간표시형식 = !시간표시형식;}
// 재생/정지 기능 구현
function this_play() { if(playing_music.src) playing_music.paused?playing_music.play():playing_music.pause(); } 

var a = setInterval(() => {// 재생바 움직임
    if (!playing_music || !playing_music.src) return;  //재생중일 때,
    
    //초(숫자)를 분:초 형태의 문자열로 변환
    function second2text(x) {
        var 시 = Math.floor(x / 3600);
        var 분 = Math.floor((Math.floor(x / 60)) % 60);
        var 초 = Math.floor(x % 60);
        
        if (초 < 10) 초 = `0${초}`;
        if (분 < 10) 분 = `0${분}`;
        if (시) return `${시}:${분}:${초}`;
        else return `${분}:${초}`;
    }

    var 현재시간 = playing_music.currentTime;
    var 총총시간 = playing_music.duration;
    var 총시간 = !isFinite(총총시간) ? 현재시간 :총총시간;
    //console.log("시간",현재시간, 총총시간,"->",총시간);
    if (isFinite(현재시간/총시간*100)) document.getElementById("상태바안").style.width = `${현재시간/총시간*100}%`;
    document.getElementById("상태시간").innerHTML = 시간표시형식 ? second2text(현재시간) : '-' + second2text(총시간 - 현재시간);
}, 150);

document.getElementById("상태바").addEventListener("mousedown", (e) => {
    var 이동시간 = e.offsetX / document.getElementById('상태바').offsetWidth;
    if (isFinite(playing_music.duration)) playing_music.currentTime =  이동시간*playing_music.duration;
    else playing_music.currentTime =  이동시간*playing_music.currentTime;
})

var 반복여부 = false;
function this_loop() {
    document.getElementById("반복").innerHTML = 반복여부 ? "반복X" : "반복O";
    playing_music.loop = 반복여부 = !반복여부;
}

document.body.addEventListener("keydown",(e)=>{
    //console.log(e.key);
    if(e.ctrlKey || e.shiftKey) return;

    if (e.key=="ArrowUp"){mastervol(.125,1)}
    else if (e.key=="ArrowDown"){mastervol(-.125 ,1)}
    
    if(e.target.id=="입력내용") return; //입력중이면 거부하기
    
    if (e.key=="ArrowRight") playing_music.currentTime+=5.;
    else if (e.key=="ArrowLeft")playing_music.currentTime-=5.;
    else if (e.key.toString().trim()=="") this_play();
    else if (e.key=="Backspace"){
        e.returnValue = false; //브라우저키 무효화
        var input = document.getElementById("입력내용");
        input.value=input.value.substring(0,input.value.length-1);
        song_search();
    }
    else if(e.key=="Escape") title_ch.hidden()
    else if (e.key.trim().length==1){
        var chr =e.key.toString().toLocaleLowerCase()
        var en="qwertyuiopasdfghjklzxcvbnm", ko='ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅁㄴㅇㄹㅎㅗㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡ';
        document.getElementById("입력내용").value+= en.includes(chr)? ko[en.indexOf(chr)] : chr;
        song_search();
        document.getElementById("입력내용").click();
    }
});