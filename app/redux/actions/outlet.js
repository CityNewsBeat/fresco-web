import api from 'app/lib/api';
import { enableLoading, toggleSnackbar } from './ui';

/**
 * Action types as consant
 */
export const RECEIVE_OUTLET = 'RECEIVE_OUTLET';
export const RECEIVE_MEMBERS = 'UPDATE_MEMBERS';
export const RECEIVE_PAYMENT_INFO = 'UPDATE_PAYMENT_INFO'

/**
 * Action creators
 */
export const receiveOutlet = (outlet) => ({
    type: RECEIVE_OUTLET,
    outlet
});


/**
 * Action creator for updating an outlet
 */
export const updateOutlet = (params, avatarFiles) => (dispatch) => {
    dispatch(enableLoading(true));

    api
        .post('outlet/update', params, {'TTL' : 0})
        .then(response => {
            dispatch(receiveOutlet(response));

            if(avatarFiles.length) {
                dispatch(updateAvatar(avatarFiles, true));
            } else {
                dispatch(enableLoading(false));
                dispatch(toggleSnackbar('Your info has been successfully saved!'))
            }
        })
        .catch(error => {
            dispatch(enableLoading(false));
            dispatch(toggleSnackbar('There was an error updating your settings!'))
        })
        .then(() => {
            dispatch(enableLoading(true));
        }) 
}

/**
 * Updates outlet avatar
 */
export const updateAvatar = (avatarFiles, calledWithInfo) => (dispatch) => {
    let files = new FormData();
    files.append('avatar', avatarFiles[0]);

    if(!calledWithInfo) dispatch(enableLoading(true));

    api
        .post('outlet/avatar', files, {'TTL' : 0})
        .then(response => {
            console.log(response);

            // dispatch(receiveOutlet(response));

            dispatch(enableLoading(false));
        })
        .catch(error => {
            dispatch(toggleSnackbar('There was an error updating your avatar!'))
            dispatch(enableLoading(false));
        })
}


/**
 * Action creator for updating members
 */
const updateMembers = (memberID) => (dispatch) => {
    
}