//const app = express();
var url = require("url");
const fs=require("fs");
const port = 6868;
var http = require("http");
const lyric = require("./lyrics");

//const cheerio = require('cheerio');
//const request = require('request-promise');

function is_(xx){
    if (xx.includes('/')) return 0;
    else if (xx.includes('../')) return 0;
    else if (xx.includes('C%3A%2F')) return 0;
    else return 1;
}

function is_music_URL(xx){
    if (xx.indexOf("/music/")!=0) return 0;
    return is_(xx.substring(7,xx.length));
}

function is_lyrics_url(xx){
    if (xx.indexOf("/lyrics/")!=0) return 0;
    return is_(xx.substring(8,xx.length));
}

function is_css_url(xx){
    if (xx.indexOf(".css")!=xx.length-4) return 0;
    return is_(xx.substring(1,xx.length-4));
}
function is_js_url(xx){
    if (xx.indexOf(".js")!=xx.length-3) return 0;
    return is_(xx.substring(1,xx.length-3));
}

function is_song_img(xx){
    if (xx.indexOf("/singimg/")!=0) return 0;
    return is_(xx.substring(9,xx.length));
}

function is_png(xx){
    if (xx.indexOf("/png/")!=0) return 0;
    if (! xx.includes(".png")) return 0;
    return is_(xx.substring(5,xx.length));
}

var app = http.createServer(function(요청, 응답){   
    var _url = 요청.url;
    let date=new Date();
    //console.log(_url);
    //,요청.headers.host
    console.log(date, 요청.headers['user-agent'],decodeURIComponent(_url));
    //0.
    if (_url=="/"){
        fs.readFile('index.html','utf-8',(E,파일)=>{
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }
    else if(is_css_url(_url)){
        var cssurl=_url.substring(1,_url.length);
        //console.log('css',_url);
        fs.readFile(cssurl,'utf-8',(E,파일)=>{
            var 확장자 = 'text/css; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }else if(is_js_url(_url)){
        var cssurl=_url.substring(1,_url.length);
        //console.log('css',cssurl);
        fs.readFile(cssurl,'utf-8',(E,파일)=>{
            var 확장자 = 'text/JavaScript; charset=utf-8';
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }
    //1.0. 곡 목록 전송 (배열) - 안씀
    else if (_url=="/music_list"){
        var 곡목록=[];
        var out_html="";
        var out_json="[";

        fs.readdir('./',(E,파일목록)=>{
            for (var i=0; i<파일목록.length; i++){
                if (파일목록[i].includes(".mp3")){
                     곡목록.push(파일목록[i]);
                    out_html+=`<div name="${파일목록[i]}">${파일목록[i]}</div>`;
                    out_json+='`'+파일목록[i].replace(/.mp3/g,"")+'`'+',';
                }
            }
            out_json+=']';

            var 데이터 =  out_json; //out_html.toString().replace(/.mp3/g,"");
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );

            //console.log(데이터);
            응답.end(데이터);
        });
        
    }
    //1.1. 곡 목록 전송 (html)
     else if (_url=="/music_html_list"){
        var 곡목록=[];
        var out_html="";
        var cnt=0;
         
        var promis_list=[];
         
            promis_list.push(new Promise((resolve,reject)=>{
 
        fs.readdir(`C:\\Users\\damit\\Music\\`,(E,파일목록)=>{
            //console.log(파일목록);
            for (var i=0; i<파일목록.length; i++){
                if (파일목록[i].includes(".mp3")){
                     곡목록.push(파일목록[i]);
                    out_html+=`<div title="${파일목록[i]}">${파일목록[i]}</div>`;
                    //out_json+='`'+파일목록[i].replace(/.mp3/g,"")+'`'+',';
                    cnt++;
                }
                
                else if (파일목록[i].includes("'")){
                    var 볼_파일 = 파일목록[i];
                    //console.log(볼_파일);
                    
                    promis_list.push(new Promise((resolve,reject)=>{
                    var 볼볼파일 = 볼_파일;
                    fs.readdir(`C:\\Users\\damit\\Music\\${볼볼파일}`,(E,파일목록내)=>{
                        for (var j=0; j<파일목록내.length; j++){
                            if (파일목록내[j].includes(".mp3")){
                             곡목록.push(파일목록내[j]);
                            out_html+=`<div title="${볼볼파일}/${파일목록내[j]}">${파일목록내[j]}</div>`;
                                cnt++;
                            }
                        }
                    });
                        resolve(2);
                    }));
                }
            }
            //console.log(out_html);
            resolve(1);
        })
                    
                    }) );
         
         setTimeout(()=>{
         Promise.all(promis_list).then(function(values){
              //console.log(values);
        //console.log(out_html);
             var 데이터 =  out_html.toString().replace(/.mp3/g,"");
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );

            console.log("데이터의 길이 출력: ", cnt);
            응답.end(데이터);
});
             
         },200);
    }
    
    //2 mp3파일 전송
    else if (is_music_URL(_url)){
        
        //console.log(_url);
        var 확장자='audio/mpeg'
        var music_name=decodeURIComponent(_url.substring(7,_url.length));
        //console.log(music_name);
        
        //곡 로그 작성
        var log=`${date.toString()},"${music_name}"`+'\n';
        console.log('로그',log);
        fs.appendFile("log.csv", log,(log)=>{});
        fs.readFile(`C:\\Users\\damit\\Music\\`+music_name,(E,파일)=>{
            if (!E){
                //console.log("오류안남");
            응답.writeHead(200, {'Content-Type':확장자, 'Accept-Ranges': 'bytes', 'Content-Length': 파일.length.toString()} );
            응답.end(파일);
                //console.log("파일길이",파일.length);//currentTime 설정
                }
            else{
                console.log("오류남");
                응답.writeHead(404, {'Content-Type':'html/text'} );
                응답.end("없슈");
            }
        });
    }
    
    //3 가사전송
    else if (is_lyrics_url(_url)){
        var music_name=decodeURIComponent(_url.substring(8,_url.length));
        //console.log(music_name);
        lyric.getlyrics(music_name,(가사)=>{
        var 확장자 = 'text/html; charset=utf-8';
        if(가사=="인터넷 연결 안 됨")  응답.writeHead(500, {'Content-Type':확장자} );
        else 응답.writeHead(200, {'Content-Type':확장자} );
        응답.end(가사);
        });   
    }
    //4 앨범 아트 주소 전송
    else if (is_song_img(_url)){
        var music_name=decodeURIComponent(_url.substring(9,_url.length));
       // console.log(music_name);
        
        lyric.getsongimg(music_name,(가사)=>{
        var 확장자 = 'text/html; charset=utf-8';
            
       if(가사=="png/래코드판.png")  응답.writeHead(500, {'Content-Type':확장자} );
        else 응답.writeHead(200, {'Content-Type':확장자} );
        응답.end(가사);
        });
    }    
    //5 래코드판
    else if (is_png(_url)){
        var png_name=decodeURIComponent(_url.substring(5,_url.length));
        //console.log("png_name",png_name);
        fs.readFile(`${png_name}`,(E,파일)=>{
         var 확장자='image/png';
            //console.log("파일",파일);
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
    })
    }
    //없으면
    else{
        console.log("404 방금 수상했음");
         var 확장자='text/html; charset=utf-8';
        응답.writeHead(404, {'Content-Type':확장자} );
        응답.end("404, 수상한 행동이 감지됨");
    }
    
});

app.listen(port);
console.log(`${port}번 포트에서 실행`)