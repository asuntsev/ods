//define(function(require){
//  return {
//    getCustomers:function(){
//      return $.getJSON('http://localhost:5000/getListOfDesignations').promise(); //do some ajax and return a promise
//    }
//  };
//});

//  define(function(require){
//    return {
//      getServerDataSupplies:function(){
//        //do some ajax and return a promise
//      }
//    };
//  });

define(function(require)
       {
           var backend = function (service_url) 
                         {
                            this.url = service_url;
                         };

           backend.prototype.getServerDataSupplies = function()
                                                     {
                                                         //  var jqxhr = $.getJSON(this.url+'/projects');
                                                             var jqxhr = $.getJSON(this.url);

                                                             return jqxhr;
                                                     };
           return backend;
       });
