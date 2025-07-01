let currentBookIndex = 0;
let fetchedBooks = [];


async function getBooksFromGoogle(search) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${search}`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const dataFromGoogle = await response.json();


        if (dataFromGoogle.items && dataFromGoogle.items.length > 0) {
            const books = dataFromGoogle.items.map(item => {
                const volumeInfo = item.volumeInfo;
                return new Book(
                    item.id,
                    volumeInfo.title || 'Título Desconhecido',
                    volumeInfo.authors || 'Autor Desconhecido',
                    volumeInfo.description || 'Sem Descrição.',
                    volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x190?text=No+Cover', // Placeholder if no cover
                    volumeInfo.previewLink || '#'

                );
            });
            console.log("Livros encontrados:", books);
            return books;
        } else {
            console.log("Nenhum livro foi encontrado para a pesquisa:", search);
            return [];
        }
    } catch (error) {
        console.error("Erro ao encontrar livros do Google BOOKS API:", error);
        return [];
    }
}

class Book {
    constructor(id, title, authors, description, thumbnailUrl, previewLink) {
        this.id = id; //id do livro
        this.title = title; //titulo do livro
        this.authors = authors; // nome dos autores
        this.description = description; // Descrição sobre o livro
        this.thumbnailUrl = thumbnailUrl; // Imagem do Livro    
    }
}
getBooksFromGoogle('Javascript')

function displaySingleBook(book) {
    const bookResultsDiv = document.getElementById('bookResults');

    if (bookResultsDiv) {
        console.error("Erro: O elemento 'dislikeBooksContainer' não foi encontrado no DOM. Certifique-se de que está no seu HTML.");
        return;
    }

    bookResultsDiv.innerHTML = '';

    if (!book) {
        bookResultsDiv.innerHTML = '<p class="text-center">Nenhum livro para exibir.</p>';
        return;
    }
    const bookCard = `
        <div class="col-md-8 offset-md-2 mb-4"> <div class="card h-100">
                <img src="${book.thumbnailUrl}" class="card-img-top" alt="${book.title}" style="max-height: 300px; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text description-truncate">${book.description || 'Sem descrição.'}</p>
                    <p class="card-text"><small class="text-muted">Autor(es): ${Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</small></p>
                    <a href="${book.previewLink || '#'}" target="_blank" class="btn btn-primary btn-sm mb-2">Ver Prévia</a>
                    <button type="button" class="btn btn-success btn-sm" onclick="favoriteBooks()">Gosto</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="dislikeAndNextBook()">Não Gosto</button>
                </div>
            </div>
        </div>
    `;
    bookResultsDiv.innerHTML = bookCard;
}


async function handleSearch() {
    const inputSearch = document.getElementById('inputSearch');
    const searchTerm = inputSearch.value.trim();

    if (searchTerm) {
        fechtedBooks = await getBooksFromGoogle(searchTerm);
        currentBooksIndex = 0;
        if (fetchedBooks.lenght > 0) {
            displaySingleBook(fechtedBooks[currentBooksIndex]);
        } else {
            const bookResultsDiv = document.getElementById('bookResults');
            if (bookResultsDiv) {
                bookResultsDiv.innerHTML = '<p class="text-center">Nenhum livro foi encontrado. Tente outra pesquisa.</p>';
            }
        }
    } else {
        alert("Por favor, digita algo para pesquisar!");
    }
}

//Função de Livros Favoritos, incompleta

function favoriteBooks() {

    const favBooksContainer = document.getElementById('alertContainer');

    if (!favBooksContainer) {
        console.error("Erro: O elemento 'favBooksContainer' não foi encontrado no DOM. Certifique-se de que está no seu HTML.");
        return;
    }

    const favBooks = `
    <div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Parabéns!</h4>
  <p>Este livro foi adicionado a tua lista de livros favoritos!</p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
`;
    favBooksContainer.innerHTML = favBooks;

    setTimeout(() => {
        if (favBooksContainer.innerHTML) {
            favBooksContainer.innerHTML = '';
        }
    }, 7000); // Remove após 5 segundos
}

//Função de Dislikes, incompleta

function dislikeBooks() {

    const dislikeBooksContainer = document.getElementById('alertContainer');
    if (!dislikeBooksContainer) {
        console.error("Erro: O elemento 'dislikeBooksContainer' não foi encontrado no DOM. Certifique-se de que está no seu HTML.");
        return;
    }

    const unlikeBooks = `
    <div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Oh :(</h4>
  <p>Este livro foi adicionado a tua lista de não gostos. </p>
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
            }, 150);
        }
    }, 3000);
}
currentBookIndex++;
if (currentBookIndex < fetchedBooks.lenght) {
    displaySingleBook(fetchedBooks[currentBookIndex]);
} else {
    const bookResultsDiv = document.getElementById('bookResults');
    if (bookResultsDiv) {
        bookResultsDiv.innerHTML = '<p class="text-center">Todos os livros foram exibidos. Tente uma nova pesquisa!</p>';
    }
    currentBookIndex = 0;
    fetchedBooks = [];
}





