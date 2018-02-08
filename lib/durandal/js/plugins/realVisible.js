define( [ 'knockout', 'jquery', 'bootstrap', 'bootstrap-select' ],
function(ko, $)
{
    return { install: function()
                      {
                          //console.log("!!!! realVisible.js ");
                          ko.bindingHandlers["realVisible"] = { init: function(element, valueAccessor) 
                                                                      {
                                                                          var val = ko.utils.unwrapObservable(valueAccessor());
                                                                          if (val) 
                                                                          {
                                                                              //console.log("!!!! realVisible.js(), init(): val = " + val);
                                                                              $(element).show();
                                                                          }
                                                                          else 
                                                                          {
                                                                              //console.log("!!!! realVisible.js(), init(): val is empty");
                                                                              $(element).hide();
                                                                          }
                                                                      },
                                                                update: function(element, valueAccessor)
                                                                        {
                                                                            var val = ko.utils.unwrapObservable(valueAccessor());
                                                                            if (val)
                                                                            {
                                                                                //console.log("!!!! realVisible.js(), update(): val = " + val);
                                                                                $(element).show();
                                                                            }
                                                                            else
                                                                            {
                                                                                //console.log("!!!! realVisible.js(), update(): val is empty");
                                                                                $(element).hide();
                                                                            }
                                                                        }
                                                              };
                      }
           };
});
