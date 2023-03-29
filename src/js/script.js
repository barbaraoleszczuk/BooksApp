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
  class BooksList {
    constructor() {
      const thisBookList = this;

      thisBookList.getElements();
      thisBookList.renderBookList();
      thisBookList.initActions();
      thisBookList.filterBooks();
      
    }
  
    
  
    getElements() {
      const thisBookList = this;
      thisBookList.booksContainer = document.querySelector(select.containerOf.booksList);
      thisBookList.booksForm = document.querySelector(select.book.form); //wszystkie formularze-filtry
      thisBookList.booksCover=document.querySelectorAll(select.book.cover);//okładka
    }
    renderBookList(){
      const thisBookList = this;
      thisBookList.favoriteBooks = [];
      thisBookList.filters = [];

      for (let book of dataSource.books){

        const ratingBgc = thisBookList.determineRatingBgc(book.rating);// stała, która zwraca kolor
        const ratingWidth = 10 * book.rating;// szerokość paska
        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;
  
        const generatedHTML = templates.bookList(book); // html dla każdej książki(zwykły string)
        //console.log('bookhtml',generatedHTML);
        //Kod HTML to jednak zwykły tekst, a my potrzebujemy elementu DOM, który będziemy w stanie naprawdę "wcisnąć" gdzieś na naszą stronę. Najlepiej zapamiętaj to tak: HTML to zwykły string, a element DOM to obiekt wygenerowany przez przeglądarkę na podstawie kodu HTML. Obiekt, który ma właściwości (np. innerHTML czy metody (np. getAttribute).
        //JS nie ma wbudowanej metody, która służy do tego celu – dlatego skorzystamy z jednej z funkcji zawartych w obiekcie utils.  metoda utils.createDOMFromHTML. 
          
        /*create element using utils.createElementFromHTML*/
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        /*find container of book list*/
        
        
        thisBookList.booksContainer.appendChild(generatedDOM);
      }
    }
    
    initActions() {
      const thisBookList=this;
      //wszystkie elementy .book_image 
            
      thisBookList.booksCover.addEventListener('dblclick',function(event){
        event.preventDefault();
        if (event.target.offsetParent.classList.contains('book__image')){ //offsetParent jest ustawiony na najbliższy element nadrzędny, który jest pozycjonowany bezwzględnie
          const bookId = event.target.offsetParent.getAttribute('data-id');
          if (thisBookList.favoriteBooks.includes(bookId)){
            thisBookList.booksCover.classList.remove('favorite');
            thisBookList.favoriteBooks.splice(thisBookList.favoriteBooks.indexOf(bookId), 1);
          }
          else {
            thisBookList.booksCover.classList.add('favorite');
            thisBookList.favoriteBooks.push(bookId);
          }
        }
      });
    
      thisBookList.booksForm.addEventListener('click',function(event){
        const filter = event.target;//target zwraca obiekt będący celem zdarzenia 
        const checked = filter.checked;  //checked zwraca true, jeśli checkbox jest zaznaczony i false jeśli nie jest
        if (filter.tagName == 'INPUT' && filter.type == 'checkbox' && filter.name == 'filter')
          if (checked) {
            thisBookList.filters.push(filter.value);
          } 
          else if (!checked) {
            thisBookList.filters.splice(thisBookList.filters.indexOf(filter.value), 1);
          }
        thisBookList.filterBooks();
      });
    }
  
  
    filterBooks() {
      const thisBookList = this;
      for (const book of dataSource.books){                                         
        let shouldBeHidden = false;          // zmienna, która na starcie ma właściwość false, potrzebna do nadania/usunięcia klasy hidden
        const imageCover = document.querySelector(  // Element .book__image dla book z dataSource.book
          '.book__image[data-id="' + book.id + '"]'
        );
        for(const filter of thisBookList.filters){         
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
  
    determineRatingBgc(rating) {
      const thisBookList = this;
      thisBookList.ratingBgc = '';
      

      if (rating < 6) thisBookList.ratingBgc = ' linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      else if (rating > 6 && rating <= 8) thisBookList.ratingBgc = ' linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      else if (rating > 8 && rating <= 9) thisBookList.ratingBgc = ' linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      else if (rating > 9) thisBookList.ratingBgc = ' linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';

      return thisBookList.ratingBgc;
    }
  
  }
  
  new BooksList();  

}






    
 