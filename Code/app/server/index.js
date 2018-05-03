const
    express      = require('express'),
    debug        = require('debug')('server'),
    path         = require('path'),
    compression  = require('compression'),
    // favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    api          = require("./api"),
    // Resizer      = require("express-resizer"),
    PORT         = process.env.PORT || 5000
;

module.exports = function( app, config ){
    // let myResizer = new Resizer(config.layouts_dir)
    // myResizer.attach("squareThumbs")
    //     .from("/")
    // //     .resizeAndCrop({
    // //         width: 100,
    // //         height: 100,
    // //     })
    // //     .quality(50)
    //     .to("../thumbs")
    // Useful middleware
    app.use(compression())
    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    // Setup routes for api
    app.use('/api', api(config))

    // Set up static folders
    
    // app.use(require('express-resize'))
    // app.use(myResizer);
    app.use('/layouts', express.static(config.layouts_dir))
    app.use(express.static(path.resolve("client", "dist")))

    // Reroute all other routes to index.html
    app.get('*', 
        (req, res, next)=>{
            res.sendFile(path.resolve("client", "index.html"))
        }
    )

    // Run the app on port 3000
    let port = config.port || PORT;
    app.listen(port, (err)=>{
        if(err)
            throw err
        debug(`App running on http://localhost:${port}`)
    })
}