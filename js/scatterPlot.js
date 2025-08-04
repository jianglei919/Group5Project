d3.csv("data/spotify.csv").then(data => {
    data = data.filter(d => d.danceability && d.energy && d.genre);

    const margin = { top: 50, right: 50, bottom: 70, left: 70 }, // increased margins for labels
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Y axis
    svg.append("g").call(d3.axisLeft(y));

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-50},${height / 2}) rotate(-90)`)
        .style("font-size", "14px")
        .text("Energy");

    // X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width / 2},${height + 50})`)
        .style("font-size", "14px")
        .text("Danceability");

    svg.selectAll("circle")
        .data(data.slice(0, 500))  
        .enter()
        .append("circle")
        .attr("cx", d => x(+d.danceability))
        .attr("cy", d => y(+d.energy))
        .attr("r", 5)
        .attr("fill", d => color(d.genre))
        .attr("opacity", 0.7)
        .on("mouseover", function (event, d) {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "#333")
                .style("color", "#fff")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .html(`<strong>${d.track_name}</strong><br>${d.artist_name}<br>Genre: ${d.genre}`);
            tooltip.style("left", event.pageX + "px").style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", function () {
            d3.selectAll(".tooltip").remove();
        });
});
