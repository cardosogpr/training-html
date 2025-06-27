
// Artigos e Pedidos

function carregarProdutos() {
    const selectedType = document.getElementById('selectType').value;
    const productSelect = document.getElementById('selectProduct');

    // Limpar opções anteriores
    productSelect.innerHTML = '';

    let products = [];


    if (selectedType === 'optionSandwich') {
        products = productNameSanduichesList;
    } else if (selectedType === 'optionComplement') {
        products = productNameAcompanhamentosList;
    } else if (selectedType === 'optionDrink') {
        products = productNameBebidasList;
    }

    // Mostrar opções
    products.forEach(product => {
        productSelect.innerHTML += `<option value="${product}">${product}</option>`;
    });


}

function carregarExtras() {
    const selectedType = document.getElementById('selectType').value;
    const selectedProduct = document.getElementById('selectProduct').value;
    const productSelectExtra = document.getElementById('selectExtra');

    const produtosBatatas = ['Batata', 'Batata (grande)'];

    productSelectExtra.innerHTML = '';

    let extraProducts = [];

    if (selectedType === 'optionSandwich') {
        extraProducts = productExtraSanduichesList;
    }
    else if (selectedType === 'optionDrink') {
        extraProducts = productExtraBebidasList;
    }
    else if (selectedType === 'optionComplement' && produtosBatatas.includes(selectedProduct)) {
        extraProducts = productMolhosList;
    }
    else if (selectedType === 'optionComplement') {
        extraProducts = ['Normal'];
    } else {
        extraProducts = [];
    }



    extraProducts.forEach(extra => {
        productSelectExtra.innerHTML += `<option value="${extra}">${extra}</option>`;
    });
}

//carrega  antes de iniciar

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    carregarExtras();

    document.getElementById('selectType').addEventListener('change', () => {
        carregarProdutos();
        carregarExtras();
    });

    document.getElementById('selectProduct').addEventListener('change', () => {
        carregarExtras();
    });
});

let pedidos = []; // array para salvar os pedidos

function addPedido(event) {

    event.preventDefault();

    const tableBody = document.querySelector("#bodyAddPedido");

    const namePedido = document.getElementById("inputClientName").value;
    const selectedProduct = document.getElementById("selectProduct").value;
    const selectedExtra = document.getElementById("selectExtra").value;
    const timestampId = Date.now();
    const data = new Date().toISOString();

    //cria um objeto com os dados dos pedidos
    const newPedido = {
        id: timestampId,
        pessoa: namePedido,
        tipo: selectedExtra,
        produto: selectedProduct,
        data: data
    }

    pedidos.push(newPedido); //isto salva os pedidos 

    //Apenas dados importantes
    const row = document.createElement("tr");

    const tdID = document.createElement("td");
    tdID.textContent = timestampId;

    const tdArtigo = document.createElement("td");
    tdArtigo.textContent = selectedProduct;

    const tdExtra = document.createElement("td");
    tdExtra.textContent = selectedExtra;

    row.appendChild(tdID);
    row.appendChild(tdArtigo);
    row.appendChild(tdExtra);

    tableBody.appendChild(row);

    limparInputs();
}

//remover pedidos~

function listarPedidos(todos) {

    const listaPedidos = [...pedidos].sort((a, b) => new Date(b.data) - new Date(a.data)); //organiza os pedidos por data (fica oculto)

    const tabelaPedidos = document.getElementById("listarPedidos"); //isto vai adicionar os pedidos para "remover pedidos" através do botão finalizar pedido

    tabelaPedidos.innerHTML = "";


    listaPedidos.forEach(pedido => {

        const row = document.createElement("tr");

        const tdProduto = document.createElement("td");
        tdProduto.textContent = pedido.produto;

        const tdExtra = document.createElement("td");
        tdExtra.textContent = pedido.tipo;

        const tdNome = document.createElement("td");
        tdNome.textContent = pedido.pessoa;

        row.appendChild(tdProduto);
        row.appendChild(tdExtra);
        row.appendChild(tdNome);
        tabelaPedidos.appendChild(row);

    });

    //altera os dados para os dados da pessoa mais recente
    if (listaPedidos.length > 0) {
        const maisRecente = listaPedidos[0];
        document.getElementById("labelNome").textContent = `Pessoa: ${maisRecente.pessoa}`;
        document.getElementById("labelID").textContent = `Pedido ID: ${maisRecente.id}`;
    }


};

function finalizarPedido(event) {
    event.preventDefault();
    listarPedidos();
};

function limparInputs() {
    const cleanInput = document.querySelectorAll('input[type=text]')
    cleanInput.forEach(cleanInput => cleanInput.value = '');
}

function filtrarPedidos(tipo) {

}


















