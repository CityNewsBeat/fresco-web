import _ from 'lodash'
import React from 'react'
import GalleryEditBody from './gallery-edit-body.js'
import GalleryEditFoot from './gallery-edit-foot.js'
import global from '../../../lib/global'

/** //

Description : Component for adding gallery editing to the current view

// **/

/**
 * Gallery Edit Parent Object
 */
export default class GalleryEdit extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			gallery: null,
			caption: '',
			posts: null,
			visibilityChanged: false,
			deletePosts: []
		}

		this.onPlaceChange 			= this.onPlaceChange.bind(this);
		this.toggleDeletePost 		= this.toggleDeletePost.bind(this);
		this.updateCaption 			= this.updateCaption.bind(this);
		this.updateRelatedStories 	= this.updateRelatedStories.bind(this);
		this.updateArticles 		= this.updateArticles.bind(this);
		this.updateTags 			= this.updateTags.bind(this);
		this.updateVisibility 		= this.updateVisibility.bind(this);

		this.revertGallery 			= this.revertGallery.bind(this);
		this.saveGallery 			= this.saveGallery.bind(this);
		this.hide		 			= this.hide.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// If props has a gallery, and GalleryEdit does not currently have a gallery or the galleries are not the same
		if (nextProps.gallery &&
			(!this.state.gallery || (this.state.gallery._id != nextProps.gallery._id))) {
			this.setState({
				gallery: _.clone(nextProps.gallery, true),
				posts: nextProps.gallery.posts.map(p => p._id)
			});	
			$.material.init();
		}
	}

	componentDidMount() {
		$.material.init();
	}

	onPlaceChange(place) {
		var gallery = this.state.gallery;
			gallery.location = place.location;
			gallery.address = place.address;

		this.setState({
			gallery: gallery
		});
	}

	updateCaption(e) {
		var gallery = this.state.gallery;
			gallery.caption = e.target.value;

		this.setState({
			gallery: gallery
		});

	}

	updateRelatedStories(stories) {
		var gallery = this.state.gallery;
			gallery.related_stories = stories;

		this.setState({
			gallery: gallery
		});
	}

	updateArticles(articles) {
		var gallery = this.state.gallery;
			gallery.articles = articles;

		this.setState({
			gallery: gallery
		});
	}

	updateTags(tags) {
		var gallery = this.state.gallery;
			gallery.tags = tags;

		this.setState({
			gallery: gallery
		});

	}

	toggleDeletePost(post) {
		var existingPostIDs = this.state.posts;
		var index = this.state.deletePosts.indexOf(post);

		if(index == -1) {
			this.setState({
				deletePosts: this.state.deletePosts.concat(post)
			});
		} else {
			var posts = _.clone(this.state.deletePosts, true);
			posts.splice(index, 1);
			this.setState({
				deletePosts: posts
			});
		}
	}

 	updateVisibility(visibility) {
 		var gallery = this.state.gallery;
 			gallery.visibility = visibility;

 		//Update new gallery
 		this.setState({ 
 			gallery: gallery,
 			visibilityChanged: true
 		});
 	}

 	revertGallery() {
 		// Set gallery back to original
 		this.setState({
 			gallery: _.clone(this.props.gallery, true),
 			posts: this.props.gallery.posts.map(p => p._id),
 			deletePosts: []
 		})
 	}

	//Returns centroid for passed polygon
	getCentroid(polygon) {
		var path, lat = 0, lng = 0;
		
		if (Array.isArray(polygon)) {
			var newPolygon = new google.maps.Polygon({paths: polygon});
			path = newPolygon.getPath();
		} else {
			path = polygon.getPath();
		}

		for (var i = 0; i < path.getLength() - 1; ++i) {
			lat += path.getAt(i).lat();
			lng += path.getAt(i).lng();
		}

		lat /= path.getLength() - 1;
		lng /= path.getLength() - 1;
		return new google.maps.LatLng(lat, lng);

	}

 	saveGallery() {
 		var self 	= this,
	 		gallery = _.clone(this.state.gallery, true),
 			files 	= gallery.files ? gallery.files : [],
 			caption = gallery.caption,
 			tags 	= gallery.tags, 
 			bylineExists = document.getElementById('byline-edit') !== null;

 		//Generate post ids for update
 		var posts = _.difference(this.state.posts, this.state.deletePosts);

		if(posts.length + files.length == 0 )
			return $.snackbar({content:"Galleries must have at least 1 post"});

 		//Generate stories for update
 		var stories = [];
 		gallery.related_stories.map((story) => {

 			if(story.new) {
 				stories.push('NEW=' + JSON.stringify(story));
 			}
 			else {
 				stories.push(story._id);
 			}

 		});

 		//Generate articles for update
 		var articles = [];
 		gallery.articles.map((article) => {

 			if(article.new) {
 				articles.push('NEW=' + JSON.stringify(article));
 			}
 			else {
 				articles.push(article._id);
 			}

 		});	

 		//Configure params for the updated gallery
 		var params = {
 			id: gallery._id,
 			caption: caption,
 			posts: posts,
 			tags: tags,
 			stories: stories,
 			articles: articles
 		};

 		//Check state var to see if the visibility has changed
 		if(this.state.visibilityChanged){
 			params.visibility = gallery.visibility;
 		}

 		//Configure the byline's other origin
 		var byline = global.getBylineFromComponent(gallery, this.refs.galleryEditBody.refs.byline);
 		_.extend(params, byline);

 		//Check if imported and there is a location to add a location to the save request
 		if (gallery.imported && gallery.location) {
 			if(gallery.location.lat && gallery.location.lng) {
	 			params.lat = gallery.location.lat;
	 			params.lon = gallery.location.lng;
 			} else {
 				var coord = this.getCentroid(gallery.location.coordinates[0].map((coord) => {
			 					return {
			 						lat: coord[1],
			 						lng: coord[0]
			 					}
			 				})),
					lat = coord.lat(),
					lon = coord.lng();
				params.lat = lat;
				params.lon = lon;
 			}
 			if (gallery.address) {
 				params.address = gallery.address;
 			}
 		}

 		if (files.length) {
 			// Upload files then update gallery
 			uploadNewFiles();

 		} else {
 			// Or just update gallery if no files present
 			updateGallery();
 		}
 		function uploadNewFiles() {
			var data 	= new FormData();

 			for (var i = 0; i < files.length; i++) {
 				data.append(i, files[i]);
 			}
			
			data.append('gallery', gallery._id);

			$.ajax({
				url: '/scripts/gallery/addpost',
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				cache: false,
				dataType: 'json',
				success: (result, status, xhr) => {
					updateGallery(result.data);
				},
				error: (xhr, status, error) => {
					$.snackbar({content: global.resolveError(error)});
				},
				xhr: () => {
					var xhr = $.ajaxSettings.xhr();
					xhr.upload.onprogress = function(evt) {
					}

					xhr.upload.onload = function() { }

					return xhr;
				}
			}); 			
 		}

 		function updateGallery(newPosts) {

 			if (typeof newPosts !== 'undefined') {
				params.posts = _.difference(newPosts.posts, self.state.deletePosts);
 			}

 			$.ajax("/scripts/gallery/update", {
	 			method: 'post',
	 			contentType: "application/json",
	 			data: JSON.stringify(params),
	 			success: (result) => {
	 				if(result.err) {
	 					$.snackbar({
	 						content: global.resolveError(result.err, "There was an error saving the gallery.")
	 					});
	 				}
	 				else {
	 					location.reload();
	 				}
	 			}

	 		});
 		}
 		
 	}

 	hide() {
 		this.setState({
 			gallery: null
 		});
 		this.props.toggle();
 	}

	render() {
		var editBody = '';

		if(this.state.gallery) {
			editBody = <div className="col-xs-12 col-lg-12 edit-new dialog">
		 					<div className="dialog-head">
		 						<span className="md-type-title">Edit Gallery</span>
		 						<span className="mdi mdi-close pull-right icon toggle-edit toggler" onClick={this.hide}></span>
		 					</div>
		 					
		 					<GalleryEditBody 
			 					ref="galleryEditBody"
		 						gallery={this.state.gallery}
		 						
		 						onPlaceChange={this.onPlaceChange}
		 						updateCaption={this.updateCaption}
								updateRelatedStories={this.updateRelatedStories}
								updateVisibility={this.updateVisibility}
								updateArticles={this.updateArticles}
								updateTags={this.updateTags}
								updateGallery={this.updateGallery}
		 						deletePosts={this.state.deletePosts}
		 						toggleDeletePost={this.toggleDeletePost} />
		 					
		 					<GalleryEditFoot 
		 						gallery={this.state.gallery}
		 						revert={this.revertGallery}
		 						saveGallery={this.saveGallery}
		 						updateGallery={this.updateGallery}
		 						hide={this.hide} />
		 				</div>
		}

		var toggled = this.props.toggled ? 'toggled' : '';

 		return (
 			<div>
	 			<div className={'dim toggle-edit ' + toggled}></div>
	 			<div className={"edit panel panel-default toggle-edit gedit " + toggled}>
	 				{editBody}
	 			</div>
 			</div>
 		);
 	}

}

GalleryEdit.defaultProps = {
	gallery: null,
	posts: [],
	toggled: false,
	updateGallery: function(){},
	toggle: function () { console.log('GalleryEdit missing toggle implementation'); }
}
