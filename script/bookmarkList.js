'use strict';
/*global bookmarkStore api $ addItemsToLocalStoreAndRender*/ 

const bookmarkList = (function(){




  // geneate string for bookmark toolbox
  function generateAddBookmarkHtmlString(){
    return `<div class='new-bookmark-input-field'>
    <form name = 'add-bookmark-form' class='add-bookmark-form'>
    <div> 
    <input id="title-input-add-book" type="text" name='title' placeholder="book title" ></input>
    <input id = "url-input-add-book" type="text" name='url' placeholder="url:http://" ></input>
    </div>
    <div>
        <textarea name = 'desc' rows='10' cols='150' type="text"></textarea>
    </div>
    <div class='star-rating'>
    <input type="radio" name="rating" value="1"> 1  ${generateRatingStarsHtmlString(1)}<br>
    <input type="radio" name="rating" value="2"> 2  ${generateRatingStarsHtmlString(2)}<br>
    <input type="radio" name="rating" value="3"> 3  ${generateRatingStarsHtmlString(3)}<br>
    <input type="radio" name="rating" value="4"> 4  ${generateRatingStarsHtmlString(4)}<br>
    <input type="radio" name="rating" value="5"> 5  ${generateRatingStarsHtmlString(5)}<br>
    </div>
    <button type = 'submit' class='add-bookmark-submit'>Submit</button>
    
  </form></div>
  
    `;
  }

  function generateEditBookmarkHtmlString(id,title,url,desc){
    return `<div class='edit-box'><li data-item-id = ${id} class = 'edit-bookmark-expand' id='bookmark-title-edit'>
    <div class='edit-bookmark-input-field'>
    <form name = 'add-bookmark-form' class='add-bookmark-form'>
    <div> 
    <input type="text" name='title' value=${title} ></input>
    <input type="text" name='url' value=${url} > </input>
    </div>
    <div>
        <textarea name = 'desc' rows='10' cols='150' type="text" >${desc}</textarea>
    </div>
    <div class='star-rating'>
    <input type="radio" name="rating" value="1"> 1<br>
    <input type="radio" name="rating" value="2"> 2<br>
    <input type="radio" name="rating" value="3"> 3<br>
    <input type="radio" name="rating" value="4"> 4<br>
    <input type="radio" name="rating" value="5"> 5<br>
    </div>
    <button type = 'submit' class='edit-bookmark-submit'>Submit</button>
    
  </form></div></li></div>
  
    `;
  }


  function generateBookmarkToolboxHtmlString(){
    return `
    <div class="box bookmark-tool-box">
    <div class='bookmark-tool-search'>
            <button class="js-add-bookmark" type = 'submit'>Add New Bookmark</button>
            <select class = 'star-filter' placeholder = 'minimum rating'name="star-filter">
            <option id="1-star" value="1">minimum rating</option>
            <option id="1-star" value="1">1 star</option>
            <option id="2-star" value="2">2 stars</option>
            <option id="3-star" value="3">3 stars</option>
            <option id="4-star" value="4">4 stars</option>
            <option id="5-star" value="5">5 stars</option>
            </select>
            <input class = 'bookmark-search' placeholder="search bookmark"></input>
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
      starHtmlString.push('<span class="fa fa-star" style="color:lightgray"></span>');
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
    
      <div class = 'title'>
      ${title}
      </div>
      
        <div class='bookmark-expand-delete hidden'>
          <span class='bookmark-expand fa fa-expand fa-lg'></span>
          <span class='bookmark-delete fa fa-trash fa-lg'></span>
        </div>
      </div>
      
      <div class='book-description'><h5>Description</h5>
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

  function generateBookmarkListingHtmlStringAfterStarFilter(){
    // set starfilter false to reset
    
    let bookmarkListingHtml = [];
    
    
    for(let i = 0; i<bookmarkStore.items.length; i++){
      
      let id = bookmarkStore.items[i].id;
      let title = bookmarkStore.items[i].title;
      let rating = bookmarkStore.items[i].rating;
      let desc = bookmarkStore.items[i].desc;
      let url = bookmarkStore.items[i].url;
      if(rating >= bookmarkStore.ratingSelected){
        console.log('rating',rating,'id',id,'bookmarkStore ratingselected',bookmarkStore.ratingSelected);
        {if(bookmarkStore.items[i].edit){
          bookmarkListingHtml.push(generateEditBookmarkHtmlString(id,title,url,desc));
        }
        else if(bookmarkStore.items[i].expanded){
          bookmarkListingHtml.push(generateExpandedBookmarkHtml(id,title,rating,desc,url));
        }
     
        //console.log('testing inside loop',id,title,rating);
        else{
        
          bookmarkListingHtml.push(generateBookmarkItemHtmlString(id,title,rating));
        }
        }
    
        //console.log('testing bookmarkListing string',bookmarkListingHtml);
        
      }
      
    
    }
    return bookmarkListingHtml.join('');
  }






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
    if(bookmarkStore.starFilter){
      setStarFilterFalse();
      $('.bookmark-list').html(generateBookmarkListingHtmlStringAfterStarFilter());
      
      console.log('test filter selected',generateBookmarkListingHtmlStringAfterStarFilter());
    }else{
      console.log('test filter not selected',generateBookmarkListingHtmlString());
      $('.bookmark-list').html(generateBookmarkListingHtmlString());
    }
  }

  function editBookmarkHandler(){
    console.log('`editBookmark handler` ran');   
    $('ul').on('click','.bookmark-edit',function(event){
      const id = $(this).parents('li').data('item-id');
      let foundItem = bookmarkStore.items.find(bookmark=>bookmark.id===id);
      console.log('test founditem in edit',foundItem);
      Object.assign(foundItem,{edit:!foundItem.edit});     
      render();
    }); 
  }
  
  function editBookmarkAndUpdateStore(id,updateData){
    
    console.log('testing editbookmark to store updateData',updateData);
    let updateDataToStore = Object.assign(updateData,{expanded:false,edit:false});
    console.log('testing editbookmark to store updateDataToStore',updateDataToStore);
    let foundItemStoreWithId = bookmarkStore.items.find(bookmark=> bookmark.id===id);
    console.log('testing editbookmark to store foundItem with id',foundItemStoreWithId);
    Object.assign(foundItemStoreWithId,updateDataToStore);
    bookmarkStore.adding=false;
    render();
  }

  // edit-bookmark-submit-cancel
  function editBookmark(){
    console.log('`editBookmark` ran');
    $('ul').on('submit','form',function(event){
      event.preventDefault();
      const id = $(this).parents('li').data('item-id');
      let bookMarkEdited = $(event.target).serializeJson();

      console.log('testing edited json form content current',bookMarkEdited,id);
      api.updateItem(id,bookMarkEdited)
        .then(()=>{
          // need to convert an jason object back to javascript object.
          // here using JSON.parse()
          editBookmarkAndUpdateStore(id,JSON.parse(bookMarkEdited));})
      // tested, nothing returned
      //.then(resJ=>console.log('testing j',resJ)) 
      // api.getItem()
        
      //     console.log('testing unique item',resJson);
      //     addItemsToLocalStoreAndRender(resJson);
      //   })
        .catch(err => addErrorToStoreAndRender(err.message));
      render();
    });
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
    $('ul').on('click','.bookmark-delete',function(event){
      if(!confirm('Text here')) { 
        return; 
      }
      const id = $(this).parents('li').data('item-id');
      console.log('delete',id);
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

  function bindEventListeners(){
    addNewBookmarkHandler();
    expandBookmark();
    deleteBookmark();
    editBookmarkHandler();
    addNewBookmark();
    mouseOverBookmarkItem();
    editBookmark();
    starFilterHandler();
   
    
    render();
    console.log('`bindEventListeners` ran');

  }

  return{
    
    bindEventListeners:bindEventListeners,
    render:render
  };



}());