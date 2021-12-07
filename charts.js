function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}
//--------------------------------
// Demographics Panel 
//--------------------------------
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//--------------------------------
//CREATE BAR CHART
//---------------------------------
function buildCharts(sample) {
  //Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //Create a variable that holds the samples array. 
      var samples = data.samples;
    //Create a variable that filters the samples for the object with the desired sample number.
      var sampleResults = samples.filter(sampleObj =>
        sampleObj.id == sample)

    //CREATE a variable that filters the METADATA array for the object with the desired sample number.
      
      var metadata = data.metadata;
      var washResults = metadata.filter(metadataObj =>
        metadataObj.id == sample);
      console.log(washResults);

      //Create a variable that holds the first sample in the array.
      var firstSample = sampleResults [0];
      console.log(sample);

    //CREATE a variable that holds the first sample in the METADATA array.
      var firstWash = washResults[0];
      console.log(sample);
    
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = firstSample.otu_ids.slice(0,10);
      console.log(otuIds);
      
      var otuLabels = firstSample.otu_labels.slice(0,10);;
      console.log(otuLabels);

      var samplevalues = firstSample.sample_values.slice(0,10).reverse();
      console.log(samplevalues);


    //CREATE a variable that holds the washing frequency.
      var washFreq = firstWash.wfreq 
      console.log(washFreq)

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

     // See Template Literals (Template Strings)
    var yticks = otuIds.map(id => `OTU ${id}`);
    console.log(yticks);

    //Create the trace for the bar chart. 
    var barData = [{
      x: samplevalues,
      y: yticks,
      type: "bar",
      hovertext: otuLabels,
      orientation: 'h'
    }];
    //Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     align: screenLeft,
    };
    //Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout)

  //-------------------
    //BUBBLE CHART
  //-------------------
    //Create the trace for the bubble chart.
    var otuIds = firstSample.otu_ids
    var otuLabels = firstSample.otu_labels
    var samplevalues = firstSample.sample_values

    var bubbleData = [{
      x: otuIds,
      y: samplevalues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color:otuIds,
        size:samplevalues, 
        colorscale: 'Earth',
        type: 'scatter'
      }
    }];

    //Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text:"Bacteria Cultures Per Sample"},
      font: {size: 16},
      xaxis: {title: "OTU IDs"}
    };

    //Use Plotly to plot the data with the layout.
    Plotly.newPlot(bubble, bubbleData,bubbleLayout); 
  
  //----------------------
  // Gauge 
  //-----------------------

  //Create the trace for the gauge chart.
  var gaugeData = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: washFreq,
    title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs Per Week" },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      bar: {color: 'black', width: 1},
      steps: [
        { range: [0, 2], color: "white" },
        { range: [2, 4], color: "lightsteelblue" },
        { range: [4, 6], color: "royalblue" },
        { range: [6, 8], color: "mediumblue" },
        { range: [8, 10], color: "midnightblue" }]}
  }];
  
  //Create the layout for the gauge chart.
  var gaugeLayout = { width:500, height: 450, margin: { l: 0, r: 100, t: 0, b: 0 }  
  };
  

  //Use Plotly to plot the gauge data and layout.
  Plotly.newPlot('gauge', gaugeData, gaugeLayout);
});  
}
