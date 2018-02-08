// See http://www.knockmeout.net/2011/06/fun-with-highlighting-in-knockoutjs.html
define( [ 'knockout', 'jquery', 'shell/shell', 'bootstrap', 'bootstrap-select' ],
function(ko, $, shl)
{
    return { install: function()
                      {
                          ko.bindingHandlers.highlightedText = {update: function(element, valueAccessor) 
                                                                        {
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin. update(): (0)");
                                                                            var options = valueAccessor();
                                                                            var sourceText = ko.utils.unwrapObservable(options.text);
                                                                            
                                                                            var search1 = "";
                                                                            var search2 = "";
                                                                            var search3 = "";
                                                                            var search4 = "";
                                                                            var search5 = "";
                                                                            var search6 = "";
                                                                            
                                                                            if (ko.utils.unwrapObservable(options.what_to_highlight_1) === undefined || (ko.utils.unwrapObservable(options.what_to_highlight_1)).length == 0)
                                                                            {
                                                                                search1 = "";
                                                                            }
                                                                            else
                                                                            {
                                                                                search1 = ko.utils.unwrapObservable(options.what_to_highlight_1);
                                                                            }
                                                                            
                                                                            if (ko.utils.unwrapObservable(options.what_to_highlight_2) === undefined || (ko.utils.unwrapObservable(options.what_to_highlight_2)).length == 0)
                                                                            {
                                                                                search2 = "";
                                                                            }
                                                                            else
                                                                            {
                                                                                search2 = ko.utils.unwrapObservable(options.what_to_highlight_2);
                                                                            }
                                                                            
                                                                            if (ko.utils.unwrapObservable(options.what_to_highlight_3) === undefined || (ko.utils.unwrapObservable(options.what_to_highlight_3)).length == 0)
                                                                            {
                                                                                search3 = "";
                                                                            }
                                                                            else
                                                                            {
                                                                                search3 = ko.utils.unwrapObservable(options.what_to_highlight_3);
                                                                            }
                                                                            
                                                                            if (ko.utils.unwrapObservable(options.what_to_highlight_4) === undefined || (ko.utils.unwrapObservable(options.what_to_highlight_4)).length == 0)
                                                                            {
                                                                                search4 = "";
                                                                            }
                                                                            else
                                                                            {
                                                                                search4 = ko.utils.unwrapObservable(options.what_to_highlight_4);
                                                                            }
                                                                            
                                                                            if (ko.utils.unwrapObservable(options.what_to_highlight_5) === undefined || (ko.utils.unwrapObservable(options.what_to_highlight_5)).length == 0)
                                                                            {
                                                                                search5 = "";
                                                                            }
                                                                            else
                                                                            {
                                                                                search5 = ko.utils.unwrapObservable(options.what_to_highlight_5);
                                                                            }
                                                                            
                                                                            if (ko.utils.unwrapObservable(options.what_to_highlight_6) === undefined || (ko.utils.unwrapObservable(options.what_to_highlight_6)).length == 0)
                                                                            {
                                                                                search6 = "";
                                                                            }
                                                                            else
                                                                            {
                                                                                search6 = ko.utils.unwrapObservable(options.what_to_highlight_6);
                                                                            }
                                                                            
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: search1 = >" + search1 + "<");
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: search2 = >" + search2 + "<");
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: search3 = >" + search3 + "<");
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: search4 = >" + search4 + "<");
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: search5 = >" + search5 + "<");
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: search6 = >" + search6 + "<");

                                                                            var css = ko.utils.unwrapObservable(options.css);
                                                                            
                                                                            if (options.sanitize) 
                                                                            {
                                                                                sourceText = $('<div/>').text(sourceText).html(); //could do this or something similar to escape HTML before replacement, if there is a risk of HTML injection in this value
                                                                            }
                                                                            
                                                                            var replacement1 = "";
                                                                            var replacement2 = "";
                                                                            var replacement3 = "";
                                                                            var replacement4 = "";
                                                                            var replacement5 = "";
                                                                            var replacement6 = "";
                                                                            
                                                                            if (search1.length > 0)
                                                                            {
                                                                                replacement1 = '<span class="' + css + '">' + search1 + '</span>';
                                                                                sourceText = sourceText.replace(new RegExp(search1, 'g'), replacement1);
                                                                                //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 1 passed): = " + sourceText);
                                                                            }
                                                                            
                                                                            if (search2.length > 0)
                                                                            {
                                                                                replacement2 = '<span class="' + css + '">' + search2 + '</span>';
                                                                                sourceText = sourceText.replace(new RegExp(search2, 'g'), replacement2);
                                                                                //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 2 passed): = " + sourceText);
                                                                            }
                                                                            
                                                                            if (search3.length > 0)
                                                                            {
                                                                                replacement3 = '<span class="' + css + '">' + search3 + '</span>';
                                                                                sourceText = sourceText.replace(new RegExp(search3, 'g'), replacement3);
                                                                                //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 3 passed): = " + sourceText);
                                                                            }
                                                                            
                                                                            if (search4.length > 0)
                                                                            {
                                                                                replacement4 = '<span class="' + css + '">' + search4 + '</span>';
                                                                                sourceText = sourceText.replace(new RegExp(search4, 'g'), replacement4);
                                                                                //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 4 passed): = " + sourceText);
                                                                            }
                                                                            
                                                                            if (search5.length > 0)
                                                                            {
                                                                                replacement5 = '<span class="' + css + '">' + search5 + '</span>';
                                                                                sourceText = sourceText.replace(new RegExp(search5, 'g'), replacement5);
                                                                                //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 5 passed): = " + sourceText);
                                                                            }
                                                                            
                                                                            if (search6.length > 0)
                                                                            {
                                                                                replacement6 = '<span class="' + css + '">' + search6 + '</span>';
                                                                                sourceText = sourceText.replace(new RegExp(search6, 'g'), replacement6);
                                                                                //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 6 passed): = " + sourceText);
                                                                            }

                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: sourceText (point 7 passed): = " + sourceText);
                                                                            element.innerHTML = sourceText;
                                                                            //console.log("---- ko.bindingHandlers.highlightedText plugin: before return from update()");
                                                                            
                                                                            //element.innerHTML = sourceText.replace(new RegExp(search1, 'g'), replacement1).replace(new RegExp(search2, 'g'), replacement2).replace(new RegExp(search3, 'g'), replacement3).replace(new RegExp(search4, 'g'), replacement4).replace(new RegExp(search5, 'g'), replacement5).replace(new RegExp(search6, 'g'), replacement6);
                                                                        }
                                                               };
                      }
           }
});
