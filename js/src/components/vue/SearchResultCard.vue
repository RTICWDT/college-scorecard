<template>
    <div class="school results-card">
            <span data-bind="school_container"><!-- Leave for now--></span>
            <div class="content-box">
                <h1>School ID: {{school.id}}</h1>
                <h3>School Name: {{school['school.name']}}</h3>
                <a class="link link-more" data-bind="more_link">
                    View more details <i class="fa fa-chevron-right"></i>
                </a>
            </div>
        </div>
</template>

<script>
export default {
    props:{
        "school": Object
    }
}
</script>