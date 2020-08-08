var 입력창 = document.getElementById("입력내용");
var 검색버튼 = document.getElementById("검색버튼");
var song_list_search =[];//검색목록;

입력창.addEventListener("keyup", song_search);
입력창.addEventListener("keydown", (e) => {
if (e.keyCode == 13) song_search();
});

function song_search() {
    var 입력 = 입력창.value.replace(/<br>/g, "").replace(/\n/g, "");
    //console.log(입력);
    var 키워드 = [];
    var 단어 = "";
    var 입력중인가 = false;
    for (var i = 0; i < 입력.length; i++) {
        //console.log(입력[i],i,단어);
        if (입력[i] == " ") {
            if (입력중인가) {
                입력중인가 = false;
                키워드.push(단어);
                단어 = "";
            }
        } else {
            if (!입력중인가) 입력중인가 = true;
            단어 += 입력[i];
        }
    }
    if (단어) 키워드.push(단어);
    //console.log(키워드, 키워드.length);

    if (!키워드.length) {
        document.getElementById("list_in").innerHTML = song_all_list_html;
        song_list_search = song_list;
    }

    song_list_search = [];

    document.getElementById("list_in").style.top = "0px";

    for (var i = 0; i < song_list.length; i++) {
        var ishas = true;
        for (var j = 0; j < 키워드.length; j++) {
            ishas *= song_list[i].title.includes(키워드[j]);
        }
        if (ishas) {
            var input=song_list[i].title;
            for (var j = 0; j < 키워드.length; j++) {
                //console.log(input);
                input=input.replace(키워드[j],`<span>${키워드[j]}</span>`)
                //console.log(input);
            }
             song_list_search.push(new Singlist(input,song_list[i].url));
        }
    }

    var outhtml="";
    for (var i = 0; i < song_list_search.length; i++) {
        outhtml += `<div title="${song_list_search[i].url}" >${song_list_search[i].title}</div>`
    }

    if (!outhtml) outhtml = "찾는 곡이 없습니다";
    document.getElementById("list_in").innerHTML = outhtml;

    var list = document.querySelectorAll("#list_in>div");
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener('click', (e)=>{
            push_singqueue(e.target);
        });
    }
}