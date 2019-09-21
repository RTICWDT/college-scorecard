<template>
    <div class='range-chart'>
        <div :style="{ left: bar_styles.left, right: bar_styles.right }" class='picc-range-bar' ref='bar'></div>
        <span class='picc-range-label picc-range-label-min' :style="_min.styles" ref='min'><span v-html="_min.label"></span></span>
        <span class='picc-range-label picc-range-label-max' :style="_max.styles" ref='max'><span  v-html="_max.label"></span></span>
        <span class='picc-range-label picc-range-label-lower' :style="_lower.styles" ref='lower'><span  v-html="_lower.label"></span></span>
        <span v-if="!hideMiddle" class='picc-range-label picc-range-label-middle' :style="_middle.styles" ref='middle'><span  v-html="_middle.label"></span></span>
        <span class='picc-range-label picc-range-label-upper' :style="_upper.styles" ref='upper'><span  v-html="_upper.label"></span></span>
    </div>
</template>



<script>
export default {
    props:{
        min:{
            type: Object,
            default: function(){ return { value: 0, label: '0' }}
        },
        max:{
            type: Object,
            default: function(){ return { value: 100, label: '100' }}
        },
        lower:{
            type: Object,
            default: function(){ return { value: 25, label: 'Lower' }}
        },
        middle:{
            type: Object,
            default: function(){ return { value: 50, label: 'Middle' }}
        },
        upper:{
            type: Object,
            default: function(){ return { value: 75, label: 'Upper' }}
        },
        hideMiddle: {
            type: Boolean
        }
    },
    data(){
        return {
            bar_styles: { left: 0, right: 0 },
        }
    },
    computed:{
        _min(){
            return this.styleLabel(this.min);
        },
        _max(){
            return this.styleLabel(this.max);
        },
        _lower(){
            return this.styleLabel(this.lower);
        },
        _middle(){
            return this.styleLabel(this.middle);
        },
        _upper(){
            return this.styleLabel(this.upper);
        },
    },
    methods:{
        update(){
            var min = this._min.value;
            var max = this._max.value;
            this.bar_styles.left = this.percent(this._lower.value);
            this.bar_styles.right = this.percent(this._min.value + this._max.value - this._upper.value);

        },
        scale(v){
            return (v - this.min.value) / (this.max.value - this.min.value);
        },
        percent(v){
            return(this.scale(v)*100).toFixed(1)+"%";
        },
        styleLabel(obj){
             let newObj = {...obj};
             newObj.styles = {};
             newObj.styles.display = newObj.label ? 'block' : 'none';
             newObj.styles.left = this.percent(newObj.value);
             return newObj;
        }

    },

    mounted(){
        this.update();
    }    
}
</script>