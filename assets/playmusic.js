var playing_music = new Audio;
//현재 곡 추천을 위함
var playing_music_name='';
//var playing_div;
var song_list=[];
//var song_all_list_html;

function gettitle(x,괄호도제거해){
    function 괄호(str,gal){var out='', c=0;
    for(var i=-1; str[++i];){
    if(str[i]==gal[1]){if(c%2) c++;}
    else if(str[i]==gal[0]){if(!(c%2)) c++}
    else{if(!(c%2)) out+=str[i]}
    } return out} //괄호 제거
    
    x= x.replace(/<span>/g,"").replace(/<\/span>/g,"").replace(/"01\."/g, '').replace(/02\./g, '').replace(/03\./g, '').replace(/04\./g, '').replace(/05\./g, '').replace(/06\./g, '').replace(/07\./g, '').replace(/08\./g, '').replace(/09\./g, '').replace(/10\./g, '').replace(/11\./g, '').replace(/12\./g, '').replace(/13\./g, '').replace(/14\./g, '').replace(/\s\s/g, ' ').replace(/  /g,'');
    //replace(/1집/g, '').replace(/2집/g, '').replace(/3집/g, '').replace(/4집/g, '').replace(/5집/g, '').replace(/6집/g, '').
    //return 괄호도제거해 ? x.replace(/\(.*\)/gi, '').replace(/\[.*\]/gi, '') : x;
    return 괄호도제거해 ? 괄호(괄호(x,'()'),'[]').replace(/  /g,'') : x;
}

function push_singqueue(x){
    //console.log("큐에 넣는 것: ",x.tagName,x)
    if(x.tagName=="MARK") x=x.parentElement;
    if (x.tagName!="DIV") return;
    var name = x.innerHTML.replace(/<mark>/g,"").replace(/<\/mark>/g,"");
    singqueue.push(new Singlist(name,x.title));
    if (playing_music.paused && singqueue_top+1==singqueue.length) playmusic();
    change_queue();
}

function playmusic(e) {
    if (!singqueue[singqueue_top]){//오류처리 = 모든 곡을 재생하였을 때.
        document.getElementById("가수이름").innerHTML = s_title = "큐의 모든 곡을 재생했습니다."
        document.head.getElementsByTagName("title")[0].innerHTML = "음악을 들어용";
        document.head.getElementsByTagName("link")[0].href = "/png/정지.png"
        document.getElementById("이미지").style.backgroundImage=`url("png/래코드판.png")`;
        s_url = "";
        playing_music.src="";
        playing_music_name='';
        playing_music.pause();
        큐전곡재생했슈 = true;
        return;
    }

    큐전곡재생했슈 = false;
    var s_title = singqueue[singqueue_top].title;
    var s_url = singqueue[singqueue_top++].url;
    console.log("큐에서 꺼내 옴\n title: ",s_title,"\nurl:",s_url);
    
    if (s_url.includes('data:audio/mpeg;base64')) var url_name = s_title, mp3_get_url = s_url; //파일 읽을때
    else var url_name = s_url, mp3_get_url = '/music/' + encodeURIComponent(url_name).trim()+ ".mp3";
    //.replace(/<span>/g,"").replace(/<\/span>/g,"");
   
    playing_music_name=url_name;
    playing_music.src = mp3_get_url;
    playing_music.load();
    playing_music.play();

    var 곡명 = gettitle(s_title,true);
    console.log("곡명",곡명);
    document.getElementById("가수이름").innerHTML = document.head.getElementsByTagName("title")[0].innerHTML = 곡명;

    //가사 받아오기
    var getlyric_URL = `/lyrics/${encodeURIComponent(s_url)}`;
    fetch(getlyric_URL).then((response) => {
        return response.text();
    }).then((data) => {
        if (data) document.getElementById("가사안").innerHTML = data.replace(/<br><br><br>/g, "<br><br>");
        else document.getElementById("가사안").innerHTML = "가사를 찾지 못했습니다"
    });
    //가사 위치 조절
    document.getElementById("가사안").style.top="0px";

    //이미지 주소 받아오기
    var singimg_URL = `/singimg/${encodeURIComponent(s_url)}`;
    fetch(singimg_URL).then((response) => {
        return response.text();
    }).then((data) => {
        console.log("받아 온 앨범 이미지 주소: ",data);
        if (data) document.getElementById("이미지").style.backgroundImage=`url("${data}")`;
        else document.getElementById("이미지").style.backgroundImage=`url("png/래코드판.png")`;
    });   
    //노래가 재생되면서... 큐가 밀리면서 스크롤 안되는 현상 해결
    masterspead(present_spead,0); //전곡 재생 속도 유지
}

//아이콘 변화
playing_music.onplaying=(e)=>{ // 시작할 때 이미지 바꾸기
    console.log('시작');
    document.head.getElementsByTagName("link")[0].href = "/png/재생.png";
    document.getElementById("재생정지").innerHTML="정지";
}

playing_music.onpause=(e)=>{ //멈추면, 이미지 바꾸기
    console.log('멈춤');
    if(!playing_music.src) return;
    document.head.getElementsByTagName("link")[0].href = "/png/보류.png";
    document.getElementById("재생정지").innerHTML="재생";
}

playing_music.onended=(e)=>{ //다음 곡으로 넘기기
    console.log(e,'끝남');
    playmusic();
    change_queue();
}