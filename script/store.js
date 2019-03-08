/* global bookmarkList */ 
'use strict';

const bookmarkStore = {
  items:[],
  deleteItem:function(id){
    const deleteItemIndex = this.items.findIndex(item => item.id === id);
    this.items.splice(deleteItemIndex, 1);
    bookmarkList.render();
  },
  adding: false,
  errorMessage:null,
  starFilter:false, 
  ratingSelected:null,
  searchTerm:''
};



