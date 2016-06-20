import React from 'react';
import FrescoBackgroundImage from './fresco-background-image'
import global from '../../../lib/global'
import R from 'ramda';

/**
 * Single Gallery Cell, child of GalleryList
 */


export default class GalleryCell extends React.Component {
	render() {
        const { half, gallery } = this.props;

		const timestamp = gallery.time_created;
        const timeString = global.formatTime(gallery.time_created);
        const size = half ? 'col-xs-6 col-md-3' : 'col-xs-12 col-md-6';
        const stories = (gallery.fooz || []).slice(0, 2);
        const galleryCellStories = stories.length > 0 ? <GalleryCellStories stories={stories} /> : '';


        const postWithAddress = gallery.posts.find(p => p.address);
        const location = postWithAddress ? postWithAddress.address : 'No Location';

		return (
			<div className={size + " tile story gallery"}>
				<div className="frame"></div>

				<div className="tile-body">
					<div className="hover">
						<a href={"/gallery/" + this.props.gallery._id}>
							<p className="md-type-body1">{this.props.gallery.caption}</p>
						</a>
						{galleryCellStories}
					</div>

					<GalleryCellImages posts={this.props.gallery.posts} />
				</div>

				<div className="tile-foot">
					<div className="hover">
						<a href={"/gallery/" + this.props.gallery._id} className="md-type-body2">See all</a>

						<GalleryCellStats stats={this.props.gallery.stats} />
					</div>

					<div>
						<div className="ellipses">
							<span className="md-type-body2">{location}</span>

							<span
								className="md-type-caption timestring"
								data-timestamp={this.props.gallery.time_created}>{timeString}</span>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

GalleryCell.defaultProps = {
	//Size of the cell
	half: false
}

/**
 * Gallery Cell Stories List
 */

class GalleryCellStories extends React.Component {

	render() {

		var stories = this.props.stories.map((story, i) => {
	      	return (
	        	<li key={i}>
		        	<a href={"/story/" + story._id}>{story.title}</a>
		        </li>
	      	)
  		})

		return (
			<ul className="md-type-body2 story-list cell-stories">{stories}</ul>
		);
	}

}

/**
 * Gallery Cell Images
 */

class GalleryCellImages extends React.Component {

	render() {

		if (!this.props.posts || this.props.posts.length == 0){

			return (
				<div className="flex-row"></div>
			);

		}
		else if (this.props.posts.length == 1){

			return (
				<div className="flex-row">
					<FrescoBackgroundImage image={this.props.posts[0].image} size="medium" />
				</div>
			);
		}
		else if(this.props.posts.length < 5){

			return (
				<div className="flex-row">
					<FrescoBackgroundImage image={this.props.posts[0].image} size="small" />
					<FrescoBackgroundImage image={this.props.posts[1].image} size="small" />
				</div>
			);
		}
		else if(this.props.posts.length >= 5 && this.props.posts.length < 8){

			return (
				<div className="flex-row">
					<div className="flex-col">
						<FrescoBackgroundImage image={this.props.posts[0].image} size="small" />
					</div>
					<div className="flex-col">
						<div className="flex-row">
							<FrescoBackgroundImage image={this.props.posts[1].image} size="small" />
							<FrescoBackgroundImage image={this.props.posts[2].image} size="small" />
						</div>
						<div className="flex-row">
							<FrescoBackgroundImage image={this.props.posts[3].image} size="small" />
							<FrescoBackgroundImage image={this.props.posts[4].image} size="small" />
						</div>
					</div>
				</div>
			);

		}
		else if(this.props.posts.length >= 8){

			return (
				<div className="flex-col">
					<div className="flex-row">
						<FrescoBackgroundImage image={this.props.posts[0].image} size="small" />
						<FrescoBackgroundImage image={this.props.posts[1].image} size="small" />
						<FrescoBackgroundImage image={this.props.posts[4].image} size="small" />
						<FrescoBackgroundImage image={this.props.posts[3].image} size="small" />
					</div>
					<div className="flex-row">
						<FrescoBackgroundImage image={this.props.posts[4].image} size="small" />
						<FrescoBackgroundImage image={this.props.posts[5].image} size="small" />
						<FrescoBackgroundImage image={this.props.posts[6].image} size="small" />
						<FrescoBackgroundImage image={this.props.posts[7].image} size="small" />
					</div>
				</div>
			);
		}
	}

}

class GalleryCellStats extends React.Component {
	render() {
		var stats = this.props.stats,
			statString = '';

		if(stats.photos > 0)
			statString = stats.photos + ' Photo' + (stats.photos == 1 ? '' : 's');

		if(stats.videos > 0){
			if(statString.length > 0)
				statString += ' • ';

			statString +=  stats.videos + ' Video' + (stats.videos == 1 ? '' : 's');
		}

		return <span className="right-info">{statString}</span>;
	}
}
