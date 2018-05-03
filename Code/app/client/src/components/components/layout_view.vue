<template>
  <div class="root" v-if="layout">
    <div class="layout_content full_width full_height">
      <div class="image_display full_width">
          <div v-if="isShowingLayout" class="layout_info">
            <!-- isShowingLayout -->
            <img v-bind:src="layout.screenshot_location" class="layout_img">

            <b-jumbotron style="margin-top:5%;max-width:97%;max-height:95%;border-radius:8px;">
                <header class="display-4" style="display:inline-block;">{{layout.appname[0]}}</header>
                <a v-bind:href="strLink" target="_blank">
                  <img v-bind:href="strLink" style="float:right;max-width:20%;" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"></img>
                </a>
              <br><br><br>
              <span v-for="rgb in rgb_list" style="margin:3px">
                <b-img v-b-tooltip.hover v-bind:title="rgb" rounded="circle" blank width="50" height="50" v-bind:blank-color="rgb" alt="RGBa color" class="m-1"></b-img>
              </span>
              <br><br>
         
              <b-badge variant="success" style="margin:5px;padding:10px;background-color:#88a272"><font face="trebuchet ms"size="+0.5">{{ layout.tag[0] }}</font></b-badge>

              <br><br>
              <div>
                <b-badge class="layout" v-for="klass in layout.class" variant="primary" style="margin:5px; padding:10px; background-color:#74beb6">

                  <font face="trebuchet ms" size="+0.5">{{ klass }}</font>
                </b-badge>
              </div>
              <br>
              <span class="fa fa-star-o fav_button" style="font-size:2em; color:#ffbf00" v-on:click = "addFavorite(layout)" v-if="!isFavorite(layout)"></span>
              <span class="fa fa-star fav_button" style="font-size:2em; color:#ffbf00" v-on:click = "removeFavorite(layout)" v-else></span>
              <span class="fa fa-share-alt" style="font-size:2em; color:#5ec791; margin:10px" @click="openShareModal(layout)"></span>
              <br><br>
              <b-btn variant="success" @click="showAllScreen" style="margin:5px">
                Display All Screens in the App
              </b-btn>
              <b-btn variant="success" @click="findSimilar(layout)">
                Display Similar Screens
              </b-btn>
              <!-- <span class="fa fa-clone black font_mid" v-b-tooltip.hover title="Show Similar" v-on:click = "findSimilar(layout)" style="margin:10px"></span> -->
            </b-jumbotron>
            <!-- isShowingLayout -->
          </div>


          <div v-if="isShowingAllScreens" style="margin-top:5%;margin-left:3%;margin-right:3%;overflow:hidden">
            <!-- isShowingAllScreens -->
            <span class="fa fa-chevron-circle-left" style="font-size:3em; color:#000000;margin:0px 50px;" v-on:click = "showLayout"></span>

            <div class="other_screen_layouts">
              <div v-for="(other_screen, i) in other_screens" v-bind:key="i">
                <img v-bind:src="other_screen.screenshot_location" class="layout_other_img" @click="openOtherLayoutModal(other_screen.id)">
              </div>
            </div>
            <br><br>
            <center><h1 v-if="other_screens.length === 0">No other screens can be found for this app.</h1></center>

            <!-- isShowingAllScreens -->
          </div>


          <div v-if="isShowingSimilar">
            <!-- isShowingSimilar -->
            <div class="layout_header">
              <span class="fa fa-chevron-circle-left" style="font-size:3em; color:#000000" v-on:click = "showLayout"></span>
            </div>
            <b-container class="bv-example-row">
              <b-row>
                <b-col style="padding:0px 30px;margin:0px 30px 0px 0px;background-color:#dcdcdc;border-radius:10px">
                  <br>
                  <center><p class="lead" style="font-weight: bold;"> Similar by UI element </p></center>
                    <div class="similar_screen_modal">
                      <span v-for="(r, key) in similarResults" :key="key">
                        <img v-bind:src="r.screenshot_location" class="similar_screen_display" @click="openOtherLayoutModal(r.id)"></img>
                      </span>
                    </div>
                </b-col>
                <b-col style="padding:0px 30px;margin:0px 0px 0px 30px;background-color:#dcdcdc;border-radius:10px">
                  <br>
                  <center><p class="lead" style="font-weight: bold;"> Similar by Color </p></center>
                  <div class="similar_screen_modal">
                    <span v-for="(r, key) in similarColorResults" :key="key">
                      <img v-bind:src="r.screenshot_location" class="similar_screen_display" @click="openOtherLayoutModal(r.id)"></img>
                    </span>
                  </div>
                </b-col>
              </b-row>
            </b-container>
            <!-- isShowingSimilar -->
          </div>

          <!-- share feature modal -->
          <modal v-bind:open="isShowingShareModal"  @close="closeShareModal">
            <div style="background-color:#5ec791; height:100%;">
              <div class="share_content" v-if="this.share">
                  <span class="fa fa-chevron-circle-left" style="font-size:3em; color:#ffffff; float:left; margin:0px 30px;"  @click="closeShareModal"></span>
                  <h1 class="share_title" style="clear:both;color:#ffffff"> Share this application! </h1>
                  <br><br><br>
                  <p style="color:#ffffff" class="display-4"> {{share}} </p>
                  <br>
                  <b-form-group>
                    <center>
                      <b-form-input style="max-width:50%" class="copy_input" onclick="this.select();document.execCommand('Copy');" v-model="strLink"></b-form-input>
                    </center>
                  </b-form-group>

                  <br><br>
                  <center><div class="share_links">
                    <a v-bind:href="`http://www.facebook.com/sharer.php?u=${shareLink}`" target="_blank">
                    <div style="background-color:#3b5998; max-width:10%; padding:30px 41.575px; display:inline-block; margin:10px; border-radius:5px;">
                      <i class="fa fa-3x fa-facebook share_facebook" aria-hidden="true"></i>
                    </div></a>
                    <a v-bind:href="`https://twitter.com/share?url=${this.shareLink}&amp;text=TEXT_HERE&amp;hashtags=HASHTAG_HERE`" target="_blank">
                    <div style="background-color:#1da1f2; max-width:10%; padding:30px 31.92px; display:inline-block; margin:10px; border-radius: 5px;">
                      <i class="fa fa-3x fa-twitter share_twitter" aria-hidden="true"></i>
                    </div></a>
                    <a v-bind:href="`http://reddit.com/submit?url=${this.shareLink}&amp;title=TITLE_HERE`" target="_blank">
                    <div style="background-color:#ff4500; max-width:10%; padding:30px; display:inline-block; margin:10px; border-radius: 5px;">
                      <i class="fa fa-3x fa-reddit-alien share_reddit" aria-hidden="true"></i>
                    </div></a>

                  </div></center>
              </div>
            </div>
          </modal>

      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  width : 100%;
  height : 100%;
  display : flex;
  flex-direction : columns;
  justify-content : center;
  background-color : #f3f5f6;
}

