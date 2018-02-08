//See http://stackoverflow.com/questions/12125143/giving-initial-value-to-observable-from-the-html-markup
define( [ 'knockout', 'jquery', 'shell/shell', 'bootstrap', 'bootstrap-select' ],
function(ko, $, shl)
{
    return { install: function()
                      {
                          //console.log("!!!! initValue.js ");
                          ko.bindingHandlers.initValue = { init: function(element, valueAccessor) 
                                                                 {
                                                                     var value = valueAccessor();
                                                                     if (!ko.isWriteableObservable(value)) 
                                                                     {
                                                                         throw new Error('Knockout "initValue" binding expects an observable.');
                                                                     }
                                                                     value(element.value);
                                                                 }
                                                         };
                      }
           }
});
