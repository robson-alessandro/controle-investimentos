const formularioCompra = document.querySelector('#registro_compra');
const botaoCompra = document.querySelector('#botao_compra')


botaoCompra.addEventListener('click',(event)=>{
    event.preventDefault();

    const nomeInvestimento = document.getElementById('nome_compra_investimento').value
    const tipoInvestimento = document.getElementById('tipo_compra_investimento').value
    const dataInvestimento = document.getElementById('data_compra_investimento').value
    const quantidadeInvestimento = document.getElementById('quantidade_compra_investimento').value
    const valorCompra = document.getElementById('valor_compra_investimento').value
    console.log(`${nomeInvestimento}-${tipoInvestimento}-${dataInvestimento}-${quantidadeInvestimento}-${valorCompra

    }`)
})