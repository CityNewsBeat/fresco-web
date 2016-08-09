import React, { PropTypes } from 'react';
import EditTags from './edit-tags';
import EditArticles from './edit-articles';
import EditStories from './edit-stories';
import EditPost from './edit-post';
import Slick from 'react-slick';
import utils from 'utils';

/**
 * Description : Component for creating a gallery
 * Gallery Create Parent Object
 */

class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            stories: [],
            articles: [],
            rating: 0,
            caption: '',
        };
    }

    componentDidMount() {
        $.material.init();
    }

    onCreate() {
        this.createGallery();
    }

    onChangeHighlighted() {
        this.setState({ rating: this.state.rating === 0 ? 3 : 0 });
    }

    /**
     * Clears the form of inputed data
     * @return {[type]} [description]
     */
    clear() {
        this.setState({
            tags: [],
            stories: [],
            articles: [],
            caption: '',
        });
    }

    /**
     * Creates the gallery on button click
 	 */
    createGallery() {
        const { caption, rating, tags, stories, articles } = this.state;
        const { posts, onHide, setSelectedPosts } = this.props;

        // Generate post ids for update
        const postIds = posts.map((p) => p.id);
        if (postIds.length === 0) {
            $.snackbar({ content: 'Galleries must have at least 1 post' });
            return;
        }
        const { stories_add, stories_new } = utils.getRemoveAddParams('stories', [], stories);
        const { articles_add, articles_new } = utils.getRemoveAddParams('articles', [], articles);

        const params = {
            caption,
            posts_add: postIds,
            tags,
            rating,
            stories_add,
            stories_new,
            articles_add,
            articles_new,
        };

        $.ajax({
            url: '/api/gallery/import',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify(params),
        })
        .done((res) => {
            onHide();
            setSelectedPosts([]);

            $.snackbar({
                content: 'Gallery successfully saved! Click here to view it',
                timeout: 5000,
            }).click(() => {
                const win = window.open(`/gallery/${res.id}`, '_blank');
                win.focus();
            });
        })
        .fail((err) => {
            $.snackbar({
                content: utils.resolveError(err, 'There was an error creating your gallery!'),
            });
        });
    }

    render() {
        const { posts, onHide } = this.props;
        const { caption, tags, stories, articles, rating } = this.state;

        const postsJSX = posts.map((p, i) => (
            <div key={i}>
                <EditPost post={p} />
            </div>
        ));

        return (
            <div>
                <div className="dim toggle-gcreate toggled" />

                <div className="edit panel panel-default toggle-gcreate gcreate toggled">
                    <div className="col-xs-12 col-lg-12 edit-new dialog">

                        <div className="dialog-head">
                            <span className="md-type-title">Create Gallery</span>
                            <span
                                className="mdi mdi-close pull-right icon toggle-edit toggler"
                                onClick={onHide}
                            />
                        </div>

                        <div className="dialog-foot">
                            <button
                                onClick={() => this.clear()}
                                type="button"
                                className="btn btn-flat"
                            >
                                Clear all
                            </button>
                            <button
                                onClick={() => this.onCreate()}
                                type="button"
                                className="btn btn-flat pull-right"
                            >
                                Save
                            </button>
                            <button
                                onClick={onHide}
                                type="button"
                                className="btn btn-flat pull-right toggle-gcreate toggler toggled"
                            >
                                Discard
                            </button>
                        </div>

                        <div className="dialog-body">
                            <div className="dialog-col col-xs-12 col-md-7 form-group-default">
                                <div className="dialog-row">
                                    <textarea
                                        value={caption}
                                        type="text"
                                        className="form-control floating-label"
                                        placeholder="Caption"
                                        onChange={(e) => this.setState({ caption: e.target.value })}
                                    />
                                </div>

                                <EditTags
                                    tags={tags}
                                    updateTags={(t) => this.setState({ tags: t })}
                                />

                                <EditStories
                                    stories={stories}
                                    updateStories={(s) => this.setState({ stories: s })}
                                />

                                <EditArticles
                                    articles={articles}
                                    updateArticles={(a) => this.setState({ articles: a })}
                                />

                                <div className="dialog-row">
                                    <div className="checkbox">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={rating === 3}
                                                onChange={() => this.onChangeHighlighted()}
                                            />
                                            Highlighted
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Slick
                                dots
                                className="dialog-col col-xs-12 col-md-5"
                            >
                                {postsJSX}
                            </Slick>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Create.propTypes = {
    onHide: PropTypes.func.isRequired,
    setSelectedPosts: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired,
};

export default Create;

