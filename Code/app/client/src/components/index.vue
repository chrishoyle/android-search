<!--
    TODO:
        Extract the components for use elsewhere in app
-->
<template>
    <div class="root">
        <div class="nav" v-bind:class="{open : sidebar_open}">
            <div v-on:click="toggleSidebar"><i class="fa fa-bars" aria-hidden="true"></i></div>
        </div>
        <div class="sidebar" v-bind:class="{open : sidebar_open}">
            <div class="sidebar_content">
              <br><br><br>
              <span><h1 class="display-5" style="color:black; display:inline-block;float:left; margin:0px 0px 0px 40px;">&lt;guigle&gt;&nbsp;</h1><h5 style="color:black; display:inline-block; float:left; margin:15px 0px 0px 5px;">is a </h5></span><br> <p style="color:black">powerful Android GUI search engine.</p>
            </div>
        </div>
        <div class="content">
            <!-- LOGO/TITLE -->
            <div class="title">
                <span style="color:rgba(0,0,0,.25);"><</span>{{ title }}<span style="color:rgba(0,0,0,.25);">></span>
            </div>
            <!-- Searchbox -->
            <div class="input">

                <search-suggestion
                  class="search_box"
                  placeholder="Search"
                  :showBtn="false"
                  :datas="lists"
                  v-model="global.search_term"
                  @input="handleInput"
                  @selected="handleSelected"
                  @click="this.select()"
                  @submitByEnter="handleSubmitByEnter"
                ></search-suggestion>
                <div class="side_btns">
                    <button class="search_btn btn" v-on:click="gotoSearchPage"><span class="fa fa-search mglass"></span></button>
                    <div class="search"></div>
                </div>
            </div>

            <!-- Featured layouts -->
            <div class="features">
                <div class="feature" v-for="feature in features">
                    <img v-bind:src="feature.screenshot_location" class="featurette" @click="openLayoutModal(feature.id)">
                </div>
            </div>

        </div>
        <modal v-bind:open="isShowingLayoutModal" @close="closeLayoutModal">
            <layout-view ref="layout" v-bind:id="layout_id"></layout-view>
        </modal>
    </div>
</template>

<script>
import axios from 'axios'
import modal from './components/modal.vue'
import layoutView from './components/layout_view.vue'

export default {
    components: {
        modal,
    },

    methods : {
        // toggle the sidebar
        toggleSidebar : function(){
            this.sidebar_open = !this.sidebar_open;
        },
        gotoSearchPage : function(){
            this.$router.push({path:`/search`, params:{ doSearch : false}});
        },
        openLayoutModal : function(id){
            console.log(id);
            this.isShowingLayoutModal = true;
            this.$nextTick(()=>{
                this.$refs.layout.getLayoutById(id);
            })
        },

        closeLayoutModal : function(){
            this.isShowingLayoutModal = false;
        },

        //autosuggestion
        handleInput(ev) {
          global.search_term = ev.target.value.toString()
          this.lists = (function () {
            var arr = [];
            if(ev.target.value.slice(-1) === " " && ev.target.value.slice(-5) !== " AND " && ev.target.value.slice(-4) !== " OR " && ev.target.value.includes(":") === true){
              arr.push({value: "AND"})
              arr.push({value: "OR"})
            }
            if((ev.target.value.slice(-1) === "A" && ev.target.value.slice(-2) === " A" && ev.target.value.includes(":") === true)
            || (ev.target.value.slice(-1) === "N" && ev.target.value.slice(-3) === " AN" && ev.target.value.includes(":") === true)
            || (ev.target.value.slice(-1) === "D" && ev.target.value.slice(-4) === " AND" && ev.target.value.includes(":") === true)
            || (ev.target.value.slice(-1) === "O" && ev.target.value.slice(-2) === " O" && ev.target.value.includes(":") === true)
            || (ev.target.value.slice(-1) === "R" && ev.target.value.slice(-3) === " OR" && ev.target.value.includes(":") === true)){
              arr.push({value: "AND"})
              arr.push({value: "OR"})
            }
            if(ev.target.value.slice(-5) === " AND " || ev.target.value.slice(-4) === " OR "){
              arr.push({value: "color:"})
              arr.push({value: "ui:"})
              arr.push({value: "appname:"})
              arr.push({value: "text:"})
            }
            if(ev.target.value.slice(-3) === "ui:" || ev.target.value.slice(-2) === "ui"){
              arr.push({value: "ui:button"})
              arr.push({value: "ui:list"})
              arr.push({value: "ui:datepicker"})
            }
            if(ev.target.value.slice(-6) === "color:" || ev.target.value.slice(-3) === "col" || ev.target.value.slice(-4) === "colo" || ev.target.value.slice(-5) === "color"){
              arr.push({value: "color:red"})
              arr.push({value: "color:blue"})
              arr.push({value: "color:yellow"})
              arr.push({value: "color:green"})
              arr.push({value: "color:black"})
              arr.push({value: "color:white"})
            }
            if(ev.target.value.slice(-5) === "text:" || ev.target.value.slice(-3) === "tex" || ev.target.value.slice(-4) === "text"){
              arr.push({value: "text:music"})
              arr.push({value: "text:login"})
              arr.push({value: "text:food"})
            }
            if(ev.target.value.slice(-8) === "appname:" || ev.target.value.slice(-3) === "app" || ev.target.value.slice(-4) === "appn"
            || ev.target.value.slice(-5) === "appna" || ev.target.value.slice(-6) === "appnam" || ev.target.value.slice(-7) === "appname"){
              arr.push({value: "appname:calendar"})
              arr.push({value: "appname:weather"})
              arr.push({value: "appname:sport"})
            }
            return arr;
          })()

      },
      handleSelected(item) {
        // when some suggestion is clicked/selected
        console.log(item);
      },
      handleClick(val) {
        // things to do when search btn is clicked
        console.log(val);
      },
      handleSubmitByEnter() {
        this.gotoSearchPage();
      }

    },
    data : function(){
        // get 4 OR 8 random boxes
        // empty for now
        let features = [{},{},{},{},{},{},{},{}];
        return {
            title : "GUIGLE",
            global : this.$root,
            features : features,
            sidebar_open : false,
            isShowingLayoutModal : false,
            layout_id : "",
            // autosuggestion
            val: '',
            lists: [],
            events: []
        }
    },
    mounted : function(){
        // load some features "randomly" (not really that random)

        axios.get(`/api/query?q=*:*&rows=8&start=${Math.floor(Math.random()*100)}&fl=id,screenshot_location`)
        .then((r)=>{
            console.log(r.data)
            let data = r.data.response.docs;
            if(data.length){
                // **HACK** The screenshots are loaded as a relative path

                data.forEach((layout)=>{
                    let temp = layout.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                    layout.screenshot_location = "/layouts/" + temp;
                });

                this.features = data;
            }
        })

    }
}
</script>

