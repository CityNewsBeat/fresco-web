var React = require('react');
var ReactDOM = require('react-dom');

/** //

Description : Top for pages of the site

// **/

var TopBar = React.createClass({

	displayName: 'TopBar',

	getDefaultProps: function() {
		return {
			title: ''
		};
	},

	render: function(){

		return (
			<nav className="navbar navbar-fixed-top navbar-default">
				<div className="dim transparent toggle-drop toggler"></div>
				<button type="button" className="icon-button toggle-drawer toggler hidden-lg">
					<span className="mdi mdi-menu icon"></span>
				</button>
				<div className="spacer"></div>
				<h1 className="md-type-title">{this.props.title}</h1>
				<TimeToggle />
				<VerifiedToggle />
			</nav>
		);
	}

});


var TimeToggle = React.createClass({

	displayName: 'TimeToggle',

	render: function(){

		return (
			<li className="drop pull-right hidden-xs">
				<button className="toggle-drop md-type-subhead time-display-filter-button" ref="time_toggle_button">
					<span className="time-display-filter-text">Relative</span><span className="mdi mdi-menu-down icon"></span>
				</button>
				<div className="drop-menu panel panel-default">
					<div className="toggle-drop toggler md-type-subhead">
						<span className="time-display-filter-text" ref="currentTimeFilter">Relative</span>
						<span className="mdi mdi-menu-up icon pull-right"></span>
					</div>
					<div className="drop-body">
						<ul className="md-type-subhead">
							<li className="time-display-filter-type active" data-filter-type="relative" onClick={this.toggleTimeClicked}>Relative</li>
							<li className="time-display-filter-type" data-filter-type="absolute" onClick={this.toggleTimeClicked}>Absolute</li>
						</ul>
					</div>
				</div>
			</li>
		)

	},
	toggleTimeClicked: function(){

		var currentTimeFilter = this.refs.currentTimeFilter;
		
		var displayMode = '';

		if(currentTimeFilter.innerHTML == 'Relative'){
			displayMode = 'absolute';
			currentTimeFilter.innerHTML = 'Absolute';
		}
		else{
			displayMode = 'relative';
			currentTimeFilter.innerHTML = 'Relative';
		}
		
		setTimeDisplayType(displayMode);
		
		this.refs.time_toggle_button.click();


		$('.time-display-filter-type').removeClass('active');

		$(currentTimeFilter).addClass('active');

	}

});

var VerifiedToggle = React.createClass({

	displayName: 'VerifiedToggle',

	render: function(){

		return (
			
			//Check if content manger or creater (config.RANKS.CONTENT_MANAGER)
			<li className="drop pull-right hidden-xs">
				<button className="toggle-drop md-type-subhead filter-button">
					<span className="filter-text">Verified content</span>
					<span className="mdi mdi-menu-down icon"></span>
				</button>
				<div className="drop-menu panel panel-default">
					<div className="toggle-drop toggler md-type-subhead">
						<span className="filter-text">Verified content</span>
						<span className="mdi mdi-menu-up icon pull-right"></span>
					</div>
					<div className="drop-body">
						<ul className="md-type-subhead">
							<li className="filter-type">All content</li>
							<li className="filter-type active">Verified content</li>
						</ul>
					</div>
				</div>
			</li>
		
		)

	},
	toggleTimeClicked: function(){

		var currentTimeFilter = this.refs.currentTimeFilter;
		
		var displayMode = '';

		if(currentTimeFilter.innerHTML == 'Relative'){
			displayMode = 'absolute';
			currentTimeFilter.innerHTML = 'Absolute';
		}
		else{
			displayMode = 'relative';
			currentTimeFilter.innerHTML = 'Relative';
		}
		
		setTimeDisplayType(displayMode);
		
		this.refs.time_toggle_button.click();


		$('.time-display-filter-type').removeClass('active');

		$(currentTimeFilter).addClass('active');

	}

});


module.exports = TopBar;