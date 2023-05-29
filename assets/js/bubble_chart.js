// Konstanten die für alle Bubble Charts gleich sind

// Grösse des Charts
var width = 1261;
var height = 700;

// Tooltip zum anzeigen der Daten
var tooltip = floatingTooltip('ausfaelle_tooltip', 300);

// Farbpallette für die Verkehrsmittelkategorien
var fillColor = d3.scaleOrdinal()
    .domain(['0', '1', '2', '3'])
    .range(['#faa307', '#e85d04', '#0a9396', '#94d2bd']);

// Variable die angibt welche Tu alle angezeigt werden sollen
var filtered_tu = ['PAG', 'AB', 'SBB', 'TMR', 'TL', 'VBD', 'RBS', 'TPF', 'VBSH', 'AMSA', 'TPL', 'TRN', 'BOS', 'SBB-D', 'TPG', 'ZVB', 'SVB', 'BSU', 'asm', 'REGO', 'BGU', 'VBG', 'VBZ', 'BLAG', 'VZO', 'THURBO', 'BLT', 'AAGR', 'VMCV', 'NStCM', 'VBL', 'AS', 'TRAVYS', 'VB', 'VBSG', 'AVJ', 'AAGS', 'BOGG', 'ABG', 'AVA', 'BuS', 'BBA', 'RA', 'STI', 'AAGL', 'SBG', 'BLS', 'MBC', 'SZU', 'BVB', 'TPC', 'ASGS', 'SMC', 'TPN', 'SOB', 'ARL', 'LEB', 'ARAG', 'SBW', 'RhB', 'FLP', 'MGB', 'AOT', 'GWB', 'WAB', 'BOB', 'FART', 'TSD', 'RBL', 'BCS', 'BRER', 'AAGU', 'LLB', 'RVBW', 'ABl', 'SNL', 'zb', 'AFA', 'AWA', 'BLWE', 'BWS'];

// Variable die Skalierung angibt (all, cause, day, duration, stops, time, type )
var sort_type = 'all';

// Variable die Sortierung angibt (line, all)
var scale_type = 'all';

