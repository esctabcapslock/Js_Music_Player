const fs=require("fs");
const port = 6868;
var http = require("http");
const lyric = require("./moudules/lyrics");
const ID3v2_parse = require("./moudules/ID3v2_parse").ID3v2_parse;
const homedir = require("os").userInfo().homedir;

//음악추천을 위함
const exec = require('child_process').exec; 
//exec("start cmd /k \"%cd%\\recommend\\음악추천.exe\"", {encoding: 'utf-8'},(err,result,stderr) => {console.log('python server,', result)})
//exec(`Explorer http://127.0.0.1:6868`, {encoding: 'utf-8'},(err,result,stderr) => {})

function is_this_URL(xx, dir, mime){
    function is_(xx){
        if ( xx.includes('..') || xx.includes('%3A%2F') || ((xx.includes('/') || xx.includes('\\') || xx.includes('%5C') || xx.includes('%2F')) && (!xx.includes("'") && !xx.includes('%27')))) return 0;
        else return 1;
    }
    if (dir && xx.indexOf(dir)!=0) return 0;
    if (mime && !xx.includes(mime)) return 0;
    return is_(xx.substring(dir.length+!!mime,xx.length-mime.length));
}

function gettitle(x,괄호도제거해){
    function 괄호(str,gal){var out='', c=0;
    for(var i=-1; str[++i];){
    if(str[i]==gal[1]){if(c%2) c++;}
    else if(str[i]==gal[0]){if(!(c%2)) c++}
    else{if(!(c%2)) out+=str[i]}
    } return out} //괄호 제거
    
    x= x.replace(/<span>/g,"").replace(/<\/span>/g,"").replace(/"01\."/g, '').replace(/02\./g, '').replace(/03\./g, '').replace(/04\./g, '').replace(/05\./g, '').replace(/06\./g, '').replace(/07\./g, '').replace(/08\./g, '').replace(/09\./g, '').replace(/10\./g, '').replace(/11\./g, '').replace(/12\./g, '').replace(/13\./g, '').replace(/14\./g, '').replace(/\s\s/g, ' ').replace(/  /g,'').replace(/1집/g, '').replace(/2집/g, '').replace(/3집/g, '').replace(/4집/g, '').replace(/5집/g, '').replace(/6집/g, '').replace(/7집/g, '').replace(/8집/g, '')
    return 괄호도제거해 ? 괄호(괄호(x,'()'),'[]').replace(/  /g,'') : x;
}

