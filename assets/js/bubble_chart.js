// Konstanten die für alle Bubble Charts gleich sind

// Grösse des Charts
var width = 1166;
var height = 700;

// Tooltip zum anzeigen der Daten
var tooltip = floatingTooltip('ausfaelle_tooltip', 300);

// Farbpallette für die Verkehrsmittelkategorien
var fillColor = d3.scaleOrdinal()
    .domain(['Bus Berg', 'Bus Agglo', 'Zug Berg', 'Zug Überland'])
    .range(['#f77f00', '#ca6702', '#0a9396', '#94d2bd']);

// Variable die Skalierung angibt (scaling_line, scaling_line_bundles, scaling_all)

var sort_type = 'all';
var scale_type = 'line';

var sort = {
    'all': {
        'center': {
            x: width / 2, y: height / 2
        },
        'titles': null,
        'csv': 'assets/data/ausfaelle_tu_all.csv',
    },
    'day': {
        'center': {
            'Montag': {x: 133 + 1000 / 9 * 1, y: height / 2},
            'Dienstag': {x: 133 + 1000 / 9 * 2, y: height / 2},
            'Mittwoch': {x: 133 + 1000 / 9 * 3, y: height / 2},
            'Donnerstag': {x: 133 + 1000 / 9 * 4, y: height / 2},
            'Freitag': {x: 133 + 1000 / 9 * 5, y: height / 2},
            'Samstag': {x: 133 + 1000 / 9 * 6, y: height / 2},
            'Sonntag': {x: 133 + 1000 / 9 * 7, y: height / 2}
        },
        'titles': {
            'Montag': 100,
            'Dienstag': 261,
            'Mittwoch': 422,
            'Donnerstag': 583,
            'Freitag': 744,
            'Samstag': 905,
            'Sonntag': 1066,
        },
        'csv': 'assets/data/ausfaelle_tu_day.csv',
    },
    'time': {
        'center': {
            '01:00 - 05:00': {x: 133 + 1000 / 8 * 1, y: height / 2},
            '05:00 - 09:00': {x: 133 + 1000 / 8 * 2, y: height / 2},
            '09:00 - 13:00': {x: 133 + 1000 / 8 * 3, y: height / 2},
            '13:00 - 17:00': {x: 133 + 1000 / 8 * 4, y: height / 2},
            '17:00 - 21:00': {x: 133 + 1000 / 8 * 5, y: height / 2},
            '21:00 - 01:00': {x: 133 + 1000 / 8 * 6, y: height / 2},
        },
        'titles': {
            '01:00 - 05:00': 100,
            '05:00 - 09:00': 293,
            '09:00 - 13:00': 486,
            '13:00 - 17:00': 680,
            '17:00 - 21:00': 873,
            '21:00 - 01:00': 1066,
        },
        'csv': 'assets/data/ausfaelle_tu_time.csv',
    }
}

var scales = {
    'all': {
        'all': {
            'exponent': 0.6,
            'range_min': 2,
            'range_max': 200
        },
        'line': {
            'exponent': 0.5,
            'range_min': 2,
            'range_max': 100
        },
        'line_bundles': {
            'exponent': 0.5,
            'range_min': 2,
            'range_max': 115
        }
    },
    'day': {
        'all': {
            'exponent': 0.4,
            'range_min': 2,
            'range_max': 60
        },
        'line': {
            'exponent': 0.5,
            'range_min': 2,
            'range_max': 30
        },
        'line_bundles': {
            'exponent': 0.5,
            'range_min': 2,
            'range_max': 35
        }
    },
    'time': {
        'all': {
            'exponent': 0.4,
            'range_min': 2,
            'range_max': 60
        },
        'line': {
            'exponent': 0.5,
            'range_min': 2,
            'range_max': 30
        },
        'line_bundles': {
            'exponent': 0.5,
            'range_min': 2,
            'range_max': 35
        }
    }
}

