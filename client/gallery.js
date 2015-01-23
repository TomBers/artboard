Meteor.subscribe("pieces");

Template.gallery.helpers({
	pieces : function(){
		return Pieces.find({});
	}
});