// Taken from https://github.com/skoob13/react-masonry-infinite/blob/master/src/index.js

import React, { PropTypes, Component } from 'react';
import Bricks from 'bricks.js';
import InfiniteScroll from 'react-infinite-scroller';

export default class FrescoMasonry extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
        hasMore: PropTypes.bool,
        loader: PropTypes.element,
        loadMore: PropTypes.func,
        packed: PropTypes.string,
        pageStart: PropTypes.number,
        position: PropTypes.bool,
        sizes: PropTypes.array,
        style: PropTypes.object,
        threshold: PropTypes.number,
        useWindow: PropTypes.bool,
    }

    static defaultProps = {
        className: '',
        packed: 'data-packed',
        position: true,
        sizes: [
            { columns: 1, gutter: 20 },
            { mq: '768px', columns: 2, gutter: 20 },
            { mq: '1024px', columns: 3, gutter: 20 },
        ],
        style: {},
        useWindow: false,
        initialLoad: false,
        hasMore: true,
    }

    componentDidMount() {
        const { packed, sizes, children, position } = this.props;

        const instance = Bricks({
            container: this.masonryContainer,
            packed,
            sizes,
            position,
        });

        instance.resize(true);

        if (children.length > 0) {
            instance.pack();
        }

        this.setState({ instance });
    }

    componentDidUpdate(prevProps) {
        const { children } = this.props;
        const { instance } = this.state;

        if (this.props.forceUpdate) instance.pack();

        if (prevProps.children.length === 0 && children.length === 0) {
            return;
        }

        if (prevProps.children.length === 0 && children.length > 0) {
            return instance.pack();
        }

        if (prevProps.children.length !== children.length) {
            return instance.update();
        }
    }

    componentWillUnmount() {
        this.state.instance.resize(false);
    }

    render() {
        const {
            className,
            style,
            children,
            pageStart,
            loadMore,
            hasMore,
            loader,
            useWindow,
            initialLoad,
        } = this.props;

        return (
            <InfiniteScroll
                pageStart={pageStart}
                loadMore={loadMore}
                loader={loader}
                useWindow={useWindow}
                initialLoad={initialLoad}
                hasMore={hasMore}
            >
                <div
                    ref={(component) => this.masonryContainer = component}
                    className={className}
                    style={style}
                >
                    {children}
                </div>
            </InfiniteScroll>
        );
    }
}
