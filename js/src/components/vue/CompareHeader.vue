<template>
    <div id="compare-header"
        class='header pa-3 elevation-4'
        @click="toggleDrawer()"
        v-if="currentCount>0"
    >
        <span v-if="currentCount<10"><v-icon color="amber" small class='pr-2'>fas fa-plus-circle</v-icon> {{currentCount}} {{school}} to compare and share.</span>
        <span v-else><v-icon color="red" small class='pr-2'>fas fa-exclamation-circle</v-icon> Maximum of 10 schools reached. Remove some to add more.</span>
    </div>
</template>

<style lang="scss" scoped>
@import 'sass/_variables';
.header{
    position:fixed;
    width: 50%;
    left: 25%;
    bottom: 0px;
    background-color: rgba(0,0,0,0.9);
    color: #FFFFFF;
    z-index: 200;
    border-radius: 3px 3px 0 0;
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