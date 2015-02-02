Meteor.methods({
	changeColour: function(x,y,col,ang) {
		if(typeof ang === "undefined") {ang = 0;}
		Items.update({x:x,y:y},{x:x,y:y,colour:col,endAngle:ang},{upsert:true});
	},
	comment: function(comm,usr) {
		if(typeof comm === "undefined") {comm = '';}
		if(typeof usr === "undefined" || usr == null) {usr = 'Anon';}
		Comments.insert({usr:usr,comm:comm,createdAt: new Date()});
	},

	clear: function() {
		for(var x=0; x<9 ; x++){
			for(var y=0;y<6;y++){
				Items.update({x:x,y:y},{x:x,y:y,colour:'#ffffff',endAngle:0},{upsert:true});
			}
		}
	},
	getOrigScore: function(c) {
		max = Math.min((2*c + 10),100);
		min = max - Math.floor(max*0.2);
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	saveImage : function(img,urs,orig){
		Pieces.insert({
		createdBy: Meteor.userId(),
		  createdAt: new Date(),
		  img: img,
		  users: urs,
		  orig: orig
		});
	}
});
