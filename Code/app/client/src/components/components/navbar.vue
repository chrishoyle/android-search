<template>
    <div id="nav_root">
        <div class="nav">
            <router-link to="/" class="title" style="margin:5px 15px">
                <span style="color:rgba(0,0,0,.25);"><</span>{{ title }}<span style="color:rgba(0,0,0,.25);">></span>
            </router-link>
            <label :class="['search_box_wrapper', search_focus ? 'focused' : '']">
                    <search-suggestion
                      id="searchBar"
                      ref="search_box"
                      class="search_box main"
                      placeholder="Search"
                      :showBtn="false"
                      :datas="lists"
                      :searchkey="search_term"
                      v-model="search_term"
                      v-on:focus="search_focus = true"
                      v-on:blur="search_focus = false"
                      @input="handleInput"
                      @selected="handleSelected"
                      @click="this.select()"
                      @submitByEnter="handleSubmitByEnter"
                    ></search-suggestion>
                <span class="search_btn fa fa-search" @click="onChange"></span>
            </label>

            <div class="info">
                <a href="#" class="info_btn" @click="show_help = !show_help">Help</a>
                <a href="#" class="info_btn" @click="show_favs = !show_favs">
                    Favs
                </a>
                <div class="fav_wrapper"  v-if="show_favs">
                    <fav-view ></fav-view>
                </div>
            </div>
            <!-- <div v-if="results.length && navmenu_tab == 0" class="result_stats">Displaying {{results.length}} of {{num_res}} results</div> -->

        </div>

        <div class="options">
            <slot></slot>
        </div>
        <modal v-bind:open="show_help" @close="closeHelpModal">
            <div class="help_content">
                <br><br><br>
                <h2 class="help_header display-4">Welcome Explorer!</h2>
                <p class="help_body lead"><strong>Guigle is a powerful search engine for android applications. You can search for texts, UI components, appnames, and colors from real mobile applications. </strong></p>
                <div class="help_body">
                  <span>Try </span><span class="text-success"><em>quick search </em></span> by simply typing keywords such as:<br>
                  <strong class="text-success"><font size="+1">music, login, etc.</font></strong>
                  <br><br>
                  <span>or try to be more precise with </span>
                  <span class="text-primary"><em>advanced search </em></span> by typing your query in the following format:<br>
                  <strong class="text-primary"><font size="+1">text:music AND ui:list</font></strong>
                  <br><br>
                  <span>Simply type the field name and colon, e.g. "text:", you will see the search prompt.</span><br>
                  <span>We have four customized fields you can search for: <strong class="text-primary"><font size="+1">text, ui, appname, color</font></strong></span>
                  <br><br><br>
                  <span>Have fun!</span>
                  <br><br>
                </div>
                <div class="help_sig display-5"><strong>- Guigle team -</strong></div>
            </div>
        </modal>

    </div>

</template>

<style lang="scss" scoped>
#nav_root {
    width : 100%;
    display : flex;
    flex-direction : column;
    background-color : #5ec791;
    .nav {
        align-self : center;
        width : 100%;
        display : grid;
        grid-template-columns : 1fr 5fr 1fr;
        padding: 10 20px;
        align-items : center;
        .title {
            width : 10%;
            text-decoration : none;
            color : white;
            font-size : 2.0rem;
            font-family: 'Oleo Script', cursive;
        }
        .search_box_wrapper
        {
            /* height : 42px; */
            width : 50%;
            background-color : white;
            margin : 0;
            z-index : 2;
            /* padding : 0 10px; */
            transition: opacity .2s ease-in-out;
            opacity : 0.9;
            border-radius : 3px;
            display : flex;
            flex-direction : row;
            align-items : center;
            &.focused {
                opacity : 1;
            }
            .search_box {
                flex : 1;
                height : 100%;
                /* width : 360px; */
                border : 0px solid transparent;
                &:focus {
                    outline : none;
                }
            }
            .search_btn {
                cursor : pointer;
                padding: 5px 15px;
            }
        }
        .info {
            // margin : 0 50px;
            position : relative;
            display : flex;
            flex-direction : row;
            justify-content : space-around;
            align-items : baseline;
            color : white;
            height : 100%;
            .fav_wrapper {
                border-radius : 4px;
                position : absolute;
                top : 110%;
                right : 0px;
                background-color : white;
                min-width : 300px;
                z-index : 51;
                box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
            }
            .info_btn {
                display : flex;
                align-items : center;
                color : white;
                height : 100%;
            }
        }
    }
    .options {
        float: left;
        width : 100%;
        background-color : white;
        color : rgba(0,0,0,.75);
    }
    .help_content {
        padding: 50px;
        height: 100%;
        text-align: center;
        background-color: #5ec791;
        color: #FFFFFF;
    }
    .help_body {
        width: 60%;
        /* height: 20%; */
        padding-top: 50px;
        margin-left: auto ;
        margin-right: auto ;
    }
}


.popover-title {
    color:blue;
}




#myUL {
    /* Remove default list styling */
    list-style-type: none;
    padding: 0;
    margin: 0;
}

#myUL li a {
    border: 1px solid #ddd; 
    margin-top: -1px; 
    background-color: #f6f6f6;
    padding: 12px;
    text-decoration: none; 
    font-size: 18px; 
    color: black;
    display: block;
}

#myUL li a:hover:not(.header) {
    background-color: #eee;
}

</style>

<script>
import favView from './fav_view.vue'
import modal from './modal.vue'

export default {
    components : {
        'fav-view' : favView,
        modal,

    },
    props : ["searchTerm"],
    data : function(){
        return {
            title : "GUIGLE",
            show_favs : false,
            show_help : false,
            search_focus : false,
            search_term : this.searchTerm || "",

            // autosuggestion
            val: '',
            lists: [],
            events: [],

            global : this.$root,
        }
    },

    mounted : function(){
      if(!global.search_term){
        global.search_term = ""
      }

    },

    methods : {
        onChange : function(){
            this.$emit('update:searchTerm', this.search_term);
        },
        closeHelpModal : function(){
            this.show_help = false;
        },

        //autosuggestion
        handleInput(ev) {
          this.onChange();
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

      },
      handleClick(val) {
        // things to do when search btn is clicked
        console.log(val);
      },

      handleSubmitByEnter() {
        this.onChange();
        this.val = global.search_term;
      }
    },

}
</script>
