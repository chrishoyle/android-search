// Set the current directory of the node process to
// the directory in which this script is running.
// This makes path resolution a lot simpler
process.chdir(__dirname)

// Load dependencies
const 
    app         = require('express')(),
    chokidar    = require('chokidar'),
    webpack     = require('webpack'),
    wpconfig    = require('./webpack.config'), 
    debug       = require('debug')('dev'),
    path        = require('path'),
    minimist    = require('minimist')
;
let appRunning = false;

// Parse the command line args
let args = minimist(process.argv.slice(2));

// Look for config file relative to Code directory
let config_src = path.resolve("..", args.c || args.config || "config.json")

let config = {}
try{
    config = require(config_src)
    // Resolve path to parse-dir based on based on the 'Code' directory
    // then make the path absolute
    config.layouts_dir = path.resolve("..", config.layouts_dir || config.parse_dir)
    debug(`Using configuration file at ${config_src}`)
}
catch(e){
    debug(`Configuration file at ${config_src} was not found or is invalid`)
}
// Set development enviornment   
// Performs webpack hot-reloading 
if(process.env.NODE_ENV !== 'production'){
    debug(`setting up development environment`)
    let compiler = webpack(wpconfig);
    let middleware = require("webpack-dev-middleware")(compiler, {
        noInfo: true, 
        quiet : true,
        publicPath: wpconfig.output.publicPath
    })
    middleware.waitUntilValid(()=>{
        debug("Module built")
        if(!appRunning)
            startApplication()
    });
    debug("Building dist bundle")
    app.use(middleware)
    app.use(require("webpack-hot-middleware")(compiler))
}
else
{
    startApplication();
}

function startApplication(){
    // Launch the server
    debug("Starting application")
    appRunning = true;
    let server = require("./server")(app, config)
}

