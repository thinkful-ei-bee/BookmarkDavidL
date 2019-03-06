'use strict';
/*global bookmarkStore api $ */ 

const bookmarkList = (function(){




  // geneate string for bookmark toolbox
  function generateAddBookmarkHtmlString(){
    return `<div class='new-bookmark-input-field'>
    <form name = 'add-bookmark-form' class='add-bookmark-form'>
    <div> 
    <input type="text" name='title' placeholder="book title" ></input>
    <input type="text" name='url' placeholder="site link" ></input>
    </div>
    <div>
        <textarea name = 'desc' rows='5' cols='50' placeholder='description'type="text"></textarea>
    </div>
    <div class='star-rating'>
    <input type="radio" name="rating" value="1">1<br>
    <input type="radio" name="rating" value="2">2<br>
    <input type="radio" name="rating" value="3"> 3<br>
    <input type="radio" name="rating" value="4"> 4<br>
    <input type="radio" name="rating" value="5"> 5<br>
    </div>
    <button type = 'submit' class='add-bookmark-submit'>Submit</button>
    <button type = 'button' class='add-bookmark-submit-cancel'>cancel</button>
  </form></div>
  
    `;
  }
  function generateBookmarkToolboxHtmlString(){
    return `
    <div class="box bookmark-tool-box">
    <div class='bookmark-tool-search'>
            <button class="js-add-bookmark" type = 'submit'>Add New Bookmark</button>
            <select class = 'star-filter' placeholder = 'minimum rating'name="star-filter">
              <option id="star" value="1 star">1 star</option>
              <option id="star" value="2 stars">2 stars</option>
              <option id="star" value="3 stars">3 stars</option>
              <option id="star" value="4 stars">4 stars</option>
              <option id="star" value="5 stars">5 stars</option>
            </select>
            </div>
            <div class='search-bookmark'>
           <input placeholder="search bookmark"></input>
           </div>
           </div>
    `;
  }

  // generate string for bookmark listing
  function generateRatingStarsHtmlString(rating){
    const starHtmlString = [];
    for(let i = 0;i<rating;i++){
      starHtmlString.push('<span class="fa fa-star checked"></span>');
    }
    for(let i = 0;i<(5-rating);i++){
      starHtmlString.push('<span class="fa fa-star"></span>');
    }
    //console.log('test stars rating string',starHtmlString.join(''));
    return starHtmlString.join('');
  }
  
  function generateBookmarkItemHtmlString(id,title,rating){
    
    
    return ` <li data-item-id = ${id} id='bookmark-title-list'>
    <div class='book-title'>
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
  function generateExpandedBookmarkHtml(id,title,rating,desc,url){
    return `<li data-item-id = ${id} class="expanded"id='bookmark-title-list'>
    <div class='book-title'>
      ${title}
    </div>
    <div class='book-description'>
      ${desc}
    </div>
    <div class="bookmark-visit-site">
    <a target="_blank" href = ${url}>Visit site</a>
    </div>
    <div class="bookmark-edit-collaspe">
        <button class="bookmark-collapse-expanded">Collapse</button>
        <button class="bookmark-edit">Edit</button>
        </div>
    <div class='book-star-rating'>              
    ${generateRatingStarsHtmlString(rating)}
    </div>
  </li>`;
  }

  function generateBookmarkListingHtmlString(){
    let bookmarkListingHtml = [];
    
    for(let i = 0; i<bookmarkStore.items.length; i++){
      
      let id = bookmarkStore.items[i].id;
      let title = bookmarkStore.items[i].title;
      let rating = bookmarkStore.items[i].rating;
      let desc = bookmarkStore.items[i].desc;
      let url = bookmarkStore.items[i].url;
      if(bookmarkStore.items[i].expanded){
        bookmarkListingHtml.push(generateExpandedBookmarkHtml(id,title,rating,desc,url));
      }
      //console.log('testing inside loop',id,title,rating);
      else{
        bookmarkListingHtml.push(generateBookmarkItemHtmlString(id,title,rating));
      }
    }
    //console.log('testing bookmarkListing string',bookmarkListingHtml);
    return bookmarkListingHtml.join('');
  }

  
  // render function 
  function render(){
    $('.entry-error-field').empty();
    if(bookmarkStore.adding){
      //console.log('adding is true');
      $('.add-bookmark').html(generateAddBookmarkHtmlString());
    }

    else {$('.add-bookmark').html(generateBookmarkToolboxHtmlString());
    }
    if(bookmarkStore.errorMessage!==null){
      $('.entry-error-field').html(
        `${bookmarkStore.errorMessage}`
      );
    }
    //console.log('testing bookmarklist whole string',generateBookmarkListingHtmlString());
    //console.log(bookmarkStore.items);
    $('.bookmark-list').html(generateBookmarkListingHtmlString());
  }

  function editBookmark(){
    console.log('`editBookmark` ran');    
  }

  

  function mouseOverBookmarkItem(){
    console.log('`mouseOverBookmark` ran');
    $('ul').on('mouseover','#bookmark-title-list',function(event){
      $(this).find('.bookmark-expand-delete').removeClass('hidden');
      
    });
    $('ul').on('mouseout','#bookmark-title-list',function(event){
      $(this).find('.bookmark-expand-delete').addClass('hidden');  
      
    });
  }

  function findExpandedAndUpdateStore(id){
    let foundItem = bookmarkStore.items.find(bookmark=>bookmark.id===id);
    Object.assign(foundItem,{expanded:true});
  }

  function expandBookmark(){
    $('ul').on('click','.bookmark-expand',function(event){
      const id = $(this).parents('li').data('item-id');
      findExpandedAndUpdateStore(id);
      render();
    });
  }

  function setExpandedFalse(id){
    let foundItem = bookmarkStore.items.find(bookmark => bookmark.id===id);
    foundItem.expanded = false;
  }

  function collaspeBookmark(){
    console.log('`collaspeBookmark` ran');
    $('ul').on('click','.bookmark-collapse-expanded',function(){
      const id = $(this).parents('li').data('item-id');
      setExpandedFalse(id);
      render();
    });
  }

  function addNewBookmarkToStore(object){
    console.log('`addNewBookmarkToStore` ran');
    let objectAddExpanded = Object.assign(object,{expanded:false});
    
    bookmarkStore.items.push(objectAddExpanded);
    bookmarkStore.adding=false;
    console.log('testing adding',bookmarkStore.adding);
    render();
  }

  $.fn.extend(
    {
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
      console.log('submit clicked',$(this).val());
      let bookMark = $(event.target).serializeJson();
      console.log('testing bookmark object',bookMark);
      api.createItem(bookMark)
        //.then(res=>res.json())
        .then(resJson=>addNewBookmarkToStore(resJson))
        .catch(err => addErrorToStoreAndRender(err.message));
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
  }

  function bindEventListeners(){
    addNewBookmarkHandler();
    expandBookmark();
    deleteBookmark();
    editBookmark();
    addNewBookmark();
    mouseOverBookmarkItem();
    collaspeBookmark();
    
    render();
    console.log('`bindEventListeners` ran');

  }

  return{
    
    bindEventListeners:bindEventListeners,
    render:render
  };



}());