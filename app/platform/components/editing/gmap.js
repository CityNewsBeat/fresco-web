import React, { PropTypes } from 'react';
import GoogleMapLoader from 'react-google-maps/lib/GoogleMapLoader';
import GoogleMap from 'react-google-maps/lib/GoogleMap';
import Marker from 'react-google-maps/lib/Marker';
import Circle from 'react-google-maps/lib/Circle';
import utils from 'utils';

/**
 * Single Edit-Map Element
 * @description Map element that is found in Gallery Edit, Admin Panel, etc.
 */
class GMap extends React.Component {
    componentDidMount() {
        const { updateCurrentBounds } = this.props;

        updateCurrentBounds(this._map ? this._map.getBounds() : {});
    }

    onPositionChanged() {
        const { onDataChange, updateCurrentBounds } = this.props;
        const pos = this._marker.getPosition();

        onDataChange({
            location: {
                lat: pos.lat(),
                lng: pos.lng(),
            },
            source: 'markerDrag',
        });

        updateCurrentBounds(this._map ? this._map.getBounds() : {});
    }

    getCenter() {
        // If location, get centroid of polygon, or use the point passed.
        // Otherwise use NYC for center.
        const { location } = this.props;
        if (location && location.type) {
            if (location.type.toLowerCase() === 'polygon') {
                return utils.getCentroid(location.coordinates);
            }

            if (location.type.toLowerCase() === 'point') {
                return { lng: location.coordinates[0], lat: location.coordinates[1] };
            }
        }

        return { lat: 40.7, lng: -74 };
    }

    renderMarker() {
        const { draggable } = this.props;
        const markerImage = {
            url: utils.assignmentImage[this.props.type],
            size: new google.maps.Size(108, 114),
            scaledSize: new google.maps.Size(36, 38),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(18, 19),
            crossOnDrag: false,
        };

        return (
            <Marker
                ref={(m) => this._marker = m}
                defaultPosition={this.getCenter()}
                draggable={draggable}
                icon={markerImage}
                onDragend={() => this.onPositionChanged()}
            />
        );
    }

    renderCircle() {
        const center = this._marker
            ? this._marker.getPosition()
            : this.getCenter();

        const circleOptions = {
            radius: utils.feetToMeters(this.props.radius) || 0,
            fillColor: utils.assignmentColor[this.props.type],
            fillOpacity: 0.26,
            strokeWeight: 0,
            draggable: false,
        };

        return (
            <Circle
                ref={(c) => this._circle = c}
                center={center}
                options={circleOptions}
            />
        );
    }

    render() {
        const { zoom, draggable } = this.props;
        const mapOptions = {
            mapTypeControl: false,
            disableDoubleClickZoom: true,
            scrollwheel: draggable,
            draggable,
        };

        return (
            <section style={{ height: '100%' }}>
                <GoogleMapLoader
                    containerElement={<div className="map-container" />}
                    googleMapElement={
                        <GoogleMap
                            ref={(map) => this._map = map}
                            defaultZoom={zoom}
                            defaultCenter={this.getCenter()}
                            options={mapOptions}
                        >
                            {this.renderMarker()}
                            {this.renderCircle()}
                        </GoogleMap>
                    }
                />
            </section>
        );
    }
}

GMap.propTypes = {
    onDataChange: PropTypes.func.isRequired,
    updateCurrentBounds: PropTypes.func.isRequired,
    radius: PropTypes.number,
    location: PropTypes.object,
    draggable: PropTypes.bool,
    type: PropTypes.string,
    zoom: PropTypes.number,
};

GMap.defaultProps = {
    radius: null,
    location: null,
    draggable: false,
    type: 'active',
    zoom: 12,
};

export default GMap;

