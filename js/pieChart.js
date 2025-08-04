d3.csv("data/spotify.csv").then(data => {
    const top100 = data.slice(0, 100);

    const artistCount = d3.rollup(
        top100,
        v => v.length,
        d => d.artist_name
    );

    const pieData = Array.from(artistCount, ([artist, count]) => ({ artist, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const total = d3.sum(pieData, d => d.count);

    const width = 700, height = 600, radius = Math.min(width, height) / 2;

    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Add chart title
    svg.append("text")
        .attr("x", 0)
        .attr("y", -(height / 2) + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Top 10 Artists by Song Count");

    // Background rounded rect
    svg.insert("rect", ":first-child")
        .attr("x", -width / 2 - 40)
        .attr("y", -height / 2 - 40)
        .attr("width", width + 80)
        .attr("height", height + 80)
        .attr("rx", 30)
        .attr("fill", "white");

    const tooltip = d3.select("#pieChart")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("padding", "8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("font-size", "12px");

    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.artist))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);

    svg.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("fill", d => color(d.data.artist))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.8)
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .html(`<strong>${d.data.artist}</strong><br>${d.data.count} songs<br>${((d.data.count / total) * 100).toFixed(1)}%`);
            d3.select(this).transition().duration(200).style("opacity", 1);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
            d3.select(this).transition().duration(200).style("opacity", 0.8);
        })
        .transition()
        .duration(1000)
        .attrTween("d", function(d) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return t => arc(i(t));
        });

    // Legend group, positioned top-left corner inside svg
    const legend = svg.append("g")
        .attr("transform", `translate(${-(width / 2) + 20},${-(height / 2) + 60})`); // pushed down 60px to avoid title

    pieData.forEach((d, i) => {
        const row = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        row.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(d.artist));

        row.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(d.artist)
            .style("font-size", "12px")
            .style("fill", "#333");
    });
});