var app = http.createServer(function(요청, 응답){   
    var _url = 요청.url;
    let date=new Date();
    console.log(date, 요청.headers['user-agent'],decodeURIComponent(_url));
    //0.
    if (_url=="/"){
        fs.readFile('assets/index.html','utf-8',(E,파일)=>{
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }
    else if(is_this_URL(_url,'','.css')){
        var cssurl=_url.substring(1,_url.length);
        //console.log('css',_url);
        fs.readFile('assets/'+cssurl,'utf-8',(E,파일)=>{
            var 확장자 = 'text/css; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }else if(is_this_URL(_url,'','.js')){
        var cssurl='assets/'+_url.substring(1,_url.length);
        //console.log('css',cssurl);
        fs.readFile(cssurl,'utf-8',(E,파일)=>{
            var 확장자 = 'text/JavaScript; charset=utf-8';
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }
    //1.1. 곡 목록 전송 (html)
    else if (_url=="/music_html_list" || _url=="/music_json_list"){
        var 곡목록=[];
        var out_html="";
        var out_json="[";
        var cnt=0;
 
        fs.readdir(homedir+`\\Music\\`,(E,파일목록)=>{
            //console.log(파일목록);
            for (var i = 0; i < 파일목록.length; i++) {
                if (파일목록[i].includes(".mp3")) {
                    곡목록.push(파일목록[i]);
                    out_html += `<div title="${파일목록[i]}">${파일목록[i]}</div>`;
                    out_json+=`"${파일목록[i].replace(/.mp3/g,"")}",`
                    cnt++;
                } else if (파일목록[i].includes("'")) {
                    var 파일목록내 = fs.readdirSync(homedir + `\\Music\\${파일목록[i]}`)
                    for (var j = 0; j < 파일목록내.length; j++) {
                        if (파일목록내[j].includes(".mp3")) {
                            곡목록.push(파일목록내[j]);
                            out_html += `<div title="${파일목록[i]}/${파일목록내[j]}">${파일목록내[j]}</div>`;
                            out_json+=`"${파일목록[i]}/${파일목록내[j].replace(/.mp3/g,"")}",`;
                            cnt++;
                        }
                    }
                }  
            }
            
            if(_url=="/music_html_list"){
                var 데이터 =  out_html.toString().replace(/.mp3/g,"");
                var 확장자 = 'text/html; charset=utf-8'
            }else{
                var 데이터 = out_json+']';
                var 확장자 = 'text/JavaScript; charset=utf-8'
            }
            응답.writeHead(200, {'Content-Type':확장자} );
            console.log("데이터의 길이 출력: ", cnt);
            응답.end(데이터);
        })
    }
    //2 mp3파일 전송
    else if (is_this_URL(_url,'/music/','')){
        
        //console.log(_url);
        var 확장자='audio/mpeg'
        var music_name=decodeURIComponent(_url.substring(7,_url.length));
        //console.log(music_name);
        
        //곡 로그 작성
        var log=`${date.toString()},"${music_name}"`;//+'\n';
        //console.log('로그',log);
        fs.appendFile("assets/log.csv", log+'\n',(log)=>{});
        fs.readFile(homedir+`\\Music\\`+music_name,(E,파일)=>{
            if (!E){
            응답.writeHead(200, {'Content-Type':확장자, 'Accept-Ranges': 'bytes', 'Content-Length': 파일.length.toString()} );
            응답.end(파일);
            }else{
                console.log("오류남");
                응답.writeHead(404, {'Content-Type':'html/text'} );
                응답.end("없슈");
            }
        });
    }
    //3 가사전송
    else if (is_this_URL(_url,'/lyrics/','')){
        var music_url=decodeURIComponent(_url.substring(8,_url.length));
        let tmp = music_url.split('/');
        music_name = gettitle(tmp[tmp.length-1],true)
        //console.log(music_name);
        
        fs.readFile(homedir+`\\Music\\`+music_url+'.mp3',(E,파일)=>{
            if (E){
                //console.error('err, 없는 파일!!')
                lyric.getlyrics(music_name,(가사)=>{
                var 확장자 = 'text/html; charset=utf-8';
                if(가사=="곡을 찾을 수 없음")  응답.writeHead(500, {'Content-Type':확장자} );
                else 응답.writeHead(200, {'Content-Type':확장자} );
                응답.end(가사);
                });
            }else{
                ID3v2_parse(파일,(data)=>{
                    console.log('ID3v2_parse - get',data)
                    if(data.가사){ //음악 파일 안에 든거
                        응답.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
                        응답.end(data.가사.replace(/\n/g,'<br>'));   
                    }else{ // 인터넷 검색
                        lyric.getlyrics(music_name,(가사)=>{
                        var 확장자 = 'text/html; charset=utf-8';
                        if(가사=="곡을 찾을 수 없음")  응답.writeHead(500, {'Content-Type':확장자} );
                        else 응답.writeHead(200, {'Content-Type':확장자} );
                        응답.end(가사);
                        });   
                    }
                })
            }
        });
    }
    //4 앨범 아트 주소 전송
    else if (is_this_URL(_url,'/singimg/','')){
        var music_url=decodeURIComponent(_url.substring(9,_url.length));
        let tmp = music_url.split('/');
        music_name = gettitle(tmp[tmp.length-1],true)
        //console.log('reand',music_url);
        fs.readFile(homedir+`\\Music\\`+music_url+'.mp3',(E,파일)=>{
            if (E){
                //console.error('에러! 없는 파일')
                lyric.getsongimg(music_name,(가사)=>{
                var 확장자 = 'text/html; charset=utf-8';
                if(가사=="png/래코드판.png")  응답.writeHead(500, {'Content-Type':확장자} );
                else 응답.writeHead(200, {'Content-Type':확장자} );
                응답.end(가사);
                });
            }else{
                ID3v2_parse(파일,(data)=>{
                    //console.log('ID3v2_parse - get',data)
                    if(data.엘범아트){ // 음악 파일 안에 든거
                        var send_url=`data:${data.엘범아트.MIME_type};base64,${data.엘범아트.Picture_data.toString('base64')}`;
                        응답.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
                        응답.end(send_url);   
                    }else{
                        if(music_url.includes('/')){
                            fs.readdir(homedir+`\\Music\\`+'./'+music_url.split('/')[0],(E,list)=>{
                            if(list.includes('Folder.jpg')){ // 같은 폴더 안에 이미지 있는거
                                fs.readFile(homedir+`\\Music\\`+music_url.split('/')[0]+'\\Folder.jpg',(E,파일)=>{
                                    if(E) console.log(E)
                                    var send_url=`data:image/jpeg;base64,${파일.toString('base64')}`;
                                    응답.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
                                    응답.end(send_url);
                                });
                            }else{ // 이도저도 아님
                                lyric.getsongimg(music_name,(가사)=>{
                                var 확장자 = 'text/html; charset=utf-8';
                                if(가사=="png/래코드판.png")  응답.writeHead(500, {'Content-Type':확장자} );
                                else 응답.writeHead(200, {'Content-Type':확장자} );
                                응답.end(가사);
                                });
                            }
                        });}else{ //이도저도 아님 2
                            lyric.getsongimg(music_name,(가사)=>{
                            var 확장자 = 'text/html; charset=utf-8';
                            if(가사=="png/래코드판.png")  응답.writeHead(500, {'Content-Type':확장자} );
                            else 응답.writeHead(200, {'Content-Type':확장자} );
                            응답.end(가사);
                            });
                        }
                    }
                })
            }
        });
    }
    //5 래코드판
    else if (is_this_URL(_url,'/png/','.png')){
        var png_name=decodeURIComponent(_url.substring(5,_url.length));
        //console.log("png_name",png_name);
        fs.readFile(`assets/${png_name}`,(E,파일)=>{
         var 확장자='image/png';
            //console.log("파일",파일);
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
    })
    }
    //없으면
    else{
        console.log("404, 경우에 없는 경우");
         var 확장자='text/html; charset=utf-8';
        응답.writeHead(404, {'Content-Type':확장자} );
        응답.end("404, 수상한 행동이 감지됨");
    }
});

app.listen(port);
console.log(`${port}번 포트에서 실행`)