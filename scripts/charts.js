let charts = []; // Array containing all existing charts
let chart;
let interval;

async function draw(containerId, address, refreshRate) {
    console.log("drawing: " + containerId + " " + address + " " + refreshRate);

    //Don't draw chart again if chart already exist
    for (let i = 0; i < charts.length; i++) {
        if (charts[i][0] === containerId.toString()) {
            return;
        }
    }

    console.log("drawn: " + containerId + " " + address + " " + refreshRate);

    chart = Highcharts.chart("container" + containerId, {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: async function () {

                    // set up the updating of the chart each second
                    let series = this.series[0];
                    interval = setInterval(async function () {
                        let x = (new Date()).getTime(), // current time
                            y = await getValueOnAddress(address);
                        series.addPoint([x, y], true, true);
                    }, refreshRate);
                }
            }
        },

        time: {
            useUTC: false
        },

        title: {
            text: 'Live data (' + address + ')'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },
        legend: {
            enabled: true
        },
        exporting: {
            enabled: true
        },
        series: [{
            name: address,
            data: (function () {
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -100; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: null
                    });
                }
                return data;
            }())
        }]
    });

    let chartData = [containerId, chart, interval];
    charts.push(chartData);
}

/**
 * Delete all chart data and remove it from {@charts } array
 *
 * @param containerId
 */
function deleteChart(containerId) {
    console.log("delete chart: " + containerId);
    charts.forEach(function (item, index) {
        if (item[0] === containerId.toString()) {
            clearInterval(item[2]);
            item[1].destroy();

            if (index > -1) {
                charts.splice(index, 1);
            }
        }
    });
}