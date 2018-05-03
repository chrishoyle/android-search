<template>
<div id="root" v-bind:class="[navmenu_tab >= 0 ? 'sidebar' : '']">
    <navbar class="nav" :searchTerm.sync="global.search_term">
        <div class="menu">
            <div class="menu_row">
                <filters-view :filters="global.xfields" @update="delay_search"></filters-view>
                <div>
                    <color-picker
                    @update="updateColors"
                    :colors="['#ff2400', 'DarkOrange', 'yellow', 'LimeGreen','RoyalBlue', 'indigo', 'MediumOrchid', 'gray', 'white', 'black']"
                    :limit="5"
                    editable>
                    </color-picker>
                    <div id="slidecontainer">
                        <input type="range" min="0" max="100" value="50" class="slider" id="myRange" @change="search">
                        <div id="textbox">
                                <font size="-1"><p class="alignleft">More Similar</p></font>
                                <font size="-1"><p class="alignright">Less Similar</p></font>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div class="quick_options">
            <div class="menu_row">
                <div>
                    <small> Found {{num_res.toLocaleString()}} Results in {{search_time}} milliseconds from query: </small> <font face="courier">{{global.display_term}}</font>
                </div>
            </div>
        </div>
    </navbar>

    <div v-bind:class="['content', list_view ? 'list' : 'multi']"
        ref = "results_view">

        <!-- infinite scrolling is broken -->
        <div class="results_view"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="20"
            infinite-scroll-throttle-delay="1000">
                <div class="empty_results" v-if="!results.length">
                    No Results. Try <a href="#" @click="changeNav(false, 0)">refining your search</a>.
                </div>
            <!-- Results container -->
                <div class="results" v-else  >
                    <div class="result" v-for="(result, index) in results" v-bind:key="index">
                    <!-- <div class="result_header">{{result.package[0]}}</div> -->
                        <img class="result_img" v-bind:src="result.screenshot_location" @click="openLayoutModal(result.id)"></img>
                        <div class="result_options">
                            <span class="fa fa-star-o fav_button" v-on:click = "addFavorite(result)" v-if="!isFavorite(result)"></span>
                            <span class="fa fa-star fav_button" v-on:click = "removeFavorite(result)" v-else></span>
                            <span class="fa fa-clone" v-b-tooltip.hover title = "Show Similar" v-on:click = "findSimilar(result)"> </span>
                            <span class="fa fa-share-alt" v-on:click="openModal(result,false)"></span>
                        </div>

                    </div>
                    <!-- similar feature modal -->
                    <modal v-bind:open="isShowingSimilarModal" @close="closeSimilarModal">
                          <b-container class="bv-example-row">
                            <b-row style="margin-top:7%;">
                              <b-col style="padding:0px 30px;margin:0px 30px 0px 0px;background-color:#dcdcdc;border-radius:10px">
                                <br>
                                <center><p class="lead" style="font-weight: bold;"> Similar by UI element </p></center>
                                  <div class="similar_screen_modal">
                                    <span v-for="(r, key) in similarResults" :key="key">
                                      <img v-bind:src="r.screenshot_location" class="similar_screen_display" @click="openOtherSimilarLayoutModal(r.id)"></img>
                                    </span>
                                  </div>
                              </b-col>
                              <b-col style="padding:0px 30px;margin:0px 0px 0px 30px;background-color:#dcdcdc;border-radius:10px">
                                <br>
                                <center><p class="lead" style="font-weight: bold;"> Similar by Color </p></center>
                                <div class="similar_screen_modal">
                                  <span v-for="(r, key) in similarColorResults" :key="key">
                                    <img v-bind:src="r.screenshot_location" class="similar_screen_display" @click="openOtherSimilarLayoutModal(r.id)"></img>
                                  </span>
                                </div>
                              </b-col>
                            </b-row>
                          </b-container>

                    </modal>
                    <div class="infinite_loading_bottom">Loading <span class="fa fa-cog fa-spin"></span></div>
          </div>
        </div>
    </div>
    <!-- share feature modal -->
    <modal v-bind:open="isShowingModal" @close="closeModal">
      <div style="background-color:#5ec791; height:100%;">
        <div class="share_content" v-if="this.share">
            <span class="fa fa-chevron-circle-left" style="font-size:3em; color:#ffffff; float:left; margin:0px 30px;"  @click="closeModal"></span>
            <h1 class="share_title" style="clear:both;color:#ffffff"> Share this application! </h1>
            <br><br><br>
            <p style="color:#ffffff" class="display-4"> {{share}} </p>
            <br>
            <b-form-group>
              <center>
                <b-form-input style="width:50%;" class="copy_input" onclick="this.select();document.execCommand('Copy');" v-model="shareLink"></b-form-input>
              </center>
            </b-form-group>

            <br>
            <center><div class="share_links">
              <a v-bind:href="`http://www.facebook.com/sharer.php?u=${shareLink}`" target="_blank">
              <div style="background-color:#3b5998; max-width:10%; padding:30px 41.575px; display:inline-block; margin:10px; border-radius:5px;">
                <i class="fa fa-3x fa-facebook share_facebook" style="color:white;" aria-hidden="true"></i>
              </div></a>
              <a v-bind:href="`https://twitter.com/share?url=${this.shareLink}&amp;text=TEXT_HERE&amp;hashtags=HASHTAG_HERE`" target="_blank">
              <div style="background-color:#1da1f2; max-width:10%; padding:30px 31.92px; display:inline-block; margin:10px; border-radius: 5px;">
                <i class="fa fa-3x fa-twitter share_twitter" style="color:white;" aria-hidden="true"></i>
              </div></a>
              <a v-bind:href="`http://reddit.com/submit?url=${this.shareLink}&amp;title=TITLE_HERE`" target="_blank">
              <div style="background-color:#ff4500; max-width:10%; padding:30px; display:inline-block; margin:10px; border-radius: 5px;">
                <i class="fa fa-3x fa-reddit-alien share_reddit" style="color:white;" aria-hidden="true"></i>
              </div></a>

            </div></center>
        </div>
      </div>
    </modal>
    <toggle class="view_toggle"
            off="fa-th"
            on="fa-photo" v-if="navmenu_tab == 0"
            v-bind:active="list_view"
            @click.native="toggleView">
    </toggle>
    <!-- layout modal -->
    <modal v-bind:open="isShowingLayoutModal" @close="closeLayoutModal" style="max-width:100%">
        <layout-view ref="layout" v-bind:id="layout_id"></layout-view>
    </modal>
