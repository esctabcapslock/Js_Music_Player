//const fs=require("fs");
//const http = require("http");
const cheerio = require('cheerio')
//const 포트 = 6868;
const request = require('request-promise');

//var app = http.createServer(function(요청, 응답){
module.exports.getlyrics = getlyrics;
module.exports.getsongimg = getsongimg;

function getsongimg(곡명,callback) {
    //console.log(곡명);
    곡명 = 곡명.trim().replace(/-/g,"").replace(/.mp3/g,"").replace(/  /g," ").replace(/\s/g,'+');
   //var url = `https://www.melon.com/search/song/index.htm?q=${encodeURIComponent(곡명)}&section=&searchGnbYn=Y&kkoSpl=N&kkoDpType=&ipath=srch_form` //전체검색
    var url=`https://www.melon.com/search/lyric/index.htm?q=${encodeURIComponent(곡명)}&ipath=srch_form`//가사검색
    //console.log('url',url)
    request(url).then((html)=>{
        var a = cheerio.load(html);
        //var b = a('#frm_defaultList tbody tr .ellipsis').eq(0);
        var b = a('.section_lyric .list_lyric .cntt_lyric dt').eq(0);
        
        //var c = b('.btn btn_icon_detail')
        //console.log('b',b.html());
        var c=b.html();
        if (!c){
            console.log("곡을 찾을 수 없음");
            callback("png/래코드판.png");
            return "곡을 찾을 수 없음";
        }
        else{
            var songurl = `https://www.melon.com/song/detail.htm?songId=${getisnum2_beta(c)}`
            console.log('songurl',songurl);z
            request(songurl).then((shtml)=> {
                 var sa = cheerio.load(shtml);
                var sb = sa('.wrap_info > .thumb > .image_typeAll').eq(0);
                var sc = sb.html().toString();
                var pl = sc.indexOf (`src="`)
                var sc_cut = sc.substring(pl+5,sc.length);
                var pl2 = sc_cut.indexOf(`"`);
                var sc_cut_cut = sc_cut.substring(0,pl2);
                
            //console.log('sc_cut_cut',sc_cut_cut);
            //return 가사;
            
            callback(sc_cut_cut);
        });
        }
    }).catch(()=>{
        callback("png/래코드판.png");
    });
}

function getlyrics(곡명,callback){

    //var 곡명="";
    곡명 = 곡명.trim().replace(/-/g,"").replace(/.mp3/g,"").replace(/  /g," ").replace(/\s/g,'+');
   //var url = `https://www.melon.com/search/song/index.htm?q=${encodeURIComponent(곡명)}&section=&searchGnbYn=Y&kkoSpl=N&kkoDpType=&ipath=srch_form` //전체검색
    var url=`https://www.melon.com/search/lyric/index.htm?q=${encodeURIComponent(곡명)}&ipath=srch_form`//가사검색

request(url).then((html)=>{
    
    var a = cheerio.load(html);
    
    //var b = a('#frm_defaultList tbody tr .ellipsis').eq(0);
    var b = a('.section_lyric .list_lyric .cntt_lyric dt').eq(0);
    //var c = b('.btn btn_icon_detail')
    
    var c=b.html();
    if (!c){
        console.log("곡을 찾을 수 없음");
        callback("곡을 찾을 수 없음");
        return "곡을 찾을 수 없음";
    }
    else{
    
    //console.log(c);
    //console.log(getisnum2(c));
    
    
    var songurl = `https://www.melon.com/song/detail.htm?songId=${getisnum2_beta(c)}`
        //console.log(songurl);
        request(songurl).then((shtml)=> {
            var 가사 = getlylic(shtml);
            //console.log(가사);
            //return 가사;
            
            callback(가사);
        });
    }
    
}).catch(()=>{
        callback("인터넷 연결 안 됨");
    });    
    
}


    //좀 아무것도 없이 받아오려는 방법. 어렵다! 포기.
    /*request(url).then((html)=> {
        if (html.includes("결과없음")){
            console.log("없습니다");
            return;
        }
        
        console.log(getsingnum(html));
        var songurl = `https://www.melon.com/song/detail.htm?songId=${getsingnum(html)}`
        console.log(songurl);
        request(songurl).then((shtml)=> {
            console.log(getlylic(shtml));
            
        });

    })*/
    
    
    
    /*http.get(url,(응답)=>{
        var 데이터;
        console.log(응답.headers);
        응답.on('end',()=>{
            console.log(응답);
        })
    });*/

    
//}
//cd cd %~dp0               
//node lyrics.js
                            
//app.listen(포트);

