requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.4.0',
        'knockout.validation': '../lib/knockout/knockout-validation-2.0.3',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'bootstrap-select': '../lib/bootstrap/js/bootstrap-select',
        'jquery': '../lib/jquery/jquery-3.1.1',
        'shell': './viewmodels'/*,
        'stripe': 'https://js.stripe.com/v2/',
        'stripe-checkout': 'https://checkout.stripe.com/checkout.js'*/
    },
    shim: { 'bootstrap':           { deps: ['jquery'],
                                     exports: 'jQuery' },
            'knockout.validation': { deps: ["knockout"] }/*,
            'stripe':              { exports: 'Stripe' }*/
          }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'backend'],  function (system, app, viewLocator, backend) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    //console.log("---- Main() started");

    var Backend    = backend;
    //Original: 
    //window.getServerDataSuppliesService = new Backend('http://localhost:5000/SBCOnlineGivingAPI/getServerDataSupplies');
    //AWS:
    window.getServerDataSuppliesService = new Backend('https://qnp9dfkpha.execute-api.us-east-1.amazonaws.com/dev');

    app.title = 'Online Giving';

    app.configurePlugins({
        router:true,
        dialog: true,
        selectPicker: true,
        realVisible: true,
        bsChecked: true,
        cssLoader: true,
        initValue: true,
        highlightedText: true/*,
        radiochecked: true,
        initializeValue: true*/
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});

