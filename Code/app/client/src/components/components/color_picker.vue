<!--
A simple flickr style color picker
TODO:
[x] In-browser color picker popup rather than default
[ ] Calculate luminosity of css colors
[ ] Fix color generation algorithm
-->

<template>
  <div class="multi_color_picker">
    <div class="color_square"
      v-for="(color, key) in color_list"
      v-bind:key="key"
      @click="toggleColor(color)"
      @dblclick="removeColor(key)"
      :class="[
        'color_sqare',
         color.dark ? 'dark' : '',
         color.border ? 'border' : '',
         selected == limit && !color.selected ? 'fade' : '' ]"
      :style="{backgroundColor:color.value}">
        <span class="color_square_inner fa fa-check" v-if="color.selected"></span>
    </div>
    <div class="color_square border" v-if="editable" @click="isPickerOpen=!isPickerOpen">
        <span class="fa fa-plus"></span>
    </div>
    <div class="color_square border" v-if="editable" @click="removeColor">
        <span class="fa fa-minus"></span>
    </div>
    <transition name="fade">
        <div class="color_picker_popup_wrapper" v-if="isPickerOpen">

            <chrome-picker class="color_picker_dialogue" :value="[0,0,0]" @input="changeSelected" disableAlpha/>
            <div class="color_alert" v-if="this.color_list.length > 20">Too many colors selected</div>
            <div class="color_picker_dialogue_controls">

                <div class="color_picker_dialogue_control" @click="addColor"> Okay </div>
                <div class="color_picker_dialogue_control" @click="isPickerOpen=false"> Close </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<style lang="scss" scoped>
.multi_color_picker {
    position : relative;
    display : flex;
    flex-direction : row;
    .color_picker_popup_wrapper {
        background-color : white;
        position : absolute;
        margin-top : 10px;
        top : 100%;
        right : 0;
        padding : 5px;
        z-index : 50;
        box-shadow : 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
        text-align: center;
        border-radius : 3px;
        .color_picker_dialogue {
            box-shadow : none;
        }

        .color_alert {
            color : #fff;
            background-color: #fd6b6b;
            border-radius: 4px;
            font:8px;
        }

        .color_picker_dialogue_controls {
            margin : 0 18px;
            padding : 20px 0px;
            // padding : 0 30px;
            border-top : 1px solid rgba(0,0,0,.1);
            display : flex;
            flex-direction : row;
            justify-content : flex-start;
            .color_picker_dialogue_control {
                flex : 1;
                text-align : center;
                padding : 3px 10px;
                // margin-right : 8px;
                border : 1px solid rgba(0,0,0,.2);
                color : rgba(0,0,0,.5);
                border-radius : 3px;
                cursor : pointer;
                &:hover {
                    color : white;
                    background-color : #28a745;
                }
            }
        }
    }
}

.color_square {
    cursor : pointer;
    border-radius : 5px;
    width : 20px;
    height : 20px;
    color : darkslategray;
    margin-right : 5px;
    display : flex;
    justify-content : center;
    align-items : center;
    font-size : 12px;
    &.dark {
        color : white;
    }
    &.border {
        box-sizing : border-box;
        border : 1px solid rgba(0,0,0,.2) !important;
    }
    &.fade {
        opacity : .3;
    }
    .color_square_inner {
        position : absolute;
    }
}

</style>


<script>
const cssColorNames = {
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
};

import { Chrome } from "vue-color";

/**
 *
 */
function hexToRGB(hex){
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex).map(c=>parseInt(c,16)).slice(1);
}

/**
 * Converts a number (num) with base (radix) into
 * a zero padded string with at most (size) digits
 */
function numToString(num, radix, size){
  return ("0".repeat(size) + Math.round(num).toString(radix)).slice(-size);
}
/**
 * Gets the luminosity given rgb values
 */
function getLuminosity(r, g, b){
  // Normalize sRGB to RGB
  r /= 255;
  g /= 255;
  b /= 255;
  r = r < 0.03928 ? r / 12.92 : Math.pow(( r + 0.055)/1.055, 2.4);
  g = g < 0.03928 ? g / 12.92 : Math.pow(( g + 0.055)/1.055, 2.4);
  b = b < 0.03928 ? b / 12.92 : Math.pow(( b + 0.055)/1.055, 2.4);
  // Calculate Luminosity
  let L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L;
}

export default {
    name : "color-picker",
    components : {
        'chrome-picker' : Chrome
    },
    props : {
        mode : {
            type : String
        },
        number : {
            type : Number,
            default : 10
        },
        editable : {
            type : Boolean
        },
        colors : {
            type : Array
        }
    },
    data : function(){
        return {
            color_list : [],
            myColors : [],
            isPickerOpen : false,
            selectedColor : [{hex:"#000000"}],
            limit : 5,
            selected : 0
        }
    },
    methods : {
        toggleColor : function(color){
            if(!color.selected)
                if(this.selected == this.limit)
                return;
            color.selected = !color.selected;
            if(color.selected)
                this.selected++;
            else
                this.selected--;
            this.emitUpdate();
        },

        removeColor : function(){
            // if(key >= this.number){
            //     let c = this.color_list.splice(key, 1);
            //     if(c[0].selected)
            //         this.selected--;
            //     this.emitUpdate();
            // }
            this.unselectAll();
            var color_list_len = this.color_list.length
            for (var i = 10; i < color_list_len; i++){
                this.color_list.pop();
            }
        },

        unselectAll : function() {
          for (var i = 0; i < this.color_list.length; i++) {
            let c = this.color_list[i];
            console.log("c- ",c)
            if (c.selected) {
                c.selected = !c.selected;
                this.selected --;

                console.log("removed", c);
                this.emitUpdate();
            }
          }
        },

        changeSelected : function(color){
            // console.log(color);
            this.selectedColor = color;
        },

        // Add a color
        // Assumes color is a 6 digit hex string or a css color value
        addColor : function(color, isSelected = true, emitEvent = true){
            if (this.color_list.length > 20){
              return null
            }

            color = (typeof color == "string") ? color : this.selectedColor.hex;
            if (!color){
              color = "#000000"
            }
            let result = { value : color, selected : isSelected, dark : true, border : false }
            // Check if color is a hex string
            if(!(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(result.value))){
                let hex;
                if(hex = cssColorNames[result.value.toLowerCase()])
                    result.value = hex;
                else
                    return null
            }
            let luminosity = getLuminosity.apply(null, hexToRGB(result.value));
            if(luminosity >= .86)
                result.border = true;
            if(luminosity >= .6)
                result.dark = false;
            this.color_list.push(result)
            if(result.selected)
                this.selected++;
            if(emitEvent)
                this.emitUpdate();
            return result;
        },

        emitUpdate : function() {
            // Collect all the selected colors
            let result = this.color_list.map((c)=>c.selected ? c.value : null).filter(Boolean);
            this.$emit('update', result);
        }
    },
    mounted : function(){
        if(this.colors && this.colors.length){
            // this.number = this.colors.length;
            this.colors.forEach(c=>{
                // Get the hex value from css color name
                this.addColor(c, false, false);
            })
            return;
        }
    }
};

</script>
