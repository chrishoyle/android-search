const
    Router = require('express').Router()
;
// API versioning just in case

module.exports = function(config){
    let api_versions = [
        // Add newer versions to top of this list
        { name : 'v1', router : require('./v1') }
    ]
    
    // Set all the api routes
    api_versions.forEach((version, i)=>{
        let router = version.router(config);
        if(i == 0){
            Router.use('/', router)
        }
        Router.use(`/${version.name}`, router)
    })

    return Router
}