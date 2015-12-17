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
			gallery: _.clone(this.props.gallery, true),
			toggled: false
		}

		this.onPlaceChange = this.onPlaceChange.bind(this);

		this.updateGallery = this.updateGallery.bind(this);
		this.revertGallery = this.revertGallery.bind(this);
		this.saveGallery = this.saveGallery.bind(this);
		this.hide = this.hide.bind(this);
	}

	componentWillReceiveProps(nextProps) {
	    //Check for optional prop toggle to toggle visiblity of modal
		if(nextProps.toggled){

			//If next props is sending toggled and the modal is 
			//already toggled from the previous props, don't do anything
			if(this.props.toggled && nextProps.toggled) return

			this.setState({
				toggled: nextProps.toggled
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		//Compare the ID instead? #nolan
		if(JSON.stringify(prevProps.gallery) != JSON.stringify(this.props.gallery)) {
			this.setState({
				gallery: _.clone(this.props.gallery, true)
			});
		}
	}

	hide() {
		this.setState({
			toggled: false
		});
	}

	onPlaceChange(place) {
		var gallery = this.state.gallery;
		gallery.location = place.location;
		gallery.address = place.address;

		this.setState({
			gallery: gallery
		});
	}

 	updateGallery(gallery) {
 		//Update new gallery
 		this.setState({ 
 			gallery: gallery 
 		});
 	}

 	revertGallery() {
 		// Set gallery back to original
 		this.setState({
 			gallery: _.clone(this.props.gallery, true)
 		})
 	}

 	saveGallery() {
 		var gallery = _.clone(this.state.gallery, true),
 			files = gallery.files ? gallery.files : [],
 			caption = gallery.caption,
 			tags = gallery.tags;	

 		//Generate post ids for update
 		var posts = [];
 		for(var p in gallery.posts) {
 			posts.push(gallery.posts[p]._id);
 		}

		if(gallery.posts.length + files.length == 0 )
			return $.snackbar({content:"Galleries must have at least 1 post"});

 		//Generate stories for update
 		var stories = [];
 		gallery.related_stories.map((story) => {

 			if(story.new){
 				stories.push('NEW=' + JSON.stringify(story));
 			}
 			else
 				stories.push(story._id);

 		});

 		//Generate articles for update
 		var articles = [];
 		gallery.articles.map((article) => {

 			if(article.new){
 				articles.push('NEW=' + JSON.stringify(article));
 			}
 			else
 				articles.push(article._id);

 		});	

 		//Configure params for the updated gallery
 		var params = {
 			id: gallery._id,
 			caption: caption,
 			posts: posts,
 			tags: tags,
 			visibility: 1,
 			stories: stories,
 			articles: articles
 		};

 		//Configure the byline's other origin
 		//From twitter
 		if(gallery.posts[0].meta && gallery.posts[0].meta.twitter) {

 			params.other_origin_affiliation =  document.getElementById('gallery-edit-affiliation').value;

 		}
 		//Imported
 		else if(!gallery.posts[0].owner && gallery.posts[0].curator) {

 			params.other_origin_name = document.getElementById('gallery-edit-name').value;
 			params.other_origin_affiliation =  document.getElementById('gallery-edit-affiliation').value;

 		}

 		if (gallery.imported) {
 			params.lat = gallery.location.lat;
 			params.lon = gallery.location.lng;
 			if (gallery.address) {
 				params.address = gallery.address;
 			}
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
 				else{
 					$.snackbar({
 						content: "Gallery successfully saved!"
 					});
 					this.hide();
 				}
 			}

 		});
 	}

	render() {

		if(!this.state.gallery) return (<div></div>);

		var toggled = this.state.toggled ? 'toggled' : '';

 		return (
 			<div>
	 			<div className={'dim toggle-edit ' + toggled}>
	 			</div>
	 			<div className={"edit panel panel-default toggle-edit gedit " + toggled}>
	 				<div className="col-xs-12 col-lg-12 edit-new dialog">
	 					<div className="dialog-head">
	 						<span className="md-type-title">Edit Gallery</span>
	 						<span className="mdi mdi-close pull-right icon toggle-edit toggler" onClick={this.hide}></span>
	 					</div>
	 					
	 					<GalleryEditBody 
	 						gallery={this.state.gallery}
	 						updateGallery={this.updateGallery}
	 						onPlaceChange={this.onPlaceChange} />
	 					
	 					<GalleryEditFoot 
	 						gallery={this.state.gallery}
	 						revert={this.revertGallery}
	 						saveGallery={this.saveGallery}
	 						updateGallery={this.updateGallery}
	 						hide={this.hide} />
	 				</div>
	 			</div>
 			</div>
 		);
 	}

}

GalleryEdit.defaultProps = {
	gallery: null
}
