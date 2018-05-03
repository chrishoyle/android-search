import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        favorites : []
    },

    getters : {
        favorites : state => state.favorites,
        // Returns true if something is a favorite or not
        isFavorite : (state)=>(favId)=>{
            return !!state.favorites.find(f => f.id == favId)
        }
    },
    // State changes must be done via mutation functions in the store
    // this.$store.commit('<mutation>')
    mutations : {
        // Add a favorite
        // As long as the object has an 'id' then it should work
        addFavorite : (state, fav) => {
            state.favorites.unshift({id:fav.id, name: (fav.name || fav.package)[0]});
            // Save in local_storage
        },
        // Remove a favorite by its id
        removeFavorite : (state, favId) => {
            // Find by the id
            if(typeof favId == "object")
                favId = favId.id
            let i = 0;
            while(i < state.favorites.length){
                if(state.favorites[i].id == favId)
                    state.favorites.splice(i, 1)
                else
                    i++
            }
        },

        removeAllFavorites : (state) => {
            state.favorites.splice(0, state.favorites.length)
        }
    },
    actions : {

        loadFavorites : function({state}){
            state.favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        },

        saveFavorites : function({state}){
			localStorage.setItem("favorites", JSON.stringify(state.favorites) || "[]")
		},
    }
})
