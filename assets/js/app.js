// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 720;
var svgHeight = 420;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
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
var chosenXAxis = "obesity";
var chosenYAxis = "poverty";

// function used for updating x-scale var upon click on axis xlabel
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.9,
      d3.max(Data, d => d[chosenXAxis]) * 1.1])
    .range([0, width]);
  // console.log(`x: ${Data.chosenXAxis}`)
  return xLinearScale;
}
function yScale(Data, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenYAxis] * 0.9), d3.max(Data, d => d[chosenYAxis]) * 1.1])
    .range([height, 0]);
    // console.log(` y: ${Data.chosenXAxis}`)
  return yLinearScale;
}

// function used for updating Axes upon click on axis xlabel
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
function renderTexts(txtGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  txtGroup.transition()
    .duration(1000)
    .attr("x", d=>newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]))
  return txtGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, chosenXAxis, circlesGroup) {
  var yLabel = ""
  var xLabel = ""
  if (chosenYAxis === "poverty"){
    yLabel = "Poverty: ";
  }
  else if (chosenYAxis === "age"){
    yLabel = "Age: ";
  }
  else{
    yLabel = "Income: $";
  }
  if (chosenXAxis === "healthcare"){
    xLabel = "Healthcare: "
  }
  else if (chosenXAxis === "smokes"){
    xLabel = "Smokes: "
  }
  else{
    xLabel = "Obesity: "
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("opacity", ".25")
    .style("background",'orange')
    .offset([80, -60])
    .html(function(d) {
      if (chosenYAxis === "smokes" || chosenYAxis === "obesity") {
      if (chosenXAxis === "poverty"){
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}%`)
        }
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}%`)
      }
      else if (chosenXAxis === "poverty"){
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
      }
      else{
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}`)}
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    d3.select(this).style("stroke", "black");
  })
    // onmouseout event
    circlesGroup.on("mouseout", function(data) {
      toolTip.hide(data, this);
      d3.select(this).style("stroke", "white");
    });
  return circlesGroup;
}

  // Create code to build the bar chart using the Data.
d3.csv('assets/data/data.csv').then(function(Data, err) {
  if (err) throw err;
  console.log(Data)

  // Cast the value to a number for each piece of Data
  Data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      // console.log (`poverty: ${data.poverty}`);
  })
  // console.log (data.smokes);

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(Data, chosenXAxis);
    var yLinearScale = yScale(Data, chosenYAxis);

    // var xLinearScale = d3.scaleLinear()
    //   .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8, d3.max(Data, d => d[chosenXAxis])])
    //   .range([0, width]);

    // var yLinearScale = d3.scaleLinear()
    //   .domain([d3.min(Data, d => d[chosenYAxis]), d3.max(Data, d => d[chosenYAxis])])
    //   .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // var yAxis = chartGroup.append("g")
    // .classed("y-axis", true)
    // .attr("transform", `translate(0, ${height})`)
    // .call(leftAxis);

    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis)

    // Step 5: Create Circles
    // ==============================
    var cTxtGroup = chartGroup.selectAll("circles")
    .data(Data)
    .enter()
    .append("g")

    var circlesGroup = cTxtGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 10)
      .classed('stateCircle', true)
      .attr("fill", "blue")
      .attr("opacity", ".5");

    var txtGroup = cTxtGroup.append("text")
      .text(Data => Data.abbr)
      .attr("x", d=>xLinearScale(d[chosenXAxis]))
      .attr("y", d=>yLinearScale(d[chosenYAxis])+3)
      .classed("stateText", true)
      .style("font-size", "7px")
      .style("font-weight", "800")

    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var obesityLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("value", "obesity")
      .classed("active", true)
      .text("Obesity by percent of poulation");

    var healthCareLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("value", "healthcare")
      .classed("inactive", true)
      .text("Percent of population without Health Care");

    var smokesLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 55)
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Percent of Smokers");

    var povertyLabel = ylabelsGroup.append("text")
      .attr("x", -140)
      .attr("y", -25)
      .attr("value", "poverty")
      .classed("active", true)
      .classed("aText", true)
      .text("In Poverty (%)");

    var ageLabel = ylabelsGroup.append("text")
      .attr("x", -140)
      .attr("y", -45)
      .attr("value", "age")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Age (Median)");

    var incomeLabel = ylabelsGroup.append("text")
      .attr("x", -140)
      .attr("y", -65)
      .attr("value", "income")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Household Income (Median)");


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

  //   // // Step 7: Create tooltip in the chart
  //   // // ==============================
  //   chartGroup.call(toolTip);
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //   // Step 8: Create event listeners to display and hide the tooltip
  //   // ==============================
  //   circlesGroup.on("click", function(data) {
  //     toolTip.show(data, this);
  //   })
  //     // onmouseout event
  //     .on("mouseout", function(data, index) {
  //       toolTip.hide(data);
  //     });
   // x axis labels event listener
   xlabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {
       chosenXAxis = value;
       console.log(chosenXAxis)
       xLinearScale = xScale(Data, chosenXAxis);
       xAxis = renderAxes(xLinearScale, xAxis);
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
       // changes classes to change bold text
       if (chosenXAxis === "obesity") {
          obesityLabel
           .classed("active", true)
           .classed("inactive", false);
          healthCareLabel
           .classed("active", false)
           .classed("inactive", true);
          smokesLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else if (chosenXAxis === "healthcare") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthCareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
       }
       else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
      }
     }
   });
}).catch(function(error) {
 console.log(error);
});

    // // Create axes labels
    // chartGroup.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1em")
    //   .attr("class", "axisText")
    //   .text("Poverty Rate (%)");

    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top +10})`)
    //   .attr("class", "axisText");

    // var xline1 = d3.line()
    //   .x(d => xScale(d))
  // });