import React from 'react';

/**
 * Suggestion List Parent Object
 * @description Suggestion Column
 */
export default class SuggestionList extends React.Component {
    state = { stories: [] };

    componentDidMount() {
        $.ajax({
            url: '/api/story/recent',
            type: 'GET',
            data: {
                limit: 8
            },
            dataType: 'json',
            success: (stories, status, xhr) => {
                if (status === 'success') {
                    //Set galleries from successful response
                    this.setState({ stories });
                }

            },
            error: (xhr, status, error) => {
                $.snackbar({content: 'Can\'t fetch stories'});
            }
        });

    }

    render() {
        return (
            <div className="col-md-4">
                <h3 className="md-type-button md-type-black-secondary">Recently Updated Stories</h3>
                <ul className="md-type-subhead trending-stories">
                    {this.state.stories.map((story, i) => {
                        return (
                            <li key={i}>
                                <a href={'/story/' + story.id}>{story.title}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}

