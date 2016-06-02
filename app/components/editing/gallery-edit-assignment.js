import _ from 'lodash'
import React from 'react'
import Tag from './tag.js'
import global from '../../../lib/global'

/**
 * Component for managing added/removed tags
 */

export default class GalleryEditAssignment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			suggestions: []
		}
		this.change = this.change.bind(this);
		this.addAssignment = this.addAssignment.bind(this);
	}

	change(e) {
		//Current fields input
		var query = this.refs.autocomplete.value;

		//Field is empty
		if(query.length == 0){
			this.setState({ suggestions: [] });
			this.refs.dropdown.style.display = 'none';
		} else{

			this.refs.dropdown.style.display = 'block';

			$.ajax({
				url: '/api/assignment/search',
				data: { q: query },
				success: (result, status, xhr) => {

					if(result.data){

						this.setState({ suggestions: result.data });

					}
				}
			});
		}
	}

	/**
	 * Adds assignment at passed index to current assignment
	 * @param {[type]} index [description]
	 */
	addAssignment(assignment) {
		if(this.props.assignment){
			return $.snackbar({ content : 'Submissions can only have one assignment!' });
		}
		
		//Clear the input field
		this.refs.autocomplete.value = ''
		this.refs.dropdown.style.display = 'none';

		//Send assignment up to parent
		this.props.updateGalleryField('assignment', assignment);
	}

	render() {
		return (
			<div className="dialog-row split chips">
				<div className="split-cell">
					<input
						type="text"
						className="form-control floating-label"
						placeholder="Assignment"
						onKeyUp={this.change}
						ref='autocomplete' />

					<ul ref="dropdown" className="dropdown">
						{this.state.suggestions.map((assignment, i) => {
							return (
								<li onClick={this.addAssignment.bind(null, assignment)}
									key={i}>{assignment.title}</li>
							)
						})}
					</ul>

					<ul className="chips">
						{this.props.assignment ? 
							<Tag
								text={this.props.assignment.title}
								plus={false}
								onClick={this.props.updateGalleryField.bind(null, 'assignment', null)} /> 
							: ''
						}
					</ul>
				</div>
			</div>

		);

	}

}

GalleryEditAssignment.defaultProps = {
	updateAssignment: () => {}
}