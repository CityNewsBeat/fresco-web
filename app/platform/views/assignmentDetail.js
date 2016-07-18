import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TopBar from './../components/topbar';
import PostList from './../components/global/post-list';
import Sidebar from './../components/assignment/sidebar';
import Edit from './../components/assignment/edit.js';
import App from './app';
import utils from 'utils';

/**
 * Story Detail Parent Object, made of a side column and PostList
 */
class AssignmentDetail extends React.Component {
    constructor(props) {
        super(props);
        const { assignment } = this.props;

        this.state = {
            assignment,
            stats: assignment.stats || { photos: 0, videos: 0 },
            toggled: false,
            verifiedToggle: true,
            outlet: assignment.outlets[0],
        };
    }

    onVerifiedToggled(toggled) {
        this.setState({ verifiedToggle: toggled });
    }

    /**
     * Sets the stateful assignment
     * @param {dictionary} assignment Assignment to update to
     */
    setAssignment(assignment) {
        this.setState({ assignment });
    }

    updateOutlet(outlet) {
        this.setState({ outlet });
    }

    /**
     * Sets the assignment to expire
     * @description Invoked from the on-page button `Expire`
     */
    expireAssignment() {
        $.ajax({
            method: 'POST',
            url: `/api/assignment/${this.state.assignment.id}/update`,
            data: JSON.stringify({
                ends_at: Date.now(),
            }),
            dataType: 'json',
            contentType: 'application/json',
        })
        .done((response) => {
            $.snackbar({ content: 'Assignment expired' });
            this.setState({ assignment: response });
        })
        .fail(() => {
            $.snackbar({
                content: utils.resolveError(response.err, 'There was an error expiring this assignment!')
            });
        });
    }

    /**
     * Toggles edit modal with `s` (state) value. If `s` is not provided, negates toggled.
     */
    toggleEdit(s) {
        this.setState({
            toggled: typeof s === 'undefined' ? !this.state.toggled : s,
        });
    }

    render() {
        const { user } = this.props;
        const { assignment, toggled, stats, verifiedToggle, outlet } = this.state;

        return (
            <App user={user}>
                <TopBar
                    title={assignment.title}
                    rank={user.rank}
                    onVerifiedToggled={(t) => this.onVerifiedToggled(t)}
                    verifiedToggle={user.rank >= utils.RANKS.CONTENT_MANAGER}
                    edit={(b) => this.toggleEdit(b)}
                    editable
                    timeToggle
                    chronToggle
                />

                <Sidebar
                    assignment={assignment}
                    stats={stats}
                    expireAssignment={() => this.expireAssignment()}
                />

                <div className="col-sm-8 tall">
                    <PostList
                        rank={user.rank}
                        posts={assignment.posts}
                        onlyVerified={verifiedToggle}
                        assignment={assignment}
                        scrollable={false}
                        editable={false}
                        size="large"
                    />
                </div>

                <Edit
                    assignment={assignment}
                    stats={stats}
                    setAssignment={(a) => this.setAssignment(a)}
                    toggled={toggled}
                    toggle={(b) => this.toggleEdit(b)}
                    updateOutlet={(o) => this.updateOutlet(o)}
                    user={user}
                    outlet={outlet}
                />
            </App>
        );
    }
}

AssignmentDetail.propTypes = {
    user: PropTypes.object,
    assignment: PropTypes.object,
};

ReactDOM.render(
    <AssignmentDetail
        user={window.__initialProps__.user}
        assignment={window.__initialProps__.assignment}
    />,
document.getElementById('app')
);

