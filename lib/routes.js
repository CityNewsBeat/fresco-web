/**
 * Site route management
 *
 *  `public` routes, anything in here will be on every public facing page
 *  
 *  Any other key defines a separate part of the site i.e. `platform` is any page inside the platform
 *  
 */

module.exports = {

	public: [
		'index',
		'gallery'
	],

	modals: [
		'account',
		'contact',
		'hsa',
		'legal',
		'press',
		'forgot',
		'team'
	],

	scripts: [
		'article',
		'assignment',
		'gallery',
		'outlet',
		'post',
		'story',
		'user',
		'contact'
	],

	platform: [
		'highlights',
		'archive',
		'dispatch',
		'assignment',
		'outlet',
		'story',
		'user',
		'post',
		'purchases',
		'search',
		'admin'
	]

}