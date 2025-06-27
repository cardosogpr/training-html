
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

    // Inicializar filtros - mostrar todos os pedidos por padrão
    filtrarPedidos('todos');
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

//

function listarPedidos(filtro = 'todos') { //filtra por tipo 
    const listaPedidos = [...pedidos].sort((a, b) => new Date(b.data) - new Date(a.data)); //lista os pedidos e ordena por  data
    const tabelaPedidos = document.getElementById("listarPedidos"); //tabela pedido
    
    tabelaPedidos.innerHTML = "";

    // Função para determinar se um pedido tem extras 
    function temExtras(pedido) { //capta todos os produtos para verificar
        const produtosBatatas = ['Batata', 'Batata (grande)'];
        const produtosSanduiches = ["Big Mac®", "Big Tasty®", "CBO®", "Filet-o-Fish®", "McVeggie", "Double Cheeseburger"];
        const produtosBebidas = ["Agua", "Compal", "Ice Tea", "Fanta", "Coca-Cola"];
        
        // Sanduíches têm extras se não for "Normal"
        if (produtosSanduiches.includes(pedido.produto)) {
            return pedido.tipo !== "Normal";
        }
        
        // Batatas têm extras se não for "Normal"
        if (produtosBatatas.includes(pedido.produto)) {
            return pedido.tipo !== "Normal";
        }
        
        // Bebidas têm extras se não for "Natural"
        if (produtosBebidas.includes(pedido.produto)) {
            return pedido.tipo !== "Natural";
        }
        
        // Outros produtos não têm extras
        return false;
    }

    // Filtrar pedidos baseado no tipo selecionado
    let pedidosFiltrados = listaPedidos;
    
    if (filtro === 'com-extra') {
        pedidosFiltrados = listaPedidos.filter(pedido => temExtras(pedido));
    } else if (filtro === 'sem-extra') {
        pedidosFiltrados = listaPedidos.filter(pedido => !temExtras(pedido));
    }
    // Se filtro === 'todos', mostra todos os pedidos (sem filtro)

    // Renderizar pedidos filtrados
    pedidosFiltrados.forEach(pedido => {
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

    // Atualizar informações do pedido mais recente (dos filtrados)
    if (pedidosFiltrados.length > 0) {
        const maisRecente = pedidosFiltrados[0];
        document.getElementById("labelNome").textContent = `Pessoa: ${maisRecente.pessoa}`;
        document.getElementById("labelID").textContent = `Pedido ID: ${maisRecente.id}`;
    } else {
        // Se não houver pedidos filtrados, limpar as labels
        document.getElementById("labelNome").textContent = "Nome do Cliente: ";
        document.getElementById("labelID").textContent = "ID do Pedido: ";
    }
}



function finalizarPedido(event) {
    event.preventDefault();
    listarPedidos();
};



function limparInputs() {
    const cleanInput = document.querySelectorAll('input[type=text]')
    cleanInput.forEach(cleanInput => cleanInput.value = '');
}


function filtrarPedidos(tipo) {
    // Remover classe 'active' de todos os botões
    const botoesFiltro = document.querySelectorAll('#buttonRow button');
    botoesFiltro.forEach(botao => { //ao clicar fica primary, e os outros secondary
        botao.classList.remove('btn-primary');
        botao.classList.add('btn-secondary');
    });
    
    // Adicionar classe 'active' ao botão clicado
    let botaoAtivo;
    if (tipo === 'todos') {
        botaoAtivo = document.getElementById('remAll');
    } else if (tipo === 'com-extra') {
        botaoAtivo = document.getElementById('remExtra');
    } else if (tipo === 'sem-extra') {
        botaoAtivo = document.getElementById('remNormal');
    }
    
    if (botaoAtivo) {
        botaoAtivo.classList.remove('btn-secondary');
        botaoAtivo.classList.add('btn-primary');
    }
    
    // Chamar listarPedidos com o filtro
    listarPedidos(tipo);
}

















