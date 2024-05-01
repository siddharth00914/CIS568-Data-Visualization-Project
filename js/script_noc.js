document.addEventListener('DOMContentLoaded', function() {
    fetch('data/noc_gender_participation_over_years.csv')
        .then(response => response.text())
        .then(data => {
            var parsedData = d3.csvParse(data);
            var nocs = Array.from(new Set(parsedData.map(d => d.NOC))).sort();
            var select = d3.select('#countrySelect');
            select.selectAll('option')
                .data(nocs)
                .enter()
                .append('option')
                .text(d => d);

            function updateChart(noc) {
                var nocData = parsedData.filter(d => d.NOC === noc);
                var margin = {top: 10, right: 30, bottom: 50, left: 70},
                    width = 800 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
                d3.select('#chart').selectAll('*').remove();
                var svg = d3.select('#chart').append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var x = d3.scaleLinear()
                    .domain(d3.extent(nocData, d => d.Year))
                    .range([0, width]);
                var y = d3.scaleLinear()
                    .domain([0, d3.max(nocData, d => +d.Count)])
                    .range([height, 0]);

                var xAxis = svg.append('g')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(d3.axisBottom(x).tickFormat(d3.format('d')));
                xAxis.append("text")
                    .attr("class", "axis-label")
                    .attr("y", 35)
                    .attr("x", width / 2)
                    .attr("text-anchor", "middle")
                    .text("Year");

                var yAxis = svg.append('g')
                    .call(d3.axisLeft(y));
                yAxis.append("text")
                    .attr("class", "axis-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -50)
                    .attr("x", -height / 2)
                    .attr("dy", "1em")
                    .attr("text-anchor", "middle")
                    .text("Number of Athletes");

                var line = d3.line()
                    .x(d => x(d.Year))
                    .y(d => y(d.Count));

                var color = d3.scaleOrdinal()
                    .domain(["M", "F"])
                    .range(['#377eb8', '#e41a1c']);

                var sexGroups = d3.group(nocData, d => d.Sex);
                sexGroups.forEach((value, key) => {
                    svg.append('path')
                        .datum(value)
                        .attr('fill', 'none')
                        .attr('stroke', color(key))
                        .attr('stroke-width', 1.5)
                        .attr('d', line);

                    svg.selectAll("myCircles")
                        .data(value)
                        .enter()
                        .append("circle")
                        .attr("fill", color(key))
                        .attr("stroke", "none")
                        .attr("cx", d => x(d.Year))
                        .attr("cy", d => y(d.Count))
                        .attr("r", 4)
                        .on("mouseover", function(event, d) {
                            d3.select(this)
                                .transition()
                                .duration(100)
                                .attr("r", 8);
                            tooltip.html("Year: " + d.Year + "<br>Count: " + d.Count + "<br>Gender: " + (d.Sex === "M" ? "Male" : "Female"))
                                .style("opacity", 1)
                                .style("left", (event.pageX + 10) + "px")
                                .style("top", (event.pageY - 15) + "px");
                        })
                        .on("mouseout", function(d) {
                            d3.select(this)
                                .transition()
                                .duration(100)
                                .attr("r", 4);
                            tooltip.style("opacity", 0);
                        });
                });

                // Legend
                var legend = svg.selectAll(".legend")
                    .data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(d => d === "M" ? "Male" : "Female");

                 // Chart title
                 svg.append("text")
                 .attr("class", "chart-title")
                 .attr("text-anchor", "middle")
                 .attr("x", width / 2)
                 .attr("y", -20)  // Adjusted for better visibility
                 .text("Athlete Participation Over Years");

             // X axis label
             svg.append("text")
                 .attr("class", "axis-label")
                 .attr("text-anchor", "middle")
                 .attr("x", width / 2)
                 .attr("y", height + margin.bottom / 2 + 20)
                 .text("Year");

             // Y axis label
             svg.append("text")
                 .attr("class", "axis-label")
                 .attr("text-anchor", "middle")
                 .attr("transform", "rotate(-90)")
                 .attr("x", -height / 2)
                 .attr("y", -margin.left / 2 + 1)
                 .text("Number of Athletes");

                // Tooltip setup
                var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
            }

            // Initial chart display
            updateChart(nocs[0]);
            select.on('change', function() {
                updateChart(this.value);
            });
        });
});
