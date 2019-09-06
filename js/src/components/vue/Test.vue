<template>
    <section>
        <h1>Hello From Vue</h1>
        
        <button type="button" class="button button-compare_schools" data-bind="selected_school" aria-label="Add to Compare" data-school="compare-schools" aria-pressed="false" data-school-id="102049" data-school-name="Samford University" aria-describedby="tip-compare-add">
            <i class="fa fa-plus-circle tooltip-target"></i>
            <span class="sr-only">Add to Compare</span>
        </button>
    </section>
</template>

<script>
export default {
    data(){
        return {
            test_message: "Test Me"
        }
    },
    mounted(){
        console.log("I have mounted");
        console.log(picc);
    },
    methods:{
        OnClick: function(){
            console.log("Button Clicked");
        }
    }
}
</script>