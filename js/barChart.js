d3.csv("data/spotify.csv").then(data => {
    data = data.filter(d => d.track_name && d.popularity)
               .sort((a, b) => b.popularity - a.popularity)
               .slice(0, 10);

    const margin = { top: 50, right: 30, bottom: 150, left: 60 },
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.track_name))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.popularity)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "12px");

    // Tooltip setup
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("color", "black")
        .style("z-index", 1000);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.track_name))
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", d => color(d.track_name))
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "#ffb74d");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`<strong>${d.track_name}</strong><br/>Popularity: ${d.popularity}`)
                   .style("left", `${event.pageX + 10}px`)
                   .style("top", `${event.pageY - 28}px`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", `${event.pageX + 10}px`)
                   .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function (event, d) {
            d3.select(this).attr("fill", color(d.track_name));
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .attr("y", d => y(+d.popularity))
        .attr("height", d => height - y(+d.popularity));

    // Y Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Popularity");

    // X Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Track Name");
});