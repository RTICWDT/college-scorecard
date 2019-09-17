<template>
    <div class='pieContainer' style='position:relative;'>
        <div id='piechart' :style='style'></div>
        
        <div class='pieLabel' style='position: absolute; left: 2px; top: 2px; width: 150px; line-height: 150px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: maroon;'>            
        {{ value }}%
        </div>
    </div>
</template>


<script>
export default {
    props: ['value','height','width','title'],
    data(){
        return{
           
        }
    },
    computed:{
        style(){
            return "height: "+this.height+"; width: "+this.width+";";
        }
    },
    mounted(){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawChart);
    },
    methods: {
        drawChart(){
        var data = google.visualization.arrayToDataTable([
          ['label', 'value'],
          ['', Number(this.value)],
          ['', 100-Number(this.value)]
        ]);

        var options = {
          title: this.title,
          pieHole: 0.4,
          legend: 'none',
          pieSliceText: 'none',
          slices: {
            0: { color: '#2c8511' },
            1: { color: 'gray' }
          },
          enableInteractivity: false,
          fontName:'"Montserrat", "Helvetica Neue", "Helvetica", sans-serif'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }
    }
}
</script>