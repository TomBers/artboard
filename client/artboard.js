Meteor.subscribe("items");
Meteor.subscribe("userStatus");

var onlineUsrs = [];
var scale = 90;
var r = 45;
var clicks = 0;
Session.set('col', '#0DE4EF');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

var cols = ['#0DE4EF','#EAEB99','#F0C34B','#FE842C','#ffffff','#57354A','#D67473','#F5A368','#6AA59B','#597290','#DF7353','#000000','#0075CF','#94C15A','#CC9F22'];


if (Meteor.isClient) {

	canvas = null;
	ctx    = null;
	Meteor.startup(function(){	
		Meteor.call('getOrigScore',clicks, function(err,data){
			Session.set('score',data);
		});
		
		
			});

		Template.canvas.helpers({
			getDat: function () {
				return Items.find({},{sort: {x: 1,y:1}});
			}	
		});

		Template.control.helpers({
			score : function(){
				return Session.get('score');
				}
		});
		
		Template.allUsers.helpers({
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

					var itms = Items.find().fetch();
					itms.forEach(function(item){
						var cx = (item.x * scale) + r;
						var cy =  height - ((item.y * scale)+ r);
						if(!isNaN(cx) && !isNaN(cy)){
							d3.select(self.node).append("svg:circle")
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
					})
					var cnt = 0;
					cols.forEach(function(col){
						d3.select(self.node).append("svg:rect")
						.attr("x", ((50*cnt)+25))
						.attr("y", 0)
						.attr("width", 40)
						.attr("height", 15)
						.attr("fill",col)
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
					d3.selectAll('rect').each(function(){
						var tcol = d3.select(this).attr("fill");
						if(tcol == Session.get('col')){d3.select(this).attr("height",45);}
					});

				});
			};
		};

	}

	Template.control.events({
		'click #user' :function(){
		console.log(Meteor.user());
		},
		'click #clear' :function(){
			d3.selectAll('circle').attr("fill",'#ffffff');
			Meteor.call('clear');
			Session.set('score',0);
			clicks = 0;
		},
			'click #download' :function(){
				
				d3.selectAll('rect').remove();
				
				var html = d3.select("svg")
			        .node().parentNode.innerHTML;

			  //console.log(html);
			  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
			  var img = '<img src="'+imgsrc+'">'; 
			  d3.select("#svgdataurl").html(img);


			  var canvas = document.querySelector("canvas");
			   canvas.width = 1630;
			   canvas.height = 1000;
				  context = canvas.getContext("2d");
				  context.fillStyle = "#ffffff";
				context.fillRect(0,0,1630,1000);
			  var image = new Image;
			  image.src = imgsrc;
			  image.onload = function() {
				  context.drawImage(image, 0, 0,2000,1000);

				  var canvasdata = canvas.toDataURL("image/png");

				  var pngimg = '<img src="'+canvasdata+'">'; 
			  	  d3.select("#pngdataurl").html(pngimg);

				  var a = document.createElement("a");
				  a.download = "sample.png";
				  a.href = canvasdata;
				  a.click();
				
				 location.reload();
			  };
			},
			'click #save' :function(){
				
				d3.selectAll('rect').remove();
				
				var html = d3.select("svg")
			        .node().parentNode.innerHTML;

			  //console.log(html);
			  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
			  var img = '<img src="'+imgsrc+'">'; 
			  d3.select("#svgdataurl").html(img);


			  var canvas = document.querySelector("canvas");
			   canvas.width = 1630;
			   canvas.height = 1000;
				  context = canvas.getContext("2d");
				  context.fillStyle = "#ffffff";
				context.fillRect(0,0,1630,1000);
			  var image = new Image;
			  image.src = imgsrc;
			  image.onload = function() {
				  context.drawImage(image, 0, 0,2000,1000);

				  var canvasdata = canvas.toDataURL("image/png");
				 var contributors = Meteor.users.find({ "status.online": true }).fetch();	
				  Meteor.call('saveImage',canvasdata,contributors, function(err,data){
					alert('Image Saved in Gallery');
					});
				  
			  };
			}

	});






