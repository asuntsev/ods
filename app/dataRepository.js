//define(function(require){
//  return {
//    getCustomers:function(){
//      return $.getJSON('http://localhost:5000/getListOfDesignations').promise(); //do some ajax and return a promise
//    }
//  };
//});

define(function (require)
       {
           var serverDataSupplies_DR = [];

           return { serverDataSupplies_DR: serverDataSupplies_DR,

                    requestServerDataSupplies: function()
                                               {
                                                   var self = this;
                                                   console.log("---- dataRepository: (1)");
                                                   return getServerDataSuppliesService.getServerDataSupplies().then(function(results)
                                                                                      {
                                                                                          self.serverDataSupplies_DR(results.serverDataSupplies);
                                                                                      });
                                               },

                    getServerDataSupplies: function()
                                           {
                                               var that = this;
                                               console.log("---- dataRepository: (2)");
                                               console.log(that.serverDataSupplies_DR);
                                               console.log("---- dataRepository: (2)");
                                               return that.serverDataSupplies_DR;
                                           }
                  };
       });


//  define(function(require){
//    var backend = require('backend');
//
//    return {
//      customers:ko.observableArray([]),
//      activate:function(){
//        var that = this;
//        return backend.getCustomers().then(function(results){
//          that.customers(results);
//        });
//      }
//    };
//  });