</div>

</template>

<script>
// Whole lot of Vue.js stuff
import Vue from 'vue'
import axios from 'axios'

import layoutView from './components/layout_view.vue'
import modal from './components/modal.vue'
import navbar from './components/navbar.vue'
import colorPicker from "./components/color_picker.vue"
import filtersView from "./components/filters_view.vue"

// TODO make a switch component
Vue.component('toggle', {
	template : `<span v-bind:class="['toggle', 'fa', active ? on : off]"></span>`,
	props : ['on', 'off', 'active'],
})

// Vue App
export default {
    components : {
        filtersView,
        navbar,
        colorPicker,
        modal,
    },
    data : function(){
        return {
            title : "GUIGLE",
            first_load : true,
            loading : true,
            list_view : false,
            rows : 36,
            page : 0,
            num_res : 0,
            search_time : 0,
            layout_id : "",
            isShowingLayoutModal : false,
            isShowingSimilarModal: false,
			// Currently opened navigation tab
			navmenu_tab : 0,
			// Navigation menu
			navmenu : [
				{name : "Search",    icon : "fa-filter", tooltip : "Apply Search Filters", active : true },
				{name : "Filter",    icon : "fa-star",   tooltip : "Filter" },
				{name : "Favorites", icon : "fa-file",   tooltip : "Favorites" }
			],
			// results list
			results : [],
      similarResults: [],
      similarColorResults: [],
			colors : [],
            share : null,
            shareLink : null,
			// search timeout thing
            timeout : null,
            isShowingModal : false,
            isShowingFilter: false,
            isShowingFavorites: false,
			// global variables
            global : this.$root,
        }

    },
    watch : {
        "global.search_term" : "search"
    },
    mounted : function(){
		if(this.first_load){
			this.first_load = false;
      console.log(this.global.search_term)
			this.global.search_term = this.$route.query.global || this.global.search_term;
            // should this be in index.html
            // load our fields
            for (let field in this.global.xfields){
               for(let option of this.global.xfields[field]){
                    let i = this.$route.query[option.field]
                    if(typeof i != 'undefined'){
                        option.active = true;
                        if(typeof option.custom != 'undefined'){
                            if(i){
                                option.custom = true;
                                option.value = i;
                            }
                        }
                    }
               }
            }
            // Extract the colors from url
            let colors;
            if(colors = this.$route.query.colors){
                console.log(colors);
                colors = colors.match(/[a-z0-9]{6}/gi);
                this.colors = colors.map(hex=>{return {value:`#${hex}`}});
            }
            if(this.$route.query.listview == 'true'){
                this.list_view = true;
            }else{
                this.list_view = false;
            }
		}
		// Search using our url supplied data
        this.search();
	},

	beforeRouteUpdate (to, from, next) {
		// if we're here then we're updating from within the page
		next();
	  },

	props : ['doSearch'],

    methods : {
        openModal : function(favorite,fav) {
            if (fav) {
                this.share = favorite.name;
                let package_id = favorite.name.split(" ").join(".");
                this.shareLink = "https://play.google.com/store/apps/details?id=" + package_id;
            }
            else {
                this.share = favorite.package[0];
                let package_id = favorite.package[0].split(" ").join(".");
                this.shareLink = "https://play.google.com/store/apps/details?id=" + package_id;
            }
            this.isShowingModal = true;
        },

        closeModal : function() {
            this.isShowingModal = false;
        },

        openSimilarModal : function(){
            this.isShowingSimilarModal = true;
        },

        closeSimilarModal : function(){
            this.isShowingSimilarModal = false;
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
            // return to layout modal even when user exits
            // at similar or other screen modal
            this.$refs.layout.showLayout();
        },

        openOtherSimilarLayoutModal : function(id){
            console.log(id);
            this.closeSimilarModal();
            this.isShowingLayoutModal = true;
            this.$refs.layout.showLayout();
            // this.$nextTick(()=>{
            //     this.$refs.layout.getLayoutById(id);
            // })
            this.$refs.layout.getLayoutById(id);
        },

        updateColors : function(colors){
            console.log(colors);
            this.colors = colors.map(c=>{return {value : c}});
            this.delay_search();

        },

        toggleView : function(view){
            this.list_view = !this.list_view;
            this.$refs.results_view.scrollTop = 0;
            this.setPath();
            // TODO: Figure out first element in view
            //       scroll to that element
        },
		// Generate a query string based on all of our fields
		get_query : function(){
            let q = [];             //final query
            let q1 = [];            //each search field
            let q2 = [];            //for display term
            let searchBarQuery = [];

           //general search area
            let search_term = global.search_term
            // console.log(typeof search_term)

            if (global.search_term == ""){
                search_term = "*"
            }

            if(search_term.indexOf(":") > 0){
                // advanced search mode
                search_term = search_term.replace(/ui:/gi, 'class:');
                var search_term_q2 = search_term
                var color_list = [];
                var search_list = search_term.split(" ");
                var search_list_q2 = search_term_q2.split(" ");

                for (let i = 0; i < search_list.length; i++){
                  if(search_list[i].indexOf("color:") !== -1){

                    if(this.global.cssColorNames[search_list[i].split(":")[1]] != undefined || search_list[i].split(":")[1].indexOf("#") !== -1){
                      var colorHEX = "";
                      if(search_list[i].split(":")[1].indexOf("#") !== -1){
                        colorHEX = search_list[i].split(":")[1]
                      }else{
                        colorHEX = this.global.cssColorNames[search_list[i].split(":")[1]]
                      }
                      search_list_q2[i] = "color:"+colorHEX;
                      let c = parseInt(colorHEX.replace("#",""), 16),
                          r = (c & 0xff0000) >> 16,
                      g = (c & 0x00ff00) >> 8,
                          b = (c & 0x0000ff);
                       console.log(c, r, g, b);
                       let r2 = r/ 255,
                           g2 = g/ 255,
                           b2 = b/ 255;
                       var max = Math.max(r2, g2, b2), min = Math.min(r2, g2, b2);
                       var h, s, l = (max + min) / 2;
                       if(max == min){
                            h = s = 0;
                       }
                       else {
                           var d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                       switch(max){
                       case r2: h = (g2 - b2) / d + (g2 < b2 ? 6 : 0); break;
                       case g2: h = (b2 - r2) / d + 2; break;
                       case b2: h = (r2 - g2) / d + 4; break;
                        }
                       h *= 60;
                       s *=100;
                       l *=100;
                       }
                       console.log(h,s,l);

                       h = Math.round(h/360 * 255);
                       s = Math.round(s/100 * 255);
                       l = Math.round(l/100 * 255);
                       let hmargin = Math.round(8/360 * 255),
                           smargin = Math.round(s/8),
                           lmargin = Math.round(10/100 * 255);
                       let arr = []
                       let query = "(";
                       for(let i = 0; i < 6; i++) {
                           arr.push( `((hue_${i+1}:[${h-hmargin} TO ${h+hmargin}]) AND (sat_${i+1}:[${s-smargin} TO ${s+smargin}]) AND (light_${i+1}:[${l-lmargin} TO ${l+lmargin}]))`);
                       }

                       query += arr.join(" OR ")
                       query += ")"
                       search_list[i] = query;




                    }
                  }
                }

                search_term = search_list.join(" ");
                search_term_q2 = search_list_q2.join(" ");

                console.log("advanced search");
                if(search_term !== ""){
                  q1.push("("+search_term+")");
                }
                q2.push("("+search_term_q2.replace(/class:/g, 'ui:') +")");

            } else {
                // quick search mode
                var token_list = search_term.trim().split(" ");
                console.log(token_list);
                for (let tokenid in token_list){
                    console.log("token:",token_list[tokenid]);
                    if (this.global.ui_list.includes(token_list[tokenid])){
                        q1.push("(class:"+token_list[tokenid]+")");
                        q2.push("(ui:"+token_list[tokenid]+")");
                    }



                    else if (this.global.cssColorNames[token_list[tokenid]] != undefined){
                                           var colorHEX = this.global.cssColorNames[token_list[tokenid]]
                                           console.log(colorHEX)
                                           q2.push(colorHEX)
                                           let c = parseInt(colorHEX.replace("#",""), 16),
                                               r = (c & 0xff0000) >> 16,
                    					       g = (c & 0x00ff00) >> 8,
                                               b = (c & 0x0000ff);
                                            console.log(c, r, g, b);
                                            let r2 = r/ 255,
                                                g2 = g/ 255,
                                                b2 = b/ 255;
                                            var max = Math.max(r2, g2, b2), min = Math.min(r2, g2, b2);
                                            var h, s, l = (max + min) / 2;
                                            if(max == min){
                                                 h = s = 0;
                                            }
                                            else {
                                                var d = max - min;
                                                 s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                                            switch(max){
                                            case r2: h = (g2 - b2) / d + (g2 < b2 ? 6 : 0); break;
                                            case g2: h = (b2 - r2) / d + 2; break;
                                            case b2: h = (r2 - g2) / d + 4; break;
                                             }
                                            h *= 60;
                                            s *=100;
                                            l *=100;
                                            }
                                            console.log(h,s,l);

                                            h = Math.round(h/360 * 255);
                                            s = Math.round(s/100 * 255);
                                            l = Math.round(l/100 * 255);
                                            let hmargin = Math.round(8/360 * 255),
                                                smargin = Math.round(s/8),
                                                lmargin = Math.round(10/100 * 255);
                                            let arr = []
                                            let query = "(";
                                            for(let i = 0; i < 6; i++) {
                                                arr.push( `((hue_${i+1}:[${h-hmargin} TO ${h+hmargin}]) AND (sat_${i+1}:[${s-smargin} TO ${s+smargin}]) AND (light_${i+1}:[${l-lmargin} TO ${l+lmargin}]))`);
                                            }

                                            query += arr.join(" OR ")
                                            query += ")"
                                            q1.push(query);
                                            }



                    else{
                        q1.push("((text:"+token_list[tokenid]+") OR (appname:" + token_list[tokenid] + "))")
                        q2.push("((text:"+token_list[tokenid]+") OR (appname:" + token_list[tokenid] + "))")
                    }
                }

                // console.log("general search")
                // q1.push("((text:"+search_term+") OR (class:"+search_term + ") OR (appname:" + search_term + "))")
                // q2.push("((text:"+search_term+") OR (ui:"+search_term + ") OR (appname:" + search_term + "))")
            }

            //combined with component and activity
            for (let field in this.global.xfields){
                for(let option of this.global.xfields[field]){
                      if(option.active){
                            q1.push(`(${option.value})`)
                            q2.push(`${option.name}`)
                        }
                }
            }

            var slider = document.getElementById("myRange");

			// Add colors to the query
			let margin = 50;
            // add the color query to the url.
            this.colors.forEach((color)=>{
            q2.push(color.value)
				    let c = parseInt(color.value.replace("#",""), 16),
					  r = (c & 0xff0000) >> 16,
					  g = (c & 0x00ff00) >> 8,
					  b = (c & 0x0000ff);

            // console.log(c, r, g, b);
            let r2 = r/ 255,
                g2 = g/ 255,
                b2 = b/ 255;
            var max = Math.max(r2, g2, b2), min = Math.min(r2, g2, b2);
            var h, s, l = (max + min) / 2;
            if(max == min){
                h = s = 0;
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r2: h = (g2 - b2) / d + (g2 < b2 ? 6 : 0); break;
                    case g2: h = (b2 - r2) / d + 2; break;
                    case b2: h = (r2 - g2) / d + 4; break;
                    }
                h *= 60;
                s *=100;
                l *=100;
            }
            //console.log(h,s,l);


            h = Math.round(h/360 * 255);
            s = Math.round(s/100 * 255);
            l = Math.round(l/100 * 255);
            let multiplier = slider.value/50;
            //console.log(multiplier);
            let hmargin = Math.round(8/360 * 255 * multiplier),
                smargin = Math.round(s/8 * multiplier),
                lmargin = Math.round(10/100 * 255 * multiplier);

            //console.log(smargin,lmargin);

            let arr = []
            let query = "(";
            for(let i = 0; i < 6; i++) {
                arr.push( `((hue_${i+1}:[${h-hmargin} TO ${h+hmargin}]) AND (sat_${i+1}:[${s-smargin} TO ${s+smargin}]) AND (light_${i+1}:[${l-lmargin} TO ${l+lmargin}]))`);
            }

            query += arr.join(" OR ")
            query += ")"
            q1.push(query);
            });

            q = q1.join(" OR ");
            this.global.display_term = q2.join(" OR ")
            console.log("display", this.global.display_term)
            console.log("Query: ", q);
            this.query = q;
			return q;
		},

    delay_search : function(){
        if(this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(this.search, 500);
    },

    findSimilarByColor : function(result){
      let j = 0
      let hue_1 = result.hue_1
      let hue_2 = result.hue_2
      let light_1 = result.light_1
      let light_2 = result.light_2
      let sat_1 = result.sat_1
      let sat_2 = result.sat_2

      //console.log(result)

      let hmargin = Math.round(8/360 * 255),
          smargin1 = Math.round(sat_1/8),
          smargin2 = Math.round(sat_2/8),
          lmargin = Math.round(10/100 * 255);

        let arr = []
        let squery = "(";
        for(let i = 0; i < 3; i++){
          arr.push( `((hue_${i+1}:[${hue_1-hmargin} TO ${hue_1+hmargin}]) AND (sat_${i+1}:[${sat_1-smargin1} TO ${sat_1+smargin1}]) AND (light_${i+1}:[${light_1-lmargin} TO ${light_1+lmargin}]))`);        }
        squery += arr.join(" OR ")
        squery += ")"

      let url = `/api/query?q=${squery}&fl=id,screenshot_location,package,screenID,category&start=${this.page * this.rows}&rows=10`;
      //console.log(url);
      this.similarColorResults = [];
      axios.get(url).
      then((r)=>{
        if(!r.data.response)
            return;
        //console.log(r.data.responseHeader.QTime)
        this.similarColorResults = r.data.response.docs;
        //console.log(this.similarColorResults.length)
        if(this.similarColorResults.length){

            this.similarColorResults.forEach((layout)=>{

                  if(!layout.screenshot_location || !layout.screenshot_location[0]){
                      layout.screenshot_location = "";
                  }else{
                      let temp = layout.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                      layout.screenshot_location = "/layouts/" + temp;
                  }
                //console.log(layout.screenshot_location)
            });
        }
      })
    },


    findSimilar : function(result){
      //console.log(result);
      let categorylist = []
      let j = 0

      while(j < result.category.length){
        categorylist.push(" (category:" + result.category[j]+")");
        j = j + 1
      }
      let squery = categorylist.join(" ");
      let url = `/api/query?q=${squery}&fl=id,screenshot_location,package,screenID,category&start=${this.page * this.rows}&rows=10`;
      //console.log(url);
      this.similarResults = [];
      axios.get(url).
      then((r)=>{
        if(!r.data.response)
            return;
        //console.log(r.data.responseHeader.QTime)
        this.similarResults = r.data.response.docs;
        //console.log(this.similarResults.length)
        if(this.similarResults.length){

            this.similarResults.forEach((layout)=>{

                  //console.log("in if")
                  if(!layout.screenshot_location || !layout.screenshot_location[0]){
                      layout.screenshot_location = "";
                  }else{
                      let temp = layout.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                      layout.screenshot_location = "/layouts/" + temp;
                  }
                //console.log(layout.screenshot_location)
            });
        }
      })
      this.findSimilarByColor(result);
      this.openSimilarModal();


    },

    addFavorite : function(result){
        this.$store.commit('addFavorite', result)
        this.$store.dispatch('saveFavorites')
    },

    removeFavorite : function(result){
        this.$store.commit('removeFavorite', result.id)
        this.$store.dispatch('saveFavorites')
    },

    isFavorite : function(fav){
        return this.$store.getters.isFavorite(fav.id)
    },

    changeNav : function(toggle, i){
        if(i == this.navmenu_tab)
            if(toggle)
                i = -1;
            else
                return
        this.navmenu.forEach(item => item.active = false);
        if(i >= 0)
            this.navmenu[i].active = true;
        this.navmenu_tab = i;
    },

    clear : function(){
        this.page = 0;
        this.rows = 12;
    },

    nextPage : function(){
        this.page += 1;
    },

    setPath : function(){
        let path = `/search?global=${this.global.search_term}`;
        // append all the fields
        for (let field in this.global.xfields){
            for(let option of this.global.xfields[field]){
                if(option.active){
                    path += `&${option.field}=`
                    if(typeof option.custom != 'undefined'){
                        path += option.value || ''
                    }else{
                        path += 'true'
                    }
                }
            }
        }
        // Add the colors
        if(this.colors.length)
            path += `&colors=[${this.colors.map(c=>c.value.replace("#","")).join(",")}]`;
        // Add the view
        if(this.list_view)
            path += `&listview=true`
        // push the path
        this.$router.push({path});
    },

    search : function(){
        if(this.timeout)
            clearTimeout(this.timeout);
        let query = this.get_query();

        // console.log(query)

        if(query){
            this.loading = true;
            this.results = [];
            this.page = 0;
            let url = `/api/query?q=${query}&fl=id,screenshot_location,package,screenID,tag,category,hue_1,sat_1,light_1,hue_2,sat_2,light_2&start=${this.page * this.rows}&rows=${this.rows}`;
            // Get results from our query
            axios.get(url)
                .then((r)=>{
                    if(!r.data.response)
                        return
                    let data = r.data.response.docs;
                    this.num_res = r.data.response.numFound;
                    this.search_time = r.data.responseHeader.QTime;
                    console.log(global.search_time)
                    if(data.length){
                        // **HACK** The screenshots are loaded as a relative path
                        // So I'm just manually cutting it up to get the actual path I want
                        // we COULD fix this, but that might mean we have to re-index everything
                        data.forEach((layout)=>{
                            if(!layout.screenshot_location || !layout.screenshot_location[0]){
                                layout.screenshot_location = "";
                            }else{
                                let temp = layout.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                                layout.screenshot_location = "/layouts/" + temp;
                            }
                        });
                        // sort results by favorited
                        data = data.sort((a,b)=>{
                            let isFavA = this.isFavorite(a);
                            let isFavB = this.isFavorite(b);

                            if(isFavA == isFavB)
                                return 0;
                            return isFavA && !isFavB ? -1 : 1;
                        });

                        this.results = data;
                    }
                    this.loading = false;
                }
            );
            this.setPath()
        }
    },

    loadMore : function(){
        if(this.results.length >= this.num_res || this.num_res <= 24){
            return;
        }
        this.loading = true;
        this.page++;
        let url = `/api/query?q=${this.query}&fl=id,screenshot_location,package,screenID,tag,category,hue_1,sat_1,light_1&start=${this.page * this.rows}&rows=${this.rows}`;
        // Get results from our query
        axios.get(url)
            .then(r=>{
                let data;
                if(data = r.data.response.docs){
                    data.forEach((layout)=>{
                        if(!layout.screenshot_location || !layout.screenshot_location[0]){
                            layout.screenshot_location = "";
                        }else{
                            let temp = layout.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                            layout.screenshot_location = "/layouts/" + temp;
                        }
                    });
                    this.results = this.results.concat(data);
                }
                this.loading = false;
            })
        }
    }
}
</script>


