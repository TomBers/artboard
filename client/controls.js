Meteor.subscribe("userStatus");
Meteor.subscribe("comments");
var onlineUsrs = [];

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

Template.control.helpers({
	score : function(){
		return Session.get('score');
	},
	online : function(){
		return Meteor.users.find({ "status.online": true });
	},
	comments : function(){
		return Comments.find({},{sort: {createdAt:"asc"}});
	}
});


Template.control.events({
	'click #chat' :function(){
		var usr = 'Anon';
		// console.log(Meteor.user());
		try{
		 usr = Meteor.user().username || Meteor.user().profile.name;
	}catch(e){

	}
		Meteor.call('comment',$('#chatTxt').val(),usr, function(err,data){
			$('#chatTxt').val('');
		});

	},
	'click #clear' :function(){
		d3.select('svg').append("svg:rect")
		.attr("x", 0)
		.attr("y",0)
		.attr("width",  2000)
		.attr("height", 2000)
		.attr("fill", '#ffffff');
		Meteor.call('clear');
		Session.set('score',0);
		clicks = 0;
	},
	'click #download' :function(){

		d3.selectAll('.col').remove();

		var html = d3.select("svg")
		.node().parentNode.innerHTML;

		//console.log(html);
		var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
		var img = '<img src="'+imgsrc+'">';
		d3.select("#svgdataurl").html(img);


		var canvas = document.querySelector("canvas");
		canvas.width = 2000;
		canvas.height = 1000;
		context = canvas.getContext("2d");
		context.fillStyle = "#ffffff";
		context.fillRect(0,0,2000,1000);
		var image = new Image;
		image.src = imgsrc;
		image.onload = function() {
			context.drawImage(image, 0, 0,2000,1000);

			var canvasdata = canvas.toDataURL("image/png");

			var pngimg = '<img src="'+canvasdata+'">';
			d3.select("#pngdataurl").html(pngimg);

			var a = document.createElement("a");
			a.download = "shapes.png";
			a.href = canvasdata;
			a.click();

		};
	},
	'click #save' :function(){

		d3.selectAll('.col').remove();

		var html = d3.select("svg")
		.node().parentNode.innerHTML;

		//console.log(html);
		var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

		var img = '<img src="'+imgsrc+'">';
		d3.select("#svgdataurl").html(img);


		var canvas = document.querySelector("canvas");
		canvas.width = 2000;
		canvas.height = 1000;
		context = canvas.getContext("2d");
		context.fillStyle = "#ffffff";
		context.fillRect(0,0,2000,1000);
		var image = new Image;
		image.src = imgsrc;
		image.onload = function() {
			context.drawImage(image, 0, 0,2000,1000);

			var canvasdata = canvas.toDataURL("image/png");
			var contributors = Meteor.users.find({ "status.online": true }).fetch();
			Meteor.call('saveImage',canvasdata,contributors,Session.get('score'), function(err,data){
				alert('Image Saved in Gallery');
			});

		};
	}

});
