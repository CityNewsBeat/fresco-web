import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import moment from 'moment';
import { DragDropContext } from 'react-dnd';
import difference from 'lodash/difference';
import last from 'lodash/last';
import filter from 'lodash/filter';
import pickBy from 'lodash/pickBy';
import HTML5Backend from 'react-dnd-html5-backend';
import api from 'app/lib/api';
import { getFromLocalStorage, setInLocalStorage } from 'app/lib/storage';
import OutletColumn from './outlet-column';

class PurchasesOutlets extends React.Component {
    static propTypes = {
        statsTime: PropTypes.string.isRequired,
        outletIds: PropTypes.array.isRequired,
        style: PropTypes.object,
        loadData: PropTypes.bool,
    };

    state = {
        outletsById: {},
        sortedIds: getFromLocalStorage('views/purchases', 'sortedIds', this.props.outletIds),
    };

    componentDidMount() {
        const { outletIds, loadData } = this.props;
        let { sortedIds } = this.state;
        sortedIds = filter(sortedIds, o => outletIds.includes(o));
        this.setState({ sortedIds }, () => {
            if (loadData) this.loadOutlets(outletIds);
        });
    }

    componentWillReceiveProps(nextProps) {
        const { outletIds } = nextProps;
        let { outletsById, sortedIds } = this.state;

        if (JSON.stringify(outletIds) !== JSON.stringify(this.props.outletIds)) {
            // get newly added outlet ids to then load them
            outletsById = pickBy(outletsById, o => outletIds.includes(o.id));
            sortedIds = filter(sortedIds, o => outletIds.includes(o));
            let newOutletIds = outletIds;
            if (Object.keys(outletsById).length) {
                newOutletIds = difference(outletIds, sortedIds);
            }

            this.setState({ outletsById, sortedIds }, () => this.loadOutlets(newOutletIds));
        }
    }

    componentDidUpdate(prevProps) {
        // load initial data when cmp is rendered if no initial data exists
        if (!Object.keys(this.state.outletsById).length) {
            if ((prevProps.loadData !== this.props.loadData) && this.props.loadData) {
                this.loadOutlets(this.props.outletIds);
            }
        }
    }

    onMove = (dragIndex, hoverIndex) => {
        const { sortedIds } = this.state;
        const dragOutlet = sortedIds[dragIndex];

        this.setState(update(this.state, {
            sortedIds: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragOutlet],
                ],
            },
        }), () => {
            setInLocalStorage('views/purchases', { sortedIds: this.state.sortedIds });
        });
    };

    /**
     * loadOutlets
     * loads outlet info and purchases for new outlet ids props
     *
     * @param {array} outletIds array of outlet ids
     */
    loadOutlets = (outletIds) => {
        let { outletsById, sortedIds } = this.state;
        if (!outletIds || !outletIds.length) return;

        Promise.all(outletIds.map((id) => api.get(`outlet/${id}`)))
        .then(res => {
            res.forEach(o => {
                outletsById = Object.assign(outletsById, { [o.id]: o });
                if (!sortedIds.includes(o.id)) {
                    sortedIds = update(sortedIds, { $push: [o.id] });
                }
            });
        })
        .catch(() => $.snackbar({ content: 'There was an error loading outlets' }))
        .then(() => {
            this.setState({ outletsById, sortedIds }, () => {
                this.loadInitialPurchases(outletIds);
            });
        });
    };

    loadInitialPurchases = (outletIds) => {
        let { sortedIds, outletsById } = this.state;
        if (!sortedIds.length) return;

        Promise.all(sortedIds.map(id => api.get('purchase/list', {
            outlet_ids: [id],
            limit: 5,
        })))
        .then((res) => {
            res.forEach((purchases) => {
                if (purchases && purchases.length) {
                    outletsById = update(outletsById, { [purchases[0].outlet_id]: { $merge: { purchases } } });
                }
            });
        })
        .catch(() => {
            $.snackbar({
                content: `There was an error getting outlets(${outletIds.join(', ')}) purchases!`,
            });
        })
        .then(() => this.setState({ outletsById }));
    };

    loadMorePurchases = (outletId) => {
        let { outletsById } = this.state;
        if (!outletId) return;
        const outlet = outletsById[outletId];

        api.get('purchase/list', {
            outlet_ids: [outletId],
            last: last(outlet.purchases).id,
            limit: 5,
        })
        .then((res) => {
            if (res && res.length) {
                outletsById = update(outletsById, { [outletId]: { purchases: { $push: res } } });
            }
        })
        .catch(() => {
            $.snackbar({
                content: `There was an error getting outlet(${outletId}) purchases!`,
            });
        })
        .then(() => this.setState({ outletsById }));
    };

     /**
     * Updates the time interval the outelt data is loaded in
     * @return {moment} Moment.JS Object for the selected time
     */
    getStatsISO = (selected) => {
        let dt = moment().utc();
        switch (selected) {
        case 'last 24 hours':
            dt = dt.subtract(1, 'day');
            break;
        case 'last 7 days':
            dt = dt.subtract(7, 'days');
            break;
        case 'last 30 days':
            dt = dt.subtract(30, 'days');
            break;
        case 'this year':
            dt = dt.subtract(1, 'year');
            break;
        case 'all time':
            return null;
        case 'today so far':
        default:
            dt = dt.startOf('day');
        }

        return dt.toISOString();
    };

    render() {
        const { outletsById, sortedIds } = this.state;
        const { statsTime, style } = this.props;
        if (!Object.keys(outletsById).length) return null;

        return (
            <div style={style} className="purchases__outlets">
                {sortedIds.map((id, i) => {
                    const outlet = outletsById[id];
                    if (!outlet) return null;
                    return (
                        <OutletColumn
                            key={outlet.id}
                            id={outlet.id}
                            index={i}
                            outlet={outlet}
                            statsTime={statsTime}
                            statsAfterISO={this.getStatsISO(statsTime)}
                            loadMorePurchases={this.loadMorePurchases}
                            onMove={this.onMove}
                            draggable
                        />
                    );
                })}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(PurchasesOutlets);
