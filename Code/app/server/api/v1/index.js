const Router = require('express').Router()
const axios = require('axios')
const url = require('url')

module.exports = function(config){
    let info = {
        "status" : 200,
        "version" : "1.0.0",
    }
    
    Router.get('/', (req, res, next)=>{
        res.json(info)
    })
 
    Router.get('/query', (req, res, next)=>{
        let query = req._parsedUrl.query;
        // Get result from solr 
        axios.get(`${config.solr_url}/select?${query}`)
            .then((response)=>{
                res.json(response.data)
            })
            .catch((err)=>{
                res.json({"status" : 500, "message" : "The index might be down right now"})
            })
    });

    Router.get('*', (req, res, next)=>{
        res.json({status : 400, message : "not a recognized route"})
    })

    return Router;
}