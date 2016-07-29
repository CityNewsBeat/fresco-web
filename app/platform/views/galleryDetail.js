import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TopBar from './../components/topbar';
import PostList from './../components/global/post-list';
import Sidebar from './../components/gallery/sidebar';
import Edit from './../components/gallery/edit';
import App from './app';
import utils from 'utils';

/**
 * Gallery Detail Parent Object, made of a side column and PostList
 */

class GalleryDetail extends React.Component {
    constructor(props) {
        super(props);

        // Check if every post in gallery is not verified and show all content
        const shouldShowVerifiedToggle = props.gallery.posts.every(post => post.rating < 1);

        this.state = {
            editToggled: false,
            gallery: props.gallery,
            shouldShowVerifiedToggle,
            verifiedToggle: shouldShowVerifiedToggle,
            title: props.title,
            loading: false,
        };
    }

    onVerifiedToggled(onlyVerified) {
        this.setState({ onlyVerified });
    }

	/**
     * Updates gallery in state
     */
    onUpdateGallery(gallery) {
        let title = 'Gallery';

        if (gallery.posts && gallery.posts[0].location && gallery.posts[0].location.address) {
            title += ' from ' + gallery.posts[0].location.address;
        }

        this.setState({ gallery, title, updatePosts: true });
    }

    save(id, params) {
        if (!id || !params || this.state.loading) return;
        this.setState({ loading: true });

        $.ajax(`/api/gallery/${id}/update`, {
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify(params),
        })
        .done((res) => {
            // Update parent gallery
            this.onUpdateGallery(res);
            // Hide the modal
            this.toggleEdit();
        })
        .fail((err) => {
            $.snackbar({
                content: utils.resolveError(err, 'There was an error saving the gallery!'),
            });
        })
        .always(() => {
            this.setState({ loading: false });
        });
    }

    remove(id) {
        if (!id || this.state.loading) return;

        alertify.confirm('Are you sure you want to delete this gallery?', (confirmed) => {
            if (!confirmed) return;
            this.setState({ loading: true });

            $.ajax({
                url: `/api/gallery/${id}/delete`,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
            })
            .done(() => {
                $.snackbar({ content: 'Gallery deleted' });
                location.href = document.referrer || '/highlights';
            })
            .fail(() => {
                $.snackbar({ content: 'Unable to delete gallery' });
            })
            .always(() => {
                this.setState({ loading: false });
            });
        });
    }

    toggleEdit() {
        this.setState({ editToggled: !this.state.editToggled});
    }

    render() {
        const { user } = this.props;
        const {
            gallery,
            title,
            shouldShowVerifiedToggle,
            onlyVerified,
            updatePosts,
            editToggled,
            loading
        } = this.state;

        return (
            <App user={user}>
                <TopBar
                    title={title}
                    editable={user.rank >= utils.RANKS.CONTENT_MANAGER}
                    rank={user.rank}
                    edit={() => this.toggleEdit()}
                    verifiedToggle={shouldShowVerifiedToggle}
                    onVerifiedToggled={() => this.onVerifiedToggled()}
                    timeToggle
                />

                <Sidebar gallery={gallery} />

                <div className="col-sm-8 tall">
                    <PostList
                        rank={user.rank}
                        parentCaption={gallery.caption}
                        posts={gallery.posts}
                        onlyVerified={onlyVerified}
                        updatePosts={updatePosts}
                        scrollable={false}
                        editable={false}
                        size="large"
                    />
                </div>

                {editToggled
                    ? <Edit
                        toggle={() => this.toggleEdit()}
                        gallery={gallery}
                        user={user}
                        remove={(id) => this.remove(id)}
                        loading={loading}
                        save={(id, params) => this.save(id, params)}
                    />
                    : ''
                }

            </App>
        );
    }
}

GalleryDetail.propTypes = {
    user: PropTypes.object,
    gallery: PropTypes.object,
    title: PropTypes.string,
};

GalleryDetail.defaultProps = {
    gallery: {},
};

ReactDOM.render(
    <GalleryDetail
        user={window.__initialProps__.user}
        gallery={window.__initialProps__.gallery}
        title={window.__initialProps__.title}
    />,
    document.getElementById('app')
);