.full_width {
  width : 100%;
}

.full_height {
  height : 100%;
}

.white {
  color : rgba(255,255,255,.9);
}

.font_mid {
  font-size : 28px;
}

.hoverable {
  cursor : pointer;
}

.image_display {
  display : flex;
  flex-direction : column;
  /* align-items : center; */
  justify-content : center;
}

.layout_content {
  overflow : auto;
}

.layout_info {
  display : grid;
  grid-template-columns : 1fr 2fr;
  justify-content : center;
  justify-items : center;
  padding: 0px 10px;
}

.layout_img {
  margin-top: 10%;
  max-width : 90%;
  /* height: 90%; */
  vertical-align: middle;
}

.layout_header {
  margin-top : 3%;
  margin-bottom:3%;
  margin-left: 5%;
  display : flex;
  flex-direction : row;
  justify-content:space-between;
}

.app_name {
  margin-left : 55px;
}

.app_name:hover{
  text-decoration : underline;
}

.layout_footer {
  width : 100%;
  display : grid;
  grid-template-columns : 1fr 1fr;
  justify-content : center;
  padding : 0 30px;
  background-color : rgba(255,255,255,.025);
}

.actions {
  display : flex;
  width : 150px;
  flex-direction : row;
  justify-content : space-between;
  align-items : center;
}

.colors {
  padding : 8px 0px;
}

.cont {
    border-right : .5px solid rgba(0,0,0,.5);
    padding : 10px;
    border-collapse: collapse;
    overflow : hidden;
    overflow-y : auto;
}
.other_screen_layouts {
    width : 100%;
    height : 100%;
    /* margin-top: 10%; */
    margin: 30px 50px;
    display : grid;
    grid-template-columns : 19% 19% 19% 19% 19%;
    /* grid-column-gap: 5px; */
    grid-row-gap : 20px;

}

.layout_other_img {
    max-width: 90%;
    height  : auto;
}

.layout_other_img_collapse {
    max-width: 20%;
    height  : auto;
}

/* Create three unequal columns that floats next to each other */
.column {
    float: left;
    padding: 50px;
}

/* Left and right column */
.column.side {
    width: 40%;
}

/* Middle column */
.column.middle {
    width: 60%;
}

