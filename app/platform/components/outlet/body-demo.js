import React from 'react';
import Sidebar from './sidebar';

/**
 * Outlet screen for when outlet has not yet been verified
 * Displays a simple message to the user of an unverified outlet
 */
export default class BodyDemo extends React.Component {
    render() {
        const { outlet } = this.props;

        let message;

        if(outlet.owner === undefined) {
            message = 'Purchases and downloads are disabled until we verify your outlet. Please contact support@fresconews.com for assistance';
        } else {
            `Purchases and downloads are disabled until we verify your outlet. We'll be in contact with ${outlet.owner.full_name}`;
        }

        return (
            <div className="container-fluid tabs">
                <div className="tab tab-vault toggled">
                    <div className="container-fluid fat">
                        <div className="profile visible-xs"></div>

                        <Sidebar outlet={outlet} />

                        <div className="col-sm-8 tall">
                            <div className="grid">
                                <h1>This outlet is currently in demo mode.</h1>
                                <p>{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
