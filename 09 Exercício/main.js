
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

document.addEventListener('DOMContentLoaded', function () {

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

    // Event listener para mudanças
    document.getElementById('selectType').addEventListener('change', carregarProdutos);

    // Carregarra a função
    carregarProdutos();
});

document.addEventListener('DOMContentLoaded'), function (){
    function carregarExtras(){
        const selectExtra = document.getElementById('selectExtra').value;
        

    }
}