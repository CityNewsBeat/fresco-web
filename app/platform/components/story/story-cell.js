import React from 'react';
import time from 'app/lib/time';
import UserItem from 'app/platform/components/global/user-item';

/**
 * Single Story Cell, child of StoryList
 */
export default class StoryCell extends React.Component {

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		window.location = '/story/' + this.props.story.id;
	}

	render() {
		const {story} = this.props;
		const timestamp = story.updated_at || story.created_at;
		const timeString = time.formatTime(timestamp);
		const storyInfo = { videos: 0, images: 0, caption: story.caption };
		return(
			<div>
				<section className="story-info">
					<UserItem user={ story.user }
					 	metaType="story"
					 	storyInfo={ storyInfo } />
					<div className="download-story">Download New</div>
				</section>
				<section className="story-thumbnails">
					<div>
						<FrescoImage
							size="50"
							src="http://i1.kym-cdn.com/photos/images/facebook/000/632/652/6ca.jpg"/>
						<p className="post-location">New York, NY</p>
						<div className="circle blue"></div>
						<p className="post-time">5 minutes ago</p>
					</div>
					<div>
						<FrescoImage
							size="50"
							src="http://i1.kym-cdn.com/photos/images/facebook/000/632/652/6ca.jpg"/>
						<p className="post-location">New York, NY</p>
						<p className="post-time">5 minutes ago</p>
					</div>
				</section>
			</div>
		);
	}
}

// <div className='col-xs-6 col-md-3 tile story' onClick={this.onClick}>
// 	<div className="tile-body">
// 		<div className="tile__frame"></div>
//
// 		<div className="hover">
// 			<p className="md-type-body1">{story.caption}</p>
// 		</div>
//
// 		<StoryCellImages thumbnails={story.thumbnails} />
// 	</div>
// 	<div className="tile-foot">
// 		<div className="hover">
// 			<a href={'/story/'+ story.id} className="md-type-body2">See all</a>
//
// 			<span className="right-info">
// 					{story.gallery_count + ' ' + (story.gallery_count == 1 ? 'gallery' : 'galleries')}
// 			</span>
// 		</div>
//
// 		<div>
// 			<div>
// 				<span className="md-type-body2">{this.props.story.title}</span>
//
// 				<span className="md-type-caption timestring" data-timestamp={timestamp}>{timeString}</span>
// 			</div>
// 		</div>
// 	</div>
// </div>

/**
 * Post Cell Images
 */
class StoryCellImages extends React.Component {

	render() {

		if (!this.props.thumbnails || this.props.thumbnails.length == 0){
			return (
				<div className="flex-row"></div>
			);
		}
		else if (this.props.thumbnails.length == 1){
			return(
				<div className="flex-row">
                    <div className="img">
                        <FrescoImage src={this.props.thumbnails[0].image} size="small" />
                    </div>
				</div>
			);
		}
		else if(this.props.thumbnails.length < 5){

			return(
				<div className="flex-row">
                    <div className="img">
                        <FrescoImage src={this.props.thumbnails[0].image} size="small" />
                    </div>
                    <div className="img">
                        <FrescoImage src={this.props.thumbnails[1].image} size="small" />
                    </div>
				</div>
			);

		}
		else if(this.props.thumbnails.length >= 5 && this.props.thumbnails.length < 8){
			return(
				<div className="flex-row">
					<div className="flex-col">
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[0].image} size="small" />
                        </div>
					</div>
					<div className="flex-col">
						<div className="flex-row">
                            <div className="img">
                                <FrescoImage src={this.props.thumbnails[0].image} size="small" />
                            </div>
                            <div className="img">
                                <FrescoImage src={this.props.thumbnails[1].image} size="small" />
                            </div>
						</div>
						<div className="flex-row">
                            <div className="img">
                                <FrescoImage src={this.props.thumbnails[3].image} size="small" />
                            </div>
                            <div className="img">
                                <FrescoImage src={this.props.thumbnails[3].image} size="small" />
                            </div>
						</div>
					</div>
				</div>
			);
		}
        else if(this.props.thumbnails.length >= 8){
            return(
                <div className="flex-col">
                    <div className="flex-row">
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[0].image} size="small" />
                        </div>
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[1].image} size="small" />
                        </div>
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[2].image} size="small" />
                        </div>
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[3].image} size="small" />
                        </div>
                    </div>
                    <div className="flex-row">
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[0].image} size="small" />
                        </div>
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[2].image} size="small" />
                        </div>
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[3].image} size="small" />
                        </div>
                        <div className="img">
                            <FrescoImage src={this.props.thumbnails[4].image} size="small" />
                        </div>
                    </div>
                </div>
            );
        }
    }
}