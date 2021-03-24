
document.getElementById('queue').addEventListener('drop',(e)=>{
    e.preventDefault();
    console.log(e,e.dataTransfer.files)
    FILES=e.dataTransfer.files
    for (var i=0; i<FILES.length;i++)
        if (FILES[i].type=='audio/mpeg') add_file(FILES[i])
});

function add_file(file){
    var name=file.name.replace(/.mp3/,'')
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload=(e)=>{
        singqueue.push(new Singlist(name,reader.result));
        change_queue()
    }
}
document.getElementById('queue').addEventListener('dragenter',(e)=>{})
document.getElementById('queue').addEventListener('dragleave',(e)=>{})
document.getElementById('queue').addEventListener('dragover',(e)=>{e.stopPropagation();e.preventDefault();})