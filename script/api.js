'use strict';

const api = (function(){
  
  
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/JizongL';

  function listApiFetch(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          // Valid HTTP response but non-2xx status - let's create an error!
          error = { code: res.status };
        }
  
        // In either case, parse the JSON stream:
        return res.json();
      })
  
      .then(data => {
        // If error was flagged, reject the Promise with the error object
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
  
        // Otherwise give back the data as resolved Promise
        return data;
      });
  }

  const getItems = function(){
    return listApiFetch(BASE_URL+'/bookmarks');
  };

  const getUniqueItem = function(id){
    return listApiFetch(BASE_URL+`/bookmarks/${id}`);
  };

  const createItem = function(newItem){
    
    const option = {
      method:'POST',
      headers:new Headers({
        'Content-type':'application/json'
      }),
      body:newItem
    };
    return listApiFetch(BASE_URL+'/bookmarks',option);
  };

  const updateItem = function(id, updateData){
    const option = {
      method: 'PATCH', 
      headers: new Headers ({
        'Content-type': 'application/json'
      }),
      body: updateData
    };
    
    return listApiFetch(BASE_URL+`/bookmarks/${id}`, option);
  };

  const deleteItem=function(id){
    const option = {
      method: 'DELETE', 
      headers: new Headers ({
        'Content-type': 'application/json'
      }),
    };
    return fetch(BASE_URL+`/bookmarks/${id}`,option);
  };


  return {
    getItems:getItems,
    createItem:createItem,
    deleteItem:deleteItem,
    updateItem:updateItem,
    getUniqueItem:getUniqueItem
  };
}());