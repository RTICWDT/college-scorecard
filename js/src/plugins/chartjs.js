Chart.defaults.global.defaultFontFamily = "'Montserrat', 'Helvetica', 'Arial', sans-serif"
Chart.defaults.global.defaultFontSize= 16;
Chart.defaults.global.defaultFontColor = 'rgba(0, 0, 0, 0.87)';
Chart.defaults.global.legend = false;
Chart.defaults.global.title.display = true;
Chart.defaults.global.title.position = 'top';
Chart.defaults.global.tooltips.enabled = false;
Chart.defaults.global.elements.rectangle.backgroundColor = "#d37c39";


Chart.scaleService.updateScaleDefaults('linear', {
    ticks: {
        min: 0,
        callback: function(value, index, values) {
            return value.toLocaleString(); 
         }
    },
    gridLines:{
        display: false,
    },
    
});
Chart.scaleService.updateScaleDefaults('category', {
    ticks: {
    },
    gridLines:{
        display: false,
    } 
});