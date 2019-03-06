'use strict';
/* global api bookmarkList bookmarkStore*/




function addItemsToLocalStoreAndRender(resJson){
  resJson.forEach(bookmark => bookmarkStore.items.push(bookmark));
  bookmarkList.render();
}  





$(document).ready(function() {
  
  api.getItems()
    .then(resJson => addItemsToLocalStoreAndRender(resJson));
  //.catch(err => addErrorToStoreAndRender(err.message));
  bookmarkList.bindEventListeners();
  
});