import React, { PropTypes } from 'react';
import FitText from 'app/platform/components/global/fit-text';
import utils from 'utils';
import isNumber from 'lodash/isNumber';

export const UserStats = ({ mau, dau, galleryCount }) => (
    <div className="users">
        <ul>
            <li>
                <p>{mau}</p>
                <p>MAU</p>
            </li>
            <li>
                <p>{dau}</p>
                <p>DAU</p>
            </li>
            <li>
                <p>{galleryCount}</p>
                <p>galleries/user/day</p>
            </li>
        </ul>
    </div>
);

UserStats.propTypes = {
    mau: PropTypes.number,
    dau: PropTypes.number,
    galleryCount: PropTypes.number,
};

export const PurchaseStats = ({
    photo_count,
    video_count,
    assignment_count,
    margin,
    revenue,
}) => (
    <div className="revenue">
        <ul>
            <li>
                <span className="count">{isNumber(photo_count) ? photo_count : 'N/A'}</span>
                <span>{utils.isPlural(photo_count) ? 'photos' : 'photo'}</span>
            </li>
            <li>
                <span className="count">{isNumber(video_count) ? video_count : 'N/A'}</span>
                <span>{utils.isPlural(video_count) ? 'videos' : 'video'}</span>
            </li>
            <li>
                <FitText
                    text={isNumber(revenue) ? `$${revenue.toFixed(2)}` : 'N/A'}
                    defaultFontSize={16}
                    fitCharCount={8}
                    className="count"
                />
                <span>revenue</span>
            </li>
            <li>
                <FitText
                    text={isNumber(margin) ? `$${margin.toFixed(2)}` : 'N/A'}
                    defaultFontSize={16}
                    fitCharCount={8}
                    className="count"
                />
                <span>margin</span>
            </li>
            <li>
                <span className="count">{isNumber(assignment_count) ? assignment_count : 'N/A'}</span>
                <span>{utils.isPlural(assignment_count) ? 'assignments' : 'assignment'}</span>
            </li>
        </ul>
    </div>
);

PurchaseStats.propTypes = {
    photo_count: PropTypes.number,
    video_count: PropTypes.number,
    assignment_count: PropTypes.number,
    margin: PropTypes.number,
    revenue: PropTypes.number,
};

export const OutletGoal = ({ dailyVideoCount, adjustGoal, goal }) => {
    const percentage = 50;

    let circleColor = 'red';
    if (dailyVideoCount >= goal) circleColor = 'green';
    else if (dailyVideoCount > (0.25 * goal)) circleColor = 'orange';

    return (
        <div className="goal">
            <div className={`c100 p${percentage} circle small ${circleColor}`}>
                <p className="fraction">
                    <span className="numerator">
                        {dailyVideoCount}
                    </span>
                    <span className="denominator">
                        {`/${(goal || 0)}`}
                    </span>
                </p>

                <div className="slice">
                    <div className="bar" />
                    <div className="fill" />
                </div>
            </div>

            <div className="actions">
                <span
                    className="mdi mdi-minus"
                    onClick={() => adjustGoal(-1)}
                />
                <span
                    className="mdi mdi-plus"
                    onClick={() => adjustGoal(1)}
                />
            </div>
        </div>
    );
};

OutletGoal.propTypes = {
    dailyVideoCount: PropTypes.number,
    goal: PropTypes.number,
    adjustGoal: PropTypes.func,
};

