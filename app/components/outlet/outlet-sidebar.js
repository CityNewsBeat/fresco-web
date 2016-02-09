import React from 'react'
import global from './../../../lib/global'

/** //

Description : Column on the left of the outlet page

// **/

/**
 * Outlet Sidebar parent object
 */

export default class OutletSidebar extends React.Component {

	render() {	

		var outlet = this.props.outlet;

		return (
			<div className="col-sm-4 profile hidden-xs pt0">
				<div className="container-fluid fat">
					<div className="col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
						<img className="img-avatar" src={outlet.avatar || 'https://d1dw1p6sgigznj.cloudfront.net/images/user-1.png'} />
						
						<div className="meta">
							<div className="meta-list">
								<ul className="md-type-subhead">
									<li className="ellipses">
										<span className="mdi mdi-web icon"></span><a href={outlet.link}>{outlet.link}</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
