import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import TopBar from '../components/topbar';
import Body from '../components/outlet/body';
import BodyDemo from '../components/outlet/body-demo';

/**
 * Outlet Detail page
 * @description Can be viewed by outlet members, and also by Fresco CMs and Admins
 * This page is loaded via `/outlet` or by the outlet's id `/outlet/:id`
 */
class Outlet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'Vault',
            purchases: [],
        };

        this.setActiveTab = this.setActiveTab.bind(this);
    }

    setActiveTab(activeTab) {
        this.setState({ activeTab });
    }

    edit() {
        window.location.href = '/outlet/settings';
    }

    render() {
        const { user, outlet } = this.props;
        const editable = user.outlet.id === outlet.id; //Editable if it's the session user's outlet
        let topbarTabs = [];

        // Only show tabs if outlet has been verified
        if (outlet.verified) {
            topbarTabs = ['Vault', 'Purchases'];
        }

        return (
            <App user={user}>
                <TopBar
                    title={outlet.title}
                    permissions={user.permissions}
                    edit={this.edit}
                    editIcon={"mdi-settings"}
                    activeTab={this.state.activeTab}
                    setActiveTab={this.setActiveTab}
                    tabs={topbarTabs}
                    editable={editable}
                />

                {outlet.verified ? 
                    <Body
                        activeTab={this.state.activeTab}
                        outlet={outlet}
                        user={user}
                    />
                    :
                    <BodyDemo outlet={outlet} />
                }
            </App>
        );
    }
}

Outlet.propTypes = {
    user: PropTypes.object,
    outlet: PropTypes.object.isRequired,
};

ReactDOM.render(
    <Outlet
        user={window.__initialProps__.user}
        outlet={window.__initialProps__.outlet}
    />,
    document.getElementById('app')
);
