let currentBookIndex = 0;
let fetchedBooks = [];
let qString; //para procurar os Livros 


//função da API para conseguir captar os dados

async function getBooksFromGoogle(search) {

    //Sistema de procurar por categoria, e título
    const select = document.getElementById('search-type');
    const searchType = select.value;

    if (searchType === "general") qString = search;
    else if (searchType === "category") qString = `subject:${search}`;
    else if (searchType === "title") qString = `intitle:${search}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${qString}`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const dataFromGoogle = await response.json();



        //Aqui estão as informações dos livros, caso não tenha nenhum dado retorna 'Título Desconhecido, entre outros...'

        if (dataFromGoogle.items && dataFromGoogle.items.length > 0) {
            const books = dataFromGoogle.items.map(item => {
                const volumeInfo = item.volumeInfo;
                return new Book(
                    item.id,
                    volumeInfo.title || 'Título Desconhecido',
                    volumeInfo.authors || 'Autor Desconhecido',
                    volumeInfo.description || 'Sem Descrição.',
                    volumeInfo.categories || 'Sem Categoria',
                    volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x190?text=No+Cover', // Placeholder if no cover
                    volumeInfo.previewLink || '#'

                );
            });
            console.log("Livros encontrados:", books); //Número de livros encontrados com o mesmo nome
            return books;
        } else {
            console.log("Nenhum livro foi encontrado para a pesquisa:", search); //Erro quando não é encontrado nenhum livro
            return [];
        }
    } catch (error) {
        console.error("Erro ao encontrar livros do Google BOOKS API:", error);
        return [];
    }
}

class Book {
    constructor(id, title, authors, description, categories, thumbnailUrl) {
        this.id = id; //id do livro
        this.title = title; //titulo do livro
        this.authors = authors; // nome dos autores
        this.description = description; // Descrição sobre o livro
        this.categories = categories; //categorias dos livros
        this.thumbnailUrl = thumbnailUrl; // Imagem do Livro    

    }
}
getBooksFromGoogle('Javascript')

//função que apenas mostra um livro

function displaySingleBook(book) {
    const bookResultsDiv = document.getElementById('bookResults');

    if (!bookResultsDiv) {
        console.error("Erro: O elemento 'dislikeBooksContainer' não foi encontrado no DOM. Certifique-se de que está no seu HTML.");
        return;
    }

    bookResultsDiv.innerHTML = '';

    if (!book) {
        bookResultsDiv.innerHTML = '<p class="text-center">Nenhum livro para exibir.</p>'; //quando não há nenhum livro para exibir
        return;
    }
    //mostra o card depois no index.html
    const bookCard = ` 
        <div class="col-md-8 offset-md-2 mb-4"> <div class="card h-100">
                <img src="${book.thumbnailUrl}" class="card-img-top" alt="${book.title}" style="max-height: 300px; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text description-truncate">${book.description || 'Sem descrição.'}</p>
                    <p class="card-text"><small class="text-muted">Autor(es): ${Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</small></p>
                    <p class="card-text"><small class="text-muted">Categoria(s): ${book.categories}</p>
                    <button type="button" class="btn btn-success btn-sm" onclick="favoriteBooks()">Gosto</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="dislikeBooks()">Não Gosto</button>
                </div>
            </div>
        </div>
    `;
    bookResultsDiv.innerHTML = bookCard;
}

//função para procurar

async function handleSearch() {
    const inputSearch = document.getElementById('inputSearch');
    const searchTerm = inputSearch.value.trim();

    if (searchTerm) { //Procura pelo nome do livro
        fetchedBooks = await getBooksFromGoogle(searchTerm);
        currentBookIndex = 0;
        if (fetchedBooks.length > 0) {
            displaySingleBook(fetchedBooks[currentBookIndex]);
        } else {
            const bookResultsDiv = document.getElementById('bookResults');
            if (bookResultsDiv) {
                bookResultsDiv.innerHTML = '<p class="text-center">Nenhum livro foi encontrado. Tente outra pesquisa.</p>'; //caso não exista nenhum livro com esse nome, isso é ativado
            }
        }
    } else {
        alert("Por favor, digita algo para pesquisar!"); // Quando é clicado no botão pesquisar, mas não há nada escrito (NECESSÁRIO MELHORAR ISSO)
    }
}