// Funktion für die BubbleCharts ohne Sortierung
function bubbleChart() {

    // Ort wo sich die Bubbles hinbewegen sollen
    var center = {x: width / 2, y: height / 2};

    // Variablen für den Chart
    // erstellen eines svg elements fürs html
    var svg = d3.select('#vis')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var bubbles = null;
    var text_name = null;
    var text_value = null;
    var nodes = [];

    // Variable für die Stärke der Position im Chart
    var forceStrength = 0.03;

    // Charge function für das Verhalten des Bubble Charts
    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    }

    // force Simulation und die dazugehörigen Forces
    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    // Stoppen der Simulation, da diese automatisch gestartet wird
    simulation.stop();

    // Funktion zum Updaten der Position der Kreise
    function ticked() {
        bubbles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });
        text_name
            .attr('x', function (d) {
                return d.x - 25;
            })
            .attr('y', function (d) {
                return d.y;
            });
        text_value
            .attr('x', function (d) {
                return d.x - 25;
            })
            .attr('y', function (d) {
                return d.y + 14;
            });
    }

    function updateNodes(rawData) {
        keys = Object.keys(rawData[0]);
        last_key = keys[keys.length - 1];

        var myNodes = rawData.map(function (d) {
            var node = {
                id: d.id,
                radius: 0,
                value: +d.anzahl_ausfaelle,
                tu: d.tu,
                name: d.name,
                type: d.id_vmkat,
                type_name: d.vmkat,
                lines: d.anzahl_linien,
                line_bundles: d.anzahl_linien_buendel,
                x: Math.random() * 900,
                y: Math.random() * 800
            };
            switch (last_key) {
                case "tag":
                    node.sort = d.tag;
                    break;
                case "zeit":
                    node.sort = d.zeit;
                    break;
                case "dauer":
                    node.sort = d.dauer;
                    break;
                case "halte":
                    node.sort = d.halte;
                    break;
                case "grund":
                    node.sort = d.grund;
                    break;
            }
            return node;
        });

        // Sortieren der Nodes nach grösse
        myNodes.sort(function (a, b) {
            return b.value - a.value
        });

        nodes = myNodes;
    }

    var chart = function chart(rawData) {

        // erstellen der Nodes
        updateNodes(rawData);

        // erstellen der bubbles fürs html
        bubbles = svg.selectAll('.bubble')
            .data(nodes, function (d) {
                return d.id;
            });

        // erstellen des Textfeld für den Namen fürs html
        text_name = svg.selectAll('.text')
            .data(nodes, function (d) {
                return d.id;
            });

        // erstellen des Textfeld für den Wert fürs html
        text_value = svg.selectAll('.text')
            .data(nodes, function (d) {
                return d.id;
            });

        // circles hinzufügen
        var bubblesE = bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('id', function (d) {
                return "circle" + d.id;
            })
            .attr('fill', function (d) {
                return fillColor(d.type);
            })
            .attr('stroke', function (d) {
                return d3.rgb(fillColor(d.type)).darker();
            })
            .attr('stroke-width', 2)
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        // textfeld hinzufügen
        var text_nameE = text_name.enter().append('text')
            .attr("dx", 12)
            .attr("dy", ".35em")
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        // textfeld hinzufügen
        var text_valueE = text_value.enter().append('text')
            .attr("dx", 12)
            .attr("dy", ".35em")
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        // Elemente der Variablen hinzufügen
        bubbles = bubbles.merge(bubblesE);
        text_name = text_name.merge(text_nameE);
        text_value = text_value.merge(text_valueE);

        // Nodes der Simunlation durch die neuen Nodes ersetzen

        myBubbleChart.scaleBubbles();

    }

    chart.updateChart = function () {

        svgE = d3.select('#vis');
        svgE.selectAll('.bubble').remove();
        svgE.selectAll('text').remove();

        bubbles = null;
        text_name = null;
        text_value = null;
        nodes = [];

        simulation.stop();

        d3.csv(sort[sort_type].csv, function (error, data) {
            if (error) {
                console.log(error);
            }
            chart(data);
            splitBubbles();
            updateTitles();
        });
    }

    function updateTitles() {
        svg.selectAll('.day').remove();
        svg.selectAll('.time').remove();
        svg.selectAll('.duration').remove();
        svg.selectAll('.stops').remove();
        svg.selectAll('.cause').remove();

        var data = d3.keys(sort[sort_type].titles);
        if (data.length > 0) {
            var titles = svg.selectAll('.'+sort_type)
                .data(data);

            titles.enter().append('text')
                .attr('class', sort_type)
                .attr('x', function (d) {
                    return sort[sort_type].titles[d];
                })
                .attr('y', 40)
                .attr('text-anchor', 'middle')
                .text(function (d) {
                    return d;
                });
        }
    }

    function clearChart() {
        svgE = d3.select('#vis');

        svgE.selectAll('.bubble').remove();
        svgE.selectAll('text').remove();

        bubbles = null;
        text_name = null;
        text_value = null;
        nodes = [];

        simulation.stop();
    }

    function newChart() {
        d3.csv('assets/data/ausfaelle_tu_day.csv', function (error, data) {
            if (error) {
                console.log(error);
            }
            sort_type = 'day';

            chart(data);

            splitBubbles();
            showDayTitles();
        });
    }

