Meteor.subscribe("pieces");

Template.scores.helpers({
	pieces : function(){
		return Pieces.find({});
	}
});