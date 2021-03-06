import React, { PropTypes } from 'react';
import api from 'app/lib/api';
import utils from 'utils';

/**
 * Public gallery info aea
 */
class Info extends React.Component {
    static propTypes = {
        gallery: PropTypes.object,
    };

    state = {
        relatedGalleries: [],
        relatedStory: {
            galleries: [],
            title: '',
        },
    };

    componentDidMount() {
        this.loadRelatedGalleries();
        this.loadRelatedStory();
    }

	/**
	 * Loads related galleries for the components passed gallery based on its tags
	 * @return {[type]} [description]
	 */
    loadRelatedGalleries = () => {
        api
        .get('search', {
            galleries: {
                limit: 10,
                tags: this.props.gallery.tags.join(',')
            }
        })
        .then((res) => {
            this.setState({ relatedGalleries: res.galleries.results });
        });
    };

	/**
	 * Loads the first related story in the gallery
	 */
    loadRelatedStory = () => {
        const { gallery } = this.props;
        const story = gallery.stories ? gallery.stories[0] : null;
        if (!story) return;

        api
        .get(`story/${story.id}/galleries`)
        .then(res => {
            this.setState({
                relatedStory: {
                    galleries: res,
                    title: story.title,
                },
            });
        });
    };

    render() {
        const { gallery } = this.props;
        const { relatedStory, relatedGalleries } = this.state;
        let relatedGalleriesJSX = '';
        let relatedStoriesJSX = '';
        let relatedArticlesJSX = '';

        if (relatedStory.galleries.length > 0) {
            const galleries = relatedStory.galleries.map((g, i) => (
                <li key={i} className="gallery">
                    <a href={`/gallery/${g.id}`}>
                        <img
                            src={utils.formatImg(g.posts[0].image, 'small')}
                            role="presentation"
                        />
                    </a>
                </li>
            ));

            relatedStoriesJSX = (
                <InfoSection
                    title={`MORE FROM ${relatedStory.title.toUpperCase()}`}
                    list={galleries}
                />
            );
        }

        if (relatedGalleries.length > 0) {
            const galleries = relatedGalleries.map((g, i) => (
                <li key={i} className="gallery">
                    <a href={`/gallery/${g.id}`}>
                        <img
                            src={utils.formatImg(g.posts[0].image, 'small')}
                            role="presentation"
                        />
                    </a>
                </li>
            ));

            relatedGalleriesJSX = <InfoSection title="RELATED GALLERIES" list={galleries} />;
        }

        if (gallery.articles.length > 0) {
            const articles = gallery.articles.map((article, i) => (
                <li key={i} className="article">
                    <a href={article.link}>
                        <img
                            className="favicon"
                            src={utils.getFaviconForUrl(article.link)}
                            role="presentation"
                        />
                    </a>
                    <a href={article.link}>{article.title || article.link}</a>
                </li>
            ));

            relatedArticlesJSX = <InfoSection title="ARTICLES" list={articles} />;
        }

        return (
            <div className="column">
                {relatedStoriesJSX}
                {relatedGalleriesJSX}
                {relatedArticlesJSX}
            </div>
        );
    }
}

const InfoSection = ({ title, list }) => (
    <div className="gallery-info-section">
        <h2>{title}</h2>
        <ul>{list}</ul>
    </div>
);

InfoSection.propTypes = {
    title: PropTypes.string,
    list: PropTypes.node,
};

export default Info;
