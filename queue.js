var singqueue=[];
var singqueue_top=0;
var 큐전곡재생했슈 = false;

function change_queue(){
    var queueEle = document.getElementById("queuelist");
    var outhtml = "";

    new Promise((re,f)=>{
        for (var i=(큐전곡재생했슈 ? singqueue_top    : singqueue_top>0 ? singqueue_top:0);singqueue[i];i++){
        //console.log("i",i);
        outhtml +=`<div id = "queue${i}" title = "${singqueue[i].url}"> <span>×</span> <span >${singqueue[i].title}</span></div>`;
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
   var  name = song_list_search[idx].title.replace(/<span>/g,"").replace(/<\/span>/g,"");
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
        name = a[i].innerHTML.replace(/<span>/g,"").replace(/<\/span>/g,"");
        singqueue.push(new Singlist(name,a[i].title))
    }
    change_queue();
}

function singqueue_overlap_remove(){
    var start = singqueue_top;
    var length = singqueue.length;
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