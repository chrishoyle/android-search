class QueryNode 
{
    constructor(q){
        if(q instanceof QueryNode){
            this.query = "";
        }else{
            
        }
        this.query = q || "";
        this.join = "AND";
        this.next = null;
    }

    AND(node){
        this.join = "AND";
        if(node instanceof QueryNode){
            this.next = node;
        }
        return this;
    }

    OR(node){
        this.join = "OR";
        this.next = new QueryNode(node);
        return this;
    }

    getQuery(){
        let q = this.query;
        if(this.next)
            q += ` ${this.join} (${this.next.getQuery()})`; 

        return `${q}`;
    }

    toJSON(){
        let json = {
            query : this.query,
            join : this.join,
            next : this.next && this.next.toJSON()
        }
        return json;
    }
}

class Query 
{
    constructor(){
        this.queries = [];
    }

    AND(){

    }

    OR(){

    }

    getQuery(){

    }
}
let one = new QueryNode("A").AND( new QueryNode("B") );
let two = new QueryNode("C").AND( new QueryNode("D") );
console.log(one.getQuery(), two.getQuery());
let root = new QueryNode(one).AND(two);
root.AND(new QueryNode("B"))

console.log(root.getQuery());
console.log(root.toJSON());