// Konfigurationsdaten für den Charts, Position der Bubbles, Titel etc
var sort = {
    'all': {
        'center': {
            'Alle Ausfälle': {x: width / 2, y: height / 2}
        }, 'titles': {
            'Alle Ausfälle': 583
        }, 'sum': {
            'Alle Ausfälle': null
        }, 'csv': 'assets/data/ausfaelle_tu_all.csv',
    }, 'day': {
        'center': {
            'Montag': {x: 233 + 1000 / 9 * 1, y: height / 2},
            'Dienstag': {x: 233 + 1000 / 9 * 2, y: height / 2},
            'Mittwoch': {x: 233 + 1000 / 9 * 3, y: height / 2},
            'Donnerstag': {x: 233 + 1000 / 9 * 4, y: height / 2},
            'Freitag': {x: 233 + 1000 / 9 * 5, y: height / 2},
            'Samstag': {x: 233 + 1000 / 9 * 6, y: height / 2},
            'Sonntag': {x: 233 + 1000 / 9 * 7, y: height / 2}
        }, 'titles': {
            'Montag': 220,
            'Dienstag': 361,
            'Mittwoch': 522,
            'Donnerstag': 683,
            'Freitag': 844,
            'Samstag': 1005,
            'Sonntag': 1146,
        }, 'sum': {
            'Montag': null,
            'Dienstag': null,
            'Mittwoch': null,
            'Donnerstag': null,
            'Freitag': null,
            'Samstag': null,
            'Sonntag': null,
        }, 'csv': 'assets/data/ausfaelle_tu_day.csv',
    }, 'time': {
        'center': {
            '01:00 - 05:00': {x: 233 + 1000 / 8 * 1, y: height / 2},
            '05:00 - 09:00': {x: 233 + 1000 / 8 * 2, y: height / 2},
            '09:00 - 13:00': {x: 233 + 1000 / 8 * 3, y: height / 2},
            '13:00 - 17:00': {x: 233 + 1000 / 8 * 4, y: height / 2},
            '17:00 - 21:00': {x: 233 + 1000 / 8 * 5, y: height / 2},
            '21:00 - 01:00': {x: 233 + 1000 / 8 * 6, y: height / 2},
        }, 'titles': {
            '01:00 - 05:00': 200,
            '05:00 - 09:00': 375,
            '09:00 - 13:00': 575,
            '13:00 - 17:00': 775,
            '17:00 - 21:00': 950,
            '21:00 - 01:00': 1150,
        }, 'sum': {
            '01:00 - 05:00': null,
            '05:00 - 09:00': null,
            '09:00 - 13:00': null,
            '13:00 - 17:00': null,
            '17:00 - 21:00': null,
            '21:00 - 01:00': null,
        }, 'csv': 'assets/data/ausfaelle_tu_time.csv',
    }, 'duration': {
        'center': {
            'Unter 5 Minuten': {x: 233 + 1000 / 8 * 1, y: height / 2},
            '5-15 Minuten': {x: 233 + 1000 / 8 * 2, y: height / 2},
            '15-30 Minuten': {x: 233 + 1000 / 8 * 3, y: height / 2},
            '30-60 Minuten': {x: 233 + 1000 / 8 * 4, y: height / 2},
            '60+ Minuten': {x: 233 + 1000 / 8 * 5, y: height / 2},
            'unbekannt': {x: 233 + 1000 / 8 * 6, y: height / 2},
        }, 'titles': {
            'Unter 5 Minuten': 200,
            '5-15 Minuten': 393,
            '15-30 Minuten': 610,
            '30-60 Minuten': 825,
            '60+ Minuten': 1000,
            'unbekannt': 1125,
        }, 'sum': {
            'Unter 5 Minuten': null,
            '5-15 Minuten': null,
            '15-30 Minuten': null,
            '30-60 Minuten': null,
            '60+ Minuten': null,
            'unbekannt': null,
        }, 'csv': 'assets/data/ausfaelle_tu_duration.csv',
    },

    'stops': {
        'center': {
            '0 Haltestellen': {x: 233 + 1000 / 9 * 1, y: height / 2},
            '1-2 Haltestellen': {x: 233 + 1000 / 9 * 2, y: height / 2},
            '3-6 Haltestellen': {x: 233 + 1000 / 9 * 3, y: height / 2},
            '7-13 Haltestellen': {x: 233 + 1000 / 9 * 4, y: height / 2},
            '14-21 Haltestellen': {x: 233 + 1000 / 9 * 5, y: height / 2},
            '22-39 Haltestellen': {x: 233 + 1000 / 9 * 6, y: height / 2},
            '40+ Haltestellen': {x: 233 + 1000 / 9 * 7, y: height / 2}
        }, 'titles': {
            '0 Haltestellen': 200,
            '1-2 Haltestellen': 361,
            '3-6 Haltestellen': 522,
            '7-13 Haltestellen': 683,
            '14-21 Haltestellen': 844,
            '22-39 Haltestellen': 1005,
            '40+ Haltestellen': 1166,
        }, 'sum': {
            '0 Haltestellen': null,
            '1-2 Haltestellen': null,
            '3-6 Haltestellen': null,
            '7-13 Haltestellen': null,
            '14-21 Haltestellen': null,
            '22-39 Haltestellen': null,
            '40+ Haltestellen': null,
        }, 'csv': 'assets/data/ausfaelle_tu_stops.csv',
    }, 'cause': {
        'center': {
            'Ausfall ganze Fahrt': {x: 233 + 1000 / 8 * 1, y: height / 2},
            'Keine Daten': {x: 233 + 1000 / 8 * 2, y: height / 2},
            'Status Unbekannt': {x: 233 + 1000 / 8 * 3, y: height / 2},
            'Verspätung': {x: 233 + 1000 / 8 * 4, y: height / 2},
            'Keine Daten Teilstrecke': {x: 233 + 1000 / 8 * 5, y: height / 2},
            'Status Unbekannt Teilstrecke': {x: 233 + 1000 / 8 * 6.5, y: height / 2},
        }, 'titles': {
            'Ausfall ganze Fahrt': 250,
            'Keine Daten': 450,
            'Status Unbekannt': 650,
            'Verspätung': 775,
            'Keine Daten Teilstrecke': 925,
            'Status Unbekannt Teilstrecke': 1130,
        }, 'sum': {
            'Ausfall ganze Fahrt': null,
            'Keine Daten': null,
            'Status Unbekannt': null,
            'Verspätung': null,
            'Keine Daten Teilstrecke': null,
            'Status Unbekannt Teilstrecke': null,
        }, 'csv': 'assets/data/ausfaelle_tu_cause.csv',
    }, 'type': {
        'center': {
            'Bus Überland/Berg': {x: 233 + 1000 / 6 * 1, y: height / 2},
            'Bus Agglomeration': {x: 233 + 1000 / 6 * 2, y: height / 2},
            'Bahn Überland/Berg': {x: 233 + 1000 / 6 * 3, y: height / 2},
            'Bahn Überland/Regionalverkehr': {x: 233 + 1000 / 6 * 4, y: height / 2},
        }, 'titles': {
            'Bus Überland/Berg': 250,
            'Bus Agglomeration': 600,
            'Bahn Überland/Berg': 800,
            'Bahn Überland/Regionalverkehr': 1050,
        }, 'sum': {
            'Bus Überland/Berg': null,
            'Bus Agglomeration': null,
            'Bahn Überland/Berg': null,
            'Bahn Überland/Regionalverkehr': null,
        }, 'csv': 'assets/data/ausfaelle_tu_type.csv',
    },

}

