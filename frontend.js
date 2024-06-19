const botaoCompra = document.querySelector('#botao_compra');
const botaoVenda = document.querySelector('#botao_venda');
const botaoDividendo = document.querySelector('#botao_dividendo');
const tabelaTodosInvs = document.querySelector('.tabela_todos_investimentos')
const tabelaDividendos = document.querySelector('.tabela_dividendos')
const tabelaQuatidadeInvestimento = document.querySelector('.tabela_quantidade')




//criar os objetos para armazenar os dados vindos dos formularios

const Compras = {
    init:function(nome,tipo,data,quantidade,valor,primeiraCompra){
        this.nome = nome
        this.tipo = tipo
        this.data = data
        this.quantidade = quantidade
        this.valor = valor
        this.primeiraCompra = primeiraCompra
    }
}

const Vendas = {
    init:function(nome,data,quantidade,valor){
        this.nome = nome
        this.data = data
        this.quantidade = quantidade
        this.valor = valor
    }
}

const Dividendos = {
    init:function(nome,data,valor){
        this.nome = nome
        this.data = data
        this.valor = valor
    }
}

// função para pegar os valores do formulario de compra
botaoCompra.addEventListener('click',async (event)=>{
    event.preventDefault();

    const nomeInvestimentoCompra = document.getElementById('nome_compra_investimento')
    const tipoInvestimento = document.getElementById('tipo_compra_investimento')
    const dataInvestimento = document.getElementById('data_compra_investimento')
    const quantidadeInvestimento = document.getElementById('quantidade_compra_investimento')
    const valorCompra = document.getElementById('valor_compra_investimento')
    const primeiraCompra = document.getElementById('primeira_compra')

    const compra = new Object(Compras)
    compra.init(nomeInvestimentoCompra.value.toUpperCase(),tipoInvestimento.value,dataInvestimento.value,quantidadeInvestimento.value,valorCompra.value)

    if(primeiraCompra.checked){
        let erro = false
        await axios.post(`http://localhost:4567/primeiracompra`,compra)
        .then(({data}) =>  {
            if(data.sqlMessage == undefined){
                alert('salvo')
            }else{
                alert(`${data.sqlMessage}`)
                erro=true
            }
        })    
        
        if(!erro){
            await axios.post(`http://localhost:4567/compra`,compra)
            .then(({data}) =>  alert(data.sqlMessage == undefined ?`compra salva`:`${data.sqlMessage}`))
        }
         
    }else{
        await axios.post(`http://localhost:4567/compra`,compra)
        .then(({data}) =>  alert(data.sqlMessage == undefined ?`compra salva`:`${data.sqlMessage}`))

    }
    
    nomeInvestimentoCompra.value = ''
    tipoInvestimento.value = ''
    dataInvestimento.value = ''
    quantidadeInvestimento.value = ''
    valorCompra.value = ''
    primeiraCompra.checked = false
})

// função para pegar os valores do formulario de venda
botaoVenda.addEventListener('click' ,async (event)=>{
    event.preventDefault();
    const nomeInvestimentoVenda = document.getElementById('nome_venda_investimento')
    const dataVenda = document.getElementById('data_venda_investimento')
    const quantidadeVenda = document.getElementById('quantidade_venda_investimento')
    const valorVenda = document.getElementById('valor_venda_investimento')

    const venda = new Object(Vendas)
    venda.init(nomeInvestimentoVenda.value.toUpperCase(),dataVenda.value,quantidadeVenda.value,valorVenda.value);

    await axios.post(`http://localhost:4567/venda`,venda)
        .then(({data}) =>  alert(data.sqlMessage == undefined ?'movimentação de venda salva':`${data.sqlMessage}`))
    
    nomeInvestimentoVenda.value = ''
    dataVenda.value = ''
    quantidadeVenda.value = ''
    valorVenda.value = '' 
})

// função para pegar os valores do formulario de dividendo
botaoDividendo.addEventListener('click',async(evet) =>{
    evet.preventDefault();

    const nomeInvestimentoDividendo = document.getElementById('nome_dividendo_investimento')
    const dataDividendo = document.getElementById('data_dividendo_investimento')
    const valorDividendo = document.getElementById('valor_dividendo_investimento')

    const dividendo = new Object(Dividendos)
    dividendo.init(nomeInvestimentoDividendo.value.toUpperCase(),dataDividendo.value,valorDividendo.value)

    await axios.post(`http://localhost:4567/dividendo`,dividendo)
    .then(({data}) =>  alert(data.sqlMessage == undefined ?'dividendo salvo':`${data.sqlMessage}`))

    nomeInvestimentoDividendo.value = ''
    dataDividendo.value = ''
    valorDividendo.value = ''
})

