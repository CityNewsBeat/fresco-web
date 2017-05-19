import React from 'react';
import FrescoImage from 'app/platform/components/global/fresco-image';

export const StoryThumbnail = ({ src, location, postTime, key, unread }) => (
    <li key={ key }>
        <FrescoImage src={ src }/>
        <p className="post-location">{ location }</p>
        { unread && <div className="circle blue"></div> }
        <p className="post-time">{ postTime }</p>
    </li>
);
// @ttention add anchor point for storyLink
export const StoryViewAll = ({ storyLink, numLeft, owner }) => (
    <li className="story-more">
        <div className="story-num-left">{ `+${numLeft}` }</div>
        <p className="post-location">View all submissions</p>
        <p className="post-time">{ `See all of ${owner}'s content` }</p>
    </li>
)
