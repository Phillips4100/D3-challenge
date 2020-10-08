// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = window.innerWidth * .8;
var svgHeight = window.innerHeight / 2;
// var svgWidth = 720;
// var svgHeight = 480;

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
// var svgA = d3.select('#scatter')
//     .select("svg")
//     if (!svgA.empty()) {
//       svgArea.remove();
//   }

var svg = d3.select('#scatter')
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "smokes";
var chosenYAxis = "income";

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
    .attr("cy", d => newYScale(d[chosenYAxis]))
  return circlesGroup;
}
function renderTexts(txtGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  txtGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis])+3)
  return txtGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  yLabel = ''
    if (chosenYAxis === "poverty"){
      yLabel = "Poverty rate: ";
    }
    if (chosenYAxis === "age"){
      yLabel = "Average Age: ";
    }
    else {
      yLabel = "Avg. Income: ";
    }
    if (chosenXAxis === "healthcare"){
      xLabel = "Healthcare: "
    }
    if (chosenXAxis === "smokes"){
      xLabel = "Smokes: "
    }
    if (chosenXAxis === "obesity"){
      xLabel = "Obese: "
    }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("opacity", ".25")
    .style("background",'orange')
    .offset([80, -60])
    .html(function(d) {
      return(`${d.state}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
    
      // if (chosenYAxis === "smokes" || chosenYAxis === "obesity") {
      // if (chosenXAxis === "poverty"){
      //   return(`${d.state}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}%`)
      //   }
      //   return(`${d.state}<br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}%`)
      // }
      // else if (chosenXAxis === "poverty"){
      //   return(`${d.state}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
      // }
      // else{
      //   return(`${d.state}<br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}`)}
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    // d3.select(this).style("stroke", "black");
  })
    // onmouseout event
    circlesGroup.on("mouseout", function(data) {
      toolTip.hide(data, this);
      // d3.select(this).style("stroke", "white");
    });
  return circlesGroup;
}

  // Create code to build the bar chart using the Data.
d3.csv('assets/data/data.csv').then(function(Data) {
  // if (err) throw err;
  // console.log(Data)

  // Cast the value to a number for each piece of Data
  Data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      // console.log (`poverty: ${data.poverty}`);
  });
  // console.log (data.smokes);

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(Data, chosenXAxis);
    var yLinearScale = yScale(Data, chosenYAxis);

    // var xLinearScale = d3.scaleLinear()
    //   .domain([d3.min(Data, d => d[chosenXAxis]) * 0.9, d3.max(Data, d => d[chosenXAxis]) * 1.1])
    //   .range([0, width]);
    // var yLinearScale = d3.scaleLinear()
    //   .domain([d3.min(Data, d => d[chosenYAxis] * 0.9), d3.max(Data, d => d[chosenYAxis]) * 1.1])
    //   .range([height, 0]);

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
      .attr("transform", "translate(0,0)")

    // Step 5: Create Circles
    // ==============================
    var cTxtGroup = chartGroup.selectAll("circles")
    .data(Data)
    .enter()
    .append("g", "text")

    var circlesGroup = cTxtGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 12)
      .attr("fill", "blue")
      .attr("opacity", ".6");

    var txtGroup = cTxtGroup.append("text")
      .text(Data => Data.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis])+3)
      .classed("stateText", true)
      .style("font-size", "8px")
      .style("font-weight", "800")

    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2));
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var obesityLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("value", "obesity")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Obesity by percent of poulation");

    var healthCareLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("value", "healthcare")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Percent of population without Health Care");

    var smokesLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 55)
      .attr("value", "smokes")
      .classed("inactive", false)
      .classed("aText", true)
      .text("Percent of Smokers");

    var povertyLabel = ylabelsGroup.append("text")
      .attr("x", -140)
      .attr("y", -50)
      .attr("value", "poverty")
      .classed("inactive", true)
      .classed("aText", true)
      .text("In Poverty (%)");

    var ageLabel = ylabelsGroup.append("text")
      .attr("x", -140)
      .attr("y", -70)
      .attr("value", "age")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Age (Median)");

    var incomeLabel = ylabelsGroup.append("text")
      .attr("x", -140)
      .attr("y", -90)
      .attr("value", "income")
      .classed("inactive", false)
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

  // function updateall() {
  //   renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  //   updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  //   renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  // }


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
        console.log(`x: ${chosenXAxis}`)
        console.log(`y: ${chosenYAxis}`)
        xLinearScale = xScale(Data, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        toolTip = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        txtGroup = renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        // circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        // circlesGroup =  renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
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

   ylabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenYAxis) {
      chosenYAxis = value;
      console.log(`x: ${chosenXAxis}`)
      console.log(`y: ${chosenYAxis}`)
      yLinearScale = yScale(Data, chosenYAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);
      circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      toolTip = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      txtGroup = renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
       // changes classes to change bold text
       if (chosenYAxis === "poverty") {
          povertyLabel
           .classed("active", true)
           .classed("inactive", false);
          ageLabel
           .classed("active", false)
           .classed("inactive", true);
          incomeLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else if (chosenYAxis === "age") {
         povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
       }
       else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
      }
     }
  });
});