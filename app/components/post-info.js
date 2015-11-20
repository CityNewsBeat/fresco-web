var React = require('react');
var ReactDOM = require('react-dom');

/** //

Description : Column on the right of the detail post showing all the post's info

// **/

/**
 * PostInfo parent object
 */

var PostInfo = React.createClass({

	displayName: 'PostInfo',

	render: function() {

		//Init needed vars to make list
		var post = this.props.post,
			gallery = this.props.gallery,
			userIcon = '',
			twitter = '',
			curator = '',
			timeString = formatTime(this.props.post.time_created),
			verifiedBy = this.props.verifier ? 
							'Verified by ' + this.props.verifier.firstname + ' ' + this.props.verifier.lastname : 
							'Not yet verified'

		//Check to show user icon
		if(this.props.post.owner){
			userIcon = <div>
						<img 
							className="img-circle img-responsive" 
							src={post.owner && post.owner.avatar ? post.owner.avatar : 'https://d1dw1p6sgigznj.cloudfront.net/images/user-1.png'} />
						</div>
		}

		//Check to show twitter item
		if (post.meta.twitter && post.meta.twitter.url){
			var twitter = 	<li>
								<span className="mdi mdi-twitter icon"></span>
								<a href="<%=post.meta.twitter.url%>" target="_blank">See original</a>
							</li>
		}

		//Check to show curator item
		if (gallery.curator) {
			var curator = <li>
							<span className="mdi mdi-account icon"></span>
							{this.props.gallery.curator.firstname + ' ' + this.props.gallery.curator.lastname}
						</li>
		}

		return (

			<div className="col-xs-12 col-md-4 meta">
				<div className="row">
					<div className="col-xs-12 col-sm-7 col-md-12">
						<div className="meta-user">
							{userIcon}
							<div>
								<span className="md-type-title">
									{post.meta.twitter ? 
										post.meta.twitter.user_name 
										: 
										(post.owner ? post.owner.firstname + ' ' + post.owner.lastname : '')
									}
								</span>
								<span className="md-type-body1">{this.props.post.affiliation}</span>
							</div>
						</div>
						<div className="meta-description">{this.props.gallery.caption}</div>
					</div>
					<div className="col-xs-12 col-sm-5 col-md-12 meta-list">
						<ul className="md-type-subhead">
							<li>
								<span className="mdi mdi-clock icon"></span>
								{timeString}
							</li>
							<li>
								<span className="mdi mdi-map-marker icon"></span>
								{post.location.address || 'No Location'}
							</li>
							{twitter}
							<li>
								<span className="mdi mdi-alert-circle icon"></span>
								{verifiedBy}
							</li>
							{curator}
						</ul>
					</div>
				</div>
			</div>

		);
	}

});


module.exports = PostInfo;