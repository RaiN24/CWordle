var timeline = {
	length: undefined,
	height: undefined,
	svg: undefined,
	svgG: undefined,

	initialize: function() {
		var self = this;
		self.length = $("#view3").width();
		self.height = $("#view3").height();
		self.svg = d3.select("#view3").append("svg")
			.attr("class", "fullsvg");
		self.svgG = self.svg.append("g")
			.attr("transform", "translate(0, 0)");
		var xScale = d3.scale.linear()
			.range([0, self.length]);
		var yScale = d3.scale.linear()
			.range([self.height, 0]);
		var dataArray = [];
		var maxY = 0;
		var maxX = 0;
		d3.csv("data.csv", function(data) {
			for(var line in data) {
				var object = {};
				object.start = parseInt(data[line].start);
				object.end = parseInt(data[line].end);
				object.height = parseInt(data[line].weight);
				object.word = data[line].word;
				dataArray.push(object);
				if(object.end > maxX) {
					maxX = object.end;
				}
				if(object.height > maxY) {
					maxY = object.height;
				}
			}
			xScale.domain([0, maxX]);
			yScale.domain([0, maxY * 1.1]);
			console.log(dataArray);
			var bars = self.svgG.selectAll(".timeline-rect")
				.data(dataArray);
			bars.enter()
				.append("rect")
				.attr("class", "timeline-rect")
				.attr("width", function(d) {
					return xScale(d.end - d.start);
				})
				.attr("height", function(d) {
					return self.height - yScale(d.height);
				})
				.attr("x", function(d) {
					return xScale(d.start);
				})
				.attr("y", function(d) {
					return yScale(d.height);
				})





			var scale = d3.scale.identity()
				.domain([0, self.length]);
			var brush = d3.svg.brush();
			brush.x(scale)
				.on("brushend", changeSelectedTime);
			self.svg.append("g")
				.attr("id", "GforBrush")
				.attr("stroke","#fff")
				.attr("fill-opacity", 0.125)
				.call(brush)
				.selectAll("rect")
				.attr("y", 0)
				.attr("height", self.height);

			function changeSelectedTime() {
				var extentX = +d3.select(".extent").attr("x");
				var extentWidth = +d3.select(".extent").attr("width");
				if(extentWidth <= 1) {
					//cancel select time
					return null;
				}
				console.log(extentX, extentWidth);
				/*var brushScale = d3.scale.linear()
					.domain([0, $("#" + _dayScaleTimelineDivID).width()])
					.range([0, 24 * 60]);
				var startminutes = parseInt(brushScale(extentX));
				var endminutes = parseInt(brushScale(extentX + extentWidth));*/
			}
		});
		
	}

}