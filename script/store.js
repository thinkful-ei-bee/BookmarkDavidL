'use strict';

const bookmarkStore = {
  items:[],
  addItem:function(item){
    this.items.push(item);
  },
  adding: false,
  errorMessage:null,
  starFilter:false, 
  searchTerm:null
};



