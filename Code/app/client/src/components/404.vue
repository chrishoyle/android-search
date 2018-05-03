<!-- 
    A very simple 404 page that waits <time> 
    amount of seconds and then redirects 
    to the homepage. 
-->

<template>
    <div class="root"> 
        <p>404 Page Not Found.</p>
        <p> Click <a href="/">here</a> to go the the homepage</p>
        <p>Redirecting in {{time}} {{time == 1 ? 'second' : 'seconds'}} </p>        
    </div>
</template>

<script>
export default {
    data : function(){
        return {
            time : 5
        }
    },
    methods : {
        countDown(){
            if(this.time == 0){
                this.$router.push('/');
            }else{
                this.time--;
                setTimeout(this.countDown, 1000);
            }
        }
    },
    mounted : function(){
        // wait 1 second (1000 milliseconds) then call countDown function
        setTimeout(this.countDown, 1000);
    }
}
</script>

<style scoped>
.root
{
    width : 100%;
    height : 100%;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
}
</style>