<style lang="scss" scoped>
#root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size : 18px;
    background-color : white;
    display: flex;
    flex-direction : column;
    background-color : #f3f5f6;
    .nav {
        flex : 0 0 auto;
        .menu {
            position : relative;
            width : 100%;
            display : flex;
            flex-direction : column;
            background-color : white;
            padding : 10px 20px;
            border-bottom : 1px solid rgba(0,0,0,.15);
        }
        .quick_options {
            display : flex;
            flex-direction : column;
            background-color : #f3f5f6;
            padding : 10px 20px;
        }
        .menu_row {
            width : 100%;
            display : flex;
            flex-direction : row;
            justify-content : space-between;
            align-items : baseline;
            align-self : center;
        }
    }
}

#root.sidebar {
    grid-template-areas : "header"
                          "content";
    grid-template-columns : 4fr;
}

a {
    text-decoration: none;
    cursor : pointer;
    color: #000
}

.guigle_modal .modal_content{
    min-width : 90%;
}

span {
    cursor : pointer;
}

.toggle {
    cursor : pointer;
}

.navigation {
    grid-area : nav;
    background-color: rgba(0, 0, 0, 0.9);
}

.view_toggle {
    position : fixed;
    display : flex;
    justify-content : center;
    align-items : center;
    opacity : 0.1;
    bottom : 15px;
    right : 15px;
    opacity : .35;
    z-index : 9999;
    width : 75px;
    height : 75px;
    color : white;
    background-color : dodgerblue;
    border-radius : 100%;
    box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
}

