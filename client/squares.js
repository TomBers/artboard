Meteor.subscribe("items");
Meteor.subscribe("userStatus");

var scale = 50;
var r = 75;
var clicks = 0;
Session.set('col', '#0DE4EF');
// Accounts.ui.config({
//   passwordSignupFields: "USERNAME_ONLY"
// });

var cols = ['#0DE4EF','#EAEB99','#F0C34B','#FE842C','#ffffff','#57354A','#D67473','#F5A368','#6AA59B','#597290','#DF7353','#000000','#0075CF','#94C15A','#CC9F22'];


if (Meteor.isClient) {

	canvas = null;
	ctx    = null;
	Meteor.startup(function(){	
		// Meteor.call('getOrigScore',clicks, function(err,data){
			Session.set('score',0);
		// });
		
		
			});

		Template.sqcanvas.helpers({
			getDat: function () {
				return Items.find({},{sort: {x: 1,y:1}});
			}	
		});
	

		Template.sqcanvas.rendered = function(){

			var self = this;
			self.node = self.find("svg");
			d3.select(self.node).attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});
			var height = 500; 
			if (! self.handle) {
				self.handle = Deps.autorun(function () {

					var itms = Items.find().fetch();
					itms.forEach(function(item){
						var cx = (item.x * r) + (item.x * 10) + 2;
						var cy = (item.y * r) + r + (item.y * 10);
						if(!isNaN(cx) && !isNaN(cy)){						
							d3.select(self.node).append("svg:rect")
							.attr("x", cx)
							.attr("y",cy)
							.attr("width",  r)
							.attr("height", r)
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







