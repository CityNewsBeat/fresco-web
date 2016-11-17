import React, { PropTypes, Component } from 'react';
import last from 'lodash/last';
import ListItem from './list-item';

/**
 * Displays a list of purchase objects
 */
class PurchasesList extends Component {

    state = {
        loading: false,
        offset: 0,
        scrollable: true,
        purchases: [],
    }

    componentDidMount() {
        this.loadPurchases();
    }

    componentDidUpdate() {
        if (this.props.updatePurchases) this.loadPurchases();
    }

    /**
     * Loads initial set of purchases
     */
    loadPurchases = () => {
        this.props.loadPurchases({ cb: (purchases) => { this.setState({ purchases }); } });
    }

    // Handle purchases div scroll
    scroll(e) {
        if (this.state.loading) return;

        const grid = e.target;
        const bottomReached = grid.scrollTop > ((grid.scrollHeight - grid.offsetHeight) - 96);

        // Check if already getting purchases because async
        if (bottomReached) {
            this.setState({ loading: true });
            const cb = (purchases) => {
                // Disables scroll, and returns if purchases are empty
                if (!purchases || purchases.length === 0) {
                    this.setState({ scrollable: false });
                    return;
                }

                // Allow getting more purchases after we've gotten more purchases.
                // Update offset to new purchases length
                this.setState({
                    loading: false,
                    purchases: this.state.purchases.concat(purchases),
                });
            };

            // Pass current offset to getMorePurchases
            this.props.loadPurchases({ last: last(this.state.purchases).id, cb });
        }
    }

    render() {
        return (
            <div
                className="col-md-8 col-xs-12 list"
                onScroll={this.state.scrollable ? (e) => this.scroll(e) : null}
            >
                {this.state.purchases.map((purchase, i) => (
                    <ListItem
                        purchase={purchase}
                        title={purchase.title}
                        key={i}
                        showTitle
                    />
                ))}
            </div>
        );
    }
}

PurchasesList.propTypes = {
    updatePurchases: PropTypes.bool,
    loadPurchases: PropTypes.func.isRequired,
};

export default PurchasesList;