.view_toggle:hover{
    opacity : 1;
}

.results_view {
    display : flex;
    flex-direction : row;
    justify-content : center;
}

.content {
    grid-area : content;
    padding: 0 20px;
    overflow-y : auto;
}
.searchi {
    position : fixed;
    display : flex;
    justify-content : center;
    align-items : center;
    border-radius : 100%;
    cursor : pointer;
    width : 75px;
    height : 75px;
    background-color : red;
    bottom : 15px;
    right : 15px;
    color : white;
}

.content_header {
    padding : 5px;
    grid-area : header;
    color : white;
    background-color : #5ec791;
    display : grid;
    justify-items : center;
    justify-content: space-between;
    align-items : center;
    padding : 10px 20px;
    grid-template-areas : "title . ."
                          "search options . "
                          " . count .";
    grid-template-columns : 1fr 1fr 1fr;
    grid-template-rows : auto auto auto;
    border-bottom : 1px solid rgba(0,0,0,.0975);
}

@media screen and (max-width: 768px) {
    .content_header {
        height : auto;
        display : grid;
        grid-template-areas : "title title title"
                              "search search options";
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows : auto 1fr;
    }
    .title {
        justify-self : center;
    }
    .search_box.main {
        box-shadow : none;
        min-width : 150%;
    }
    .result_stats {
        display : none;
    }
}

