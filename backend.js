const cors = require('cors')
const express = require('express')
const app = express()
const mysql = require ('mysql2')

const conennection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'investimento'

});

app.use(cors())
app.listen('4567')
app.use(express.json());


app.get('/',(req, res)=>{
    
    return res.json({message:'ok'})
})



//recebe os dados da movimentação de compra caso seja a primeira compra para cadastrar na tabela de investimentos
app.post('/primeiracompra',(req,res)=>{
    conennection.query("INSERT INTO investimentos VALUE (?,?,?)",[req.body.nome, req.body.tipo,
        req.body.data],(err)=>{
            if(err){
                return res.json(err)
            }
            return res.json('passou')
        })
})

//recebe os dados da movimentação de compra
app.post('/compra',(req,res)=>{
    conennection.query("INSERT INTO movimentacoes VALUE (?,?,?,?,?)",[req.body.nome, req.body.data, 
        req.body.quantidade, req.body.valor, 'compra'],(err)=>{
        if(err){
            return res.json(err)
        }
        
        return res.json('passou')
    })
})

//recebe os dados da movimentação de venda
app.post('/venda',(req ,res) =>{
    conennection.query("INSERT INTO movimentacoes value(?,?,?,?,?)",[req.body.nome, req.body.data, req.body.quantidade, req.body.valor,'venda'],
    (err)=>{
        if(err){
            return res.json(err)
        }
        return res.json('passou')
    })
})

//recebe os dados da movimentação de dividendo
app.post('/dividendo',(req,res)=>{
    conennection.query("INSERT INTO dividendos VALUE (?,?,?)",[req.body.nome, req.body.data, req.body.valor],
    (err)=>{
        if(err){
            return res.json(err)
        }
        return res.json('passou')
    })
    
})

// recebe o pedido do frontend para retornar a lista com todos os investimentos
app.get('/dados',(req, res)=>{
    conennection.query("SELECT * FROM investimentos ORDER BY data_compra",function(error,result,field){
        
        return res.json(result)
        
    })
    
})


