import _ from 'lodash';
import React from 'react'
import Slider from 'react-slick'
import Dropdown from './../global/dropdown'
import AutocompleteMap from '../global/autocomplete-map'
import EditTags from './../editing/gallery-edit-tags'
import EditStories from './../editing/gallery-edit-stories'
import GalleryEditAssignment from './../editing/gallery-edit-assignment'
import AdminGalleryEditFoot from './admin-gallery-edit-foot'
import BylineEdit from '../editing/byline-edit'
import global from '../../../lib/global'

/**

	Admin Submission Edit component. 
	Delete, Skip, Verify imported

**/

export default class AdminGalleryEdit extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			activeGallery: {},
			editButtonsEnabled: false,
			tags: [],
			stories: [],
			address: null,
			mapLocation: []
		}

		this.resetState = this.resetState.bind(this);

		this.editButtonEnabled = this.editButtonEnabled.bind(this);
		this.handleTwitterBylineChange = this.handleTwitterBylineChange.bind(this);
		this.handleChangeCaption = this.handleChangeCaption.bind(this);
		this.updateTags = this.updateTags.bind(this);
		this.updateRelatedStories = this.updateRelatedStories.bind(this);
		this.updateAssignment = this.updateAssignment.bind(this);
		this.onPlaceChange = this.onPlaceChange.bind(this);
		this.updateGallery = this.updateGallery.bind(this);

		this.revert = this.revert.bind(this);
		this.skip = this.skip.bind(this);
		this.verify = this.verify.bind(this);
		this.remove = this.remove.bind(this);
	}

	componentDidMount() {
		this.editButtonEnabled(false);
		this.resetState();
	}

	componentDidUpdate(prevProps, prevState) {
		if( this.props.activeGalleryType == 'assignment' ||  !this.props.gallery ) { 
			return 
		}
		if( this.props.gallery._id != prevProps.gallery._id ) {
			this.resetState();
		}
	}

	/**
	 * Update state gallery to props gallery
	 */
	resetState() {
			// Reset form
			this.setState({
				activeGallery: _.clone(this.props.gallery, true),
				tags: [],
				stories: [],
				assignment: this.props.gallery.assignment,
				mapLocation: null
			});

			if( this.props.hasActiveGallery )
				this.refs['gallery-caption'].value = this.props.gallery.posts[0].caption;

			// Remove materialize empty input class
			$(this.refs['gallery-byline']).removeClass('empty');
			$(this.refs['gallery-caption']).removeClass('empty');
			$(this.refs['gallery-stories-input']).removeClass('empty');
	}

	/**
	 * Called when byline input fires keyUp event
	 */
	handleTwitterBylineChange(selected) {
		this.refs['gallery-author'].value = selected;
	}

	/**
	 * Called when caption input fires keyUp event
	 */
	handleChangeCaption(e) {
		this.setState({
			editedCaption: e.target.value
		});

		this.refs['gallery-caption'].value = e.target.value;

	}

	/**
	 * Updates specific field of gallery
	 */
	updateGallery(key, value) {
		var gallery = this.state.activeGallery;
		gallery[key] = value;
		this.setState({
			activeGallery: gallery
		});
	}

	/**
	 * Updates state with new tags
	 */
	updateTags(tags) {
	 	var gallery = this.state.activeGallery;
	 		gallery.tags = tags;

	 	this.setState({
	 		activeGallery: gallery
	 	});

	}

	/**
	 * Updates assignment in state
	 */
	
	updateAssignment(assignment) {
		console.log('Update', assignment);
		this.setState({
			assignment: assignment
		})
	}

	/**
	 * Updates state with new stories
	 */
	updateRelatedStories(stories) {
		this.setState({
			stories: stories
		});
	}

	/**
	 * Updates state map location when AutocompleteMap gives new location
	 */
	onPlaceChange(place) {
		this.setState({
			address: place.address,
			mapLocation: place.location
		});
	}

	/**
	 * Changes whether or not edit buttons are enabled
	 * @param  {bool} is
	 */
	editButtonEnabled(is) {
		this.setState({
			editButtonEnabled: !is
		});
	}

	/**
	 * Reverts all changes
	 */
	revert() {
		this.setState({
			activeGallery: _.clone(this.props.gallery, true),
			stories: []
		});

		this.editButtonEnabled(true);

		this.refs['gallery-caption'].value = this.props.gallery.posts[0].caption;

		this.refs['gallery-caption'].className = this.refs['gallery-caption'].className.replace(/\bempty\b/,'');

		if(this.props.hasActiveGallery) {
			this.refs['gallery-caption'].value = this.props.gallery.posts[0].caption;
		}
	}

	/**
	 * Removes callery
	 */
	remove() {
		this.props.remove((err) => {
			if (err)
				return $.snackbar({content: 'Unable to delete gallery'});

			$.snackbar({content: 'Gallery deleted'});
		});
	}

	/**
	 * Skips gallery
	 */
	skip() {
		this.props.skip((err, id) => {
			if (err)
				return $.snackbar({content: 'Unable to skip gallery'});

			$.snackbar({content: 'Gallery skipped! Click to open', timeout: 5000})
				.click(() => {
					window.open('/gallery/' + id);
				});
		});
	}

	/**
	 * Gets all form data and verifies gallery.
	 */
	verify() {

		var gallery = this.state.activeGallery,
			tags = !Array.isArray(gallery.tags) ? [] : gallery.tags,
			assignment = gallery.assignment ? gallery.assignment._id : null,
			posts = gallery.posts.map(p => p._id);
		
		var stories = this.state.stories.map((story) => {
 			if(story.new)
 				return 'NEW=' + JSON.stringify(story);
 			else
 				return story._id;
		});

		var params = {
			id: gallery._id,
			caption: this.refs['gallery-caption'].value,
			posts: posts,
			stories: stories,
			tags: tags,
			assignment: assignment,
			rated: 1
		};

		// Byline
 		var byline = global.getBylineFromComponent(gallery, this.refs.byline);
 		_.extend(params, byline);

		if(this.props.activeGalleryType == 'import') {
			params.address = this.state.address;
			if(this.state.mapLocation) {
				params.lat = this.state.mapLocation.lat;
				params.lon = this.state.mapLocation.lng;
			}
		}
		if (!params.posts || params.posts.length == 0)
			return $.snackbar({content: 'A gallery must have at least one post'});

		if(this.refs['gallery-caption'].length == 0)
			return $.snackbar({content: 'A gallery must have a caption'});

		this.props.verify(params, (err, id) => {
			
			if (err)
				return $.snackbar({content: 'Unable to verify gallery'});

			$.snackbar({ 
				content: 'Gallery verified! Click to open', 
				timeout: 5000 
			}).click(() => {
				var win = window.open('/gallery/' + id, '_blank');
				win.focus();
			});

		});
	}

	render() {
		// If doesn't have active gallery or galleryType is an assignment, don't render anything.
		if(!this.props.hasActiveGallery || 
			this.props.activeGalleryType == 'assignment' || 
			!this.props.activeGalleryType.length ||
			!this.props.gallery || 
			!this.props.gallery.posts) { 
			return <div></div> 
		}

		var activeGallery = this.props.gallery;

		// Map gallery posts into slider elements
		var galleryImages = [];
		if(activeGallery.posts) {
			activeGallery.posts.map((post, i) => {
				if(post.video) {
					galleryImages.push(
						<div key={i}>
							<video 
								data-id={post._id}
								className="admin-video"
								preload="none"
								poster={post.video.replace('/videos', '/images/small').replace('.m3u8', '-thumb00001.jpg')}
								width="100%"
								height="100%"
								controls >
								<source src={post.video.replace('/videos', '/videos/mp4').replace('.m3u8', '.mp4')} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						</div>
					)
				} else {
					galleryImages.push(
						<div key={i}><img className="img-responsive" src={global.formatImg(post.image, 'medium')} data-id={post._id} /></div>
					)
				}
			});
		}

		// If gallery is a submission, 
		if(this.props.activeGalleryType == 'submission') {
			// map polygon points to array.
			if(this.props.gallery.location) {
				var editMapLocation = this.props.gallery.location.coordinates[0].map((coord) => {
					return {
						lat: coord[1],
						lng: coord[0]
					}
				});
			}

			var assignmentEdit = <GalleryEditAssignment 
									assignment={this.state.activeGallery.assignment}
									updateGalleryField={this.updateGallery} />

		} else { // if an import

			// set map location to one from state
			var editMapLocation = this.state.mapLocation;
			
		}

		return (
			<div className="dialog">
				<div className="dialog-body" style={{visibility: this.props.hasActiveGallery ? 'visible' : 'hidden'}}>
					<div className="gallery-images">
						<Slider
							dots={true}
							infinite={false}>
							{galleryImages ? galleryImages : <div></div>}
						</Slider>
					</div>

					<BylineEdit ref="byline" gallery={this.props.gallery} />

					<textarea
						type="text"
						className="form-control floating-label gallery-caption"
						placeholder="Caption"
						onChange={this.props.handleChangeCaption}
						ref="gallery-caption"></textarea>

					{assignmentEdit}

					<EditTags  
						updateTags={this.updateTags}
						tags={this.state.activeGallery.tags} />

					<EditStories
						relatedStories={this.state.stories} 
						updateRelatedStories={this.updateRelatedStories} />

					<div style={{height: '309px'}}>
						<AutocompleteMap
							defaultLocation={activeGallery.posts[0].location ? activeGallery.posts[0].location.address : null}
							location={editMapLocation}
							onPlaceChange={this.onPlaceChange}
							disabled={this.props.activeGalleryType != 'import'}
							hasRadius={false}
							rerender={true} />
					</div>
				</div>
				<AdminGalleryEditFoot
					revert={this.revert}
					verify={this.verify}
					skip={this.skip}
					remove={this.remove}
					enabled={this.props.hasActiveGallery} />
			</div>
		);
	}
}