//Função de Livros Favoritos, incompleta

function favoriteBooks() {

    const favBooksContainer = document.getElementById('alertContainer');

    if (!favBooksContainer) {
        console.error("Erro: O elemento 'favBooksContainer' não foi encontrado no DOM. Certifique-se de que está no seu HTML.");
        return;
    }

    const currentBook = fetchedBooks[currentBookIndex];

    if (!currentBook) {
        console.warn("Não há nenhum livro para favoritar no momento."); //Quando não há nenhum livro para favoritar, (honestamente não sei quando isso poderá ocorrer...)
        return;
    }

    //aparece um alerta dos livros favoritos que foi adicionado, (mudar para canto inferior direito, ou algo do género)
    const favBooks = ` 
    <div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Parabéns!!!</h4>
  <p>O livro <b>${currentBook.title}</b> foi adicionado a tua lista de livros favoritos!</p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
`;
    favBooksContainer.innerHTML = favBooks;

    //timeout sobre o Alerta
    setTimeout(() => {
        const currentAlert = favBooksContainer.querySelector('.alert');
        if (currentAlert) {
            currentAlert.classList.remove('show');
            currentAlert.classList.add('fade');
            setTimeout(() => {
                if (favBooksContainer.innerHTML) {
                    favBooksContainer.innerHTML = '';
                }
            }, 350);
        }
    }, 10000);
    showNextBook();
}

//Função de Dislikes,(mesma explicação que a de like)

function dislikeBooks() {

    const dislikeBooksContainer = document.getElementById('alertContainer');
    if (!dislikeBooksContainer) {
        console.error("Erro: O elemento 'dislikeBooksContainer' não foi encontrado no DOM. Certifique-se de que está no seu HTML.");
        return;
    }

    const currentBook = fetchedBooks[currentBookIndex];

    const unlikeBooks = `
    <div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Oh :(</h4>
  <p>  O livro <b>${currentBook.title}</b> foi adicionado a lista de não favoritos. </p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
`;

    dislikeBooksContainer.innerHTML = unlikeBooks;

    setTimeout(() => {
        const currentAlert = dislikeBooksContainer.querySelector('.alert');
        if (currentAlert) {
            currentAlert.classList.remove('show');
            currentAlert.classList.add('fade');
            setTimeout(() => {
                if (dislikeBooksContainer.innerHTML) {
                    dislikeBooksContainer.innerHTML = '';
                }
            }, 350);
        }
    }, 10000);
    showNextBook();
}

//Função que mostra os próximos Livros após clicar num botão de "Não Gosto, e Gosto"

function showNextBook() {
    currentBookIndex++;
    if (currentBookIndex < fetchedBooks.length) {
        displaySingleBook(fetchedBooks[currentBookIndex]);
    } else {
        const bookResultsDiv = document.getElementById('bookResults');
        if (bookResultsDiv) {
            bookResultsDiv.innerHTML = '<p class="text-center">Todos os livros foram exibidos para esta pesquisa. Tente uma nova pesquisa!</p>';
        }
        currentBookIndex = 0; // Reinicia o índice
        fetchedBooks = []; // Limpa os livros
    }
}

//1 - criar função que mandará os livros favoritos para uma "Lista"
//1.1 - talvez criar função que mandará os livros não favoritos para outra "Lista
//2- talvez criar um "Escolha por mim", que mostre livros aleatórios (talvez palavras aleatórias)
//3- melhorar o CSS
//4- - local storage db
//5- sistema de procurar por "temas de livros"



