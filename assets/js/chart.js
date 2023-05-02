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


// Funktion für die BubbleCharts ohne Sortierung
function bubbleChartAll() {

    // Ort wo sich die Bubbles hinbewegen sollen
    var center = {x: width / 2, y: height / 2};

    // Variablen für den Chart
    var svg = null;
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


    // Funktion um die rohen Daten in ein Node Array für den Chart zu konvertieren
    function createNodes(rawData) {

        // hilfsfunktion zum skalieren des radius
        /*var radiusScaleAll = d3.scalePow()
            .exponent(0.5)
            .range([2, 100])
            .domain([0, d3.max(rawData, function (d) {
                return d.anzahl_ausfaelle / d.anzahl_linien;
            })]);*/

        // erstellen der Nodes
        var myNodes = rawData.map(function (d) {
            return {
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
        });

        // Sortieren der Nodes nach grösse
        myNodes.sort(function (a, b) {
            return b.value - a.value
        });

        return myNodes;
    }

    // Erstellt den Chart aus den rohen Daten und dem SVG
    var chart = function chart(selector, rawData) {
        // erstellen der Nodes
        nodes = createNodes(rawData);

        // erstellen eines svg elements fürs html
        svg = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

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


        // Transisation für das Vergrösserung der Radien der Kreise


        // Nodes der Simunlation durch die neuen Nodes ersetzen
        simulation.nodes(nodes);

        scalingBubblesLine();
    }

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

    // Gruppiert
    function scalingBubblesAll() {

        var radiusScale = d3.scalePow()
            .exponent(0.6)
            .range([2, 220])
            .domain([0, d3.max(nodes, function (d) {
                return d.value;
            })]);

        nodes.forEach(function (d) {
            d.radius = radiusScale(d.value);
        });

        text_name
            .text(function (d) {
                return d.radius > d.tu.length * 8 ? d.tu : "";
            });

        text_value
            .text(function (d) {
                return d.radius > 30 ? Math.floor(d.value / 1000) + "k" : "";
            });

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) {
                return d.radius;
            });

        simulation.nodes(nodes);

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    function scalingBubblesLine() {

        var radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([2, 100])
            .domain([0, d3.max(nodes, function (d) {
                return d.value / d.lines;
            })]);

        nodes.forEach(function (d) {
            d.radius = radiusScale(d.value / d.lines);
        });

        text_name
            .text(function (d) {
                return d.radius > d.tu.length * 10 ? d.tu : "";
            });

        text_value
            .text(function (d) {
                return d.radius > 40 ? Math.floor((d.value / d.lines) / 1000) + "k" : "";
            });

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) {
                return d.radius;
            });


        simulation.nodes(nodes);

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    function scalingBubblesLineBundle() {

        var radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([2, 115])
            .domain([0,d3.max(nodes, function (d) {
                return d.value / d.line_bundles;
            })]);

        nodes.forEach(function (d) {
            d.radius = radiusScale(d.value / d.line_bundles);
        });

        text_name
            .text(function (d) {
                return d.radius > d.tu.length * 10 ? d.tu : "";
            });

        text_value
            .text(function (d) {
                return d.radius > 40 ? Math.floor((d.value / d.line_bundles) / 1000) + "k" : "";
            });

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) {
                return d.radius;
            });


        simulation.nodes(nodes);

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    // Funktion für anzeigen der Tooltips
    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(document.getElementById("circle" + d.id)).attr('stroke', 'black');

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

        tooltip.showTooltip(content, d3.event);
    }

    // Funktion zum verstecken der tooltips
    function hideDetail(d) {
        // reset outline
        d3.select(document.getElementById("circle" + d.id))
            .attr('stroke', d3.rgb(fillColor(d.type)).darker());

        tooltip.hideTooltip();
    }

    // funktion zum änderen der Skalierung
    chart.toggleDisplay = function (sort) {
        switch (sort) {
            case 'scaling_line':
                scalingBubblesLine();
                break;
            case 'scaling_all':
                scalingBubblesAll();
                break
            case 'scaling_line_bundles':
                scalingBubblesLineBundle();
                break
            default:
                scalingBubblesAll();
                break;
        }
    };

    // gibt die chart funktion zurück
    return chart;
}


// Initialisierte den Bubblechart
var myBubbleChart = bubbleChartAll();

// Funktion die aufgerufen wird sobald csv geladen ist und den Bubblechart mit daten füllt
function display(error, data) {
    if (error) {
        console.log(error);
    }
    myBubbleChart('#vis', data);
}

// Einrichten der Button und der Aktion beim Drücken
function setupButtons() {
    d3.select('#sortButtons')
        .selectAll('.btn')
        .on('click', function () {
            // Remove active class from all buttons
            d3.selectAll('.button').classed('active', false);
            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('active', true);

            // Get the id of the button
            var buttonId = button.attr('id');

            console.log(buttonId);

            // Toggle the bubble chart based on
            // the currently clicked button.
            myBubbleChart.toggleDisplay(buttonId);
        });
}


// Load the data.
d3.csv('assets/data/AusfaelleTuLinien.csv', display);

// setup the buttons.
setupButtons();