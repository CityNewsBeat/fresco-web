import React, { PropTypes } from 'react';
import { scrolledToBottom } from 'app/lib/helpers';
import last from 'lodash/last';
import AssignmentListItem from './assignment-list-item';

/**
 * List toggle component
 * @description The list switcher for assignments for the dispatch page
 */
export default class DispatchAssignments extends React.Component {
    static propTypes = {
        findAssignments: PropTypes.func.isRequired
    };

    state = {
        assignments: [],
        loading: false,
    };

    componentDidMount() {
        //Access parent find method
        this.props.findAssignments(null, {}, (assignments) => {
            //Set posts & callback from successful response
            this.setState({ assignments });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.viewMode !== this.props.viewMode){
            //Access parent var load method
            this.props.findAssignments(null, {}, (assignments) => {
                this.setState({ assignments });
            });
        }
    }

    // Scroll listener for main window
    scroll = (type) => {
        let grid;

        const { loading, assignments } = this.state;
        if (loading) return;

        if (type === 'active') grid = this.refs.activeList;
        else if (type === 'pending') grid = this.refs.pendingList;
        else if (type === 'expired') grid = this.refs.expiredList;

        // Check that nothing is loading and that we're at the end of the scroll,
        // and that we have a parent bind to load  more posts
        if (scrolledToBottom(grid) && assignments.length > 0) {
            // Set that we're loading
            this.setState({ loading: true });

            const params = { last: last(assignments).id };

            // Access parent var load method
            this.props.findAssignments(null, params, (res) => {
                // Set galleries from successful response, and unset loading
                this.setState({
                    assignments: assignments.concat(res),
                    loading: false,
                });
            });
        }
    };

	/**
	 * Toggle Assignment List
	 * @param  {string} toggle Which list to toggle to
	 */
    toggleList = (toggle) => {
        if(toggle === this.props.viewMode) return;

        var buttons = document.getElementsByClassName('btn-flat'),
            button = this.refs[toggle + '-button'];

        //Remove toggle from all other buttons
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].className = buttons[i].className.replace(/\btoggled\b/,'');
        };

        //Add toggle to clicked button
        button.className += ' toggled';

        this.setState({
            assignments: []
        });

        this.props.updateViewMode(toggle);
    };

    render() {
        const buttonClass = "btn btn-flat";
        const { viewMode } = this.props;

        let AssignmentList = this.state.assignments.map((assignment, i)  => {
            return (
                <AssignmentListItem
                    assignment={assignment}
                    setActiveAssignment={this.props.setActiveAssignment}
                    key={i} />
            )
        });
        return (
            <div className="card panel assignments-panel">
                <div className="card-head small">
                    <div className="tab-control full">
                        <button
                            ref="active-button"
                            className={viewMode == 'active' ? buttonClass + ' toggled' : buttonClass}
                            onClick={this.toggleList.bind(null, 'active')}>
                            Active
                        </button>

                        <button
                            ref="pending-button"
                            className={viewMode == 'pending' ? buttonClass + ' toggled' : buttonClass}
                            onClick={this.toggleList.bind(null, 'pending')}>
                            Pending
                        </button>

                        <button ref="expired-button"
                            className={viewMode == 'expired' ? buttonClass + ' toggled' : buttonClass}
                            onClick={this.toggleList.bind(null, 'expired')}>
                            History
                        </button>
                    </div>
                </div>

                <div className="card-foot center toggle-card">
                    <button
                        type="button"
                        id="open-assignment-window"
                        className="btn btn-flat toggle-card toggler"
                        disabled={!(this.props.user.outlet && this.props.user.outlet.dispatch_enabled)}
                        onClick={this.props.toggleSubmissionCard.bind(null, true)}>
                        Post an assignment
                    </button>
                </div>

                <div className="card-body">
                    <div className="tabs full">
                        <div className="tab toggled">
                            <div
                                ref="activeList"
                                className="list"
                                onScroll={() => this.scroll('active')}>
                                {AssignmentList}
                            </div>
                        </div>
                        <div className="tab">
                            <div
                                ref="pendingList"
                                className="list"
                                onScroll={() => this.scroll('pending')}
                            />
                        </div>
                        <div className="tab">
                            <div
                                ref="historyList"
                                className="list"
                                onScroll={() => this.scroll('active')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
