import React from 'react'
import PlacesAutocomplete from '../editing/places-autocomplete'
import EditMap from '../editing/edit-map'

export default class AutocompleteMap extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			location: null,
			radius: this.props.radius
		}

		this.onPlaceChange = this.onPlaceChange.bind(this);
		this.updateRadius = this.updateRadius.bind(this);
	}

	onPlaceChange(place) {
		this.setState({
			location: place.location
		});
		this.props.onPlaceChange(place.location);
	}

	updateRadius() {
		var radius = parseInt(this.refs.radius.value, 10);
		if(radius == 'NaN') { return }
		this.setState({
			radius: radius
		});
		this.props.onRadiusChange(radius);
	}

	render() {

		var radiusInput = '';
		if(this.props.radius) {
			radiusInput = 
			            <input
			                type="text"
			                className="form-control floating-label numbers"
			                data-hint="feet"
			                placeholder="Radius"
			                defaultValue={this.props.radius}
			                onKeyUp={this.updateRadius}
			                ref="radius" />
		}

		return (
			<div className="map-group">
				<PlacesAutocomplete
					defaultLocation={this.props.defaultLocation}
					onPlaceChange={this.onPlaceChange}
					disabled={this.props.disabled} />
	            {radiusInput}
				<div className="form-group-default">
					<EditMap 
						location={this.state.location}
						radius={this.state.radius}
						rerender={this.props.rerender} />
				</div>
			</div>
		);
	}
}

AutocompleteMap.defaultProps = {
	defaultLocation: null,
	location: null,
	radius: null,
	rerender: true,
	updateRadius: function() {},
	onPlaceChange: function() {}
}