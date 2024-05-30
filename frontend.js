const botaoCompra = document.querySelector('#botao_compra');
const botaoVenda = document.querySelector('#botao_venda');
const botaoDividendo = document.querySelector('#botao_dividendo');


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
botaoCompra.addEventListener('click',(event)=>{
    event.preventDefault();

    const nomeInvestimentoCompra = document.getElementById('nome_compra_investimento').value
    const tipoInvestimento = document.getElementById('tipo_compra_investimento').value
    const dataInvestimento = document.getElementById('data_compra_investimento').value
    const quantidadeInvestimento = document.getElementById('quantidade_compra_investimento').value
    const valorCompra = document.getElementById('valor_compra_investimento').value
    const primeiraCompra = document.getElementById('primeira_compra').checked

    const compra = new Object(Compras)
    compra.init(nomeInvestimentoCompra,tipoInvestimento,dataInvestimento,quantidadeInvestimento,valorCompra,primeiraCompra)
    
    chamarApi(compra,'compra')
    

})

// função para pegar os valores do formulario de venda
botaoVenda.addEventListener('click' ,(event)=>{
    event.preventDefault();
    const nomeInvestimentoVenda = document.getElementById('nome_venda_investimento').value;
    const dataVenda = document.getElementById('data_venda_investimento').value;
    const quantidadeVenda = document.getElementById('quantidade_venda_investimento').value;
    const valorVenda = document.getElementById('valor_venda_investimento').value;

    const venda = new Object(Vendas)
    venda.init(nomeInvestimentoVenda,dataVenda,quantidadeVenda,valorVenda);
    chamarApi(venda, 'venda')
})

// função para pegar os valores do formulario de dividendo
botaoDividendo.addEventListener('click',(evet) =>{
    evet.preventDefault();

    const nomeInvestimentoDividendo = document.getElementById('nome_dividendo_investimento').value
    const dataDividendo = document.getElementById('data_dividendo_investimento').value
    const valorDividendo = document.getElementById('valor_dividendo_investimento').value

    const dividendo = new Object(Dividendos)
    dividendo.init(nomeInvestimentoDividendo,dataDividendo,valorDividendo)

    chamarApi(dividendo,'dividendo')
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
getcontent()

// função que manda os dados para o backend parametros: dados = os dados enviados ao backend para salva,
// movimentacao = qual o tipo de movimentação feita(compra,venda ou dividendos)
function chamarApi(dados,movimentacao){
    
    axios.post(`http://localhost:4567/${movimentacao}`,dados)
    .then(response => {
      console.log(JSON.stringify(response.data))
      
    })
    .catch(error => console.error(error));
}