function getisnum2(html){
     //var html=`<button type="button" class="btn_icon play" title="&#xC7AC;&#xC0DD;" onclick="searchLog(&apos;web_song&apos;,&apos;SONG&apos;,&apos;SO&apos;,&apos;&#xC774;&#xBB38;&#xC138; &#xBD89;&#xC740;&#xB178;&#xC744;&apos;,&apos;612037&apos;);melon.play.playSong(&apos;26020103&apos;,612037);"><span class="odd_span">&#xC7AC;&#xC0DD;</span></button>  <button type="button" class="btn_icon add" title="&#xB2F4;&#xAE30;" onclick="searchLog(&apos;web_song&apos;,&apos;SONG&apos;,&apos;SO&apos;,&apos;&#xC774;&#xBB38;&#xC138; &#xBD89;&#xC740;&#xB178;&#xC744;&apos;,&apos;612037&apos;);melon.play.addPlayList(&apos;612037&apos;);"><span class="odd_span">&#xB2F4;&#xAE30;</span></button>  <a href="javascript:searchLog(&apos;web_song&apos;,&apos;SONG&apos;,&apos;SO&apos;,&apos;&#xC774;&#xBB38;&#xC138; &#xBD89;&#xC740;&#xB178;&#xC744;&apos;,&apos;612037&apos;);melon.link.goSongDetail(&apos;612037&apos;);" title="&#xACE1;&#xC815;&#xBCF4; &#xBCF4;&#xAE30;" class="btn btn_icon_detail"><span class="odd_span">&#xBD89;&#xC740; &#xB178;&#xC744; &#xC0C1;&#xC138;&#xC815;&#xBCF4; &#xD398;&#xC774;&#xC9C0; &#xC774;&#xB3D9;</span></a>  <span class="icon_song hot">HOT</span>  <a href="javascript:searchLog(&apos;web_song&apos;,&apos;SONG&apos;,&apos;SO&apos;,&apos;&#xC774;&#xBB38;&#xC138; &#xBD89;&#xC740;&#xB178;&#xC744;&apos;,&apos;612037&apos;);melon.play.playSong(&apos;26020103&apos;,612037);" class="fc_gray" title="&#xBD89;&#xC740; &#xB178;&#xC744;">&#xBD89;&#xC740; &#xB178;&#xC744;</a>`
        var pl=0;
        for (var i=0; i<html.length;i++){
            var text="melon.play.playSong";
            
            if (pl<text.length){
              //console.log(html[i],text[pl]);
              
                if (html[i]==text[pl]) pl++;
                else pl=0;
            }
            else if (pl=>text.length){
                pl=i;
                break;
            }
        }
pl+=8;
//console.log(pl)

var pl1=0;
var text="&apos;,";
for (var i=pl; i<html.length;i++){
  
  if (pl1<text.length){
   //console.log(html[i],text[pl]);
              
        if (html[i]==text[pl1]) pl1++;
       else pl1=0;
            }
            else if (pl1=>text.length){
                pl1=i;
                break;
            }
}
//console.log(pl1);
var k=0;
for (k=pl1;')'!=html[k];k++);
//console.log(k)

    //console.log(html.substring(pl1,k));
    return html.substring(pl1,k).trim();

}

function getisnum2_beta(html){
   var a=html.indexOf("link.goSongDetail(&apos;")
   var b=html.substr(a+24,30);
   var c=b.indexOf('&apos;)')
   return b.substr(0,c);
}

function getsingnum(html){
        
        var pl=0;
        for (var i=0; i<html.length;i++){
            var text="SONGID";
            
            if (pl<text.length){
              //console.log(html[i],text[pl]);
              
                if (html[i]==text[pl]) pl++;
                else pl=0;
            }
            else if (pl=>text.length){
                pl=i;
                break;
            }
        }
				pl+=3;

			var j;
			for (var j=0;html[pl+j]!='"';j++);
			
            //console.log(pl,j);
            //console.log(html.substring(pl,pl+j));
            singnumber = html.substring(pl,pl+j);
            return singnumber.trim();
        };
function getlylic(html){
    var text = `<div class="lyric" id="d_video_summary">`;

   var pl=0;
    for (var i=0;i<html.length;i++){
        if (pl<text.length){
            if (html[i]==text[pl]) pl++;
            else pl=0;
        }
        else if(pl==text.length){
            pl=i;
          break;
        }
    }
//console.log(pl);
    //console.log(html.substring(pl,pl+1000));

    var j=0;
 		var pjk=0;
    var text1="</div>"
    for (j=0;(pl+j)<html.length;j++){
        if (pjk<text1.length){
            if (html[pl+j]==text1[pjk]) pjk++;
            else pjk=0;
        }
        else if(pjk==text1.length){
          pjk=j-text1.length;
          break;
        }
    }
	//console.log(pl,pl+pjk);
    
    //console.log(html.substring(pl,pl+pjk));
    return html.substring(pl,pl+pjk).trim();
    
};

