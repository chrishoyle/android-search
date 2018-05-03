/**
 * Help find what the user wants before the user can applying
 * a refined filtered search
 * @param {*} query
 */

const query_elements = [
    {
        type : "intersection",
        values : ["and", "with", "plus"]
    },
    { 
        type : "union" ,
        values : ["or"]
    },
    {
        type : "difference",
        values : ["but not", "without", "minus", "and not"]
    },
    {
        type :"colors",
        values : []
    },
    {
        type : "UI Elements",
        values : ""
    }
]

module.exports = function(query, colors=true){

}