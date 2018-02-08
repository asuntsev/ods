define( [ 'knockout', 'jquery', 'bootstrap', 'bootstrap-select' ],
       function(ko, $)
       {
           return { install: function()
                             {
                                 //console.log("!!!! radiochecked.js");
                                 ko.bindingHandlers.radiochecked = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // the checked binding depends on the element having an initial value
        // we need to allow bindings that potentially set it to be applied first
        setTimeout(function () {
            var options = ko.utils.unwrapObservable(valueAccessor());
            //console.log('---- 1');
            if (options.checked()) {
            //console.log('---- 2');
                options.selected(element.value);
            }
            options.selected.subscribe(function (newValue) {
                                           //console.log('---- newValue = ' + newValue);
                options.checked(newValue === element.value);
            });
            //console.log('---- 3');
            ko.applyBindingsToNode(element, { checked: options.selected });
        }, 0);
    }
};
                                 }
                  }
       });

