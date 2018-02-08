// See this approach description at http://www.lobsterfs.co.uk/blog/singleton-transient-durandal/
define(['durandal/app', 'knockout', './shell', 'plugins/cssLoader'], function (app,ko,shl,cssLoader)
{
    var vm = function () 
             {
                 var self = this;
                 var router = require('plugins/router');

                 ko.observableArray.fn.filterByProperty = function(propName, matchValue) 
                                                          {
                                                              return ko.pureComputed(function() 
                                                                                     {
                                                                                         var allItems = this(), matchingItems = [];
                                                                                         for (var i = 0; i < allItems.length; i++) 
                                                                                         {
                                                                                             var current = allItems[i];
                                                                                             if (ko.unwrap(current[propName]) === matchValue)
                                                                                             {
                                                                                                 matchingItems.push(current);
                                                                                                 //console.log("++++ current = " + current);
                                                                                             }
                                                                                         }
                                                                                         return matchingItems;
                                                                                     }, this);
                                                          };

                 //----------------------------------------------------------------------------------------------------

                 self.compositionComplete =  function () 
                                             {
                                                 //console.log("---- donation_info.js, compositionComplete():");
                                                 cssLoader.loadCss('app/viewmodels/project_custom.css');
                                                 //console.log("---- donation_info.js, compositionComplete() after:");
                                                 //cssLoader.loadCss("sample2.css");
                                             };

                 self.deactivate =  function () 
                                    {
                                        cssLoader.removeModuleCss();
                                    }

                 //----------------------------------------------------------------------------------------------------

                 self.paddingBottomValue = ko.observable();

                 //----------------------------------------------------------------------------------------------------

                 self.serverDataSupplies =                    ko.observableArray([]);
                 self.listOfODSParameters =                   ko.observableArray([]);

                 //---------------------------------------------------------------------------------------------------------

                 self.listOfDesignations_one =                ko.observableArray([]);
                 self.selectedDesignation_one =               ko.observable();
                 self.isSpecialDesgInputVisible_one =         ko.observable(false);
                 self.other_1st_desg_description =            ko.observable();
                 self.donation_amount_to_desg_one =           ko.observable();
                 
                 self.isOtherDesgDivVisible_two =             ko.observable(false);
                 self.listOfDesignations_two =                ko.observableArray([]);
                 self.selectedDesignation_two =               ko.observable();
                 self.isSpecialDesgInputVisible_two =         ko.observable(false);
                 self.other_2nd_desg_description =            ko.observable();
                 self.donation_amount_to_desg_two =           ko.observable();
                 
                 self.isOtherDesgDivVisible_three =           ko.observable(false);
                 self.listOfDesignations_three =              ko.observableArray([]);
                 self.selectedDesignation_three =             ko.observable();
                 self.isSpecialDesgInputVisible_three =       ko.observable(false);
                 self.other_3rd_desg_description =            ko.observable();
                 self.donation_amount_to_desg_three =         ko.observable();

                 self.isDonateToOtherDesgButtonVisible =      ko.observable(true);
                 
                 //---------------------------------------------------------------------------------------------------------
                 
                 self.listOfReasonsToDonate =                 ko.observableArray([]);
                 self.selectedReasonToDonate =                ko.observable();
                 self.isReasonToDonateEqualMailing =          ko.observable(false);
                 self.reasonToDonateEnvelopCode =             ko.observable();
                 
                 //---------------------------------------------------------------------------------------------------------
                 
                 self.isThisPledgePayment =                   ko.observable();
                 self.isThisGiftAnonymous =                   ko.observable();

                 //---------------------------------------------------------------------------------------------------------

                 self.giftComments =                          ko.observable();

                 //---------------------------------------------------------------------------------------------------------

                 self.radioSelectedOptionValue =              ko.observable();
//               self.radio_HM_of =                           ko.observable();
                 self.showTributeInfo =                       ko.observable();

                 self.tributeFirstName =                      ko.observable(); //In memory of/In honor of
                 self.tributeLastName =                       ko.observable(); //In memory of/In honor of
                 self.tributeFullName =                       ko.observable(); //self.tributeFirstName + self.tributeLastName
                 self.tributeRelationToDonor =                ko.observable(); //Like Wife, Friend, daughter etc

                 //---------------------------------------------------------------------------------------------------------
                 
                 self.mailLetterOnDonorBehalf =               ko.observable();

                 self.mailBehalf_PersonToNotify =             ko.observable();
                 self.mailBehalf_EMail =                      ko.observable();
                 self.mailBehalf_AddressLine_1 =              ko.observable();
                 self.mailBehalf_AddressLine_2 =              ko.observable();
                 self.mailBehalf_City =                       ko.observable();   
                 self.mailBehalf_ZIP =                        ko.observable();

                 self.mailBehalf_ListOfCountries =            ko.observableArray([]);
                 self.mailBehalf_CountrySelected =            ko.observable();

                 self.mailBehalf_ListOfRegions =              ko.observableArray([]);
                 self.mailBehalf_RegionSelected =             ko.observable();
                 //self.filteredListOfRegions =                 ko.observableArray([]);

                 //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                 self.mailBehalf_filters = [ {title:'Match to natn_code selected', filter: function(item) {return item.natn_code == ko.utils.unwrapObservable(self.mailBehalf_CountrySelected);}},
                                             {title:'Match to region_code selected', filter: function(item) {return item.region_code == ko.utils.unwrapObservable(self.mailBehalf_RegionSelected);}}  ];

                 //--------------------------------------------------------------------------------------------------------

                 self.makeSoftCreditToSomeone =               ko.observable();
                 self.softCredit_PersonFirstName =            ko.observable();
                 self.softCredit_PersonLastName =             ko.observable();
                 //self.softCredit_PersonAffilation =           ko.observable();

                 //--------------------------------------------------------------------------------------------------------

                 self.formatCurrency = function (value)
                                       {
                                           return "$" + value.toFixed(2);
                                       };

                  self.toggleVisibility = function() 
                                          {
                                              //console.log("---- toggeleVisibility(): self.isOtherDesgDivVisible_two (before) = " + ko.utils.unwrapObservable(self.isOtherDesgDivVisible_two));
                                              //console.log("---- toggeleVisibility(): self.isOtherDesgDivVisible_three (before) = " + ko.utils.unwrapObservable(self.isOtherDesgDivVisible_three));

                                              if ( ! ko.utils.unwrapObservable(self.isOtherDesgDivVisible_two) &&
                                                   ! isNaN(parseFloat(ko.utils.unwrapObservable(self.donation_amount_to_desg_one))))
                                              {
                                                  self.isOtherDesgDivVisible_two(!self.isOtherDesgDivVisible_two());
                                                  shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_two = ko.utils.unwrapObservable(self.isOtherDesgDivVisible_two);
                                                  //console.log("---- toggeleVisibility(): self.donation_amount_to_desg_two = " + ko.utils.unwrapObservable(self.donation_amount_to_desg_two));
                                                  self.isDonateToOtherDesgButtonVisible(true);
                                                  shl.enteredAndSelectedPageValues.isDonateToOtherDesgButtonVisible = true;
                                                  return;
                                              }

                                              if ( ! ko.utils.unwrapObservable(self.isOtherDesgDivVisible_three) &&
                                                   ! isNaN(parseFloat(ko.utils.unwrapObservable(self.donation_amount_to_desg_two))))
                                              {
                                                  self.isOtherDesgDivVisible_three(!self.isOtherDesgDivVisible_three());
                                                  shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_three = ko.utils.unwrapObservable(self.isOtherDesgDivVisible_three);
                                                  //console.log("---- toggeleVisibility(): self.donation_amount_to_desg_three = " + ko.utils.unwrapObservable(self.donation_amount_to_desg_three));
                                                  self.isDonateToOtherDesgButtonVisible(false);
                                                  shl.enteredAndSelectedPageValues.isDonateToOtherDesgButtonVisible = false;

                                                  return;
                                              }

                                              //console.log("---- toggeleVisibility(): self.isOtherDesgDivVisible_two (after) = " + ko.utils.unwrapObservable(self.isOtherDesgDivVisible_two));
                                              //console.log("---- toggeleVisibility(): self.isOtherDesgDivVisible_three (after) = " + ko.utils.unwrapObservable(self.isOtherDesgDivVisible_three));
                                          };

                  self.removeCurrentDesgControls_two = function() 
                                                       {
                                                           //console.log("---- self.removeCurrentDesgControls_two()");
                                                           
                                                           self.isOtherDesgDivVisible_two(!self.isOtherDesgDivVisible_two());
                                                           shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_two = ko.utils.unwrapObservable(self.isOtherDesgDivVisible_two);
                                                           shl.enteredAndSelectedPageValues.donation_amount_to_desg_two = "";
                                                           self.donation_amount_to_desg_two('');
                                                           
                                                           // $('#amount_to_donate_2').val('').trigger('change'); //See http://stackoverflow.com/questions/16324084/update-the-observable-when-input-value-is-changed-by-javascript
                                                           //console.log("---- self.removeCurrentDesgControls_two(): self.donation_amount_to_desg_two (after) = " + ko.utils.unwrapObservable(self.donation_amount_to_desg_two));
                                                           //self.selectedDesignation_two = ko.observable(shl.enteredAndSelectedPageValues.defaultDesignation_two);
                                                           //  self.selectedDesignation_two = $('#selector_desg_2').val(shl.enteredAndSelectedPageValues.defaultDesignation_two).trigger('change');  //See http://stackoverflow.com/questions/16324084/update-the-observable-when-input-value-is-changed-by-javascript
                                                           //console.log("---- self.removeCurrentDesgControls_two(): self.selectedDesignation_two (after) = " + ko.utils.unwrapObservable(self.selectedDesignation_two));
                                                           
                                                           self.isDonateToOtherDesgButtonVisible(true); 
                                                           shl.enteredAndSelectedPageValues.isDonateToOtherDesgButtonVisible = true;

                                                           shl.enteredAndSelectedPageValues.selectedDesignation_two_Desc = "";
                                                           shl.enteredAndSelectedPageValues.selectedDesignation_two_Campaign = "";
                                                       };
                  
                  self.removeCurrentDesgControls_three = function() 
                                                         {
                                                             self.isOtherDesgDivVisible_three(!self.isOtherDesgDivVisible_three());
                                                             shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_three = ko.utils.unwrapObservable(self.isOtherDesgDivVisible_three);
                                                             shl.enteredAndSelectedPageValues.donation_amount_to_desg_three = "";
                                                             self.donation_amount_to_desg_three('');
                                                             
                                                             //    $('#amount_to_donate_3').val('').trigger('change'); //See http://stackoverflow.com/questions/16324084/update-the-observable-when-input-value-is-changed-by-javascript
                                                             //console.log("---- self.removeCurrentDesgControls_three(): self.donation_amount_to_desg_three (after) = " + ko.utils.unwrapObservable(self.donation_amount_to_desg_three));
                                                             //self.selectedDesignation_three = ko.observable(shl.enteredAndSelectedPageValues.defaultDesignation_three);
                                                             //    self.selectedDesignation_three = $('#selector_desg_3').val(shl.enteredAndSelectedPageValues.defaultDesignation_three).trigger('change');  //See http://stackoverflow.com/questions/16324084/update-the-observable-when-input-value-is-changed-by-javascript
                                                             //console.log("---- self.removeCurrentDesgControls_three(): self.selectedDesignation_three (after) = " + ko.utils.unwrapObservable(self.selectedDesignation_three));

                                                             self.isDonateToOtherDesgButtonVisible(true);
                                                             shl.enteredAndSelectedPageValues.isDonateToOtherDesgButtonVisible = true;

                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three_Desc = "";
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three_Campaign = "";
                                                         };
                  
                  self.SpecialDesgInput_One_ToggleVisibility = function(_visible) 
                                                               {
                                                                   //console.log("---- SpecialDesgInput_One_ToggleVisibility(): self.isSpecialDesgInputVisible_one (before) = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_one));

                                                                   self.isSpecialDesgInputVisible_one(_visible);
                                                                   shl.enteredAndSelectedPageValues.isSpecialDesgInputVisible_one = ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_one);

                                                                   //console.log("---- SpecialDesgInput_One_ToggleVisibility(): self.isSpecialDesgInputVisible_one (after) = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_one));
                                                                   return;
                                                               };

                  self.SpecialDesgInput_Two_ToggleVisibility = function(_visible) 
                                                               {
                                                                   //console.log("---- SpecialDesgInput_Two_ToggleVisibility(): self.isSpecialDesgInputVisible_two (before) = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_two));

                                                                   self.isSpecialDesgInputVisible_two(_visible);
                                                                   shl.enteredAndSelectedPageValues.isSpecialDesgInputVisible_two = ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_two);

                                                                   //console.log("---- SpecialDesgInput_Two_ToggleVisibility(): self.isSpecialDesgInputVisible_two (after) = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_two));
                                                                   return;
                                                               };

                  self.SpecialDesgInput_Three_ToggleVisibility = function(_visible) 
                                                                 {
                                                                     //console.log("---- SpecialDesgInput_Three_ToggleVisibility(): self.isSpecialDesgInputVisible_three (before) = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_three));
                                               
                                                                     self.isSpecialDesgInputVisible_three(_visible);
                                                                     shl.enteredAndSelectedPageValues.isSpecialDesgInputVisible_three = ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_three);
                                               
                                                                     //console.log("---- SpecialDesgInput_Three_ToggleVisibility(): self.isSpecialDesgInputVisible_three (after) = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_three));
                                                                     return;
                                                                 };

                  self.receivedEventMessages = ko.observableArray([]);
                  self.buttonNextPageLabel = ko.observable("Go to next page");
                  self.nextPageUrl = ko.observable();

                  self.validateDonationInfoPage = function()
                                                  {
                                                          //console.log("---- validateDonationInfoPage()");

                                                          var pageErrorFound = false;

                                                          //--- Donation to the 1st Designation - validation

                                                          if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donation_amount_to_desg_one)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): donation_amount_to_desg_one is Empty");
                                                              $("#amount_to_donate_1_Div").addClass("has-error");
                                                              $("#amount_to_donate_1_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#amount_to_donate_1_Div").removeClass("has-error");
                                                              $("#amount_to_donate_1_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }
                                                          
                                                          if (ko.utils.unwrapObservable(self.selectedDesignation_one) == 'OTHER')
                                                          {
                                                              //console.log("--- validateDonationInfoPage(): self.selectedDesignation_one) == 'OTHER'");
                                                              if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.other_1st_desg_description) ))
                                                              {
                                                                  console.log("--- validateDonationInfoPage(): other_1st_desg_description is Empty");
                                                                  $("#other_1st_desg_description_Div").addClass("has-error");
                                                                  $("#other_1st_desg_description_ErrorMessage").removeClass("hidden").addClass("visible");
                                                                  pageErrorFound = true;
                                                              }
                                                              else
                                                              {
                                                                  //console.log("--- validateDonationInfoPage(): other_1st_desg_description is NOT Empty");
                                                                  $("#other_1st_desg_description_Div").removeClass("has-error");
                                                                  $("#other_1st_desg_description_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                  if (!pageErrorFound) pageErrorFound = false;
                                                              }
                                                          }

                                                          //--- Donation to the 2nd Designation - validation

                                                          if (self.isOtherDesgDivVisible_two() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donation_amount_to_desg_two)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): donation_amount_to_desg_two is Empty");
                                                              $("#amount_to_donate_2_Div").addClass("has-error");
                                                              $("#amount_to_donate_2_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#amount_to_donate_2_Div").removeClass("has-error");
                                                              $("#amount_to_donate_2_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }
                                                          
                                                          if (self.isOtherDesgDivVisible_two() && ko.utils.unwrapObservable(self.selectedDesignation_two) == 'OTHER')
                                                          {
                                                              if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.other_2nd_desg_description) ))
                                                              {
                                                                  console.log("--- validateDonationInfoPage(): other_2nd_desg_description is Empty");
                                                                  $("#other_2nd_desg_description_Div").addClass("has-error");
                                                                  $("#other_2nd_desg_description_ErrorMessage").removeClass("hidden").addClass("visible");
                                                                  pageErrorFound = true;
                                                              }
                                                              else
                                                              {
                                                                  $("#other_2nd_desg_description_Div").removeClass("has-error");
                                                                  $("#other_2nd_desg_description_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                  if (!pageErrorFound) pageErrorFound = false;
                                                              }
                                                          }

                                                          //--- Donation to the 3rd Designation - validation

                                                          if (self.isOtherDesgDivVisible_three() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donation_amount_to_desg_three)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): donation_amount_to_desg_three is Empty");
                                                              $("#amount_to_donate_3_Div").addClass("has-error");
                                                              $("#amount_to_donate_3_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#amount_to_donate_3_Div").removeClass("has-error");
                                                              $("#amount_to_donate_3_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          if (self.isOtherDesgDivVisible_three() && ko.utils.unwrapObservable(self.selectedDesignation_three) == 'OTHER')
                                                          {
                                                              if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.other_3rd_desg_description) ))
                                                              {
                                                                  console.log("--- validateDonationInfoPage(): other_3rd_desg_description is Empty");
                                                                  $("#other_3rd_desg_description_Div").addClass("has-error");
                                                                  $("#other_3rd_desg_description_ErrorMessage").removeClass("hidden").addClass("visible");
                                                                  pageErrorFound = true;
                                                              }
                                                              else
                                                              {
                                                                  $("#other_3rd_desg_description_Div").removeClass("has-error");
                                                                  $("#other_3rd_desg_description_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                  if (!pageErrorFound) pageErrorFound = false;
                                                              }
                                                          }
                                                          
                                                          var totalDonationAmount_inCents = (parseFloat(((shl.enteredAndSelectedPageValues.donation_amount_to_desg_one == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one)) + ((shl.enteredAndSelectedPageValues.donation_amount_to_desg_two == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two)) + ((shl.enteredAndSelectedPageValues.donation_amount_to_desg_three == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three))) * 100).toString();
                                                          shl.enteredAndSelectedPageValues.totalDonationAmount_inCents = totalDonationAmount_inCents

                                                          //--- selectedReasonToDonate == 'RSN_MAIL'
                                                          
                                                          //if (ko.utils.unwrapObservable(self.selectedReasonToDonate) == 'RSN_MAIL')
                                                          //{
                                                          //    if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.reasonToDonateEnvelopCode) ))
                                                          //    {
                                                          //        console.log("--- validateDonationInfoPage(): reasonToDonateEnvelopCode is Empty");
                                                          //        $("#reasonToDonateEnvelopCode_Div").addClass("has-error");
                                                          //        $("#reasonToDonateEnvelopCode_ErrorMessage").removeClass("hidden").addClass("visible");
                                                          //        pageErrorFound = true;
                                                          //    }
                                                          //    else
                                                          //    {
                                                          //        $("#reasonToDonateEnvelopCode_Div").removeClass("has-error");
                                                          //        $("#reasonToDonateEnvelopCode_ErrorMessage").removeClass("visible").addClass("hidden");
                                                          //        if (!pageErrorFound) pageErrorFound = false;
                                                          //    }
                                                          //}
                                                          
                                                          //--- First and Last names of a Person to be notified - validation
                                                          if (self.mailLetterOnDonorBehalf() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.mailBehalf_PersonToNotify)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): mailBehalf_PersonToNotify is Empty");
                                                              $("#mailBehalf_PersonToNotifyEntered_Div").addClass("has-error");
                                                              $("#mailBehalf_PersonToNotifyEntered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#mailBehalf_PersonToNotifyEntered_Div").removeClass("has-error");
                                                              $("#mailBehalf_PersonToNotifyEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          if (self.mailLetterOnDonorBehalf() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.mailBehalf_CountrySelected)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): mailBehalf_CountrySelected is Empty");
                                                              $("#selector_mailBehalf_Country_Div").addClass("has-error");
                                                              $("#selector_mailBehalf_Country_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#selector_mailBehalf_Country_Div").removeClass("has-error");
                                                              $("#selector_mailBehalf_Country_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          if (self.mailLetterOnDonorBehalf() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.mailBehalf_AddressLine_1)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): mailBehalf_AddressLine_1 is Empty");
                                                              $("#mailBehalf_AddressLine_1_Entered_Div").addClass("has-error");
                                                              $("#mailBehalf_AddressLine_1_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#mailBehalf_AddressLine_1_Entered_Div").removeClass("has-error");
                                                              $("#mailBehalf_AddressLine_1_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          if (self.mailLetterOnDonorBehalf() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.mailBehalf_City)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): mailBehalf_City is Empty");
                                                              $("#mailBehalf_City_Entered_Div").addClass("has-error");
                                                              $("#mailBehalf_City_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#mailBehalf_City_Entered_Div").removeClass("has-error");
                                                              $("#mailBehalf_City_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          //--- Tribute-related fields - validation
                                                          if ((self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR" || self.radioSelectedOptionValue.peek() === "in_memory_honor_MEMORY") && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeFirstName)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): tributeFirstName is Empty");
                                                              $("#tributeFirstNameEntered_Div").addClass("has-error");
                                                              $("#tributeFirstNameEntered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#tributeFirstNameEntered_Div").removeClass("has-error");
                                                              $("#tributeFirstNameEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          if ((self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR" || self.radioSelectedOptionValue.peek() === "in_memory_honor_MEMORY") && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeLastName)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): tributeLastName is Empty");
                                                              $("#tributeLastNameEntered_Div").addClass("has-error");
                                                              $("#tributeLastNameEntered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#tributeLastNameEntered_Div").removeClass("has-error");
                                                              $("#tributeLastNameEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          if ((self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR" || self.radioSelectedOptionValue.peek() === "in_memory_honor_MEMORY") && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeRelationToDonor)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): tributeRelationToDonor is Empty");
                                                              $("#tributeRelationToDonorEntered_Div").addClass("has-error");
                                                              $("#tributeRelationToDonorEntered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#tributeRelationToDonorEntered_Div").removeClass("has-error");
                                                              $("#tributeRelationToDonorEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }

                                                          //--- First and Last names of donor spouse (in case of giving soft credit)
                                                          if (self.makeSoftCreditToSomeone() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.softCredit_PersonFirstName)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): softCredit_PersonFirstName is Empty");
                                                              $("#softCredit_PersonFirstNameEntered_Div").addClass("has-error");
                                                              $("#softCredit_PersonFirstNameEntered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#softCredit_PersonFirstNameEntered_Div").removeClass("has-error");
                                                              $("#softCredit_PersonFirstNameEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }
                                                          
                                                          if (self.makeSoftCreditToSomeone() && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.softCredit_PersonLastName)))
                                                          {
                                                              console.log("--- validateDonationInfoPage(): softCredit_PersonLastName is Empty");
                                                              $("#softCredit_PersonLastNameEntered_Div").addClass("has-error");
                                                              $("#softCredit_PersonLastNameEntered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                              pageErrorFound = true;
                                                          }
                                                          else
                                                          {
                                                              $("#softCredit_PersonLastNameEntered_Div").removeClass("has-error");
                                                              $("#softCredit_PersonLastNameEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                              if (!pageErrorFound) pageErrorFound = false;
                                                          }
                                                          
                                                          console.log("--- validateDonationInfoPage(): pageErrorFound = " + pageErrorFound);

                                                          if (shl.enteredAndSelectedPageValues.TestDebugMode)
                                                          {
                                                              return true;
                                                          }
                                                          else
                                                          {
                                                              if (pageErrorFound)
                                                              {
                                                                  return false;
                                                              }
                                                              else
                                                              {
                                                                  return true;
                                                              }
                                                          }
                                                      };

                  self.gotoNextPage = function()
                                      {
                                          //console.log("---- gotoNextPage()");

                                          if (self.validateDonationInfoPage())
                                          {
                                              ////$('#main').click();
                                              //self.nextPageUrl("#donor_info");
                                          
                                              //console.log("---- Module:donation_info,gotoNextPage(): router.navigationModel()[0].moduleId = " + router.navigationModel()[0].moduleId + " router.navigationModel()[0].isActive() = " + router.navigationModel()[0].isActive() + " router.navigationModel()[0].hash() = " + router.navigationModel()[0].hash);
                                              //console.log("---- Module:donation_info,gotoNextPage(): router.navigationModel()[1].moduleId = " + router.navigationModel()[1].moduleId + " router.navigationModel()[1].isActive() = " + router.navigationModel()[1].isActive() + " router.navigationModel()[1].hash() = " + router.navigationModel()[1].hash);
                                          
                                              //router.navigate(router.navigationModel()[1].hash);

                                              router.navigate('#donor_info');
                                          }

                                          return true;
                                      };
             };

    vm.prototype.activate = function (context) // Activation code here:
                            {
                                var self = this;

                                //console.log("---- vm.prototype.activate(): Invoked...");

                                //-------------------------------------------------------------------------------------
                                shl.enteredAndSelectedPageValues.WebClientAppTerminatedDueToErrors = false;
                                //-------------------------------------------------------------------------------------
                                
                                //self.paddingBottomValue

                                if (self.listOfDesignations_one().length == 0)
                                {
                                    //console.log("---- Populating the listOfDesignations_one with FRESH data from shl.serverDataSuppliesLocal[0].listOfDesignations...");
                                    self.listOfDesignations_one(shl.serverDataSuppliesLocal[0].listOfDesignations);
                                    //console.log("---- So, now the self.listOfDesignations_one().length = " + (self.listOfDesignations_one().length).toString());
                                }

                                if (self.listOfDesignations_two().length == 0)
                                {
                                    //console.log("---- Populating the listOfDesignations_two with FRESH data from shl.serverDataSuppliesLocal[0].listOfDesignations...");
                                    self.listOfDesignations_two(shl.serverDataSuppliesLocal[0].listOfDesignations);
                                    //console.log("---- So, now the self.listOfDesignations_two().length = " + (self.listOfDesignations_two().length).toString());
                                }

                                if (self.listOfDesignations_three().length == 0)
                                {
                                    //console.log("---- Populating the listOfDesignations_three with FRESH data from shl.serverDataSuppliesLocal[0].listOfDesignations...");
                                    self.listOfDesignations_three(shl.serverDataSuppliesLocal[0].listOfDesignations);
                                    //console.log("---- So, now the self.listOfDesignations_three().length = " + (self.listOfDesignations_three().length).toString());
                                }

                                if (self.listOfReasonsToDonate().length == 0)
                                {
                                    //console.log("---- Populating the listOfReasonsToDonate with FRESH data from shl.serverDataSuppliesLocal[1].listOfReasonsToDonate...");
                                    self.listOfReasonsToDonate(shl.serverDataSuppliesLocal[1].listOfReasonsToDonate);
                                    //console.log("---- So, now the self.listOfReasonsToDonate().length = " + (self.listOfReasonsToDonate().length).toString());
                                }

                                if (self.listOfODSParameters().length == 0)
                                {
                                    //console.log("---- Populating the listOfODSParameters with FRESH data from shl.serverDataSuppliesLocal[4].listOfODSParameters...");
                                    self.listOfODSParameters(shl.serverDataSuppliesLocal[4].listOfODSParameters);
                                    //console.log("---- So, now the self.listOfODSParameters().length = " + (self.listOfODSParameters().length).toString());
                                }

                                //-------------------------------------------------------------------------------------

                                self.foundInitialDesignationObjectsList = ko.observableArray([]);

                                //Universal lists used for converting any CODES (all SELECT controls deal with CODES only)
                                //into Description form. For Example: CA->Canada, VA->Virginia etc
                                self.universalCountryListOfFilteredRecords = ko.observableArray([]);
                                self.universalRegionListOfFilteredRecords = ko.observableArray([]);
                                self.universalDesgListOfFilteredRecords = ko.observableArray([]);

                                //-------------------------------------------------------------------------------------

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedDesignation_one))
                                {
                                    self.foundInitialDesignationObjectsList = self.listOfDesignations_one.filterByProperty("Desg_1_Is_Default", "Y");
                                    if (self.foundInitialDesignationObjectsList().length == 0)
                                    {
                                        null;
                                        //console.log("---- There is no a Desg_1_Is_Default = 'Y' found in the self.listOfDesignations_one");
                                    }
                                    else
                                    {
                                        //console.log("---- For DESG_IS_DEFAULT_1: self.foundInitialDesignationObjectsList()[0].Desg_Code = " + self.foundInitialDesignationObjectsList()[0].Desg_Code);
                                        self.selectedDesignation_one = ko.observable(self.foundInitialDesignationObjectsList()[0].Desg_Code);
                                        shl.enteredAndSelectedPageValues.selectedDesignation_one_Desc = ko.utils.unwrapObservable(self.foundInitialDesignationObjectsList()[0].Desg_Description);
                                        shl.enteredAndSelectedPageValues.selectedDesignation_one_Campaign = ko.utils.unwrapObservable(self.foundInitialDesignationObjectsList()[0].Desg_Campaign);
                                        shl.enteredAndSelectedPageValues.defaultDesignation_one = ko.utils.unwrapObservable(self.selectedDesignation_one);
                                    }
                                }
                                else
                                {    
                                    //console.log("---- selectedDesignation_one is assigned with a value from shl.enteredAndSelectedPageValues.selectedDesignation_one (" + shl.enteredAndSelectedPageValues.selectedDesignation_one + ")");
                                    self.selectedDesignation_one = ko.observable(shl.enteredAndSelectedPageValues.selectedDesignation_one);
                                }
                                
                                if (ko.utils.unwrapObservable(self.selectedDesignation_one) == 'OTHER')
                                {
                                    self.isSpecialDesgInputVisible_one(true);
                                }
                                else
                                {
                                    self.isSpecialDesgInputVisible_one(false); 
                                }

                                // An subscription to a variable must be done AFTER all the variable's assignments.
                                // See http://stackoverflow.com/questions/19886776/knockoutjs-subscribe-not-working
                                // So, that's why it's here: 
                                self.selectedDesignation_one.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                       {
                                                                           //console.log('---- The new of selectedDesignation_one is: ' + newValue);
                                                                           //console.log('---- The old value of shl.enteredAndSelectedPageValues.selectedDesignation_one = ' + shl.enteredAndSelectedPageValues.selectedDesignation_one);
                                                                           shl.enteredAndSelectedPageValues.selectedDesignation_one = newValue;
                                                                           //console.log('---- The new value of shl.enteredAndSelectedPageValues.selectedDesignation_one = ' + shl.enteredAndSelectedPageValues.selectedDesignation_one);

                                                                           self.universalDesgListOfFilteredRecords = self.listOfDesignations_one.filterByProperty("Desg_Code", newValue);
                                                                           shl.enteredAndSelectedPageValues.selectedDesignation_one_Desc = ko.utils.unwrapObservable(self.universalDesgListOfFilteredRecords()[0].Desg_Description);
                                                                           shl.enteredAndSelectedPageValues.selectedDesignation_one_Campaign = ko.utils.unwrapObservable(self.universalDesgListOfFilteredRecords()[0].Desg_Campaign);
                                                                           
                                                                           if (newValue == 'OTHER')
                                                                           {
                                                                               self.SpecialDesgInput_One_ToggleVisibility(true);
                                                                           }
                                                                           else
                                                                           {
                                                                               self.SpecialDesgInput_One_ToggleVisibility(false);
                                                                           }
                                                                           //console.log('---- The new of selectedDesignation_one is: (after) ' + ko.utils.unwrapObservable(self.selectedDesignation_one));
                                                                       });

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.other_1st_desg_description))
                                {
                                    null;
                                }
                                else
                                {
                                    self.other_1st_desg_description(shl.enteredAndSelectedPageValues.other_1st_desg_description);
                                }
                                
                                self.other_1st_desg_description.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                          {
                                                                              //console.log('---- other_1st_desg_description.subscribe(): The new of other_1st_desg_description is: ' + newValue);
                                                                              shl.enteredAndSelectedPageValues.other_1st_desg_description = newValue;
                                                                              //console.log('---- other_1st_desg_description.subscribe(): The new value of shl.enteredAndSelectedPageValues.other_1st_desg_description = ' + shl.enteredAndSelectedPageValues.other_1st_desg_description);
                                                                          });
                                
                                self.other_1st_desg_description_enterKeyProcessing = function(data, event)
                                                                                     {
                                                                                         //console.log("---- other_1st_desg_description_enterKeyProcessing()");
                                                                                         if (event.which == 13)
                                                                                         {
                                                                                            //console.log("---- other_1st_desg_description_enterKeyProcessing(): Enter Key Pressed!");
                                                                                            event.cancelBubble = true;
                                                                                            if (event.stopPropagation) event.stopPropagation();
                                                                                            return false;
                                                                                         }
                                                                                         $(this).next().focus();
                                                                                         return true;
                                                                                     };

                                //-------------------------------------------------------------------------------------

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedDesignation_two))
                                {
                                    self.foundInitialDesignationObjectsList = self.listOfDesignations_two.filterByProperty("Desg_2_Is_Default", "Y");
                                    if (self.foundInitialDesignationObjectsList().length == 0)
                                    {
                                        null;
                                        //console.log("---- There is no a Desg_2_Is_Default = 'Y' found in the self.listOfDesignations_two");
                                    }
                                    else
                                    {
                                        //console.log("---- For DESG_IS_DEFAULT_2: self.foundInitialDesignationObjectsList()[0].Desg_Code = " + self.foundInitialDesignationObjectsList()[0].Desg_Code);
                                        self.selectedDesignation_two = ko.observable(self.foundInitialDesignationObjectsList()[0].Desg_Code);
                                        shl.enteredAndSelectedPageValues.selectedDesignation_two_Desc = ko.utils.unwrapObservable(self.foundInitialDesignationObjectsList()[0].Desg_Description);
                                        shl.enteredAndSelectedPageValues.selectedDesignation_two_Campaign = ko.utils.unwrapObservable(self.foundInitialDesignationObjectsList()[0].Desg_Campaign);
                                        shl.enteredAndSelectedPageValues.defaultDesignation_two = ko.utils.unwrapObservable(self.selectedDesignation_two);
                                    }
                                }
                                else
                                {
                                    //console.log("---- selectedDesignation_two is assigned with a value from shl.enteredAndSelectedPageValues.selectedDesignation_two (" + shl.enteredAndSelectedPageValues.selectedDesignation_two + ")");
                                    self.selectedDesignation_two = ko.observable(shl.enteredAndSelectedPageValues.selectedDesignation_two);
                                }

                                if (ko.utils.unwrapObservable(self.selectedDesignation_two) == 'OTHER')
                                {
                                    self.isSpecialDesgInputVisible_two(true);
                                }
                                else
                                {
                                    self.isSpecialDesgInputVisible_two(false); 
                                }

                                self.selectedDesignation_two.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                       {
                                                                           //console.log('---- activate(),self.selectedDesignation_two.subscribe(): The new of selectedDesignation_two is: ' + newValue);
                                                                           //console.log('---- activate(),self.selectedDesignation_two.subscribe(): The old value of shl.enteredAndSelectedPageValues.selectedDesignation_two = ' + shl.enteredAndSelectedPageValues.selectedDesignation_two);
                                                                           shl.enteredAndSelectedPageValues.selectedDesignation_two = newValue;
                                                                           //console.log('---- activate(),self.selectedDesignation_two.subscribe(): The new value of shl.enteredAndSelectedPageValues.selectedDesignation_two = ' + shl.enteredAndSelectedPageValues.selectedDesignation_two);

                                                                           self.universalDesgListOfFilteredRecords = self.listOfDesignations_two.filterByProperty("Desg_Code", newValue);
                                                                           shl.enteredAndSelectedPageValues.selectedDesignation_two_Desc = ko.utils.unwrapObservable(self.universalDesgListOfFilteredRecords()[0].Desg_Description);
                                                                           shl.enteredAndSelectedPageValues.selectedDesignation_two_Campaign = ko.utils.unwrapObservable(self.universalDesgListOfFilteredRecords()[0].Desg_Campaign);
                                                                           
                                                                           if (newValue == 'OTHER')
                                                                           {
                                                                               self.SpecialDesgInput_Two_ToggleVisibility(true);
                                                                           }
                                                                           else
                                                                           {
                                                                               self.SpecialDesgInput_Two_ToggleVisibility(false);
                                                                           }
                                                                           //console.log("---- activate(),self.selectedDesignation_two.subscribe(): (after): self.isSpecialDesgInputVisible_two = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_two))
                                                                           //console.log('---- The new of selectedDesignation_two is: (after) ' + ko.utils.unwrapObservable(self.selectedDesignation_two));
                                                                       });

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.other_2nd_desg_description))
                                {
                                    null;
                                }
                                else
                                {
                                    self.other_2nd_desg_description(shl.enteredAndSelectedPageValues.other_2nd_desg_description);
                                }
                                
                                self.other_2nd_desg_description.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                          {
                                                                              //console.log('---- other_2nd_desg_description.subscribe(): The new of other_2nd_desg_description is: ' + newValue);
                                                                              shl.enteredAndSelectedPageValues.other_2nd_desg_description = newValue;
                                                                              //console.log('---- other_2nd_desg_description.subscribe(): The new value of shl.enteredAndSelectedPageValues.other_2nd_desg_description = ' + shl.enteredAndSelectedPageValues.other_2nd_desg_description);
                                                                          });
                                
                                self.other_2nd_desg_description_enterKeyProcessing = function(data, event)
                                                                                     {
                                                                                         //console.log("---- other_2nd_desg_description_enterKeyProcessing()");
                                                                                         if (event.which == 13)
                                                                                         {
                                                                                            //console.log("---- other_2nd_desg_description_enterKeyProcessing(): Enter Key Pressed!");
                                                                                            event.cancelBubble = true;
                                                                                            if (event.stopPropagation) event.stopPropagation();
                                                                                            return false;
                                                                                         }
                                                                                         $(this).next().focus();
                                                                                         return true;
                                                                                     };

                                //-------------------------------------------------------------------------------------

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedDesignation_three))
                                {
                                    self.foundInitialDesignationObjectsList = self.listOfDesignations_three.filterByProperty("Desg_3_Is_Default", "Y");
                                    if (self.foundInitialDesignationObjectsList().length == 0)
                                    {
                                        null;
                                        //console.log("---- There is no a Desg_3_Is_Default = 'Y' found in the self.listOfDesignations_three");
                                    }
                                    else
                                    {
                                        //console.log("---- For DESG_IS_DEFAULT_3: self.foundInitialDesignationObjectsList()[0].Desg_Code = " + self.foundInitialDesignationObjectsList()[0].Desg_Code);
                                        self.selectedDesignation_three = ko.observable(self.foundInitialDesignationObjectsList()[0].Desg_Code);
                                        shl.enteredAndSelectedPageValues.selectedDesignation_three_Desc = ko.utils.unwrapObservable(self.foundInitialDesignationObjectsList()[0].Desg_Description);
                                        shl.enteredAndSelectedPageValues.selectedDesignation_three_Campaign = ko.utils.unwrapObservable(self.foundInitialDesignationObjectsList()[0].Desg_Campaign);
                                        shl.enteredAndSelectedPageValues.defaultDesignation_three = ko.utils.unwrapObservable(self.selectedDesignation_three);
                                    }
                                }
                                else
                                {
                                    //console.log("---- selectedDesignation_three is assigned with a value from shl.enteredAndSelectedPageValues.selectedDesignation_three (" + shl.enteredAndSelectedPageValues.selectedDesignation_three + ")");
                                    self.selectedDesignation_three = ko.observable(shl.enteredAndSelectedPageValues.selectedDesignation_three);
                                }

                                if (ko.utils.unwrapObservable(self.selectedDesignation_three) == 'OTHER')
                                {
                                    self.isSpecialDesgInputVisible_three(true);
                                }
                                else
                                {
                                    self.isSpecialDesgInputVisible_three(false); 
                                }

                                self.selectedDesignation_three.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                         {
                                                                             //console.log('---- activate(),self.selectedDesignation_three.subscribe(): The new of selectedDesignation_three is: ' + newValue);
                                                                             //console.log('---- activate(),self.selectedDesignation_three.subscribe(): The old value of shl.enteredAndSelectedPageValues.selectedDesignation_three = ' + shl.enteredAndSelectedPageValues.selectedDesignation_three);
                                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three = newValue;
                                                                             //console.log('---- activate(),self.selectedDesignation_three.subscribe(): The new value of shl.enteredAndSelectedPageValues.selectedDesignation_three = ' + shl.enteredAndSelectedPageValues.selectedDesignation_three);

                                                                             self.universalDesgListOfFilteredRecords = self.listOfDesignations_three.filterByProperty("Desg_Code", newValue);
                                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three_Desc = ko.utils.unwrapObservable(self.universalDesgListOfFilteredRecords()[0].Desg_Description);
                                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three_Campaign = ko.utils.unwrapObservable(self.universalDesgListOfFilteredRecords()[0].Desg_Campaign);
                                                                             
                                                                             if (newValue == 'OTHER')
                                                                             {
                                                                                 self.SpecialDesgInput_Three_ToggleVisibility(true);
                                                                             }
                                                                             else
                                                                             {
                                                                                 self.SpecialDesgInput_Three_ToggleVisibility(false);
                                                                             }
                                                                             //console.log("---- activate(),self.selectedDesignation_three.subscribe(): (after): self.isSpecialDesgInputVisible_three = " + ko.utils.unwrapObservable(self.isSpecialDesgInputVisible_three))
                                                                             //console.log('---- The new of selectedDesignation_three is: (after) ' + ko.utils.unwrapObservable(self.selectedDesignation_three));
                                                                         });

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.other_3rd_desg_description))
                                {
                                    null;
                                }
                                else
                                {
                                    self.other_3rd_desg_description(shl.enteredAndSelectedPageValues.other_3rd_desg_description);
                                }
                                
                                self.other_3rd_desg_description.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                          {
                                                                              //console.log('---- other_3rd_desg_description.subscribe(): The new of other_3rd_desg_description is: ' + newValue);
                                                                              shl.enteredAndSelectedPageValues.other_3rd_desg_description = newValue;
                                                                              //console.log('---- other_3rd_desg_description.subscribe(): The new value of shl.enteredAndSelectedPageValues.other_3rd_desg_description = ' + shl.enteredAndSelectedPageValues.other_3rd_desg_description);
                                                                          });
                                
                                self.other_3rd_desg_description_enterKeyProcessing = function(data, event)
                                                                                     {
                                                                                         //console.log("---- other_3rd_desg_description_enterKeyProcessing()");
                                                                                         if (event.which == 13)
                                                                                         {
                                                                                            //console.log("---- other_3rd_desg_description_enterKeyProcessing(): Enter Key Pressed!");
                                                                                            event.cancelBubble = true;
                                                                                            if (event.stopPropagation) event.stopPropagation();
                                                                                            return false;
                                                                                         }
                                                                                         $(this).next().focus();
                                                                                         return true;
                                                                                     };

                                //-------------------------------------------------------------------------------------
                                // --- Setting up donation amount fields:
                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one) &&
                                    parseInt(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one) != 0)
                                {
                                    //console.log("---- activate(): shl.enteredAndSelectedPageValues.donation_amount_to_desg_one is not empty: = " + shl.enteredAndSelectedPageValues.donation_amount_to_desg_one);
                                    self.donation_amount_to_desg_one = ko.observable(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one);
                                }
                                else
                                {
                                    self.donation_amount_to_desg_one = ko.observable("");
                                }

                                // An subscription to a variable must be done AFTER all the variable's assignments.
                                // See http://stackoverflow.com/questions/19886776/knockoutjs-subscribe-not-working
                                // So, that's why it's here: 
                                self.donation_amount_to_desg_one.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                           {
                                                                               //console.log('---- activate(),self.donation_amount_to_desg_one.subscribe(): The new of donation_amount_to_desg_one is: ' + newValue);
                                                                               //console.log('---- activate(),self.donation_amount_to_desg_one.subscribe(): The old value of shl.enteredAndSelectedPageValues.donation_amount_to_desg_one = ' + shl.enteredAndSelectedPageValues.donation_amount_to_desg_one);
                                                                               shl.enteredAndSelectedPageValues.donation_amount_to_desg_one = newValue;
                                                                               //console.log('---- activate(),self.donation_amount_to_desg_one.subscribe(): The new value of shl.enteredAndSelectedPageValues.donation_amount_to_desg_one = ' + shl.enteredAndSelectedPageValues.donation_amount_to_desg_one);

                                                                               if (!jQuery.isEmptyObject(newValue) && ! isNaN(parseFloat(ko.utils.unwrapObservable(self.donation_amount_to_desg_one))))
                                                                               {
                                                                                   $("#amount_to_donate_1_Div").removeClass("has-error");
                                                                                   $("#amount_to_donate_1_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                               }
                                                                           });

                                //-------------------------------------------------------------------------------------
                                
                                //self.isOtherDesgDivVisible_two.subscribe(function(newValue)
                                //                                         {
                                //                                             console.log('---- activate(),self.isOtherDesgDivVisible_two.subscribe()" newValue = ' + newValue)
                                //                                         });
                                                                             
                                self.amount_to_donate_1_enterKeyProcessing = function(data, event)
                                                                             {
                                                                                 //console.log("---- amount_to_donate_1_enterKeyProcessing()");
                                                                                 if (event.which == 13)
                                                                                 {
                                                                                    //console.log("---- amount_to_donate_1_enterKeyProcessing(): Enter Key Pressed!");
                                                                                    event.cancelBubble = true;
                                                                                    if (event.stopPropagation) event.stopPropagation();
                                                                                    return false;
                                                                                 }
                                                                                 $(this).next().focus();
                                                                                 return true;
                                                                             };

                                self.amount_to_donate_2_enterKeyProcessing = function(data, event)
                                                                             {
                                                                                 //console.log("---- amount_to_donate_2_enterKeyProcessing()");
                                                                                 if (event.which == 13)
                                                                                 {
                                                                                    //console.log("---- amount_to_donate_2_enterKeyProcessing(): Enter Key Pressed!");
                                                                                    event.cancelBubble = true;
                                                                                    if (event.stopPropagation) event.stopPropagation();
                                                                                    return false;
                                                                                 }
                                                                                 $(this).next().focus();
                                                                                 return true;
                                                                             };

                                self.amount_to_donate_3_enterKeyProcessing = function(data, event)
                                                                             {
                                                                                 //console.log("---- amount_to_donate_3_enterKeyProcessing()");
                                                                                 if (event.which == 13)
                                                                                 {
                                                                                    //console.log("---- amount_to_donate_3_enterKeyProcessing(): Enter Key Pressed!");
                                                                                    event.cancelBubble = true;
                                                                                    if (event.stopPropagation) event.stopPropagation();
                                                                                    return false;
                                                                                 }
                                                                                 $(this).next().focus();
                                                                                 return true;
                                                                             };

                                //-------------------------------------------------------------------------------------
                                
                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two) &&
                                    parseInt(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two) != 0)
                                {
                                    //console.log("---- activate(): shl.enteredAndSelectedPageValues.donation_amount_to_desg_two is not empty: = " + shl.enteredAndSelectedPageValues.donation_amount_to_desg_two);
                                    self.donation_amount_to_desg_two = ko.observable(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two);
                                    //console.log("---- activate(): making isOtherDesgDivVisible_two TRUE");
                                    self.isOtherDesgDivVisible_two = ko.observable(true);
                                    self.isDonateToOtherDesgButtonVisible(shl.enteredAndSelectedPageValues.isDonateToOtherDesgButtonVisible);
                                }
                                else
                                {
                                    //console.log("---- activate(): ELSE CASE");
                                    self.donation_amount_to_desg_two = ko.observable("");
                                }

                                self.donation_amount_to_desg_two.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                           {
                                                                               //console.log('---- activate(),self.donation_amount_to_desg_two.subscribe(): The new of donation_amount_to_desg_two is: ' + newValue);
                                                                               //console.log('---- activate(),self.donation_amount_to_desg_two.subscribe(): The old value of shl.enteredAndSelectedPageValues.donation_amount_to_desg_two = ' + shl.enteredAndSelectedPageValues.donation_amount_to_desg_two);
                                                                               shl.enteredAndSelectedPageValues.donation_amount_to_desg_two = newValue;
                                                                               //console.log('---- activate(),self.donation_amount_to_desg_two.subscribe(): The new value of shl.enteredAndSelectedPageValues.donation_amount_to_desg_two = ' + shl.enteredAndSelectedPageValues.donation_amount_to_desg_two);

                                                                               if (!jQuery.isEmptyObject(newValue) && ! isNaN(parseFloat(ko.utils.unwrapObservable(self.donation_amount_to_desg_two))))
                                                                               {
                                                                                   $("#amount_to_donate_2_Div").removeClass("has-error");
                                                                                   $("#amount_to_donate_2_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                               }
                                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three) &&
                                    parseInt(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three) != 0)
                                {
                                    //console.log("---- activate(): shl.enteredAndSelectedPageValues.donation_amount_to_desg_three is not empty: = " + shl.enteredAndSelectedPageValues.donation_amount_to_desg_three);
                                    self.donation_amount_to_desg_three = ko.observable(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three);
                                    self.isOtherDesgDivVisible_three = ko.observable(true);
                                    self.isDonateToOtherDesgButtonVisible(shl.enteredAndSelectedPageValues.isDonateToOtherDesgButtonVisible);
                                }
                                else
                                {
                                    self.donation_amount_to_desg_three = ko.observable("");
                                }

                                self.donation_amount_to_desg_three.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                             {
                                                                                 //console.log('---- activate(),self.donation_amount_to_desg_three.subscribe(): The new of donation_amount_to_desg_three is: ' + newValue);
                                                                                 //console.log('---- activate(),self.donation_amount_to_desg_three.subscribe(): The old value of shl.enteredAndSelectedPageValues.donation_amount_to_desg_three = ' + shl.enteredAndSelectedPageValues.donation_amount_to_desg_three);
                                                                                 shl.enteredAndSelectedPageValues.donation_amount_to_desg_three = newValue;
                                                                                 //console.log('---- activate(),self.donation_amount_to_desg_three.subscribe(): The new value of shl.enteredAndSelectedPageValues.donation_amount_to_desg_three = ' + shl.enteredAndSelectedPageValues.donation_amount_to_desg_three);

                                                                                 if (!jQuery.isEmptyObject(newValue) && ! isNaN(parseFloat(ko.utils.unwrapObservable(self.donation_amount_to_desg_three))))
                                                                                 {
                                                                                     $("#amount_to_donate_3_Div").removeClass("has-error");
                                                                                     $("#amount_to_donate_3_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                 }
                                                                             });

                                //-------------------------------------------------------------------------------------

                                self.grandTotal = ko.computed(function() 
                                                              {
                                                                  //console.log("---- donation_info(),self.grandTotal.computed(): self.donation_amount_to_desg_one = " + ko.utils.unwrapObservable(self.donation_amount_to_desg_one));
                                                                  var total = 0.0;
                                                                  
                                                                  total = ((self.donation_amount_to_desg_one() == null || isNaN(parseFloat(self.donation_amount_to_desg_one()))) ? 0.0 : parseFloat(self.donation_amount_to_desg_one())) + ((self.donation_amount_to_desg_two() == null || isNaN(parseFloat(self.donation_amount_to_desg_two()))) ? 0.0 : parseFloat(self.donation_amount_to_desg_two())) + ((self.donation_amount_to_desg_three() == null || isNaN(parseFloat(self.donation_amount_to_desg_three()))) ? 0.0 : parseFloat(self.donation_amount_to_desg_three()));

                                                                  var totalDonationAmount_inCents = (parseFloat(((shl.enteredAndSelectedPageValues.donation_amount_to_desg_one == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one)) + ((shl.enteredAndSelectedPageValues.donation_amount_to_desg_two == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two)) + ((shl.enteredAndSelectedPageValues.donation_amount_to_desg_three == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three))) * 100).toString();
                                                                  shl.enteredAndSelectedPageValues.totalDonationAmount_inCents = totalDonationAmount_inCents

                                                                  //console.log("---- donation_info(),self.grandTotal.computed(): total = " + total.toString());
                                                                  //console.log("---- donation_info(),self.grandTotal.computed(): shl.enteredAndSelectedPageValues.donation_amount_to_desg_one (before) = " + shl.enteredAndSelectedPageValues.donation_amount_to_desg_one);
                                                                  return total;
                                                              });

                                //--- Reason to donate ----------------------------------------------------------------

                                self.foundInitialReasonToDonateObjectsList = ko.observableArray([]);

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedReasonToDonate))
                                {
                                    self.foundInitialReasonToDonateObjectsList = self.listOfReasonsToDonate.filterByProperty("reason_is_default", "Y");

                                    if (self.foundInitialReasonToDonateObjectsList().length == 0)
                                    {
                                        //console.log("---- donation_info(),activate(): There is no a reason_is_default = 'Y' found in the self.listOfReasonsToDonate");
                                        self.selectedReasonToDonate(self.listOfReasonsToDonate()[0].REASON_CODE)
                                    }
                                    else
                                    {
                                        //console.log("---- donation_info(),activate(): self.foundInitialReasonToDonateObjectsList()[0].REASON_CODE = " + ko.utils.unwrapObservable(self.foundInitialReasonToDonateObjectsList()[0].REASON_CODE));
                                        self.selectedReasonToDonate(self.foundInitialReasonToDonateObjectsList()[0].REASON_CODE);
                                    }
                                    shl.enteredAndSelectedPageValues.selectedReasonToDonate = ko.utils.unwrapObservable(self.selectedReasonToDonate);
                                    //console.log("---- donation_info(),activate(): shl.enteredAndSelectedPageValues.selectedReasonToDonate = " + shl.enteredAndSelectedPageValues.selectedReasonToDonate);
                                }
                                else
                                {
                                    //console.log("---- donation_info(),activate(): selectedReasonToDonate is assigned with a value from shl.enteredAndSelectedPageValues.selectedReasonToDonate (" + shl.enteredAndSelectedPageValues.selectedReasonToDonate + ")");
                                    self.selectedReasonToDonate(shl.enteredAndSelectedPageValues.selectedReasonToDonate);
                                }
                                
                                if (shl.enteredAndSelectedPageValues.selectedReasonToDonate == 'RSN_MAIL')
                                {
                                    self.isReasonToDonateEqualMailing(true)
                                }
                                else
                                {
                                    self.isReasonToDonateEqualMailing(false)
                                }
                                //console.log("---- donation_info(),activate(): self.isReasonToDonateEqualMailing = " + ko.utils.unwrapObservable(self.isReasonToDonateEqualMailing));

                                // An subscription to a variable must be done AFTER all the variable's assignments.
                                // See http://stackoverflow.com/questions/19886776/knockoutjs-subscribe-not-working
                                // So, that's why it's here: 
                                self.selectedReasonToDonate.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                      {
                                                                          //console.log('---- donation_info(),selectedReasonToDonate.subscribe(): The new of selectedReasonToDonate is: ' + newValue);
                                                                          //console.log('---- donation_info(),selectedReasonToDonate.subscribe(): The old value of shl.enteredAndSelectedPageValues.selectedReasonToDonate = ' + shl.enteredAndSelectedPageValues.selectedReasonToDonate);
                                                                          shl.enteredAndSelectedPageValues.selectedReasonToDonate = newValue;
                                                                          //console.log('---- donation_info(),selectedReasonToDonate.subscribe(): The new value of shl.enteredAndSelectedPageValues.selectedReasonToDonate = ' + shl.enteredAndSelectedPageValues.selectedReasonToDonate);
                                                                          
                                                                          if (newValue == 'RSN_MAIL')
                                                                          {
                                                                              self.isReasonToDonateEqualMailing(true);
                                                                              
                                                                              if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode))
                                                                              {
                                                                                  self.reasonToDonateEnvelopCode(shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode);
                                                                              }
                                                                          }
                                                                          else
                                                                          {
                                                                              self.isReasonToDonateEqualMailing(false);
                                                                              self.reasonToDonateEnvelopCode("");
                                                                          }
                                                                      });

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode))
                                {
                                    null;
                                }
                                else
                                {
                                    self.reasonToDonateEnvelopCode(shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode);
                                }
                                 
                                self.reasonToDonateEnvelopCode.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                         {
                                                                             //console.log('---- The new of reasonToDonateEnvelopCode is: ' + newValue);
                                                                             //console.log('---- The old value of shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode = ' + shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode);
                                                                             shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode = newValue;
                                                                             //console.log('---- The new value of shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode = ' + shl.enteredAndSelectedPageValues.reasonToDonateEnvelopCode);
                                                                         });
                                   
                                self.reasonToDonateEnvelopCode_enterKeyProcessing = function(data, event)
                                                                                    {
                                                                                        //console.log("---- reasonToDonateEnvelopCode_enterKeyProcessing()");
                                                                                        if (event.which == 13)
                                                                                        {
                                                                                           //console.log("---- reasonToDonateEnvelopCode_enterKeyProcessing(): Enter Key Pressed!");
                                                                                           event.cancelBubble = true;
                                                                                           if (event.stopPropagation) event.stopPropagation();
                                                                                           return false;
                                                                                        }
                                                                                        $(this).next().focus();
                                                                                        return true;
                                                                                    };

                                //-------------------------------------------------------------------------------------

                                self.isThisPledgePayment = ko.observable(shl.enteredAndSelectedPageValues.isThisPledgePayment);
                                self.isThisPledgePayment.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.isThisPledgePayment.subscribe(): shl.enteredAndSelectedPageValues.isThisPledgePayment (before) = " + shl.enteredAndSelectedPageValues.isThisPledgePayment);
                                                                       shl.enteredAndSelectedPageValues.isThisPledgePayment = !shl.enteredAndSelectedPageValues.isThisPledgePayment;
                                                                       //console.log("---- Activate, self.isThisPledgePayment.subscribe(): shl.enteredAndSelectedPageValues.isThisPledgePayment (after) = " + shl.enteredAndSelectedPageValues.isThisPledgePayment);
                                                                   });

                                self.isThisGiftAnonymous = ko.observable(shl.enteredAndSelectedPageValues.isThisGiftAnonymous);
                                self.isThisGiftAnonymous.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.isThisGiftAnonymous.subscribe(): shl.enteredAndSelectedPageValues.isThisGiftAnonymous (before) = " + shl.enteredAndSelectedPageValues.isThisGiftAnonymous);
                                                                       shl.enteredAndSelectedPageValues.isThisGiftAnonymous = !shl.enteredAndSelectedPageValues.isThisGiftAnonymous;
                                                                       //console.log("---- Activate, self.isThisGiftAnonymous.subscribe(): shl.enteredAndSelectedPageValues.isThisGiftAnonymous (after) = " + shl.enteredAndSelectedPageValues.isThisGiftAnonymous);
                                                                   });

                                //-------------------------------------------------------------------------------------

                                self.giftComments = ko.observable(shl.enteredAndSelectedPageValues.giftComments);
                                self.giftComments.subscribe(function(newValue)
                                                            {
                                                                //console.log("---- activate().giftComments.subscribe(): setGiftCommentsValue(): shl.enteredAndSelectedPageValues.giftComments (before) = " + shl.enteredAndSelectedPageValues.giftComments);
                                                                shl.enteredAndSelectedPageValues.giftComments = newValue;
                                                                //console.log("---- activate().giftComments.subscribe(): shl.enteredAndSelectedPageValues.giftComments (after) = " + shl.enteredAndSelectedPageValues.giftComments);
                                                            });
                                 
                                //--- Choose if a Gift made in Honor/Memory of ----------------------------------------
                                
                                self.radioSelectedOptionValue = ko.observable();
                                self.radioSelectedOptionValue.extend({notify: 'always'});

                                //console.log("---- activate(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue);

                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue == "in_memory_honor_NONE")
                                {
                                    //console.log("---- activate(). radioSelectedOptionValue.computed(): section READ: in_memory_honor_NONE SET");
                                    self.radioSelectedOptionValue = ko.observable("in_memory_honor_NONE");
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue == "in_memory_honor_HONOR")
                                {
                                    //console.log("---- activate(): in_memory_honor_HONOR SET");
                                    self.radioSelectedOptionValue = ko.observable("in_memory_honor_HONOR");
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue == "in_memory_honor_MEMORY")
                                {
                                    //console.log("---- activate(): in_memory_honor_MEMORY SET");
                                    self.radioSelectedOptionValue = ko.observable("in_memory_honor_MEMORY");
                                }
                                
                                self.radioSelectedOptionValue.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().radioSelectedOptionValue.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue (before) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue);
                                                                            //console.log("---- activate().radioSelectedOptionValue.subscribe(): radioSelectedOptionValue.peek() = " + self.radioSelectedOptionValue.peek());
                                                                            shl.enteredAndSelectedPageValues.radioSelectedOptionValue = self.radioSelectedOptionValue.peek();
                                                                            //console.log("---- activate().radioSelectedOptionValue.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue (after) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue);

                                                                            if (self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR" ||
                                                                                self.radioSelectedOptionValue.peek() === "in_memory_honor_MEMORY")
                                                                            {
                                                                                self.showTributeInfo(true);
//                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
//                                                                                         {
//                                                                                             self.showTributeInfo(true);
//                                                                                         }, 300);
                                                                                shl.enteredAndSelectedPageValues.showTributeInfo = true;
                                                                            }
                                                                            else
                                                                            {
                                                                                self.showTributeInfo(false);
//                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
//                                                                                         {
//                                                                                             self.showTributeInfo(false);
//                                                                                         }, 300);
                                                                                shl.enteredAndSelectedPageValues.showTributeInfo = false;
                                                                            }
                                                                            //console.log("---- activate().radioSelectedOptionValue.subscribe(): shl.enteredAndSelectedPageValues.showTributeInfo = " + shl.enteredAndSelectedPageValues.showTributeInfo);

                                                                            //Clear all tribute-related fields:
                                                                        });

                                //--- Show Tribute Info ---------------------------------------------------------------

                                //console.log("---- activate(): shl.enteredAndSelectedPageValues.showTributeInfo = " + shl.enteredAndSelectedPageValues.showTributeInfo);
                                self.showTributeInfo(shl.enteredAndSelectedPageValues.showTributeInfo);
                                //console.log("---- activate(): self.showTributeInfo was set to: " + ko.utils.unwrapObservable(self.showTributeInfo));

                                //--- Tribute -------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.tributeFirstName))
                                {
                                    self.tributeFirstName(shl.enteredAndSelectedPageValues.tributeFirstName);
                                    //console.log("---- activate(): self.tributeFirstName was set to: = " + ko.utils.unwrapObservable(self.tributeFirstName));
                                }

                                self.tributeFirstName.subscribe(function(newValue)
                                                                {
                                                                    //console.log("---- activate().tributeFirstName.subscribe(): newValue = " + newValue);
                                                                    //console.log("---- activate().tributeFirstName.subscribe(): shl.enteredAndSelectedPageValues.tributeFirstName (before) = " + shl.enteredAndSelectedPageValues.tributeFirstName);
                                                                    shl.enteredAndSelectedPageValues.tributeFirstName = newValue;
                                                                    //console.log("---- activate().tributeFirstName.subscribe(): shl.enteredAndSelectedPageValues.tributeFirstName (after) = " + shl.enteredAndSelectedPageValues.tributeFirstName);

                                                                    if (!jQuery.isEmptyObject(newValue))
                                                                    {
                                                                        $("#tributeFirstNameEntered_Div").removeClass("has-error");
                                                                        $("#tributeFirstNameEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                    }
                                                                    
                                                                    if (self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR")
                                                                    {
                                                                        //console.log("1: --------------");
                                                                        self.tributeFullName("");
                                                                        
                                                                        if (jQuery.isEmptyObject(newValue))
                                                                        {
                                                                            //console.log("1: self.tributeFirstName is EMPTY/UNDEFINED");
                                                                            null;
                                                                        }
                                                                        else
                                                                        {
                                                                            //console.log("1: self.tributeFirstName is NOT EMPTY/UNDEFINED. Value is : " + ko.utils.unwrapObservable(self.tributeFirstName));
                                                                            self.tributeFullName(newValue);
                                                                        }
                                                                        
                                                                        //var tributeFullNameTmp = "";
                                                                        
                                                                        if (ko.utils.unwrapObservable(self.tributeLastName) === undefined || jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeLastName)))
                                                                        {
                                                                            //console.log("1: self.tributeLastName is EMPTY/UNDEFINED");
                                                                            //tributeFullNameTmp = ko.utils.unwrapObservable(self.tributeFullName);
                                                                            //self.tributeFullName(tributeFullNameTmp);
                                                                            null;
                                                                            //console.log("1: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                        }
                                                                        else
                                                                        {
                                                                            //console.log("1: self.tributeLastName is NOT EMPTY/UNDEFINED. Value is : " + ko.utils.unwrapObservable(self.tributeLastName));
                                                                            //tributeFullNameTmp = ko.utils.unwrapObservable(self.tributeFullName) + ' ' + ko.utils.unwrapObservable(self.tributeLastName);
                                                                            self.tributeFullName(ko.utils.unwrapObservable(self.tributeFullName) + ' ' + ko.utils.unwrapObservable(self.tributeLastName));
                                                                            //console.log("1: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                        }
                                                                        //console.log("1: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                        self.mailBehalf_PersonToNotify(ko.utils.unwrapObservable(self.tributeFullName));
                                                                        //console.log("1: self.mailBehalf_PersonToNotify = " + ko.utils.unwrapObservable(self.mailBehalf_PersonToNotify));
                                                                    }
                                                                });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.tributeLastName))
                                {
                                    self.tributeLastName(shl.enteredAndSelectedPageValues.tributeLastName);
                                    //console.log("---- activate(): tributeLastName was set to: = " + ko.utils.unwrapObservable(self.tributeLastName));
                                }

                                self.tributeLastName.subscribe(function(newValue)
                                                               {
                                                                   //console.log("---- activate().tributeLastName.subscribe(): newValue = " + newValue);
                                                                   //console.log("---- activate().tributeLastName.subscribe(): shl.enteredAndSelectedPageValues.tributeFirstName (before) = " + shl.enteredAndSelectedPageValues.tributeFirstName);
                                                                   shl.enteredAndSelectedPageValues.tributeLastName = newValue;
                                                                   //console.log("---- activate().tributeLastName.subscribe(): shl.enteredAndSelectedPageValues.tributeLastName (after) = " + shl.enteredAndSelectedPageValues.tributeLastName);

                                                                   if (!jQuery.isEmptyObject(newValue))
                                                                   {
                                                                       $("#tributeLastNameEntered_Div").removeClass("has-error");
                                                                       $("#tributeLastNameEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                   }
                                                                   
                                                                   if (self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR")
                                                                   {
                                                                       //console.log("2: --------------");
                                                                       self.tributeFullName("");
                                                                       
                                                                       if (ko.utils.unwrapObservable(self.tributeFirstName) === undefined || jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeFirstName)))
                                                                       {
                                                                           //console.log("2: self.tributeFirstName is EMPTY/UNDEFINED");
                                                                           null;
                                                                       }
                                                                       else
                                                                       {
                                                                           //console.log("2: self.tributeFirstName is NOT EMPTY/UNDEFINED. Value is : " + ko.utils.unwrapObservable(self.tributeFirstName));
                                                                           self.tributeFullName(ko.utils.unwrapObservable(self.tributeFirstName));
                                                                       }
                                                                       
                                                                       //var tributeFullNameTmp = "";
                                                                       
                                                                       if (jQuery.isEmptyObject(newValue))
                                                                       {
                                                                           //console.log("2: self.tributeLastName is EMPTY/UNDEFINED");
                                                                           //tributeFullNameTmp = ko.utils.unwrapObservable(self.tributeFullName);
                                                                           //self.tributeFullName(tributeFullNameTmp);
                                                                           null;
                                                                           //console.log("2: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                       }
                                                                       else
                                                                       {
                                                                           //console.log("2: self.tributeLastName is NOT EMPTY/UNDEFINED. Value is : " + ko.utils.unwrapObservable(self.tributeLastName));
                                                                           //tributeFullNameTmp = ko.utils.unwrapObservable(self.tributeFullName) + ' ' + ko.utils.unwrapObservable(self.tributeLastName);
                                                                           self.tributeFullName(ko.utils.unwrapObservable(self.tributeFullName) + ' ' + newValue);
                                                                           //console.log("2: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                       }
                                                                       //console.log("2: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                       self.mailBehalf_PersonToNotify(ko.utils.unwrapObservable(self.tributeFullName));
                                                                       //console.log("2: self.mailBehalf_PersonToNotify = " + ko.utils.unwrapObservable(self.mailBehalf_PersonToNotify));
                                                                   }
                                                                });
                                
                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.tributeRelationToDonor))
                                {
                                    self.tributeRelationToDonor(shl.enteredAndSelectedPageValues.tributeRelationToDonor);
                                    //console.log("---- activate(): tributeRelationToDonor was set to: = " + ko.utils.unwrapObservable(self.tributeRelationToDonor));
                                }

                                self.tributeRelationToDonor.subscribe(function(newValue)
                                                                      {
                                                                          //console.log("---- activate().tributeRelationToDonor.subscribe(): newValue = " + newValue);
                                                                          //console.log("---- activate().tributeRelationToDonor.subscribe(): shl.enteredAndSelectedPageValues.tributeRelationToDonor (before) = " + shl.enteredAndSelectedPageValues.tributeRelationToDonor);
                                                                          shl.enteredAndSelectedPageValues.tributeRelationToDonor = newValue;
                                                                          //console.log("---- activate().tributeRelationToDonor.subscribe(): shl.enteredAndSelectedPageValues.tributeRelationToDonor (after) = " + shl.enteredAndSelectedPageValues.tributeRelationToDonor);

                                                                          if (!jQuery.isEmptyObject(newValue))
                                                                          {
                                                                              $("#tributeRelationToDonorEntered_Div").removeClass("has-error");
                                                                              $("#tributeRelationToDonorEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                          }
                                                                      });

                                //--- mail on Donor behalf ------------------------------------------------------------

                                self.mailLetterOnDonorBehalf = ko.observable(shl.enteredAndSelectedPageValues.mailLetterOnDonorBehalf);

                                self.mailLetterOnDonorBehalf.subscribe(function(newValue)
                                                                       {
                                                                           //console.log("---- activate().mailLetterOnDonorBehalf.subscribe(): newValue = " + newValue);
                                                                           //console.log("---- activate().mailLetterOnDonorBehalf.subscribe(): shl.enteredAndSelectedPageValues.mailLetterOnDonorBehalf (before) = " + shl.enteredAndSelectedPageValues.mailLetterOnDonorBehalf);
                                                                           shl.enteredAndSelectedPageValues.mailLetterOnDonorBehalf = newValue;
                                                                           //console.log("---- activate().mailLetterOnDonorBehalf.subscribe(): shl.enteredAndSelectedPageValues.mailLetterOnDonorBehalf (after) = " + shl.enteredAndSelectedPageValues.mailLetterOnDonorBehalf);
                                                                           
                                                                           if (self.radioSelectedOptionValue.peek() === "in_memory_honor_HONOR")
                                                                           {
                                                                               //console.log("3: --------------");
                                                                               self.tributeFullName("");
                                                                               
                                                                               if (ko.utils.unwrapObservable(self.tributeFirstName) === undefined || jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeFirstName)))
                                                                               {
                                                                                   //console.log("3: self.tributeFirstName is EMPTY/UNDEFINED");
                                                                                   null;
                                                                               }
                                                                               else
                                                                               {
                                                                                   //console.log("3: self.tributeFirstName is NOT EMPTY/UNDEFINED. Value is : " + ko.utils.unwrapObservable(self.tributeFirstName));
                                                                                   self.tributeFullName(ko.utils.unwrapObservable(self.tributeFirstName));
                                                                               }
                                                                               
                                                                               //var tributeFullNameTmp = "";
                                                                               
                                                                               if (ko.utils.unwrapObservable(self.tributeLastName) === undefined || jQuery.isEmptyObject(ko.utils.unwrapObservable(self.tributeLastName)))
                                                                               {
                                                                                   //console.log("3: self.tributeLastName is EMPTY/UNDEFINED");
                                                                                   //tributeFullNameTmp = ko.utils.unwrapObservable(self.tributeFullName);
                                                                                   //self.tributeFullName(tributeFullNameTmp);
                                                                                   null;
                                                                                   //console.log("3: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                               }
                                                                               else
                                                                               {
                                                                                   //console.log("3: self.tributeLastName is NOT EMPTY/UNDEFINED. Value is : " + ko.utils.unwrapObservable(self.tributeLastName));
                                                                                   //tributeFullNameTmp = ko.utils.unwrapObservable(self.tributeFullName) + ' ' + ko.utils.unwrapObservable(self.tributeLastName);
                                                                                   self.tributeFullName(ko.utils.unwrapObservable(self.tributeFullName) + ' ' + ko.utils.unwrapObservable(self.tributeLastName));
                                                                                   //console.log("3: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                               }
                                                                               //console.log("3: self.tributeFullName = " + ko.utils.unwrapObservable(self.tributeFullName));
                                                                               self.mailBehalf_PersonToNotify(ko.utils.unwrapObservable(self.tributeFullName));
                                                                               //console.log("3: self.mailBehalf_PersonToNotify = " + ko.utils.unwrapObservable(self.mailBehalf_PersonToNotify));
                                                                           }
                                                                       });

                                //--- mail on donor behalf address ----------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify))
                                {
                                    self.mailBehalf_PersonToNotify(shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify);
                                    //console.log("---- activate(): self.mailBehalf_PersonToNotify was set to: = " + ko.utils.unwrapObservable(self.mailBehalf_PersonToNotify));
                                }

                                self.mailBehalf_PersonToNotify.subscribe(function(newValue)
                                                                         {
                                                                             //console.log("---- activate().mailBehalf_PersonToNotify.subscribe(): newValue = " + newValue);
                                                                             //console.log("---- activate().mailBehalf_PersonToNotify.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify (before) = " + shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify);
                                                                             shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify = newValue;
                                                                             //console.log("---- activate().mailBehalf_PersonToNotify.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify (after) = " + shl.enteredAndSelectedPageValues.mailBehalf_PersonToNotify);

                                                                             if (!jQuery.isEmptyObject(newValue))
                                                                             {
                                                                                 $("#mailBehalf_PersonToNotifyEntered_Div").removeClass("has-error");
                                                                                 $("#mailBehalf_PersonToNotifyEntered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                             }
                                                                         });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_EMail))
                                {
                                    self.mailBehalf_EMail(shl.enteredAndSelectedPageValues.mailBehalf_EMail);
                                    //console.log("---- activate(): self.mailBehalf_EMail was set to: = " + ko.utils.unwrapObservable(self.mailBehalf_EMail));
                                }

                                self.mailBehalf_EMail.subscribe(function(newValue)
                                                                {
                                                                    //console.log("---- activate().mailBehalf_EMail.subscribe(): newValue = " + newValue);
                                                                    //console.log("---- activate().mailBehalf_EMail.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_EMail (before) = " + shl.enteredAndSelectedPageValues.mailBehalf_EMail);
                                                                    shl.enteredAndSelectedPageValues.mailBehalf_EMail = newValue;
                                                                    //console.log("---- activate().mailBehalf_EMail.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_EMail (after) = " + shl.enteredAndSelectedPageValues.mailBehalf_EMail);
                                                                });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1))
                                {
                                    self.mailBehalf_AddressLine_1(shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1);
                                    //console.log("---- activate(): self.mailBehalf_AddressLine_1 was set to: = " + ko.utils.unwrapObservable(self.mailBehalf_AddressLine_1));
                                }

                                self.mailBehalf_AddressLine_1.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().mailBehalf_AddressLine_1.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().mailBehalf_AddressLine_1.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1 (before) = " + shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1);
                                                                            shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1 = newValue;
                                                                            //console.log("---- activate().mailBehalf_AddressLine_1.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1 (after) = " + shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_1);

                                                                            if (!jQuery.isEmptyObject(newValue))
                                                                            {
                                                                                $("#mailBehalf_AddressLine_1_Entered_Div").removeClass("has-error");
                                                                                $("#mailBehalf_AddressLine_1_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                            }
                                                                        });
                                                                             
                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2))
                                {
                                    self.mailBehalf_AddressLine_2(shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2);
                                    //console.log("---- activate(): self.mailBehalf_AddressLine_2 was set to: = " + ko.utils.unwrapObservable(self.mailBehalf_AddressLine_2));
                                }

                                self.mailBehalf_AddressLine_2.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().mailBehalf_AddressLine_2.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().mailBehalf_AddressLine_2.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2 (before) = " + shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2);
                                                                            shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2 = newValue;
                                                                            //console.log("---- activate().mailBehalf_AddressLine_2.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2 (after) = " + shl.enteredAndSelectedPageValues.mailBehalf_AddressLine_2);
                                                                        });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_City))
                                {
                                    self.mailBehalf_City(shl.enteredAndSelectedPageValues.mailBehalf_City);
                                    //console.log("---- activate(): self.mailBehalf_City was set to: = " + ko.utils.unwrapObservable(self.mailBehalf_City));
                                }

                                self.mailBehalf_City.subscribe(function(newValue)
                                                               {
                                                                   //console.log("---- activate().mailBehalf_City.subscribe(): newValue = " + newValue);
                                                                   //console.log("---- activate().mailBehalf_City.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_City (before) = " + shl.enteredAndSelectedPageValues.mailBehalf_City);
                                                                   shl.enteredAndSelectedPageValues.mailBehalf_City = newValue;
                                                                   //console.log("---- activate().mailBehalf_City.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_City (after) = " + shl.enteredAndSelectedPageValues.mailBehalf_City);

                                                                   if (!jQuery.isEmptyObject(newValue))
                                                                   {
                                                                       $("#mailBehalf_City_Entered_Div").removeClass("has-error");
                                                                       $("#mailBehalf_City_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                   }
                                                               });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_ZIP))
                                {
                                    self.mailBehalf_ZIP(shl.enteredAndSelectedPageValues.mailBehalf_ZIP);
                                    //console.log("---- activate(): self.mailBehalf_ZIP was set to: = " + ko.utils.unwrapObservable(self.mailBehalf_ZIP));
                                }

                                self.mailBehalf_ZIP.subscribe(function(newValue)
                                                              {
                                                                  //console.log("---- activate().mailBehalf_ZIP.subscribe(): newValue = " + newValue);
                                                                  //console.log("---- activate().mailBehalf_ZIP.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_ZIP (before) = " + shl.enteredAndSelectedPageValues.mailBehalf_ZIP);
                                                                  shl.enteredAndSelectedPageValues.mailBehalf_ZIP = newValue;
                                                                  //console.log("---- activate().mailBehalf_ZIP.subscribe(): shl.enteredAndSelectedPageValues.mailBehalf_ZIP (after) = " + shl.enteredAndSelectedPageValues.mailBehalf_ZIP);

                                                                  if (!jQuery.isEmptyObject(newValue))
                                                                  {
                                                                      $("#mailBehalf_ZIP_Entered_Div").removeClass("has-error");
                                                                      $("#mailBehalf_ZIP_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                  }
                                                              });

                                //-------------------------------------------------------------------------------------

                                if (self.mailBehalf_ListOfCountries().length == 0)
                                {
                                    //console.log("---- Populating the mailBehalf_ListOfCountries with FRESH data from shl.serverDataSuppliesLocal[2].listOfCountries...");
                                    self.mailBehalf_ListOfCountries(shl.serverDataSuppliesLocal[2].listOfCountries);
                                    //console.log("---- So, now the self.mailBehalf_ListOfCountries().length = " + (self.mailBehalf_ListOfCountries().length).toString());
                                }

                                if (self.mailBehalf_ListOfRegions().length == 0)
                                {
                                    //console.log("---- Populating the mailBehalf_ListOfRegions with FRESH data from shl.serverDataSuppliesLocal[3].listOfRegions...");
                                    self.mailBehalf_ListOfRegions(shl.serverDataSuppliesLocal[3].listOfRegions);
                                    //console.log("---- So, now the self.mailBehalf_ListOfRegions().length = " + (self.mailBehalf_ListOfRegions().length).toString());
                                }

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected))
                                {
                                    //console.log("---- mailBehalf_CountrySelected is assigned with a value from shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected (" + shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected + ")");
                                    self.mailBehalf_CountrySelected = ko.observable(shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected);
                                }
                                else
                                {
                                    self.mailBehalf_CountrySelected = ko.observable(self.mailBehalf_ListOfCountries()[0].natn_code);

                                    shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected = ko.utils.unwrapObservable(self.mailBehalf_ListOfCountries()[0].natn_code);
                                    shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected_Desc = ko.utils.unwrapObservable(self.mailBehalf_ListOfCountries()[0].natn_desc);
                                }
                                //console.log("---- self.mailBehalf_CountrySelected = " + ko.utils.unwrapObservable(self.mailBehalf_CountrySelected));

                                self.activeFilter_Countries = ko.observable(self.mailBehalf_filters[0].filter); //set a default filter 
                                self.universalCountryListOfFilteredRecords = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                         {
                                                                                             var result;
                                                                                             if (self.activeFilter_Countries())
                                                                                             {
                                                                                                 result = ko.utils.arrayFilter(self.mailBehalf_ListOfCountries(), self.activeFilter_Countries());
                                                                                             }
                                                                                             else
                                                                                             {
                                                                                                 result = self.mailBehalf_ListOfCountries();
                                                                                             }
                                                                                             return result; //.sort(self.activeSort());
                                                                                         });

                                self.mailBehalf_CountrySelected.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                          {
                                                                              //console.log('---- The new of mailBehalf_CountrySelected is: ' + newValue);
                                                                              //console.log('---- The old value of shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected = ' + shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected);
                                                                              shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected = newValue;
                                                                              //console.log('---- The new value of shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected = ' + shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected);
                                                                              //console.log("---- Found " + ko.utils.unwrapObservable(self.filteredListOfRegions).length + " regions for self.mailBehalf_CountrySelected = " + ko.utils.unwrapObservable(self.mailBehalf_CountrySelected));

                                                                              shl.enteredAndSelectedPageValues.mailBehalf_CountrySelected_Desc = ko.utils.unwrapObservable(self.universalCountryListOfFilteredRecords()[0].natn_desc);

                                                                              if (!jQuery.isEmptyObject(newValue))
                                                                              {
                                                                                  $("#selector_mailBehalf_Country_Div").removeClass("has-error");
                                                                                  $("#selector_mailBehalf_Country_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                              }
                                                                          });

                                //-------------------------------------------------------------------------------------

                                self.activeFilter_Regions = ko.observable(self.mailBehalf_filters[0].filter); //set a default filter 
                                self.filteredListOfRegions = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                         {
                                                                             var result;
                                                                             if (self.activeFilter_Regions())
                                                                             {
                                                                                 result = ko.utils.arrayFilter(self.mailBehalf_ListOfRegions(), self.activeFilter_Regions());
                                                                             }
                                                                             else
                                                                             {
                                                                                 result = self.mailBehalf_ListOfRegions();
                                                                             }
                                                                             return result; //.sort(self.activeSort());
                                                                         });

                                //self.filteredListOfRegions = self.mailBehalf_ListOfRegions.filterByProperty("natn_code", ko.utils.unwrapObservable(self.mailBehalf_CountrySelected));
                                if (self.filteredListOfRegions().length == 0)
                                {
                                    //console.log("---- There is no a natn_code matched to self.mailBehalf_CountrySelected = " + ko.utils.unwrapObservable(self.mailBehalf_CountrySelected));
                                    null;
                                }
                                else
                                {
                                    //console.log("---- Found " + ko.utils.unwrapObservable(self.filteredListOfRegions).length + " regions for self.mailBehalf_CountrySelected = " + ko.utils.unwrapObservable(self.mailBehalf_CountrySelected));

                                    if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected))
                                    {
                                        //console.log("---- mailBehalf_RegionSelected is assigned with a value from shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected (" + shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected + ")");
                                        self.mailBehalf_RegionSelected = ko.observable(shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected);
                                    }
                                    else
                                    {
                                        self.mailBehalf_RegionSelected = ko.observable(self.filteredListOfRegions()[0].region_code);
                                        shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected_Desc = ko.utils.unwrapObservable(self.filteredListOfRegions()[0].region_desc);
                                    }
                                }

                                self.activeFilter_Regions_ForDesc = ko.observable(self.mailBehalf_filters[1].filter); //set a default filter 
                                self.universalRegionListOfFilteredRecords = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                        {
                                                                                            var result;
                                                                                            if (self.activeFilter_Regions_ForDesc())
                                                                                            {
                                                                                                result = ko.utils.arrayFilter(self.mailBehalf_ListOfRegions(), self.activeFilter_Regions_ForDesc());
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                result = self.mailBehalf_ListOfRegions();
                                                                                            }
                                                                                            return result; //.sort(self.activeSort());
                                                                                        });

                                self.mailBehalf_RegionSelected.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                         {
                                                                             //console.log('---- The new of mailBehalf_RegionSelected is: ' + newValue);
                                                                             //console.log('---- The old value of shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected = ' + shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected);
                                                                             shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected = newValue;
                                                                             //console.log('---- The new value of shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected = ' + shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected);
                                                                             shl.enteredAndSelectedPageValues.mailBehalf_RegionSelected_Desc = ko.utils.unwrapObservable(self.universalRegionListOfFilteredRecords()[0].region_desc);
                                                                         });

                                //--- make a soft credit to someone ---------------------------------------------------

                                self.makeSoftCreditToSomeone = ko.observable(shl.enteredAndSelectedPageValues.makeSoftCreditToSomeone);

                                self.makeSoftCreditToSomeone.subscribe(function(newValue)
                                                                       {
                                                                           //console.log("---- activate().makeSoftCreditToSomeone.subscribe(): newValue = " + newValue);
                                                                           //console.log("---- activate().makeSoftCreditToSomeone.subscribe(): shl.enteredAndSelectedPageValues.makeSoftCreditToSomeone (before) = " + shl.enteredAndSelectedPageValues.makeSoftCreditToSomeone);
                                                                           shl.enteredAndSelectedPageValues.makeSoftCreditToSomeone = newValue;
                                                                           //console.log("---- activate().makeSoftCreditToSomeone.subscribe(): shl.enteredAndSelectedPageValues.makeSoftCreditToSomeone (after) = " + shl.enteredAndSelectedPageValues.makeSoftCreditToSomeone);
                                                                       });
                                //---

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.softCredit_PersonFirstName))
                                {
                                    self.softCredit_PersonFirstName(shl.enteredAndSelectedPageValues.softCredit_PersonFirstName);
                                    //console.log("---- activate(): self.softCredit_PersonFirstName was set to: = " + ko.utils.unwrapObservable(self.softCredit_PersonFirstName));
                                }

                                self.softCredit_PersonFirstName.subscribe(function(newValue)
                                                                          {
                                                                              //console.log("---- activate().softCredit_PersonFirstName.subscribe(): newValue = " + newValue);
                                                                              //console.log("---- activate().softCredit_PersonFirstName.subscribe(): shl.enteredAndSelectedPageValues.softCredit_PersonFirstName (before) = " + shl.enteredAndSelectedPageValues.softCredit_PersonFirstName);
                                                                              shl.enteredAndSelectedPageValues.softCredit_PersonFirstName = newValue;
                                                                              //console.log("---- activate().softCredit_PersonFirstName.subscribe(): shl.enteredAndSelectedPageValues.softCredit_PersonFirstName (after) = " + shl.enteredAndSelectedPageValues.softCredit_PersonFirstName);
                                                                          });

                                //---

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.softCredit_PersonLastName))
                                {
                                    self.softCredit_PersonLastName(shl.enteredAndSelectedPageValues.softCredit_PersonLastName);
                                    //console.log("---- activate(): self.softCredit_PersonLastName was set to: = " + ko.utils.unwrapObservable(self.softCredit_softCredit_PersonLastName));
                                }

                                self.softCredit_PersonLastName.subscribe(function(newValue)
                                                                         {
                                                                             //console.log("---- activate().softCredit_PersonLastName.subscribe(): newValue = " + newValue);
                                                                             //console.log("---- activate().softCredit_PersonLastName.subscribe(): shl.enteredAndSelectedPageValues.softCredit_PersonLastName (before) = " + shl.enteredAndSelectedPageValues.softCredit_PersonLastName);
                                                                             shl.enteredAndSelectedPageValues.softCredit_PersonLastName = newValue;
                                                                             //console.log("---- activate().softCredit_PersonLastName.subscribe(): shl.enteredAndSelectedPageValues.softCredit_PersonLastName (after) = " + shl.enteredAndSelectedPageValues.softCredit_PersonLastName);
                                                                         });

                                //---

                                //if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.softCredit_PersonAffilation))
                                //{
                                //    self.softCredit_PersonAffilation(shl.enteredAndSelectedPageValues.softCredit_PersonAffilation);
                                //    //console.log("---- activate(): self.softCredit_PersonAffilation was set to: = " + ko.utils.unwrapObservable(self.softCredit_PersonAffilation));
                                //}
                                //
                                //self.softCredit_PersonAffilation.subscribe(function(newValue)
                                //                                           {
                                //                                               //console.log("---- activate().softCredit_PersonAffilation.subscribe(): newValue = " + newValue);
                                //                                               //console.log("---- activate().softCredit_PersonAffilation.subscribe(): shl.enteredAndSelectedPageValues.softCredit_PersonAffilation (before) = " + shl.enteredAndSelectedPageValues.softCredit_PersonAffilation);
                                //                                               shl.enteredAndSelectedPageValues.softCredit_PersonAffilation = newValue;
                                //                                               //console.log("---- activate().softCredit_PersonAffilation.subscribe(): shl.enteredAndSelectedPageValues.softCredit_PersonAffilation (after) = " + shl.enteredAndSelectedPageValues.softCredit_PersonAffilation);
                                //                                           });

                                //-------------------------------------------------------------------------------------

                                app.on('appNavigationRequest:event').then(function(message) 
                                                                          {
                                                                              // The "message" contains full name of module (like "viewmodels/donation_info") 
                                                                              // WHERE the App would  like to be navigated.
                                
                                                                              //console.log("---- Module: donation_info, appNavigationRequest:event handler(): Received message via Event: " + message);
                                                                              //self.receivedEventMessages.push(message);
                                
                                                                              if (message.indexOf("viewmodels/donor_info") > -1) //Request to navigate to donor_info
                                                                              {
                                                                                  if (self.validateDonationInfoPage())
                                                                                  {
                                                                                      app.trigger('appNavigationPermission:event', JSON.stringify({ CurrentPage: 'donation_info', DestinationPage: message, StatusOfCurrentPage: 'donation_info_VALIDATED' })); // To the previous page navigation is always available
                                                                                  }
                                                                                  else
                                                                                  {
                                                                                      app.trigger('appNavigationPermission:event', JSON.stringify({ CurrentPage: 'donation_info', DestinationPage: message, StatusOfCurrentPage: 'donation_info_VALIDATION_FAILED' }));
                                                                                  }
                                                                              }
                                                                              
                                                                          }, self);

                                //-------------------------------------------------------------------------------------

                                return;
                            };

    vm.prototype.toJSON = function()
                          {
                              //console.log(this);
                              var copy = ko.toJS(this); //easy way to get a clean copy
    
                              //delete copy.listOfCountriesAndRegions_orig;
                              //delete copy.listOfCountriesAndRegions_Tribute;
                              //delete copy.listOfCountriesAndRegions_BillingAddr;
                              //delete copy.listOfCountriesAndRegions_MailingAddr;
                          
                              delete copy.serverDataSupplies;
                              //delete copy.listOfDesignations_one;
                              delete copy.listOfDesignations_two;
                              delete copy.listOfDesignations_three;
                              delete copy.listOfReasonsToDonate;
                              delete copy.foundInitialDesignationObjectsList;
                              delete copy.foundInitialReasonToDonateObjectsList;
                              delete copy.mailBehalf_ListOfRegions;
                              delete copy.mailBehalf_ListOfCountries;
                              delete copy.listOfODSParameters;
                              delete copy.filteredListOfRegions;

                              //delete copy.getListOfDesignationsURI;
                              //delete copy.getListOfCountriesAndRegionsURI;
                              //delete copy.getListOfReasonsToDonateURI;
                              //delete copy.getListOfDonorToSBCAffilationsURI;
                              //delete copy.getListOfDonorToTributeAffilationsURI;
                          
                              //delete copy.username;
                              //delete copy.password;
                              //delete copy.filteredRecords;
                          
                              //console.log("copy", copy);
                          
                              return copy; //return the copy to be serialized
                          }

    vm.prototype.permissionChanged = function(obj, event) 
                                     {

                                         var self = this;
                                         if (event.originalEvent) //user changed
                                         {
                                             //console.log("user changed");
                                         }
                                         else // program changed
                                         {

                                             //console.log("program changed");
                                         }

                                     };

    vm.prototype.customMethod = function () 
                                {
                                    var self = this;

                                    // Method code here
                                };

    return vm;

});


