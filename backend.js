const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.listen('4567')
app.use(express.json());


app.get('/',(req, res)=>{
    
    return res.json({message:'ok'})
})



//recebe os dados da movimentação de compra
app.post('/compra',(req,res)=>{
    console.log(req.body)
    res.json('dados compra salvo')
})

//recebe os dados da movimentação de venda
app.post('/venda',(req ,res) =>{
    console.log(req.body)
    res.json('dados venda salvo')
})

//recebe os dados da movimentação de dividendo
app.post('/dividendo',(req,res)=>{
    console.log(req.body)
    res.json('dados dividendo salvo')
})



