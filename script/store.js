'use strict';

const bookmarkStore = {
  items:[{
    id: '8sdfbvbs65sd',
    title: 'Google',
    url: 'http://google.com',
    desc: 'An indie search engine startup',
    rating: 4, expanded:false, deleteTrans:false }],
  addItem:function(item){
    this.items.push(item);
  },
  adding: false,
  errorMessage:null,
  starFilter:false, 
  searchTerm:null
};



