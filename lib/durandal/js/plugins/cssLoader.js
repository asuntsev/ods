// See http://stackoverflow.com/questions/16063028/durandal-js-is-it-possible-to-load-view-specific-css-on-demand-with-the-view
define( [ 'jquery' ], function($)
                      {
                          //console.log("!!!! cssLoader.js");
                          return { loadCss:         function(fileName)
                                                    {
                                                        //console.log("---- cssLoader.js, loadCss(): fileName = " + fileName);
                                                        //console.log("---- cssLoader.js, loadCss(): Location: = " + window.location.pathname);
                                                        var cssTag = document.createElement("link")
                                                        cssTag.setAttribute("rel", "stylesheet")
                                                        cssTag.setAttribute("type", "text/css")
                                                        cssTag.setAttribute("href", fileName)
                                                        cssTag.setAttribute("class", "__dynamicCss")
                                                    
                                                        document.getElementsByTagName("head")[0].appendChild(cssTag)
                                                    },
                                   removeModuleCss: function() 
                                                    {
                                                        $(".__dynamicCss").remove();
                                                    }
                                 }
                      }
);
