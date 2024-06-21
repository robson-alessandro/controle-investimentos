const botaoCompra = document.querySelector('#botao_compra');
const botaoVenda = document.querySelector('#botao_venda');
const botaoDividendo = document.querySelector('#botao_dividendo');
const tabelaInvestimentos = document.querySelector('.tabela_investimentos')

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

const Investimento = {
    init:function(nome,tipo, dataCompra, totalDividendos, quantidade, totalInvestido){
        this.nome = nome
        this.tipo = tipo
        this.dataCompra = dataCompra
        this.totalDividendos = totalDividendos
        this.quantidade = quantidade
        this.totalInvestido = totalInvestido
    }
}

// função para pegar os valores do formulario de compra
botaoCompra.addEventListener('click',async (event)=>{
    event.preventDefault();
    let  tipoInvestimento

    const nomeInvestimentoCompra = document.getElementById('nome_compra_investimento') 
    const dataInvestimento = document.getElementById('data_compra_investimento')
    const quantidadeInvestimento = document.getElementById('quantidade_compra_investimento')
    const valorCompra = document.getElementById('valor_compra_investimento')
    const primeiraCompra = document.getElementById('primeira_compra')
    const botaoRadioAcao = document.getElementById('acao')
    const botaoRadioFundoInv = document.getElementById('fundo_imobiliario')

    if(botaoRadioAcao.checked){
        console.log(botaoRadioAcao.checked)
        tipoInvestimento = 'ação'
        
    }
    if(botaoRadioFundoInv.checked){
        console.log(botaoRadioFundoInv.checked)
        tipoInvestimento = 'fundo imobiliario' 
    }

    const compra = new Object(Compras)
    compra.init(nomeInvestimentoCompra.value.toUpperCase(),tipoInvestimento,dataInvestimento.value,quantidadeInvestimento.value,valorCompra.value)

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
    dataInvestimento.value = ''
    botaoRadioAcao.checked = false
    botaoRadioFundoInv.checked = false
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

//recebe a data do banco de dados e retorna ela formatada
function formatarData(data){
    let novaData=data.split('T')
    novaData = ` ${novaData[0][8]+novaData[0][9]+'/'+novaData[0][5]+novaData[0][6]+'/'+novaData[0][0]+novaData[0][1]+novaData[0][2]+novaData[0][3]}`
    return novaData

}

//recebe o nome do investimento e a lista de investimentos, faz a soma de todos os dividendos e retorna o total
function somarValoresDividendos(nome,lista){
    let total = 0
    lista.forEach(element =>{
        
        if( element['nome'] == nome ){
            total += parseFloat(element['valor'])
        }
    })

    return total
}

//recebe o nome do investimento e a lista de investimentos, faz a soma de todas as quantidades investido e total aplicado e retorna uma lista com os dois valores
function pegarQuantidadeTotalInvestido(nome, lista){
    let totalInventimentos=0
    let totalQuantInvestimento=0
    let listaValores=[]

    lista.forEach(element=>{
        
        if( element['nome'] == nome ){
            if(element['tipo'] == 'compra'){
                totalInventimentos +=element['valor']
                totalQuantInvestimento += element['quantidade']
            }else{
                totalInventimentos -=element['valor']
                totalQuantInvestimento -= element['quantidade']
            }
        }
    })

    listaValores.push(totalQuantInvestimento)
    listaValores.push(totalInventimentos)
    
    return listaValores
}

// retorna os investimentos no banco de dados e os coloca em um tabela e apresenta eles no html(nome,tipo,data compra, valor dos dividendos, quantidade de cada investimento, valor total)
async function consultaSql(){
    
    let dadosInvestimento
    dadosInvestimento=await fetch('http://localhost:4567/dados')
    dadosInvestimento = await dadosInvestimento.json()

    let dadosDividendos 
    dadosDividendos = await fetch ('http://localhost:4567/dividendos')
    dadosDividendos = await dadosDividendos.json()

    let dadosQuantidade
    dadosQuantidade = await fetch('http://localhost:4567/movimentacao')
    dadosQuantidade = await dadosQuantidade.json()
    console.log(dadosDividendos)
    console.log(dadosQuantidade)
    console.log(dadosInvestimento)

    dadosInvestimento.forEach(element => {
        let totalQuantTotalInvestido= pegarQuantidadeTotalInvestido(element['nome'],dadosQuantidade)

        let investimento = new Object(Investimento)
        investimento.init(element['nome'], element['tipo'], formatarData(element['data_compra']), somarValoresDividendos(element['nome'],dadosDividendos),
        totalQuantTotalInvestido[0], totalQuantTotalInvestido[1])

        let linha = document.createElement('tr')

        let coluna1 = document.createElement('td')
        coluna1.innerHTML= investimento.nome
        linha.appendChild(coluna1)

        let coluna2 = document.createElement('td')
        coluna2.innerHTML = investimento.tipo
        linha.appendChild(coluna2)

        let coluna3 = document.createElement('td')
        coluna3.innerHTML =  investimento.dataCompra
        linha.appendChild(coluna3)

        let coluna4 = document.createElement('td')
        coluna4.innerHTML = investimento.totalDividendos
        linha.appendChild(coluna4)

        let coluna5 = document.createElement('td')
        coluna5.innerHTML = investimento.quantidade
        linha.appendChild(coluna5)

        let coluna6 = document.createElement('td')
        coluna6.innerHTML = investimento.totalInvestido
        linha.appendChild(coluna6)
    
        tabelaInvestimentos.appendChild(linha)
    
    });
    
    
}
consultaSql()





