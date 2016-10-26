import React, { PropTypes } from 'react';
import ChipInput from '../global/chip-input';
import TitleBody from './title-body';
import { RestrictByLocation, RestrictByUser } from './restrict-by';

const onChangeAssignments = (onChange) => (assignments) => {
    onChange({ assignment: assignments[0]
        ? { id: assignments[0].id, title: assignments[0].title, body: assignments[0].caption }
        : null,
    });
};

const Template = ({
    assignment,
    onChange,
    ...props }) => (
    <div>
        <TitleBody onChange={onChange} {...props} />

        <ChipInput
            model="assignments"
            queryAttr="title"
            placeholder="Assignment"
            items={(assignment && [assignment]) || []}
            updateItems={onChangeAssignments(onChange)}
            multiple={false}
            className="push-notifs__chip-input"
            params={{ rating: '1' }}
            autocomplete
            idLookup
            initMaterial
        />

        <RestrictByLocation onChange={onChange} {...props} />
        <RestrictByUser onChange={onChange} {...props} />
    </div>
);


Template.propTypes = {
    assignment: PropTypes.object,
    onChange: PropTypes.func,
};

export default Template;
