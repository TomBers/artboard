Router.configure({
layoutTemplate: 'layout',
waitOn: function() { return Meteor.subscribe('items'); },
});

Router.map(function() {
	
	this.route('/', {
		path: '/',
		template: 'home'
	 });
	this.route('/circles', {
		path: '/circles',
		template: 'artboard',
	 });
	this.route('/squares', {
		path: '/squares',
		template: 'artboard',
	 });
	this.route('/arcs', {
		path: '/arcs',
		template: 'artboard',
	 });
	this.route('/about', {
		path: '/about',
		template: 'about'
	 });
	this.route('/gallery', {
		path: '/gallery',
		template: 'gallery'
	 });
	this.route('/scores', {
		path: '/scores',
		template: 'scores'
	 });
});