d3.csv("data/spotify.csv").then(data => {
    // Clean and sort data
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

    // Add Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.track_name))
        .attr("y", d => y(+d.popularity))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(+d.popularity))
        .attr("fill", "#1DB954")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "#fff176");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "#1DB954");
        });

    // Add Y Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Popularity");

    // Add X Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Track Name");
});
