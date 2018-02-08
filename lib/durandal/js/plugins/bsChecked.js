// See http://stackoverflow.com/questions/20077475/knockout-bootstrap-3-radio-buttons
define( [ 'knockout', 'jquery', 'bootstrap', 'bootstrap-select' ],
       function(ko, $)
       {
           return { install: function()
                             {
                                 //console.log("!!!! bsChecked.js");
                                 ko.bindingHandlers.bsChecked = { init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
                                                                        {
                                                                            var value = valueAccessor();
                                                                            var newValueAccessor = function ()
                                                                            {
                                                                                return { change: function ()
                                                                                                 {
                                                                                                     value(element.value);
                                                                                                 }
                                                                                       }
                                                                            };

                                                                            ko.bindingHandlers.event.init(element, newValueAccessor,
                                                                            allBindingsAccessor, viewModel, bindingContext);
                                                                        },

                                                                  update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
                                                                          {
                                                                              if ($(element).val() == ko.unwrap(valueAccessor()))
                                                                              {
                                                                                  setTimeout(function ()
                                                                                             {
                                                                                                 $(element).closest('.btn').button('toggle');
                                                                                             }, 1);
                                                                              }
                                                                          }
                                                                 
                                                                 };
                             }
                  }
       });

