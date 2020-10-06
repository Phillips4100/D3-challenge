// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 720;
var svgHeight = 480;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 40
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select('#scatter')
.append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "Obesity";
var chosenYAxis = "Poverty";

// function used for updating x-scale var upon click on axis label
function Scale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
      d3.max(Data, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenYAxis]) - 1, d3.max(Data, d => d[chosenYAxis])])
    .range([height, 0]);
  return xLinearScale, yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return xAxis, yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var label;
  if (chosenXAxis === "obesity") {
    label = "Obesity (%):";
  }
  else if (chosenXAxis === "healthcare") {
    label = "Lacks Healthcare (%):";
  }
  else {
    label = "Smokes (%):";
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("opacity", ".25")
    .style("background",'orange')
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}

  // Create code to build the bar chart using the Data.
d3.csv('assets/data/data.csv').then(function(Data) {
    console.log(Data)

    // Cast the hours value to a number for each piece of Data
    Data.forEach(function(data) {
        data.poverty =+ data.poverty;
        data.obesity =+ data.obesity;
        data.age =+ data.age;
        data.income =+ data.income;
        data.healthcare =+ data.healthcare;
        data.smokes =+ data.smokes;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = Scale(Data, chosenXAxis);
    var yLinearScale = Scale(Data, chosenYAxis);

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8, d3.max(Data, d => d[chosenXAxis])])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenYAxis]) - 1, d3.max(Data, d => d[chosenYAxis])])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${width})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // // Step 6: Initialize tool tip
    // // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .attr("opacity", ".25")
    //   .style("background",'orange')
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>Obesity: ${d.obesity}<br>Poverty: ${d.poverty}`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty Rate (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top +10})`)
      .attr("class", "axisText");
  }).catch(function(error) {
    console.log(error);

    var xline1 = d3.line()
      .x(d => scale(d))
  });