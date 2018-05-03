import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
import infiniteScroll from 'vue-infinite-scroll'
import BootstrapVue from 'bootstrap-vue'
import VueAutosuggest from 'vue-autosuggest'
import SearchSuggestion from 'vue-search-suggestion'
import store from "./store"

Vue.use(VueRouter)
// The global
let data = {
  display_term:"",
  search_term : "",
  xfields : {
      // Components
      Components : [
          {name : "Dialog Box",  field: "dialogbox",  value : "((middleList:button) NOT (lowList:button) NOT (upList:button))",  active : false },
          {name : "Input Box",   field: "inputbox",   value : "(class:EditText AND (text:search OR text:enter OR text:cancel OR text:input OR text:OK OR text:create OR text:find))", active : false },
          {name : "Option List", field: "optionlist", value : "((class:listview AND (class:CheckedTextView OR class:TextView)) OR (class:spinner AND class:Button))", active : false},
          {name : "Button", field: "button", value: "class:button" , active : false},
          {name : "Check Box", field: "checkbox",value:"class:checkbox",active: false},
          {name : "Spinner", field: "spinner",value:"class:spinner",active: false},
          {name : "Seek Bar", field: "seekbar",value:"class:seekbar",active: false},
          {name : "Picker", field: "picker",value:"class:picker",active: false},
          {name : "Progress Bar", field:"progressbar", value:"class:progressba",active:false},
          {name : "Toggle", field:"toggle", value:"class:toggle",active:false},
      ],
      // Activities
      Activities :[
          {name : "AdMob", field : "admob", value : "text:ad OR text:upgrade NOT text:term", active : false},
          {name : "Map",   field : "map",   value : "text:map NOT (class:ExpandableListView AND class:listview AND class:RecyclerView)", active : false},
          {name : "Login", field : "login", value : "(text:login OR text:signin)", active : false},
          {name : "Calendar", filed : "calendar",value :"((text:calendar)AND (class:button OR class: listview OR class:edittext)) OR (text:date AND class:picker) OR(text:Jan OR text:Feb or text : Mar or text: April or text:June or text: July or text:Aug or text:Sep or text: Oct or text:Nov or text:Dec or text:201 or text: Mon or text:Tues or text:Wed or text:Thur or text:Fri )",active:false},
          {name : "Tool Tip", field: "tooltip",value:"",active:false},
          {name : "Gallery", field: "gallery", value:"class:gridview",active:false},
          {name : "Setting",field:"setting",value:"text:setting",active:false},
          {name : "Splash Screen", field:"splashscreen", value: "class:viewpager AND class:linearlay AND class:imageview AND class:framelay NOT class:clickable",active:false},
          {name : "Share",field:"share",value:"(text:share )AND ( class:button OR class:clickable)",active:false}
      ],

  },

  ui_list: ["button", "list", "imageview", "textview", "imagebutton", "listview", "tablerow", "scrollview", "edittext", "viewpager", "drawerlayout", "recyclerview", "switch","adapterview", "imageswitcher",
  "horizontalscrollview", "checkbox", "spinner", "gridview", "checkedtextview", "progressbar", "tab", "radiobutton", "actionbar", "image", "tablerow", "seekbar", "viewflipper", "numberpicker",
  "datepicker", "ratingbar", "videoview", "togglebutton", "toggle", "viewswitcher", "calendarview", "expandablelistview", "viewanimator", "actionbar", "textswitcher", "timepicker", "gallery"],
  cssColorNames : {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "grey": "#808080",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
  },
  // Favorites
}

// Route components
import index from './components/index.vue'
import layout from './components/layout.vue'
import search from './components/search.vue'
import error from './components/404.vue'
import layoutView from './components/components/layout_view.vue'

// Set plugins
Vue.use(infiniteScroll)
Vue.use(BootstrapVue)
Vue.use(VueAutosuggest)
Vue.use(SearchSuggestion)

Object.defineProperty(Vue.prototype, '$axios', {value : axios} )

// Set our routes
const routes = [
  {
      path : '/',
      component : index
  },
  {
      path: '/search',
      props: true,
      component: search
  },
  {
      path: '/layout/:id',
      component: layout
  },
  // catch all other routes and route to 404 page
  {
      path: '*',
      component: error
  }
]

const router = new VueRouter({ routes, mode: 'history' })

Vue.component('layout-view',layoutView)

const app = new Vue({
    router,
    el : "#app",
    store,
    data,
    methods : {

    },
    mounted : function(){
        this.$store.dispatch('loadFavorites')
    }
})