<style scoped>
.root {
    display : flex;
    flex-direction : row;
}

.nav {
    padding : 10px 20px;
    display : flex;
    flex-direction : row;
    position : absolute;
    top : 0;
    cursor : pointer;
}

.nav.open {
    color : white;
}

.sidebar {
    overflow : hidden;
    -webkit-transition: width 2s;
    transition: width 1s;
    width : 0px;
    background-color : #5ce791;
    color : white;
}

.sidebar.open {
    display : flex;
    width : 400px;
    -webkit-transition: width 1s;
    transition: width 1s;
}

.sidebar_content {
    display : flex;
    flex-direction : column;
    text-align : center;
    padding : 40px 0;
    min-width : 400px;
    height : 100%;
}

.content {
    height : 100%;
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content : center;
    flex: 1;
}

.content > * {
    display : flex;
    min-width : 650px;
    justify-content : center;
}

.title {
    font-family: 'Oleo Script', cursive;
    font-size : 3.75em;
    margin : 40px 0px;
    color : var(--text-color-primary);
}

/** Input field **/
.input {
    display : flex;
    flex-direction : row;
    box-shadow: 0 1px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.search_box {
    font-size : 1.15em;
    border : 0px solid rgba(0,0,0,.2);
    /* padding : 0 20px; */
    border-radius : 5px 0 0 5px;
    /* height : 42px; */
    /* background-color: red; */

    flex : 3.25;
}

.search--suggest{
  background-color: red;
}

.side_btns {
    position : relative;
    display : flex;
    flex-direction : row;
    flex : 1;
}

.search_btn {
    flex : 2;
}

/****************
    * Dropdown menu
    * WARING: There's a lot of tricky css shit going on down here
    * read on if you dare.
    ****************/
.dropdown {
    display : none;
    position : absolute;
    top : 100%;
    left : 0;
    background-color : white;
    min-width : 100%;
    max-height : 250px;
    border : 0px solid gray;
    overflow-y : scroll;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.options_btn:hover+.dropdown, .dropdown:hover, .dropdown.open {
    display : flex;
    flex-direction : column;
}

.category {
    display : flex;
    flex-direction : column;
}

.subcat.main {
    background-color : rgba(0,0,0,.15);
}

.subcat label {
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    align-items : center;
    padding : 5px;
}

/* Features section */
.features {
    margin-top : 65px;
    display : flex;
    flex-direction : row;
    justify-content : center;
    flex-wrap : wrap;
    max-width : 800px;
}

.feature {
    width : 150px;
    height : 100px;
    margin : 10px 10px;
    border : 1px solid rgba(0,0,0,.3);
    overflow : hidden;
}

.featurette {
    max-width : 100%;
    height : auto;
}
</style>
