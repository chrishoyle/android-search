<!--
Favorites View
A simple popdown menu that uses the Vuex store
-->

<template>
    <div class="root" id="fav_dropdown">
        <div name="header" class="tabheader" v-if="favorites.length">
            Favorites
        </div>
        <div class="favs" v-if="favorites.length">
            <div class="fav" v-for="(fav, i) in favorites" v-bind:key="i">
                <a style="display:inline-block;" @click="openLayoutModal(fav.id)">{{fav.name}}</a>
                <span style="clear:right;"class="fa fa-close" v-on:click="removeFavorite(fav)"></span>
            </div>
        </div>
        <div class="fav_footer footer" v-if="favorites.length">
            <div class="delete_button red"  v-on:click="removeAllFavorites">Remove All Favorites &nbsp;<span class="fa fa-trash"></span></div>
        </div>

        <div v-else class="empty_results">
            <p>
                No favorites yet. Try performing a search and then clicking the
                <span class="fa fa-star-o" style="color:teal;"></span> icon.
            </p>
        </div>

        <modal v-bind:open="isShowingLayoutModal" @close="closeLayoutModal">
            <layout-view ref="layout" v-bind:id="layout_id"></layout-view>
        </modal>
    </div>
</template>

<style lang="scss" scoped>
.root {
    color : rgba(0,0,0,.8);
    width : 100%;
}

#fav_dropdown {
    position: relative;
    border-radius: 4px;
}

.tabheader {
    color: #fff;
    background-color: #5ec791;
    text-align: center;
    padding: 6px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.favs {
    position: relative;
    max-height: 300px;
    overflow-y: scroll;
}

.fav {
    border-top: 1px solid #333;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.028);
}

.fav a {
    text-decoration: none;
    color: #000 !important;
    max-width: 80%;
}

.fav a:hover {
    text-decoration: underline;
}


.fav span {
    float: right;
    font-weight: 200;
    cursor:pointer;
}

.fav_footer {
    text-align: center;
    margin-bottom: 0%;
    bottom: 0;
}

.delete_button {
    color: #fff;
    background-color:#CC4830;
    cursor: pointer;
    padding: 6px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}

.empty_results {
    padding:20px;
}

</style>

<script>
import modal from './modal.vue'
import layoutView from './layout_view.vue'


export default {
    components: {
        modal,
    },

    data : function(){
        return {
          isShowingLayoutModal : false,
          layout_id : "",
        }
    },

    computed : {
        favorites : function(){
            return this.$store.getters.favorites
        }
    },

    methods : {
        removeFavorite : function(fav){
            this.$store.commit('removeFavorite', fav)
            this.$store.dispatch('saveFavorites')
        },

        removeAllFavorites : function(){
            this.$store.commit('removeAllFavorites')
            this.$store.dispatch('saveFavorites')
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
    },
}
</script>
