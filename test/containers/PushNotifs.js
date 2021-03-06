import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import configureStore from 'app/redux/store/configureStore';
import * as pushActions from 'app/redux/modules/pushNotifs';
import PushNotifs from 'app/platform/containers/PushNotifs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DefaultTemplate from 'app/platform/components/pushNotifs/default-template';
import GalleryListTemplate from 'app/platform/components/pushNotifs/gallery-list-template';
import AssignmentTemplate from 'app/platform/components/pushNotifs/assignment-template';
import RecommendTemplate from 'app/platform/components/pushNotifs/recommend-template';
import TitleBody from 'app/platform/components/pushNotifs/title-body';
import { RestrictByLocation, RestrictByUser } from 'app/platform/components/pushNotifs/restrict-by';
import ChipInput from 'app/platform/components/global/chip-input';

let store;
let component;
describe('<PushNotifs />', () => {
    beforeEach(() => {
        store = configureStore();
        component = mount(
            <MuiThemeProvider>
                <PushNotifs store={store} />
            </MuiThemeProvider>
        );
    });

    it('should render', () => {
        expect(component).to.have.length(1);
    });

    it('should render a `push-notifs__tab` by default', () => {
        expect(component.find('div.push-notifs__tab')).to.have.length(1);
    });

    it('should render <DefaultTemplate /> by default', () => {
        expect(component.find(DefaultTemplate)).to.have.length(1);
        expect(component.find(TitleBody)).to.have.length(1);
        expect(component.find(RestrictByLocation)).to.have.length(1);
        expect(component.find(RestrictByUser)).to.have.length(1);
    });

    it('should render <GalleryListTemplate /> when set as active tab', () => {
        store.dispatch(pushActions.setActiveTab('gallery list'));
        expect(component.find(GalleryListTemplate)).to.have.length(1);
        expect(component.find(TitleBody)).to.have.length(1);
        expect(component.find(RestrictByLocation)).to.have.length(1);
        expect(component.find(RestrictByUser)).to.have.length(1);
        expect(component.find(ChipInput)).to.have.length(1);
    });

    it('should render <AssignmentTemplate /> when set as active tab', () => {
        store.dispatch(pushActions.setActiveTab('assignment'));
        expect(component.find(AssignmentTemplate)).to.have.length(1);
        expect(component.find(TitleBody)).to.have.length(1);
        expect(component.find(RestrictByLocation)).to.have.length(1);
        expect(component.find(RestrictByUser)).to.have.length(1);
        expect(component.find(ChipInput)).to.have.length(1);
    });

    it('should render <RecommendTemplate /> when set as active tab', () => {
        store.dispatch(pushActions.setActiveTab('recommend'));
        expect(component.find(RecommendTemplate)).to.have.length(1);
        expect(component.find(TitleBody)).to.have.length(1);
        expect(component.find(RestrictByLocation)).to.have.length(1);
        expect(component.find(RestrictByUser)).to.have.length(1);
        expect(component.find(ChipInput)).to.have.length(2);
    });

    // describe('<DefaultTemplate />', () => {
    //     it('should propagate changes to inputs to redux store', () => {
    //         component.find('input').first().simulate('change', { target: { value: 'test input' } });
    //         component
    //         .find('textarea').first()
    //         .simulate('change', { target: { value: 'test textarea' } });

    //         const templateState = store.getState().getIn(['pushNotifs', 'templates', 'default']);
    //         console.log('store', store.getState().toJS());
    //         expect(templateState.get('title')).to.equal('test input');
    //         expect(templateState.get('body')).to.equal('test textarea');
    //     });
    // });
});

