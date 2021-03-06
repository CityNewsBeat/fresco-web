import React, { PropTypes } from 'react';
import { getGeoFromCoordinates } from 'app/lib/location';
import assignment from 'app/lib/assignment';

/**
 * AssignmentMergeDropup Dropdown(up) menu that displays list of nearby assignments
 * Click on assignment in list, calls onSelectMerge prop
 *
 * @extends React.Component
 */
class MergeDropup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            nearbyAssignments: [],
            loading: false,
        };
    }

    componentDidMount() {
        $(document).click((e) => {
            // Hide dropdown on click as long as not clicking on master button.
            if ($(e.target).parents('.merge-dropup').size() === 0
                && e.target.className !== 'merge-dropup__toggle') {
                this.setState({ active: false });
            }
        });

        this.findNearbyAssignments();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.findNearbyAssignments();
        }
    }

    componentWillUnmount() {
        // Clean up click event on unmount
        $(document).unbind('click');
    }

    onToggle() {
        this.setState({ active: !this.state.active });
    }

    /**
     * Finds nearby assignments
     */
    findNearbyAssignments() {
        const { loading } = this.state;
        const { assignmentId, location } = this.props;
        if (loading || !location) return;

        this.setState({ loading: true });
        const data = {
            radius: 100,
            geo: location.hasOwnProperty('type') ? location : getGeoFromCoordinates(location),
            limit: 8,
            sortBy: 'created_at',
            direction: 'desc',
            ends_after: Date.now(),
            rating: [0, 1] //Active or Pending
        };

        assignment
        .list(data)
        .then(assignments => {
            this.setState({ 
                nearbyAssignments: assignments.filter(a => a.id !== assignmentId)
            });
        })
        .then(() => {
            this.setState({ loading: false });
        });
    }

    renderAssignments(assignments) {
        const { onSelectMerge } = this.props;

        return assignments.map((a, i) => (
            <div
                key={i}
                className="merge-dropup__menu-item"
                onClick={() => onSelectMerge(a)}
            >
                <span className="assignment-title">
                    {a.title}
                </span>
                <span className="assignment-location">
                    {a.address}
                </span>
                <p className="assignment-caption">
                    {a.caption}
                </p>
            </div>
        ));
    }

    render() {
        const { active, nearbyAssignments } = this.state;

        if (active && nearbyAssignments.length) {
            return (
                <div className={'merge-dropup merge-dropup--active pull-right '}>
                    <div className="merge-dropup__toggle merge-dropup__toggle--active" onClick={() => this.onToggle()} >
                        <span>{`Merge (${nearbyAssignments.length})`}</span>
                        <i className={'mdi mdi-menu-down pull-right'} />
                    </div>

                    <div className="merge-dropup__body">
                        {this.renderAssignments(nearbyAssignments)}
                    </div>
                </div>
            );
        }

        return (
            <div className={'merge-dropup pull-right btn'}  onClick={() => this.onToggle()}>
                <div className="merge-dropup__toggle">
                    <span>{`Merge (${nearbyAssignments.length})`}</span>
                    <i className={'mdi mdi-menu-up'} />
                </div>
            </div>

        );
    }
}

MergeDropup.propTypes = {
    assignmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    location: PropTypes.object.isRequired,
    onSelectMerge: PropTypes.func.isRequired,
};

export default MergeDropup;

