
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section');


    function showSectionFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page') || 'home';

        sections.forEach(section => {
            if (section.id === pageId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });

        if (pageId) {
            const targetSection = document.getElementById(pageId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }


    showSectionFromUrl();


    window.addEventListener('popstate', showSectionFromUrl);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();


            const pageName = this.href.split('?page=')[1];


            history.pushState({ page: pageName }, '', `?page=${pageName}`);


            showSectionFromUrl();
        });
    });

});


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









