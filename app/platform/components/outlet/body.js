import React, { PropTypes } from 'react';
import Purchases from '../purchases/list-with-stats';
import PostList from '../post/list';
import Sidebar from './sidebar';

export default class Body extends React.Component {
    static propTypes = {
        outlet: PropTypes.object,
        user: PropTypes.object,
        activeTab: PropTypes.string,
    };

    state = {
        posts: [],
        purchases: [],
    };

    /**
     * Loads posts using purchases data enpoint
     */
    loadPosts = (last, cb) => {
        this.loadPurchases(last, (purchases) => {
            if (!purchases) {
                cb([]);
                return;
            }

            const posts = [];

            for (let i = 0; i < purchases.length; i++) {
                if(purchases[i].post) {
                    posts.push(Object.assign(purchases[i].post, { purchase_id: purchases[i].id }));
                }
            }

            cb(posts);
        });
    };

    /**
     * Loads stats for purchases
     */
    loadStats = (callback) => {
        const params = {
            outlet_ids: [this.props.outlet.id],
        };

        $.ajax({
            url: '/api/purchase/stats',
            type: 'GET',
            data: $.param(params),
        })
        .done(callback)
        .fail(() => {
            $.snackbar({ content: 'There was an error receiving purchases!' });
        });
    };

	/**
	 * Requests purchases from server
	 */
    loadPurchases = (last = null, cb) => {
        const params = {
            outlet_ids: [this.props.outlet.id],
            limit: 20,
            sortBy: 'created_at',
            last,
        };

        $.ajax({
            url: '/api/purchase/list',
            type: 'GET',
            data: $.param(params),
        })
        .done(cb)
        .fail(() => {
            $.snackbar({ content: 'There was an error receiving purchases!' });
            cb([]);
        });
    };

    downloadExports = () => {
        const oultet = `outlet_ids[]=${this.props.outlet.id}`;
        const u = encodeURIComponent(`/purchase/report?${oultet}`);
        const url = `/scripts/report?u=${u}&e=Failed`;

        window.open(url, '_blank');
    };

    render() {
        const { outlet, user, activeTab } = this.props;

        return (
            <div className="container-fluid tabs">
                <div className={`tab ${activeTab === 'Vault' ? 'toggled' : ''}`}>
                    <div className="container-fluid fat">
                        <div className="profile visible-xs" />

                        <Sidebar outlet={outlet} />

                        <div className="col-sm-8 tall">
                            <PostList
                                loadPosts={this.loadPosts}
                                size="large"
                                editable={false}
                                paginateBy="purchase_id"
                                allPurchased
                                scrollable
                                user={user}
                                page="outlet"
                            />
                        </div>
                    </div>
                </div>
                <div className={`tab ${activeTab === 'Purchases' ? 'toggled' : ''}`}>
                    <Purchases
                        downloadExports={this.downloadExports}
                        loadPurchases={this.loadPurchases}
                        loadStats={this.loadStats}
                    />
                </div>
            </div>
        );
    }
}
