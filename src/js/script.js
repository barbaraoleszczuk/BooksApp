/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book' //selektory z html?
    },
    containerOf: {
      booksList: '.books-list', // klasa books-list w html
    }
  };
  const templates = {
    bookList: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
    // CODE ADDED START
        
  };
    
    
  function renderBookList(){
    const thisBook = this;

    for (const book of dataSource.books){
      const generatedHTML = templates.bookList(book); // html dla każdej książki(zwykły string)
      console.log('bookhtml',generatedHTML)
      //Kod HTML to jednak zwykły tekst, a my potrzebujemy elementu DOM, który będziemy w stanie naprawdę "wcisnąć" gdzieś na naszą stronę. Najlepiej zapamiętaj to tak: HTML to zwykły string, a element DOM to obiekt wygenerowany przez przeglądarkę na podstawie kodu HTML. Obiekt, który ma właściwości (np. innerHTML czy metody (np. getAttribute).
      //JS nie ma wbudowanej metody, która służy do tego celu – dlatego skorzystamy z jednej z funkcji zawartych w obiekcie utils. Przygotowaliśmy go dla Ciebie, aby usprawnić nam pracę nad tym projektem. W tym wypadku użyjemy metody utils.createDOMFromHTML. 
        
      /*create element using utils.createElementFromHTML*/
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      /*find container of book list*/
      
      const booksContainer = document.querySelector(select.containerOf.booksList);
      console.log('container bookList',booksContainer)
      /*add element book to container of books List */
      booksContainer.appendChild(thisBook.element);
    }
  }
  renderBookList();

}