define(function (require) 
       {
         var router = require('plugins/router');
         var ko = require('knockout');
         var app = require('durandal/app');

         var serverDataSuppliesLocal = [];

         var enteredAndSelectedPageValues = { /* Shell: */
                                              
                                              "set_sbcPageNavigationMenuButton_background_Active": "sbcPageNavigationMenuButton_background_Active",
                                              "set_sbcPageNavigationMenuButton_background_inActive": "sbcPageNavigationMenuButton_background_inActive",
                                              "set_sbcPageNavigationMenuButton_borderColor_Active": "sbcPageNavigationMenuButton_borderColor_Active",
                                              "set_sbcPageNavigationMenuButton_borderColor_inActive": "sbcPageNavigationMenuButton_borderColor_inActive",
                                              "set_sbcPageNavigationMenuButton_labelColor_Active": "sbcPageNavigationMenuButton_labelColor_Active",
                                              "set_sbcPageNavigationMenuButton_labelColor_inActive": "sbcPageNavigationMenuButton_labelColor_inActive",
                                              "set_sbcPageNavigationMenuButton_fontWeight_Active": "sbcPageNavigationMenuButton_fontWeight_Active",
                                              "set_sbcPageNavigationMenuButton_fontWeight_inActive": "sbcPageNavigationMenuButton_fontWeight_inActive",

                                              /*donation_info_page:*/ 

                                              "defaultDesignation_one": "",
                                              "selectedDesignation_one": "",
                                              "selectedDesignation_one_Desc": "",
                                              "selectedDesignation_one_Campaign": "",
                                              "donation_amount_to_desg_one": "",
                                              "isSpecialDesgInputVisible_one": false,
                                              "other_1st_desg_description": "",
                                              "defaultDesignation_two": "",
                                              "selectedDesignation_two": "",
                                              "selectedDesignation_two_Desc": "",
                                              "selectedDesignation_two_Campaign": "",
                                              "donation_amount_to_desg_two": "",
                                              "isOtherDesgDivVisible_two": false,
                                              "isSpecialDesgInputVisible_two": false,
                                              "other_2nd_desg_description": "",
                                              "defaultDesignation_three": "",
                                              "selectedDesignation_three": "",
                                              "selectedDesignation_three_Desc": "",
                                              "selectedDesignation_three_Campaign": "",
                                              "donation_amount_to_desg_three": "",
                                              "isOtherDesgDivVisible_three": false,
                                              "isSpecialDesgInputVisible_three": false,
                                              "other_3rd_desg_description": "",
                                              "totalDonationAmount_inCents": "",
                                              "isDonateToOtherDesgButtonVisible": "",
                                              "selectedReasonToDonate": "",
                                              "reasonToDonateEnvelopCode": "",
                                              "isThisPledgePayment": false,
                                              "isThisGiftAnonymous": false,
                                              "giftComments": "",
                                              "radioSelectedOptionValue": "in_memory_honor_NONE",
                                              "showTributeInfo": false,
                                              "tributeFirstName": "",
                                              "tributeLastName": "",
                                              "tributeRelationToDonor": "",
                                              "mailLetterOnDonorBehalf": false,
                                              "mailBehalf_PersonToNotify": "",
                                              "mailBehalf_EMail": "",
                                              "mailBehalf_AddressLine_1": "",
                                              "mailBehalf_AddressLine_2": "",
                                              "mailBehalf_City": "",
                                              "mailBehalf_ZIP": "",
                                              "mailBehalf_RegionSelected": "",
                                              "mailBehalf_RegionSelected_Desc": "",
                                              "mailBehalf_CountrySelected": "",
                                              "mailBehalf_CountrySelected_Desc": "",
                                              "makeSoftCreditToSomeone": "",
                                              "softCredit_PersonFirstName": "",
                                              "softCredit_PersonLastName": "",
                                              /*"softCredit_PersonAffilation": "",*/

                                              /*donor_info_page:*/

                                              "donor_NamePrefix": "",
                                              "donor_FirstName": "",
                                              "donor_MiddleName": "",
                                              "donor_LastName": "",
                                              "donor_NameSuffix": "",
                                              "donor_EMail": "",
                                              "radioSelectedOptionValue_PhoneType": "phoneIsDomestic",
                                              "showDomesticPhoneRelatedInputs": true,
                                              "donor_DomesticPhone": "",
                                              "showInternationalPhoneRelatedInputs": false,
                                              "donor_PhoneInrlAccessCode": "",
                                              "donor_InternationalPhone": "",
                                              "donor_SBCAff_Alumnae": false,
                                              "donor_SBCAff_Parent": false,
                                              "donor_SBCAff_FactStaff": false,
                                              "donor_SBCAff_Student": false,
                                              "donor_SBCAff_Friend": false,
                                              "affilationToSBC_OtherThanFriend_isActive": true,
                                              "affilationToSBC_Friend_isActive": true,
                                              "radioSelectedOptionValue_JuniorYearAbroad": "JuniorYearAbroad_No",
                                              "showJuniorYearAbroadRelatedInputs": false,
                                              "donor_SBCID": "",
                                              "donor_SBCAff_AlumnaeClass": "",
                                              "radioJuniorYearAbroadProgram": "inFrance",
                                              "showJuniorYearAbroadYearInput": false,
                                              "JuniorYearAbroadYearValue": "",
                                              "showJuniorYearAbroadProgramInOther_DescInput": false,
                                              "JuniorYearAbroadProgramInOther_Description": "",
                                              "radioSelectedOptionValue_MailingAddrType": "mailingAddrIsDomestic",
                                              "showMailingAddrCountrySelector": false,
                                              "donor_MailingAddr_CountrySelected": "",
                                              "donor_MailingAddr_CountrySelected_Desc": "",
                                              "donor_MailingAddr_Line_1": "",
                                              "donor_MailingAddr_Line_2": "",
                                              "donor_MailingAddr_Line_3": "",
                                              "donor_MailingAddr_City": "",
                                              "donor_MailingAddr_RegionSelected": "",
                                              "donor_MailingAddr_RegionSelected_Desc": "",
                                              "donor_MailingAddr_IntrlRegion": "",
                                              "show_Donor_MailingAddr_DomesticRegionFields": true,
                                              "show_Donor_MailingAddr_IntrlRegionFields": false,
                                              "donor_MailingAddr_ZIP": "",
                                              "radioSelectedOptionValue_BillingAddrType": "billingAddrIsDomestic",
                                              "radioSelectedOptionValue_MailingAddrTypeDomestic": true,
                                              "radioSelectedOptionValue_BillingAddrTypeDomestic": true,
                                              "showBillingAddrCountrySelector": false,
                                              "donor_BillingAddr_CountrySelected": "",
                                              "donor_BillingAddr_CountrySelected_Desc": "",
                                              "donor_BillingAddr_Line_1": "",
                                              "donor_BillingAddr_Line_2": "",
                                              "donor_BillingAddr_Line_3": "",
                                              "donor_BillingAddr_City": "",
                                              "donor_BillingAddr_RegionSelected": "",
                                              "donor_BillingAddr_RegionSelected_Desc": "",
                                              "donor_BillingAddr_IntrlRegion": "",
                                              "show_Donor_BillingAddr_DomesticRegionFields": true,
                                              "show_Donor_BillingAddr_IntrlRegionFields": false,
                                              "donor_BillingAddr_ZIP": "",
                                              "donor_NameOnCreditCard": "",
                                              "donor_BillingAddressIsTheSameAsMailing": true,
                                              "showBillingAddressFields": false,

                                              /* checkout_page: */

                                              "showTransactionProcessingResults": false,
                                              "transactionTokenIdReceived": "",
                                              "checkoutResultMessagePlaceHolder": "Transaction in progress, please wait...",
                                              "checkoutIsDone": false,
                                              "CheckoutPage_VisibleGoToPreviousPageButton": true,
                                              "CheckoutPage_TypeOfPaymentButtons_Enabled": true,
                                              "RecurringPayments_SelectedRecurringInterval": "",
                                              "RecurringPayments_StatementDescriptor": 'Online Donation /Auto/', /* Standard parenthis () are not permitted in this string */
                                              "RecurringPayments_Duration": "",
                                              "RecurringPayments_DayOfPayment": "1",
                                              "RecurringPayments_SkipFirstMonth": false,
                                              "RecurringPayments_SkipFirstMonth_Visible": false,
                                              "RecurringPayments_Verdict": "",
                                              "RecurringPayments_DateOfFirstCharge": "", /* MM/DD/YYYY */
                                              "RecurringPayments_DateOfNextCharge": "", /* MM/DD/YYYY */
                                              "DonationPaymentMode": "", /* Empty, 'InstantPayment','RecurringPayments' */
             
                                              /* Overall application variables */

                                              "TestDebugMode": true,
                                              "ServerChargeResultMessageOriginal": "",
                                              "ChargeResultMessageForUser": "",
                                              "OverallAppErrorMessageForUser": "",
                                              "OverallAppErrorMessageForDeveloper": "",
                                              "WebClientAppTerminatedDueToErrors": false,
                                              "DeviceScreenRealWidth": "",
                                              "DeviceScreenRealHeight": "",
                                              "StyleClassNameForHighlightingPartOfTextArea": "highlight-part-of-text", /* http://www.knockmeout.net/2011/06/fun-with-highlighting-in-knockoutjs.html */
                                              "requireUserCredentials": true
                                            };

         enteredAndSelectedPageValues.DeviceScreenRealWidth = $(window).width();
         enteredAndSelectedPageValues.DeviceScreenRealHeight = $(window).height();

         //console.log("---- shell.js: enteredAndSelectedPageValues.DeviceScreenRealWidth = " + enteredAndSelectedPageValues.DeviceScreenRealWidth);
         //console.log("---- shell.js: enteredAndSelectedPageValues.DeviceScreenRealHeight = " + enteredAndSelectedPageValues.DeviceScreenRealHeight);

         // See http://stackoverflow.com/questions/10958869/jquery-get-css-properties-values-for-a-not-yet-applied-class
         self.getCSS2 = function (prop, fromClass, $sibling) 
                        {
                            //console.log("---- Module: shell, getCSS2() 0");
                            var $inspector = $("<div>").css('display', 'none').addClass(fromClass);

                            if($sibling != null)
                            {
                            //console.log("---- Module: shell, getCSS2() 1");
                                $sibling.after($inspector); //append after sibling in order to have exact 
                            } 
                            else 
                            {
                            //console.log("---- Module: shell, getCSS2() 2");
                                $("body").append($inspector); // add to DOM, in order to read the CSS property
                            }
                            try 
                            {
                            //console.log("---- Module: shell, getCSS2() 3: " + $inspector.css(prop));
                                return $inspector.css(prop);
                            } 
                            finally 
                            {
                            //console.log("---- Module: shell, getCSS2() 4");
                                $inspector.remove(); // and remove from DOM
                            }
                        };

         self.publishAppNavigationRequest = function(_event)
                                            {
                                                //console.log("---- Module: shell.js, publishAppNavigationRequest(): _event.moduleId = " + _event.moduleId + " _event.hash = " + _event.hash);
                                                //console.log("---- Module: shell.js, publishAppNavigationRequest(): router.navigationModel()[0].isActive() = " + router.navigationModel()[0].isActive());
                                                //console.log("---- Module: shell.js, publishAppNavigationRequest(): router.navigationModel()[1].isActive() = " + router.navigationModel()[1].isActive());
                                                //console.log("---- Module: shell.js, publishAppNavigationRequest(): router.navigationModel()[2].isActive() = " + router.navigationModel()[2].isActive());

                                                //console.log("---- Module: shell.js, publishAppNavigationRequest():" + getCSS2('background','sbc-button'));

                                                app.trigger('appNavigationRequest:event', _event.moduleId); //http://stackoverflow.com/questions/17782145/durandal-knockout-update-other-view-viewmodel

                                                //if (router.navigationModel()[0].isActive()) // router.navigationModel()[0] -> "donation_info". This is equivalent of navigationObject.CurrentPage value (what page we are going to leave)
                                                //{
                                                //    if (_event.moduleId == "viewmodels/donation_info")
                                                //    {
                                                //        null;
                                                //    }
                                                //    else if (_event.moduleId == "viewmodels/donor_info")
                                                //    {
                                                //        router.navigate('#donor_info'); //, { replace: true, trigger: false });
                                                //    }
                                                //    else if (_event.moduleId == "viewmodels/checkout_with_stripe")
                                                //    {
                                                //        null; //router.navigate('#checkout_with_stripe'); //, { replace: true, trigger: false });
                                                //    }
                                                //}
                                                //else if (router.navigationModel()[1].isActive()) // router.navigationModel()[1] -> "donor_info". This is equivalent of navigationObject.CurrentPage value (what page we are going to leave)
                                                //{
                                                //    if (_event.moduleId == "viewmodels/donation_info")
                                                //    {
                                                //        router.navigate('#'); //, { replace: true, trigger: true });
                                                //    }
                                                //    else if (_event.moduleId == "viewmodels/donor_info")
                                                //    {
                                                //        null;
                                                //    }
                                                //    else if (_event.moduleId == "viewmodels/checkout_with_stripe")
                                                //    {
                                                //        router.navigate('#checkout_with_stripe'); //, { replace: true, trigger: false });
                                                //    }
                                                //}
                                                //else if (router.navigationModel()[2].isActive()) // router.navigationModel()[2] -> "checkout_with_stripe". This is equivalent of navigationObject.CurrentPage value (what page we are going to leave)
                                                //{
                                                //    if (_event.moduleId == "viewmodels/donation_info")
                                                //    {
                                                //        router.navigate('#'); //, { replace: true, trigger: true });
                                                //    }
                                                //    else if (_event.moduleId == "viewmodels/donor_info")
                                                //    {
                                                //        router.navigate('#donor_info'); //, { replace: true, trigger: false });
                                                //    }
                                                //    else if (_event.moduleId == "viewmodels/checkout_with_stripe")
                                                //    {
                                                //        null;
                                                //    }
                                                //}

                                                return true;
                                            };

         self.receivedEventMessages = ko.observableArray([]);

         // Intercepting of any navigation events in the application. Redirecting from / to first route in route.map
         // See http://stackoverflow.com/questions/17089694/how-to-handle-ignore-a-bad-route-with-durandal/17090558#17090558
         router.guardRoute = function(routeInfo, params, instance)
                             {
                                 //console.log("---- shell,router,guardRoute(): routeInfo:");
                                 //console.log(routeInfo);
                                 //console.log("---- shell,router,guardRoute(): params:");
                                 //console.log(params);
                                 //console.log("---- shell,router,guardRoute(): instance:");
                                 //console.log(instance);
                                 //console.log("---- shell,router,guardRoute(): enteredAndSelectedPageValues.checkoutIsDone = " + enteredAndSelectedPageValues.checkoutIsDone); 

                                 //if (params.fragment === '')
                                 //{
                                 //    return routeInfo.router.routes[0].hash;
                                 //}

                                 if (enteredAndSelectedPageValues.checkoutIsDone)
                                 {
                                     return false;
                                 }
                                 else
                                 {
                                     app.trigger('appClearCheckoutMessage:event');
                                     return true;
                                 }
                             };

         return { router: router,
                  receivedEventMessages: receivedEventMessages,
                  absorbEnter: function(data, event) 
                               {
                                   return event.keyCode !== 13;  
                               },
                  test: function() 
                        {
                            console.log("---- Shell.js,test(),Lc.10: submitting", arguments);        
                        },
                  
                  requireUserCredentials: ko.observable(),
                  sbc_affilated_existing_person_pidm: ko.observable(),
                  sbc_affilated_existing_person_full_name: ko.observable(),
                  user_name: ko.observable(),
                  user_password: ko.observable(),
                  sbc_affilated_existing_person_greetings: ko.observable(),
                  
                  activate: function () 
                            {
                                var self = this;
                                //console.log("---- Module: shell, activate(): css.sbc-button = " + getCSS2('background','sbc-button'));

                                app.on('appNavigationPermission:event').then(function(message) 
                                                                             {
                                                                                 //console.log("!!!! Module: shell.js, appNavigationPermission:event handler(): message: = >" + message + "<");
                                                                                 //console.log("!!!! Module: shell.js: router.navigationModel()[0].isActive() = " + router.navigationModel()[0].isActive());
                                                                                 //console.log("!!!! Module: shell.js: router.navigationModel()[1].isActive() = " + router.navigationModel()[1].isActive());
                                                                                 //console.log("!!!! Module: shell.js: router.navigationModel()[2].isActive() = " + router.navigationModel()[2].isActive());

                                                                                 navigationObject = JSON.parse(message);

                                                                                 //console.log("---- Module: shell.js router.navigationModel()[0].hash = " + router.navigationModel()[0].hash);

                                                                                 //self.receivedEventMessages.push(message);

                                                                                 // router.navigationModel()[0] -> "donation_info"
                                                                                 // router.navigationModel()[1] -> "donor_info"
                                                                                 // router.navigationModel()[2] -> "checkout_with_stripe"

                                                                                 if (router.navigationModel()[0].isActive() && navigationObject.StatusOfCurrentPage == 'donation_info_VALIDATED') // router.navigationModel()[0] -> "donation_info". This is equivalent of navigationObject.CurrentPage value (what page we are going to leave)
                                                                                 {
                                                                                     if (navigationObject.DestinationPage == "viewmodels/donation_info")
                                                                                     {
                                                                                         null;
                                                                                     }
                                                                                     else if (navigationObject.DestinationPage == "viewmodels/donor_info")
                                                                                     {
                                                                                         router.navigate('#donor_info'); //, { replace: true, trigger: false });
                                                                                     }
                                                                                     else if (navigationObject.DestinationPage == "viewmodels/checkout_with_stripe")
                                                                                     {
                                                                                         null; //router.navigate('#checkout_with_stripe'); //, { replace: true, trigger: false });
                                                                                     }
                                                                                 }
                                                                                 else if (router.navigationModel()[1].isActive() && navigationObject.StatusOfCurrentPage == 'donor_info_VALIDATED') // router.navigationModel()[1] -> "donor_info". This is equivalent of navigationObject.CurrentPage value (what page we are going to leave)
                                                                                 {
                                                                                     if (navigationObject.DestinationPage == "viewmodels/donation_info")
                                                                                     {
                                                                                         router.navigate('#'); //, { replace: true, trigger: true });
                                                                                     }
                                                                                     else if (navigationObject.DestinationPage == "viewmodels/donor_info")
                                                                                     {
                                                                                         null;
                                                                                     }
                                                                                     else if (navigationObject.DestinationPage == "viewmodels/checkout_with_stripe")
                                                                                     {
                                                                                         router.navigate('#checkout_with_stripe'); //, { replace: true, trigger: false });
                                                                                     }
                                                                                 }
                                                                                 else if (router.navigationModel()[2].isActive() && navigationObject.StatusOfCurrentPage == 'checkout_with_stripe_VALIDATED') // router.navigationModel()[2] -> "checkout_with_stripe". This is equivalent of navigationObject.CurrentPage value (what page we are going to leave)
                                                                                 {
                                                                                     if (navigationObject.DestinationPage == "viewmodels/donation_info")
                                                                                     {
                                                                                         router.navigate('#'); //, { replace: true, trigger: true });
                                                                                     }
                                                                                     else if (navigationObject.DestinationPage == "viewmodels/donor_info")
                                                                                     {
                                                                                         router.navigate('#donor_info'); //, { replace: true, trigger: false });
                                                                                     }
                                                                                     else if (navigationObject.DestinationPage == "viewmodels/checkout_with_stripe")
                                                                                     {
                                                                                         null;
                                                                                     }
                                                                                 }
                                                                             }, self);

                                //// --- set_sbcPageNavigationMenuButton_background_Active/inActive ----------------------------------
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_background_Active))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_background_Active("sbcPageNavigationMenuButton_background_Active");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_background_Active = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_background_Active);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_background_Active(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_background_Active);
                                //}
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_background_inActive))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_background_inActive("sbcPageNavigationMenuButton_background_inActive");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_background_inActive = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_background_inActive);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_background_inActive(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_background_inActive);
                                //}
                                //
                                ////--- set_sbcPageNavigationMenuButton_borderColor_Active/inActive ------------------------------
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_borderColor_Active))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_borderColor_Active("sbcPageNavigationMenuButton_borderColor_Active");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_borderColor_Active = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_borderColor_Active);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_borderColor_Active(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_borderColor_Active);
                                //}
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_borderColor_inActive))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_borderColor_inActive("sbcPageNavigationMenuButton_borderColor_inActive");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_borderColor_inActive = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_borderColor_inActive);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_borderColor_inActive(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_borderColor_inActive);
                                //}
                                //
                                ////--- set_sbcPageNavigationMenuButton_labelColor_Active/inActive --------------------------------
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_labelColor_Active))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_labelColor_Active("sbcPageNavigationMenuButton_labelColor_Active");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_labelColor_Active = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_labelColor_Active);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_labelColor_Active(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_labelColor_Active);
                                //}
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_labelColor_inActive))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_labelColor_inActive("sbcPageNavigationMenuButton_labelColor_inActive");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_labelColor_inActive = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_labelColor_inActive);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_labelColor_inActive(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_labelColor_inActive);
                                //}
                                //
                                ////--- set_sbcPageNavigationMenuButton_fontWeight_Active/inActive ----------------------------------
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_fontWeight_Active))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_fontWeight_Active("sbcPageNavigationMenuButton_fontWeight_Active");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_fontWeight_Active = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_fontWeight_Active);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_fontWeight_Active(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_fontWeight_Active);
                                //}
                                //
                                //if (jQuery.isEmptyObject(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_fontWeight_inActive))
                                //{
                                //    self.set_sbcPageNavigationMenuButton_fontWeight_inActive("sbcPageNavigationMenuButton_fontWeight_inActive");
                                //    enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_fontWeight_inActive = ko.utils.unwrapObservable(self.set_sbcPageNavigationMenuButton_fontWeight_inActive);
                                //}
                                //else
                                //{
                                //    self.set_sbcPageNavigationMenuButton_fontWeight_inActive(enteredAndSelectedPageValues.set_sbcPageNavigationMenuButton_fontWeight_inActive);
                                //}
                                
                                //-------------------------------------------------------------------------------------
                                
                                self.requireUserCredentials(enteredAndSelectedPageValues.requireUserCredentials);
                                
                                self.sbc_affilated_existing_person_greetings = ko.computed(function()
                                                                                           {
                                                                                               var greetings = "";
                                                                                               console.log("---- Module: main-ods-selector.js, vm.sbc_affilated_existing_person_greetings.computed(): sbc_affilated_existing_person_full_name = " + ko.utils.unwrapObservable(self.sbc_affilated_existing_person_full_name));

                                                                                               greetings = (!self.sbc_affilated_existing_person_full_name()) ? "Hello, Friend! Click here to Sign Out" : "Welcome, " + self.sbc_affilated_existing_person_full_name() + "!" + " Click here to Sign Out";
                                                                                               return greetings;
                                                                                           });
                                self.checkUserCredentials = function()
                                                            {
                                                                console.log("---- Module: main-ods-selector.js, vm.checkUserCredentials(): Started!");
                                                                console.log("---- Module: main-ods-selector.js, vm.checkUserCredentials(): user_name = " + ko.utils.unwrapObservable(self.user_name) + " user_password = " + ko.utils.unwrapObservable(self.user_password));

                                                                // Check entered credentials with SBC user database

                                                                if (!(ko.utils.unwrapObservable(self.user_name) == null && ko.utils.unwrapObservable(self.user_password) == null))
                                                                {
                                                                    self.sbc_affilated_existing_person_full_name("Sarah Connor");
                                                                    self.sbc_affilated_existing_person_pidm("12345");
                                                                }
                                                                else
                                                                {
                                                                    self.sbc_affilated_existing_person_full_name(null);
                                                                    self.sbc_affilated_existing_person_pidm(null);
                                                                }
                                                            }

                                self.signOut = function()
                                               {
                                                   console.log("---- Module: main-ods-selector.js, vm.signOut(): Started!");

                                                   self.sbc_affilated_existing_person_full_name("");
                                                   self.sbc_affilated_existing_person_pidm("");

                                                   self.user_name("");
                                                   self.user_password("");
                                               }

                                //-------------------------------------------------------------------------------------
                 
                                router.map([ { route: '', title:'1.Donation Info', moduleId: 'viewmodels/donation_info', nav: true },
                                             { route:'donor_info', title:'2.Donor Info', moduleId:'viewmodels/donor_info', nav: true },
                                             { route:'checkout_with_stripe', title:'3.Checkout', moduleId:'viewmodels/checkout_with_stripe', nav: true }
                                          ]).buildNavigationModel();
                          
                                return  $.when(getServerDataSuppliesService.getServerDataSupplies())
                                         .then(function(results)
                                               {
                                                   //self.serverDataSuppliesLocal(results.serverDataSupplies);
                                                   console.log("---- shell: (3)");
                                                   console.log(results.serverDataSupplies);
                                                   console.log("---- shell: (3)");
                                                   self.serverDataSuppliesLocal = results.serverDataSupplies;
                                                   return router.activate();
                                               })

                                //return router.activate();
                            },

                  //serverDataSuppliesLocal: ko.observableArray([]),
                  serverDataSuppliesLocal: serverDataSuppliesLocal,
                  enteredAndSelectedPageValues: enteredAndSelectedPageValues,
                  getServerDataSuppliesLocal: function()
                                              {
                                                  var that = this;
                                                  console.log("---- shell: (2)");
                                                  console.log(that.serverDataSuppliesLocal);
                                                  console.log("---- shell: (2)");
                                                  return that.serverDataSuppliesLocal;
                                              }
             };
       });

//  define(['bindings'], function (bindings) {
//            console.log("---- Shell.js");
//});

