//볼륨 전반을 관리
function mastervol(vol,mode){
    if (mode==0){}// 설정하기
    else if(mode==1){vol+= Math.log(playing_music.volume)/3+1;}  //변경하기
    var min = Math.exp(-4);
    vol=vol>1?1:vol<min?min:vol;
    document.getElementById("볼륨안").style.width = vol*80 + "px";
    playing_music.volume = Math.exp(vol*3-3);
    //console.log(vol,playing_music.volume)
}

var isdown=false;
function changvol(e){
    if (!isdown) return;
    var 이동시간 = e.offsetX / 80 * 1;// present_playing_music.volume;
    if (이동시간<0) 이동시간=0, isdown=false;
    else if (이동시간>1) 이동시간=1,isdown=false;
    
    mastervol(이동시간,0)
}

document.getElementById("볼륨감싸기").addEventListener("mousedown",(e)=>{isdown=true,changvol(e)});
document.getElementById("볼륨감싸기").addEventListener("mousemove", changvol);
document.getElementById("볼륨감싸기").addEventListener("mouseup", (e)=>{changvol(e),isdown=false});
document.getElementById("볼륨감싸기").addEventListener("mouseout", (e)=>{if (e.target.id=="볼륨감싸기")isdown=false});

var present_spead=1;
//빠르기 전반을 관리
function masterspead(speed,mode){
    if(mode==0){}//설정
    else if(mode==1) speed+=present_spead; // 변화
    present_spead=playing_music.playbackRate=speed;
    document.getElementById("현재재생").childNodes[0].innerHTML = parseFloat(speed).toFixed(1);
}