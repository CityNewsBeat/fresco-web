import React from 'react'
import utils from 'utils'

/**
 * Single Edit-Post Element
 * @description Post element that is wrapped inside container slick usually
 */

export default class EditPost extends React.Component {

	constructor(props) {
		super(props);
	}

	//Add source after rendering for local files
	componentDidMount() {

		if(!this.props.file) return;
	
	}

	render() {

		//Check if we're reading from a file, and we have the file's source
		if(this.props.file && this.props.source) {

			if (this.props.file.type.indexOf('video') !== -1) { //video

				return (
					<video width="100%" height="100%" data-id={this.props.post.id} controls>
						<source 
							id={this.props.file.lastModified}
							src={this.props.source}
							type='video/mp4' ref='video' />
						Your browser does not support the video tag.
					</video>
				)
			
			}
			else { //image

				return (
					<img 
						className='img-responsive'
						id={this.props.file.lastModified}
						src={this.props.source}
						ref="image" />
				)
			}	
		}
		else if(this.props.post.video) {

			return (
				<video width="100%" height="100%" data-id={this.props.post.id} controls>
					<source 
						src={utils.formatVideo(this.props.post.video)}
						type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			)

		}
		else {

			return (
				<img 
					className='img-responsive'
					src={utils.formatImg(this.props.post.image, 'medium')}
					data-id={this.props.post.id} />
			)

		}
	}

}

EditPost.defaultProps = {
	post: {}
}