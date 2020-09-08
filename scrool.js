if (!(window.browser)){
        //파폭
    document.getElementById("가사안").addEventListener("wheel",noscrool);
    document.getElementById("queuelist").addEventListener("wheel",noscrool);
    document.getElementById("list_in").addEventListener("wheel",noscrool);
    }
    else{스크롤바보이기()}

    var 스크롤바보이냐 = true;
    function 스크롤바보이기(){
        if (!스크롤바보이냐){
        document.getElementById("list").style.overflow="scroll";
        document.getElementById("list").style.overflowX="hidden";
        document.getElementById("list").style.overflowY="scroll";
        document.getElementById("queue").style.overflow="scroll";
        document.getElementById("queue").style.overflowX="hidden";
        document.getElementById("queue").style.overflowY="scroll";
        document.getElementById("가사").style.overflow="scroll";
        document.getElementById("가사").style.overflowX="hidden";
        document.getElementById("가사").style.overflowY="scroll";
            스크롤바보이냐 = true;
        }
        else {
        document.getElementById("list").style.overflow="hidden";
        document.getElementById("list").style.overflowX="hidden";
        document.getElementById("list").style.overflowY="hidden";
        document.getElementById("queue").style.overflow="hidden";
        document.getElementById("queue").style.overflowX="hidden";
        document.getElementById("queue").style.overflowY="hidden";
        document.getElementById("가사").style.overflow="hidden";
        document.getElementById("가사").style.overflowX="hidden";
        document.getElementById("가사").style.overflowY="hidden";
            스크롤바보이냐 = false;
        }
    }

function noscrool(e){
    this.style.position = "absolute";

    //console.log(e.deltaY);
    var a = Number(this.style.top.toString().replace("px",""));
    var 현재 = this.clientHeight;
    var 부모 = this.parentElement.clientHeight;

      //console.log(a, 부모-현재);
    var b = a-e.deltaY*10;
    if (Math.abs(e.deltaY)>10) b=a-e.deltaY/2.5//크로뮴 브라우져 지원

    if (b<0 && ((부모-현재) < b|| e.deltaY<0)){
        this.style.top = b + "px";
    }
    else if (b>0){
        this.style.top = "0px";
    }
}