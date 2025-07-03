let currentBookIndex = 0;
let fetchedBooks = [];
let favoriteBooksList = []; //livros favoritos
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
                   <p class="card-text">
                    <span class="description-short">${book.description ? book.description.substring(0, 150) : 'Sem descrição.'}</span>
                    <span class="description-full" style="display: none;">${book.description ? book.description : ''}</span>
                    ${(book.description && book.description.length > 150) ? `<button type="button" class="btn btn-secondary btn-sm mt-2" onclick="expandDescription(this)">Saiba Mais</button>` : ''}
                </p>
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

//Mostrar livros favoritos

function displayFavoriteBooks() {
    const favoriteBooksDisplay = document.getElementById('favoriteBooksDisplay');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');

    if (!favoriteBooksDisplay) {
        console.error("Erro: O elemento 'favoriteBooksDisplay' não foi encontrado no DOM.");
        return;
    }

    // Limpa o conteúdo atual para evitar duplicatas ao re-exibir
    favoriteBooksDisplay.innerHTML = '';

    if (favoriteBooksList.length === 0) {
        if (noFavoritesMessage) {
            noFavoritesMessage.style.display = 'block'; // Mostra a mensagem se não houver favoritos
        }
        return;
    } else {
        if (noFavoritesMessage) {
            noFavoritesMessage.style.display = 'none'; // Esconde a mensagem se houver favoritos
        }
    }

    favoriteBooksList.forEach(book => {
        const bookCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${book.thumbnailUrl}" class="card-img-top" alt="${book.title}" style="max-height: 200px; object-fit: contain;">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">
                    <span class="description-short">${book.description ? book.description.substring(0, 150) : 'Sem descrição.'}</span>
                    <span class="description-full" style="display: none;">${book.description ? book.description : ''}</span>
                    ${(book.description && book.description.length > 150) ? `<button type="button" class="btn btn-secondary btn-sm mt-2" onclick="expandDescription(this)">Saiba Mais</button>` : ''}
                </p>
                        <p class="card-text"><small class="text-muted">Autor(es): ${Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</small></p>
                    </div>
                </div>
            </div>
        `;
        favoriteBooksDisplay.innerHTML += bookCard;
    });
}

//Função mostrar descrição

function expandDescription(button) {

    const descriptionParagraph = button.closest('p.card-text');

    if (!descriptionParagraph) {
        console.error("Erro: Não foi possível encontrar a descrição sobre este livro (p.card-text)."); //Erro quando não há nenhuma descrição
        return;
    }

    const shortDescriptionSpan = descriptionParagraph.querySelector('.description-short'); //mnostra ele com a descrição pequena
    const fullDescriptionSpan = descriptionParagraph.querySelector('.description-full'); //mostra ele com a descrição completa

    //um verificador (???)
    if (!shortDescriptionSpan || !fullDescriptionSpan) {
        console.error("Erro: Não foram encontradas as spans de descrição (description-short/description-full).");
        return;
    }

    //Função que vai mostrar o botão "Saiba Mais"m quando tiver curto, e vai mostrar o "Mostrar Menos", quando tiver logo.
    if (fullDescriptionSpan.style.display === 'none') {
        // Se a descrição completa estiver oculta, mostre-a
        shortDescriptionSpan.style.display = 'none'; // Oculta a parte curta
        fullDescriptionSpan.style.display = 'inline'; // Exibe a parte completa 
        button.textContent = 'Mostrar Menos';
    } else {
        // Se a descrição completa estiver visível, oculte-a
        shortDescriptionSpan.style.display = 'inline'; // Exibe a parte curta
        fullDescriptionSpan.style.display = 'none'; // Oculta a parte completa
        button.textContent = 'Saiba Mais';
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

    //Verificar se o livro já foi adicionado a lista para não existir duplicados, (configurar para alertas)

    const isBookAlreadyFavorited = favoriteBooksList.some(book => book.id === currentBook.id);
    if (!isBookAlreadyFavorited) {
        favoriteBooksList.push(currentBook);
        console.log("Livro adicionado aos favoritos:", currentBook.title);
        console.log("Livros favoritos atuais:", favoriteBooksList); // Para depuração
    } else {
        console.log("Livro já está na lista de favoritos:", currentBook.title);
    }


    //aparece um alerta dos livros favoritos que foi adicionado, (mudar para canto inferior direito, ou algo do género)
    const favBooks = ` 
    <div class="alert alert-success" role="alert" style="position: fixed; right: 0; bottom: 0; z-index: 5;">
  <h4 class="alert-heading">Parabéns!!!</h4>
  <p>Gostaste do livro <b>${currentBook.title}</b>! Mais livros deste género serão recomendados a partir de agora.</p>
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
    displayFavoriteBooks();
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
    <div class="alert alert-danger" role="alert" style="position: fixed; right: 0; bottom: 0; z-index: 5;">
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

//Mudar placehodlers

const select = document.getElementById('search-type');

select.addEventListener('change', function (event) {
    const searchType = event.target.value;

    if (searchType === "general") {
        updatePlaceHolder("Pesquisar por livros...");
    } else if (searchType === "category") {
        updatePlaceHolder("Pesquisar por categoria...");
    } else if (searchType === "title") {
        updatePlaceHolder("Pesquisar por título...");
    }

});

function updatePlaceHolder(text) {
    const input = document.getElementById("inputSearch");
    input.placeholder = text;
}

//1.1 - talvez criar função que mandará os livros não favoritos para outra "Lista ( POR FAZER )
//3- melhorar o CSS ( POR FAZER )
//4- - local storage db ( POR FAZER)




