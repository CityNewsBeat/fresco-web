import React, { PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import utils from 'utils';
import api from 'app/lib/api';
import Marker from 'react-google-maps/lib/Marker';
import GMap from '../global/gmap';
import GoogleMap from '../googleMap';
import VanillaMarker from '../googleMap/marker';

/**
 * AssignmentMap
 * Map component for assignment detail page
 *
 * @extends {React}
 */
class AssignmentMap extends React.Component {
    static propTypes = {
        markerData: PropTypes.array,
        mapPanTo: PropTypes.object,
        onMouseOverMarker: PropTypes.func,
        onMouseOutMarker: PropTypes.func,
        assignment: PropTypes.object,
    }

    shouldComponentUpdate(nextProps) {
        if (!isEqual(this.props.assignment.location, nextProps.assignment.location)) {
            return true;
        }

        if (this.props.markerData !== nextProps.markerData) return true;

        if (!isEqual(this.props.mapPanTo, nextProps.mapPanTo)) {
            return true;
        }

        return false;
    }

    renderDataMarkers() {
        const { markerData, onMouseOverMarker, onMouseOutMarker } = this.props;
        if (!markerData || !markerData.length) return null;

        const markerImage = m => ({
            url: m.active ? m.iconUrl.active : m.iconUrl.normal,
            size: new google.maps.Size(108, 114),
            scaledSize: new google.maps.Size(36, 38),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(18, 19),
        });

        return markerData
        .map((m, i) => (
            <Marker
                key={`marker-${i}`}
                position={m.position}
                icon={markerImage(m)}
                zIndex={m.active ? 3 : 1}
                draggable={false}
                onMouseover={() => onMouseOverMarker(m.id)}
                onMouseout={() => onMouseOutMarker(m.id)}
            />
        ))
        .filter(m => !!m);
    }

    renderDataMarkersNew() {
        const { markerData, onMouseOverMarker, onMouseOutMarker } = this.props;
        if (!markerData || !markerData.length) return null;

        const markerImage = m => ({
            url: m.active ? m.iconUrl.active : m.iconUrl.normal,
            size: new google.maps.Size(108, 114),
            scaledSize: new google.maps.Size(36, 38),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(18, 19),
        });

        return markerData
        .map((m, i) => (
            <VanillaMarker
                key={`marker-${i}`}
                position={m.position}
                icon={markerImage(m)}
            />
        ))
        .filter(m => !!m);
    }

    render() {
        const { assignment, mapPanTo } = this.props;
        const { location: { coordinates } } = assignment;
        const dataMarkers = this.renderDataMarkers();
        const dataMarkersNew = this.renderDataMarkersNew();
        const initialLocation = { lng: coordinates[0], lat: coordinates[1] };

        return (
            <div className="row">
                <div className="col-sm-11 col-md-10 col-sm-offset-1">
                    <GMap
                        ref={(r) => { this.gmap = r; }}
                        location={assignment.location}
                        radius={Math.round(utils.milesToFeet(assignment.radius))}
                        containerElement={<div className="assignment__map-ctr" />}
                        panTo={mapPanTo}
                        zoom={13}
                        markers={dataMarkers}
                        rerender
                        fitBoundsOnMount
                    />
                </div>
                <div className="col-sm-11 col-md-10 col-sm-offset-1">
                    <div className="assignment__map-ctr">
                        <GoogleMap
                            initialLocation={initialLocation}
                            zoom={13}
                            draggable={false}
                        >
                            {dataMarkersNew}
                        </GoogleMap>
                    </div>
                </div>
            </div>
        );
    }
}

export default AssignmentMap;

