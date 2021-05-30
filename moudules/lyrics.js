//const fs=require("fs");
//const http = require("http");
const cheerio = require('cheerio') // 이거 외부모듈.
//const 포트 = 6868;
const https = require('https');
const dns = require('dns')

module.exports.getlyrics = getlyrics;
module.exports.getsongimg = getsongimg;

function mp_https(url,callback){
    //console.log('my-http');
    dns.resolve('www.melon.com', function (err, addr) {
        if (err) {
            console.log('네트워크 연결 안 됨');
            callback(undefined);
        }
        else {
            https.get(url, (res, err) => {
                if(err) console.log('resolve err', err);
                var data;
                res.on('error', () => {callback(undefined) });
                res.on('data', (chunk) => {  data += chunk; });
                res.on('end', () => { callback(data) });
            });
        }
    });
}

function get_gong_id(곡명, callback){
    function getisnum2_beta(html) {
        var a = html.indexOf("melon.link.goSongDetail('")
        var b = html.substr(a + 25, 30);
        var c = b.indexOf("');")
        return b.substr(0, c);
    }
    
    곡명 = 곡명.trim().replace(/-/g,"").replace(/.mp3/g,"").replace(/  /g," ").replace(/\s/g,'+');
   //var url = `https://www.melon.com/search/song/index.htm?q=${encodeURIComponent(곡명)}&section=&searchGnbYn=Y&kkoSpl=N&kkoDpType=&ipath=srch_form` //전체검색
    var url=`https://www.melon.com/search/lyric/index.htm?q=${encodeURIComponent(곡명)}&ipath=srch_form`//가사검색
    //console.log('url',url)
    mp_https(url,(html)=>{
        if(!html){
            callback(undefined);
            return;
        }
        var a = cheerio.load(html);
        //var b = a('#frm_defaultList tbody tr .ellipsis').eq(0);
        var b = a('.section_lyric .list_lyric .cntt_lyric dt').eq(0);

        //var c = b('.btn btn_icon_detail')
        //console.log('b',b.html());
        var c = b.html();
        //console.log(c)
        if (!c) {
            console.log("곡을 찾을 수 없음");
            callback(undefined);
            return "곡을 찾을 수 없음";
        } else callback(getisnum2_beta(c)); 
    });
}               

function getsongimg(곡명,callback) {
    get_gong_id(곡명, (id)=>{
     if (!id) {
         console.log("곡을 찾을 수 없음");
         callback("png/래코드판.png");
     } else {
         var songurl = `https://www.melon.com/song/detail.htm?songId=${id}`;
         //console.log('songurl', songurl);
         mp_https(songurl, (shtml) => {
             var sa = cheerio.load(shtml);
             var sb = sa('.wrap_info > .thumb > .image_typeAll').eq(0);
             var sc = sb.html().toString();
             var pl = sc.indexOf(`src="`)
             var sc_cut = sc.substring(pl + 5, sc.length);
             var pl2 = sc_cut.indexOf(`"`);
             var sc_cut_cut = sc_cut.substring(0, pl2);
             callback(sc_cut_cut);
         });
    }
})
}

function getlyrics(곡명, callback){
    get_gong_id(곡명, (id)=>{
        //console.log('id',id)
        if (!id){
            console.log("곡을 찾을 수 없음");
            callback("곡을 찾을 수 없음");
        }else{
        var songurl = `https://www.melon.com/song/detail.htm?songId=${id}`
        //console.log(songurl)
        mp_https(songurl, (shtml)=> {
            var sa = cheerio.load(shtml);
            var sb = sa('#d_video_summary').eq(0);
            var sc = sb.html().toString();
            callback(sc);
        });
    }
});
}

//getlyrics("가수 - 제목");