.side_views {
    padding : 0px 5px;
    color : white;
    grid-area : options;
    text-align: center;
    display : flex;
    justify-self : left;
    align-self : center;
    flex-direction : row;
}

.side_views > * {
    color : white;
    margin : 0 10px;
}

.side_tab.active {
    border-bottom: 2px solid teal;
}

.container {
    width : 100%;
    height : 100%;
    display : grid;
    grid-template-rows : auto 1fr 25px;
}

.footer {
    display : grid;
}

.fav_footer {
    display : grid;
    grid-template-columns : 1fr;
    align-items:center;
    grid-column-gap : 5px;
}

.atomic_button {
    margin : 0px;
    padding : 5px;
    border-radius : 5px;
    color : white;
    text-align : center;
    background-color : rgba(0,0,100,.5);
    cursor: pointer;
}

.icon_button {
    position: relative;
    width: 100%;
    height: 60px;
    display: grid;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,.3);
    border-bottom: 2px solid transparent;
    cursor: pointer;
}

.icon_button.active {
    color : white;
    border-bottom: 2px solid teal;
}

.icon_button:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.icon_button .tooltip {
    color : white;
    position: absolute;
    padding: 5px;
    text-align: center;
    display: none;
    left: 85px;
    top: 5px;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 5px;
}

