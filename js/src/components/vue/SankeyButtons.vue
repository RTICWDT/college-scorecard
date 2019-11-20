<template>
<div>
    <div>
      <p class="outcomes_intro d-inline-block mb-2">Show data for students who</p>
        <v-btn class='ma-1 d-block d-sm-inline' small :color="enroll == 'enroll_first_time'? 'secondary':null" @click="enroll='enroll_first_time'; updateSankey()">started college here</v-btn>
        <v-btn class='ma-1 d-block d-sm-inline' small :color="enroll == 'enroll_not_first_time'? 'secondary':null" @click="enroll='enroll_not_first_time'; updateSankey()">transferred in</v-btn>
        <v-btn class='ma-1 d-block d-sm-inline' small :color="enroll == 'enroll_both'? 'secondary':null" @click="enroll='enroll_both'; updateSankey()">both</v-btn>
    </div>
    <div>
      <p class="outcomes_intro d-inline-block ">and started their studies</p>
        <v-btn class='ma-1 d-block d-sm-inline' small :color="study == 'study_full_time'? 'secondary':null" @click="study='study_full_time'; updateSankey()">full-time</v-btn>
        <v-btn class='ma-1 d-block d-sm-inline' small :color="study == 'study_part_time'? 'secondary':null" @click="study='study_part_time'; updateSankey()">part-time</v-btn>
        <v-btn class='ma-1 d-block d-sm-inline' small :color="study == 'study_both'? 'secondary':null" @click="study='study_both'; updateSankey()">both</v-btn>
        .
    </div>
    </div>

</template>

<script>
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";
export default {
    mixins: [AnalyticsEvents],
    data(){
        return {
            enroll: "enroll_both",
            study: "study_both",
        }
    },
    methods:{
        updateSankey(){
            this.$emit('update-sankey', { enroll: this.enroll, study: this.study });
            this.trackOutcome(this.enroll.substring(7).replace(/_/g, " ")+" " +this.study.substring(6).replace(/_/g, " "))
        }
    }
}
</script>