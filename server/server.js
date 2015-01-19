Meteor.methods({
	changeColour: function(x,y,col) {

		Items.update({x:x,y:y},{x:x,y:y,colour:col},{upsert:true});
	},
	clear: function() {
		for(var x=0; x<9 ; x++){
			for(var y=0;y<5;y++){
				Items.update({x:x,y:y},{x:x,y:y,colour:'#ffffff'},{upsert:true});
			}
		}
	}
});
