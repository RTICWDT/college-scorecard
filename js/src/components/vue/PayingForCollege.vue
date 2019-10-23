<template>
    <div>
        <h2 class='title mb-2'>Learn More About<br /> Paying for College</h2>
        <p>Paying for college can be a concern, but there are options to help! You can learn more about the <a href="https://studentaid.ed.gov/sa/types#aid-from-the-federal-government" target="_blank" @click="trackOutboundLink($event)">types of financial aid</a> that are available on the student aid website.</p>
        <p>To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA). You can use the <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm" target="_blank" @click="trackOutboundLink($event)">FAFSA calculator</a> to see how much aid may be available to you. </p>
        <p class='text-center'><v-btn rounded color='secondary' href="https://fafsa.ed.gov/" target="_blank" @click="trackOutboundLink($event)">Start My FAFSA</v-btn></p>
        <p>In addition to the FAFSA, there are other programs such as the <a href="https://www.vets.gov/gi-bill-comparison-tool" target="_blank" @click="trackOutboundLink($event)">GI Bill® Benefits</a> which may also help you pay for school.</p>
    </div>
</template>

<script>
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js"
export default {
    mixins:[AnalyticsEvents]
}
</script>