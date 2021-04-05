var singqueue=[];
var singqueue_top=0;
var 큐전곡재생했슈 = false;

function change_queue(){
    var quEle = document.getElementById("queuelist");
    var outhtml = "";

    new Promise((re,f)=>{
        for (var i=(큐전곡재생했슈 ? singqueue_top : singqueue_top>0 ? singqueue_top:0);singqueue[i];i++){
        outhtml +=`<div class = 'queue_song' id = "queue${i}" title = "${i}"> <span>×</span> <span>${singqueue[i].title}</span></div>`;
    }
    quEle.innerHTML = outhtml;
    re();
    }).then(()=>{
    for (var i=0;i<quEle.childNodes.length;i++){
        quEle.childNodes[i].getElementsByTagName("span")[1].addEventListener("click",play_queue);
        quEle.childNodes[i].getElementsByTagName("span")[0].addEventListener("click",delete_queue);
    }
    //큐 표류현상(?) 뒤로 밀려 안 보이는 현상 방지.
    //가독성을 위해 각각의 clientHeight를 줄여 씀
    var ph = quEle.parentElement.clientHeight, qh = quEle.clientHeight;
    if (ph < qh && Number(quEle.style.top.replace('px','')) < ph-qh)  quEle.style.top = ph-qh+'px';
    if (ph > qh ) quEle.style.top='0px';
    });
}

//해당 음악 요소(?)를 큐에서 삭제
function delete_queue(e){
    var t = parseInt(e.target.parentElement.id.toString().replace("queue",""));

    for (var i=t; singqueue[i];i++){
        singqueue[i]=singqueue[i+1];
    }
    singqueue.pop();
    change_queue();
}

//해당 음악 요소(?)를 재생
function play_queue(e){
    var t = parseInt(e.target.parentElement.id.toString().replace("queue",""));
    singqueue_top = t;
    playmusic();
    change_queue();

    console.log("p");
}

function singqueue_rand (){
  var size = singqueue.length - singqueue_top;
  for (var i=singqueue_top;i<singqueue.length;i++){

    var x = Math.floor( Math.random()*size ) + singqueue_top;
    var tmp = singqueue[i];
    singqueue[i] = singqueue[x];
    singqueue[x] = tmp;
  }

  for (var i=singqueue_top;i<singqueue.length;i++){

    var x = Math.floor( Math.random()*size ) + singqueue_top;
    var tmp = singqueue[i];
    singqueue[i] = singqueue[x];
    singqueue[x] = tmp;
  }
  change_queue();
}

function singqueue_rand_add(){
    var size = song_list_search.length;
    var idx = Math.floor(Math.random()*size);
   var  name = song_list_search[idx].title.replace(/<mark>/g,"").replace(/<\/mark>/g,"");
    singqueue.push(new Singlist(name,song_list_search[idx].url));
    change_queue();
}
function singqueue_all_del(){
    singqueue=[];
    singqueue_top=0;
    change_queue();
}
function singqueue_result_add(){
    var a = document.getElementById("list_in").childNodes;
    var name="";
    for (var i=0;i<a.length;i++){
        name = a[i].innerHTML.replace(/<mark>/g,"").replace(/<\/mark>/g,"");
        singqueue.push(new Singlist(name,a[i].title))
    }
    change_queue();
}

function singqueue_overlap_remove(){
    var start = singqueue_top, length = singqueue.length;
    if (!length) return false;//빈 배열
    
    var 곡수=0;
    for(var i=start;i<length-1;i++) if(singqueue[i]) {
        for(var j=i+1;j<length;j++) if(singqueue[i].url==singqueue[j].url) singqueue[j]="";
    }
    var fff=0;
    for(var i=start;i<length;i++){
        if(i<length-fff){
            if(!singqueue[i]) if(!singqueue[i+fff]) for(fff++;(i+fff)<length && !singqueue[i+fff]; fff++);
            if(!singqueue[i]){
                singqueue[i]=singqueue[i+fff];
                singqueue[i+fff]="";
            }
        }
    }
    while(!singqueue[singqueue.length-1])singqueue.pop();
    change_queue();
    return fff;
}

function recommend(name){
    if (!name) return
    var port=8080
    var url=location.toString().replace(/6868\//,'')+port.toString()+'/'+name
    console.log(url)
    
    fetch(url).then((응답)=>{
            if (응답.status==404){
                console.log('실패')
                alert('분석 실패: 분석 데이터가 부족합니다. 더 많은 노래를 들어주세요')
                throw "분석 실패: 분석 데이터가 부족합니다. 더 많은 노래를 들어주세요"
            }
            return 응답.text();
        }).then((Data)=>{
         singqueue.push(new Singlist(Data,Data))
        change_queue();
    })
}

function singqueue_replay(){
    singqueue_top ? singqueue_top--:1;
    change_queue()
}