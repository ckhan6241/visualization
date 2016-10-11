import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var Highcharts = require('highcharts');

Template.body.helpers({
    render() {
        var cdata = [11, 12, 10, 11, 14, 11, 15, 16, 12, 12, 11, 14, 12, 14, 12, 12, 13, 13, 15, 11, 13, 12, 14, 10, 12, 13, 11, 13, 13, 12, 13, 12, 12, 13, 12, 14, 13, 11, 10, 9, 13, 13, 12, 15, 13, 9, 11, 12, 10, 15, 11, 14, 11, 12, 13, 15, 12, 13, 13, 14, 12, 12, 12, 11, 13, 13, 11, 13, 15, 9, 12, 11, 13, 11, 13, 12, 11, 15, 14, 13, 13, 12, 12, 13, 13, 11, 13, 11, 13, 15, 14, 13, 12, 11, 10, 12, 14, 12, 16, 14, 15, 15, 19, 17, 16, 18, 19, 15, 18, 20, 18, 20, 17, 18, 18, 19, 17, 17, 17, 18, 17, 17, 16, 16, 17, 17, 18, 17, 16, 18, 17, 17, 17, 17, 20, 15, 16, 18, 16, 18, 19, 17, 16, 17, 18, 22, 15, 18, 17, 15, 16, 18, 18, 18, 14, 18, 17, 19, 16, 18, 17, 18, 18, 14, 17, 17, 15, 16, 15, 17, 17, 17, 18, 14, 20, 16, 17, 16, 15, 17, 18, 19, 17, 18, 16, 17, 20, 18, 14, 18, 19, 13, 18, 17, 18, 17, 18, 18, 18, 17]
        var ldata = [13, 14, 12, 11, 12, 15, 11, 12, 14, 14, 11, 13, 12, 12, 13, 16, 13, 13, 11, 12, 13, 11, 11, 15, 15, 17, 17, 15, 18, 16, 18, 15, 18, 19, 16, 18, 18, 17, 17, 21, 16, 17, 20, 19, 20, 19, 19, 19, 16, 15]
        /**
         * Get histogram data out of xy data
         * @param   {Array} data  Array of tuples [x, y]
         * @param   {Number} step Resolution for the histogram
         * @returns {Array}       Histogram data
         */
        function histogram(data, min, max) {
            var histo = {},
                x,
                i,
                arr = [];

            // Group down
            for (i = min; i <= max; i++) {
                histo[i] = 0;
            }
            for (i = 0; i < data.length; i++) {
                x = data[i];
                if (histo[x] == undefined) {
                    continue;
                }
                histo[x]++;
            }

            // Make the histo group into an array
            for (x in histo) {
                if (histo.hasOwnProperty((x))) {
                    // arr.push([parseFloat(x), histo[x]]);
                    arr.push({
                      name: parseInt(x), 
                      y: histo[x],
                      // drilldown: toString(x),
                    });
                }
            }

            // Finally, sort the array
            arr.sort(function (a, b) {
                // return a[0] - b[0];
                return a.name - b.name;
            });
            return arr;
        }
        function findHover(datas) {
            for (data in datas) {
                data = datas[data];
                if (data.state == "hover"){
                    return data.x
                }
            }
        }
        var pieChart;
        function plotPieChart(chart, index) {
            pieChart.setTitle({text: "Consumer type"}, 
                {text: 'Time: ' + chart.series[0].data[index].category});
            pieChart.series[0].setData([["potential customers", chart.series[0].data[index].y], 
            ["customers", chart.series[1].data[index].y]]);
        }
        Meteor.defer(function() {
            var myChart = Highcharts.chart('container', {
        
                chart: {
                    type: 'column',
                    renderTo: 'container'
                },
                title: {
                    text: 'Customers Analytics',
                },
                subtitle: {
                    text: 'Date: 10/10/16',
                },
                xAxis: {
                    gridLineWidth: 1,
                    categories: ["9 am", "10 am", "11 am", "12 pm", "1 pm", 
                                 "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm",
                                 "8 pm", "9pm", "10pm"],
                },
                yAxis: [{
                    title: {
                        text: 'Count'
                    },
                    stackLabels: {
                        enabled: true,
                        formatter: function(){return ''}
                    },
                }],
                tooltip: {
                    shared: true,
                    headerFormat: '<b>{point.x}</b><br>'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            formatter: function(){return (this.point.y > 1 ? this.point.y : '');}
                        },
                        events: {
                            click: function(event) {
                                index = this.chart.hoverPoint.x
                                // pieChart.setTitle({text: 'Time: ' + this.chart.series[0].data[index].name});
                                // pieChart.series[0].setData([["potential customers", this.chart.series[0].data[index].y], 
                                // ["customers",this.chart.series[1].data[index].y]]);
                                plotPieChart(this.chart, index);
                            }
                        }
                    }
                },
                series: [ {
                    name: 'Potential customers',
                    type: 'column',
                    data: histogram(ldata, 9, 22),
                    pointPadding: 0,
                    groupPadding: 0,
                }, {
                    name: 'Customers',
                    type: 'column',
                    data: histogram(cdata, 9, 22),
                    pointPadding: 0,
                    groupPadding: 0
                    // drilldown: 
                }],
                // drilldown: getDrilldown(data, 5)
            });
            pieChart = Highcharts.chart('container2', {
                chart: {
                    renderTo: 'container2',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Consumer type'
                },
                subtitle: {
                    subtitle: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        name: 'Microsoft Internet Explorer',
                        y: 56.33
                    }, {
                        name: 'Chrome',
                        y: 24.03,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Firefox',
                        y: 10.38
                    }, {
                        name: 'Safari',
                        y: 4.77
                    }, {
                        name: 'Opera',
                        y: 0.91
                    }, {
                        name: 'Proprietary or Undetectable',
                        y: 0.2
                    }]
                }]
            });
        })
    }
})
