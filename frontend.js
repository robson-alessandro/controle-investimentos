const formularioCompra = document.querySelector('#registro_compra');
const botaoCompra = document.querySelector('#botao_compra')


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

// função para pegar os valores do formulario de compra
botaoCompra.addEventListener('click',(event)=>{
    event.preventDefault();

    const nomeInvestimento = document.getElementById('nome_compra_investimento').value
    const tipoInvestimento = document.getElementById('tipo_compra_investimento').value
    const dataInvestimento = document.getElementById('data_compra_investimento').value
    const quantidadeInvestimento = document.getElementById('quantidade_compra_investimento').value
    const valorCompra = document.getElementById('valor_compra_investimento').value
    const primeiraCompra = document.getElementById('primeira_compra').checked

    const compra = new Object(Compras)
    compra.init(nomeInvestimento,tipoInvestimento,dataInvestimento,quantidadeInvestimento,valorCompra,primeiraCompra)

    console.log(compra)
})