import React, { PropTypes } from 'react';
import get from 'lodash/get';
import FrescoImage from '../global/fresco-image';
import { CardBadges, CardUser, CardReports } from './card-parts';

const GalleryCard = ({
    posts,
    report_reasons,
    owner,
    caption = 'No caption',
    reports }) => (
    <div className="moderation-card moderation-card__gallery">
        <FrescoImage
            className="moderation-card__image"
            src={get(posts, '[0].image')}
            loadWithPlaceHolder
        />

        <div className="moderation-card__gallery-caption">
            {caption}
        </div>

        <CardBadges strings={report_reasons} />

        {owner && <CardUser user={owner} />}

        {reports && <CardReports reports={reports} />}

        <div className="moderation-card__actions-ctr">
            <span className="moderation-card__action">skip</span>
            <div>
                {report_reasons.includes('graphic') &&
                    <span className="moderation-card__action">mark graphic</span>}
                <span className="moderation-card__action">suspend user</span>
                <span className="moderation-card__action">delete</span>
            </div>
        </div>
    </div>
);

GalleryCard.propTypes = {
    posts: PropTypes.array.isRequired,
    report_reasons: PropTypes.array.isRequired,
    reports: PropTypes.array.isRequired,
    owner: PropTypes.object,
    caption: PropTypes.string,
};

export default GalleryCard;

