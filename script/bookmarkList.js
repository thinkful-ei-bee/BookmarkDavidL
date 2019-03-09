'use strict';
/*global bookmarkStore api $ */ 

const bookmarkList = (function(){

  // geneate string for bookmark toolbox
  function generateAddBookmarkHtmlString(){
    return `
    <div class='new-bookmark-input-field'>
      <form role = 'add-new-bookmark' name = 'add-bookmark-form' class='add-bookmark-form'>
        <div class='add-bookmark-input-box'> 
          <input aria-label = 'enter-book-title' role='enter title' id="title-input-add-book" type="text" name='title' placeholder="book title" ></input>
          <input aria-label = 'enter-book-http-link' role='enter' id = "url-input-add-book" type="text" name='url' placeholder="url:http://" ></input>
        </div>
        <div aria-label = 'enter-book-description'  role='enter description' class='desc-add-new'>
            <textarea name = 'desc' rows='10' cols='150' type="text"></textarea>
        </div>
        <div class='star-rating'>
          <input aria-label = '1-star' type="radio" name="rating" value="1"> 1  ${generateRatingStarsHtmlString(1)}<br>
          <input aria-label = '2-star' type="radio" name="rating" value="2"> 2  ${generateRatingStarsHtmlString(2)}<br>
          <input aria-label = '3-star' type="radio" name="rating" value="3"> 3  ${generateRatingStarsHtmlString(3)}<br>
          <input aria-label = '4-star' type="radio" name="rating" value="4"> 4  ${generateRatingStarsHtmlString(4)}<br>
          <input aria-label = '5-star' type="radio" name="rating" value="5"> 5  ${generateRatingStarsHtmlString(5)}<br>
        </div>
          <button type = 'submit' class='add-bookmark-submit'>Submit</button>
          <button type = 'click' class='add-bookmark-cancel'>Cancel</button>
      </form>
    </div>
    `;
  }
 
  // generate html string for bookmark edit mode
  function generateEditBookmarkHtmlString(id,title,url,desc){
    return `
  <div class='edit-box'>
    <li data-item-id = ${id} class = ' edit-bookmark-expand' id='bookmark-title-edit'>
      <div class='edit-bookmark-input-field'>
        <form name = 'add-bookmark-form' class='add-bookmark-form'>
          <div> 
            <input class = "edit-input-title" type="text" name='title' value=${title} ></input>
            <input class = "edit-input-url" type="text" name='url' value=${url} > </input>
          </div>
        <div>
          <textarea name = 'desc' rows='10' cols='150' type="text" >${desc}</textarea>
        </div>
        <div class='star-rating'>
          <input type="radio" name="rating" value="1"> 1  ${generateRatingStarsHtmlString(1)}<br>
          <input type="radio" name="rating" value="2"> 2  ${generateRatingStarsHtmlString(2)}<br>
          <input type="radio" name="rating" value="3"> 3  ${generateRatingStarsHtmlString(3)}<br>
          <input type="radio" name="rating" value="4"> 4  ${generateRatingStarsHtmlString(4)}<br>
          <input type="radio" name="rating" value="5"> 5  ${generateRatingStarsHtmlString(5)}<br>
        </div>
          <button type = 'submit' class='edit-bookmark-submit'>Submit</button>
          <button type = 'click' class='edit-bookmark-cancel'>Cancel</button>
        </form>
      </div>
    </li>
  </div>
    `;
  }

  // generate html string for bookmark tool box
  function generateBookmarkToolboxHtmlString(){
    return `
    <div class='bookmark-tool-search'>
      <button class="js-add-bookmark" type = 'submit'>Add New Bookmark</button>
        <select class = 'star-filter' placeholder = 'minimum rating'name="star-filter">
          <option id="star" value="1">   minimum rating</option>
          <option id="star" value="1">1 star</option>
          <option id="star" value="2">2 stars</option>
          <option id="star" value="3">3 stars</option>
          <option id="star" value="4">4 stars</option>
          <option id="star" value="5">5 stars</option>
        </select>
      </div>    
    `;
  }

  // generate html string for bookmark listing
  function generateRatingStarsHtmlString(rating){
    const starHtmlString = [];
    for(let i = 0;i<rating;i++){
      starHtmlString.push('<span class="fa fa-star checked"></span>');
    }
    for(let i = 0;i<(5-rating);i++){
      starHtmlString.push('<span class="fa fa-star" style="color:lightgray"></span>');
    }
    return starHtmlString.join('');
  }
  
  // generate html string for bookmark item
  function generateBookmarkItemHtmlString(id,title,rating){ 
    return ` 
    <li aria-label = 'bookmark' role='bookmark' data-item-id = ${id} id='bookmark-title-list'>
      <div class='book-title '>
        <div class='title'>
          ${title}
        </div>
      <div class='bookmark-expand-delete hidden'>
        <span class='bookmark-expand fa fa-expand fa-lg'></span>
        <span class='bookmark-delete fa fa-trash fa-lg'></span>
      </div>
    </div>
    <div class='book-star-rating'>              
      ${generateRatingStarsHtmlString(rating)}
    </div>
  </li>
    `;
  }

  // generate html string for bookmark expand
  function generateExpandedBookmarkHtml(id,title,rating,desc,url){
    return `
    <li aria-label = 'bookmark' role='bookmark' data-item-id = ${id} class=" expanded"id='bookmark-title-list'>
      <div class='book-title'>    
        <div class = 'title'>
          ${title}
        </div>
      
        <div class='bookmark-expand-delete hidden'>
          <span class='bookmark-expand fa fa-expand fa-lg'></span>
          <span class='bookmark-delete fa fa-trash fa-lg'></span>
        </div>
      </div>
      
      <div class='book-description'>
        <h5>Description</h5>
        <p id= 'dsec'>${desc}</p>
      </div>
    
      <div class="bookmark-visit-site">
        <a target="_blank" href = ${url}>Visit site</a>
      </div>
      <div class="expand-footer">        
        <button class="bookmark-edit">Edit</button>        
        <div class='book-star-rating'>                  
          ${generateRatingStarsHtmlString(rating)}
        </div>
      </div>
  </li>`;
  }

  
  function setStarFilterFalse(){
    bookmarkStore.starFilter=false;
  }

  // If star filter is triggered, call this function to render booklist. 
  function generateBookmarkListingHtmlStringAfterStarFilter(){
    let bookmarkListingHtml = [];    
    for(let i = 0; i<bookmarkStore.items.length; i++){      
      let id = bookmarkStore.items[i].id;
      let title = bookmarkStore.items[i].title;
      let rating = bookmarkStore.items[i].rating;
      let desc = bookmarkStore.items[i].desc;
      let url = bookmarkStore.items[i].url;
      if(rating >= bookmarkStore.ratingSelected){      
        {if(bookmarkStore.items[i].edit){
          bookmarkListingHtml.push(generateEditBookmarkHtmlString(id,title,url,desc));
        }
        else if(bookmarkStore.items[i].expanded){
          bookmarkListingHtml.push(generateExpandedBookmarkHtml(id,title,rating,desc,url));
        }          
        else{        
          bookmarkListingHtml.push(generateBookmarkItemHtmlString(id,title,rating));
        }
        }                  
      }          
    }
    return bookmarkListingHtml.join('');
  }

  // Generate booklist string original
  function generateBookmarkListingHtmlString(){
    let bookmarkListingHtml = [];    
    for(let i = 0; i<bookmarkStore.items.length; i++){      
      let id = bookmarkStore.items[i].id;
      let title = bookmarkStore.items[i].title;
      let rating = bookmarkStore.items[i].rating;
      let desc = bookmarkStore.items[i].desc;
      let url = bookmarkStore.items[i].url;      
      if(bookmarkStore.items[i].edit){
        bookmarkListingHtml.push(generateEditBookmarkHtmlString(id,title,url,desc));
      }
      else if(bookmarkStore.items[i].expanded){
        bookmarkListingHtml.push(generateExpandedBookmarkHtml(id,title,rating,desc,url));
      }          
      else{        
        bookmarkListingHtml.push(generateBookmarkItemHtmlString(id,title,rating));
      }
    }       
    return bookmarkListingHtml.join('');
  }

  // if search is in action, call this function to render booklist
  function generateBookmarkSearchHtmlString(){
    let bookmarkListingHtml = [];        
    for(let i = 0; i<bookmarkStore.items.length; i++){      
      let id = bookmarkStore.items[i].id;
      let title = bookmarkStore.items[i].title;
      let rating = bookmarkStore.items[i].rating;
      let desc = bookmarkStore.items[i].desc;
      let url = bookmarkStore.items[i].url;
      if(title.includes(bookmarkStore.searchTerm)){      
        {if(bookmarkStore.items[i].edit){
          bookmarkListingHtml.push(generateEditBookmarkHtmlString(id,title,url,desc));
        }
        else if(bookmarkStore.items[i].expanded){
          bookmarkListingHtml.push(generateExpandedBookmarkHtml(id,title,rating,desc,url));
        }          
        else{        
          bookmarkListingHtml.push(generateBookmarkItemHtmlString(id,title,rating));
        }
        }
      }          
    }
    return bookmarkListingHtml.join('');
  }


  // render function 
  function render(){
    // clear all error fields
    $('.entry-error-field').empty();            
    if(bookmarkStore.adding){      
      $('.add-bookmark').html(generateAddBookmarkHtmlString());
    }
    else {$('.add-bookmark').html(generateBookmarkToolboxHtmlString());
    }
    if(bookmarkStore.errorMessage!==null){
      $('.entry-error-field').html(
        `<span class = 'fa fa-exclamation-triangle'></span>  ${bookmarkStore.errorMessage}`
      );
    }    
    if(bookmarkStore.starFilter){
      setStarFilterFalse();
      $('.bookmark-list').html(generateBookmarkListingHtmlStringAfterStarFilter());           
    }
    else if(bookmarkStore.searchTerm){
      $('.bookmark-list').html(generateBookmarkSearchHtmlString());
    }    
    else{            
      $('.bookmark-list').html(generateBookmarkListingHtmlString());      
    }
  }

  function editBookmarkHandler(){
    console.log('`editBookmark handler` ran');   
    $('ul').on('click','.bookmark-edit',function(event){
      const id = $(this).parents('li').data('item-id');
      let foundItem = bookmarkStore.items.find(bookmark=>bookmark.id===id);      
      Object.assign(foundItem,{edit:!foundItem.edit});     
      render();
    }); 
  }
  
  function editBookmarkAndUpdateStore(id,updateData){        
    let updateDataToStore = Object.assign(updateData,{expanded:false,edit:false});
    let foundItemStoreWithId = bookmarkStore.items.find(bookmark=> bookmark.id===id);
    Object.assign(foundItemStoreWithId,updateDataToStore);
    bookmarkStore.adding=false;
    render();
  }


  function editBookmarkCancel(){
    $('.bookmark-list').on('click','.edit-bookmark-cancel',function(){
      bookmarkStore.adding=false;
      bookmarkStore.errorMessage=null;
      const id = $(this).parents('li').data('item-id');
      let foundItem = bookmarkStore.items.find(bookmark=>bookmark.id===id);
      foundItem.edit=false;
      render();
    });
  }

  
  function editBookmark(){
    console.log('`editBookmark` ran');
    $('ul').on('submit','form',function(event){
      event.preventDefault();
      const id = $(this).parents('li').data('item-id');
      let bookMarkEdited = $(event.target).serializeJson();      
      api.updateItem(id,bookMarkEdited)
        .then(()=>{
          editBookmarkAndUpdateStore(id,JSON.parse(bookMarkEdited));})
        .catch(err => addErrorToStoreAndRender(err.message));
      render();
    });
  }

  function mouseOverBookmarkItem(){
    console.log('`mouseOverBookmark` ran');
    $('ul').on('mouseover','#bookmark-title-list',function(event){
      $(this).find('.bookmark-expand-delete').removeClass('hidden');
      $(this).addClass('hidden-shadow');      
    });
    $('ul').on('mouseout','#bookmark-title-list',function(event){
      $(this).find('.bookmark-expand-delete').addClass('hidden');  
      $(this).removeClass('hidden-shadow');      
    });
  }

  


  function findExpandedAndUpdateStore(id){
    let foundItem = bookmarkStore.items.find(bookmark=>bookmark.id===id);
    Object.assign(foundItem,{expanded:!foundItem.expanded});
  }

  function expandBookmark(){
    $('ul').on('click','.bookmark-expand',function(event){
      const id = $(this).parents('li').data('item-id');
      findExpandedAndUpdateStore(id);
      render();
    });
  }

  function addNewBookmarkToStore(object){
    console.log('`addNewBookmarkToStore` ran');
    let objectAddExpanded = Object.assign(object,{expanded:false,edit:false});    
    bookmarkStore.items.push(objectAddExpanded);
    bookmarkStore.adding=false;
    render();
  }

  // extend the serializJson function for listener event to call
  $.fn.extend(
    {
      // turn submit data into json format
      serializeJson:function(){
        const formData = new FormData(this[0]);
        const object = {};
        formData.forEach((val,name) => object[name]=val);
        return JSON.stringify(object);
      }

    }
  );
  
  function addErrorToStoreAndRender(error){
    bookmarkStore.errorMessage=error;
    render();
  }

  function addNewBookmark(){
    console.log('`addNewBookmark` ran');
    $('.add-bookmark').on('submit','form',function(event){
      event.preventDefault(); 
      bookmarkStore.errorMessage = null;
      let bookMark = $(event.target).serializeJson();
      api.createItem(bookMark)
        .then(resJson=>addNewBookmarkToStore(resJson))
        .catch(err => addErrorToStoreAndRender(err.message));
      render();                  
    });
  }

  function cancelAddBookmark(){
    console.log('`cancelAddBookmark` ran');
    $('.add-bookmark').on('click','.add-bookmark-cancel',function(){
      bookmarkStore.adding=false;
      bookmarkStore.errorMessage=null;
      render();
    });
  }


  function addNewBookmarkHandler(){
    console.log('`addNewBookmarkHandler` ran');
    $('.add-bookmark').on('click','.js-add-bookmark',function(){
      bookmarkStore.adding = true;      
      render();      
    });
  }

  function deleteBookmark(){
    console.log('`deleteBookmark` ran');
    $('ul').on('click','.bookmark-delete',function(event){
      if(!confirm('Are you sure?')) { 
        return; 
      }
      const id = $(this).parents('li').data('item-id');
      api.deleteItem(id)
        .then(() => bookmarkStore.deleteItem(id));
    });
  }


  function setStarFilterTrue(){
    bookmarkStore.starFilter = true;
    render();
  }

  function starFilterHandler(){
    console.log('`starFilterHandler` ran');
    $('.add-bookmark').on('change','.star-filter',function(){
      let starFilterValue = Number($(this).val()[0]);
      bookmarkStore.ratingSelected = starFilterValue;
      setStarFilterTrue();
    });
  }

  function setSearchTerm(val){
    bookmarkStore.searchTerm = val;
  }

  function bookmarkSearchHandler(){
    console.log('`bookmarkSearchHandler`ran');
    $('.book-mark-search').on('keyup',event=>{      
      const val=$(event.target).val();
      setSearchTerm(val);
      render();
    });
  }
  

  function bindEventListeners(){
    console.log('`bindEventListeners` ran');
    addNewBookmarkHandler();
    cancelAddBookmark();
    expandBookmark();
    deleteBookmark();
    editBookmarkHandler();
    addNewBookmark();
    mouseOverBookmarkItem();
    editBookmark();
    editBookmarkCancel();
    starFilterHandler();
    bookmarkSearchHandler(); 
    render();
    

  }

  return{  
    bindEventListeners:bindEventListeners,
    render:render
  };



}());