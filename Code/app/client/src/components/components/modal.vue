<template>
    <transition name="fade">
        <div class="guigle_modal" v-show="open" @click="close">
            <span class="close_btn fa fa-times" @click="close" v-if="close_button"></span>
            <div class="modal_content" @click.stop>
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>

module.exports = {
    name : "modal",
    props : {
        open : {
            type : Boolean
        },

        close_button : {
            type : Boolean
        }
    },
    data : function(){
        return {

        }
    },
    methods : {
        close : function(e){
            this.$emit('close')
        },

        openModal : function(){
            this.$emit('open')
        }
    }
}
</script>

<style>

#root.blur, .root.blur {
    filter: blur(1px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.close_btn {
    position : absolute;
    display : flex;
    justify-content : center;
    align-items : center;
    top : 30px;
    left : 30px;
    width : 40px;
    height : 40px;
    border-radius : 100%;
    background-color : white;
    color : rgba(0,0,0,.25);
    cursor : pointer;
    font-size : 1.1em;
    z-index : 99999;
}

.guigle_modal {
    position : fixed;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    top : 0;
    bottom : 0;
    right : 0;
    left : 0;
    width : 100%;
    overflow-y : auto;
    height : 100%;
    background-color : rgba(0,0,0,.3);
    display : flex;
    flex-direction : row;
    justify-content : center;
    z-index: 9999;
}

.modal_content {
    position : absolute;
    top : 20px;
    bottom: 20px;
    left: 85px;
    right: 50px;
    border-radius : 3px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    background-color : white;
    max-width : 90%;
    min-width : 55%;
    display : flex;
    flex-direction : column;
    padding : 8px;
    overflow: auto;
}

@media screen and (max-width : 860px){
    .modal_content {
        min-width : 100%;
        min-height : 100%;
    }
}

</style>
