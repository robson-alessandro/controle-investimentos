const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.listen('4567')
app.use(express.json());


app.get('/',(req, res)=>{
    
    return res.json({message:'ok'})
})



app.post('/compra',(req,res)=>{
   
    console.log(req.body)
    res.json('salvo')
})


