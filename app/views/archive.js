import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import PostList from './../components/global/post-list.js'
import TopBar from './../components/topbar'
import global from './../../lib/global'

/** //

Description : View page for all content

// **/

/**
 * Archive Parent Object (composed of PostList and Navbar)
 */

class Archive extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			purchases : []
		}

		this.loadPosts = this.loadPosts.bind(this);
	}

	render() {

		return (
			<App user={this.props.user}>
				<TopBar 
					title={this.props.title}
					timeToggle={true}
					verifiedToggle={true}
					chronToggle={true} />
				<PostList
					loadPosts={this.loadPosts}
					rank={this.props.user.rank}
					purchases={this.props.purchases}
					size='small'
					scrollable={true} />
			</App>
		);

	}

	//Returns array of posts with offset and callback, used in child PostList
	loadPosts (passedOffset, callback) {

		var params = {
			limit: 18,
			verified : true,
			offset: passedOffset
		};

		$.ajax({
			url:  '/api/post/list',
			type: 'GET',
			data: params,
			dataType: 'json',
			success: (response, status, xhr) => {

				//Do nothing, because of bad response
				if(!response.data || response.err)
					callback([]);
				else
					callback(response.data);

			},
			error: (xhr, status, error) => {
				$.snackbar({content: global.resolveError(error)});
			}

		});

	}

}

ReactDOM.render(
 	<Archive 
 		user={window.__initialProps__.user} 
 		purchases={window.__initialProps__.purchases}
 		title={window.__initialProps__.title} />,
	document.getElementById('app')
);