/*    function showDayTitles() {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
        var daysData = d3.keys(locations.title_day);
        var days = svg.selectAll('.day')
            .data(daysData);

        console.log(daysData);

        days.enter().append('text')
            .attr('class', 'year')
            .attr('x', function (d) {
                return locations.title_day[d];
            })
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(function (d) {
                return d;
            });
    }*/

    function nodePos(d) {
        if (d.sort) {
            return sort[sort_type].center[d.sort].x;
        }
        return center.x;
    }

    function splitBubbles() {
        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodePos));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();

    }

    chart.scaleBubbles = function () {

        nodes.forEach(function (d) {
            switch (scale_type) {
                case 'line':
                    d.comp_value = d.value / d.lines;
                    break;
                case 'all':
                    d.comp_value = d.value;
                    break;
                case 'line_bundles':
                    d.comp_value = d.value / d.line_bundles;
                    break;
            }

            d.radius = d3.scalePow()
                .exponent(scales[sort_type][scale_type].exponent)
                .range([scales[sort_type][scale_type].range_min, scales[sort_type][scale_type].range_max])
                .domain([0, d3.max(nodes, function (d) {
                    return d.comp_value;
                })])(d.comp_value);
        });

        text_name
            .text(function (d) {
                return d.radius > d.tu.length * 10 ? d.tu : "";
            });

        text_value
            .text(function (d) {
                return d.radius > 40 && d.radius > d.tu.length * 10 ? Math.floor((d.comp_value) / 1000) + "k" : "";
            });

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) {
                return d.radius;
            });

        simulation.nodes(nodes);

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();

    }

    function sortBubblesAll() {
        d3.csv('assets/data/ausfaelle_tu_day.csv', function (error, data) {
            if (error) {
                console.log(error);
            }
            updateNodes(data);

            d3.select("svg").selectAll("circle")
                .data(data, function (d) {
                    return d.id;
                })
                .exit()
                .remove();

            d3.select("svg").selectAll("text")
                .exit()
                .remove();


            bubbles.exit().remove();
            text_name.exit().remove();
            text_value.exit().remove();

            bubbles = null;
            text_name = null;
            text_value = null;

            simulation.alpha(1).restart();

            /*!// @v4 Reset the 'x' force to draw the bubbles to the center.
            simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));*/

            // @v4 We can reset the alpha value and restart the simulation

        });
    }

    // Funktion für anzeigen der Tooltips
    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(document.getElementById("circle" + d.id)).attr('stroke', 'black');

        last_key = Object.keys(d)[Object.keys(d).length - 4];

        var content = '<span class="name">Tu: </span><span class="value">' +
            d.tu +
            '</span><br/>' +
            '<span class="name">Transportunternehmen: </span><span class="value">' +
            d.name +
            '</span><br/>' +
            '<span class="name">Ausfälle: </span><span class="value">' +
            d.value +
            '</span><br/>' +
            '<span class="name">Anzahl Linien: </span><span class="value">' +
            d.lines +
            '</span><br/>' +
            '<span class="name">Ausfälle pro Linie: </span><span class="value">' +
            Math.round(d.value / d.lines) +
            '</span><br/>' +
            '<span class="name">Anzahl Linienbündel: </span><span class="value">' +
            d.line_bundles +
            '</span><br/>' +
            '<span class="name">Typ: </span><span class="value">' +
            d.type_name +
            '</span>';

        switch (sort_type) {
            case "day":
                content += '<br/>' +
                    '<span class="name">Tag: </span><span class="value">' +
                    d.sort +
                    '</span>';
                break;
        }

        tooltip.showTooltip(content, d3.event);
    }

    // Funktion zum verstecken der tooltips
    function hideDetail(d) {
        // reset outline
        d3.select(document.getElementById("circle" + d.id))
            .attr('stroke', d3.rgb(fillColor(d.type)).darker());

        tooltip.hideTooltip();
    }

    chart.sortBubbles = function () {
        switch (sort_type) {
            case 'all':
                console.log('all');
                clearChart();
                break;
            case 'day':
                console.log('day');
                newChart();
                break
            case 'time':
                break
            default:
                console.log("error");
                break;
        }
    }

    return chart;

}

// Initialisierte den Bubblechart
var myBubbleChart = bubbleChart();

function display(error, data) {
    if (error) {
        console.log(error);
    }
    myBubbleChart(data);
}

// Einrichten der Button und der Aktion beim Drücken
function setupButtons() {
    d3.select('#buttons')
        .selectAll('.scale')
        .on('click', function () {
            // Remove active class from all buttons
            d3.selectAll('.scale').classed('btn-primary text-white', false);
            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('btn-primary text-white', true);

            // Get the id of the button
            scale_type = button.attr('scale');

            myBubbleChart.scaleBubbles();
        });
    d3.select('#buttons')
        .selectAll('.sort')
        .on('click', function () {
            // Remove active class from all buttons
            d3.selectAll('.sort').classed('btn-success text-white', false);
            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('btn-success text-white', true);

            // Get the id of the button
            sort_type = button.attr('data');

            myBubbleChart.updateChart();

        });
}

// Load the data.
d3.csv('assets/data/ausfaelle_tu_all.csv', display);

// setup the buttons.
setupButtons();