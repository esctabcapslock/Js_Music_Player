var 입력창 = document.getElementById("입력내용");
var 검색버튼 = document.getElementById("검색버튼");
//var song_list_search = []; //검색목록;
입력창.focus()
입력창.addEventListener("keyup", (e) => {
    song_search();
});

function song_search() {
    var 키워드 = 입력창.value.toLowerCase().split(" ");
    song_list_search = [] //전역변수로 설정해야

    if (!키워드.length) song_list_search = song_list.slice(); //비어있는가
    else
        for (var i = 0; i < song_list.length; i++) {
            var ishas = true;
            var title = song_list[i].title.replace("'영화,드라마,애니 OST/", "")// 이거 바뀌면 표기 달라져
            var title_low = title.toLocaleLowerCase()
            var title_초성 = 자모.s2j(title);
            
            for (var j = 0; j < 키워드.length; j++) ishas *= (title_low.includes(키워드[j]) || title_초성.includes(키워드[j]))
            if (!ishas) continue;
            
            var 바꿀것 = new Int8Array(title.length)
            var 최종 = ""
            var sum = 0
            for (var j = 0; j < 키워드.length; j++)
                if (키워드[j]) {
                    var ind = 자모.only_자모(키워드[j])? title_초성.indexOf(키워드[j]) :title_low.indexOf(키워드[j]);
                    바꿀것[ind] += 1
                    바꿀것[ind + 키워드[j].length] -= 1
                }
            //console.log(키워드, title, 바꿀것)
            for (var j = 0; j < title.length; j++) {
                sum += 바꿀것[j]
                최종 += sum > 0 ? `<mark>${title[j]}</mark>` : title[j]
            }
            song_list_search.push(new Singlist(최종, song_list[i].url));

        }

    var outhtml = "";
    var list_in = document.getElementById("list_in")
    var list = document.getElementById("list")
    for (var i = 0; i < song_list_search.length; i++) {
        outhtml += `<div title="${song_list_search[i].url}">${song_list_search[i].title}</div>`
    }
    if (!outhtml) outhtml = "찾는 곡이 없습니다";
    list_in.innerHTML = outhtml;

    if (list_in.offsetTop + list_in.clientHeight - list.clientHeight < 0)
        list_in.style.top = (list.clientHeight - list_in.clientHeight).toString() + "px" //표류현상(?) 해결
    if (list_in.offsetTop > 0) list_in.style.top = '0px' //위로 가 있는 현상 해결

    var div_list = list_in.childNodes;
    for (var i = 0; i < div_list.length; i++) {
        div_list[i].addEventListener('click', (e) => {
            push_singqueue(e.target);
        });
    }
}

//03.11 추가
var 자모={
    범위:"가낗나닣다띻라맇마밓바삫사앃아잏자찧차칳카킿타팋파핗하힣",
    자모:"ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ",
    십육:{'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'A':10,'B':11,'C':12,'D':13,'E':14,'F':15},
    n2j:function(c){
        c=c[0];
        if (this.자모.includes(c)) return c;
        for(var i=0; i<14; i++) if (this.범위[2*i]<=c && c <= this.범위[2*i+1]) return this.자모[i];
        return '_';
    },
    only_자모:function(str){
        for(var i=-1; str[++i];) if (!this.자모.includes(str[i])) return false;
        return true;
    },
    s2j:function(str){
        var ar = str.split('');
        ar.forEach((v,i,ar)=>{ar[i] = this.n2j(v)})
        return ar.join('')
    }   
}