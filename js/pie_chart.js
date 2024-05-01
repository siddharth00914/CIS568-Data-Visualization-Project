class PieChart {
    constructor() {
        this.activeYear = "2016";
        this.data = [{"key":"GBR","values":[{"key":"1980","value":"47"},{"key":"1984","value":"118"},{"key":"1988","value":"172"},{"key":"1992","value":"222"},{"key":"1996","value":"248"},{"key":"2000","value":"302"},{"key":"2004","value":"359"},{"key":"2008","value":"440"},{"key":"2012","value":"566"},{"key":"2016","value":"711"}]},

        {"key":"RUS","values":[{"key":"1980","value":"1153"},{"key":"1988","value":"1453"},{"key":"1996","value":"1568"},{"key":"2000","value":"1755"},{"key":"2004","value":"1944"},{"key":"2008","value":"2086"},{"key":"2012","value":"2226"},{"key":"2016","value":"2341"}]},
    
        {"key":"GER","values":[{"key":"1980","value":"2605"},{"key":"1984","value":"2763"},{"key":"1988","value":"3059"},{"key":"1992","value":"3257"},{"key":"1996","value":"3381"},{"key":"2000","value":"3499"},{"key":"2004","value":"3648"},{"key":"2008","value":"3744"},{"key":"2012","value":"3838"},{"key":"2016","value":"3997"}]},
    
        {"key":"HUN","values":[{"key":"1980","value":"4058"},{"key":"1988","value":"4102"},{"key":"1992","value":"4147"},{"key":"1996","value":"4190"},{"key":"2000","value":"4243"},{"key":"2004","value":"4283"},{"key":"2008","value":"4310"},{"key":"2012","value":"4336"},{"key":"2016","value":"4358"}]},{"key":"FRA","values":[{"key":"1980","value":"4387"},{"key":"1984","value":"4454"},{"key":"1988","value":"4483"},{"key":"1992","value":"4540"},{"key":"1996","value":"4591"},{"key":"2000","value":"4657"},{"key":"2004","value":"4710"},{"key":"2008","value":"4787"},{"key":"2012","value":"4869"},{"key":"2016","value":"4965"}]},{"key":"IND","values":[{"key":"1980","value":"4981"},{"key":"1996","value":"4982"},{"key":"2000","value":"4983"},{"key":"2004","value":"4984"},{"key":"2008","value":"4987"},{"key":"2012","value":"4993"},{"key":"2016","value":"4995"}]},{"key":"ITA","values":[{"key":"1980","value":"5032"},{"key":"1984","value":"5095"},{"key":"1988","value":"5124"},{"key":"1992","value":"5169"},{"key":"1996","value":"5240"},{"key":"2000","value":"5305"},{"key":"2004","value":"5409"},{"key":"2008","value":"5451"},{"key":"2012","value":"5519"},{"key":"2016","value":"5591"}]},{"key":"AUS","values":[{"key":"1980","value":"5604"},{"key":"1984","value":"5656"},{"key":"1988","value":"5691"},{"key":"1992","value":"5748"},{"key":"1996","value":"5880"},{"key":"2000","value":"6063"},{"key":"2004","value":"6220"},{"key":"2008","value":"6369"},{"key":"2012","value":"6483"},{"key":"2016","value":"6565"}]},{"key":"PRK","values":[{"key":"1980","value":"6570"},{"key":"1992","value":"6580"},{"key":"1996","value":"6585"},{"key":"2000","value":"6589"},{"key":"2004","value":"6594"},{"key":"2008","value":"6600"},{"key":"2012","value":"6606"},{"key":"2016","value":"6613"}]},{"key":"JAM","values":[{"key":"1980","value":"6616"},{"key":"1984","value":"6623"},{"key":"1988","value":"6630"},{"key":"1992","value":"6634"},{"key":"1996","value":"6650"},{"key":"2000","value":"6673"},{"key":"2004","value":"6686"},{"key":"2008","value":"6700"},{"key":"2012","value":"6725"},{"key":"2016","value":"6755"}]},{"key":"CAN","values":[{"key":"1984","value":"6842"},{"key":"1988","value":"6865"},{"key":"1992","value":"6909"},{"key":"1996","value":"6959"},{"key":"2000","value":"6990"},{"key":"2004","value":"7007"},{"key":"2008","value":"7042"},{"key":"2012","value":"7097"},{"key":"2016","value":"7166"}]},{"key":"PAK","values":[{"key":"1984","value":"7182"},{"key":"1988","value":"7183"},{"key":"1992","value":"7199"}]},{"key":"JPN","values":[{"key":"1984","value":"7248"},{"key":"1988","value":"7268"},{"key":"1992","value":"7315"},{"key":"1996","value":"7357"},{"key":"2000","value":"7401"},{"key":"2004","value":"7494"},{"key":"2008","value":"7545"},{"key":"2012","value":"7629"},{"key":"2016","value":"7693"}]},{"key":"USA","values":[{"key":"1984","value":"8045"},{"key":"1988","value":"8253"},{"key":"1992","value":"8477"},{"key":"1996","value":"8736"},{"key":"2000","value":"8978"},{"key":"2004","value":"9241"},{"key":"2008","value":"9558"},{"key":"2012","value":"9806"},{"key":"2016","value":"10070"}]},{"key":"CHN","values":[{"key":"1984","value":"10144"},{"key":"1988","value":"10196"},{"key":"1992","value":"10278"},{"key":"1996","value":"10384"},{"key":"2000","value":"10463"},{"key":"2004","value":"10557"},{"key":"2008","value":"10741"},{"key":"2012","value":"10866"},{"key":"2016","value":"10979"}]},{"key":"POR","values":[{"key":"1984","value":"10982"},{"key":"1988","value":"10983"},{"key":"1996","value":"10986"},{"key":"2000","value":"10988"},{"key":"2004","value":"10991"},{"key":"2008","value":"10993"},{"key":"2012","value":"10995"},{"key":"2016","value":"10996"}]},{"key":"QAT","values":[{"key":"1992","value":"10997"},{"key":"2000","value":"10998"},{"key":"2012","value":"11000"},{"key":"2016","value":"11001"}]}];
    
        this.margin = { top: 100, right: 250, bottom: 10, left: 50 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2;

        this.color = d3.scaleOrdinal(d3.schemeSet3); // Distinct colors for each slice

        this.svg = d3.select("#chart")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.width / 2 + this.margin.left}, ${this.height / 2 + this.margin.top})`);

        this.arc = d3.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(0);

        this.labelArc = d3.arc()
            .outerRadius(this.radius + 30)
            .innerRadius(this.radius + 30);

        this.pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        this.init();
    }

    init() {
        this.updateChart(this.activeYear);
        this.setupSlider();
        this.addTitle(this.activeYear);
    }

    updateChart(year) {
        const filteredData = this.data.map(country => ({
            key: country.key,
            value: country.values.find(v => v.key === year) ? parseInt(country.values.find(v => v.key === year).value) : 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

        const totalMedals = filteredData.reduce((acc, curr) => acc + curr.value, 0);

        this.svg.selectAll(".arc").remove(); // Clear the previous arcs

        let g = this.svg.selectAll(".arc")
            .data(this.pie(filteredData))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", this.arc)
            .style("fill", d => this.color(d.data.key));

        g.append("text")
            .attr("transform", d => `translate(${this.arc.centroid(d)})`)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => d.data.key);

        g.append("text")
            .attr("transform", d => `translate(${this.labelArc.centroid(d)})`)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => `${(d.data.value / totalMedals * 100).toFixed(1)}%`);

        this.createLegend(filteredData);
    }

    setupSlider() {
        const slider = d3.select("#yearRange");
        slider.on("input", () => {
            const year = slider.node().value;
            this.updateChart(year);
            this.addTitle(year); // Update title with current year
        });
    }

    createLegend(data) {
        this.svg.selectAll(".legend").remove(); // Clear previous legends
        const legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${this.radius + 100}, ${-this.radius + 30})`);

        data.forEach((d, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);

            legendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", this.color(d.key));

            legendRow.append("text")
                .attr("x", 20)
                .attr("y", 10)
                .text(d.key);
        });
    }

    addTitle(year) {
        this.svg.selectAll(".title").remove(); // Clear previous title
        this.svg.append("text")
            .attr("class", "title")
            .attr("transform", `translate(${0}, ${-this.height / 2 - 20})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .text(`Top 10 Countries by Medal Count in ${year}`);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const pieChart = new PieChart();
});
