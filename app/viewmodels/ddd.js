// See this approach description at http://www.lobsterfs.co.uk/blog/singleton-transient-durandal/
//define(['durandal/app', 'knockout', './shell', 'plugins/cssLoader', 'stripe', 'stripe-checkout'], function (app,ko,shl,cssLoader,Stripe,StripeCheckout)
define(['durandal/app', 'knockout', './shell', 'plugins/cssLoader'], function (app,ko,shl,cssLoader)
{
    var vm = function () 
             {
                 var self = this;
                 var router = require('plugins/router');
                 //var S = require('https://js.stripe.com/v2/');
                 //var SC = require('https://checkout.stripe.com/checkout.js');

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

                 function findODSParameterValue(anArray, parameterName)
                 {
                     for (var i=0; i < anArray.length; i++) 
                     {
                         if (anArray[i].parameter_code === parameterName)
                         {
                             return anArray[i];
                         }
                     }
                 }

                 //----------------------------------------------------------------------------------------------------

                 //ko.extenders.uppercase = function(target, option) 
                 //                         {
                 //                             target.subscribe(function(newValue) 
                 //                                              {
                 //                                                  console.log("!!!! newValue = " + newValue);
                 //                                                  target(newValue.toUpperCase());
                 //                                                  console.log("!!!! target = " + target());
                 //                                              });
                 //                             return target;
                 //                         };

                 //----------------------------------------------------------------------------------------------------

                 self.compositionComplete =  function () 
                                             {
                                                 //console.log("---- donation_info.js, compositionComplete():");
                                                 cssLoader.loadCss('app/viewmodels/project_custom.css');
                                                 //console.log("---- donation_info.js, compositionComplete() after:");
                                                 //cssLoader.loadCss("sample2.css");
                                                 
                                                 //console.log("---- donation_info.js, compositionComplete(): donor_BillingAddressIsTheSameAsMailing (before) = " + ko.utils.unwrapObservable(self.donor_BillingAddressIsTheSameAsMailing) + " shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = " + shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing);
                                                 //self.donor_BillingAddressIsTheSameAsMailing(true);
                                                 //shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = true;
                                                 //console.log("---- donation_info.js, compositionComplete(): donor_BillingAddressIsTheSameAsMailing (after) = " + ko.utils.unwrapObservable(self.donor_BillingAddressIsTheSameAsMailing) + " shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = " + shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing);
                                             };

                 self.deactivate =  function () 
                                    {
                                        cssLoader.removeModuleCss();
                                    }

                 //----------------------------------------------------------------------------------------------------

                 self.listOfODSParameters =                              ko.observableArray([]);

                 //----------------------------------------------------------------------------------------------------

                 self.donor_NamePrefix =                                 ko.observable();
                 self.donor_NameSuffix =                                 ko.observable();
                 self.donor_FirstName =                                  ko.observable();
                 self.donor_MiddleName =                                 ko.observable();
                 self.donor_LastName =                                   ko.observable();
                 self.donor_EMail =                                      ko.observable();
                                                                         
                 self.radioSelectedOptionValue_PhoneType =               ko.observable();
                                                                         
                 self.donor_DomesticPhone =                              ko.observable();
                 self.showDomesticPhoneRelatedInputs =                   ko.observable(true);
                                                                         
                 self.donor_PhoneInrlAccessCode =                        ko.observable();
                 self.donor_InternationalPhone =                         ko.observable();
                 self.showInternationalPhoneRelatedInputs =              ko.observable();
                                                                         
                 //self.affilationToSBC_OtherThanFriend_isActive =         ko.observable(true);
                 //self.affilationToSBC_Friend_isActive =                  ko.observable(true);
                 self.donor_SBCAff_Alumnae =                             ko.observable();
                 self.donor_SBCAff_Parent =                              ko.observable();
                 self.donor_SBCAff_FactStaff =                           ko.observable();
                 self.donor_SBCAff_Student =                             ko.observable();
                 self.donor_SBCAff_Friend =                              ko.observable();
                                                                         
                 self.donor_SBCID =                                      ko.observable();
                 self.donor_SBCAff_AlumnaeClass =                        ko.observable();
                                                                         
                 self.radioSelectedOptionValue_JuniorYearAbroad =        ko.observable("JuniorYearAbroad_No");
                 self.showJuniorYearAbroadRelatedInputs =                ko.observable(false);
                                                                         
                 self.radioJuniorYearAbroadProgram =                     ko.observable("inFrance");
                 self.showJuniorYearAbroadProgramInOther_DescInput =     ko.observable(false);
                 self.JuniorYearAbroadProgramInOther_Description =       ko.observable();
                 self.showJuniorYearAbroadYearInput =                    ko.observable(false);
                 self.JuniorYearAbroadYearValue =                        ko.observable();
                                                                         
                 self.radioSelectedOptionValue_MailingAddrType =         ko.observable();
                 self.showMailingAddrCountrySelector =                   ko.observable();
                                                                         
                 self.radioSelectedOptionValue_BillingAddrType =         ko.observable();
                 self.showBillingAddrCountrySelector =                   ko.observable();
                                                                 
                 //----------------------------------------------------------------------------------------------------

                 self.donor_MailingAddr_ListOfCountries =                ko.observableArray([]);
                 self.donor_MailingAddr_CountrySelected =                ko.observable();
                 self.radioSelectedOptionValue_MailingAddrTypeDomestic = ko.observable(true);
                                                                 
                 self.donor_MailingAddr_Line_1 =                         ko.observable().extend({ required: true });
                 self.donor_MailingAddr_Line_2 =                         ko.observable();
                 self.donor_MailingAddr_Line_3 =                         ko.observable();
                 self.donor_MailingAddr_City =                           ko.observable();   
                 self.donor_MailingAddr_ZIP =                            ko.observable();
                                                                         
                 self.donor_MailingAddr_ListOfRegions =                  ko.observableArray([]);
                 self.donor_MailingAddr_RegionSelected =                 ko.observable();
                 self.donor_MailingAddr_IntrlRegion =                    ko.observable();
                 self.show_Donor_MailingAddr_DomesticRegionFields =      ko.observable();
                 self.show_Donor_MailingAddr_IntrlRegionFields =         ko.observable();

                 //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                 self.donor_MailingAddr_filters = [ {title:'Match to natn_code selected', filter: function(item) {return item.natn_code == ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected);}},
                                                    {title:'Match to region_code selected', filter: function(item) {return item.region_code == ko.utils.unwrapObservable(self.donor_MailingAddr_RegionSelected);}} ];
                 self.donor_BillingAddr_filters = [ {title:'Match to natn_code selected', filter: function(item) {return item.natn_code == ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected);}},
                                                    {title:'Match to region_code selected', filter: function(item) {return item.region_code == ko.utils.unwrapObservable(self.donor_BillingAddr_RegionSelected);}} ];
                 //----------------------------------------------------------------------------------------------------

                 self.donor_BillingAddr_ListOfCountries =        ko.observableArray([]);
                 self.donor_BillingAddr_CountrySelected =        ko.observable();
                 self.radioSelectedOptionValue_BillingAddrTypeDomestic = ko.observable(true);
                                                                 
                 self.donor_BillingAddr_Line_1 =                 ko.observable();

                 self.donor_BillingAddr_Line_2 =                 ko.observable();
                 self.donor_BillingAddr_Line_3 =                 ko.observable();
                 self.donor_BillingAddr_City =                   ko.observable();   
                 self.donor_BillingAddr_ZIP =                    ko.observable();
                                                                 
                 self.donor_BillingAddr_ListOfRegions =          ko.observableArray([]);
                 self.donor_BillingAddr_RegionSelected =         ko.observable();
                 self.donor_BillingAddr_IntrlRegion =            ko.observable();
                 self.show_Donor_BillingAddr_DomesticRegionFields = ko.observable();
                 self.show_Donor_BillingAddr_IntrlRegionFields = ko.observable();

                 self.donor_BillingAddressIsTheSameAsMailing =   ko.observable();
                 self.showBillingAddressFields =                 ko.observable(false);

                 self.donor_NameOnCreditCard =                   ko.observable().extend({ uppercase: true });

                 //--------------------------------------------------------------------------------------------------------

                 self.previousPageUrl = ko.observable();
                 self.buttonPreviousPageLabel = ko.observable("Go back to Donation Info");
                 self.buttonNextPageLabel = ko.observable("Checkout");
                 self.receivedEventMessages = ko.observableArray([]);

                 self.validateDonorInfoPage = function()
                                              {
                                                  //console.log("---- validateDonorInfoPage()");

                                                  var pageErrorFound = false;

                                                  //--- Donor's First and Last names validation

                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_FirstName)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_FirstName is Empty");
                                                      $("#donor_FirstName_Div").addClass("has-error");
                                                      $("#donor_FirstName_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_FirstName is NOT Empty");
                                                      $("#donor_FirstName_Div").removeClass("has-error");
                                                      $("#donor_FirstName_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_LastName)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_LastName is Empty");
                                                      $("#donor_LastName_Div").addClass("has-error");
                                                      $("#donor_LastName_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_LastName is NOT Empty");
                                                      $("#donor_LastName_Div").removeClass("has-error");
                                                      $("#donor_LastName_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  //--- Donor's E-Mail validation

                                                  var donor_EMail_ErrorFound = false;
                                                  
                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_EMail)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_EMail is Empty");
                                                      donor_EMail_ErrorFound = true;
                                                  }
                                                  
                                                  if (!donor_EMail_ErrorFound)
                                                  {
                                                      var email_template_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // See http://stackoverflow.com/questions/46155/validate-email-address-in-javascript

                                                      if (!email_template_regex.test(ko.utils.unwrapObservable(self.donor_EMail)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): donor_EMail value is not properly formatted");
                                                          donor_EMail_ErrorFound = true;
                                                      }
                                                  }
                                                          
                                                  if (donor_EMail_ErrorFound)
                                                  {
                                                      $("#donor_EMail_Div").addClass("has-error");
                                                      $("#donor_EMail_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_EMail is NOT Empty");
                                                      $("#donor_EMail_Div").removeClass("has-error");
                                                      $("#donor_EMail_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  //--- Donor's Phone validation (now it's not mandatory, but if entered, we have to validate it)

                                                  var donor_DomesticPhone_ErrorFound = false;
                                                  
                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_DomesticPhone)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): Warning: donor_DomesticPhone is Empty");
                                                      donor_DomesticPhone_ErrorFound = false;
                                                  }
                                                  
                                                  if (!jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_DomesticPhone)) && !donor_DomesticPhone_ErrorFound)
                                                  {
                                                      var DomesticPhone_template_regex = /^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} {0,}e*x*t*\.* *\d{0,4}$/gm // http://stackoverflow.com/questions/123559/a-comprehensive-regex-for-phone-number-validation or http://www.regexr.com/3bp4b
                                                      
                                                      if (!DomesticPhone_template_regex.test(ko.utils.unwrapObservable(self.donor_DomesticPhone)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): Phone number is not properly formatted. Expected format: (999)999-9999 or 9999999999. Extension (if needed) can be added after \"x\"");
                                                          donor_DomesticPhone_ErrorFound = true;
                                                      }
                                                  }
                                                      
                                                  if (donor_DomesticPhone_ErrorFound)
                                                  {
                                                      $("#donor_DomesticPhone_Div").addClass("has-error");
                                                      $("#donor_DomesticPhone_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_DomesticPhone is NOT Empty");
                                                      $("#donor_DomesticPhone_Div").removeClass("has-error");
                                                      $("#donor_DomesticPhone_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  //--- Donor's Class year validation

                                                  var donor_SBCAff_AlumnaeClass_ErrorFound = false;
                                                  
                                                  if ((self.donor_SBCAff_Alumnae() || self.donor_SBCAff_Student()) && jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_SBCAff_AlumnaeClass)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_SBCAff_AlumnaeClass is Empty");
                                                      $("#donor_SBCAff_AlumnaeClass_Div").addClass("has-error");
                                                      $("#donor_SBCAff_AlumnaeClass_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                      donor_SBCAff_AlumnaeClass_ErrorFound = true;
                                                  }
                                                  
                                                  if (!donor_SBCAff_AlumnaeClass_ErrorFound && (self.donor_SBCAff_Alumnae() || self.donor_SBCAff_Student()) && isNaN(ko.utils.unwrapObservable(self.donor_SBCAff_AlumnaeClass)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_SBCAff_AlumnaeClass is not a number (4-digit integer)");
                                                      $("#donor_SBCAff_AlumnaeClass_Div").addClass("has-error");
                                                      $("#donor_SBCAff_AlumnaeClass_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                      donor_SBCAff_AlumnaeClass_ErrorFound = true;
                                                  }
                                                  
                                                  if (!donor_SBCAff_AlumnaeClass_ErrorFound && 
                                                      (self.donor_SBCAff_Alumnae() || self.donor_SBCAff_Student()) && 
                                                      !isNaN(ko.utils.unwrapObservable(self.donor_SBCAff_AlumnaeClass)) &&
                                                      (parseInt(ko.utils.unwrapObservable(self.donor_SBCAff_AlumnaeClass)) < 1900 || parseInt(ko.utils.unwrapObservable(self.donor_SBCAff_AlumnaeClass)) > 2050))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_SBCAff_AlumnaeClass is less than 1900 or greater than 2050");
                                                      $("#donor_SBCAff_AlumnaeClass_Div").addClass("has-error");
                                                      $("#donor_SBCAff_AlumnaeClass_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                      donor_SBCAff_AlumnaeClass_ErrorFound = true;
                                                  }
                                                  
                                                  if (!donor_SBCAff_AlumnaeClass_ErrorFound && (self.donor_SBCAff_Alumnae() || self.donor_SBCAff_Student()))
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_SBCAff_AlumnaeClass is NOT Empty");
                                                      $("#donor_SBCAff_AlumnaeClass_Div").removeClass("has-error");
                                                      $("#donor_SBCAff_AlumnaeClass_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                      donor_SBCAff_AlumnaeClass_ErrorFound = false;
                                                  }

                                                  //--- Mailing Address validation: --------------------------------------

                                                  if (self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational" && ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) === "US")
                                                  {
                                                      console.log("--- validateDonorInfoPage(): Found an inconsistency between radioSelectedOptionValue_MailingAddrType = \"mailingAddrIsInternational\" and chosen country (= \"US\")");
                                                      $("#selector_MailingAddr_Country_Div").addClass("has-error");
                                                      $("#selector_MailingAddr_Country_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): ELSE TO: Found an inconsistency between radioSelectedOptionValue_MailingAddrType = \"mailingAddrIsInternational\" and chosen country (= \"US\")");
                                                      $("#selector_MailingAddr_Country_Div").removeClass("has-error");
                                                      $("#selector_MailingAddr_Country_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_MailingAddr_Line_1)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_MailingAddr_Line_1 is Empty");
                                                      $("#donor_MailingAddr_Line_1_Entered_Div").addClass("has-error");
                                                      $("#donor_MailingAddr_Line_1_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_MailingAddr_Line_1 is NOT Empty");
                                                      $("#donor_MailingAddr_Line_1_Entered_Div").removeClass("has-error");
                                                      $("#donor_MailingAddr_Line_1_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_MailingAddr_City)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_MailingAddr_City is Empty");
                                                      $("#donor_MailingAddr_City_Entered_Div").addClass("has-error");
                                                      $("#donor_MailingAddr_City_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_MailingAddr_City is NOT Empty");
                                                      $("#donor_MailingAddr_City_Entered_Div").removeClass("has-error");
                                                      $("#donor_MailingAddr_City_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  if ((self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational") &&
                                                      (ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) !== "CA") &&
                                                      (jQuery.isEmptyObject(donor_MailingAddr_IntrlRegion)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_MailingAddr_IntrlRegion is Empty");
                                                      $("#donor_MailingAddr_IntrlRegion_Entered_Div").addClass("has-error");
                                                      $("#donor_MailingAddr_IntrlRegion_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_MailingAddr_IntrlRegion is NOT Empty");
                                                      $("#donor_MailingAddr_IntrlRegion_Entered_Div").removeClass("has-error");
                                                      $("#donor_MailingAddr_IntrlRegion_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  //-------------------------------------------------------------------
                                                  
                                                  var donor_MailingAddr_ZIP_ErrorFound = false;
                                                  
                                                  if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_MailingAddr_ZIP)))
                                                  {
                                                      console.log("--- validateDonorInfoPage(): donor_MailingAddr_ZIP is Empty");
                                                      donor_MailingAddr_ZIP_ErrorFound = true;
                                                  }
                                                  
                                                  if (!donor_MailingAddr_ZIP_ErrorFound)
                                                  {
                                                      var donor_MailingAddr_ZIP_regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/gm; // See http://stackoverflow.com/questions/160550/zip-code-us-postal-code-validation
                                                  
                                                      if (!donor_MailingAddr_ZIP_regex.test(ko.utils.unwrapObservable(self.donor_MailingAddr_ZIP)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): donor_MailingAddr_ZIP is not properly formatted. Allowed: 99999 or 99999-9999");
                                                          donor_MailingAddr_ZIP_ErrorFound = true;
                                                      }
                                                  }
                                                  
                                                  if (donor_MailingAddr_ZIP_ErrorFound)
                                                  {
                                                      $("#donor_MailingAddr_ZIP_Entered_Div").addClass("has-error");
                                                      $("#donor_MailingAddr_ZIP_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      pageErrorFound = true;
                                                  }
                                                  else
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): donor_MailingAddr_ZIP is NOT Empty");
                                                      $("#donor_MailingAddr_ZIP_Entered_Div").removeClass("has-error");
                                                      $("#donor_MailingAddr_ZIP_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      if (!pageErrorFound) pageErrorFound = false;
                                                  }

                                                  //--- Billing Address validation: --------------------------------------

                                                  //console.log("--- validateDonorInfoPage(): Before if (!self.donor_BillingAddressIsTheSameAsMailing())");
                                                  if (!self.donor_BillingAddressIsTheSameAsMailing())
                                                  {
                                                      //console.log("--- validateDonorInfoPage(): inside of if (!self.donor_BillingAddressIsTheSameAsMailing())");

                                                      if (self.radioSelectedOptionValue_BillingAddrType.peek() === "mailingAddrIsInternational" && ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) === "US")
                                                      {
                                                          console.log("--- validateDonorInfoPage(): Found an inconsistency between radioSelectedOptionValue_BillingAddrType = \"mailingAddrIsInternational\" and chosen country (= \"US\")");
                                                          $("#selector_BillingAddr_Country_Div").addClass("has-error");
                                                          $("#selector_BillingAddr_Country_ErrorMessage").removeClass("hidden").addClass("visible");
                                                          pageErrorFound = true;
                                                      }
                                                      else
                                                      {
                                                          //console.log("--- validateDonorInfoPage(): ELSE TO: Found an inconsistency between radioSelectedOptionValue_BillingAddrType = \"mailingAddrIsInternational\" and chosen country (= \"US\")");
                                                          $("#selector_BillingAddr_Country_Div").removeClass("has-error");
                                                          $("#selector_BillingAddr_Country_ErrorMessage").removeClass("visible").addClass("hidden");
                                                          if (!pageErrorFound) pageErrorFound = false;
                                                      }

                                                      if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_BillingAddr_Line_1)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): donor_BillingAddr_Line_1 is Empty");
                                                          $("#donor_BillingAddr_Line_1_Entered_Div").addClass("has-error");
                                                          $("#donor_BillingAddr_Line_1_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                          pageErrorFound = true;
                                                      }
                                                      else
                                                      {
                                                          //console.log("--- validateDonorInfoPage(): donor_BillingAddr_Line_1 is NOT Empty");
                                                          $("#donor_BillingAddr_Line_1_Entered_Div").removeClass("has-error");
                                                          $("#donor_BillingAddr_Line_1_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                          if (!pageErrorFound) pageErrorFound = false;
                                                      }

                                                      if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_BillingAddr_City)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): donor_BillingAddr_City is Empty");
                                                          $("#donor_BillingAddr_City_Entered_Div").addClass("has-error");
                                                          $("#donor_BillingAddr_City_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                          pageErrorFound = true;
                                                      }
                                                      else
                                                      {
                                                          //console.log("--- validateDonorInfoPage(): donor_BillingAddr_City is NOT Empty");
                                                          $("#donor_BillingAddr_City_Entered_Div").removeClass("has-error");
                                                          $("#donor_BillingAddr_City_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                          if (!pageErrorFound) pageErrorFound = false;
                                                      }

                                                      if ((self.radioSelectedOptionValue_BillingAddrType.peek() === "mailingAddrIsInternational") &&
                                                          (ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) !== "CA") &&
                                                          (jQuery.isEmptyObject(donor_BillingAddr_IntrlRegion)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): donor_BillingAddr_IntrlRegion is Empty");
                                                          $("#donor_BillingAddr_IntrlRegion_Entered_Div").addClass("has-error");
                                                          $("#donor_BillingAddr_IntrlRegion_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                          pageErrorFound = true;
                                                      }
                                                      else
                                                      {
                                                          //console.log("--- validateDonorInfoPage(): donor_BillingAddr_IntrlRegion is NOT Empty");
                                                          $("#donor_BillingAddr_IntrlRegion_Entered_Div").removeClass("has-error");
                                                          $("#donor_BillingAddr_IntrlRegion_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                          if (!pageErrorFound) pageErrorFound = false;
                                                      }

                                                      //---------------------------------------------------------------
                                                      
                                                      var donor_BillingAddr_ZIP_ErrorFound = false;
                                                      
                                                      if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_BillingAddr_ZIP)))
                                                      {
                                                          console.log("--- validateDonorInfoPage(): donor_BillingAddr_ZIP is Empty");
                                                          donor_BillingAddr_ZIP_ErrorFound = true;
                                                      }
                                                      
                                                      if (!donor_BillingAddr_ZIP_ErrorFound)
                                                      {
                                                          var donor_BillingAddr_ZIP_regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/gm; // See http://stackoverflow.com/questions/160550/zip-code-us-postal-code-validation
                                                      
                                                          if (!donor_BillingAddr_ZIP_regex.test(ko.utils.unwrapObservable(self.donor_BillingAddr_ZIP)))
                                                          {
                                                              console.log("--- validateDonorInfoPage(): donor_BillingAddr_ZIP is not properly formatted. Allowed: 99999 or 99999-9999");
                                                              donor_BillingAddr_ZIP_ErrorFound = true;
                                                          }
                                                      }
                                                      
                                                      if (donor_BillingAddr_ZIP_ErrorFound)
                                                      {
                                                          $("#donor_BillingAddr_ZIP_Entered_Div").addClass("has-error");
                                                          $("#donor_BillingAddr_ZIP_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                          pageErrorFound = true;
                                                      }
                                                      else
                                                      {
                                                          //console.log("--- validateDonorInfoPage(): donor_BillingAddr_ZIP is NOT Empty");
                                                          $("#donor_BillingAddr_ZIP_Entered_Div").removeClass("has-error");
                                                          $("#donor_BillingAddr_ZIP_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                          if (!pageErrorFound) pageErrorFound = false;
                                                      }

                                                      //---------------------------------------------------------------

                                                      //if (jQuery.isEmptyObject(ko.utils.unwrapObservable(self.donor_NameOnCreditCard)))
                                                      //{
                                                      //    console.log("--- validateDonorInfoPage(): donor_NameOnCreditCard is Empty");
                                                      //    $("#donor_NameOnCreditCard_Entered_Div").addClass("has-error");
                                                      //    $("#donor_NameOnCreditCard_Entered_ErrorMessage").removeClass("hidden").addClass("visible");
                                                      //    pageErrorFound = true;
                                                      //}
                                                      //else
                                                      //{
                                                      //    console.log("--- validateDonorInfoPage(): donor_NameOnCreditCard is NOT Empty");
                                                      //    $("#donor_NameOnCreditCard_Entered_Div").removeClass("has-error");
                                                      //    $("#donor_NameOnCreditCard_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                      //    if (!pageErrorFound) pageErrorFound = false;
                                                      //}
                                                  }
                                                  
                                                  console.log("--- validateDonorInfoPage(): pageErrorFound = " + pageErrorFound);

                                                  if (shl.enteredAndSelectedPageValues.TestDebugMode)
                                                  {
                                                      console.log("0 validateDonorInfoPage(): return true");
                                                      return true;
                                                  }
                                                  else
                                                  {
                                                      if (pageErrorFound)
                                                      {
                                                          console.log("1 validateDonorInfoPage(): return false");
                                                          return false;
                                                      }
                                                      else
                                                      {
                                                          console.log("2 validateDonorInfoPage(): return true");
                                                          return true;
                                                      }
                                                  }

                                              };

                 self.gotoPreviousPage = function()
                                         {
                                             //console.log("---- gotoPreviousPage()");
                                             // To the Previous Page (Donation_info) an user can route WITHOUT donor_info fields validation

                                             //console.log("---- Module:donor_info,gotoPreviousPage(): router.navigationModel()[0].moduleId = " + router.navigationModel()[0].moduleId + " router.navigationModel()[0].isActive() = " + router.navigationModel()[0].isActive() + " router.navigationModel()[0].hash() = " + router.navigationModel()[0].hash);
                                             //console.log("---- Module:donor_info,gotoPreviousPage(): router.navigationModel()[1].moduleId = " + router.navigationModel()[1].moduleId + " router.navigationModel()[1].isActive() = " + router.navigationModel()[1].isActive() + " router.navigationModel()[1].hash() = " + router.navigationModel()[1].hash);

                                             router.navigate(router.navigationModel()[0].hash);

                                             return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                         };

                 self.checkoutWithStripe = function()
                                           {
                                               //console.log("---- Module:donor_info, checkoutWithStripe():");

                                               if (self.validateDonorInfoPage())
                                               {

                                                   //console.log("---- Module:donor_info, checkoutWithStripe(): 01");
                                                   router.navigate(router.navigationModel()[2].hash);
                                               }

                                               return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                           };

             };

    vm.prototype.activate = function (context) // Activation code here:
                            {
                                var self = this;

                                //console.log("---- vm.prototype.activate(): Invoked...");
                                //console.log("---- donor_info(),activate(): shl.enteredAndSelectedPageValues.donation_amount_to_desg_one (check for access) = " + shl.enteredAndSelectedPageValues.donation_amount_to_desg_one);

                                //-------------------------------------------------------------------------------------
                                shl.enteredAndSelectedPageValues.WebClientAppTerminatedDueToErrors = false;
                                //-------------------------------------------------------------------------------------

                                //The following lists are used for converting any CODES (all SELECT controls deal with CODES only)
                                //into Description form. For Example: CA->Canada, VA->Virginia etc

                                self.CountryMailingListOfFilteredRecords_ForDesc = ko.observableArray([]);
                                self.CountryBillingListOfFilteredRecords_ForDesc = ko.observableArray([]);

                                self.MailingRegionListOfFilteredRecords_ForDesc = ko.observableArray([]);
                                self.BillingRegionListOfFilteredRecords_ForDesc = ko.observableArray([]);

                                //self.filteredRecordsWithfilterByProperty = ko.observableArray([]);

                                //-------------------------------------------------------------------------------------

                                if (self.listOfODSParameters().length == 0)
                                {
                                    //console.log("---- Populating the listOfODSParameters with FRESH data from shl.serverDataSuppliesLocal[4].listOfODSParameters...");
                                    self.listOfODSParameters(shl.serverDataSuppliesLocal[4].listOfODSParameters);
                                    //console.log("---- So, now the self.listOfODSParameters().length = " + (self.listOfODSParameters().length).toString());
                                }

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_NamePrefix))
                                {
                                    self.donor_NamePrefix(shl.enteredAndSelectedPageValues.donor_NamePrefix);
                                    //console.log("---- activate(): self.donor_NamePrefix was set to: = " + ko.utils.unwrapObservable(self.donor_NamePrefix));
                                }

                                self.donor_NamePrefix.subscribe(function(newValue)
                                                                {
                                                                    $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                                    //console.log("---- donor_info(),activate(),donor_NamePrefix.subscribe(): newValue = " + newValue);
                                                                    //console.log("---- donor_info(),activate(),donor_NamePrefix.subscribe(): shl.enteredAndSelectedPageValues.donor_NamePrefix (before) = " + shl.enteredAndSelectedPageValues.donor_NamePrefix);
                                                                    shl.enteredAndSelectedPageValues.donor_NamePrefix = newValue;
                                                                    //console.log("---- donor_info(),activate(),donor_NamePrefix.subscribe(): shl.enteredAndSelectedPageValues.donor_NamePrefix (after) = " + shl.enteredAndSelectedPageValues.donor_NamePrefix);
                                                                });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_NamePrefix))
                                {
                                    self.donor_NamePrefix(shl.enteredAndSelectedPageValues.donor_NamePrefix);
                                    //console.log("---- activate(): self.donor_NamePrefix was set to: = " + ko.utils.unwrapObservable(self.donor_NamePrefix));
                                }

                                self.donor_NamePrefix.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_NamePrefix.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_NamePrefix.subscribe(): shl.enteredAndSelectedPageValues.donor_NamePrefix (before) = " + shl.enteredAndSelectedPageValues.donor_NamePrefix);
                                                               shl.enteredAndSelectedPageValues.donor_NamePrefix = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_NamePrefix.subscribe(): shl.enteredAndSelectedPageValues.donor_NamePrefix (after) = " + shl.enteredAndSelectedPageValues.donor_NamePrefix);
                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_FirstName))
                                {
                                    self.donor_FirstName(shl.enteredAndSelectedPageValues.donor_FirstName);
                                    //console.log("---- activate(): self.donor_FirstName was set to: = " + ko.utils.unwrapObservable(self.donor_FirstName));
                                }

                                self.donor_FirstName.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_FirstName.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_FirstName.subscribe(): shl.enteredAndSelectedPageValues.donor_FirstName (before) = " + shl.enteredAndSelectedPageValues.donor_FirstName);
                                                               shl.enteredAndSelectedPageValues.donor_FirstName = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_FirstName.subscribe(): shl.enteredAndSelectedPageValues.donor_FirstName (after) = " + shl.enteredAndSelectedPageValues.donor_FirstName);

                                                               if (!jQuery.isEmptyObject(newValue))
                                                               {
                                                                   $("#donor_FirstName_Div").removeClass("has-error");
                                                                   $("#donor_FirstName_ErrorMessage").removeClass("visible").addClass("hidden");
                                                               }
                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MiddleName))
                                {
                                    self.donor_MiddleName(shl.enteredAndSelectedPageValues.donor_MiddleName);
                                    //console.log("---- activate(): self.donor_MiddleName was set to: = " + ko.utils.unwrapObservable(self.donor_MiddleName));
                                }

                                self.donor_MiddleName.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_MiddleName.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_MiddleName.subscribe(): shl.enteredAndSelectedPageValues.donor_MiddleName (before) = " + shl.enteredAndSelectedPageValues.donor_MiddleName);
                                                               shl.enteredAndSelectedPageValues.donor_MiddleName = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_MiddleName.subscribe(): shl.enteredAndSelectedPageValues.donor_MiddleName (after) = " + shl.enteredAndSelectedPageValues.donor_MiddleName);
                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_LastName))
                                {
                                    self.donor_LastName(shl.enteredAndSelectedPageValues.donor_LastName);
                                    //console.log("---- activate(): self.donor_LastName was set to: = " + ko.utils.unwrapObservable(self.donor_LastName));
                                }

                                self.donor_LastName.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_LastName.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_LastName.subscribe(): shl.enteredAndSelectedPageValues.donor_LastName (before) = " + shl.enteredAndSelectedPageValues.donor_LastName);
                                                               shl.enteredAndSelectedPageValues.donor_LastName = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_LastName.subscribe(): shl.enteredAndSelectedPageValues.donor_LastName (after) = " + shl.enteredAndSelectedPageValues.donor_LastName);

                                                               if (!jQuery.isEmptyObject(newValue))
                                                               {
                                                                   $("#donor_LastName_Div").removeClass("has-error");
                                                                   $("#donor_LastName_ErrorMessage").removeClass("visible").addClass("hidden");
                                                               }
                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_LastName))
                                {
                                    self.donor_LastName(shl.enteredAndSelectedPageValues.donor_LastName);
                                    //console.log("---- activate(): self.donor_LastName was set to: = " + ko.utils.unwrapObservable(self.donor_LastName));
                                }

                                self.donor_LastName.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_LastName.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_LastName.subscribe(): shl.enteredAndSelectedPageValues.donor_LastName (before) = " + shl.enteredAndSelectedPageValues.donor_LastName);
                                                               shl.enteredAndSelectedPageValues.donor_LastName = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_LastName.subscribe(): shl.enteredAndSelectedPageValues.donor_LastName (after) = " + shl.enteredAndSelectedPageValues.donor_LastName);
                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_NameSuffix))
                                {
                                    self.donor_NameSuffix(shl.enteredAndSelectedPageValues.donor_NameSuffix);
                                    //console.log("---- activate(): self.donor_NameSuffix was set to: = " + ko.utils.unwrapObservable(self.donor_NameSuffix));
                                }

                                self.donor_NameSuffix.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_NameSuffix.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_NameSuffix.subscribe(): shl.enteredAndSelectedPageValues.donor_NameSuffix (before) = " + shl.enteredAndSelectedPageValues.donor_NameSuffix);
                                                               shl.enteredAndSelectedPageValues.donor_NameSuffix = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_NameSuffix.subscribe(): shl.enteredAndSelectedPageValues.donor_NameSuffix (after) = " + shl.enteredAndSelectedPageValues.donor_NameSuffix);
                                                           });

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_EMail))
                                {
                                    self.donor_EMail(shl.enteredAndSelectedPageValues.donor_EMail);
                                    //console.log("---- activate(): self.donor_EMail was set to: = " + ko.utils.unwrapObservable(self.donor_EMail));
                                }

                                self.donor_EMail.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_EMail.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_EMail.subscribe(): shl.enteredAndSelectedPageValues.donor_EMail (before) = " + shl.enteredAndSelectedPageValues.donor_EMail);
                                                               shl.enteredAndSelectedPageValues.donor_EMail = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_EMail.subscribe(): shl.enteredAndSelectedPageValues.donor_EMail (after) = " + shl.enteredAndSelectedPageValues.donor_EMail);

                                                               if (!jQuery.isEmptyObject(newValue))
                                                               {
                                                                   $("#donor_EMail_Div").removeClass("has-error");
                                                                   $("#donor_EMail_ErrorMessage").removeClass("visible").addClass("hidden");
                                                               }
                                                           });

                                //-------------------------------------------------------------------------------------

                                self.radioSelectedOptionValue_PhoneType = ko.observable();
                                self.radioSelectedOptionValue_PhoneType.extend({notify: 'always'});

                                //console.log("---- activate(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType);

                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType === "phoneIsDomestic")
                                {
                                    self.radioSelectedOptionValue_PhoneType = ko.observable("phoneIsDomestic");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_PhoneType was initially (phoneIsDomestic) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_PhoneType));
                                    self.showInternationalPhoneRelatedInputs(false);
                                    self.showDomesticPhoneRelatedInputs(true);
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType === "phoneIsInternational")
                                {
                                    self.radioSelectedOptionValue_PhoneType = ko.observable("phoneIsInternational");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_PhoneType was initially (phoneIsInternational) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_PhoneType));
                                    self.showInternationalPhoneRelatedInputs(true);
                                    self.showDomesticPhoneRelatedInputs(false);
                                }
                                
                                self.radioSelectedOptionValue_PhoneType.subscribe(function(newValue)
                                                                                  {
                                                                                      //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType (before) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType);
                                                                                      //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): radioSelectedOptionValue_PhoneType.peek() = " + self.radioSelectedOptionValue_PhoneType.peek());
                                                                                      shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType = self.radioSelectedOptionValue_PhoneType.peek();
                                                                                      //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType (after) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_PhoneType);

                                                                                      if (self.radioSelectedOptionValue_PhoneType.peek() === "phoneIsInternational")
                                                                                      {
                                                                                          self.showInternationalPhoneRelatedInputs(true);
                                                                                          self.showDomesticPhoneRelatedInputs(false);
          //                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
          //                                                                                         {
          //                                                                                             self.showInternationalPhoneRelatedInputs(true);
          //                                                                                         }, 300);
                                                                                          shl.enteredAndSelectedPageValues.showInternationalPhoneRelatedInputs = true;
                                                                                          shl.enteredAndSelectedPageValues.showDomesticPhoneRelatedInputs = false;
                                                                                          //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): (0) showInternationalPhoneRelatedInputs = " + ko.utils.unwrapObservable(self.showInternationalPhoneRelatedInputs));
                                                                                          //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): (0) showDomesticPhoneRelatedInputs = " + ko.utils.unwrapObservable(self.showDomesticPhoneRelatedInputs));
                                                                                      }
                                                                                      else // I.e. radioSelectedOptionValue_PhoneType === "phoneIsDomestic"
                                                                                      {
                                                                                          self.showInternationalPhoneRelatedInputs(false);
                                                                                          self.showDomesticPhoneRelatedInputs(true);
          //                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
          //                                                                                         {
          //                                                                                             self.showInternationalPhoneRelatedInputs(false);
          //                                                                                         }, 300);
                                                                                          shl.enteredAndSelectedPageValues.showInternationalPhoneRelatedInputs = false;
                                                                                          shl.enteredAndSelectedPageValues.showDomesticPhoneRelatedInputs = true;
                                                                                          //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): (1) showInternationalPhoneRelatedInputs = " + ko.utils.unwrapObservable(self.showInternationalPhoneRelatedInputs));
                                                                                          //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): (1) showDomesticPhoneRelatedInputs = " + ko.utils.unwrapObservable(self.showDomesticPhoneRelatedInputs));
                                                                                      }
                                                                                      //console.log("---- activate().radioSelectedOptionValue_PhoneType.subscribe(): shl.enteredAndSelectedPageValues.showInternationalPhoneRelatedInputs = " + shl.enteredAndSelectedPageValues.showInternationalPhoneRelatedInputs);

                                                                                      //Clear all tribute-related fields:
                                                                                  });

                                // --- donor_DomesticPhone ------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_DomesticPhone))
                                {
                                    self.donor_DomesticPhone(shl.enteredAndSelectedPageValues.donor_DomesticPhone);
                                    //console.log("---- activate(): self.donor_DomesticPhone was set to: = " + ko.utils.unwrapObservable(self.donor_DomesticPhone));
                                }

                                self.donor_DomesticPhone.subscribe(function(newValue)
                                                                   {
                                                                       $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                                       //console.log("---- donor_info(),activate(),donor_DomesticPhone.subscribe(): newValue = " + newValue);
                                                                       //console.log("---- donor_info(),activate(),donor_DomesticPhone.subscribe(): shl.enteredAndSelectedPageValues.donor_DomesticPhone (before) = " + shl.enteredAndSelectedPageValues.donor_DomesticPhone);
                                                                       shl.enteredAndSelectedPageValues.donor_DomesticPhone = newValue;
                                                                       //console.log("---- donor_info(),activate(),donor_DomesticPhone.subscribe(): shl.enteredAndSelectedPageValues.donor_DomesticPhone (after) = " + shl.enteredAndSelectedPageValues.donor_DomesticPhone);

                                                                       if (!jQuery.isEmptyObject(newValue))
                                                                       {
                                                                           $("#donor_DomesticPhone_Div").removeClass("has-error");
                                                                           $("#donor_DomesticPhone_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                       }
                                                                   });

                                // --- donor_InternationalPhone -------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode))
                                {
                                    self.donor_PhoneInrlAccessCode(shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode);
                                    //console.log("---- activate(): self.donor_PhoneInrlAccessCode was set to: = " + ko.utils.unwrapObservable(self.donor_PhoneInrlAccessCode));
                                }

                                self.donor_PhoneInrlAccessCode.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_PhoneInrlAccessCode.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_PhoneInrlAccessCode.subscribe(): shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode (before) = " + shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode);
                                                               shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_PhoneInrlAccessCode.subscribe(): shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode (after) = " + shl.enteredAndSelectedPageValues.donor_PhoneInrlAccessCode);
                                                           });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_InternationalPhone))
                                {
                                    self.donor_InternationalPhone(shl.enteredAndSelectedPageValues.donor_InternationalPhone);
                                    //console.log("---- activate(): self.donor_InternationalPhone was set to: = " + ko.utils.unwrapObservable(self.donor_InternationalPhone));
                                }

                                self.donor_InternationalPhone.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_InternationalPhone.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_InternationalPhone.subscribe(): shl.enteredAndSelectedPageValues.donor_InternationalPhone (before) = " + shl.enteredAndSelectedPageValues.donor_InternationalPhone);
                                                               shl.enteredAndSelectedPageValues.donor_InternationalPhone = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_InternationalPhone.subscribe(): shl.enteredAndSelectedPageValues.donor_InternationalPhone (after) = " + shl.enteredAndSelectedPageValues.donor_InternationalPhone);
                                                           });

                                //--- Affilation to SBC ---------------------------------------------------------------

                                //self.affilationToSBC_OtherThanFriend_isActive = ko.observable(shl.enteredAndSelectedPageValues.affilationToSBC_OtherThanFriend_isActive);
                                //self.affilationToSBC_OtherThanFriend_isActive.subscribe(function(newValue)
                                //                                                        {
                                //                                                            //console.log("---- Activate, self.affilationToSBC_OtherThanFriend_isActive.subscribe(): shl.enteredAndSelectedPageValues.affilationToSBC_OtherThanFriend_isActive (before) = " + shl.enteredAndSelectedPageValues.affilationToSBC_OtherThanFriend_isActive);
                                //                                                            shl.enteredAndSelectedPageValues.affilationToSBC_OtherThanFriend_isActive = newValue;
                                //                                                            //console.log("---- Activate, self.affilationToSBC_OtherThanFriend_isActive.subscribe(): shl.enteredAndSelectedPageValues.affilationToSBC_OtherThanFriend_isActive (after) = " + shl.enteredAndSelectedPageValues.affilationToSBC_OtherThanFriend_isActive);
                                //                                                        });
                                //
                                //self.affilationToSBC_Friend_isActive = ko.observable(shl.enteredAndSelectedPageValues.affilationToSBC_Friend_isActive);
                                //self.affilationToSBC_Friend_isActive.subscribe(function(newValue)
                                //                                                        {
                                //                                                            //console.log("---- Activate, self.affilationToSBC_Friend_isActive.subscribe(): shl.enteredAndSelectedPageValues.affilationToSBC_Friend_isActive (before) = " + shl.enteredAndSelectedPageValues.affilationToSBC_Friend_isActive_isActive);
                                //                                                            shl.enteredAndSelectedPageValues.affilationToSBC_Friend_isActive = newValue;
                                //                                                            //console.log("---- Activate, self.affilationToSBC_Friend_isActive.subscribe(): shl.enteredAndSelectedPageValues.affilationToSBC_Friend_isActive (after) = " + shl.enteredAndSelectedPageValues.affilationToSBC_Friend_isActive_isActive);
                                //                                                        });
                                
                                //console.log("---- Activate: shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae);
                                self.donor_SBCAff_Alumnae = ko.observable(shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae);
                                self.donor_SBCAff_Alumnae.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.donor_SBCAff_Alumnae.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae (before) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae = newValue;
                                                                       //console.log("---- Activate, self.donor_SBCAff_Alumnae.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae (after) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae);
                                                                       
                                                                       self.donor_SBCAff_Friend(false);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Friend = ko.utils.unwrapObservable(self.donor_SBCAff_Friend);
                                                                       
                                                                       //if (newValue)
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(false);
                                                                       //}
                                                                       //else
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(true);
                                                                       //}
                                                                   });

                                //console.log("---- Activate: shl.enteredAndSelectedPageValues.donor_SBCAff_Parent = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Parent);
                                self.donor_SBCAff_Parent = ko.observable(shl.enteredAndSelectedPageValues.donor_SBCAff_Parent);
                                self.donor_SBCAff_Parent.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.donor_SBCAff_Parent.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Parent (before) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Parent);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Parent = newValue;
                                                                       //console.log("---- Activate, self.donor_SBCAff_Parent.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Parent (after) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Parent);
                                                                       
                                                                       self.donor_SBCAff_Friend(false);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Friend = ko.utils.unwrapObservable(self.donor_SBCAff_Friend);
                                                                       
                                                                       //if (newValue)
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(false);
                                                                       //}
                                                                       //else
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(true);
                                                                       //}
                                                                   });

                                //console.log("---- Activate: shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff = " + shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff);
                                self.donor_SBCAff_FactStaff = ko.observable(shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff);
                                self.donor_SBCAff_FactStaff.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.donor_SBCAff_FactStaff.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff (before) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff = newValue;
                                                                       //console.log("---- Activate, self.donor_SBCAff_FactStaff.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff (after) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff);
                                                                       
                                                                       self.donor_SBCAff_Friend(false);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Friend = ko.utils.unwrapObservable(self.donor_SBCAff_Friend);
                                                                       
                                                                       //if (newValue)
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(false);
                                                                       //}
                                                                       //else
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(true);
                                                                       //}
                                                                   });

                                //console.log("---- Activate: shl.enteredAndSelectedPageValues.donor_SBCAff_Student = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Student);
                                self.donor_SBCAff_Student = ko.observable(shl.enteredAndSelectedPageValues.donor_SBCAff_Student);
                                self.donor_SBCAff_Student.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.donor_SBCAff_Student.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Student (before) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Student);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Student = newValue;
                                                                       //console.log("---- Activate, self.donor_SBCAff_Student.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Student (after) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Student);
                                                                       
                                                                       self.donor_SBCAff_Friend(false);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Friend = ko.utils.unwrapObservable(self.donor_SBCAff_Friend);
                                                                       
                                                                       //if (newValue)
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(false);
                                                                       //}
                                                                       //else
                                                                       //{
                                                                       //    self.affilationToSBC_Friend_isActive(true);
                                                                       //}
                                                                   });

                                //console.log("---- Activate: shl.enteredAndSelectedPageValues.donor_SBCAff_Friend = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Friend);
                                self.donor_SBCAff_Friend = ko.observable(shl.enteredAndSelectedPageValues.donor_SBCAff_Friend);
                                self.donor_SBCAff_Friend.subscribe(function(newValue)
                                                                   {
                                                                       //console.log("---- Activate, self.donor_SBCAff_Friend.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Friend (before) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Friend);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Friend = newValue;
                                                                       //console.log("---- Activate, self.donor_SBCAff_Friend.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_Friend (after) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_Friend);

                                                                       self.donor_SBCAff_Alumnae(false);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Alumnae = ko.utils.unwrapObservable(self.donor_SBCAff_Alumnae);
                                                                       
                                                                       self.donor_SBCAff_Parent(false); 
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Parent = ko.utils.unwrapObservable(self.donor_SBCAff_Parent);

                                                                       self.donor_SBCAff_FactStaff(false); 
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_FactStaff = ko.utils.unwrapObservable(self.donor_SBCAff_FactStaff);

                                                                       self.donor_SBCAff_Student(false);
                                                                       shl.enteredAndSelectedPageValues.donor_SBCAff_Student = ko.utils.unwrapObservable(self.donor_SBCAff_Student);
                                                                        
                                                                       //if (newValue)
                                                                       //{
                                                                       //    self.affilationToSBC_OtherThanFriend_isActive(false);
                                                                       //}
                                                                       //else
                                                                       //{
                                                                       //    self.affilationToSBC_OtherThanFriend_isActive(true);
                                                                       //}
                                                                   });

                                //--- donor_SBCID ---------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_SBCID))
                                {
                                    self.donor_SBCID(shl.enteredAndSelectedPageValues.donor_SBCID);
                                    //console.log("---- activate(): self.donor_SBCID was set to: = " + ko.utils.unwrapObservable(self.donor_SBCID));
                                }

                                self.donor_SBCID.subscribe(function(newValue)
                                                           {
                                                               $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                               //console.log("---- donor_info(),activate(),donor_SBCID.subscribe(): newValue = " + newValue);
                                                               //console.log("---- donor_info(),activate(),donor_SBCID.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCID (before) = " + shl.enteredAndSelectedPageValues.donor_SBCID);
                                                               shl.enteredAndSelectedPageValues.donor_SBCID = newValue;
                                                               //console.log("---- donor_info(),activate(),donor_SBCID.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCID (after) = " + shl.enteredAndSelectedPageValues.donor_SBCID);
                                                           });

                                //--- donor_SBCAff_AlumnaeClass -------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass))
                                {
                                    self.donor_SBCAff_AlumnaeClass(shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass);
                                    //console.log("---- activate(): self.donor_SBCAff_AlumnaeClass was set to: = " + ko.utils.unwrapObservable(self.donor_SBCAff_AlumnaeClass));
                                }
                                self.donor_SBCAff_AlumnaeClass.subscribe(function(newValue)
                                                                         {
                                                                             $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                                             //console.log("---- donor_info(),activate(),donor_SBCAff_AlumnaeClass.subscribe(): newValue = " + newValue);
                                                                             //console.log("---- donor_info(),activate(),donor_SBCAff_AlumnaeClass.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass (before) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass);
                                                                             shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass = newValue;
                                                                             //console.log("---- donor_info(),activate(),donor_SBCAff_AlumnaeClass.subscribe(): shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass (after) = " + shl.enteredAndSelectedPageValues.donor_SBCAff_AlumnaeClass);

                                                                             if (!jQuery.isEmptyObject(newValue))
                                                                             {
                                                                                 $("#donor_SBCAff_AlumnaeClass_Div").removeClass("has-error");
                                                                                 $("#donor_SBCAff_AlumnaeClass_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                             }
                                                                         });

                                //--- Junior Year Abroad --------------------------------------------------------------
                                
                                self.radioSelectedOptionValue_JuniorYearAbroad.extend({notify: 'always'});

                                //console.log("---- activate(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad);

                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad === "JuniorYearAbroad_Yes")
                                {
                                    self.radioSelectedOptionValue_JuniorYearAbroad("JuniorYearAbroad_Yes");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_JuniorYearAbroad was initially (JuniorYearAbroad_Yes) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_JuniorYearAbroad));
                                    self.showJuniorYearAbroadRelatedInputs(true);
                                    self.showJuniorYearAbroadYearInput(true);
                                    self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                }
                                else if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad === "JuniorYearAbroad_No")
                                {
                                    self.radioSelectedOptionValue_JuniorYearAbroad("JuniorYearAbroad_No");
                                    self.showJuniorYearAbroadRelatedInputs(false);
                                    self.showJuniorYearAbroadYearInput(false);
                                    self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                }
                                else
                                {
                                    self.radioSelectedOptionValue_JuniorYearAbroad("JuniorYearAbroad_No");
                                    self.showJuniorYearAbroadRelatedInputs(false);
                                    self.showJuniorYearAbroadYearInput(false);
                                    self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                }
                                    
                                shl.enteredAndSelectedPageValues.showJuniorYearAbroadRelatedInputs = ko.utils.unwrapObservable(self.showJuniorYearAbroadRelatedInputs);
                                shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadProgramInOther_DescInput);
                                shl.enteredAndSelectedPageValues.showJuniorYearAbroadYearInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadYearInput);
                                
                                self.radioSelectedOptionValue_JuniorYearAbroad.subscribe(function(newValue)
                                                                                         {
                                                                                             //console.log("---- activate().radioSelectedOptionValue_JuniorYearAbroad.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad (before) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad);
                                                                                             //console.log("---- activate().radioSelectedOptionValue_JuniorYearAbroad.subscribe(): radioSelectedOptionValue_JuniorYearAbroad.peek() = " + self.radioSelectedOptionValue_JuniorYearAbroad.peek());
                                                                                             shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad = self.radioSelectedOptionValue_JuniorYearAbroad.peek();
                                                                                             //console.log("---- activate().radioSelectedOptionValue_JuniorYearAbroad.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad (after) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_JuniorYearAbroad);
                                                                                             //console.log("---- activate().radioSelectedOptionValue_JuniorYearAbroad.subscribe(): self.showJuniorYearAbroadProgramInOther_DescInput = " + ko.utils.unwrapObservable(self.showJuniorYearAbroadProgramInOther_DescInput));
                                                                                
                                                                                             if (self.radioSelectedOptionValue_JuniorYearAbroad.peek() === "JuniorYearAbroad_Yes")
                                                                                             {
                                                                                                 self.showJuniorYearAbroadRelatedInputs(true);
                                                                                                 self.showJuniorYearAbroadYearInput(true);
                                                                                                 if (self.radioJuniorYearAbroadProgram.peek() === "inOther")
                                                                                                 {
                                                                                                     self.showJuniorYearAbroadProgramInOther_DescInput(true);
                                                                                                 }
                                                                                                 else
                                                                                                 {
                                                                                                     self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                                                                                 }
                                                                                             }
                                                                                             else // I.e. radioSelectedOptionValue_JuniorYearAbroad === "JuniorYearAbroad_No"
                                                                                             {
                                                                                                 self.showJuniorYearAbroadRelatedInputs(false);
                                                                                                 self.showJuniorYearAbroadYearInput(false);
                                                                                                 self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                                                                             }
                                                                                             shl.enteredAndSelectedPageValues.showJuniorYearAbroadRelatedInputs = ko.utils.unwrapObservable(self.showJuniorYearAbroadRelatedInputs);
                                                                                             shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadProgramInOther_DescInput);
                                                                                             shl.enteredAndSelectedPageValues.showJuniorYearAbroadYearInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadYearInput);
                                                                                         });

                                self.radioJuniorYearAbroadProgram.extend({notify: 'always'});

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram))
                                {
                                    self.radioJuniorYearAbroadProgram("inFrance");
                                    shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram = ko.utils.unwrapObservable(self.radioJuniorYearAbroadProgram);
                                }
                                else
                                {
                                    self.radioJuniorYearAbroadProgram(shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram);
                                }
                                
                                if (self.radioJuniorYearAbroadProgram.peek() === "inFrance" || self.radioJuniorYearAbroadProgram.peek() === "inSpain")
                                {
                                    self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                }
                                else // I.e. === 'inOther'
                                {
                                    self.showJuniorYearAbroadProgramInOther_DescInput(true);
                                }
                                shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadProgramInOther_DescInput);
                                
                                self.radioJuniorYearAbroadProgram.subscribe(function(newValue)
                                                                            {
                                                                                //console.log("---- activate().radioJuniorYearAbroadProgram.subscribe(): shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram (before) = " + shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram);
                                                                                //console.log("---- activate().radioJuniorYearAbroadProgram.subscribe(): radioJuniorYearAbroadProgram.peek() = " + self.radioJuniorYearAbroadProgram.peek());
                                                                                shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram = self.radioJuniorYearAbroadProgram.peek();
                                                                                //console.log("---- activate().radioJuniorYearAbroadProgram.subscribe(): shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram (after) = " + shl.enteredAndSelectedPageValues.radioJuniorYearAbroadProgram);
                                                                   
                                                                                if (self.radioJuniorYearAbroadProgram.peek() === "inFrance" || self.radioJuniorYearAbroadProgram.peek() === "inSpain")
                                                                                {
                                                                                    self.showJuniorYearAbroadProgramInOther_DescInput(false);
                                                                                }
                                                                                else // I.e. === 'inOther'
                                                                                {
                                                                                    self.showJuniorYearAbroadProgramInOther_DescInput(true);
                                                                                }
                                                                                shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadProgramInOther_DescInput);
                                                                            });
                                
                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description))
                                {
                                    self.JuniorYearAbroadProgramInOther_Description(shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description);
                                    self.showJuniorYearAbroadProgramInOther_DescInput(true);
                                    shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput = ko.utils.unwrapObservable(self.showJuniorYearAbroadProgramInOther_DescInput);
                                }

                                self.JuniorYearAbroadProgramInOther_Description.subscribe(function(newValue)
                                                                                          {
                                                                                              $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click
                                                                     
                                                                                              //console.log("---- donor_info(),activate(),JuniorYearAbroadProgramInOther_Description.subscribe(): newValue = " + newValue);
                                                                                              //console.log("---- donor_info(),activate(),JuniorYearAbroadProgramInOther_Description.subscribe(): shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description (before) = " + shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description);
                                                                                              shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description = newValue;
                                                                                              //console.log("---- donor_info(),activate(),JuniorYearAbroadProgramInOther_Description.subscribe(): shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description (after) = " + shl.enteredAndSelectedPageValues.JuniorYearAbroadProgramInOther_Description);
                                                                                          });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput))
                                {
                                    self.showJuniorYearAbroadProgramInOther_DescInput(shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput);
                                }

                                self.showJuniorYearAbroadProgramInOther_DescInput.subscribe(function(newValue)
                                                                                            {
                                                                                                $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click
                                                                          
                                                                                                //console.log("---- donor_info(),activate(),showJuniorYearAbroadProgramInOther_DescInput.subscribe(): newValue = " + newValue);
                                                                                                //console.log("---- donor_info(),activate(),showJuniorYearAbroadProgramInOther_DescInput.subscribe(): shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput (before) = " + shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput);
                                                                                                shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput = newValue;
                                                                                                //console.log("---- donor_info(),activate(),showJuniorYearAbroadProgramInOther_DescInput.subscribe(): shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput (after) = " + shl.enteredAndSelectedPageValues.showJuniorYearAbroadProgramInOther_DescInput);
                                                                                            });

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue))
                                {
                                    self.JuniorYearAbroadYearValue(shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue);
                                    //console.log("---- activate(): self.JuniorYearAbroadYearValue was set to: = " + ko.utils.unwrapObservable(self.JuniorYearAbroadYearValue));
                                }
                                self.JuniorYearAbroadYearValue.subscribe(function(newValue)
                                                                         {
                                                                             $('#donor-info-page').click(); // Without this, the "Go to previous page" works up only at second click

                                                                             //console.log("---- donor_info(),activate(),JuniorYearAbroadYearValue.subscribe(): newValue = " + newValue);
                                                                             //console.log("---- donor_info(),activate(),JuniorYearAbroadYearValue.subscribe(): shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue (before) = " + shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue);
                                                                             shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue = newValue;
                                                                             //console.log("---- donor_info(),activate(),JuniorYearAbroadYearValue.subscribe(): shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue (after) = " + shl.enteredAndSelectedPageValues.JuniorYearAbroadYearValue);

                                                                             if (!jQuery.isEmptyObject(newValue))
                                                                             {
                                                                                 $("#JuniorYearAbroadYearValue_Div").removeClass("has-error");
                                                                                 $("#JuniorYearAbroadYearValue_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                             }
                                                                         });

                                self.JuniorYearAbroadYearValue_enterKeyProcessing = function(data, event)
                                                                                     {
                                                                                         //console.log("---- JuniorYearAbroadYearValue_enterKeyProcessing()");
                                                                                         if (event.which == 13)
                                                                                         {
                                                                                            //console.log("---- JuniorYearAbroadYearValue_enterKeyProcessing(): Enter Key Pressed!");
                                                                                            event.cancelBubble = true;
                                                                                            if (event.stopPropagation) event.stopPropagation();
                                                                                            return false;
                                                                                         }
                                                                                         $(this).next().focus();
                                                                                         return true;
                                                                                     };
                                
                                self.JuniorYearAbroadProgramInOther_Description_enterKeyProcessing = function(data, event)
                                                                                     {
                                                                                         //console.log("---- JuniorYearAbroadProgramInOther_Description_enterKeyProcessing()");
                                                                                         if (event.which == 13)
                                                                                         {
                                                                                            //console.log("---- JuniorYearAbroadProgramInOther_Description_enterKeyProcessing(): Enter Key Pressed!");
                                                                                            event.cancelBubble = true;
                                                                                            if (event.stopPropagation) event.stopPropagation();
                                                                                            return false;
                                                                                         }
                                                                                         $(this).next().focus();
                                                                                         return true;
                                                                                     };
                                
                                //--- donor_BillingAddressIsTheSameAsMailing ------------------------------------------

                                //console.log("---- Activate: shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = " + shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing);

                                if (shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing)
                                {
                                    self.donor_BillingAddressIsTheSameAsMailing(true);
                                    self.showBillingAddressFields(false);
                                }
                                else
                                {
                                    self.donor_BillingAddressIsTheSameAsMailing(false);
                                    self.showBillingAddressFields(true);
                                    shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = false;
                                }

                                self.donor_BillingAddressIsTheSameAsMailing.subscribe(function(newValue)
                                                                                      {
                                                                                          //console.log("---- self.donor_BillingAddressIsTheSameAsMailing.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing (before) = " + shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing);
                                                                                          if (newValue)
                                                                                          {
                                                                                              self.showBillingAddressFields(false);
                                                                                              shl.enteredAndSelectedPageValues.showBillingAddressFields = false;

                                                                                              shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = true;
                                                                                          }
                                                                                          else
                                                                                          {
                                                                                              self.showBillingAddressFields(true);
                                                                                              shl.enteredAndSelectedPageValues.showBillingAddressFields = true;

                                                                                              shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing = false;
                                                                                          }
                                                                                          //console.log("---- Activate, self.donor_BillingAddressIsTheSameAsMailing.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing (after) = " + shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing);
                                                                                      });

                                //--- radioSelectedOptionValue_MailingAddrType ----------------------------------------

                                self.radioSelectedOptionValue_MailingAddrType = ko.observable();
                                self.radioSelectedOptionValue_MailingAddrType.extend({notify: 'always'});

                                //console.log("---- activate(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType);

                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType === "mailingAddrIsDomestic")
                                {
                                    self.radioSelectedOptionValue_MailingAddrType = ko.observable("mailingAddrIsDomestic");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_MailingAddrType was initially (mailingAddrIsDomestic) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_MailingAddrType));
                                    self.showMailingAddrCountrySelector(false);
                                    self.radioSelectedOptionValue_MailingAddrTypeDomestic(true);
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType === "mailingAddrIsInternational")
                                {
                                    self.radioSelectedOptionValue_MailingAddrType = ko.observable("mailingAddrIsInternational");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_MailingAddrType was initially (mailingAddrIsInternational) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_MailingAddrType));
                                    self.showMailingAddrCountrySelector(true);
                                    self.radioSelectedOptionValue_MailingAddrTypeDomestic(false);
                                }
                                
                                self.radioSelectedOptionValue_MailingAddrType.subscribe(function(newValue)
                                                                                        {
                                                                                            //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType (before) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType);
                                                                                            //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): radioSelectedOptionValue_MailingAddrType.peek() = " + self.radioSelectedOptionValue_MailingAddrType.peek());
                                                                                            shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType = self.radioSelectedOptionValue_MailingAddrType.peek();
                                                                                            //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType (after) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType);

                                                                                            if (self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational")
                                                                                            {
                                                                                                self.showMailingAddrCountrySelector(true);
                                                                                                self.radioSelectedOptionValue_MailingAddrTypeDomestic(false);
                                                                                                shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrTypeDomestic = false;

                                                                                                if (ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) === "CA")
                                                                                                {
                                                                                                    self.show_Donor_MailingAddr_DomesticRegionFields(true); 
                                                                                                    self.show_Donor_MailingAddr_IntrlRegionFields(false);
                                                                                                    
                                                                                                    shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = true;
                                                                                                    shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = false;
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    self.show_Donor_MailingAddr_DomesticRegionFields(false); 
                                                                                                    self.show_Donor_MailingAddr_IntrlRegionFields(true);
                                                                                                    
                                                                                                    shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = false;
                                                                                                    shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = true;
                                                                                                }
                                                                                                //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): radioSelectedOptionValue_MailingAddrTypeDomestic was set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_MailingAddrTypeDomestic));
                //                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
                //                                                                                         {
                //                                                                                             self.showInternationalPhoneRelatedInputs(true);
                //                                                                                         }, 300);
                                                                                                shl.enteredAndSelectedPageValues.showMailingAddrCountrySelector = true;
                                                                                                //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): (0) showMailingAddrCountrySelector = " + ko.utils.unwrapObservable(self.showMailingAddrCountrySelector));
                                                                                            }
                                                                                            else // I.e. radioSelectedOptionValue_MailingAddrType === "mailingAddrIsDomestic"
                                                                                            {
                                                                                                self.showMailingAddrCountrySelector(false);
                                                                                                self.radioSelectedOptionValue_MailingAddrTypeDomestic(true);
                                                                                                shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrTypeDomestic = true;

                                                                                                self.show_Donor_MailingAddr_DomesticRegionFields(true); 
                                                                                                self.show_Donor_MailingAddr_IntrlRegionFields(false);

                                                                                                shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = true;
                                                                                                shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = false;

                                                                                                //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): radioSelectedOptionValue_MailingAddrTypeDomestic was set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_MailingAddrTypeDomestic));
                //                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
                //                                                                                         {
                //                                                                                             self.showInternationalPhoneRelatedInputs(false);
                //                                                                                         }, 300);
                                                                                                shl.enteredAndSelectedPageValues.showMailingAddrCountrySelector = false;
                                                                                                //console.log("---- activate().radioSelectedOptionValue_MailingAddrType.subscribe(): (1) showMailingAddrCountrySelector = " + ko.utils.unwrapObservable(self.showMailingAddrCountrySelector));
                                                                                            }

                                                                                            //Clear all tribute-related fields:
                                                                                        });

                                //--- donor_MailingAddr_FilteredListOfCountries ---------------------------------------

                                if (self.donor_MailingAddr_ListOfCountries().length == 0)
                                {
                                    //console.log("---- Populating the donor_MailingAddr_ListOfCountries with FRESH data from shl.serverDataSuppliesLocal[2].listOfCountries. Length is " + (shl.serverDataSuppliesLocal[2].listOfCountries.length).toString());
                                    self.donor_MailingAddr_ListOfCountries(shl.serverDataSuppliesLocal[2].listOfCountries);
                                    //console.log("---- So, now the self.donor_MailingAddr_ListOfCountries().length = " + (self.donor_MailingAddr_ListOfCountries().length).toString());
                                }
                                //console.log("---- Finally the self.donor_MailingAddr_ListOfCountries().length = " + (self.donor_MailingAddr_ListOfCountries().length).toString());

                                self.donor_MailingAddr_FilteredListOfCountries = ko.computed(function() 
                                                                                             {
                                                                                                 return ko.utils.arrayFilter(self.donor_MailingAddr_ListOfCountries(), function (country) 
                                                                                                                                                                     {
                                                                                                                                                                         //console.log("---- donor_MailingAddr_FilteredListOfCountries.computed()");
                                                                                                                                                                         if (self.radioSelectedOptionValue_MailingAddrTypeDomestic())
                                                                                                                                                                         {
                                                                                                                                                                             if (country.natn_code === 'US')
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_MailingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_MailingAddrTypeDomestic = true: country.natn_code (" + country.natn_code + ") = 'US'. RETURN TRUE");
                                                                                                                                                                                 return true;
                                                                                                                                                                             }
                                                                                                                                                                             else
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_MailingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_MailingAddrTypeDomestic = true: country.natn_code (" + country.natn_code + ") != 'US'. RETURN FALSE");
                                                                                                                                                                                 return false;
                                                                                                                                                                             }
                                                                                                                                                                         }
                                                                                                                                                                         else // I.e. (self.radioSelectedOptionValue_MailingAddrTypeDomestic === false)
                                                                                                                                                                         {
                                                                                                                                                                             if (country.natn_code === 'US')
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_MailingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_MailingAddrTypeDomestic = false: country.natn_code (" + country.natn_code + ") = 'US'. RETURN FALSE");
                                                                                                                                                                                 return false;
                                                                                                                                                                             }
                                                                                                                                                                             else
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_MailingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_MailingAddrTypeDomestic = false: country.natn_code (" + country.natn_code + ") != 'US'. RETURN TRUE");
                                                                                                                                                                                 return true;
                                                                                                                                                                             }
                                                                                                                                                                         }
                                                                                                                                                                     });
                                                                                             }).extend({ notify: 'always' });

                                if (self.donor_MailingAddr_ListOfRegions().length == 0)
                                {
                                    //console.log("---- Populating the donor_MailingAddr_ListOfRegions with FRESH data from shl.serverDataSuppliesLocal[3].listOfRegions...");
                                    self.donor_MailingAddr_ListOfRegions(shl.serverDataSuppliesLocal[3].listOfRegions);
                                    //console.log("---- So, now the self.donor_MailingAddr_ListOfRegions().length = " + (self.donor_MailingAddr_ListOfRegions().length).toString());
                                }

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected))
                                {
                                    //console.log("---- donor_MailingAddr_CountrySelected is assigned with a value from shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected (" + shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected + ")");
                                    self.donor_MailingAddr_CountrySelected = ko.observable(shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected);
                                }
                                else
                                {
                                    //console.log("----!!!! self.donor_MailingAddr_FilteredListOfCountries.length = " + (self.donor_MailingAddr_FilteredListOfCountries().length).toString());
                                    //console.log("----!!!! self.donor_MailingAddr_FilteredListOfCountries()[0].natn_code = " + self.donor_MailingAddr_FilteredListOfCountries()[0].natn_code);
                                    self.donor_MailingAddr_CountrySelected = ko.observable(self.donor_MailingAddr_FilteredListOfCountries()[0].natn_code);
                                    shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected = ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected);
                                    shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected_Desc = ko.utils.unwrapObservable(self.donor_MailingAddr_FilteredListOfCountries()[0].natn_desc);
                                }
                                //console.log("---- self.donor_MailingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected));

                                self.activeFilter_CountriesMailing = ko.observable(self.donor_MailingAddr_filters[0].filter); //set a default filter 
                                self.CountryMailingListOfFilteredRecords_ForDesc = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                               {
                                                                                                   var result;
                                                                                                   if (self.activeFilter_CountriesMailing())
                                                                                                   {
                                                                                                       result = ko.utils.arrayFilter(self.donor_MailingAddr_ListOfCountries(), self.activeFilter_CountriesMailing());
                                                                                                   }
                                                                                                   else
                                                                                                   {
                                                                                                       result = self.donor_MailingAddr_ListOfCountries();
                                                                                                   }
                                                                                                   return result; //.sort(self.activeSort());
                                                                                               });

                                self.donor_MailingAddr_CountrySelected.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                                 {
                                                                                     //console.log('---- The new of donor_MailingAddr_CountrySelected is: ' + newValue);
                                                                                     //console.log('---- The old value of shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected = ' + shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected);
                                                                                     shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected = newValue;
                                                                                     //console.log('---- The new value of shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected = ' + shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected);
                                                                                     //console.log("---- Found " + ko.utils.unwrapObservable(self.mailingAddr_FilteredListOfRegions).length + " regions for self.donor_MailingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected));

                                                                                     shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected_Desc = ko.utils.unwrapObservable(self.CountryMailingListOfFilteredRecords_ForDesc()[0].natn_desc);

                                                                                     if (self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational" && newValue !== "US")
                                                                                     {
                                                                                         $("#selector_MailingAddr_Country_Div").removeClass("has-error");
                                                                                         $("#selector_MailingAddr_Country_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                     }

                                                                                     if (self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational" && newValue === "CA")
                                                                                     {
                                                                                         self.show_Donor_MailingAddr_DomesticRegionFields(true); 
                                                                                         self.show_Donor_MailingAddr_IntrlRegionFields(false);
                                                                                         
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = true;
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = false;
                                                                                     }
                                                                                     else
                                                                                     {
                                                                                         self.show_Donor_MailingAddr_DomesticRegionFields(false); 
                                                                                         self.show_Donor_MailingAddr_IntrlRegionFields(true);
                                                                                         
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = false;
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = true;
                                                                                     }
                                                                                 });

                                self.mailingAddr_RegionsActiveFilter = ko.observable(self.donor_MailingAddr_filters[0].filter); //set a default filter 
                                self.mailingAddr_FilteredListOfRegions = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                     {
                                                                                         var result;
                                                                                         if (self.mailingAddr_RegionsActiveFilter())
                                                                                         {
                                                                                             result = ko.utils.arrayFilter(self.donor_MailingAddr_ListOfRegions(), self.mailingAddr_RegionsActiveFilter());
                                                                                         }
                                                                                         else
                                                                                         {
                                                                                             result = self.donor_MailingAddr_ListOfRegions();
                                                                                         }
                                                                                         return result; //.sort(self.activeSort());
                                                                                     });

                                //-------------------------------------------------------------------------------------
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType === "mailingAddrIsDomestic")
                                {
                                    self.show_Donor_MailingAddr_DomesticRegionFields(true); 
                                    self.show_Donor_MailingAddr_IntrlRegionFields(false);

                                    shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = true;
                                    shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = false;
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_MailingAddrType === "mailingAddrIsInternational")
                                {
                                    //console.log("---- activate(): ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) = " + ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected));
                                    if (ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) === "CA")
                                    {
                                        self.show_Donor_MailingAddr_DomesticRegionFields(true); 
                                        self.show_Donor_MailingAddr_IntrlRegionFields(false);

                                        shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = true;
                                        shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = false;
                                    }
                                    else
                                    {
                                        self.show_Donor_MailingAddr_DomesticRegionFields(false); 
                                        self.show_Donor_MailingAddr_IntrlRegionFields(true);

                                        shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_DomesticRegionFields = false;
                                        shl.enteredAndSelectedPageValues.show_Donor_MailingAddr_IntrlRegionFields = true;
                                    }
                                }

                                //-------------------------------------------------------------------------------------

                                //self.mailingAddr_FilteredListOfRegions = self.donor_MailingAddr_ListOfRegions.filterByProperty("natn_code", ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected));
                                if (self.mailingAddr_FilteredListOfRegions().length == 0)
                                {
                                    //console.log("---- There is no a natn_code matched to self.donor_MailingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected));
                                    null;
                                }
                                else
                                {
                                    //console.log("---- Found " + ko.utils.unwrapObservable(self.mailingAddr_FilteredListOfRegions).length + " regions for self.donor_MailingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected));

                                    if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected))
                                    {
                                        //console.log("---- donor_MailingAddr_RegionSelected is assigned with a value from shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected (" + shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected + ")");
                                        self.donor_MailingAddr_RegionSelected = ko.observable(shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected);
                                    }
                                    else
                                    {
                                        self.donor_MailingAddr_RegionSelected = ko.observable(self.mailingAddr_FilteredListOfRegions()[0].region_code);
                                        shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected = ko.utils.unwrapObservable(self.donor_MailingAddr_RegionSelected);
                                        shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected_Desc = ko.utils.unwrapObservable(self.mailingAddr_FilteredListOfRegions()[0].region_desc);
                                    }
                                }

                                self.activeFilter_MailingRegions_ForDesc = ko.observable(self.donor_MailingAddr_filters[1].filter); //set a default filter 
                                self.MailingRegionListOfFilteredRecords_ForDesc = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                               {
                                                                                                   var result;
                                                                                                   if (self.activeFilter_MailingRegions_ForDesc())
                                                                                                   {
                                                                                                       result = ko.utils.arrayFilter(self.donor_MailingAddr_ListOfRegions(), self.activeFilter_MailingRegions_ForDesc());
                                                                                                   }
                                                                                                   else
                                                                                                   {
                                                                                                       result = self.donor_MailingAddr_ListOfRegions();
                                                                                                   }
                                                                                                   return result; //.sort(self.activeSort());
                                                                                               });

                                self.donor_MailingAddr_RegionSelected.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                                {
                                                                                    //console.log('---- The new of donor_MailingAddr_RegionSelected is: ' + newValue);
                                                                                    //console.log('---- The old value of shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected = ' + shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected);
                                                                                    shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected = newValue;
                                                                                    //console.log('---- The new value of shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected = ' + shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected);

                                                                                    shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected_Desc = ko.utils.unwrapObservable(self.MailingRegionListOfFilteredRecords_ForDesc()[0].region_desc);
                                                                                    //console.log('---- The new value of shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected_Desc = ' + shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected_Desc);

                                                                                    //For a while, the following commands are executed unconditionally:
                                                                                    $("#donor_MailingAddr_RegionSelected_Div").removeClass("has-error");
                                                                                    $("#donor_MailingAddr_RegionSelected_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                });

                                //--- donor_MailingAddr_IntrlRegion ---------------------------------------------------

                                if ((self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational") &&
                                    (ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) !== "CA"))
                                {
                                    self.donor_MailingAddr_IntrlRegion(shl.enteredAndSelectedPageValues.donor_MailingAddr_IntrlRegion);
                                }

                                self.donor_MailingAddr_IntrlRegion.subscribe(function(newValue)
                                                                             {
                                                                                 shl.enteredAndSelectedPageValues.donor_MailingAddr_IntrlRegion = newValue;

                                                                                 if ((self.radioSelectedOptionValue_MailingAddrType.peek() === "mailingAddrIsInternational") &&
                                                                                     (ko.utils.unwrapObservable(self.donor_MailingAddr_CountrySelected) !== "CA") &&
                                                                                     (!jQuery.isEmptyObject(donor_MailingAddr_IntrlRegion)))
                                                                                 {
                                                                                     $("#donor_MailingAddr_IntrlRegion_Entered_Div").removeClass("has-error");
                                                                                     $("#donor_MailingAddr_IntrlRegion_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                     if (!pageErrorFound) pageErrorFound = false;
                                                                                 }
                                                                             });

                                //--- donor_MailingAddr_Line_1 --------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1))
                                {
                                    self.donor_MailingAddr_Line_1(shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1);
                                    //console.log("---- activate(): self.donor_MailingAddr_Line_1 was set to: = " + ko.utils.unwrapObservable(self.donor_MailingAddr_Line_1));
                                }

                                self.donor_MailingAddr_Line_1.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_MailingAddr_Line_1.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_MailingAddr_Line_1.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1 (before) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1);
                                                                            shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1 = newValue;
                                                                            //console.log("---- activate().donor_MailingAddr_Line_1.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1 (after) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1);

                                                                            if (!jQuery.isEmptyObject(newValue))
                                                                            {
                                                                                $("#donor_MailingAddr_Line_1_Entered_Div").removeClass("has-error");
                                                                                $("#donor_MailingAddr_Line_1_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                            }
                                                                        });
                                                                             
                                //--- donor_MailingAddr_Line_2 --------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2))
                                {
                                    self.donor_MailingAddr_Line_2(shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2);
                                    //console.log("---- activate(): self.donor_MailingAddr_Line_2 was set to: = " + ko.utils.unwrapObservable(self.donor_MailingAddr_Line_2));
                                }

                                self.donor_MailingAddr_Line_2.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_MailingAddr_Line_2.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_MailingAddr_Line_2.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2 (before) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2);
                                                                            shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2 = newValue;
                                                                            //console.log("---- activate().donor_MailingAddr_Line_2.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2 (after) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2);
                                                                        });
                                                                             
                                //--- donor_MailingAddr_Line_3 --------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3))
                                {
                                    self.donor_MailingAddr_Line_3(shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3);
                                    //console.log("---- activate(): self.donor_MailingAddr_Line_3 was set to: = " + ko.utils.unwrapObservable(self.donor_MailingAddr_Line_3));
                                }

                                self.donor_MailingAddr_Line_3.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_MailingAddr_Line_3.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_MailingAddr_Line_3.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3 (before) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3);
                                                                            shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3 = newValue;
                                                                            //console.log("---- activate().donor_MailingAddr_Line_3.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3 (after) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_3);
                                                                        });
                                                                             
                                //--- donor_MailingAddr_City ----------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_City))
                                {
                                    self.donor_MailingAddr_City(shl.enteredAndSelectedPageValues.donor_MailingAddr_City);
                                    //console.log("---- activate(): self.donor_MailingAddr_City was set to: = " + ko.utils.unwrapObservable(self.donor_MailingAddr_City));
                                }

                                self.donor_MailingAddr_City.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_MailingAddr_City.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_MailingAddr_City.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_City (before) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_City);
                                                                            shl.enteredAndSelectedPageValues.donor_MailingAddr_City = newValue;
                                                                            //console.log("---- activate().donor_MailingAddr_City.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_City (after) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_City);

                                                                            if (!jQuery.isEmptyObject(newValue))
                                                                            {
                                                                                $("#donor_MailingAddr_City_Entered_Div").removeClass("has-error");
                                                                                $("#donor_MailingAddr_City_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                            }
                                                                        });

                                //--- donor_MailingAddr_ZIP -----------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP))
                                {
                                    self.donor_MailingAddr_ZIP(shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP);
                                    //console.log("---- activate(): self.donor_MailingAddr_ZIP was set to: = " + ko.utils.unwrapObservable(self.donor_MailingAddr_ZIP));
                                }

                                self.donor_MailingAddr_ZIP.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_MailingAddr_ZIP.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_MailingAddr_ZIP.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP (before) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP);
                                                                            shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP = newValue;
                                                                            //console.log("---- activate().donor_MailingAddr_ZIP.subscribe(): shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP (after) = " + shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP);

                                                                            if (!jQuery.isEmptyObject(newValue))
                                                                            {
                                                                                $("#donor_MailingAddr_ZIP_Entered_Div").removeClass("has-error");
                                                                                $("#donor_MailingAddr_ZIP_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                            }
                                                                        });

                                //--- radioSelectedOptionValue_BillingAddrType ----------------------------------------

                                self.radioSelectedOptionValue_BillingAddrType = ko.observable();
                                self.radioSelectedOptionValue_BillingAddrType.extend({notify: 'always'});

                                //console.log("---- activate(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType);

                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType === "billingAddrIsDomestic")
                                {
                                    self.radioSelectedOptionValue_BillingAddrType = ko.observable("billingAddrIsDomestic");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_BillingAddrType was initially (billingAddrIsDomestic) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_BillingAddrType));
                                    self.showBillingAddrCountrySelector(false);
                                    self.radioSelectedOptionValue_BillingAddrTypeDomestic(true);

                                    self.show_Donor_BillingAddr_DomesticRegionFields(true); 
                                    self.show_Donor_BillingAddr_IntrlRegionFields(false);

                                    shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = true;
                                    shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = false;
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType === "billingAddrIsInternational")
                                {
                                    self.radioSelectedOptionValue_BillingAddrType = ko.observable("billingAddrIsInternational");
                                    //console.log("---- activate(): self.radioSelectedOptionValue_BillingAddrType was initially (billingAddrIsInternational) set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_BillingAddrType));
                                    self.showBillingAddrCountrySelector(true);
                                    self.radioSelectedOptionValue_BillingAddrTypeDomestic(false);

                                    self.show_Donor_BillingAddr_DomesticRegionFields(false); 
                                    self.show_Donor_BillingAddr_IntrlRegionFields(true);

                                    shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = false;
                                    shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = true;
                                }
                                
                                self.radioSelectedOptionValue_BillingAddrType.subscribe(function(newValue)
                                                                                        {
                                                                                            //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType (before) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType);
                                                                                            //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): radioSelectedOptionValue_BillingAddrType.peek() = " + self.radioSelectedOptionValue_BillingAddrType.peek());
                                                                                            shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType = self.radioSelectedOptionValue_BillingAddrType.peek();
                                                                                            //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType (after) = " + shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType);

                                                                                            if (self.radioSelectedOptionValue_BillingAddrType.peek() === "billingAddrIsInternational")
                                                                                            {
                                                                                                self.showBillingAddrCountrySelector(true);
                //                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
                //                                                                                         {
                //                                                                                             self.showInternationalPhoneRelatedInputs(true);
                //                                                                                         }, 300);
                                                                                                shl.enteredAndSelectedPageValues.showBillingAddrCountrySelector = true;
                                                                                                //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): (0) showBillingAddrCountrySelector = " + ko.utils.unwrapObservable(self.showBillingAddrCountrySelector));
                                                                                                self.radioSelectedOptionValue_BillingAddrTypeDomestic(false);
                                                                                                shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrTypeDomestic = false;
                                                                                                //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): radioSelectedOptionValue_BillingAddrTypeDomestic was set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_BillingAddrTypeDomestic));

                                                                                               if (ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) === "CA")
                                                                                               {
                                                                                                   self.show_Donor_BillingAddr_DomesticRegionFields(true); 
                                                                                                   self.show_Donor_BillingAddr_IntrlRegionFields(false);
                                                                                                   
                                                                                                   shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = true;
                                                                                                   shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = false;
                                                                                               }
                                                                                               else
                                                                                               {
                                                                                                   self.show_Donor_BillingAddr_DomesticRegionFields(false); 
                                                                                                   self.show_Donor_BillingAddr_IntrlRegionFields(true);
                                                                                                   
                                                                                                   shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = false;
                                                                                                   shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = true;
                                                                                               }
                                                                                            }
                                                                                            else // I.e. radioSelectedOptionValue_BillingAddrType === "billingAddrIsDomestic"
                                                                                            {
                                                                                                self.showBillingAddrCountrySelector(false);
                //                                                                              setTimeout(function() //http://stackoverflow.com/questions/22552549/knockout-click-binding-not-working-when-hiding-the-element
                //                                                                                         {
                //                                                                                             self.showInternationalPhoneRelatedInputs(false);
                //                                                                                         }, 300);
                                                                                                shl.enteredAndSelectedPageValues.showBillingAddrCountrySelector = false;
                                                                                                //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): (1) showBillingAddrCountrySelector = " + ko.utils.unwrapObservable(self.showBillingAddrCountrySelector));
                                                                                                self.radioSelectedOptionValue_BillingAddrTypeDomestic(true);
                                                                                                shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrTypeDomestic = true;
                                                                                                //console.log("---- activate().radioSelectedOptionValue_BillingAddrType.subscribe(): radioSelectedOptionValue_BillingAddrTypeDomestic was set to " + ko.utils.unwrapObservable(self.radioSelectedOptionValue_BillingAddrTypeDomestic));

                                                                                                self.show_Donor_BillingAddr_DomesticRegionFields(true); 
                                                                                                self.show_Donor_BillingAddr_IntrlRegionFields(false);

                                                                                                shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = true;
                                                                                                shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = false;
                                                                                            }

                                                                                            //Clear all tribute-related fields:
                                                                                        });

                                //--- donor_BillingAddr_ListOfCountries -----------------------------------------------

                                if (self.donor_BillingAddr_ListOfCountries().length == 0)
                                {
                                    //console.log("---- Populating the donor_BillingAddr_ListOfCountries with FRESH data from shl.serverDataSuppliesLocal[2].listOfCountries...");
                                    self.donor_BillingAddr_ListOfCountries(shl.serverDataSuppliesLocal[2].listOfCountries);
                                    //console.log("---- So, now the self.donor_BillingAddr_ListOfCountries().length = " + (self.donor_BillingAddr_ListOfCountries().length).toString());
                                }

                                self.donor_BillingAddr_FilteredListOfCountries = ko.computed(function () 
                                                                                             {
                                                                                                 return ko.utils.arrayFilter(self.donor_BillingAddr_ListOfCountries(), function (country) 
                                                                                                                                                                     {
                                                                                                                                                                         //console.log("---- donor_BillingAddr_FilteredListOfCountries.computed()");
                                                                                                                                                                         if (self.radioSelectedOptionValue_BillingAddrTypeDomestic())
                                                                                                                                                                         {
                                                                                                                                                                             if (country.natn_code === 'US')
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_BillingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_BillingAddrTypeDomestic = true: country.natn_code (" + country.natn_code + ") = 'US'. RETURN TRUE");
                                                                                                                                                                                 return true;
                                                                                                                                                                             }
                                                                                                                                                                             else
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_BillingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_BillingAddrTypeDomestic = true: country.natn_code (" + country.natn_code + ") != 'US'. RETURN FALSE");
                                                                                                                                                                                 return false;
                                                                                                                                                                             }
                                                                                                                                                                         }
                                                                                                                                                                         else // I.e. (self.radioSelectedOptionValue_BillingAddrTypeDomestic === false)
                                                                                                                                                                         {
                                                                                                                                                                             if (country.natn_code === 'US')
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_BillingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_BillingAddrTypeDomestic = false: country.natn_code (" + country.natn_code + ") = 'US'. RETURN FALSE");
                                                                                                                                                                                 return false;
                                                                                                                                                                             }
                                                                                                                                                                             else
                                                                                                                                                                             {
                                                                                                                                                                                 //console.log("---- donor_BillingAddr_FilteredListOfCountries.computed().arrayFilter: radioSelectedOptionValue_BillingAddrTypeDomestic = false: country.natn_code (" + country.natn_code + ") != 'US'. RETURN TRUE");
                                                                                                                                                                                 return true;
                                                                                                                                                                             }
                                                                                                                                                                         }
                                                                                                                                                                     });
                                                                                             }).extend({ notify: 'always' });

                                if (self.donor_BillingAddr_ListOfRegions().length == 0)
                                {
                                    //console.log("---- Populating the donor_BillingAddr_ListOfRegions with FRESH data from shl.serverDataSuppliesLocal[3].listOfRegions...");
                                    self.donor_BillingAddr_ListOfRegions(shl.serverDataSuppliesLocal[3].listOfRegions);
                                    //console.log("---- So, now the self.donor_BillingAddr_ListOfRegions().length = " + (self.donor_BillingAddr_ListOfRegions().length).toString());
                                }

                                //-------------------------------------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected))
                                {
                                    //console.log("---- donor_BillingAddr_CountrySelected is assigned with a value from shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected (" + shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected + ")");
                                    self.donor_BillingAddr_CountrySelected = ko.observable(shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected);
                                }
                                else
                                {
                                    self.donor_BillingAddr_CountrySelected = ko.observable(self.donor_BillingAddr_FilteredListOfCountries()[0].natn_code);
                                    shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected = ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected);
                                    shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected_Desc = ko.utils.unwrapObservable(self.donor_BillingAddr_FilteredListOfCountries()[0].natn_desc);
                                }
                                //console.log("---- self.donor_BillingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected));

                                self.activeFilter_CountriesBilling = ko.observable(self.donor_BillingAddr_filters[0].filter); //set a default filter 
                                self.CountryBillingListOfFilteredRecords_ForDesc = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                               {
                                                                                                   var result;
                                                                                                   if (self.activeFilter_CountriesBilling())
                                                                                                   {
                                                                                                       result = ko.utils.arrayFilter(self.donor_BillingAddr_ListOfCountries(), self.activeFilter_CountriesBilling());
                                                                                                   }
                                                                                                   else
                                                                                                   {
                                                                                                       result = self.donor_BillingAddr_ListOfCountries();
                                                                                                   }
                                                                                                   return result; //.sort(self.activeSort());
                                                                                               });

                                self.donor_BillingAddr_CountrySelected.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                                 {
                                                                                     //console.log('---- The new of donor_BillingAddr_CountrySelected is: ' + newValue);
                                                                                     //console.log('---- The old value of shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected = ' + shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected);
                                                                                     shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected = newValue;
                                                                                     //console.log('---- The new value of shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected = ' + shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected);
                                                                                     //console.log("---- Found " + ko.utils.unwrapObservable(self.billingAddr_FilteredListOfRegions).length + " regions for self.donor_BillingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected));

                                                                                     shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected_Desc = ko.utils.unwrapObservable(self.CountryBillingListOfFilteredRecords_ForDesc()[0].natn_desc);

                                                                                     if (self.radioSelectedOptionValue_BillingAddrType.peek() === "billingAddrIsInternational" && newValue !== "US")
                                                                                     {
                                                                                         $("#selector_BillingAddr_Country_Div").removeClass("has-error");
                                                                                         $("#selector_BillingAddr_Country_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                     }

                                                                                     if (self.radioSelectedOptionValue_BillingAddrType.peek() === "billingAddrIsInternational" && newValue === "CA")
                                                                                     {
                                                                                         self.show_Donor_BillingAddr_DomesticRegionFields(true); 
                                                                                         self.show_Donor_BillingAddr_IntrlRegionFields(false);
                                                                                         
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = true;
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = false;
                                                                                     }
                                                                                     else
                                                                                     {
                                                                                         self.show_Donor_BillingAddr_DomesticRegionFields(false); 
                                                                                         self.show_Donor_BillingAddr_IntrlRegionFields(true);
                                                                                         
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = false;
                                                                                         shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = true;
                                                                                     }
                                                                                 });

                                self.billingAddr_RegionsActiveFilter = ko.observable(self.donor_BillingAddr_filters[0].filter); //set a default filter 
                                self.billingAddr_FilteredListOfRegions = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                     {
                                                                                         var result;
                                                                                         if (self.billingAddr_RegionsActiveFilter())
                                                                                         {
                                                                                             result = ko.utils.arrayFilter(self.donor_BillingAddr_ListOfRegions(), self.billingAddr_RegionsActiveFilter());
                                                                                         }
                                                                                         else
                                                                                         {
                                                                                             result = self.donor_BillingAddr_ListOfRegions();
                                                                                         }
                                                                                         return result; //.sort(self.activeSort());
                                                                                     });

                                //-------------------------------------------------------------------------------------
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType === "billingAddrIsDomestic")
                                {
                                    self.show_Donor_BillingAddr_DomesticRegionFields(true); 
                                    self.show_Donor_BillingAddr_IntrlRegionFields(false);

                                    shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = true;
                                    shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = false;
                                }
                                
                                if (shl.enteredAndSelectedPageValues.radioSelectedOptionValue_BillingAddrType === "billingAddrIsInternational")
                                {
                                    //console.log("---- activate(): ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) = " + ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected));
                                    if (ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) === "CA")
                                    {
                                        self.show_Donor_BillingAddr_DomesticRegionFields(true); 
                                        self.show_Donor_BillingAddr_IntrlRegionFields(false);

                                        shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = true;
                                        shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = false;
                                    }
                                    else
                                    {
                                        self.show_Donor_BillingAddr_DomesticRegionFields(false); 
                                        self.show_Donor_BillingAddr_IntrlRegionFields(true);

                                        shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_DomesticRegionFields = false;
                                        shl.enteredAndSelectedPageValues.show_Donor_BillingAddr_IntrlRegionFields = true;
                                    }
                                }

                                //-------------------------------------------------------------------------------------

                                //self.billingAddr_FilteredListOfRegions = self.donor_BillingAddr_ListOfRegions.filterByProperty("natn_code", ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected));
                                if (self.billingAddr_FilteredListOfRegions().length > 0)
                                {
                                    //console.log("---- Found " + ko.utils.unwrapObservable(self.billingAddr_FilteredListOfRegions).length + " regions for self.donor_BillingAddr_CountrySelected = " + ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected));

                                    if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected))
                                    {
                                        //console.log("---- donor_BillingAddr_RegionSelected is assigned with a value from shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected (" + shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected + ")");
                                        self.donor_BillingAddr_RegionSelected = ko.observable(shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected);
                                    }
                                    else
                                    {
                                        self.donor_BillingAddr_RegionSelected = ko.observable(self.billingAddr_FilteredListOfRegions()[0].region_code);
                                        shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected = ko.utils.unwrapObservable(self.donor_BillingAddr_RegionSelected);
                                        shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected_Desc = ko.utils.unwrapObservable(self.billingAddr_FilteredListOfRegions()[0].region_desc);
                                    }
                                }

                                self.activeFilter_BillingRegions_ForDesc = ko.observable(self.donor_BillingAddr_filters[1].filter); //set a default filter 
                                self.BillingRegionListOfFilteredRecords_ForDesc = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                               {
                                                                                                   var result;
                                                                                                   if (self.activeFilter_BillingRegions_ForDesc())
                                                                                                   {
                                                                                                       result = ko.utils.arrayFilter(self.donor_BillingAddr_ListOfRegions(), self.activeFilter_BillingRegions_ForDesc());
                                                                                                   }
                                                                                                   else
                                                                                                   {
                                                                                                       result = self.donor_BillingAddr_ListOfRegions();
                                                                                                   }
                                                                                                   return result; //.sort(self.activeSort());
                                                                                               });

                                self.donor_BillingAddr_RegionSelected.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                                {
                                                                                    //console.log('---- The new of donor_BillingAddr_RegionSelected is: ' + newValue);
                                                                                    //console.log('---- The old value of shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected = ' + shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected);
                                                                                    shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected = newValue;
                                                                                    //console.log('---- The new value of shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected = ' + shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected);

                                                                                    shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected_Desc = ko.utils.unwrapObservable(self.BillingRegionListOfFilteredRecords_ForDesc()[0].region_desc);

                                                                                    //For a while, the following commands are executed unconditionally:
                                                                                    $("#donor_BillingAddr_RegionSelected_Div").removeClass("has-error");
                                                                                    $("#donor_BillingAddr_RegionSelected_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                });

                                //--- donor_BillingAddr_IntrlRegion ---------------------------------------------------

                                if ((self.radioSelectedOptionValue_BillingAddrType.peek() === "billingAddrIsInternational") &&
                                    (ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) !== "CA"))
                                {
                                    self.donor_BillingAddr_IntrlRegion(shl.enteredAndSelectedPageValues.donor_BillingAddr_IntrlRegion);
                                }

                                self.donor_BillingAddr_IntrlRegion.subscribe(function(newValue)
                                                                             {
                                                                                 shl.enteredAndSelectedPageValues.donor_BillingAddr_IntrlRegion = newValue;

                                                                                 if ((self.radioSelectedOptionValue_BillingAddrType.peek() === "billingAddrIsInternational") &&
                                                                                     (ko.utils.unwrapObservable(self.donor_BillingAddr_CountrySelected) !== "CA") &&
                                                                                     (!jQuery.isEmptyObject(donor_BillingAddr_IntrlRegion)))
                                                                                 {
                                                                                     $("#donor_BillingAddr_IntrlRegion_Entered_Div").removeClass("has-error");
                                                                                     $("#donor_BillingAddr_IntrlRegion_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                     if (!pageErrorFound) pageErrorFound = false;
                                                                                 }
                                                                             });

                                //--- donor_BillingAddr_Line_1 --------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1))
                                {
                                    //console.log("---- activate(),self.donor_BillingAddr_Line_1.computed: self.donor_BillingAddr_Line_1 was set to: = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1 + " (a value of shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1)");
                                    self.donor_BillingAddr_Line_1(shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1);
                                }

                                self.donor_BillingAddr_Line_1.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_BillingAddr_Line_1.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_BillingAddr_Line_1.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1 (before) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1);
                                                                            shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1 = newValue;
                                                                            //console.log("---- activate().donor_BillingAddr_Line_1.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1 (after) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1);

                                                                            if (!jQuery.isEmptyObject(newValue))
                                                                            {
                                                                                $("#donor_BillingAddr_Line_1_Entered_Div").removeClass("has-error");
                                                                                $("#donor_BillingAddr_Line_1_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                            }
                                                                        });

                                //console.log("---- activate(): Check if donor_BillingAddr_Line_1 is computed/observable/isWritableObservable: " + ko.isComputed(self.donor_BillingAddr_Line_1) + "/" + ko.isObservable(self.donor_BillingAddr_Line_1) + "/" + ko.isWritableObservable(self.donor_BillingAddr_Line_1));

                                //--- donor_BillingAddr_Line_2 --------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2))
                                {
                                    self.donor_BillingAddr_Line_2(shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2);
                                    //console.log("---- activate(): self.donor_BillingAddr_Line_2 was set to: = " + ko.utils.unwrapObservable(self.donor_BillingAddr_Line_2));
                                }

                                self.donor_BillingAddr_Line_2.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_BillingAddr_Line_2.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_BillingAddr_Line_2.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2 (before) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2);
                                                                            shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2 = newValue;
                                                                            //console.log("---- activate().donor_BillingAddr_Line_2.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2 (after) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2);
                                                                        });

                                //--- donor_BillingAddr_Line_3 --------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3))
                                {
                                    self.donor_BillingAddr_Line_3(shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3);
                                    //console.log("---- activate(): self.donor_BillingAddr_Line_3 was set to: = " + ko.utils.unwrapObservable(self.donor_BillingAddr_Line_3));
                                }

                                self.donor_BillingAddr_Line_3.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_BillingAddr_Line_3.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_BillingAddr_Line_3.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3 (before) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3);
                                                                            shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3 = newValue;
                                                                            //console.log("---- activate().donor_BillingAddr_Line_3.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3 (after) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_3);
                                                                        });

                                //--- donor_BillingAddr_City ----------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_City))
                                {
                                    self.donor_BillingAddr_City(shl.enteredAndSelectedPageValues.donor_BillingAddr_City);
                                    //console.log("---- activate(): self.donor_BillingAddr_City was set to: = " + ko.utils.unwrapObservable(self.donor_BillingAddr_City));
                                }

                                self.donor_BillingAddr_City.subscribe(function(newValue)
                                                                        {
                                                                            //console.log("---- activate().donor_BillingAddr_City.subscribe(): newValue = " + newValue);
                                                                            //console.log("---- activate().donor_BillingAddr_City.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_City (before) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_City);
                                                                            shl.enteredAndSelectedPageValues.donor_BillingAddr_City = newValue;
                                                                            //console.log("---- activate().donor_BillingAddr_City.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_City (after) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_City);

                                                                            if (!jQuery.isEmptyObject(newValue))
                                                                            {
                                                                                $("#donor_BillingAddr_City_Entered_Div").removeClass("has-error");
                                                                                $("#donor_BillingAddr_City_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                            }
                                                                        });

                                //--- donor_BillingAddr_ZIP -----------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP))
                                {
                                    self.donor_BillingAddr_ZIP(shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP);
                                    //console.log("---- activate(): self.donor_BillingAddr_ZIP was set to: = " + ko.utils.unwrapObservable(self.donor_BillingAddr_ZIP));
                                }

                                self.donor_BillingAddr_ZIP.subscribe(function(newValue)
                                                                     {
                                                                         //console.log("---- activate().donor_BillingAddr_ZIP.subscribe(): newValue = " + newValue);
                                                                         //console.log("---- activate().donor_BillingAddr_ZIP.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP (before) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP);
                                                                         shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP = newValue;
                                                                         //console.log("---- activate().donor_BillingAddr_ZIP.subscribe(): shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP (after) = " + shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP);

                                                                         if (!jQuery.isEmptyObject(newValue))
                                                                         {
                                                                             $("#donor_BillingAddr_ZIP_Entered_Div").removeClass("has-error");
                                                                             $("#donor_BillingAddr_ZIP_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                         }
                                                                     });

                                //--- donor_NameOnCreditCard ----------------------------------------------------------

                                if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_NameOnCreditCard))
                                {
                                    self.donor_NameOnCreditCard(shl.enteredAndSelectedPageValues.donor_NameOnCreditCard);
                                }
                                else
                                {
                                    self.donor_NameOnCreditCard("");
                                }

                                self.donor_NameOnCreditCard.subscribe(function(newValue)
                                                                      {
                                                                          shl.enteredAndSelectedPageValues.donor_NameOnCreditCard = newValue.toUpperCase();
                                                                          //console.log("---- self.donor_NameOnCreditCard.computed(): shl.enteredAndSelectedPageValues.donor_NameOnCreditCard = " + shl.enteredAndSelectedPageValues.donor_NameOnCreditCard);

                                                                          if (!jQuery.isEmptyObject(newValue))
                                                                          {
                                                                              $("#donor_NameOnCreditCard_Entered_Div").removeClass("has-error");
                                                                              $("#donor_NameOnCreditCard_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                          }
                                                                      });

                                //self.donor_NameOnCreditCard = ko.computed({ read: function() 
                                //                                                  {
                                //                                                      if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.donor_NameOnCreditCard))
                                //                                                      {
                                //                                                          return shl.enteredAndSelectedPageValues.donor_NameOnCreditCard;
                                //                                                      }
                                //                                                      else
                                //                                                      {
                                //                                                          //return (ko.utils.unwrapObservable(self.donor_FirstName) == null) ? "" : ko.utils.unwrapObservable(self.donor_FirstName) + " " + (ko.utils.unwrapObservable(self.donor_MiddleName)) ? "" : ko.utils.unwrapObservable(self.donor_MiddleName) + " " + (ko.utils.unwrapObservable(self.donor_LastName)) ? "" : ko.utils.unwrapObservable(self.donor_LastName);
                                //                                                          if (ko.utils.unwrapObservable(self.donor_FirstName) && ko.utils.unwrapObservable(self.donor_MiddleName) && ko.utils.unwrapObservable(self.donor_LastName))
                                //                                                          {
                                //                                                              return ko.utils.unwrapObservable(self.donor_FirstName) + " " + ko.utils.unwrapObservable(self.donor_MiddleName) + " " + ko.utils.unwrapObservable(self.donor_LastName);
                                //                                                          }
                                //
                                //                                                          if (ko.utils.unwrapObservable(self.donor_FirstName) && (!ko.utils.unwrapObservable(self.donor_MiddleName)) && ko.utils.unwrapObservable(self.donor_LastName))
                                //                                                          {
                                //                                                              return ko.utils.unwrapObservable(self.donor_FirstName) + " " + ko.utils.unwrapObservable(self.donor_LastName);
                                //                                                          }
                                //
                                //                                                          return "";
                                //                                                      }
                                //                                                  },
                                //                                            write: function(newValue) 
                                //                                                   {
                                //                                                       shl.enteredAndSelectedPageValues.donor_NameOnCreditCard = newValue.toUpperCase();
                                //                                                       console.log("---- self.donor_NameOnCreditCard.computed(): shl.enteredAndSelectedPageValues.donor_NameOnCreditCard = " + shl.enteredAndSelectedPageValues.donor_NameOnCreditCard);
                                //
                                //                                                       if (!jQuery.isEmptyObject(newValue))
                                //                                                       {
                                //                                                           $("#donor_NameOnCreditCard_Entered_Div").removeClass("has-error");
                                //                                                           $("#donor_NameOnCreditCard_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                //                                                       }
                                //                                                   },
                                //                                            owner: self
                                //                                         }).extend({ notify: 'always' });

                                //-------------------------------------------------------------------------------------

                                app.on('appNavigationRequest:event').then(function(message) 
                                                                          {
                                                                              // The "message" contains full name of module (like "viewmodels/donation_info") 
                                                                              // WHERE the App would  like to be navigated.
                                
                                                                              //console.log("---- Module: donor_info, appNavigationRequest:event handler(): Received message via Event: " + message);
                                                                              //self.receivedEventMessages.push(message);
                                
                                                                              if (message.indexOf("viewmodels/checkout_with_stripe") > -1) //Request to navigate to donor_info
                                                                              {
                                                                                  if (self.validateDonorInfoPage())
                                                                                  {
                                                                                      app.trigger('appNavigationPermission:event', JSON.stringify({ CurrentPage: 'donor_info', DestinationPage: message, StatusOfCurrentPage: 'donor_info_VALIDATED' })); // To the previous page navigation is always available
                                                                                  }
                                                                                  else
                                                                                  {
                                                                                      app.trigger('appNavigationPermission:event', JSON.stringify({ CurrentPage: 'donor_info', DestinationPage: message, StatusOfCurrentPage: 'donor_info_VALIDATION_FAILED' }));
                                                                                  }
                                                                              }
                                                                              else
                                                                              {
                                                                                  app.trigger('appNavigationPermission:event', JSON.stringify({ CurrentPage: 'donor_info', DestinationPage: message, StatusOfCurrentPage: 'donor_info_VALIDATED' })); // To the previous page navigation is always available
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
                          
                              delete copy.donor_MailingAddr_FilteredListOfCountries;
                              delete copy.donor_MailingAddr_ListOfRegions;
                              delete copy.donor_BillingAddr_ListOfCountries;
                              delete copy.donor_BillingAddr_ListOfRegions;
                              delete copy.billingAddr_FilteredListOfRegions;
                              delete copy.listOfODSParameters;
                              delete copy.donor_MailingAddr_ListOfCountries;
                              delete copy.donor_MailingAddr_filters;
                              delete copy.donor_BillingAddr_filters;
                              delete copy.CountryMailingListOfFilteredRecords_ForDesc;
                              delete copy.CountryBillingListOfFilteredRecords_ForDesc;
                              delete copy.MailingRegionListOfFilteredRecords_ForDesc;
                              delete copy.BillingRegionListOfFilteredRecords_ForDesc;
                              delete copy.mailingAddr_FilteredListOfRegions;
                              delete copy.donor_BillingAddr_FilteredListOfCountries;
                              //delete copy.billingAddr_FilteredListOfRegions;

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

    return vm;

});