.full_content {
    width : 100%;
    height : 100%;
    display : grid;
    grid-template-columns : 1fr;
    grid-gap : 10px;
    justify-items : center;
}


.icon_button:hover .tooltip {
    display: block;
}

.tabheader {
    position: relative;
}

.tab.filters {
    display : grid;
    width : 100%;
    grid-gap : 20px;
    align-content : start;
}

.search_box {
    position: relative;
    border: none;
    outline-color: transparent;
    outline-style: none;
    background-color: white;
    border : 1px
    solid rgba(0,0,0,.2);
    border-radius : 4px;
    padding: 0px 0px;
    text-indent : 20px;
}

.search_box.main {
    min-width : 100%;
    height : 40px;
    grid-area : search;
    justify-self : left;
    box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
}

.result_stats {
    grid-area : count;
}

.search_box.subsearch {
    text-indent : 0;
}

.search_fields .field {
    font-size : 1.5em;
    display : grid;
    grid-template-columns: 1fr .25fr .25fr;
    align-items : center;
    margin-bottom : 10px;
    color : rgba(0,0,0,.45);
}

.search_fields .field.active {
    color : rgba(0,0,0,.8);
}

.section_header {
	margin-bottom : 10px;
    text-align : center;
}

.empty_results {
    font-size: 1.1em;
    color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-content: center;
    text-align : center;
}

