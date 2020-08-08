var playing_music = new Audio;
//var playing_div;
var song_list=[];
var song_all_list_html;

function gettitle(x,괄호도제거해){
    x= x.replace(/<span>/g,"").replace(/<\/span>/g,"").replace(/\[.*\]/gi, '').replace(/1집/g, '').replace(/2집/g, '').replace(/3집/g, '').replace(/4집/g, '').replace(/5집/g, '').replace(/6집/g, '').replace(/"01\."/g, '').replace(/02\./g, '').replace(/03\./g, '').replace(/04\./g, '').replace(/05\./g, '').replace(/06\./g, '').replace(/07\./g, '').replace(/08\./g, '').replace(/09\./g, '').replace(/10\./g, '').replace(/11\./g, '').replace(/12\./g, '').replace(/13\./g, '').replace(/14\./g, '').replace(/\s\s/g, ' ');
    return 괄호도제거해 ? x.replace(/\(.*\)/gi, '') : x;
}

function push_singqueue(x){
    //console.log("큐에 넣는 것: ",x.tagName,x)
    if(x.tagName=="SPAN") x=x.parentElement;
    if (x.tagName!="DIV") return;
    var name = x.innerHTML.replace(/<span>/g,"").replace(/<\/span>/g,"");
    singqueue.push(new Singlist(name,x.title));
    if (playing_music.paused && singqueue_top+1==singqueue.length) playmusic();
    change_queue();
}

function playmusic(e) {
    //오류처리 = 모든 곡을 재생하였을 때.
    if (!singqueue[singqueue_top]){
        document.getElementById("가수이름").innerHTML = s_title = "큐의 모든 곡을 재생했습니다."
         document.head.getElementsByTagName("title")[0].innerHTML = "음악을 들어용";
         document.head.getElementsByTagName("link")[0].href = "/png/정지.png"
        document.getElementById("이미지").style.backgroundImage=`url("png/래코드판.png")`;
        s_url = "";
        playing_music.src="";
        playing_music.pause();
        큐전곡재생했슈 = true;
        return;
    }

    큐전곡재생했슈 = false;
    var s_title = singqueue[singqueue_top].title;
    var s_url = singqueue[singqueue_top].url;
    singqueue_top++;


    console.log("큐에서 꺼내 옴\n title: ",s_title,"\nurl:",s_url);
    var url_name = s_url.replace(/<span>/g,"").replace(/<\/span>/g,"");

    var mp3_get_url = '/music/' + encodeURIComponent(url_name);
    //console.log("mp3_get_url: ",mp3_get_url)

    playing_music.src = mp3_get_url.trim() + ".mp3";
    playing_music.load();
    playing_music.play();
    document.head.getElementsByTagName("link")[0].href = "/png/재생.png"

    var 곡명 = gettitle(s_title,true);
    console.log("곡명",곡명);

    document.getElementById("가수이름").innerHTML = 곡명;
    document.head.getElementsByTagName("title")[0].innerHTML = 곡명;

    //가사 받아오기
    var getlyric_URL = `/lyrics/${encodeURIComponent(곡명)}`
    fetch(getlyric_URL).then((response) => {
        return response.text();
    }).then((data) => {
        //console.log(data);
        if (data)
            document.getElementById("가사안").innerHTML = data.replace(/<br><br><br>/g, "<br><br>");
        else
            document.getElementById("가사안").innerHTML = "가사를 찾지 못했습니다"
    });
    //가사 위치 조절
    document.getElementById("가사안").style.top="0px";

    //이미지 주소 받아오기
    var singimg_URL = `/singimg/${encodeURIComponent(곡명)}`
    fetch(singimg_URL).then((response) => {
        return response.text();
    }).then((data) => {
        console.log("받아 온 앨범 이미지 주소: ",data);
        if (data)
            document.getElementById("이미지").style.backgroundImage=`url("${data}")`;
            //document.getElementById("이미지").getElementsByTagName("img")[0].src= data;
        else
            document.getElementById("이미지").style.backgroundImage=`url("png/래코드판.png")`;
            //document.getElementById("이미지").getElementsByTagName("img")[0].src= "png/래코드판.png"
    });   
    //노래가 재생되면서... 큐가 밀리면서 스크롤 안되는 현상 해결
    speadwatch(present_spead); //전곡 재생 속도 유지
}