console.log("JS is running");

d3.csv("auto-mpg.csv")
  .then(data => {

    // 1. Convert strings to numbers
    data.forEach(d => {
      d.weight = +d.weight;
      d.mpg = +d.mpg;
    });

    console.log("DATA LOADED:", data);

    // 2. SVG setup
    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // 3. Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "6px")
      .style("border", "1px solid #ccc")
      .style("font-size", "12px")
      .style("display", "none");

    // 4. Scales
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.weight))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.mpg))
      .range([height - margin.bottom, margin.top]);

    // 5. Axes
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // 6. Dots (scatterplot + interaction)
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.weight))
      .attr("cy", d => y(d.mpg))
      .attr("r", 4)
      .attr("fill", "steelblue")

      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`
            <b>MPG:</b> ${d.mpg}<br>
            <b>Weight:</b> ${d.weight}
          `);
      })

      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })

      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

  })
  .catch(error => {
    console.log("CSV ERROR:", error);
  });