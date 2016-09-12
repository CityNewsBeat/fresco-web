import React, { PropTypes } from 'react';
import Slider from 'react-slick';
import find from 'lodash/find';
import get from 'lodash/get';
import FrescoImage from '../global/fresco-image';
import FrescoVideo from '../global/fresco-video';

const renderPost = (post) => {
    if (post.stream) {
        return (
            <FrescoVideo
                video={post.stream}
                thumbnail={post.image}
            />
        );
    }

    return (
        <FrescoImage
            src={post.image}
            size="medium"
            refreshInterval
        />
    );
};

const renderPosts = ({ editingPosts, originalPosts, onToggleDelete }) => (
    originalPosts.map((p, i) => {
        const deleteToggled = !find(editingPosts, { id: p.id });

        return (
            <div key={`post${i}`} className={`frick-frame ${deleteToggled ? 'frick-delete' : ''}`}>
                {renderPost(p)}
                <div className="frick-overlay">
                    <span>
                        <span className="mdi mdi-delete icon" />
                        <div className="md-type-caption">This post will be deleted</div>
                    </span>
                </div>
                {editingPosts.length > 1 ? (
                    <a className="frick-frame__delete-btn">
                        <span
                            className={`mdi mdi-close-circle icon ${deleteToggled ? 'addback' : ''}`}
                            onClick={() => onToggleDelete(p)}
                        />
                    </a>
                ) : null}
            </div>
        );
    })
);

const renderPostsNoDelete = (originalPosts) => {
    return (
        originalPosts.map((p, i) => (
            <div key={`post${i}`} className="frick-frame">
                {renderPost(p)}
            </div>
        ))
    )
}

const renderUpload = (upload, i) => {
    if ((!typeof i === 'number') || !upload || !upload.type || !upload.url) return null;

<<<<<<< HEAD
    console.log('UPLOAD', upload);

    if (upload.type.indexOf('image') > -1) {
        return (
            <div key={`upload${i}`} className="frick-frame">
                <img
                    role="presentation"
                    className="img-responsive"
                    src={upload.url}
                />
            </div>
        );
    } else if (upload.type.indexOf('video') > -1) {
        return (
            <div key={`upload${i}`} className="frick-frame">
                <FrescoVideo
                    type={upload.type}
                    video={upload.url} />
            </div>
=======
const renderUpload = (upload) => {
    if (upload.type.indexOf('image') > -1) {
        return (
            <img
                role="presentation"
                className="img-responsive"
                src={upload.url}
            />
>>>>>>> dev-V2API
        );
    } else if (upload.type.indexOf('video') > -1) {
        return <FrescoVideo type={upload.type} video={upload.url} />;
    }

    return null;
};

const renderUploads = ({ uploads, onToggleDelete }) => (
    uploads.map((u, i) => {
        const deleteToggled = u.deleteToggled;

        return (
            <div
                key={`upload${i}`}
                className={`frick-frame ${deleteToggled ? 'frick-delete' : ''}`}
            >
                {renderUpload(u, i)}
                <div className="frick-overlay">
                    <span>
                        <span className="mdi mdi-delete icon" />
                        <div className="md-type-caption">This post will be deleted</div>
                    </span>
                </div>
                <a className="frick-frame__delete-btn">
                    <span
                        className={`mdi mdi-close-circle icon ${deleteToggled ? 'addback' : ''}`}
                        onClick={() => onToggleDelete(u, i)}
                    />
                </a>
            </div>
        );
    })
);

/**
 * Component for managing gallery's posts
 */
class EditPosts extends React.Component {

    static propTypes = {
        originalPosts: PropTypes.array.isRequired,
        editingPosts: PropTypes.array,
        className: PropTypes.string,
        uploads: PropTypes.array,
        onToggleDeletePost: PropTypes.func,
        onToggleDeleteUpload: PropTypes.func,
        canDelete: PropTypes.bool,
    }

    static defaultProps = {
        canDelete: false,
        uploads: [],
        editingPosts: [],
        originalPosts: [],
        className: '',
    }

    componentDidUpdate(prevProps) {
        // // Reset slick to first index of we have different posts
        // if (get(prevProps, 'originalPosts[0].id') !== get(this.props, 'originalPosts[0].id')) {
        //     this.slider.slickGoTo(0);
        // }
    }

    render() {
        const {
            editingPosts,
            originalPosts,
            uploads,
            canDelete,
            onToggleDeletePost,
            onToggleDeleteUpload,
            className,
        } = this.props;

        const uploadsJSX = uploads.length
            ? renderUploads({ uploads, onToggleDelete: onToggleDeleteUpload })
            : null;

        const postsJSX = canDelete
            ? renderPosts({ editingPosts, originalPosts, onToggleDelete: onToggleDeletePost })
            : renderPostsNoDelete(originalPosts);

        return (
            <Slider
                className={className}
                ref={r => { this.slider = r; }}
                infinite={originalPosts.length > 1}
                swipeToSlide
                draggable
                dots
            >
                {uploadsJSX
                    ? postsJSX.concat(uploadsJSX)
                    : postsJSX
                }
            </Slider>
        );
    }
}

export default EditPosts;

