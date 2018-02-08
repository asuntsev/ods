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

                 //--------------------------------------------------------------------------------------------------------

                 // The _mode_requested values allowed:
                 // 'CCChargeOnServerSucceed'
                 // 'CCChargeOnServerFailed'
                 // 'CCChargeOnServerErrorOccured'
                 // 'InstantOneTimeDonationWindowClosed'
                 // 'RecurringPaymentsSetupWindowCanceled'
                 // 'printConfirmationMessageSucceed'
                 // 'printConfirmationMessageFailed'
                 // 'printConfirmationMessageOnServerErrorOccured'
                 // 'ApplicationInternalError'
                 
                 self.setupUserMessageAndNavigationConditions = function(_mode_requested, _ServerSuccessMessageOriginal, _ServerErrorMessageOriginal)
                                                                {
                                                                    //console.log("---- Module: checkout_with_stripe, setupUserMessageAndNavigationConditions(),Lc.00: Function.caller = " + "\n" + Function.caller);
                                                                    
                                                                    if (_mode_requested === 'CCChargeOnServerSucceed' || _mode_requested === 'InstantOneTimeDonationWindowClosed_ButStripeTokenReceived')
                                                                    {
                                                                        //OK!
                                                                        $("#displayCheckoutResultTextArea_ParentDiv").removeClass("has-error");
                                                                        
                                                                        if (_mode_requested === 'CCChargeOnServerSucceed') // But not _mode_requested === 'InstantOneTimeDonationWindowClosed_ButStripeTokenReceived'
                                                                        {
                                                                            self.isDisplayCheckoutResultTextAreaFocus(true);
                                                                            self.showTransactionProcessingResults(true);
                                                                            self.print_ConfirmationMessage_ButtonVisible(true);
                                                                            self.print_ConfirmationMessage_ButtonEnable(true);
                                                                            self.messageFontColor('green');
                                                                            self.finalActivityButtonsEnable(true);
                                                                            self.CheckoutPage_VisibleGoToPreviousPageButton(false);
                                                                            self.CheckoutPage_TypeOfPaymentButtons_Enabled(false);
                                                                            
                                                                            shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal = _ServerSuccessMessageOriginal;
                                                                            console.log("---- Module: checkout_with_stripe, setupUserMessageAndNavigationConditions(),Lc.10: " + "\n" + shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal);
                                                                            
                                                                            var SuccessfulChargeResultMessageForUser = "";

                                                                            if (shl.enteredAndSelectedPageValues.DonationPaymentMode == 'InstantPayment')
                                                                            {
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + "Congratulations!" + "\n" + 
                                                                                                                                                              "\n" + 
                                                                                                                                                              _ServerSuccessMessageOriginal + "\n" + /*"Your payment processed successfully." + "\n" +  */
                                                                                                                                                              "The transaction Confirmation message will be sent soon to \"" + shl.enteredAndSelectedPageValues.donor_EMail + "\" E-Mail address." + "\n" + 
                                                                                                                                                              "Please, pay attention that the Confirmation message IS NOT your official receipt issued by the College." + "\n" + 
                                                                                                                                                              "The official receipt will be sent to \"" + shl.enteredAndSelectedPageValues.donor_EMail + "\" E-Mail address and its hard copy will be sent" + "\n";
                                                                                                                                                              "to your " + ((shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing) ? "Mailing" : "Billing") + " address (see below) within 2 business days." + "\n" +
                                                                                                                                                              "\n";
                                                                            }
                                                                            else // I.e. shl.enteredAndSelectedPageValues.DonationPaymentMode == 'RecurringPayments'
                                                                            {
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + "Congratulations!" + "\n" + 
                                                                                                                                                              "\n" + 
                                                                                                                                                              _ServerSuccessMessageOriginal + "\n" + /*"You successfully setup a schedule of recurring donations (Subscription)." + "\n" + */
                                                                                                                                                              "Here is a summary of your Subscription:" + "\n" +
                                                                                                                                                              "\n" +    
                                                                                                                                                              shl.enteredAndSelectedPageValues.RecurringPayments_Verdict + "\n" +        
                                                                                                                                                              "\n" +    
                                                                                                                                                              "A confirmation message will be sent soon to \"" + shl.enteredAndSelectedPageValues.donor_EMail + "\" E-Mail address." + "\n" +
                                                                                                                                                              "Please, pay attention that the Confirmation message IS NOT your official receipt issued by the College." + "\n" + 
                                                                                                                                                              "The official receipt will be sent to \"" + shl.enteredAndSelectedPageValues.donor_EMail + "\" E-Mail address and its hard copy will be sent" + "\n";
                                                                                                                                                              "to your " + ((shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing) ? "Mailing" : "Billing") + " address (see below) within 2 business days." + "\n" + 
                                                                                                                                                              "Also, every time your Bank Account is charged for next recurring payment, you will be receiving detailed receipt on \"" + shl.enteredAndSelectedPageValues.donor_EMail + "\" E-Mail address" + "\n" +
                                                                                                                                                              "\n";
                                                                            }

                                                                            if (shl.enteredAndSelectedPageValues.donor_BillingAddressIsTheSameAsMailing)
                                                                            {
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_NamePrefix + " " + shl.enteredAndSelectedPageValues.donor_FirstName + " " + shl.enteredAndSelectedPageValues.donor_MiddleName + " " + shl.enteredAndSelectedPageValues.donor_LastName + " " + shl.enteredAndSelectedPageValues.donor_NameSuffix + "\n";
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1 + ", " + shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2 + "\n";
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_MailingAddr_City + ", " + shl.enteredAndSelectedPageValues.donor_MailingAddr_RegionSelected_Desc + " " + shl.enteredAndSelectedPageValues.donor_MailingAddr_IntrlRegion + " " + shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP + "\n";
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_MailingAddr_CountrySelected_Desc + "\n";
                                                                            }
                                                                            else
                                                                            {
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_NamePrefix + " " + shl.enteredAndSelectedPageValues.donor_FirstName + " " + shl.enteredAndSelectedPageValues.donor_MiddleName + " " + shl.enteredAndSelectedPageValues.donor_LastName + " " + shl.enteredAndSelectedPageValues.donor_NameSuffix + "\n";
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_1 + ", " + shl.enteredAndSelectedPageValues.donor_BillingAddr_Line_2 + "\n";
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_BillingAddr_City + ", " + shl.enteredAndSelectedPageValues.donor_BillingAddr_RegionSelected_Desc + " " + shl.enteredAndSelectedPageValues.donor_BillingAddr_IntrlRegion + " " + shl.enteredAndSelectedPageValues.donor_BillingAddr_ZIP + "\n";
                                                                                SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + shl.enteredAndSelectedPageValues.donor_BillingAddr_CountrySelected_Desc + "\n";
                                                                            }

                                                                            SuccessfulChargeResultMessageForUser = SuccessfulChargeResultMessageForUser + "\n" + "Thank you for your Gift!";

                                                                            shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = SuccessfulChargeResultMessageForUser;
                                                                            self.checkoutResultMessage(SuccessfulChargeResultMessageForUser);
                                                                            
                                                                            shl.enteredAndSelectedPageValues.checkoutIsDone = true;
                                                                            self.CheckoutPage_VisibleGoToPreviousPageButton(false);
                                                                        }
                                                                    }
                                                                    else if (_mode_requested === 'CCChargeOnServerFailed' || _mode_requested === 'CCChargeOnServerErrorOccured')
                                                                    {
                                                                        //FAILED
                                                                        $("#displayCheckoutResultTextArea_ParentDiv").addClass("has-error");
                                                                        self.isDisplayCheckoutResultTextAreaFocus(true);
                                                                        self.showTransactionProcessingResults(true);
                                                                        self.messageFontColor('red');
                                                                        self.finalActivityButtonsEnable(true);
                                                                        self.print_ConfirmationMessage_ButtonVisible(false);
                                                                        self.print_ConfirmationMessage_ButtonEnable(false);
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                        self.CheckoutPage_TypeOfPaymentButtons_Enabled(false);
                                                                        
                                                                        shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal = _ServerErrorMessageOriginal;
                                                                        console.log("---- Module: checkout_with_stripe, setupUserMessageAndNavigationConditions(),Lc.20: " + "\n" + shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal);
                                                                                                    
                                                                        var ErrorChargeResultMessageForUser = "We are really sorry, but your transaction has not been completed properly" + "\n" + 
                                                                                                              "Please, contact with system administrator either by phone (434)381-6231 or via E-Mail giving@gmail.edu";
                                                                        shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = ErrorChargeResultMessageForUser;
                                                                        self.checkoutResultMessage(ErrorChargeResultMessageForUser);
                                                                        
                                                                        shl.enteredAndSelectedPageValues.checkoutIsDone = false;
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                    }
                                                                    else if (_mode_requested === 'ApplicationInternalError')
                                                                    {
                                                                        // Application error
                                                                        $("#displayCheckoutResultTextArea_ParentDiv").addClass("has-error");
                                                                        self.isDisplayCheckoutResultTextAreaFocus(true);
                                                                        self.showTransactionProcessingResults(true);
                                                                        self.messageFontColor('red');
                                                                        self.finalActivityButtonsEnable(true);
                                                                        self.print_ConfirmationMessage_ButtonVisible(false);
                                                                        self.print_ConfirmationMessage_ButtonEnable(false);
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                        self.CheckoutPage_TypeOfPaymentButtons_Enabled(true);
                                                                        
                                                                        shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal = _ServerErrorMessageOriginal;
                                                                                                                            
                                                                        console.log("---- Module: checkout_with_stripe, setupUserMessageAndNavigationConditions(),Lc.30: " + "\n" + shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal);
                                                                                                    
                                                                        var ErrorChargeResultMessageForUser = "We are really sorry! A system error occurred." + "\n" + 
                                                                                                              "Please, try to restart Online Giving Application by tapping (clicking) on the button below" + "\n" +
                                                                                                              "and redo all steps needed" + "\n" +
                                                                                                              "Also you may contact with system administrator either by phone (434)381-6231 or via E-Mail giving@gmail.edu";
                                                                                                              
                                                                        shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = ErrorChargeResultMessageForUser;
                                                                        self.checkoutResultMessage(ErrorChargeResultMessageForUser);
                                                                        
                                                                        shl.enteredAndSelectedPageValues.checkoutIsDone = false;
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                        
                                                                        shl.enteredAndSelectedPageValues.WebClientAppTerminatedDueToErrors = true;
                                                                    }
                                                                    else if (_mode_requested === 'InstantOneTimeDonationWindowClosed' || _mode_requested === 'RecurringPaymentsSetupWindowCanceled')
                                                                    {
                                                                        //Close OneTimePayment popup window with cross sign:
                                                                        
                                                                        $("#displayCheckoutResultTextArea_ParentDiv").addClass("has-error");
                                                                        self.isDisplayCheckoutResultTextAreaFocus(true);
                                                                        self.showTransactionProcessingResults(true);
                                                                        self.messageFontColor('red');
                                                                        self.finalActivityButtonsEnable(true);
                                                                        self.print_ConfirmationMessage_ButtonVisible(false);
                                                                        self.print_ConfirmationMessage_ButtonEnable(false);
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                        self.CheckoutPage_TypeOfPaymentButtons_Enabled(true);
                                                                        
                                                                        var InfoCheckoutResultMessage = "";

                                                                        if (_mode_requested == 'InstantOneTimeDonationWindowClosed')
                                                                        {
                                                                            InfoCheckoutResultMessage = "Your transaction has been CANCELED." + "\n" + 
                                                                                                        "You might want to choose another way of donation (by buttons above) or" + "\n" +
                                                                                                        "navigate to \"Donation info\" or \"Donor info\" pages, make a changes and repeate Checkout again." + "\n" + 
                                                                                                        "It's a pleasure for us to do business with you";
                                                                        }
                                                                        else if (_mode_requested == 'RecurringPaymentsSetupWindowCanceled')
                                                                        {
                                                                            InfoCheckoutResultMessage = "Setting up a schedule of recurring payments has been CANCELED." + "\n" + 
                                                                                                        "You might want to choose another way of donation (by buttons above) or" + "\n" +
                                                                                                        "navigate to \"Donation info\" or \"Donor info\" pages and then repeate Checkout again." + "\n" + 
                                                                                                        "It's a pleasure for us to do business with you";
                                                                        }
                                                                        //console.log("---- (3) isDisplayCheckoutResultTextAreaFocus = " + ko.utils.unwrapObservable(self.isDisplayCheckoutResultTextAreaFocus));
                                                                        //console.log("---- InfoCheckoutResultMessage = " + InfoCheckoutResultMessage);
                                                                        //console.log("---- isDisplayCheckoutResultTextAreaFocus = " + ko.utils.unwrapObservable(self.isDisplayCheckoutResultTextAreaFocus));
                                                                        //console.log("---- self.showTransactionProcessingResults = " + ko.utils.unwrapObservable(self.showTransactionProcessingResults));
                                                                 
                                                                        shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = InfoCheckoutResultMessage;
                                                                        self.checkoutResultMessage(InfoCheckoutResultMessage);

                                                                        shl.enteredAndSelectedPageValues.DonationPaymentMode = '';
                                                                        shl.enteredAndSelectedPageValues.checkoutIsDone = false;
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                    }
                                                                    else if (_mode_requested === 'printConfirmationMessageSucceed')
                                                                    {
                                                                        null;
                                                                        self.CheckoutPage_TypeOfPaymentButtons_Enabled(false);
                                                                    }
                                                                    else if (_mode_requested === 'printConfirmationMessageFailed' || _mode_requested === 'printConfirmationMessageOnServerErrorOccured')
                                                                    {
                                                                        $("#displayCheckoutResultTextArea_ParentDiv").addClass("has-error");
                                                                        self.isDisplayCheckoutResultTextAreaFocus(true);
                                                                        self.showTransactionProcessingResults(true);
                                                                        self.messageFontColor('red');
                                                                        self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                                                        self.CheckoutPage_TypeOfPaymentButtons_Enabled(false);
                                                                        
                                                                        shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal = _ServerErrorMessageOriginal;
                                                                        console.log("---- Module: checkout_with_stripe, setupUserMessageAndNavigationConditions(),Lc.40: " + "\n" + shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal);
                                                                    
                                                                        var ErrorChargeResultMessageForUser = "We are really sorry, but due to our server internal problem your confirmation message can not be printed." + "\n" + 
                                                                                                              "Please, contact to system administrator either by phone (434)381-6231 or via E-Mail giving@gmail.edu" + "\n" + 
                                                                                                              "However, E-Mail with the Confirmation message has been send to \"" + shl.enteredAndSelectedPageValues.donor_EMail + "\" E-Mail address." + "\n" + 
                                                                                                              "Thus, having this E-Mail received, you may try to print it out manually." + "\n" + 
                                                                                                              "Sorry for the inconvenience.";
                                                                        shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = ErrorChargeResultMessageForUser;
                                                                        self.checkoutResultMessage(ErrorChargeResultMessageForUser);
                                                                    }
                                                                }
                 
                 //--------------------------------------------------------------------------------------------------------
                 
                 self.buttonMakeOneTimeDonationLabel = ko.observable("Make one time donation");

                 self.populateFieldsValuesForTestPurpose = function()
                                                           {
                                                               if (shl.enteredAndSelectedPageValues.TestDebugMode)
                                                               {
                                                                   console.log("---- Module: checkout_with_stripe, compositionComplete(): Lc.01");
                                                                   console.log("---- shl.enteredAndSelectedPageValues.donor_EMail = " + shl.enteredAndSelectedPageValues.donor_EMail);

                                                                   var donor_EMail = "uasav@yahoo.com";
                                                                   shl.enteredAndSelectedPageValues.donor_EMail = donor_EMail;
                                                                   console.log("---- shl.enteredAndSelectedPageValues.donor_EMail = " + shl.enteredAndSelectedPageValues.donor_EMail);

                                                                   var donor_MailingAddr_Line_1 = "134 Chapel Rd";
                                                                   shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_1 = donor_MailingAddr_Line_1;

                                                                   var donor_MailingAddr_Line_2 = "P.O.Box 99999";
                                                                   shl.enteredAndSelectedPageValues.donor_MailingAddr_Line_2 = donor_MailingAddr_Line_2;

                                                                   var donor_MailingAddr_City = "Lynchburg";
                                                                   shl.enteredAndSelectedPageValues.donor_MailingAddr_City = donor_MailingAddr_City;

                                                                   var donor_MailingAddr_ZIP = "24595";
                                                                   shl.enteredAndSelectedPageValues.donor_MailingAddr_ZIP = donor_MailingAddr_ZIP;

                                                                   var donor_FirstName = "Andrey";
                                                                   shl.enteredAndSelectedPageValues.donor_FirstName = donor_FirstName;

                                                                   var donor_LastName = "Suntsev";
                                                                   shl.enteredAndSelectedPageValues.donor_LastName = donor_LastName;

                                                                   var donor_DomesticPhone = "5555555555";
                                                                   shl.enteredAndSelectedPageValues.donor_DomesticPhone = donor_DomesticPhone;

                                                                   var donation_amount_to_desg_one = "12";
                                                                   shl.enteredAndSelectedPageValues.donation_amount_to_desg_one = donation_amount_to_desg_one;
                                                                   shl.enteredAndSelectedPageValues.selectedDesignation_one = "AFCAM";
                                                                   shl.enteredAndSelectedPageValues.selectedDesignation_one_Desc = "Annual Fund - Campus Preservation";

                                                                   var donation_amount_to_desg_two = "23";
                                                                   shl.enteredAndSelectedPageValues.donation_amount_to_desg_two = donation_amount_to_desg_two;
                                                                   shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_two = true;
                                                                   shl.enteredAndSelectedPageValues.selectedDesignation_two = "FDFOA";
                                                                   shl.enteredAndSelectedPageValues.selectedDesignation_two_Desc = "Friends of Art";

                                                                   var donation_amount_to_desg_three = "34";
                                                                   shl.enteredAndSelectedPageValues.donation_amount_to_desg_three = donation_amount_to_desg_three;
                                                                   shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_three = true;
                                                                   shl.enteredAndSelectedPageValues.selectedDesignation_three = "AFTECH";
                                                                   shl.enteredAndSelectedPageValues.selectedDesignation_three_Desc = "Annual Fund - Digital Sophistication";

                                                                   var totalDonationAmount_inCents = "6900";
                                                                   shl.enteredAndSelectedPageValues.totalDonationAmount_inCents = totalDonationAmount_inCents;

                                                               }
                                                           };
                 
                 //--------------------------------------------------------------------------------------------------
                 // Last step before the Checking out: shl.enteredAndSelectedPageValues structure CLEANING and TUNING
                 //--------------------------------------------------------------------------------------------------

                 self.performLastMomentAdjustments = function()
                                                     {
                                                         //console.log("---- Module: checkout_with_stripe, performLastMomentAdjustments(): Lc.10");
                                                         var error_message = "";
                                                         
                                                         // This is for testing purposes only:
                                                         //throw "Module: checkout_with_stripe, performLastMomentAdjustments(): Synthetic error generated";
                                                         
                                                         console.log("--- Module: checkout_with_stripe, performLastMomentAdjustments(): shl.enteredAndSelectedPageValues.TestDebugMode = " + shl.enteredAndSelectedPageValues.TestDebugMode);
                                                         if (shl.enteredAndSelectedPageValues.TestDebugMode)
                                                         {
                                                             try
                                                             {
                                                                 self.populateFieldsValuesForTestPurpose();
                                                             }
                                                             catch(err)
                                                             {
                                                                 error_message = "Module: checkout_with_stripe, performLastMomentAdjustments(),Lc.10: original error message:" + "\n" + err;
                                                                 self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                                 return false;
                                                             }
                                                         }
                                                         
                                                         var totalDonationAmount_inCents = (parseFloat(((shl.enteredAndSelectedPageValues.donation_amount_to_desg_one == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_one)) + ((shl.enteredAndSelectedPageValues.donation_amount_to_desg_two == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_two)) + ((shl.enteredAndSelectedPageValues.donation_amount_to_desg_three == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.donation_amount_to_desg_three))) * 100).toString();
                                                         shl.enteredAndSelectedPageValues.totalDonationAmount_inCents = totalDonationAmount_inCents
                                                         //console.log("---- Module: checkout_with_stripe, performLastMomentAdjustments(): totalDonationAmount_inCents= " + totalDonationAmount_inCents + ". Its type is: " + typeof totalDonationAmount_inCents);

                                                         if (jQuery.isEmptyObject(totalDonationAmount_inCents))
                                                         {
                                                             //console.log("---- Module: checkout_with_stripe, performLastMomentAdjustments(): totalDonationAmount_inCents is EMPTY. Checkout is not possible");
                                                             return false;
                                                         }

                                                         //----------------------------------------------------------------------

                                                         if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedDesignation_one))
                                                         {
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_one = shl.enteredAndSelectedPageValues.defaultDesignation_one;
                                                         }

                                                         if (shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_two &&
                                                             jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedDesignation_two))
                                                         {
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_two = shl.enteredAndSelectedPageValues.defaultDesignation_two;
                                                         }

                                                         if (shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_three &&
                                                             jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.selectedDesignation_three))
                                                         {
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three = shl.enteredAndSelectedPageValues.defaultDesignation_three;
                                                         }

                                                         if (!shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_two)
                                                         {
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_two = "";
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_two_Desc = "";
                                                         }

                                                         if (!shl.enteredAndSelectedPageValues.isOtherDesgDivVisible_three)
                                                         {
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three = "";
                                                             shl.enteredAndSelectedPageValues.selectedDesignation_three_Desc = "";
                                                         }
                                                         
                                                         if (shl.enteredAndSelectedPageValues.DonationPaymentMode == 'RecurringPayments')
                                                         {
                                                             if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor))
                                                             {
                                                                 shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor = 'Donation to The College /Auto/';
                                                             }
                                                         }

                                                         return true;
                                                     };
                 
                 self.configureStripeHandler = function(_mode)
                                                {
                                                    //console.log("---- Module: checkout_with_stripe, configureStripeHandler(): _mode = " + _mode);
                                                    //window.location.href = 'http://localhost/ods-make-one-time-donation/';

                                                    //=============================================================================================================
                                                    // Start point of Stripe-base checkout process
                                                    //=============================================================================================================

                                                    self.filteredArrayOfODSParameters = findODSParameterValue(self.listOfODSParameters(), 'Stripe_Publishable_Key')
                                                    //console.log("---- Module: checkout_with_stripe, filteredArrayOfODSParameters['parameter_value'] = " + self.filteredArrayOfODSParameters['parameter_value']);
                                                    
                                                    // This identifies your website in the createToken call below
                                                    //Stripe.setPublishableKey('pk_test_M2opY3P2Wpn4gOrCv2kQBs4h');
                                                    Stripe.setPublishableKey(self.filteredArrayOfODSParameters['parameter_value']);

                                                    //var handler = StripeCheckout.configure({key: 'pk_test_M2opY3P2Wpn4gOrCv2kQBs4h',
                                                    var handler = StripeCheckout.configure({key: self.filteredArrayOfODSParameters['parameter_value'],
                                                                                            //image: '/img/documentation/checkout/marketplace.png',
                                                                                            locale: 'auto',
                                                                                            allowRememberMe: false,
                                                                                            token: function(token) // This callback function is executed AFTER Stripe's checkout popup window
                                                                                                   {
                                                                                                       //var $form = $('#payment-form');
                                                                                                       //console.log("---- Module: checkout_with_stripe, compositionComplete(): token.id (received from Stripe) = " + token.id);

                                                                                                       // Use the token to create the charge with a server-side script.
                                                                                                       // You can access the token ID with `token.id`
                                                                                                       // This is a location where all entered through donation form values, are made available to read from Python server-side script

                                                                                                       shl.enteredAndSelectedPageValues.transactionTokenIdReceived = token.id;

                                                                                                       var WebClientDataSubmitted_InJSON = JSON.stringify(shl.enteredAndSelectedPageValues);
                                                                                                       //console.log("---- Module: checkout_with_stripe, compositionComplete(): WebClientDataSubmitted_InJSON:");
                                                                                                       //console.log(WebClientDataSubmitted_InJSON);

                                                                                                       //$form.append($('<input type="hidden" name="enteredAndSelectedPageValues" />').val(enteredAndSelectedPageValues_InJSON));

                                                                                                       $.ajax({ type: "POST",
                                                                                                                url: "https://qnp9dfkpha.execute-api.us-east-1.amazonaws.com/dev",
                                                                                                                contentType: 'application/json',
                                                                                                                dataType:'json',
                                                                                                                /*data: JSON.stringify({'hello': 'world'}),*/
                                                                                                                /*data: { WebClientDataSubmitted: WebClientDataSubmitted_InJSON }, */
                                                                                                                data: WebClientDataSubmitted_InJSON,
                                                                                                                beforeSend: function()
                                                                                                                            {
                                                                                                                                self.showSpinningIndicator(true);
                                                                                                                            },
                                                                                                                success: function (data, textStatus, jqXHR) 
                                                                                                                         {
                                                                                                                             self.showSpinningIndicator(false);
                                                                                                                             var ServerSuccessMessageOriginal = "";
                                                                                                                             
                                                                                                                             //Please pay attention that Stripe-based charging process status can be unsuccessful 
                                                                                                                             //(due to various Credit Card - related problems) wherereas technically AJAX's call
                                                                                                                             //is fully successful. Thus, to make final decision of what happened on server
                                                                                                                             //we have to analyse data.Status field. If it equals to 'FAILED' - checkingout/charging
                                                                                                                             //transaction is considered as "Unsuccessful":

                                                                                                                             if (data.Status == 'OK!')
                                                                                                                             {
                                                                                                                                 //ServerSuccessMessageOriginal = "data.Status = " + data.Status + " data.Message = " + data.Message;
                                                                                                                                 ServerSuccessMessageOriginal = data.Message;
                                                                                                                                 console.log("---- Module: checkout_with_stripe, StripeCheckout.configure(), ajax.success(): ServerSuccessMessageOriginal = " + ServerSuccessMessageOriginal);
                                                                                                                                 self.setupUserMessageAndNavigationConditions('CCChargeOnServerSucceed', ServerSuccessMessageOriginal, null);
                                                                                                                             }
                                                                                                                             else // data.Status == 'FAILED'
                                                                                                                             {
                                                                                                                                 var ServerErrorMessageOriginal = "data.Status = " + data.Status + " data.Message = " + data.Message;
                                                                                                                                 //console.log("---- Module: checkout_with_stripe, StripeCheckout.configure(), ajax.success(): ServerErrorMessageOriginal = " + ServerErrorMessageOriginal);
                                                                                                                                 self.setupUserMessageAndNavigationConditions('CCChargeOnServerFailed', null, ServerErrorMessageOriginal);
                                                                                                                             }
                                                                                                                         },
                                                                                                                error: function (jqXHR, textStatus, errorThrown) 
                                                                                                                       {
                                                                                                                             var ServerErrorMessageOriginal = errorThrown;
                                                                                                                             //console.log("---- Module: checkout_with_stripe, StripeCheckout.configure(), ajax.error(): ServerErrorMessageOriginal = " + ServerErrorMessageOriginal);
                                                                                                                             self.setupUserMessageAndNavigationConditions('CCChargeOnServerErrorOccured', null, ServerErrorMessageOriginal);
                                                                                                                       }
                                                                                                            });

                                                                                                       // and re-submit the form:
                                                                                                       //$form.get(0).submit();
                                                                                                   },
                                                                                            closed: function() // PAY ATTENTION: This function is called in both cases: when user clicked on "Pay" button (on Stripe Popup window) - to make REAL payment, and when user clicked on "x" (cross sign) - to cancel the transaction and close Stripe PopUp Window. 
                                                                                                               //                The only difference between these two modes is if shl.enteredAndSelectedPageValues.transactionTokenIdReceived is populated or not.
                                                                                                    {
                                                                                                        if (shl.enteredAndSelectedPageValues.transactionTokenIdReceived) //Stripe checkout session was successful
                                                                                                        {
                                                                                                            //console.log("---- Module: checkout_with_stripe, StripeCheckout.configure(), closed(): Stripe Popup windows closed and Token has been generated");
                                                                                                            self.setupUserMessageAndNavigationConditions('InstantOneTimeDonationWindowClosed_ButStripeTokenReceived',null,null);
                                                                                                        }
                                                                                                        else // User canceled Stripe transaction by clicling on cross sign on Stripe checkout pop up window
                                                                                                        {
                                                                                                            //console.log("---- Module: checkout_with_stripe, StripeCheckout.configure(), closed(): Stripe Popup windows closed and Token has NOT been generated");
                                                                                                            self.setupUserMessageAndNavigationConditions('InstantOneTimeDonationWindowClosed',null,null);
                                                                                                        }
                                                                                                    }
                                                                                           });

                                                    return handler;
                                                };
                 
                 //--------------------------------------------------------------------------------------------------------
                 
                 self.invokeStripeHandler = function(_StripeHandler, _mode)
                                            {
                                                //console.log("---- Module: checkout_with_stripe, invokeStripeHandler(): _mode = " + _mode);
                                                
                                                // Close Checkout on page navigation (if upper navigation button is pressed, this function went off)
                                                $(window).on('popstate', function() 
                                                {
                                                    //console.log("---- Module: checkout_with_stripe, invokeStripeHandler(): $(window).on('popstate'...");
                                                    _StripeHandler.close();
                                                });

                                                //----------------------------------------------------------------------

                                                // By doing so, we are prohibiting all sorts of navigation inside of the application.
                                                // See router.guardRoute function in the shell module
                                                shl.enteredAndSelectedPageValues.checkoutIsDone = true;
                                                self.CheckoutPage_VisibleGoToPreviousPageButton(false);
                                                self.CheckoutPage_TypeOfPaymentButtons_Enabled(false);
                                                self.showTransactionProcessingResults(true);
                                                
                                                //console.log("---- Module: checkout_with_stripe, invokeStripeHandler(): self.finalActivityButtonsEnable = " + ko.utils.unwrapObservable(self.finalActivityButtonsEnable));

                                                var StripeHandlerCallDescription = "";
                                                
                                                if (_mode == "OneTimeDonation")
                                                {
                                                    StripeHandlerCallDescription = 'Checking out with a donation';
                                                }
                                                else if (_mode == "RecurringPayments")
                                                {
                                                    StripeHandlerCallDescription = 'Storing your Credit Card info for recurring payments';
                                                }
                                                else
                                                {
                                                    StripeHandlerCallDescription = '???';
                                                }
                                                    
                                                console.log("---- Module: checkout_with_stripe, invokeStripeHandler(): shl.enteredAndSelectedPageValues.donor_EMail = " + shl.enteredAndSelectedPageValues.donor_EMail);                                                    
                                                // Open Checkout with further options
                                                _StripeHandler.open({name: 'Name of your Organization',
                                                                     description: StripeHandlerCallDescription,
                                                                     amount: parseInt(shl.enteredAndSelectedPageValues.totalDonationAmount_inCents),
                                                                     email: shl.enteredAndSelectedPageValues.donor_EMail
                                                                   });

                                                return true;
                                            };

                 //--------------------------------------------------------------------------------------------------------
                 
                 self.gotoMakeOneTimeDonation = function()
                                                {
                                                    //console.log("---- Module: checkout_with_stripe, gotoMakeOneTimeDonation()");
                                                    //window.location.href = 'http://localhost/ods-make-one-time-donation/';

                                                    shl.enteredAndSelectedPageValues.DonationPaymentMode = 'InstantPayment';
                                                    var error_message = "";
                                                    
                                                    if (!jQuery.isEmptyObject(ko.utils.unwrapObservable(self.checkoutResultMessage)))
                                                    {
                                                        shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal = "";
                                                        shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = "";
                                                        self.checkoutResultMessage(shl.enteredAndSelectedPageValues.ChargeResultMessageForUser);
                                                    }
                                                    
                                                    try
                                                    {
                                                        self.performLastMomentAdjustments();
                                                    }
                                                    catch(err)
                                                    {
                                                        error_message = "Module: checkout_with_stripe, gotoMakeOneTimeDonation(),Lc.10: original error message:" + "\n" + err;
                                                        self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                        return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                                    }
                                                    
                                                    try
                                                    {
                                                        var StripeHandler = self.configureStripeHandler('OneTimeDonation');
                                                    }
                                                    catch(err)
                                                    {
                                                        error_message = "Module: checkout_with_stripe, gotoMakeOneTimeDonation(),Lc.20: original error message:" + "\n" + err;
                                                        self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                        return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                                    }
                                                    
                                                    try
                                                    {
                                                        self.invokeStripeHandler(StripeHandler, 'OneTimeDonation');
                                                    }
                                                    catch(err)
                                                    {
                                                        error_message = "Module: checkout_with_stripe, gotoMakeOneTimeDonation(),Lc.30: original error message:" + "\n" + err;
                                                        self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                        return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                                    }
                                                    
                                                    return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                                };

                 //--------------------------------------------------------------------------------------------------------
                 
                 self.buttonSetupRecurringDonationsLabel = ko.observable("Set up Recurring Payments");

                 self.gotoSetupRecurringDonations = function()
                                                    {
                                                        //console.log("---- gotoSetupRecurringDonations()");
                                                        
                                                        shl.enteredAndSelectedPageValues.DonationPaymentMode = 'RecurringPayments';
                                                        
                                                        if (!jQuery.isEmptyObject(ko.utils.unwrapObservable(self.checkoutResultMessage)))
                                                        {
                                                            shl.enteredAndSelectedPageValues.ServerChargeResultMessageOriginal = "";
                                                            shl.enteredAndSelectedPageValues.ChargeResultMessageForUser = "";
                                                            self.checkoutResultMessage(shl.enteredAndSelectedPageValues.ChargeResultMessageForUser);
                                                        }
                                                        
                                                        $('#RecurringPayments_ModalWindow').modal({backdrop: 'static', keyboard: false});
                                                        $("#RecurringPayments_ModalWindow").modal();
                                                        return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                                    };
                 
                 self.UserNameTst = ko.observable();
                 
                 self.UserNameTst.subscribe(function(newValue)
                                            {
                                                console.log("self.UserNameTst.subscribe(): newValue = " + newValue);
                                            });
                 
                 self.closeModalWindow_and_SubmitData = function() 
                                                        {
                                                            //console.log("---- Module: checkout_with_stripe, closeModalWindow_and_SubmitData()");
                                                            $('#RecurringPayments_ModalWindow').modal('toggle');              
                                                            var error_message = "";
                                                            
                                                            //console.log("---- Module: checkout_with_stripe, gotoMakeOneTimeDonation()");
                                                            //window.location.href = 'http://localhost/ods-make-one-time-donation/';

                                                            try
                                                            {
                                                                self.performLastMomentAdjustments();
                                                            }
                                                            catch(err)
                                                            {
                                                                error_message = "Module: checkout_with_stripe, closeModalWindow_and_SubmitData(),Lc.10: original error message:" + "\n" + err;
                                                                //console.log("---- closeModalWindow_and_SubmitData(): error_message = " + error_message);
                                                                self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                                return;
                                                            }
                                                            
                                                            if (!shl.enteredAndSelectedPageValues.WebClientAppTerminatedDueToErrors)
                                                            {
                                                                try
                                                                {
                                                                    var StripeHandler = self.configureStripeHandler('RecurringPayments');
                                                                }
                                                                catch(err)
                                                                {
                                                                    error_message = "Module: checkout_with_stripe, closeModalWindow_and_SubmitData(),Lc.20: original error message:" + "\n" + err;
                                                                    self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                                    return;
                                                                }
                                                            }
                                                            
                                                            if (!shl.enteredAndSelectedPageValues.WebClientAppTerminatedDueToErrors)
                                                            {
                                                                try
                                                                {
                                                                    self.invokeStripeHandler(StripeHandler, 'RecurringPayments');
                                                                }
                                                                catch(err)
                                                                {
                                                                    error_message = "Module: checkout_with_stripe, closeModalWindow_and_SubmitData(),Lc.30: original error message:" + "\n" + err;
                                                                    self.setupUserMessageAndNavigationConditions('ApplicationInternalError', null, error_message);
                                                                    return;
                                                                }
                                                            }
                                                            
                                                        };
                 
                 self.closeModalWindow_and_CancelData = function() 
                                                        {
                                                            //console.log("---- self.closeModalWindow_and_CancelData()");
                                                            
                                                            $('#RecurringPayments_ModalWindow').modal('toggle');              
                                                            shl.enteredAndSelectedPageValues.DonationPaymentMode = '';
                                                            
                                                            self.setupUserMessageAndNavigationConditions('RecurringPaymentsSetupWindowCanceled', null, null);
                                                        };
                 
                 //--------------------------------------------------------------------------------------------------------
                 
                 self.RecurringPayments_ShowHelpPopWindow = function() 
                                                            {
                                                                //console.log("---- self.RecurringPayments_Interval_ToolTipProcessing()");
                                                                
                                                                //if ($("#RecurringPayments_Interval").next('div.popover:visible').length)
                                                                //{
                                                                //    console.log("---- self.RecurringPayments_Interval_ToolTipProcessing(): The tooltip is visible");
                                                                //    $('#RecurringPayments_Interval').tooltip('destroy');
                                                                //}
                                                                //else
                                                                //{
                                                                //    console.log("---- self.RecurringPayments_Interval_ToolTipProcessing(): The tooltip is NOT visible");
                                                                //    $('#RecurringPayments_Interval').tooltip({title: "<h4>Hello, <b>I'm</b> <i>Smiley!</i></h4>",
                                                                //                                              html: true
                                                                //                                            }); 
                                                                //    $('#RecurringPayments_Interval').tooltip('toggle');
                                                                //}
                                                                
                                                                var v_currentDateDayNumber = (new Date().getDate()).toString();
                                                                
                                                                var RecurringPayments_Interval_ToolTip_Text_Initial = "Interval: the billing period for the recurring payments, which can range from" + "\n" +
                                                                                                                      "    a single day to a year. The interval options are day, week," + "\n" +
                                                                                                                      "    month, or year. Right now you can use \"month\" option only." + "\n" +
                                                                                                                      "\n" +
                                                                                                                      "Duration of the subscription: How many times (in chosen interval, e.g. \"month\")" + "\n" +
                                                                                                                      "    your account will be charged." + "\n" +
                                                                                                                      "\n" +
                                                                                                                      "Day's number your Card will be charged: A day of month, when your bank" + "\n" +
                                                                                                                      "    account will be charged automatically. Please, pay attention that," + "\n" +
                                                                                                                      "    if specified a Day number greater (or equals to) today's date" + "\n" +
                                                                                                                      "    (it's \"" + v_currentDateDayNumber + "\"), your first payment" + "\n" +
                                                                                                                      "    will be scheduled on specified day in CURRENT month. Otherwise," + "\n" +
                                                                                                                      "    (I.e. when you have specified the day number lesser then the" + "\n" +
                                                                                                                      "    current day (" + v_currentDateDayNumber + "), your first payment" + "\n" +
                                                                                                                      "    will be scheduled on next month (I.e. on " + shl.enteredAndSelectedPageValues.RecurringPayments_DateOfFirstCharge + ")." + "\n" +
                                                                                                                      "\n" +
                                                                                                                      "Statement Descriptor, 22 chars max:  A description text which will be" + "\n" +
                                                                                                                      "    assigned with bank transaction of an automatic payment." + "\n" +
                                                                                                                      "    It makes it easier to recognize such a transactions among the" + "\n" +
                                                                                                                      "    others in your bank statement" + "\n";
                                                                
                                                                self.RecurringPayments_Interval_ToolTip_Text(RecurringPayments_Interval_ToolTip_Text_Initial);
                                                                
                                                                // Turned off because those influence on RecuringPaymentsVerdict text. Later it will be fixed.
                                                                //self.bit_of_text_1("Interval:");
                                                                //self.bit_of_text_2("Duration of the subscription:");
                                                                //self.bit_of_text_3("Day's number your Card will be charged:");
                                                                //self.bit_of_text_4("Statement Descriptor, 22 chars max:");
                                                                //self.bit_of_text_5("");
                                                                //self.bit_of_text_6("");
                                                                
                                                                //$('#RecurringPayments_Interval_ToolTip_ModalWindow').modal({backdrop: 'static', keyboard: false}); // See http://stackoverflow.com/questions/22207377/disable-click-outside-of-bootstrap-model-area-to-close-modal 
                                                                $("#RecurringPayments_Interval_ToolTip_ModalWindow").modal();
                                                                //$('#RecurringPayments_Interval_ToolTip_ModalWindow').modal('toggle');
                                                            };
                 
                 //--------------------------------------------------------------------------------------------------------

                 self.showPopUp_CompareTwoMethodsOfMakingDonation = function()
                                                                    {
                                                                        //console.log("---- Module: main-ods-selector.js, vm.showPopUp_CompareTwoMethodsOfMakingDonation(): Started!");

                                                                        BootstrapDialog.show({title: 'Description of two methods to make a donation',
                                                                                              message: 'One time payment: By following to this option, your Credit Card will be charged just ones.\n' + 'Recurring payments: By following to this option, you will be prompted to setup a schedule when and of how much your Credit Card will be charged automatically.',
                                                                                              type: BootstrapDialog.TYPE_INFO,
                                                                                              buttons: [{label: 'Close',
                                                                                                         action: function(dialogItself)
                                                                                                                 {
                                                                                                                     dialogItself.close();
                                                                                                                 }
                                                                                                       }]
                                                                                            });
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
                 };

                 self.update_interval_entered_duration = function(anArray, intervalCode, enteredIntervalValue) 
                 {
                     for (var i=0; i < anArray.length; i++) 
                     {
                         if (anArray[i].interval_code === intervalCode)
                         {
                             anArray[i].interval_entered_duration = enteredIntervalValue;
                             break;
                         }
                     }
                 }
                         
                 //Can be used only with the Card object only.
                 //var stripeResponseHandler = function(status, response) 
                 //{
                 //  console.log("!!!! stripeResponseHandler() status:");
                 //  console.log(status);
                 //  console.log(response);
                 //  if (response.error)  // Problem!
                 //  {
                 //      console.log("!!!! stripeResponseHandler() ERROR!");
                 //  }
                 //  else
                 //  {
                 //      console.log("!!!! stripeResponseHandler() OK!");
                 //  }
                 //}

                 self.sbc_affilated_existing_person_greetings = ko.computed(function()
                                                                            {
                                                                                var greetings = "";
                                                                                //console.log("---- Module: main-ods-selector.js, vm.sbc_affilated_existing_person_greetings.computed(): sbc_affilated_existing_person_full_name = " + ko.utils.unwrapObservable(self.sbc_affilated_existing_person_full_name));

                                                                                //greetings = (!self.sbc_affilated_existing_person_full_name()) ? "Hello, Stranger!" : "Welcome, " + self.sbc_affilated_existing_person_full_name() + "!";
                                                                                greetings = "Hello, Stranger!";
                                                                                return greetings;
                                                                            });
                 
                 //----------------------------------------------------------------------------------------------------
                 
                 self.showTransactionProcessingResults = ko.observable(false);
                 
                 if (!jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.showTransactionProcessingResults))
                 {
                     self.showTransactionProcessingResults(shl.enteredAndSelectedPageValues.showTransactionProcessingResults);
                 }
                 else
                 {
                     self.showTransactionProcessingResults(false);
                     shl.enteredAndSelectedPageValues.showTransactionProcessingResults = ko.utils.unwrapObservable(self.showTransactionProcessingResults);
                 }
                 
                 //----------------------------------------------------------------------------------------------------

                 self.compositionComplete =  function () 
                                             {
                                                 //console.log("---- donation_info.js, compositionComplete():");
                                                 cssLoader.loadCss('app/viewmodels/project_custom.css');
                                                 //console.log("---- donation_info.js, compositionComplete() after:");

                                                 return true; // See http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                             };

                 //----------------------------------------------------------------------------------------------------

                 self.deactivate =  function () 
                                    {
                                        cssLoader.removeModuleCss();
                                    }

                 //----------------------------------------------------------------------------------------------------

                 self.listOfODSParameters = ko.observableArray([]);

                 //----------------------------------------------------------------------------------------------------

                 self.previousPageUrl = ko.observable();
                 self.buttonPreviousPageLabel = ko.observable("Go back to Donor Info");
                 self.CheckoutPage_VisibleGoToPreviousPageButton = ko.observable(true);
                 self.CheckoutPage_TypeOfPaymentButtons_Enabled = ko.observable(true);

                 self.returnTo_SBC_EDU_MainPage_ButtonLabel = ko.observable("Return to College Web site page");
                 self.cancelOverallGivingProcess_ButtonLabel = ko.observable("Cancel overall process and return to College Web site page");
                 self.returnTo_SBC_Giving_Page_ButtonLabel = ko.observable("Begin new transaction of Giving");
                 self.print_ConfirmationMessage_ButtonLabel = ko.observable("Print your Confirmation Message");
                 self.closeApplicationWindow_ButtonLabel = ko.observable("Close this Application Window");

                 self.receivedEventMessages = ko.observableArray([]);

                 self.checkoutResultMessage = ko.observable();
                 self.showSpinningIndicator = ko.observable(false);
                 self.checkoutResultMessagePlaceHolder = ko.observable();
                 self.isDisplayCheckoutResultTextAreaFocus = ko.observable(false);
                 self.messageFontColor = ko.observable('black');
                 //self.messageFontStyle = ko.observable('italic');

                 self.finalActivityButtonsEnable = ko.observable(false);
                 self.print_ConfirmationMessage_ButtonVisible = ko.observable(false);
                 self.print_ConfirmationMessage_ButtonEnable = ko.observable(false);

                 self.RecurringPayments_ListOfIntervals = ko.observableArray([]);
                 self.RecurringPayments_SelectedRecurringInterval = ko.observable();
                 self.RecurringPayments_IntervalUnit = ko.observable();
                 
                 self.RecurringPayments_Trigger = ko.observable();
                 
                 self.RecurringPayments_StatementDescriptor = ko.observable();
                 self.RecurringPayments_Duration = ko.observable();
                 self.RecurringPayments_DayOfPayment = ko.observable();
                 self.RecurringPayments_SkipFirstMonth = ko.observable();                 
                 self.RecurringPayments_SkipFirstMonth_Visible = ko.observable();
                                                   
                 self.RecurringPayments_ListOfIntervals_Filtered = ko.observableArray([]);
                 //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                 self.RecurringIntervals_Filters = [ {title:'Match to interval_code selected', filter: function(item) {return item.interval_code == ko.utils.unwrapObservable(self.RecurringPayments_SelectedRecurringInterval);}} ];
                 
                 self.RecurringPayments_Verdict = ko.observable(""); // Do not remove this empty string: otherwise the hightlightedText plugin will not work up properly!
                 
                 self.bit_of_text_1 = ko.observable();
                 self.bit_of_text_2 = ko.observable();
                 self.bit_of_text_3 = ko.observable();
                 self.bit_of_text_4 = ko.observable();
                 self.bit_of_text_5 = ko.observable();
                 self.bit_of_text_6 = ko.observable();
                 
                 self.StyleClassNameForHighlightingPartOfTextArea = ko.observable();
                 
                 self.RecurringPayments_Interval_ToolTip_Text = ko.observable(""); // Do not remove this empty string: otherwise the hightlightedText plugin will not work up properly!
                 
                 //----------------------------------------------------------------------------------------------------

                 self.gotoPreviousPage = function()
                                         {
                                             //console.log("---- gotoPreviousPage()");
                                             //console.log("---- Module:checkout_with_stripe,gotoPreviousPage(): router.navigationModel()[0].moduleId = " + router.navigationModel()[0].moduleId + " router.navigationModel()[0].isActive() = " + router.navigationModel()[0].isActive() + " router.navigationModel()[0].hash() = " + router.navigationModel()[0].hash);
                                             //console.log("---- Module:checkout_with_stripe,gotoPreviousPage(): router.navigationModel()[1].moduleId = " + router.navigationModel()[1].moduleId + " router.navigationModel()[1].isActive() = " + router.navigationModel()[1].isActive() + " router.navigationModel()[1].hash() = " + router.navigationModel()[1].hash);

                                             router.navigate(router.navigationModel()[1].hash);

                                             return true; //http://stackoverflow.com/questions/18414398/knockout-js-dynamic-links-do-not-click-through
                                         };

                 self.returnTo_SBC_EDU_MainPage = function()
                                                  {
                                                      //console.log("---- returnTo_SBC_EDU_MainPage()");
                                                      
                                                      window.location.href = 'http://www.uva.edu';
                                                      return true;
                                                  };

                 self.returnTo_SBC_Giving_Page = function()
                                                 {
                                                     //console.log("---- returnTo_SBC_Giving_Page()");

                                                     //window.location.href = 'http://www.uva.edu/giving';
                                                     //original: window.location.href = 'http://localhost/ods-make-one-time-donation';
                                                     window.location.href = 'http://asuntsev-www-ods.s3-website-us-east-1.amazonaws.com';
                                                     return true;
                                                 };

                 self.print_ConfirmationMessage = function()
                                                  {
                                                      //console.log("---- print_ConfirmationMessage()");

                                                      var iframe = document.createElement('iframe');
                                                      iframe.style.display = 'none';

                                                      var utilityRequestToServer_InJSON = JSON.stringify({"transactionTokenIdReceived": shl.enteredAndSelectedPageValues.transactionTokenIdReceived, "CommandName": "getConfirmationMessageHTML", "CommandArgs": ""});
                                                      //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(): utilityRequestToServer_InJSON:");
                                                      //console.log(utilityRequestToServer_InJSON);

                                                      var confirmationMessageAsHTML = "";

                                                      $.ajax({ type: "POST",
                                                               url: "https://qnp9dfkpha.execute-api.us-east-1.amazonaws.com/dev/Utilities",
                                                               contentType: 'application/json',
                                                               dataType:'json',
                                                               /*data: JSON.stringify({'hello': 'world'}),*/
                                                               /*data: { WebClientDataSubmitted: WebClientDataSubmitted_InJSON }, */
                                                               data: utilityRequestToServer_InJSON,
                                                               beforeSend: function()
                                                                           {
                                                                               self.showSpinningIndicator(true);
                                                                           },
                                                               success: function (data, textStatus, jqXHR) 
                                                                        {
                                                                            self.showSpinningIndicator(false);

                                                                            //Please pay attention that Stripe-based charging process status can be unsuccessful 
                                                                            //(due to various Credit Card - related problems) wherereas technically AJAX's call
                                                                            //is fully successful. Thus, to make final decision of what happened on server
                                                                            //we have to analyse data.Status field. If it equals to 'FAILED' - checkingout/charging
                                                                            //transaction is considered as "Unsuccessful":

                                                                            //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), ajax.success():" + "\n");
                                                                            //console.log(data);

                                                                            if (data.Status == 'OK!')
                                                                            {
                                                                                //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), ajax.success(): " + data.Status);  
                                                                                //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), data.Message.CONFIRMATION_MESSAGE:" + "\n");  
                                                                                //console.log(data.Message.CONFIRMATION_MESSAGE);  

                                                                                confirmationMessageAsHTML = data.Message.CONFIRMATION_MESSAGE;

                                                                                if (confirmationMessageAsHTML)
                                                                                {
                                                                                    //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(): confirmationMessageAsHTML:");
                                                                                    //console.log(confirmationMessageAsHTML);
                                                                                     
                                                                                    iframe.onload = function() 
                                                                                                    {
                                                                                                        var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
                                                                                                        //doc.getElementsByTagName('body')[0].innerHTML = "<p>This is an example of a Sweet Briar College online donation <strong>Confirmation message</strong></p>";
                                                                                                        doc.getElementsByTagName('body')[0].innerHTML = confirmationMessageAsHTML;
                                                                                                        //doc.getElementsByTagName('body')[0].style.fontSize = "12px";

                                                                                                        iframe.contentWindow.focus(); // This is key, the iframe must have focus first
                                                                                                        iframe.contentWindow.print();
                                                                                                    }
                                                                                
                                                                                    document.getElementsByTagName('body')[0].appendChild(iframe);
                                                                                }
                                                                                else
                                                                                {
                                                                                    //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(): confirmationMessageAsHTML is EMPTY!");
                                                                                    null;
                                                                                }
                                                                                self.setupUserMessageAndNavigationConditions('printConfirmationMessageSucceed', null, null);
                                                                            }
                                                                            else // data.Status == 'FAILED'
                                                                            {
                                                                                //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), ajax.success(): " + data.Status);  

                                                                                var ServerErrorMessageOriginal = "data.Status = " + data.Status + " data.Message = " + data.Message;
                                                                                //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), ajax.success(): ServerErrorMessageOriginal = " + ServerErrorMessageOriginal);
                                                                                
                                                                                self.setupUserMessageAndNavigationConditions('printConfirmationMessageFailed', null, ServerErrorMessageOriginal);
                                                                            }
                                                                        },
                                                               error: function (jqXHR, textStatus, errorThrown) 
                                                                      {
                                                                            //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), ajax.error(): " + data.Status);  

                                                                            var ServerErrorMessageOriginal = errorThrown;
                                                                            //console.log("---- Module: checkout_with_stripe, print_ConfirmationMessage(), ajax.error(): ServerErrorMessageOriginal = " + ServerErrorMessageOriginal);
                                                                            
                                                                            self.setupUserMessageAndNavigationConditions('printConfirmationMessageOnServerErrorOccured', null, ServerErrorMessageOriginal);
                                                                      }
                                                           });

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

                                if (self.listOfODSParameters().length == 0)
                                {
                                    //console.log("---- Populating the listOfODSParameters with FRESH data from shl.serverDataSuppliesLocal[4].listOfODSParameters...");
                                    self.listOfODSParameters(shl.serverDataSuppliesLocal[4].listOfODSParameters);
                                    //console.log("---- So, now the self.listOfODSParameters().length = " + (self.listOfODSParameters().length).toString());
                                }

                                //-------------------------------------------------------------------------------------

                                self.checkoutResultMessage(shl.enteredAndSelectedPageValues.checkoutResultMessage);
                                //self.checkoutResultMessage = ko.computed(function()
                                //                                         {
                                //                                             return shl.enteredAndSelectedPageValues.checkoutResultMessage;
                                //                                         });
                                self.checkoutResultMessage.subscribe(function(newValue)
                                                                     {
                                                                         shl.enteredAndSelectedPageValues.checkoutResultMessage = newValue;
                                                                     });
                                
                                self.checkoutResultMessagePlaceHolder(shl.enteredAndSelectedPageValues.checkoutResultMessagePlaceHolder);
                                 
                                //-------------------------------------------------------------------------------------
                                app.on('appClearCheckoutMessage:event').then(function(message) 
                                                                             {
                                                                                 //console.log("---- Module: checkout_with_stripe, appClearCheckoutMessage:Event handler()");
                                                                                 self.checkoutResultMessage("");
                                                                             });

                                app.on('appNavigationRequest:event').then(function(message) 
                                                                          {
                                                                              // The "message" contains full name of module (like "viewmodels/donation_info") 
                                                                              // WHERE the App would  like to be navigated.
                                
                                                                              //console.log("---- Module: checkout_with_stripe, appNavigationRequest:event handler(): Received message via Event: " + message);
                                                                              //self.receivedEventMessages.push(message);
                                
                                                                              // This page is a last one. So App's navigation to any previous page is always possible.
                                                                              app.trigger('appNavigationPermission:event', JSON.stringify({ CurrentPage: 'checkout_with_stripe', DestinationPage: message, StatusOfCurrentPage: 'checkout_with_stripe_VALIDATED' })); // To the previous page navigation is always available
                                
                                                                          }, self);

                                //---CheckoutPage_VisibleGoToPreviousPageButton----------------------------------------------------------------------------------

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton))
                                {
                                    self.CheckoutPage_VisibleGoToPreviousPageButton(true);
                                }
                                else
                                {
                                    self.CheckoutPage_VisibleGoToPreviousPageButton(shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton);
                                }
                                    
                                self.CheckoutPage_VisibleGoToPreviousPageButton.subscribe(function(newValue)
                                                                                          {
                                                                                              //console.log("---- activate().CheckoutPage_VisibleGoToPreviousPageButton.subscribe(): shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton (before) = " + shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton);
                                                                                              shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton = newValue;
                                                                                              //console.log("---- activate().CheckoutPage_VisibleGoToPreviousPageButton.subscribe(): shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton (after) = " + shl.enteredAndSelectedPageValues.CheckoutPage_VisibleGoToPreviousPageButton);
                                                                                          });
                                
                                //---CheckoutPage_TypeOfPaymentButtons_Enabled----------------------------------------------------------------------------------

                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled))
                                {
                                    self.CheckoutPage_TypeOfPaymentButtons_Enabled(true);
                                }
                                else
                                {
                                    self.CheckoutPage_TypeOfPaymentButtons_Enabled(shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled);
                                }
                                    
                                self.CheckoutPage_TypeOfPaymentButtons_Enabled.subscribe(function(newValue)
                                                                                         {
                                                                                             //console.log("---- activate().CheckoutPage_TypeOfPaymentButtons_Enabled.subscribe(): shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled (before) = " + shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled);
                                                                                             shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled = newValue;
                                                                                             //console.log("---- activate().CheckoutPage_TypeOfPaymentButtons_Enabled.subscribe(): shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled (after) = " + shl.enteredAndSelectedPageValues.CheckoutPage_TypeOfPaymentButtons_Enabled);
                                                                                         });
                                
                                //--- Recurring intervals -------------------------------------------------------------
                                
                                if (self.RecurringPayments_ListOfIntervals().length == 0)
                                {
                                    //console.log("---- Populating the RecurringPayments_ListOfIntervals with FRESH data from shl.serverDataSuppliesLocal[7].RecurringPayments_ListOfIntervals...");
                                    self.RecurringPayments_ListOfIntervals(shl.serverDataSuppliesLocal[7].RecurringPayments_ListOfIntervals);
                                    //console.log("---- So, now the self.RecurringPayments_ListOfIntervals().length = " + (self.RecurringPayments_ListOfIntervals().length).toString());
                                }
                                
                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.RecurringPayments_SelectedRecurringInterval))
                                {
                                    self.RecurringPayments_SelectedRecurringInterval(self.RecurringPayments_ListOfIntervals()[0].interval_code);
                                    shl.enteredAndSelectedPageValues.RecurringPayments_SelectedRecurringInterval = ko.utils.unwrapObservable(self.RecurringPayments_SelectedRecurringInterval);
                                }
                                else
                                {
                                    self.RecurringPayments_SelectedRecurringInterval(shl.enteredAndSelectedPageValues.RecurringPayments_SelectedRecurringInterval);
                                }
                                
                                self.RecurringPayments_SelectedRecurringInterval.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                         {
                                                                             //console.log('---- checkout_with_stripe(),RecurringPayments_SelectedRecurringInterval.subscribe(): The new of RecurringPayments_SelectedRecurringInterval is: ' + newValue);
                                                                             shl.enteredAndSelectedPageValues.RecurringPayments_SelectedRecurringInterval = newValue;
                                                                         });
                                                                          
                                // --- RecurringPayments_StatementDescriptor ------------------------------------------
                                
                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor))
                                {
                                    self.RecurringPayments_StatementDescriptor("Donation /Auto/");
                                }
                                else
                                {
                                    self.RecurringPayments_StatementDescriptor(shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor);
                                }
                                 
                                self.RecurringPayments_StatementDescriptor.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                                     {
                                                                                         //console.log('---- checkout_with_stripe(),RecurringPayments_StatementDescriptor.subscribe(): newValue = ' + newValue);
                                                                                         shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor = newValue;
                                                                                     });
                                   
                                self.RecurringPayments_StatementDescriptor_enterKeyProcessing = function(data, event)
                                                                                                {
                                                                                                    //console.log("---- RecurringPayments_StatementDescriptor_enterKeyProcessing()");
                                                                                                    if (event.which == 13)
                                                                                                    {
                                                                                                       //console.log("---- RecurringPayments_StatementDescriptor_enterKeyProcessing(): Enter Key Pressed!");
                                                                                                       event.cancelBubble = true;
                                                                                                       if (event.stopPropagation) event.stopPropagation();
                                                                                                       return false;
                                                                                                    }
                                                                                                    $(this).next().focus();
                                                                                                    return true;
                                                                                                };

                                // --- RecurringPayments_Duration -----------------------------------------------------
                                
                                self.activeFilter_RecurringIntervals = ko.observable(self.RecurringIntervals_Filters[0].filter); //set a default filter 
                                self.RecurringPayments_ListOfIntervals_Filtered = ko.computed(function() //See http://ryanrahlf.com/filtering-table-data-with-knockout-js/ and http://jsfiddle.net/rrahlf/EZUEF/6/
                                                                                     {
                                                                                         var result;
                                                                                         if (self.activeFilter_RecurringIntervals())
                                                                                         {
                                                                                             result = ko.utils.arrayFilter(self.RecurringPayments_ListOfIntervals(), self.activeFilter_RecurringIntervals());
                                                                                         }
                                                                                         else
                                                                                         {
                                                                                             result = self.RecurringPayments_ListOfIntervals();
                                                                                         }
                                                                                         return result; //.sort(self.activeSort());
                                                                                     });
                                
                                self.RecurringPayments_Duration = ko.computed({ read: function() // It means "to populate" the field
                                                                                      {
                                                                                            //console.log("---- self.RecurringPayments_Duration.computed().read(): self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration = " + self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration);
                                                                                            //console.log("---- self.RecurringPayments_Duration.computed().read(): self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code = " + self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code);
                                                                                            //console.log("---- self.RecurringPayments_Duration.computed().read(): (before) shl.enteredAndSelectedPageValues.RecurringPayments_Duration = " + shl.enteredAndSelectedPageValues.RecurringPayments_Duration);
                                                                                            
                                                                                            if (self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration)
                                                                                            {
                                                                                                shl.enteredAndSelectedPageValues.RecurringPayments_Duration = self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                shl.enteredAndSelectedPageValues.RecurringPayments_Duration = self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_default_duration;
                                                                                            }
                                                                                            
                                                                                            //console.log("---- self.RecurringPayments_Duration.computed().read(): (after) shl.enteredAndSelectedPageValues.RecurringPayments_Duration = " + shl.enteredAndSelectedPageValues.RecurringPayments_Duration);
                                                                                            return shl.enteredAndSelectedPageValues.RecurringPayments_Duration;
                                                                                      },
                                                                                write: function(newValue) // It means "to process entered value"
                                                                                       {
                                                                                           //console.log("---- self.RecurringPayments_Duration.computed().write(): (before) shl.enteredAndSelectedPageValues.RecurringPayments_Duration = " + shl.enteredAndSelectedPageValues.RecurringPayments_Duration);
                                                                                           shl.enteredAndSelectedPageValues.RecurringPayments_Duration = newValue;
                                                                                           //console.log("---- self.RecurringPayments_Duration.computed().write(): (before) self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration = " + self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration);
                                                                                           //console.log("---- self.RecurringPayments_Duration.computed().write(): (before) self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code = " + self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code);
                                                                                           
                                                                                           self.update_interval_entered_duration(self.RecurringPayments_ListOfIntervals(), self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code, newValue) 

                                                                                           //console.log("---- self.RecurringPayments_Duration.computed().write(): (after) shl.enteredAndSelectedPageValues.RecurringPayments_Duration = " + shl.enteredAndSelectedPageValues.RecurringPayments_Duration);
                                                                                           //console.log("---- self.RecurringPayments_Duration.computed().write(): (after) self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration = " + self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_entered_duration);
                                                                                           //console.log("---- self.RecurringPayments_Duration.computed().write(): (after) self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code = " + self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_code);
                                                                                           
                                                                                           self.RecurringPayments_Trigger(!ko.utils.unwrapObservable(self.RecurringPayments_Trigger));
                                                                                           
                                                                                           //if (!jQuery.isEmptyObject(newValue))
                                                                                           //{
                                                                                           //    $("#donor_NameOnCreditCard_Entered_Div").removeClass("has-error");
                                                                                           //    $("#donor_NameOnCreditCard_Entered_ErrorMessage").removeClass("visible").addClass("hidden");
                                                                                           //}
                                                                                       },
                                                                                owner: self
                                                                         }).extend({ notify: 'always' });
                                
                                self.RecurringPayments_Duration_enterKeyProcessing = function(data, event)
                                                                                     {
                                                                                         //console.log("---- RecurringPayments_Duration_enterKeyProcessing()");
                                                                                         if (event.which == 13)
                                                                                         {
                                                                                            //console.log("---- RecurringPayments_Duration_enterKeyProcessing(): Enter Key Pressed!");
                                                                                            event.cancelBubble = true;
                                                                                            if (event.stopPropagation) event.stopPropagation();
                                                                                            return false;
                                                                                         }
                                                                                         $(this).next().focus();
                                                                                         return true;
                                                                                     };

                                self.RecurringPayments_IntervalUnit = ko.computed(function()
                                                                                  {
                                                                                      var RecurringPayments_IntervalUnit_ReturnedValue = self.RecurringPayments_ListOfIntervals_Filtered()[0].interval_description + "(s)";
                                                                                      return RecurringPayments_IntervalUnit_ReturnedValue;
                                                                                  });
                                
                                // --- RecurringPayments_DayOfPayment -------------------------------------------------
                                
                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.RecurringPayments_DayOfPayment))
                                {
                                    self.RecurringPayments_DayOfPayment("2");
                                    shl.enteredAndSelectedPageValues.RecurringPayments_DayOfPayment = ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment);
                                }
                                else
                                {
                                    self.RecurringPayments_DayOfPayment(shl.enteredAndSelectedPageValues.RecurringPayments_DayOfPayment);
                                }
                                 
                                self.RecurringPayments_DayOfPayment.subscribe(function(newValue) // Subscribe to the observable. This function will be called whenver 'fruit' is changed (either by user or programmatically)
                                                                              {
                                                                                  //console.log('---- checkout_with_stripe(),RecurringPayments_DayOfPayment.subscribe(): newValue = ' + newValue);
                                                                                  shl.enteredAndSelectedPageValues.RecurringPayments_DayOfPayment = newValue;
                                                                              });
                                   
                                self.RecurringPayments_DayOfPayment_enterKeyProcessing = function(data, event)
                                                                                         {
                                                                                             //console.log("---- RecurringPayments_DayOfPayment_enterKeyProcessing()");
                                                                                             if (event.which == 13)
                                                                                             {
                                                                                                //console.log("---- RecurringPayments_DayOfPayment_enterKeyProcessing(): Enter Key Pressed!");
                                                                                                event.cancelBubble = true;
                                                                                                if (event.stopPropagation) event.stopPropagation();
                                                                                                return false;
                                                                                             }
                                                                                             $(this).next().focus();
                                                                                             return true;
                                                                                         };

                                // --- RecurringPayments_SkipFirstMonth -----------------------------------------------
                                
                                self.RecurringPayments_SkipFirstMonth = ko.observable(shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth);
                                self.RecurringPayments_SkipFirstMonth.subscribe(function(newValue)
                                                                                {
                                                                                    //console.log("---- Activate, self.RecurringPayments_SkipFirstMonth.subscribe(): shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth (before) = " + shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth);
                                                                                    shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth = !shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth;
                                                                                    //console.log("---- Activate, self.RecurringPayments_SkipFirstMonth.subscribe(): shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth (after) = " + shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth);
                                                                                });
                                
                                // --- RecurringPayments_SkipFirstMonth_Visible ---------------------------------------
                                                                
                                self.RecurringPayments_SkipFirstMonth_Visible = ko.observable(shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible);
                                self.RecurringPayments_SkipFirstMonth_Visible = ko.computed({ read: function()
                                                                                                    {
                                                                                                        //console.log("---- Activate, self.RecurringPayments_SkipFirstMonth_Visible.computed(): shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible (before) = " + shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible);
                                                                                                        
                                                                                                        var RecurringPayments_DayOfPayment_JustCopy = ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment);
                                                                                                        
                                                                                                        var rightNow = new Date();
                                                                                           
                                                                                                        if (parseInt(ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment),10) >= rightNow.getDate())
                                                                                                        {
                                                                                                            shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible = true;
                                                                                                            return true;
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible = false;
                                                                                                            return false;
                                                                                                        }
                                                                                                    },
                                                                                              write: function(newValue)
                                                                                                     {    
                                                                                                         shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible = newValue;
                                                                                                         //console.log("---- Activate, self.RecurringPayments_SkipFirstMonth_Visible.compute(),write: shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible (after) = " + shl.enteredAndSelectedPageValues.RecurringPayments_SkipFirstMonth_Visible);
                                                                                                     },
                                                                                              owner: self
                                                                                           }).extend({ notify: 'always' });
                                
                                //--- StyleClassNameForHighlightingPartOfTextArea -------------------------------------
                                
                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.StyleClassNameForHighlightingPartOfTextArea))
                                {
                                    self.StyleClassNameForHighlightingPartOfTextArea("highlight-part-of-text");
                                    shl.enteredAndSelectedPageValues.StyleClassNameForHighlightingPartOfTextArea = ko.utils.unwrapObservable(self.StyleClassNameForHighlightingPartOfTextArea);
                                }
                                else
                                {
                                    self.StyleClassNameForHighlightingPartOfTextArea(shl.enteredAndSelectedPageValues.StyleClassNameForHighlightingPartOfTextArea);
                                }
                                
                                // --- RecurringPayments_Verdict ------------------------------------------------------
                                
                                if (jQuery.isEmptyObject(shl.enteredAndSelectedPageValues.RecurringPayments_Verdict))
                                {
                                    null;
                                }
                                else
                                {
                                    self.RecurringPayments_Verdict(shl.enteredAndSelectedPageValues.RecurringPayments_Verdict);
                                }
                                 
                                self.RecurringPayments_Verdict = ko.computed({ read: function() // It means "to populate" the field
                                                                                     {
                                                                                           if (shl.enteredAndSelectedPageValues.TestDebugMode)
                                                                                           {
                                                                                               self.populateFieldsValuesForTestPurpose();
                                                                                           }

                                                                                           var totalDonationAmount_inDollars = (parseFloat(((shl.enteredAndSelectedPageValues.totalDonationAmount_inCents == null || isNaN(parseFloat(shl.enteredAndSelectedPageValues.totalDonationAmount_inCents))) ? 0.0 : parseFloat(shl.enteredAndSelectedPageValues.totalDonationAmount_inCents)) ) / 100.0).toString();
                                                                                           console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): totalDonationAmount_inDollars = " + totalDonationAmount_inDollars.toString());
                                                                                           console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): shl.enteredAndSelectedPageValues.totalDonationAmount_inCents = " + shl.enteredAndSelectedPageValues.totalDonationAmount_inCents);
                                                                                           var rightNow = new Date();
                                                                                           var DateOfFirstCharge_Month = 0;      
                                                                                           var DateOfFirstCharge_Year = 0;      
                                                                                           
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): rightNow.getDate() = " + (rightNow.getDate()).toString() + " RecurringPayments_DayOfPayment = " + ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment));
                                                                                           if (parseInt(ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment),10) < rightNow.getDate())
                                                                                           {
                                                                                               //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): Case: rightNow.getDate() > RecurringPayments_DayOfPayment");
                                                                                               
                                                                                               if ((rightNow.getMonth() + 1) == 12)
                                                                                               {
                                                                                                   DateOfFirstCharge_Month = 1;
                                                                                                   DateOfFirstCharge_Year = rightNow.getFullYear() + 1;
                                                                                               }
                                                                                               else
                                                                                               {
                                                                                                   DateOfFirstCharge_Month = rightNow.getMonth() + 2; // The first payment will happen on next month
                                                                                                   DateOfFirstCharge_Year = rightNow.getFullYear();
                                                                                               }
                                                                                           }
                                                                                           else // RecurringPayments_DayOfPayment >= rightNow.getDate()
                                                                                           {
                                                                                               //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): Case: rightNow.getDate() <= RecurringPayments_DayOfPayment");
                                                                                               if (ko.utils.unwrapObservable(self.RecurringPayments_SkipFirstMonth))
                                                                                               {
                                                                                                   if ((rightNow.getMonth() + 1) == 12) // (it's 0-based)
                                                                                                   {
                                                                                                       DateOfFirstCharge_Month = 1;
                                                                                                       DateOfFirstCharge_Year = rightNow.getFullYear() + 1;
                                                                                                   }
                                                                                                   else
                                                                                                   {
                                                                                                       DateOfFirstCharge_Month = rightNow.getMonth() + 2;
                                                                                                       DateOfFirstCharge_Year = rightNow.getFullYear();
                                                                                                   }
                                                                                               }
                                                                                               else
                                                                                               {
                                                                                                   DateOfFirstCharge_Month = rightNow.getMonth() + 1; // A month is staying the same (it's 0-based)
                                                                                                   DateOfFirstCharge_Year = rightNow.getFullYear();
                                                                                               }
                                                                                           }
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): DateOfFirstCharge_Month = " + (DateOfFirstCharge_Month).toString() + " DateOfFirstCharge_Year = " + (DateOfFirstCharge_Year).toString());    
                                                                                                 
                                                                                           var DateOfFirstCharge_FullDateAsString = (DateOfFirstCharge_Year).toString() + "/" + (DateOfFirstCharge_Month).toString() + "/" + ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment);
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): DateOfFirstCharge_FullDateAsString = " + DateOfFirstCharge_FullDateAsString);    

                                                                                           var DateOfFirstCharge_FullDate = new Date(DateOfFirstCharge_FullDateAsString);
                                                                                           var DateOfFirstCharge_FullDateAsStringFinal = (DateOfFirstCharge_FullDate.getMonth() + 1).toString() + "/" + (DateOfFirstCharge_FullDate.getDate()).toString() + "/" + (DateOfFirstCharge_FullDate.getFullYear()).toString();
                                                                                           shl.enteredAndSelectedPageValues.RecurringPayments_DateOfFirstCharge = DateOfFirstCharge_FullDateAsStringFinal;
                                                                                           
                                                                                           //---------------------------------------------------------------------------------------
                                                                                           
                                                                                           var DateOfNextCharge_Month = 0;      
                                                                                           var DateOfNextCharge_Year = 0;      
                                                                                           
                                                                                           if ((DateOfFirstCharge_FullDate.getMonth() + 1) == 12)
                                                                                           {
                                                                                               DateOfNextCharge_Month = 1;
                                                                                               DateOfNextCharge_Year = DateOfFirstCharge_FullDate.getFullYear() + 1;
                                                                                           }
                                                                                           else
                                                                                           {
                                                                                               DateOfNextCharge_Month = DateOfFirstCharge_FullDate.getMonth() + 2; // The first payment will happen on next month
                                                                                               DateOfNextCharge_Year = DateOfFirstCharge_FullDate.getFullYear();
                                                                                           }
                                                                                                 
                                                                                           var DateOfNextCharge_FullDateAsString = (DateOfNextCharge_Year).toString() + "/" + (DateOfNextCharge_Month).toString() + "/" + ko.utils.unwrapObservable(self.RecurringPayments_DayOfPayment);
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): DateOfNextCharge_FullDateAsString = " + DateOfNextCharge_FullDateAsString);    

                                                                                           var DateOfNextCharge_FullDate = new Date(DateOfNextCharge_FullDateAsString);
                                                                                           var DateOfNextCharge_FullDateAsStringFinal = (DateOfNextCharge_FullDate.getMonth() + 1).toString() + "/" + (DateOfNextCharge_FullDate.getDate()).toString() + "/" + (DateOfNextCharge_FullDate.getFullYear()).toString();
                                                                                           shl.enteredAndSelectedPageValues.RecurringPayments_DateOfNextCharge = DateOfNextCharge_FullDateAsStringFinal;
                                                                                           
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): DateOfFirstCharge_FullDateAsStringFinal = " + DateOfFirstCharge_FullDateAsStringFinal);
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): RecurringPayments_Duration = " + ko.utils.unwrapObservable(self.RecurringPayments_Duration));
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): shl.enteredAndSelectedPageValues.RecurringPayments_Duration = " + shl.enteredAndSelectedPageValues.RecurringPayments_Duration);
                                                                                           
                                                                                           // Do not remove the following block. Mostly those assignments are playing a role of indicators
                                                                                           // for KnockoutJS that the RecurringPayments_Verdict observable depends of all other mentioned
                                                                                           // observables. I did not find any other way to indicate this fact:
                                                                                           var RecurringPayments_SkipFirstMonth_JustCopy = ko.utils.unwrapObservable(self.RecurringPayments_SkipFirstMonth);
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): RecurringPayments_SkipFirstMonth_JustCopy = " + RecurringPayments_SkipFirstMonth_JustCopy);
                                                                                           var RecurringPayments_Trigger_JustCopy = self.RecurringPayments_Trigger();
                                                                                           var RecurringPayments_Duration_JustCopy = shl.enteredAndSelectedPageValues.RecurringPayments_Duration;
                                                                                           var RecurringPayments_SelectedRecurringInterval_JustCopy = ko.utils.unwrapObservable(self.RecurringPayments_SelectedRecurringInterval);
                                                                                           var RecurringPayments_StatementDescriptor_JustCopy = ko.utils.unwrapObservable(self.RecurringPayments_StatementDescriptor);
                                                                                           
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor = " + shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor);
                                                                                           
                                                                                           var RecurringPayments_Duration_Tmp = shl.enteredAndSelectedPageValues.RecurringPayments_Duration + ' times'; // For followed searching for highlighting purposes
                                                                                           var RecurringPayments_SelectedRecurringInterval_Tmp = "every " + shl.enteredAndSelectedPageValues.RecurringPayments_SelectedRecurringInterval;

                                                                                           var RecurringPayments_VerdictText = "Overall description of the Recurring Payments Schedule, you have set up:" + "\n" +
                                                                                                                               "Your bank account will be charged $" + totalDonationAmount_inDollars + " " + RecurringPayments_SelectedRecurringInterval_Tmp + " and as long as " + RecurringPayments_Duration_Tmp + "." + "\n" + 
                                                                                                                               "Closest date of the first payment is " + DateOfFirstCharge_FullDateAsStringFinal + "\n" + 
                                                                                                                               "Next payment scheduled on " + DateOfNextCharge_FullDateAsStringFinal + " etc." + "\n" +
                                                                                                                               "In your bank balance statement the transaction will be marked as" + "\n" + 
                                                                                                                               "\"" + shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor + "\"";
                                                                                         
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): RecurringPayments_VerdictText = " + RecurringPayments_VerdictText);
                                                                                           
                                                                                           shl.enteredAndSelectedPageValues.RecurringPayments_Verdict = RecurringPayments_VerdictText;
                                                                                           
                                                                                           // Setting up templates which should be highlighted in the text. See ...\lib\durandal\js\plugins\highlightedText.js plugin
                                                                                           self.bit_of_text_1(totalDonationAmount_inDollars);
                                                                                           self.bit_of_text_2(shl.enteredAndSelectedPageValues.RecurringPayments_SelectedRecurringInterval);
                                                                                           self.bit_of_text_3(RecurringPayments_Duration_Tmp);
                                                                                           self.bit_of_text_4(DateOfFirstCharge_FullDateAsStringFinal);
                                                                                           self.bit_of_text_5(DateOfNextCharge_FullDateAsStringFinal);
                                                                                           self.bit_of_text_6(shl.enteredAndSelectedPageValues.RecurringPayments_StatementDescriptor);
                                                                                           //console.log("---- checkout_with_stripe(),RecurringPayments_Verdict.computed(): ");
                                                                                           
                                                                                           return shl.enteredAndSelectedPageValues.RecurringPayments_Verdict;
                                                                                     },
                                                                               write: function(newValue) // It means "to process entered value"
                                                                                      {
                                                                                          shl.enteredAndSelectedPageValues.RecurringPayments_Verdict = newValue;
                                                                                      },
                                                                               owner: self
                                                                        }).extend({ notify: 'always' });
                            
                                //------------------------------------------------------------------------------------- 
                                    
                                return;
                            };

    vm.prototype.toJSON = function()
                          {
                              //console.log(this);
                              var copy = ko.toJS(this); //easy way to get a clean copy
    
                              delete copy.listOfCountriesAndRegions_orig;
                              delete copy.listOfCountriesAndRegions_Tribute;
                              delete copy.listOfCountriesAndRegions_BillingAddr;
                              delete copy.listOfCountriesAndRegions_MailingAddr;
                          
                              delete copy.donor_MailingAddr_FilteredListOfCountries;
                              delete copy.donor_MailingAddr_ListOfRegions;
                              delete copy.donor_BillingAddr_ListOfCountries;
                              delete copy.donor_BillingAddr_ListOfRegions;
                              delete copy.billingAddr_FilteredListOfRegions;
                              delete copy.billingAddr_FilteredListOfRegions;

                              delete copy.getListOfDesignationsURI;
                              delete copy.getListOfCountriesAndRegionsURI;
                              delete copy.getListOfReasonsToDonateURI;
                              delete copy.getListOfDonorToSBCAffilationsURI;
                              delete copy.getListOfDonorToTributeAffilationsURI;
                          
                              delete copy.filteredArrayOfODSParameters;
                              delete copy.listOfODSParameters;
                              //delete copy.username;
                              //delete copy.password;
                              //delete copy.filteredRecords;
                          
                              //console.log("copy", copy);
                          
                              return copy; //return the copy to be serialized
                          };

    return vm;

});