.column.all {
    width: 100%;
}

.similar_screen_modal {
    width : 100%;
    height : 100%;
    padding : 0;
    display : grid;
    grid-template-columns : 50% 50%;
    grid-column-gap: 15px;
    grid-row-gap :15px;
    overflow: auto;
}

.similar_screen_display {
    max-width: 100%;
    height  : auto;
}

.bk {
  transition: all 0.05s ease-out;
}

.btn-success {
  background-color: #5ec791;
  border-color: #5ec791;
}

.btn-outline-success {
  color: #5EC791;
  background-color: #e9ecef;
  border-color: #5EC791;
}

.btn-outline-success:hover,
.btn-outline-success:focus,
.btn-outline-success:active,
.btn-outline-success.active,
.open .dropdown-toggle.btn-outline-success {
  color: #FFFFFF;
  background-color: #5EC791;
  border-color: #5EC791;
}

.share_content {
    text-align: center;
    padding-top:50px;
    padding-bottom:50px;
    cursor: pointer;
}

.share_links {
    margin-top:20px;
}

.share_facebook {
    color: #ffffff;
}

.share_twitter {
    color: #ffffff;
}

.share_reddit {
    color: #ffffff;
}

</style>

<script>
import modal from "./modal.vue";
import search from "../search.vue";
import axios from 'axios'

