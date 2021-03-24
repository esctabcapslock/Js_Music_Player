var singqueue=[];
var singqueue_top=0;
var 큐전곡재생했슈 = false;

function change_queue(){
    var queueEle = document.getElementById("queuelist");
    var outhtml = "";

    new Promise((re,f)=>{
        for (var i=(큐전곡재생했슈 ? singqueue_top    : singqueue_top>0 ? singqueue_top:0);singqueue[i];i++){
        //console.log("i",i);
        outhtml +=`<div class = 'queue_song'  id = "queue${i}" title = "${i}"> <span>×</span> <span >${singqueue[i].title}</span></div>`;
    }
    //console.log(outhtml);
    queueEle.innerHTML = outhtml;
    re();
    }).then(()=>{
        //console.log(queueEle.childNodes.length);
    for (var i=0;i<queueEle.childNodes.length;i++){

        queueEle.childNodes[i].getElementsByTagName("span")[1].addEventListener("click",play_queue);
        queueEle.childNodes[i].getElementsByTagName("span")[0].addEventListener("click",delete_queue);
    }
    //큐 표류현상(?) 뒤로 밀려 안 보이는 현상 방지.
    if (queuelist.parentElement.clientHeight < queuelist.clientHeight && Number( queuelist.style.top.replace('px','')) < queuelist.parentElement.clientHeight-queuelist.clientHeight)  queuelist.style.top = queuelist.parentElement.clientHeight-queuelist.clientHeight+'px';
    if (queuelist.parentElement.clientHeight > queuelist.clientHeight ) queuelist.style.top='0px';
    });
}

function delete_queue(e){
    var t = parseInt(e.target.parentElement.id.toString().replace("queue",""));

    for (var i=t; singqueue[i];i++){
        singqueue[i]=singqueue[i+1];
    }
    singqueue.pop();
    change_queue();
}
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
    //console.log(i,x);
    var tmp = singqueue[i];
    singqueue[i] = singqueue[x];
    singqueue[x] = tmp;
  }

  for (var i=singqueue_top;i<singqueue.length;i++){

    var x = Math.floor( Math.random()*size ) + singqueue_top;
    //console.log(i,x);
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
        //console.log(응답)
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