Router.configure({
layoutTemplate: 'layout'
});

Router.map(function() {
	
	this.route('/', {
		path: '/',
		template: 'artboard'
	 });
	this.route('/about', {
		path: '/about',
		template: 'about'
	 });
});