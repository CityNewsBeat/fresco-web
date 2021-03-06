import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import timeLib from 'app/lib/time';

/**
 * Post Cell Time/First Look
 * @description  First look is a time that is derived from the `first_look_until` timestamp on a post
 */
class CellTime extends Component {

    state = { ...this.createFirstLook() };

    createFirstLook() {
        const { post } = this.props;
        let firstLook;
        let firstLookIntervalId;
        if (!post.first_look_until) return {};
        const diffMs = moment(post.first_look_until).diff(moment());
        // const diffMs = moment().add(20, 'seconds').diff(moment());

        if (diffMs > 1) {
            firstLook = moment.duration(diffMs);
            firstLookIntervalId = setInterval(() => {
                if (this.state.firstLook && this.state.firstLook.asSeconds() <= 0) {
                    clearInterval(this.state.firstLookIntervalId);
                    this.setState({ firstLook: null, firstLookIntervalId: null });
                } else {
                    this.setState({ firstLook: this.state.firstLook.subtract(1, 's') });
                }
            }, 1000);
        }

        return { firstLook, firstLookIntervalId };
    }

    render() {
        const { post, sortBy } = this.props;
        const { firstLook } = this.state;
        const time = sortBy === 'captured_at'
            ? (post.captured_at || post.created_at)
            : post.created_at;


        const timeString = typeof time === 'undefined' ? 'No timestamp' : timeLib.formatTime(time);
        const pad = (num, size) => (`000000000${num}`).substr(-size);

        if (firstLook) {
            return (
                <span className="tile__first-look">
                    <i className="mdi mdi-clock-fast" />
                    <span>{`${pad(firstLook.minutes(), 2)}:${pad(firstLook.seconds(), 2)} remaining`}</span>
                </span>
            );
        }

        return (
            <span className="md-type-caption timestring" data-timestamp={time}>
                {timeString}
            </span>
        );
    }
}

CellTime.propTypes = {
    post: PropTypes.object,
    sortBy: PropTypes.string,
};

CellTime.defaultProps = {
    post: {},
    sortBy: 'created_at',
};

export default CellTime;

