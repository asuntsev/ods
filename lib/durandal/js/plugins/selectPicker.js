define( [ 'knockout', 'jquery', 'bootstrap', 'bootstrap-select' ],
       function(ko, $)
       {
           return { install: function()
                             {
                                 //console.log("!!!! selectPicker.js");
                                 ko.bindingHandlers.selectPicker = {after: [ 'options' ],   /* KO 3.0 feature to ensure binding execution order */
                                                                    init: function(element, valueAccessor, allBindingsAccessor)
                                                                          {
                                                                                          //console.log("i #### 1");
                                                                              if ($(element).is('select'))
                                                                              {
                                                                                          //console.log("i #### 2");
                                                                                  if (ko.isObservable(valueAccessor()))
                                                                                  {
                                                                                          //console.log("i #### 3");
                                                                                      if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor())))
                                                                                      {
                                                                                          //console.log("i #### 4");
                                                                                          // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                                                                                          ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                                                                                      }
                                                                                      else
                                                                                      {
                                                                                          // regular select and observable so call the default value binding
                                                                                          //console.log("i #### 5");
                                                                                          ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                                                                                      }
                                                                                  }
                                                                                  $(element).addClass('selectpicker').selectpicker();
                                                                              }
                                                                          },
                                                                    update: function(element, valueAccessor, allBindingsAccessor)
                                                                            {
                                                                                          //console.log("u #### 1");
                                                                                if ($(element).is('select'))
                                                                                {
                                                                                          //console.log("u #### 2");
                                                                                    var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
                                                                                    if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null)
                                                                                    {
                                                                                          //console.log("u #### 3");
                                                                                        var options = selectPickerOptions.optionsArray,
                                                                                            optionsText = selectPickerOptions.optionsText,
                                                                                            optionsValue = selectPickerOptions.optionsValue,
                                                                                            optionsCaption = selectPickerOptions.optionsCaption,
                                                                                            isDisabled = selectPickerOptions.disabledCondition || false,
                                                                                            resetOnDisabled = selectPickerOptions.resetOnDisabled || false;

                                                                                          //console.log("u #### 4");
                                                                                        if (ko.utils.unwrapObservable(options).length > 0)
                                                                                        {
                                                                                          //console.log("u #### 5");
                                                                                            // call the default Knockout options binding
                                                                                            ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                                                                                        }
                                                                                          //console.log("u #### 6");
                                                                                        if (isDisabled && resetOnDisabled)
                                                                                        {
                                                                                          //console.log("-u #### 7");
                                                                                            // the dropdown is disabled and we need to reset it to its first option
                                                                                            $(element).selectpicker('val', $(element).children('option:first').val());
                                                                                        }
                                                                                        $(element).prop('disabled', isDisabled);
                                                                                          //console.log("u #### 8");
                                                                                    }
                                                                                          //console.log("u #### 9");
                                                                                    if (ko.isObservable(valueAccessor()))
                                                                                    {
                                                                                          //console.log("u #### 10");
                                                                                        if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor())))
                                                                                        {
                                                                                          //console.log("u #### 11");
                                                                                            // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                                                                                          ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                          //console.log("-u #### 12");
                                                                                            // call the default Knockout value binding
                                                                                            ko.bindingHandlers.value.update(element, valueAccessor);
                                                                                        }
                                                                                    }

                                                                                          //console.log("u #### 13");
                                                                                    $(element).selectpicker('refresh');
                                                                                }
                                                                            }
                                                                   };
                             }
                  }
       });

//define( [ 'knockout', 'jquery', 'bootstrap', 'bootstrap-select' ],
//       function(ko, $)
//       {
//           return { install: function()
//                             {
//                                 //console.log("---- selectPicker.js");
//                                 ko.bindingHandlers.selectPicker = {init: function(element, valueAccessor, allBindingsAccessor)
//                                                                          {
//                                                                              if ($(element).is('select'))
//                                                                              {
//                                                                                  if (ko.isObservable(valueAccessor()))
//                                                                                  {
//                                                                                      if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor())))
//                                                                                      {
//                                                                                          // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
//                                                                                          ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
//                                                                                      }
//                                                                                      else
//                                                                                      {
//                                                                                          // regular select and observable so call the default value binding
//                                                                                          ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
//                                                                                      }
//                                                                                  }
//                                                                                  $(element).addClass('selectpicker').selectpicker();
//                                                                              }
//                                                                          },
//                                                                     update: function(element, valueAccessor, allBindingsAccessor)
//                                                                             {
//                                                                                 if ($(element).is('select'))
//                                                                                 {
//                                                                                     var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
//                                                                                     if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null)
//                                                                                     {
//                                                                                         var options = selectPickerOptions.optionsArray,
//                                                                                             optionsText = selectPickerOptions.optionsText,
//                                                                                             optionsValue = selectPickerOptions.optionsValue,
//                                                                                             optionsCaption = selectPickerOptions.optionsCaption,
//                                                                                             isDisabled = selectPickerOptions.disabledCondition || false,
//                                                                                             resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
//                                                                                         if (ko.utils.unwrapObservable(options).length > 0)
//                                                                                         {
//                                                                                             // call the default Knockout options binding
//                                                                                             ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
//                                                                                         }
//                                                                                         if (isDisabled && resetOnDisabled)
//                                                                                         {
//                                                                                             // the dropdown is disabled and we need to reset it to its first option
//                                                                                             $(element).selectpicker('val', $(element).children('option:first').val());
//                                                                                         }
//                                                                                         $(element).prop('disabled', isDisabled);
//                                                                                     }
//
//                                                                                     if (ko.isObservable(valueAccessor()))
//                                                                                     {
//                                                                                         if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor())))
//                                                                                         {
//                                                                                             // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
//                                                                                             ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
//                                                                                         }
//                                                                                         else
//                                                                                         {
//                                                                                             // call the default Knockout value binding
//                                                                                             ko.bindingHandlers.value.update(element, valueAccessor);
//                                                                                         }
//                                                                                     }
//
//                                                                                     $(element).selectpicker('refresh');
//                                                                                 }
//                                                                             }
//                                                                   }
//                             }
//           };
//       });


//See <div data-bind="test: {}"></div> in donation_info.js for testing custom bindings
//define([ 'jquery', 'knockout'],
//  function ($, ko) {
//    ko.bindingHandlers.test = {
//      init: function(element, valueAccessor, allBindingsAccessor) {alert(0);},
//      update: function(element, valueAccessor, allBindingsAccessor) {alert(1);}
//    }
//    var model = function(){}
//    return new model();
//});

