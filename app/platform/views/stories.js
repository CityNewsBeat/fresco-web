import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import TopBar from './../components/topbar';
import StoryList from './../components/global/story-list';
import utils from 'utils';

/**
 * Stories Parent Object, contains StoryList composed of StoryCells
 */
class Stories extends React.Component {
    /**
     * Returns array of posts with offset and callback, used in child PostList
     */
    loadStories = (last, callback) => {
        const params = {
            last,
            limit: 20,
            sortBy: 'updated_at',
        };

        $.ajax({
            url: '/api/story/recent',
            type: 'GET',
            data: params,
            dataType: 'json',
            success: (stories) => callback(stories),
            error: (xhr, status, error) => {
                $.snackbar({ content:  'Couldn\'t fetch any stories!' });
            }
        });
    };

    render() {
        return (
            <App user={this.props.user} page="stories">
                <TopBar
                    title="Stories"
                    timeToggle
                    tagToggle
                />

                <StoryList
                    loadStories={this.loadStories}
                    scrollable
                />
            </App>
        );
    }
}

ReactDOM.render(
    <Stories user={window.__initialProps__.user} />,
    document.getElementById('app')
);