.favs {
    display : grid;
    grid-auto-rows : 25px;
    grid-gap : 10px;
    overflow-y : auto;
    padding-bottom: 20px;
}

.fav {
    width : 100%;
	padding : 10px 0;
    height: 100%;
    display : grid;
    grid-template-columns: 1fr 20px 20px;
    grid-gap : 10px;
    align-items : center;
}

.tab_fade-enter-active, .tab_fade-leave-active {
  transition: opacity .3s ease;
}

.tab_fade-enter, .tab_fade-leave-to {
  opacity: 0;
}

.content {
    display : grid;
    position : relative;
}

.content .result {
    cursor : pointer;
    background-color : white;
    width : 100%;
}

.content .results {
    display : grid;
}

.content.multi .results {
    grid-template-columns : 1fr 1fr 1fr 1fr 1fr 1fr ;
    grid-gap : 3px;
    align-content : start;
    justify-items : center;
}

.content.multi .result {
	position : relative;
    width : 100%;
    height : auto;
    overflow : hidden;
    border : 1px solid rgba(0,0,0,.0975);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23);
}

.content.multi .result_header {
    display : none;
}

.content.multi .result_img {
    /* THIS PREVENTS THE PAGE FROM JUMPING */
    min-height : 304px;
}

.content.multi .result_options {
    position : absolute;
    background-color : rgba(0,0,0,.5);
    color : white;
    top : 50%;
    width : 100%;
    padding : 10px;
    display : flex;
    justify-content : space-around;
    opacity : 0;
}

