## 음악 파일 재생기 + mp3 메타데이터 분석 + 노래 가사 크롤러

- node.js 서버를 실행한 뒤, 접속하는 형식임 (node.js 설치필요)
- 음악 파일의 ID3v2 테그를 읽어 [(moudules/ID3v2_parse.js)](https://esctabcapslock.github.io/jsmusicplayer/moudules/ID3v2_parse.js) 가사와 엘밤아트를 가져옴
- 그래도 없다면, [멜론](https://www.melon.com)을 크롤링해서 가사와 엘범아트를 가져옴. (내장 모듈 사용)
- html은 cheerio 모듈을(외부 모듈) 사용해서 분석함.
- pkg를 이용해 exe 파일로 만들 수 있음.
- 사용자 인터페이스 환경 [미리보기](https://esctabcapslock.github.io/jsmusicplayer/assets/)
