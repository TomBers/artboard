Meteor.subscribe("items");
Meteor.subscribe("userStatus");

var scale = 90;
var r = 45;
var clicks = 0;
Session.set('col', '#0DE4EF');
var possA = [Math.PI/2,Math.PI/2,Math.PI,3*(2*Math.PI)/4,2*Math.PI];

// Accounts.ui.config({
//   passwordSignupFields: "USERNAME_ONLY"
// });

var cols = ['#0DE4EF','#EAEB99','#F0C34B','#FE842C','#ffffff','#57354A','#D67473','#F5A368','#6AA59B','#597290','#DF7353','#000000','#0075CF','#94C15A','#CC9F22'];


if (Meteor.isClient) {

	canvas = null;
	ctx    = null;
	Meteor.startup(function(){	
			Session.set('score',0);
	
			});

		Template.arccanvas.helpers({
			getDat: function () {
				return Items.find({},{sort: {x: 1,y:1}});
			}	
		});
	

		Template.arccanvas.rendered = function(){

			var self = this;
			self.node = self.find("svg");
			d3.select(self.node).attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});
			var height = 500; 
			if (! self.handle) {
				self.handle = Deps.autorun(function () {

					var itms = Items.find().fetch();
					var ct = 0;
					itms.forEach(function(item){
						var cx = (item.x * scale) + r;
						var cy =  height - ((item.y * scale)+ r);
						
						
						var ea = possA[item.endAngle];
						
						
						var arc = d3.svg.arc()
						    .innerRadius(r-30)
						    .outerRadius(r)
						    .startAngle(0) //converting from degs to radians
						    .endAngle(ea);
						
						if(!isNaN(cx) && !isNaN(cy)){						
							d3.select(self.node).append("path")
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
								if(item.endAngle > 3){
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
									if(d3.select(this).attr("fill") != Session.get('col') ){
									Meteor.call('getOrigScore',clicks++, function(err,data){
										Session.set('score',data);
									});
									
									// d3.selectAll('path').remove();
								}
								
								
								
							})	
							ct++;
						}
					})
					var cnt = 0;
					cols.forEach(function(col){
						d3.select(self.node).append("svg:rect")
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

				});
			};
		};

	}







