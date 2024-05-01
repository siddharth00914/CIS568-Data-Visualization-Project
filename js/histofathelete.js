document.addEventListener("DOMContentLoaded", function() {
    const dataUrl = 'data/athlete_data.json'; // Path to your JSON file
    let dataset = [];

    // Load data
    d3.json(dataUrl).then(data => {
        dataset = data;
        initFilters();
        updateChart();
    });

    function initFilters() {
        // Populate NOC filter with unique options
        const noc = ['All', ...new Set(dataset.map(d => d.NOC))];
        const nocSelect = d3.select('#noc-filter');
        nocSelect.selectAll('option')
            .data(noc).enter()
            .append('option')
            .text(d => d);

        nocSelect.on('change', function() {
            updateSportFilter(this.value);
            updateChart();
        });

        updateSportFilter('All');
    }

    function updateSportFilter(noc) {
        const relevantSports = noc === 'All' ? dataset : dataset.filter(d => d.NOC === noc);
        const sports = ['All', ...new Set(relevantSports.map(d => d.Sport))];
        const sportSelect = d3.select('#sport-filter');
        sportSelect.selectAll('option').remove(); // Clear previous options
        sportSelect.selectAll('option')
            .data(sports).enter()
            .append('option')
            .text(d => d);

        sportSelect.on('change', updateChart);
    }

    function updateChart() {
        const selectedNOC = d3.select('#noc-filter').node().value;
        const selectedSport = d3.select('#sport-filter').node().value;
        const filteredData = dataset.filter(d => (d.NOC === selectedNOC || selectedNOC === 'All') &&
                                                (d.Sport === selectedSport || selectedSport === 'All'));

        // Setup dimensions and margins for the chart
        const margin = {top: 20, right: 30, bottom: 80, left: 70},  // Increased bottom and left margins
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Clear any existing SVG
        d3.select("#chart").selectAll("*").remove();

        // Append the svg object to the body of the page
        const svg = d3.select("#chart")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis: scale and draw
        const x = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.Age)])
            .range([0, width]);
        
        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d => `${d} years`));

        // Rotate the x-axis labels and adjust position to avoid overlap
        xAxis.selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add X axis label
        xAxis.append("text")
            .attr("text-anchor", "end")
            .attr("x", width / 2)  // Centering the axis title
            .attr("y", 50)  // Distance from the axis
            .text("Age (years)");

        // Set the parameters for the histogram
        const histogram = d3.histogram()
            .value(d => d.Age)
            .domain(x.domain())
            .thresholds(x.ticks(20));

        // And apply this function to data to get the bins
        const bins = histogram(filteredData);

        // Y axis: scale and draw
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(bins, d => d.length)]);
        
        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // Add Y axis label
        yAxis.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)  // Distance from the axis
            .attr("x", -height / 2)  // Centering the axis title
            .text("Number of Athletes");

        // Append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .join("rect")
              .attr("x", 1)
              .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`)
              .attr("width", d => x(d.x1) - x(d.x0) - 1)
              .attr("height", d => height - y(d.length))
              .style("fill", "#69b3a2");
    }
});