//conectar com backend
async function getcontent(){
    try{
        const resposta = await fetch('http://localhost:4567/')
        const dados = await resposta.json()
        console.log(dados)
    }catch(error){
        console.error(error)
    }
}
//recebe a data do banco de dados e retorna ela formatada
function formatarData(data){
    let novaData=data.split('T')
    novaData = ` ${novaData[0][8]+novaData[0][9]+'/'+novaData[0][5]+novaData[0][6]+'/'+novaData[0][0]+novaData[0][1]+novaData[0][2]+novaData[0][3]}`
    return novaData

}

//recebe o nome do investimento e a lista de investimentos, faz a soma de todos os dividendos e retorna o total
function somarValores(nome,lista){
    let total = 0
    lista.forEach(element =>{
        
        if(element['nome'] == nome){
            total += parseFloat(element['valor'])
        }
    })

    return total

}

// retorna os investimentos no banco de dados e os coloca em um tabela e apresenta eles no html
async function consultaSql(){
    
    let dados
    dados=await fetch('http://localhost:4567/dados')
    dados = await dados.json()
    

    dados.forEach(element => {
        
        let linha = document.createElement('tr')
        let coluna1 = document.createElement('td')
        coluna1.innerHTML=element['nome']
        linha.appendChild(coluna1)

        let coluna2 = document.createElement('td')
        coluna2.innerHTML = element['tipo']
        linha.appendChild(coluna2)

        let coluna3 = document.createElement('td')
        coluna3.innerHTML =  formatarData(element['data_compra'])
        linha.appendChild(coluna3)
        
        tabelaTodosInvs.appendChild(linha)
    
    });
    
    
}

// faz o pedido ao backend para retornar os valores do dividendos
async function consultarDividendos(){
    let listaInvestimento = []
    let dados 
    dados = await fetch ('http://localhost:4567/dividendos')
    dados = await dados.json()

    dados.forEach(element =>{
        if(!listaInvestimento.includes(element['nome'])){
            let linha = document.createElement('tr')
        
            let coluna1 = document.createElement('td')
            coluna1.innerHTML = element['nome']
            linha.appendChild(coluna1)

            let coluna2 = document.createElement('td')
            coluna2.innerHTML =  formatarData(element['data_dividendo'])
            linha.appendChild(coluna2)

            let coluna3 = document.createElement('td')
            coluna3.innerHTML = somarValores(element['nome'],dados)
            linha.appendChild(coluna3)

            listaInvestimento.push(element['nome'])

            tabelaDividendos.appendChild(linha) 
        }
        
    })


}
async function consultarQuantidadesInvestimentos(){
    let dados
    let listaInvestimentos = []
    dados = await fetch('http://localhost:4567/movimentacao')
    dados = await dados.json()

    dados.forEach(element=>{
        let totalInventimentos=0
        let totalQuantInvestimento=0
        if(!listaInvestimentos.includes(element['nome'])){
            listaInvestimentos.push(element['nome'])
            dados.forEach(valor=>{
                if(valor['nome']==element['nome']){
                    if(element['tipo'] == 'compra'){
                        totalInventimentos +=element['valor']
                        totalQuantInvestimento += element['quantidade']
                    }else{
                        totalInventimentos -=element['valor']
                        totalQuantInvestimento -= element['quantidade']
                    }
                }
            
            })

            let linha = document.createElement('tr')

            let coluna1 = document.createElement('td')
            coluna1.innerHTML=element['nome']
            linha.appendChild(coluna1)

            let coluna2 = document.createElement('td')
            coluna2.innerHTML=totalQuantInvestimento
            linha.appendChild(coluna2)

            let coluna3 = document.createElement('td')
            coluna3.innerHTML=totalInventimentos
            linha.appendChild(coluna3)

            tabelaQuatidadeInvestimento.appendChild(linha)   
        }
    
    })
    

}
consultaSql()
consultarDividendos()
consultarQuantidadesInvestimentos()



