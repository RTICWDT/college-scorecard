<template>
    <div class='header pa-3 elevation-4' 
        @click="toggleDrawer()"
        v-if="currentCount>0"
    >
        <v-icon color="amber" small class='pr-2'>fas fa-star</v-icon> {{currentCount}} {{school}} to compare and share
    </div>
</template>

<style lang="scss" scoped>
@import 'sass/_variables';
.header{
    position:fixed;
    width: 50%;
    left: 25%;
    bottom: 0px;
    background-color: $light-gray;
    cursor: pointer; 
    @media only screen and (max-width: 600px) {
        width: 100%;
        left: 0;
    }
   
}
</style>

<script>
export default {
    props:['schools'],
    data(){
        return{
        }
    },
    methods:{
        toggleDrawer(){
            this.$emit('update:showCompare', true);
        }
    },
    computed:{
        currentCount(){
            return this.schools.length
        },
        school(){
            return(this.schools.length>1)?'schools':'school';
        }
    }
}
</script>