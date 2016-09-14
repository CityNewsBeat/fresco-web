import React, { PropTypes } from 'react';
import last from 'lodash/last';
import flow from 'lodash/flow';
import api from 'app/lib/api';
import { DragSource, DropTarget } from 'react-dnd';
import OutletColumnHead from './outlet-column-head';
import OutletColumnList from './outlet-column-list';

const columnSource = {
    beginDrag(props) {
        console.log('begin dragging column', props.outletId);

        return { outletId: props.outletId };
    },
};

const columnTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();

        console.log('dragging column', sourceProps, targetProps);
    },
};


const initialState = {
    userStats: {
        mau: 0,
        dau: 0,
        galleryCount: 0,
    },
    purchaseStats: {},
    dailyVideoCount: 0,
    purchases: [],
    loading: false,
    outlet: {},
};

/**
 * Outlet Column Component
 * @description Column for an indivdual outlet in outlet purchases page
 */
class OutletColumn extends React.Component {
    static propTypes = {
        isDragging: PropTypes.bool.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        outletId: PropTypes.string.isRequired,
        since: PropTypes.object,
    };

    static defaultProps = {
        isDragging: false,
    };

    state = initialState;

    componentDidMount() {
        this.loadOutlet();
        // this.loadPurchaseStats();
        // this.loadGoal();

        this.loadPurchases(null, (purchases) => {
            this.setState({ purchases });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.outletId !== this.props.outletId) {
            this.setState(initialState);
        }
    }

    // componentDidUpdate(prevProps) {
    //     // console.log('SINCE', prevProps.since !== this.props.since)
    //     // if (prevProps.since !== this.props.since) {
    //     //     this.loadPurchaseStats();
    //     // }
    // }

    /**
     * Scroll listener for main window
     */
    onScroll = (e) => {
        const grid = e.target;
        const scrollTop = grid.scrollTop;
        const head = this.columnHead.head;
        const headClass = head.className;

        if (scrollTop <= 0) {
            head.className = headClass.replace(/\bshadow\b/, '');
        } else if (headClass.indexOf('shadow') === -1) {
            head.className += ' shadow';
        }

        const endOfScroll = grid.scrollTop > ((grid.scrollHeight - grid.offsetHeight) - 200);

        // Check that nothing is loading and that we're at the end of the scroll,
        // and that we have a parent bind to load  more posts
        if (!this.state.loading && endOfScroll) {
            this.loadPurchases(last(this.state.purchases).id, (purchases) => {
                if (!purchases || !purchases.length) {
                    this.setState({ scrollable: false });
                    return;
                }

                // Set galleries from successful response, and unset loading
                this.setState({
                    purchases: this.state.purchases.concat(purchases),
                });
            });
        }
    }

    loadOutlet() {
        const id = this.props.outletId;

        api.get(`outlet/${id}`)
        .then(res => {
            this.setState({ outlet: res });
        })
        .catch(() => {
            $.snackbar({ content: `There was an error loading outlet with id ${id}` });
        });
    }

    /**
     * Requests purchases for a passed outlet
     */
    loadPurchases(lastPurchase = null, cb) {
        const { outletId } = this.props;
        this.setState({ loading: true });

        api.get('purchase/list', {
            outlet_ids: [outletId],
            limit: 5,
            last: lastPurchase,
        })
        .then(cb)
        .catch(() => {
            $.snackbar({
                content: `There was an error getting outlet(${outletId}) purchases list`,
            });
        })
        .then(() => {
            this.setState({ loading: false });
        });
    }

    /**
     * Loads user stats for outlet and sets state
     */
    // loadUserStats = () => {

    // }

    /**
     * Loads stats for purchases
     */
    loadPurchaseStats = (lastPurchase = null) => {
        const calculateStats = ({ total_revenue = 0 }) => {
            if (!total_revenue) return;

            const stripeFee = (0.029 * total_revenue) + 0.30;
            const userFee = 0.67 * total_revenue;
            const margin = total_revenue - stripeFee - userFee;

            this.setState({ purchaseStats: {
                margin: `$${Math.round(margin * 100) / 100}`,
                revenue: `$${total_revenue}`,
            } });
        };

        const { outletId } = this.props;

        api.get('purchase/stats', {
            outlet_ids: [outletId],
            limit: 5,
            last: lastPurchase,
        })
        .then(calculateStats)
        .catch(() => {
            $.snackbar({
                content: `There was an error getting outlet(${outletId}) purchase stats`,
            });
        });
    }

    // loadGoal = () => {
    //     $.ajax({
    //         url: '/api/outlet/purchases/stats',
    //         type: 'GET',
    //         data: {
    //             outlets: [this.state.outlet.id],
    //             since: moment().utc().startOf('day').unix() * 1000,
    //             now: Date.now(),
    //         },
    //         dataType: 'json',
    //         success: response => this.setState({ dailyVideoCount: response.data.videos }),
    //     });
    // }

    /**
     * Manages goal adjustment
     * @param  {integer} increment Value to add to current goal
     */
    // adjustGoal = (increment) => {
    //     const outlet = this.state.outlet;
    //     const params = { id: this.state.outlet.id };
    //     const updateGoal = (data) => {
    //         // Check if event set goal is still consistent with state goal
    //         // before sending out request
    //         if (data.goal !== this.state.outlet.goal) {
    //             return;
    //         }

    //         $.ajax({
    //             url: '/api/outlet/goal',
    //             type: 'POST',
    //             data,
    //             dataType: 'json',
    //             success: (response, status, xhr) => {
    //                 // Set again based on response data for consistency
    //                 // this.setState({
    //                 //     outlet: response
    //                 // });
    //             },
    //             error: (xhr, status, error) => {
    //                 $.snackbar({
    //                     content: utils.resolveError(error, 'There was an error updating this outlet\'s goal.'),
    //                 });
    //             },
    //         });
    //     };

    //     if (typeof (outlet.goal) === 'undefined' || !outlet.goal) {
    //         params.goal = 1;
    //     } else {
    //         params.goal = outlet.goal + increment;
    //     }

    //     // Set goal on outlet for state
    //     outlet.goal = params.goal;
    //     // Set for immediate feedback
    //     this.setState({ outlet });

    //     // Timeout in case of rapid clicks
    //     setTimeout(() => updateGoal(params), 1000);
    // }

    render() {
        const { isDragging, connectDragSource, connectDropTarget } = this.props;

        return flow(connectDragSource, connectDropTarget)(
            <div
                draggable
                className="outlet-column"
                style={{
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
                <OutletColumnHead
                    ref={r => { this.columnHead = r; }}
                    adjustGoal={this.adjustGoal}
                    userStats={this.state.userStats}
                    purchaseStats={this.state.purchaseStats}
                    dailyVideoCount={this.state.dailyVideoCount}
                    outlet={this.state.outlet}
                />

                <OutletColumnList
                    onScroll={this.onScroll}
                    purchases={this.state.purchases}
                />
            </div>
        );
    }
}

export default flow(
    DragSource('outletColumn', columnSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })),
    DropTarget('outletColumn', columnTarget, connect => ({
        connectDropTarget: connect.dropTarget(),
    }))
)(OutletColumn);