export default {
  name : "layout-view",
  components : {
    modal,
    search
  },

  props : {
    id : {
      type : String
    },

    layout_info : {
      type : Object
    }

  },

  data : function(){
    // Put data variables here
    // you can access your variable by using
    // this.<variable_name>
    return {
        global : this.$root,
        layout : null,
        other_screens : [],
        rgb_list : [],
        slide: 0,
        sliding: null,

        isShowingLayout: true,
        isShowingAllScreens: false,
        isShowingSimilar: false,

        isShowingShareModal: false,
        // isShowingModal: false,
        // isShowingSimilarModal: false,

        bkClass: 'bk',
        blurClass: 'blur',
        similarResults: [],
        similarColorResults: [],
    }
  },

  // Methods go here
  methods : {
    openShareModal : function(share_) {
      this.share = share_.package[0];
      let package_id = share_.package[0].split(" ").join(".");
      this.shareLink = "https://play.google.com/store/apps/details?id=" + package_id.toLowerCase();
      this.isShowingShareModal = true;
    },

    closeShareModal : function() {
        this.isShowingShareModal = false;
    },

    showAllScreen: function() {
      this.findOtherScreen();
      this.isShowingLayout = false;
      this.isShowingSimilar = false;
      this.isShowingAllScreens = true;
    },

    showLayout: function() {
      this.isShowingSimilar = false;
      this.isShowingAllScreens = false;
      this.isShowingLayout = true;
    },

    showSimilar: function() {
      this.isShowingLayout = false;
      this.isShowingAllScreens = false;
      this.isShowingSimilar = true;
    },


    findSimilarByColor : function(result){
      let j = 0
      let hue_1 = result.hue_1
      let hue_2 = result.hue_2
      let light_1 = result.light_1
      let light_2 = result.light_2
      let sat_1 = result.sat_1
      let sat_2 = result.sat_2

      console.log(result)

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

      let url = `/api/query?q=${squery}&fl=id,screenshot_location,package,screenID,categroy&start=0&rows=10`;
      console.log(url);
      this.similarColorResults = [];
      axios.get(url).
      then((r)=>{
        if(!r.data.response)
            return;
        console.log(r.data.responseHeader.QTime)
        this.similarColorResults = r.data.response.docs;
        console.log(this.similarColorResults.length)
        if(this.similarColorResults.length){

            this.similarColorResults.forEach((layout)=>{

                  console.log("in if")
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
      let categorylist = []
      let j = 0
      while(j < result.category.length){
        categorylist.push(" (category:" + result.category[j]+")");
        j = j + 1
      }
      let squery = categorylist.join(" ");
      let url = `/api/query?q=${squery}&fl=id,screenshot_location,package,screenID,category&start=0&rows=10`;
      this.similarResults = [];
      axios.get(url).
      then((r)=>{
        if(!r.data.response)
            return;
        console.log(r.data.responseHeader.QTime)
        this.similarResults = r.data.response.docs;
        console.log(this.similarResults.length)
        if(this.similarResults.length){

            this.similarResults.forEach((layout)=>{

                  if(!layout.screenshot_location || !layout.screenshot_location[0]) {
                      layout.screenshot_location = "";
                  } else {
                      let temp = layout.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                      layout.screenshot_location = "/layouts/" + temp;
                  }
            });
        }
      })
      this.findSimilarByColor(result);
      this.showSimilar();
    },


    findOtherScreen : function(){
      this.other_screens = [];
      let package_cur = this.layout.package[0];
      // // for now our n-gram tokenizer limits tokens to be of length 3-10,
      // // we will simply cut off at length 10.
      let package_list = package_cur.split(" ");
      for(let i = 0; i < package_list.length; i++){
        if(package_list[i].length > 10){
          package_list[i] = package_list[i].slice(0,10);
        }
      }

      for(let i = 0; i < package_list.length; i++){
        if(package_list[i].length < 3){
          package_list.splice(i, 1);
        }
      }


      // let appname_cur = this.layout.appname[0];
      // // for now our n-gram tokenizer limits tokens to be of length 3-10,
      // // we will simply cut off at length 10.
      // let appname_list = appname_cur.split(" ");
      // for(let i = 0; i < appname_list.length; i++){
      //   if(appname_list[i].length > 10){
      //     appname_list[i] = appname_list[i].slice(0,10);
      //   }
      // }
      // appname_cur = appname_list.join(" ");

      package_cur = package_list.join(" ");
      console.log(package_cur);
      // console.log(this.layout.appname[0]);
      axios.get(`/api/query?q=package:"${package_cur}"`)
        .then((r)=>{
          let screens = r.data.response.docs;
          if(screens.length){
              screens.forEach((screen)=>{
                  let temp = screen.screenshot_location[0].split(/[\/\\]/).slice(-2).join("/");
                  screen.screenshot_location = "/layouts/" + temp;
                  console.log(temp)
              });
              this.other_screens = screens;
          }
          //console.log(this.other_screens)
        }
      );
    },

    openOtherLayoutModal : function(id){
        console.log(id);
        // this.isShowingLayoutModal = true;
        this.showLayout();
        // this.$nextTick(()=>{
        //     this.$refs.layout.getLayoutById(id);
        // })
        this.getLayoutById(id);
    },

    closeOtherLayoutModal : function(){
        this.isShowingLayoutModal = false;
    },

    // Make an AJAX call to get the layout
    getLayoutById : function(id){
      id = id || this.id;
      if(!id){
        console.log("No id given");
        return;
      }

      axios.get(`/api/query?q=id:${id}`)
        .then((response)=>{
          let layout_cur = response.data.response.docs[0];
          // if no layout found redirect to 404 page
          if(!layout_cur || layout_cur.id != id){
              this.$router.push('/404');
              return
          }

          let temp = layout_cur.screenshot_location[0].split(/[\/\\]/).slice(2).join("/");
          layout_cur.screenshot_location = "/layouts/"+layout_cur.screenshot_location[0];
          // Populate list of colors (in hex)
          this.rgb_list = [];
          for(let i = 1; i < 7; i++){
            let r = `0${layout_cur[`red_${i}`].toString(16)}`.slice(-2),
              g = `0${layout_cur[`green_${i}`].toString(16)}`.slice(-2),
              b = `0${layout_cur[`blue_${i}`].toString(16)}`.slice(-2)
            let color = `#${r}${g}${b}`
            this.rgb_list.push(color.toUpperCase());
          }
          // Generate Google Play link
          let package_id = layout_cur.package[0].split(" ").join(".");
          this.strLink = "https://play.google.com/store/apps/details?id=" + package_id;
          //console.log(layout_cur);
          if(layout_cur.package[0].split(" ")[0] == "com"){
              layout_cur.package[0] = layout_cur.package[0].split(" ").slice(1).join(" ");
          }

          // get rid of repetitive package names
          let package_list = layout_cur.package[0].split(" ");
          if(package_list[0] == package_list[1]){
            package_list = package_list.slice(1);
          }
          for(let i = 0; i < package_list.length; i++){
              package_list[i] = package_list[i].charAt(0).toUpperCase() + package_list[i].slice(1);
          }
          //console.log(package_list);
          layout_cur.package[0] = package_list.join(" ");

          if(layout_cur.class[0].indexOf(".") >= 0){
            for(let i = 0; i < layout_cur.class.length; i++){
              layout_cur.class[i] = layout_cur.class[i].split(".").join(" ");
            }
          }

          for(let i = 0; i < layout_cur.class.length; i++){
            if(layout_cur.class[i].split(" ").length == 1){
              layout_cur.class.splice(i, 1);
            }
            layout_cur.class[i] = layout_cur.class[i].split(" ").slice(2).join(" ");
          }

          this.layout = layout_cur;

      });
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
  },
  // stuff to do when the page loads
  mounted : function(){
      // this.getLayoutById();
  }
}
</script>
