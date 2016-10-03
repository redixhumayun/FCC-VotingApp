'use strict';
var appUrl = window.location.origin;

var ajaxFunctions = {
  ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
  },
  ajaxRequest: function ajaxRequest (method, url, data, callback) {
      var xmlhttp = new XMLHttpRequest();
      console.log('Inside ajaxRequest');
      
      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      //IMPORTANT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      xmlhttp.setRequestHeader('Content-type', 'application/json'); //IMPORTNAOITENOEUNOUNTOUNT!!!!!!!!! have this set to application/json for now. Might need to change that for different AJAX calls. 
      xmlhttp.send(data);
  }
};