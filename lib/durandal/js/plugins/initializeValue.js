define( [ 'knockout', 'jquery', 'shell/shell', 'bootstrap', 'bootstrap-select' ],
function(ko, $, shl)
{
    return { install: function()
                      {
                          //console.log("!!!! initializeValue.js ");
                          ko.bindingHandlers.initializeValue = { init: function(element, valueAccessor) 
                                                                    {
                                                                        console.log("---- initializeValue.js init. shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one = " + shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one);
                                                                        valueAccessor()(element.getAttribute('value'));
                                                                    },
                                                              update: function(element, valueAccessor) 
                                                                      {
                                                                        console.log("---- initializeValue.js update shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one = " + shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one);
                                                                          var value = valueAccessor();
                                                                        console.log("---- initializeValue.js update value = " + ko.utils.unwrapObservable(value));
                                                                          element.setAttribute('value', ko.utils.unwrapObservable(value))

                                                                          shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one = ko.utils.unwrapObservable(value);
                                                                          console.log("---- initializeValue.js update (AFTER): shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one = " + shl.enteredAndSelectedPageValues.donation_info_page.donation_amount_to_desg_one);
                                                                      }
                                                            };
                      }
           }
});
