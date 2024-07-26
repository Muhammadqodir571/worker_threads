const http = require('http')
const {Worker} = require('worker_threads');

const app = http.createServer((req,res)=>{
if(req.url === '/no-blocking'){
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end('server no-blocking run works');
}else if(req.url === '/blocking'){
   const worker = new Worker('./worker-thread.js')
   worker.on('message', (count)=>{
    res.writeHead(200, {"Content-Type":"text/plain"});
       res.end(`this blocking ${count}`)

   })
}else{
    
    res.end(`not found`)
}


});
const PORT = process.env.PORT ||3000

app.listen(PORT, ()=>{console.log(`server running on Port:${PORT}`)})

