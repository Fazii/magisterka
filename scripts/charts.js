let charts = []; // Array containing all existing charts
let chart;
let interval;

async function draw(containerId, address, refreshRate) {
    //Don't draw chart again if chart already exist
    for (let i = 0; i < charts.length; i++) {
        if (charts[i][0] === containerId.toString()) {
            return;
        }
    }

    chart = Highcharts.chart("container" + containerId, {

        chart: {
            type: 'spline',
            zoomType: 'xy',
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
            text: 'Odczyt: (' + address + ')'
        },
        xAxis: {
            title: {
                text: 'Czas'
            },
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Wartość'
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
    if(document.getElementById("layoutBlock").value === "Zablokuj") {
        alert("Zablokuj siatkę elementów przed ich usuwaniem");
        return;
    }
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

function updateChart(containerId, refreshRate, address) {
    charts.forEach(function (item, index) {
        if (item[0] === containerId.toString()) {
            let interval = item[2];
            clearInterval(interval);
            let series = item[1].series[0];
            item[2] = setInterval(async function () {
                let x = (new Date()).getTime(),
                    y = await getValueOnAddress(address);
                series.addPoint([x, y], true, true);
            }, refreshRate);

            item[1].update({
                title: {
                    text: 'Live data (' + address + ')'
                },
                series: [{
                    name: address
                }]
            });
        }
    });
}