import React from 'react'
import ReactDOM from 'react-dom'
import TopBar from './../components/topbar'
import PostList from './../components/global/post-list'
import AssignmentSidebar from './../components/assignmentDetail/assignment-sidebar'
import AssignmentEdit from './../components/editing/assignment-edit.js'
import App from './app'
import global from '../../lib/global'

/**
 * Story Detail Parent Object, made of a side column and PostList
 */

class AssignmentDetail extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			assignment: this.props.assignment,
			stats: this.props.assignment.stats,
			toggled: false,
			verifiedToggle: true
		}

		this.expireAssignment 	= this.expireAssignment.bind(this);
		this.setAssignment 		= this.setAssignment.bind(this);
		this.toggleEdit 		= this.toggleEdit.bind(this);
		this.onVerifiedToggled 	= this.onVerifiedToggled.bind(this);
	}

 	/**
 	 * Sets the stateful assignment
 	 * @param {dictionary} assignment Assignment to update to
 	 */
 	setAssignment(assignment) {
 		this.setState({ assignment: assignment });
 	}

 	/**
 	 * Sets the assignment to expire
 	 * @description Invoked from the on-page button `Expire`
 	 */
 	expireAssignment() {

 		$.post('/api/assignment/update', {
			expiration_time: Date.now(),
 			id: this.state.assignment._id
 		}, (response) => {
 			if(response.err || !response.data){
 				$.snackbar({ content : global.resolveError(response.err, 'There was an error expiring this assignment!') });
 			} else{
 				$.snackbar({ content : 'Assignment expired' });
				this.setState({
					assignment: response.data
				});
 			}
 		});
 	}

 	onVerifiedToggled(toggled) {
 		this.setState({
 			verifiedToggle: toggled
 		});
 	}

 	/**
 	 * Toggles edit modal with `s` (state) value. If `s` is not provided, negates toggled.
 	 */
 	 toggleEdit(s) {
 	 	this.setState({
 	 		toggled: typeof s == 'undefined' ? !this.state.toggled : s
 	 	});
 	 }

 	render() {

 		return (
 			<App user={this.props.user}>
 				<TopBar
 					title={this.state.assignment.title}
 					timeToggle={true}
 					chronToggle={true}
 					onVerifiedToggled={this.onVerifiedToggled}
 					verifiedToggle={this.props.user.rank >= global.RANKS.CONTENT_MANAGER} /* Based on user rank to see verified content */
 					editable={true}
 					edit={this.toggleEdit} />

 				<AssignmentSidebar
 					assignment={this.state.assignment}
 					stats={this.state.stats}
 					expireAssignment={this.expireAssignment} />

 				<div className="col-sm-8 tall">
	 				<PostList
	 					rank={this.props.user.rank}
	 					purchases={this.props.purchases}
	 					posts={this.props.assignment.posts}
	 					onlyVerified={this.state.verifiedToggle}
	 					scrollable={false}
	 					editable={false}
	 					size='large' />
				</div>

				<AssignmentEdit
					assignment={this.state.assignment}
					stats={this.state.stats}
					setAssignment={this.setAssignment}
					toggled={this.state.toggled}
					toggle={this.toggleEdit}
					user={this.props.user}	/>
 			</App>
 		);

 	}
}

ReactDOM.render(
  	<AssignmentDetail
  		user={window.__initialProps__.user}
  		purchases={window.__initialProps__.purchases}
  		assignment={window.__initialProps__.assignment}
  		title={window.__initialProps__.title} />,
  	document.getElementById('app')
);
