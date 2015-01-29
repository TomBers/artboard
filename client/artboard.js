Meteor.subscribe("items");
// Meteor.subscribe("userStatus");

// var onlineUsrs = [];
var scale = 90;
var r = 45;

var sqscale = 50;
var sqr = 75;

var clicks = 0;
Session.set('col', '#7C1318');


var a1 = Math.PI/2;
var a2 =  Math.PI;
var a3 = 3*(2*Math.PI)/4;
var a4 = 2*Math.PI;
var possA = [a1,a2,a3,a4];
var angls = [[0,a1],
[0,a1],[0,a2],[0,a3],[0,a4],
[a1,a2],[a1,a3],[a1,a4],[0,a4],
[a2,a3],[a2,a4],[a2,a1+a4],[0,a4],
[a3,a4],[a3,a4+a1],[a3,a4+a2],[0,a4]
];

	var cols = ['#7C1318',
	'#0281D2',
	'#05C6B3',
	'#7B116D',
	'#BD0020',
	'#FAB7D6',
	'#F6A201',
	'#ffffff',
	'#F8D021',
	'#30641A',
	'#003A92',
	'#4D91E2','#E83F04'];



	// if (Meteor.isClient) {

		canvas = null;
		ctx    = null;
		Meteor.startup(function(){	
				Session.set('score',0);
				// console.log(Router.current().path(this));
			
			});

			Template.canvas.helpers({
				getDat: function () {
					return Items.find({},{sort: {x: 1,y:1}});
				}	
			});

			Template.control.helpers({
				score : function(){
					return Session.get('score');
				},
				online : function(){
					return Meteor.users.find({ "status.online": true });	
				}
			});


			Template.canvas.rendered = function(){
			
				var self = this;
				self.node = self.find("svg");
				d3.select(self.node).attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});
				var height = 500; 
				if (! self.handle) {
					self.handle = Deps.autorun(function () {
						clearScreen(self.node);
						
						var itms = Items.find().fetch();
						switch (Router.current().route.getName()) {
							case "squares": 
							drawSquares(self.node,itms,height);
							break;
							case "circles": 
							drawCicles(self.node,itms,height);
							break;
							case "arcs": 
							drawArcs(self.node,itms,height);
							break;
							default: 	console.log('Non selected'); 	
							
						}
						// drawCicles(self.node,itms,height);
						// drawSquares(self.node,itms,height);
						
						colSelTool(self.node);

					});
				};
			};

		// }


		function clearScreen(node){
			d3.select(node).append("svg:rect")
			.attr("x", 0)
			.attr("y",0)
			.attr("width",  2000)
			.attr("height", 2000)
			.attr("fill", '#ffffff');
			
		}
		function drawCicles(node,itms,height){
			itms.forEach(function(item){

				var cx = (item.x * scale) + r;
				var cy =  height - ((item.y * scale)+ r);

				if(!isNaN(cx) && !isNaN(cy)){
					d3.select(node).append("svg:circle")
					.attr("cx", cx)
					.attr("cy",cy)
					.attr("r", r)
					.attr("fill",item.colour)
					.attr("stroke",'#ffffff')
					.attr("stroke-width", 2)
					.on('mouseover',function(){
						d3.select(this)
						.attr("stroke",'#000000')
						.attr("r",(r-2));
					})
					.on('mouseout',function(){
						d3.select(this)
						.attr("stroke",'#ffffff')
						.attr("r",r);
					})
					.on('click',function(){
						if(d3.select(this).attr("fill") != Session.get('col') ){
							d3.select(this).attr("fill",Session.get('col'));
							Meteor.call('changeColour',item.x,item.y,Session.get('col'));

							Meteor.call('getOrigScore',clicks++, function(err,data){
								Session.set('score',data);
							});
						}



					})	
				}


			});
		}

		function drawSquares(node,itms,height){
			itms.forEach(function(item){
				var cx = (item.x * sqr) + (item.x * 10) + 2;
				var cy = (item.y * sqr) + sqr + (item.y * 10);
				if(!isNaN(cx) && !isNaN(cy)){						
					d3.select(node).append("svg:rect")
					.attr("x", cx)
					.attr("y",cy)
					.attr("width",  sqr)
					.attr("height", sqr)
					.attr("stroke", '#ffffff')
					.attr("stroke-width", 2)
					.attr("class",'rectshape')
					.attr("fill",item.colour)
					.on('mouseover',function(){
						d3.select(this)
						.attr("stroke",'#000000');
					})
					.on('mouseout',function(){
						d3.select(this)
						.attr("stroke",'#ffffff');
					})
					.on('click',function(){
						if(d3.select(this).attr("fill") != Session.get('col') ){
							d3.select(this).attr("fill",Session.get('col'));
							Meteor.call('changeColour',item.x,item.y,Session.get('col'));

							Meteor.call('getOrigScore',clicks++, function(err,data){
								Session.set('score',data);
							});
						}



					})
				}
			});
		}

		function drawArcs(node,itms,height){
			var ct = 0;
			itms.forEach(function(item){
				var cx = (item.x * scale) + r;
				var cy =  height - ((item.y * scale)+ r);

				// console.log(angls[item.endAngle]);
				var ea = possA[item.endAngle];


				var arc = d3.svg.arc()
				.innerRadius(r-30)
				.outerRadius(r)
				.startAngle(angls[item.endAngle][0]) //converting from degs to radians
				.endAngle(angls[item.endAngle][1]);

				if(!isNaN(cx) && !isNaN(cy)){	
					d3.select(node).append("svg:circle")
					.attr("cx", cx)
					.attr("cy",cy)
					.attr("r", r)
					.attr("fill",'#ffffff');

					d3.select(node).append("path")
					.attr("d", arc)
					.attr('class', 'arc')
					.attr('id', 'arc'+ct)
					.attr("fill",item.colour)
					.attr("transform","translate("+cx+","+cy+")")
					.on('mouseover',function(){
						d3.select(this)
						.attr("stroke",'#000000');
					})
					.on('mouseout',function(){
						d3.select(this)
						.attr("stroke",'#ffffff');
					})
					.on('mousedown',function(){
						// console.log('mousedown');
					})
					.on('mouseup',function(){
						// console.log('up');
					})
					.on('click',function(){

						var eAng = item.endAngle;
						if(item.endAngle > 15){
							eAng = 0;
							d3.select(self.node).append("svg:circle")
							.attr("cx", cx)
							.attr("cy",cy)
							.attr("r", r)
							.attr("fill",'#ffffff');
						}
						else{
							eAng++;
						}


						d3.select(this).attr("fill",Session.get('col'));
						Meteor.call('changeColourandAngel',item.x,item.y,Session.get('col'),eAng);
						// if(d3.select(this).attr("fill") != Session.get('col') ){
							Meteor.call('getOrigScore',clicks++, function(err,data){
								Session.set('score',data);
							});

						})	
						ct++;
					}
				})

			}

			function colSelTool(node){
				var cnt = 0;
				cols.forEach(function(col){
					d3.select(node).append("svg:rect")
					.attr("x", ((50*cnt)+25))
					.attr("y", 0)
					.attr("width", 40)
					.attr("height", 15)
					.attr("fill",col)
					.attr("class", 'col')
					.attr("stroke",'#000000')
					.attr("stroke-width", 0)
					.on('mouseover',function(){
						d3.select(this).transition()
						.attr("height",45)
						.duration(750)
						.each("end", function() { d3.select(this).transition().attr("height",10).duration(750); });
					})
					.on('mouseout',function(){
						if(d3.select(this).attr("fill") != Session.get('col')){
							d3.select(this).attr("height",15);
						}
					})
					.on('click',function(){
						d3.selectAll('rect').attr("height",15);
						d3.select(this).attr("height",45);
						Session.set('col', col);
					});
					cnt++;
				});
				d3.selectAll('.col').each(function(){
					var tcol = d3.select(this).attr("fill");
					if(tcol == Session.get('col')){d3.select(this).attr("height",45);}
				});
			}




