<template>
    <div :class="['root', isExpanded ? 'full' : '']">
        <small style="margin-right:10px">Apply filter:</small>
        <div v-for="(filter, name) in search_filters"
            class="filter"
            :key="name">
            <button :class="['filter_name', open_view == name ? 'selected' : '']"
                @click="toggleView(name)">{{name}}</button>
            <div class="filter_view" v-if="open_view == name">
                <div
                    v-for="(f, key) in filter" :key="key"
                    @click="f.active = !f.active; emitUpdate()"
                    :class="['filter_name', f.active ? 'active' : '']">
                    {{f.name}}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.root{
    position : relative;
    height : 30px;
    width : 100%;
    display : flex;
    flex-direction : row;
    align-items : baseline;
    transition : .2s height ease-in-out;
    overflow : hidden;
    &.full{
        height : 120px;
    }
    .filter{
        .filter_name{
            font-size : 15px;
            margin-right : 15px;
            padding : 3px 8px;
            border-radius : 5px;
            background-color : transparent;
            cursor : pointer;
            border : 1px solid rgba(0,0,0,.2);
            color : rgba(0,0,0,.5);
            &:focus{
                outline : none;
            }
            &.active{
                border : 1px solid #5ec791;
                color : #5ec791;
                background-color : rgba(0,255,0,.03);
            }
            &:hover{
                background-color : #5ec791;
                color : white;
            }
            &.selected{
                color : white;
                background-color : #5ec791;
                border : 1px solid #5ec791;
            }
        }
        .filter_view{
            margin-top : 20px;
            border-top : 1px solid rgba(0,0,0,.2);
            display : flex;
            align-items : center;
            flex-direction : row;
            background-color : white;
            position : absolute;
            width : 100%;
            height : 70px;
            left : 0;
        }
    }
}
</style>

<script>
export default {
    props : ["filters"],
    data : function(){
        return {
            search_filters : this.filters,
            open_view : "",
            isExpanded : false,
        }
    },
    methods : {
        toggleView : function(v){
            if(v == this.open_view){
                this.open_view = "";
                this.isExpanded = false;
            }else{
                this.open_view = v;
                this.isExpanded = true;
            }
        },
        emitUpdate : function(){
            this.$emit('update')
        }
    }
}
</script>