// Konfigurationsdaten für die Grösse der Bubbles
var scales = {
    'all': {
        'all': {
            'exponent': 0.6, 'range_min': 2, 'range_max': 170
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 80
        }
    }, 'day': {
        'all': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 65
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 35
        }
    }, 'time': {
        'all': {
            'exponent': 0.4, 'range_min': 2, 'range_max': 60
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 45
        }
    }, 'duration': {
        'all': {
            'exponent': 0.4, 'range_min': 2, 'range_max': 80
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 70
        }
    }, 'stops': {
        'all': {
            'exponent': 0.4, 'range_min': 2, 'range_max': 90
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 90
        }
    }, 'cause': {
        'all': {
            'exponent': 0.4, 'range_min': 2, 'range_max': 100
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 80
        }
    }, 'type': {
        'all': {
            'exponent': 0.4, 'range_min': 2, 'range_max': 120
        }, 'line': {
            'exponent': 0.5, 'range_min': 2, 'range_max': 80
        }
    }

}

function bubbleChart() {

    // Ort wo sich die Bubbles ursprünglich hinbewegen sollen
    var center = {x: width / 2, y: height / 2};

    // erstellen eines svg elements fürs html
    var svg = d3.select('#vis')
        .append('svg')
        .attr('viewBox', '0 0 1261 700');

    // Variablen für den Chart
    var bubbles = null;
    var text_name = null;
    var text_value = null;
    var nodes = [];

    // Variable für die Stärke der Position im Chart
    var forceStrength = 0.03;

    // Charge function für das Verhalten des Bubble Charts
    function charge(d) {
        return -Math.pow(d.radius, 2.) * forceStrength;
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

    // Funktion zum Updaten der Nodes, falls der Filter geändert wird
    function updateNodes(rawData) {
        keys = Object.keys(rawData[0]);
        last_key = keys[keys.length - 1];

        // erstellen der Nodes aus den Daten
        var myNodes = rawData.map(function (d) {
            var node = {
                id: d.id,
                radius: 0,
                value: +d.anzahl_ausfaelle,
                tu: d.tu,
                name: d.name,
                short_name: d.kurzer_name,
                type: d.id_vmkat,
                type_name: d.vmkat,
                lines: d.anzahl_linien,
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
                case "anzahl_minuten":
                    node.sort = d.anzahl_minuten;
                    break;
                case "anzahl_halte":
                    node.sort = d.anzahl_halte;
                    break;
                case "ausfall_grund":
                    node.sort = d.ausfall_grund;
                    break;
                case "verkehrsmittel":
                    node.sort = d.verkehrsmittel;
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

    // Funktion zum erstellen des Charts
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
                return fillColor(d.type - 1);
            })
            .attr('stroke', function (d) {
                return d3.rgb(fillColor(d.type - 1)).darker();
            })
            .attr('stroke-width', 2)
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        // textfeld hinzufügen
        var text_nameE = text_name.enter().append('text')
            .attr("dx", 0)
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

        // Legende hinzufügen
        svg.append("text").attr("x", 10).attr("y", 10).text("Legende").style("font-size", "20px").style("font-weight", "bold").attr("alignment-baseline", "middle")
        svg.append("circle").attr("cx", 20).attr("cy", 40).attr("r", 10).style("fill", "#faa307")
        svg.append("circle").attr("cx", 20).attr("cy", 70).attr("r", 10).style("fill", "#e85d04")
        svg.append("circle").attr("cx", 20).attr("cy", 100).attr("r", 10).style("fill", "#0a9396")
        svg.append("circle").attr("cx", 20).attr("cy", 130).attr("r", 10).style("fill", "#94d2bd")
        svg.append("text").attr("x", 40).attr("y", 40).text("Bus Berg").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", 40).attr("y", 70).text("Bus Agglomeration").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", 40).attr("y", 100).text("Bahn Berg").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", 40).attr("y", 130).text("Bahn Regionalverkehr").style("font-size", "15px").attr("alignment-baseline", "middle")

        // Beschriftungen hinzufügen
        updateTitles();

        // Bubbles skalieren
        myBubbleChart.scaleBubbles();

    }

    // Funktion zum Updaten des Charts bei ändern des Filters
    chart.updateChart = function () {

        // Chart zurücksetzen
        svgE = d3.select('#vis');
        svgE.selectAll('.bubble').remove();
        svgE.selectAll('text').remove();

        // Element des Charts löschen
        bubbles = null;
        text_name = null;
        text_value = null;
        nodes = [];

        // Simulation stopppen
        simulation.stop();

        // neue Daten laden
        d3.csv(sort[sort_type].csv, function (error, data) {
            if (error) {
                console.log(error);
            }
            // TU filtern
            data = data.filter(d => filtered_tu.includes(d.tu));

            // Neuer Chart erstellen
            chart(data);
            splitBubbles();
            updateTitles();
            myBubbleChart.scaleBubbles();
        });
    }

    // Updaten der Titel
    function updateTitles() {

        // Alte Titel entfernen
        svg.selectAll('.title').remove();
        svg.selectAll('.sum').remove();

        // Titles hinzufügen
        var data = d3.keys(sort[sort_type].titles);
        if (data.length > 0) {
            var titles = svg.selectAll('.' + sort_type)
                .data(data);

            titles.enter().append('text')
                .attr('class', 'title')
                .attr('x', function (d) {
                    return sort[sort_type].titles[d];
                })
                .attr('y', 40)
                .attr('text-anchor', 'middle')
                .text(function (d) {
                    return d;
                });

            titles.enter().append('text')
                .attr('class', 'sum')
                .attr('x', function (d) {
                    return sort[sort_type].titles[d];
                })
                .attr('y', 660)
                .attr('text-anchor', ' middle')
                .text(function (d) {
                    return Math.floor(sort[sort_type].sum[d] / 1000) + 'k';
                })


        }
    }

    // Funktion zum bestimmen der Zentreen
    function nodePosX(d) {
        return sort[sort_type].center[d.sort].x;
    }


    // Aufteilen der Bubbles nach den Filter
    function splitBubbles() {
        // @v4 Reset the 'x' force to draw the bubbles to their sort centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodePosX));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    // Skalieren der Bubbles
    chart.scaleBubbles = function () {

        Object.keys(sort[sort_type].sum).forEach(key => sort[sort_type].sum[key] = null);
        nodes.forEach(function (d) {
            switch (scale_type) {
                case 'line':
                    d.comp_value = d.value / d.lines;
                    break;
                case 'all':
                    d.comp_value = d.value;
                    break;
            }
            d.sort = (typeof d.sort === 'undefined') ? 'Alle Ausfälle' : d.sort
            sort[sort_type].sum[d.sort] += d.comp_value;

            d.radius = d3.scalePow()
                .exponent(scales[sort_type][scale_type].exponent)
                .range([scales[sort_type][scale_type].range_min, scales[sort_type][scale_type].range_max])
                .domain([0, d3.max(nodes, function (d) {
                    return d.comp_value;
                })])(d.comp_value);
        });

        text_name
            .text(function (d) {
                if (d.radius > d.short_name.length * 6) return d.short_name
                if (d.radius > d.tu.length * 10) return d.tu
                return ""
            })
            .attr("dx", function (d) {
                if (d.radius > d.short_name.length * 6) return -d.short_name.length
                if (d.radius > d.tu.length * 10) return 12
            });

        text_value
            .text(function (d) {
                return d.radius > 40 && d.radius > d.tu.length * 10 ? d.comp_value > 1000 ? Math.floor((d.comp_value) / 1000) + "k" : Math.floor(d.comp_value) : "";
            });

        bubbles.transition()
            .duration(1000)
            .attr('r', function (d) {
                return d.radius;
            });

        simulation.nodes(nodes);

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();

        updateTitles();

    }

    // Funktion für anzeigen der Tooltips
    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(document.getElementById("circle" + d.id)).attr('stroke', 'black');

        last_key = Object.keys(d)[Object.keys(d).length - 4];

        var content = '' +
            '<span class="name">Tu: </span><span class="value">' + d.tu + '</span><br/>'
            + '<span class="name">Bezeichnung: </span><span class="value">' + d.short_name + '</span><br/>'
            + '<span class="name">Transportunternehmen: </span><span class="value">' + d.name + '</span><br/>'
            + '<span class="name">Ausfälle: </span><span class="value">' + d.value + '</span><br/>'
            + '<span class="name">Anzahl Linien: </span><span class="value">' + d.lines + '</span><br/>'
            + '<span class="name">Ausfälle pro Linie: </span><span class="value">' + Math.round(d.value / d.lines) + '</span><br/>'
            + '<span class="name">Typ: </span><span class="value">' + d.type_name + '</span>';
        switch (sort_type) {
            case "day":
                content += '<br/>' + '<span class="name">Tag: </span><span class="value">' + d.sort + '</span>';
                break;
            case "time":
                content += '<br/>' + '<span class="name">Zeitraum: </span><span class="value">' + d.sort + '</span>';
                break;
            case "duration":
                content += '<br/>' + '<span class="name">Ausfalldauer: </span><span class="value">' + d.sort + '</span>';
                break;
            case "stops":
                content += '<br/>' + '<span class="name">Anzahl Haltestellen: </span><span class="value">' + d.sort + '</span>';
                break;
            case "cause":
                content += '<br/>' + '<span class="name">Ausfall Meldung: </span><span class="value">' + d.sort + '</span>';
                break;
            case "type":
                content += '<br/>' + '<span class="name">Verkehrsmittel : </span><span class="value">' + d.sort + '</span>';
                break;

        }

        tooltip.showTooltip(content, d3.event);
    }

    // Funktion zum verstecken der tooltips
    function hideDetail(d) {
        // reset outline
        d3.select(document.getElementById("circle" + d.id))
            .attr('stroke', d3.rgb(fillColor(d.type - 1)).darker());

        tooltip.hideTooltip();
    }

    return chart;

}

// Initialisiere den Bubblechart
var myBubbleChart = bubbleChart();

// Einrichten der Button und der Aktionen beim Drücken
function setupButtons() {
    d3.select('#buttons_scale')
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
    d3.select('#buttons_sort')
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

// Einstelungen für den Multiselect Dropdown
$('#mySelect').multiselect({
    buttonClass: 'btn btn-info',
    buttonWidth: '120px',
    nonSelectedText: 'Filter',
    numberDisplayed: 1,
    includeSelectAllOption: true,
    enableCaseInsensitiveFiltering: true,
    allSelectedText: "Alle",
    maxHeight: 600,
    widthSynchronizationMode: 'ifPopupIsWider',
    onDropdownHidden: function (event) {
        filtered_tu = $('#mySelect').val();
        myBubbleChart.updateChart();
    }
});

// Popover für Informationen zu den Knöpfen
$(function () {
    $('[data-toggle="popover"]').popover()
})

// Laden des Charts
myBubbleChart.updateChart();

// setup the buttons.
setupButtons();