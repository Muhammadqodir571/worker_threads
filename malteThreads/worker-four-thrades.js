const express = require('express')
const {Worker} = require('node:worker_threads')

const app = express()
const PORT = process.env.PORT ||3000;
const THREAD_COUNT = 4;

app.get('/no-blocking',(req,res)=>{
    res.status(200).send('this non-blocking ')
});
function createWorker(){
    return new Promise((resolve,rejects)=>{
        const worker = new Worker('./prantsPort.js',{
            workerData:{thread_count:THREAD_COUNT}
        });
        worker.on('message',(data)=>{
            resolve(data)
    
        })
        worker.on('error',(error)=>{
            rejects(`this blocking ${error}`)
    
        })
    })
}
app.get('/blocking',async(req,res)=>{
   const workerPromise = [];
   for(let i = 0; i< THREAD_COUNT;i++){
       workerPromise.push(createWorker())

   }
   const thread_results = await Promise.all(workerPromise)
   const total = thread_results[0]+
                 thread_results[1]+
                 thread_results[2]+
                 thread_results[3]
                 res.status(200).send(`this blocking ${total}`)
})


app.listen(PORT, ()=>{
    console.log(`Sever running on the port:${PORT}`)
})