.content.multi .result:hover .result_options {
    opacity : 1;
}

.content.list .results {
    display : grid;
    justify-content : center;
    grid-gap : 60px;
    grid-template-columns : 400px;
}

@media screen and (min-width: 768px) {
    .content.list .results {
        grid-template-columns : 500px;
    }
}

.content.list .result {
    width : 100%;
    padding : 8px 0px;
    display : grid;
    grid-template-areas : "header"
                          "image"
                          "options";
    grid-gap : 10px;
    border : 1px solid rgba(0,0,0,.0975);
}

.content.list .result_header {
    grid-area : header;
    padding : 0px 8px;
}

.content.list .result_options {
    grid-area : options;
    padding : 0px 10px;
    display : flex;
    justify-content : space-around;
}
.content.list .result_img {
    /* THIS PREVENTS THE PAGE FROM JUMPING */
    min-height : 636px;
}

.content .result_img {
    grid-area : image;
    width : 100%;
}

.fav_button {
    font-size : 1.25em;
}

.share_content {
    text-align: center;
    padding-top:50px;
    padding-bottom:50px;
    cursor: pointer;
}

.copy_input {
    width: 300px;
    border-radius: 3px;
}

.share_links {
    margin-top:50px;
}

.share_facebook {
    color: #3b5998;
}

.share_twitter {
    color: #1da1f2;
}

.share_reddit {
    color: #ff4500;
}

.infinite_loading_bottom {
    /* display : flex; */
    /* flex-direction : row; */
    /* justify-content : center; */
    height : 150px;
}

.similar_screen_modal {
    width : 100%;
    height : 100%;
    padding : 0;
    display : grid;
    grid-template-columns : 1fr 1fr;
    grid-column-gap: 5px;
    grid-row-gap : 5px;
    overflow: auto;
}

.similar_screen_display {
    max-width: 100%;
    height  : auto;
}

.slider {
    -webkit-appearance: none;
    width: 98%;
    height: 12px;
    border-radius: 3px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #5ec791;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #5ec791;
    cursor: pointer;
}

.alignleft {
	float: left;
}

.alignright {
	float: right;
}

</style>
