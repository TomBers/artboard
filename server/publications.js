Meteor.publish("items", function() {
  return Items.find();
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find();
});

Meteor.publish("pieces", function() {
  return Pieces.find();
});

Meteor.publish("comments", function() {
  return Comments.find();
});
