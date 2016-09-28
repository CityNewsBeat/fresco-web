import React, { PropTypes } from 'react';
import utils from 'utils';

/**
 * Stateless image that manages an image error handler
 * @description Will set a timeout to keep loading the image if it 404s
 */
class FrescoImage extends React.Component {
    static propTypes = {
        size: PropTypes.string,
        src: PropTypes.string,
        updateImage: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        refreshInterval: PropTypes.bool,
    };

    static defaultProps = {
        size: 'small',
        refreshInterval: false,
        style: {},
        updateImage: () => {},
    };

    missingImageUrl = `${utils.CDN}/images/missing.png`;

    componentDidMount() {
        this.loadImage();
    }

    componentDidUpdate(prevProps) {
        const { src, size } = this.props;
        if ((src !== prevProps.src) || (size !== prevProps.size)) {
            this.loadImage();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.loadTimeout);
    }

    // async load image
    loadImage = () => {
        const { src, size, refreshInterval } = this.props;
        const formattedSrc = utils.formatImg(src, size);
        const imageObj = new Image();
        let timeout = 1000;

        const timeoutCB = () => {
            if (!this.img || this.img.src === formattedSrc) {
                clearTimeout(this.loadTimeout);
            } else {
                imageObj.src = formattedSrc;
                timeout += timeout;
            }
        };

        const onloadCB = () => {
            if (this.img) this.img.src = imageObj.src;
        };

        const onerrorCB = () => {
            if (this.img) this.img.src = this.missingImageUrl;
            this.props.updateImage(this.missingImageUrl);

            if (refreshInterval) {
                this.loadTimeout = setTimeout(timeoutCB.bind(this), timeout);
            }
        };

        imageObj.onload = onloadCB.bind(this);
        imageObj.onerror = onerrorCB.bind(this);

        imageObj.src = formattedSrc;
    }

    render() {
        return (
            <img
                className={this.props.className || 'img-cover'}
                style={this.props.style}
                role="presentation"
                ref={r => { this.img = r; }}
                onError={this.onError}
                src={this.missingImageUrl}
            />
        );
    }
}

export default FrescoImage;

