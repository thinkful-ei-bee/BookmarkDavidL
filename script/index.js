'use strict';
/* global api bookmarkList bookmarkStore*/




function addItemsToLocalStoreAndRender(resJson){
  resJson.forEach(bookmark => {
    let objectAddExpanded = Object.assign(bookmark,{expanded:false,edit:false});
    bookmarkStore.items.push(objectAddExpanded);});
  bookmarkList.render();
}  





$(document).ready(function() {
  
  api.getItems()
    .then(resJson => addItemsToLocalStoreAndRender(resJson));
  //.catch(err => addErrorToStoreAndRender(err.message));
  bookmarkList.bindEventListeners();
  
});