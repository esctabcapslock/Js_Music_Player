var isdown=false;
function changvol(e){
    if (!isdown) return;
    var 이동시간 = e.offsetX / 80 * 1;// present_playing_music.volume;
    if (이동시간<0) 이동시간=0, isdown=false;
    else if (이동시간>1) 이동시간=1,isdown=false;
    
    document.getElementById("볼륨안").style.width = 이동시간*80 + "px";
    playing_music.volume = 이동시간;
}

document.getElementById("볼륨감싸기").addEventListener("mousedown",(e)=>{isdown=true,changvol(e)});
document.getElementById("볼륨감싸기").addEventListener("mousemove", changvol);
document.getElementById("볼륨감싸기").addEventListener("mouseup", (e)=>{changvol(e),isdown=false});
document.getElementById("볼륨감싸기").addEventListener("mouseout", (e)=>{if (e.target.id=="볼륨감싸기")isdown=false});

var present_spead=1;
function speadown(e){speadwatch( playing_music.playbackRate-0.1);}

function speadup(e){speadwatch(playing_music.playbackRate+0.1);}

function spead1(e){speadwatch(1);}

function speadwatch(x){
    present_spead = playing_music.playbackRate=x;
    document.getElementById("현재재생").childNodes[0].innerHTML = parseFloat(x).toFixed(1);
} 