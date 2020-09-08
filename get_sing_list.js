function Singlist(title,url){
    this.title=title;
    this.url=url;
}
var song_list_search=[];
fetch('music_html_list').then((response) => {
    return response.text();
}).then((data) => {

    document.getElementById("list_in").innerHTML = song_all_list_html = data;
}).then(() => {
    var list = document.getElementById("list_in").children;
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener('click', (e)=>{
            push_singqueue(e.target);
        });
        list[i].innerHTML=gettitle(list[i].innerHTML,false);
        song_list.push(new Singlist(list[i].innerHTML,list[i].title));
    }
     song_list_search = song_list.slice();
});