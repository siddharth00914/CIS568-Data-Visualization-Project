document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", "160px")
        .style("padding", "2px")
        .style("background", "lightsteelblue")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none");

    // Load the JSON data
    d3.json('data/Medal_Counts.json').then(data => {
        const nocSelect = d3.select('#noc').on('change', updateYears);
        const yearSelect = d3.select('#year').on('change', updateChart);
        populateNocOptions(data);

        function populateNocOptions(data) {
            const nocOptions = Array.from(new Set(data.map(d => d.NOC)));
            nocSelect.selectAll('option')
                .data(nocOptions)
                .enter()
                .append('option')
                .text(d => d);
            updateYears();
        }

        function updateYears() {
            const selectedNOC = nocSelect.node().value;
            const availableYears = Array.from(new Set(data.filter(d => d.NOC === selectedNOC).map(d => d.Year)));
            yearSelect.selectAll('option').remove();  // Clear existing options
            yearSelect.selectAll('option')
                .data(availableYears.sort((a, b) => a - b))
                .enter()
                .append('option')
                .text(d => d);
            updateChart();  // Update the chart after changing the NOC
        }

        function updateChart() {
            const selectedNOC = nocSelect.node().value;
            const selectedYear = yearSelect.node().value;
            const filteredData = data.filter(d => d.NOC === selectedNOC && d.Year.toString() === selectedYear);

            const medalCounts = d3.rollups(filteredData, v => ({
                Gold: d3.sum(v, d => d.Gold),
                Silver: d3.sum(v, d => d.Silver),
                Bronze: d3.sum(v, d => d.Bronze)
            }), d => d.Sport).map(([sport, medals]) => ({
                sport: sport,
                Gold: medals.Gold,
                Silver: medals.Silver,
                Bronze: medals.Bronze,
                Total: medals.Gold + medals.Silver + medals.Bronze
            }));

            const margin = { top: 20, right: 30, bottom: 40, left: 120 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            const svg = d3.select('#chart').html("").append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append("g")
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const xScale = d3.scaleLinear()
                .domain([0, d3.max(medalCounts, d => d.Total)])
                .range([0, width]);

            const yScale = d3.scaleBand()
                .domain(medalCounts.map(d => d.sport))
                .range([0, height])
                .padding(0.1);

            // Add gold medals part
            svg.selectAll('.bar-gold')
                .data(medalCounts)
                .enter()
                .append('rect')
                .attr('class', 'bar-gold')
                .attr('x', 0)
                .attr('y', d => yScale(d.sport))
                .attr('width', d => xScale(d.Gold))
                .attr('height', yScale.bandwidth())
                .style('fill', 'gold')
                .on('mouseover', function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(`Sport: ${d.sport}<br/>Gold: ${d.Gold}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

            // Add silver medals part
            svg.selectAll('.bar-silver')
                .data(medalCounts)
                .enter()
                .append('rect')
                .attr('class', 'bar-silver')
                .attr('x', d => xScale(d.Gold))
                .attr('y', d => yScale(d.sport))
                .attr('width', d => xScale(d.Silver))
                .attr('height', yScale.bandwidth())
                .style('fill', 'silver')
                .on('mouseover', function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(`Sport: ${d.sport}<br/>Silver: ${d.Silver}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

            // Add bronze medals part
            svg.selectAll('.bar-bronze')
                .data(medalCounts)
                .enter()
                .append('rect')
                .attr('class', 'bar-bronze')
                .attr('x', d => xScale(d.Gold + d.Silver))
                .attr('y', d => yScale(d.sport))
                .attr('width', d => xScale(d.Bronze))
                .attr('height', yScale.bandwidth())
                .style('fill', '#cd7f32') // Bronze color
                .on('mouseover', function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(`Sport: ${d.sport}<br/>Bronze: ${d.Bronze}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

            // Add axes
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale));

            svg.append("g")
                .call(d3.axisLeft(yScale));
        }
    }).catch(error => {
        console.error("Error loading the data file:", error);
    });
});
