import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import PostList from './../components/global/post-list.js'
import TopBar from './../components/topbar'
import global from '../../lib/global'

/**
 * Videos Parent Object (composed of Post and Navbar)
 */

class Videos extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			verifiedToggle: true
		}

		this.loadPosts 			= this.loadPosts.bind(this);
		this.onVerifiedToggled 	= this.onVerifiedToggled.bind(this);
	}

	onVerifiedToggled(toggled) {
		this.setState({
			verifiedToggle: toggled
		});
	}

	//Returns array of posts with offset and callback, used in child PostList
	loadPosts (passedOffset, callback) {

		var endpoint = '/v1/post/list',
				params = {
					limit: 18,
					verified : this.state.verifiedToggle,
					offset: passedOffset,
					type: 'video'
				};

		$.ajax({
			url:  global.API_URL + endpoint,
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

	render() {

		return (
			<App user={this.props.user}>
				<TopBar 
					title="Videos"
					timeToggle={true}
					verifiedToggle={true}
					chronToggle={true}
					onVerifiedToggled={this.onVerifiedToggled} />
				<PostList
					loadPosts={this.loadPosts}
					rank={this.props.user.rank}
					purchases={this.props.purchases}
					didPurchase={this.props.didPurchase}
					size='small'
					scrollable={true}
					onlyVerified={this.state.verifiedToggle} />
			</App>
		);

	}

}

Videos.defaultProps = {
	purchases : []
}

ReactDOM.render(
 	<Videos 
 		user={window.__initialProps__.user} 
 		purchases={window.__initialProps__.purchases} />,
 	document.getElementById('app')
);
