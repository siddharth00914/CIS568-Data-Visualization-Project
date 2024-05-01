class TreeMap {

    constructor(treeData, updateyear) {
        console.log(treeData);
        this.treeData = treeData;
        this.updateyear = updateyear;
    }

    createTreeMap() {
        let colorScale = d3.scaleOrdinal(d3.schemePaired);
        let that = this;

        let treemap = d3.treemap()
            .size([1000, 1000])
            .padding(1);

        let root = d3.stratify()
            .id(d => d.name)
            .parentId(d => d.parent)
            (that.treeData)
            .sum(d => d.medals)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        treemap(root);

        let svgContainer = d3.select("#treemap")
            .append("svg")
            .attr("width", 1000)
            .attr("height", 1000);

        let cell = svgContainer.selectAll("a")
            .data(root.leaves())
            .join("a")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        let rects = cell.append("rect")
            .attr("id", d => d.id);

        rects.attr("height", d => d.y1 - d.y0)
            .transition().duration(4000)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => {
                let a = d.ancestors();
                return colorScale(a[a.length - 2].id);
            });

        rects.on("mouseover", function(d) {
                rects.html(`<title>Sport: ${d.id}\nCountry: ${d.data.parent}\nMedals Won: ${d.data.medals}</title>`);
                cell.selectAll("rect").style("opacity", "0.5");
                d3.select(this).style("opacity", "1");
            })
            .on("mouseout", function() {
                cell.selectAll("rect").style("opacity", "1");
            });

        let label = cell.append("text")
            .attr("clip-path", d => d.name);

        label.append("tspan")
            .attr("x", 3)
            .attr("y", 18)
            .attr("class", "sport")
            .text(d => {
                if (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 25) {
                    return d.id;
                } else {
                    return "";
                }
            });

        label.append("tspan")
            .attr("class", "medals")
            .attr("x", 15)
            .attr("y", 40)
            .text(d => {
                if (d.x1 - d.x0 > 60 && d.y1 - d.y0 > 60) {
                    return d.value;
                }
                return "";
            });

        cell.append("title")
            .text(d => `${d.id}\n${d.medals}`)
            .style('fill', "white");

        d3.select('#treemap')
            .append('div').attr("class", "rangeslider").attr('id', 'activeYear-bar');

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1980)
            .attr('max', 2016)
            .attr('step', 4)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);
        this.drawYearBar(this.activeYear);
    }

    drawYearBar() {
        let that = this;
        let yearScale = d3.scaleLinear().domain([1980, 2016]).range([30, 730]);
        let yearSlider = d3.select('.slider');

        yearSlider.on('input', function() {
            let year = yearSlider.node().value;
            let sliderLabel = d3.select('.slider-wrap');
            let sliderText = sliderLabel.select('text').text(year);
            sliderText.attr('x', yearScale(year))
                      .attr('y', 25)
                      .attr('font-size', "large")
                      .attr('font-weight', 'bold');

            that.updateyear(year);
        });
    }

    updateTreeMap(data) {
        let colorScale = d3.scaleOrdinal(d3.schemePaired);
        let that = this;
        let treemap = d3.treemap()
            .size([400, 500])
            .round(true)
            .padding(1);

        let root = d3.stratify()
            .id(d => d.name)
            .parentId(d => d.parent)
            (data)
            .sum(d => d.medals)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        treemap(root);

        let divContainer = d3.select("#treemap");
        let cell = divContainer.select('svg').selectAll('a')
            .data(root.leaves())
            .join("a")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        let rects = cell.selectAll("rect");
        let label = cell.selectAll("text");
        label.remove();
        rects.remove();

        rects = cell.append("rect")
            .attr("id", d => d.id);

        rects.attr("height", d => d.y1 - d.y0)
            .transition().duration(4000)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => {
                let a = d.ancestors();
                return colorScale(a[a.length - 2].id);
            });

        rects.on("mouseover", function(d) {
                rects.html(`<title>Sport: ${d.id}\nCountry: ${d.data.parent}\nMedals Won: ${d.data.medals}</title>`);
                cell.selectAll("rect").style("opacity", "0.5");
                d3.select(this).style("opacity", "1");
            })
            .on("mouseout", function() {
                cell.selectAll("rect").style("opacity", "1");
            });

        label = cell.append("text")
            .attr("clip-path", d => d.name);

        label.append("tspan")
            .attr("x", 3)
            .attr("y", 18)
            .text(d => {
                if (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 25) {
                    return d.id;
                } else {
                    return "";
                }
            });

        label.append("tspan")
            .attr("x", 15)
            .attr("y", 40)
            .text(d => {
                if (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 25) {
                    return d.value;
                }
                return "";
            });

        cell.selectAll("title")
            .join('title')
            .text(d => `${d.id}\n${d.medals}`)
            .style('fill', "white");

        this.drawYearBar();
    }

}