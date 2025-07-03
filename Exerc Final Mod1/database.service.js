
document.addEventListener('DOMContentLoaded', () => {
    const storedFavorites = localStorage.getItem('favoriteBooks');
    if (storedFavorites) {
        favoriteBooksList = JSON.parse(storedFavorites);
        console.log("Livros favoritos carregados do LocalStorage ao iniciar:", favoriteBooksList);
        displayFavoriteBooks();
    }
});
