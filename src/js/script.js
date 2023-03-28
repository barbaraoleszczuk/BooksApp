/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book' //selektory z html?
    },
    containerOf: {
      booksList: '.books-list', // klasa books-list w html
    },
    book: {
      name: '.boook__name',
      cover: '.book__image',
      form: '.filters',
    }
  };
  const templates = {
    bookList: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
    // CODE ADDED START
        
  };
    
    
  function renderBookList(){
    
    for (let book of dataSource.books){

      const ratingBgc = determineRatingBgc(book.rating);// stała, która zwraca raiting-ocenę
      const ratingWidth = 10 * ratingBgc;// szerokość paska
      book.ratingBgc = ratingBgc;
      book.ratingWidth = ratingWidth;

      const generatedHTML = templates.bookList(book); // html dla każdej książki(zwykły string)
      //console.log('bookhtml',generatedHTML);
      //Kod HTML to jednak zwykły tekst, a my potrzebujemy elementu DOM, który będziemy w stanie naprawdę "wcisnąć" gdzieś na naszą stronę. Najlepiej zapamiętaj to tak: HTML to zwykły string, a element DOM to obiekt wygenerowany przez przeglądarkę na podstawie kodu HTML. Obiekt, który ma właściwości (np. innerHTML czy metody (np. getAttribute).
      //JS nie ma wbudowanej metody, która służy do tego celu – dlatego skorzystamy z jednej z funkcji zawartych w obiekcie utils.  metoda utils.createDOMFromHTML. 
        
      /*create element using utils.createElementFromHTML*/
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      /*find container of book list*/
      
      const booksContainer = document.querySelector(select.containerOf.booksList);
      //console.log('container bookList',booksContainer);
      /*add element book to container of books List */
      booksContainer.appendChild(generatedDOM);
    }
  }
 

  const favoriteBooks = [];
  const filters = [];

  function initActions(){ 
    //wszystkie elementy .book_image 
    const booksCover=document.querySelectorAll(select.book.cover);

    const booksForm = document.querySelector(select.book.form); //wszystkie formularze

    for(let  cover of booksCover){
      cover.addEventListener('dblclick',function(event){
        event.preventDefault();
        if (event.target.offsetParent.classList.contains('book__image')){ //offsetParent jest ustawiony na najbliższy element nadrzędny, który jest pozycjonowany bezwzględnie
          const bookId = event.target.offsetParent.getAttribute('data-id');
          if (favoriteBooks.includes(bookId)){
            cover.classList.remove('favorite');
            favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);
          }
          else {
            cover.classList.add('favorite');
            favoriteBooks.push(bookId);
          }
        }
      });
    }
    booksForm.addEventListener('click',function(event){
      const filter = event.target;//target zwraca obiekt będący celem zdarzenia 
      const checked = filter.checked;  //checked zwraca true, jeśli checkbox jest zaznaczony i false jeśli nie jest
      if (filter.tagName == 'INPUT' && filter.type == 'checkbox' && filter.name == 'filter')
        if (checked) {
          filters.push(filter.value);
        } 
        else if (!checked) {
          filters.splice(filters.indexOf(filter.value), 1);
        }
      filterBooks();
    });
  }
  console.log('tablica filter', filters);
  
  function filterBooks(){                                                         
    for (const book of dataSource.books){                                         
      let shouldBeHidden = false;          // zmienna, która na starcie ma właściwość false, potrzebna do nadania/usunięcia klasy hidden
      const imageCover = document.querySelector(  // Element .book__image dla book z dataSource.book
        '.book__image[data-id="' + book.id + '"]'
      );
      for(const filter of filters){         
        if(!book.details[filter]){       // czy filtr(details) danej książki NIE znajduje się w tablicy?                                    
          shouldBeHidden = true;                                                  
          break;                         // Przerwanie pętli
        }
      }
      if(shouldBeHidden){                  //jeśli warunek jest spełniony(true)- nadajemy klasę .hidden                                       
        imageCover.classList.add('hidden');                                 
      } else {
        imageCover.classList.remove('hidden');                                   
        console.log('imageCover:', imageCover);
      }
    }
  }
  function determineRatingBgc(rating){
    let ratingBgc = '';

    if (rating < 6) ratingBgc = {background : ' linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)'};
    else if (rating > 6 && rating <= 8) ratingBgc = {background :' linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)'};
    else if (rating > 8 && rating <= 9) ratingBgc = {background : ' linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)'};
    else if (rating > 9) ratingBgc = {background : ' linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'};

    return ratingBgc;
  }
  
  renderBookList();
  initActions();
}