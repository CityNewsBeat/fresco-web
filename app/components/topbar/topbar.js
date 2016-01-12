import React from 'react'
import global from './../../../lib/global'
import Dropdown from './../global/dropdown'
import LocationDropdown from './location-dropdown'
import TagFilter from './tag-filter'

/** //

Description : Top Bar for pages of the site
The component takes optional toggles/pieces as props, and each prop is checked in the render. 
If the prop exists, then the repsective toggle/dropdown/edit/whatever is added to the navigation bar

// **/

export default class TopBar extends React.Component {

	constructor(props) {
		super(props);
		this.goLink = this.goLink.bind(this);
		this.timeToggleSelected = this.timeToggleSelected.bind(this);
		this.verifiedToggleSelected = this.verifiedToggleSelected.bind(this);
		this.chronToggleSelected = this.chronToggleSelected.bind(this);
		this.outletsFilterSelected = this.outletsFilterSelected.bind(this);
	}

	componentDidMount() {
		//Set up autocomplete
		if(this.props.locationInput) {

			//Set up autocomplete listener
			var autocomplete = new google.maps.places.Autocomplete(this.refs.autocomplete);
					
			google.maps.event.addListener(autocomplete, 'place_changed', () => {

				var place = autocomplete.getPlace(),
					center = {
						location: {
							lat: place.geometry.location.lat(),
							lng: place.geometry.location.lng()
						}
					};

				if(place.geometry.viewport){} 
					center.viewport = place.geometry.viewport;

				//Update the position to the parent component
				this.props.updateMapCenter(center);
			});
		}
	}

	// Called when has link prop.
	goLink() {
		window.location = this.props.link
	}

	//Called when the user selects a time format
	timeToggleSelected(selected) {
		if (selected == 'Absolute') {
			global.setTimeDisplayType('absolute');
		}
		else if (selected == 'Relative') {
			global.setTimeDisplayType('relative');
		}
	}

	//Called when the user selects a time format
	verifiedToggleSelected(selected) {
		this.props.onVerifiedToggled(selected == 'Verified');
	}

	//Called when the user selects a time format
	chronToggleSelected(selected) {
		
	}

	// Called when user selects an outlet to filter
	outletsFilterSelected() {

	}

	render() {

		var edit = '',
			topbarItems = [],
			locationInput = '',
			saveButton = '';

		if(this.props.saveButton){

			saveButton = <a 
							onClick={this.props.updateSettings} 
							className="mdi mdi-content-save icon pull-right hidden-xs">
							<div className="ripple-wrapper"></div>
						</a>;

		}

		if(this.props.locationInput) {
			locationInput = <div className="form-group-default">
								<input 
									type="text" 
									ref="autocomplete"
									className="form-control google-autocomplete" 
									placeholder="Location" />
							</div>;
		}
		
		if (this.props.editable) {

			topbarItems.push(
				<a className="mdi mdi-pencil icon pull-right hidden-xs toggle-edit toggler"
					key="edit"
					onClick={this.props.edit}></a>
			);
		}

		if (this.props.link) {
			topbarItems.push(
				<a className="mdi mdi-pencil icon pull-right hidden-xs"
					key="link"
					onClick={this.goLink} />
			)
		}

		if (this.props.chronToggle) {
			topbarItems.push(
				<Dropdown
					options={['By capture time', 'By upload time']}
					selected='By capture time'
					onSelected={this.chronToggleSelected}
					key="chronToggle"
					inList={true} />
			);
		}
		if (this.props.timeToggle) {
			
			topbarItems.push(
			
				<Dropdown
					options={['Relative', 'Absolute']}
					selected='Relative'
					onSelected={this.timeToggleSelected}
					key="timeToggle"
					inList={true} />
			);

		}
		if (this.props.verifiedToggle) {

			topbarItems.push(
				<Dropdown
					options={['All content', 'Verified']}
					selected='Verified'
					onSelected={this.verifiedToggleSelected}
					key="verifiedToggle"
					inList={true} />
			);

		}

		if (this.props.tagFilter) {
			topbarItems.push(
				<TagFilter
					onTagAdd={this.props.onTagAdd}
					onTagRemove={this.props.onTagRemove}
					tagList={this.props.tagList}
					key="tagFilter" />
			);
		}

		if (this.props.locationDropdown) {
			topbarItems.push(
				<LocationDropdown
					onPlaceChange={this.props.onPlaceChange}
					onRadiusChange={this.props.onRadiusChange}
					onMapDataChange={this.props.onMapDataChange}
					units="Miles"
					key="locationDropdown" />
			);
		}

		if (this.props.outletsFilter) {
			topbarItems.push(
				<TagFilter
					text="Outlets"
					tagList={this.props.outlets}
					filterList={this.props.outletFilterList}
					onTagAdd={this.props.onOutletFilterAdd}
					onTagRemove={this.props.onOutletFilterRemove}
					key="outletsFilter" />
			)
		}

		if(this.props.tabs) {
			var tabContent = [];
			
			this.props.tabs.map((tab, i) => {

				var buttonClass = "btn btn-flat vault " + tab.toLowerCase() + "-toggler" + (this.props.activeTab == tab ? ' toggled' : '');

				tabContent.push(
					<button
						className={buttonClass}
						onClick={this.props.setActiveTab.bind(null, tab)}
						key={tab.toLowerCase()}>
						{tab}
						<div className="ripple-wrapper"></div>
					</button>
				)
			});
			
			var tabs = <div className="tab-control">{tabContent}</div>
		}

		return (
			<nav className="navbar navbar-fixed-top navbar-default">
				<div className="dim transparent toggle-drop toggler"></div>
				<button type="button" className="icon-button toggle-drawer toggler hidden-lg">
					<span className="mdi mdi-menu icon"></span>
				</button>
				<div className="spacer"></div>
				<h1 className="md-type-title">{this.props.title}</h1>
				{locationInput}
				{tabs}
				{topbarItems}
				{saveButton}
			</nav>
		);
	}

}

TopBar.defaultProps = {
	title: '',
	edit: function() {},
	hide: function () { console.log('Hide function not implemented in TopBar'); },
	onVerifiedToggled: function() {},
	onOutletFilterAdd: function() {},
	onOutletFilterRemove: function() {}
}
