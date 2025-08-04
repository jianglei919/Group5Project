d3.csv("data/spotify.csv").then(data => {
    // Simulate year field if missing by assigning a random year in range 2005–2024
    data.forEach(d => {
        d.year = +d.year || Math.floor(Math.random() * 20) + 2005;
        d.tempo = +d.tempo;
    });

    // Group by year and calculate average tempo
    const yearTempo = d3.rollups(
        data.filter(d => d.tempo),
        v => d3.mean(v, d => d.tempo),
        d => d.year
    ).sort((a, b) => a[0] - b[0]);

    const margin = { top: 50, right: 50, bottom: 70, left: 70 },  // Increased bottom and left for labels
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#lineChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain(d3.extent(yearTempo, d => d[0]))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(yearTempo, d => d[1]) - 5, d3.max(yearTempo, d => d[1]) + 5])
        .range([height, 0]);

    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-50},${height / 2}) rotate(-90)`)
        .style("font-size", "14px")
        .text("Average Tempo");

    // X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width / 2},${height + 50})`)
        .style("font-size", "14px")
        .text("Year");

    // Line path
    svg.append("path")
        .datum(yearTempo)
        .attr("fill", "none")
        .attr("stroke", "#1DB954")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d[0]))
            .y(d => y(d[1]))
        );

    // Points
    svg.selectAll("circle")
        .data(yearTempo)
        .enter()
        .append("circle")
        .attr("cx", d => x(d[0]))
        .attr("cy", d => y(d[1]))
        .attr("r", 4)
        .attr("fill", "#1DB954")
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .html(`Year: ${d[0]}<br>Avg Tempo: ${d[1].toFixed(2)}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => d3.select(".tooltip").remove());
});
