// https://github.com/erikras/ducks-modular-redux
import { combineReducers } from 'redux-immutable';
import { fromJS, Set, OrderedSet, List, Map } from 'immutable';
import api from 'app/lib/api';
import moment from 'moment';

// constants
// action types
export const SET_ACTIVE_TAB = 'moderation/SET_ACTIVE_TAB';
export const DISMISS_ALERT = 'moderation/DISMISS_ALERT';
export const SET_ALERT = 'moderation/SET_ALERT';
export const TOGGLE_SUSPENDED_DIALOG = 'moderation/TOGGLE_SUSPENDED_DIALOG';
export const TOGGLE_INFO_DIALOG = 'moderation/TOGGLE_INFO_DIALOG';
export const FETCH_GALLERIES_REQUEST = 'moderation/FETCH_GALLERIES_REQUEST';
export const FETCH_GALLERIES_SUCCESS = 'moderation/FETCH_GALLERIES_SUCCESS';
export const FETCH_GALLERIES_FAIL = 'moderation/FETCH_GALLERIES_FAIL';
export const FETCH_USERS_REQUEST = 'moderation/FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'moderation/FETCH_USER_SUCCESS';
export const FETCH_USERS_FAIL = 'moderation/FETCH_USER_FAIL';
export const FETCH_SUSPENDED_USERS_REQUEST = 'moderation/FETCH_SUSPENDED_USERS_REQUEST';
export const FETCH_SUSPENDED_USERS_SUCCESS = 'moderation/FETCH_SUSPENDED_USERS_SUCCESS';
export const FETCH_REPORTS_SUCCESS = 'moderation/FETCH_REPORTS_SUCCESS';
export const SET_REPORTS_INDEX = 'moderation/SET_REPORTS_INDEX';
export const TOGGLE_FILTER = 'moderation/TOGGLE_FILTER';
export const TOGGLE_SUSPEND_USER = 'moderation/TOGGLE_SUSPEND_USER';
export const TOGGLE_GALLERY_GRAPHIC = 'moderation/TOGGLE_GALLERY_GRAPHIC';
export const RESTORE_SUSPENDED_USER = 'moderation/RESTORE_SUSPENDED_USER';
export const CONFIRM_DELETE_CARD = 'moderation/CONFIRM_DELETE_CARD';
export const REQUEST_DELETE_CARD = 'moderation/REQUEST_DELETE_CARD';
export const CANCEL_DELETE_CARD = 'moderation/CANCEL_DELETE_CARD';
export const SET_CARD_OPACITY = 'moderation/SET_CARD_OPACITY';

const REPORTS_LIMIT = 10;

// action creators
export const setActiveTab = (activeTab) => ({
    type: SET_ACTIVE_TAB,
    activeTab,
});

export const dismissAlert = () => ({
    type: DISMISS_ALERT,
});

export const toggleSuspendedDialog = () => ({
    type: TOGGLE_SUSPENDED_DIALOG,
});

export const toggleInfoDialog = ({ open = false, header = '', body = '' }) => ({
    type: TOGGLE_INFO_DIALOG,
    open,
    header,
    body,
});

export const fetchSuspendedUsers = () => (dispatch, getState) => {
    const state = getState().getIn(['moderation', 'suspendedUsers']);
    if (state.get('loading')) return Promise.resolve();
    dispatch({ type: FETCH_SUSPENDED_USERS_REQUEST });

    return api
    .get('user/suspended')
    .then(res => (
        dispatch({
            type: FETCH_SUSPENDED_USERS_SUCCESS,
            data: res,
        })
    ));
};

export const fetchReports = ({ id, entityType, last }) => (dispatch) => {
    const urlBase = entityType === 'galleries' ? 'gallery' : 'user';

    return api
    .get(`${urlBase}/${id}/reports`, { last: last ? last.get('id') : null, limit: REPORTS_LIMIT })
    .then(res => {
        dispatch({
            type: FETCH_REPORTS_SUCCESS,
            reports: res,
            entityType,
            id,
        });
    })
    .catch(() => dispatch({
        type: SET_ALERT,
        data: 'Could not fetch reports',
    }));
};

export const fetchGalleries = () => (dispatch, getState) => {
    const state = getState().getIn(['moderation', 'galleries']);
    if (state.get('loading')) return Promise.resolve();
    dispatch({ type: FETCH_GALLERIES_REQUEST });

    const entities = state.get('entities');
    let last;
    if (entities.size > 0) last = entities.last();

    return api
    .get('gallery/reported', { last: last ? last.get('id') : null, limit: 10 })
    .then(res => {
        const curIds = state.get('entities').map(e => e.get('id')).toJS();
        const newObjs = res.filter(r => !curIds.includes(r.id));
        newObjs.forEach(r => dispatch(fetchReports({ id: r.id, entityType: 'galleries' })));

        dispatch({
            type: FETCH_GALLERIES_SUCCESS,
            data: newObjs,
        });
    })
    .catch((err) => {
        dispatch({
            type: FETCH_GALLERIES_FAIL,
            data: 'Could not fetch galleries.',
            err,
        });
    });
};

export const fetchUsers = () => (dispatch, getState) => {
    const state = getState().getIn(['moderation', 'users']);
    if (state.get('loading')) return Promise.resolve();
    dispatch({ type: FETCH_USERS_REQUEST });

    const entities = state.get('entities');
    let last;
    if (entities.size > 0) last = entities.last();

    return api
    .get('user/reported', { last: last ? last.get('id') : null, limit: 10 })
    .then(res => {
        const curIds = state.get('entities').map(e => e.get('id')).toJS();
        const newObjs = res.filter(r => !curIds.includes(r.id));
        newObjs.forEach(r => dispatch(fetchReports({ id: r.id, entityType: 'users' })));

        dispatch({
            type: FETCH_USERS_SUCCESS,
            data: newObjs,
        });
    })
    .catch(() => {
        dispatch({
            type: FETCH_USERS_FAIL,
            data: 'Could not fetch users.',
        });
    });
};

export const toggleFilter = (tab, filter) => ({
    type: TOGGLE_FILTER,
    tab,
    filter,
});

export const updateReportsIndex = (entityType, id, change) => (dispatch, getState) => {
    const reportData = getState().getIn(['moderation', 'reports', entityType, id], Map());
    const newIndex = (reportData.get('index', 0) + change) || 0;
    const reportsSize = reportData.get('reports', List()).size;

    if (newIndex < 0) return;
    if (newIndex >= reportsSize && reportsSize < REPORTS_LIMIT) return;
    if (newIndex >= reportsSize && reportsSize % 10 !== 0) return;
    if (newIndex >= reportsSize && newIndex >= REPORTS_LIMIT) {
        dispatch(fetchReports({
            id,
            entityType,
            last: reportData.get('reports', OrderedSet()).last(),
        }));

        return;
    }

    dispatch({
        type: SET_REPORTS_INDEX,
        entityType,
        ownerId: id,
        index: newIndex,
    });
};

export const toggleSuspendUser = (entityType, id) => (dispatch, getState) => {
    const state = getState().get('moderation');
    let user;
    let suspended_until = null;
    if (entityType === 'gallery') {
        user = state
            .getIn(['galleries', 'entities'])
            .find(g => g.get('id') === id)
            .get('owner');
    } else {
        user = state.getIn(['users', 'entities']).find(u => u.get('id') === id);
    }

    if (user.get('suspended_until')) {
        api
        .post(`user/${user.get('id')}/unsuspend`)
        .then(() => dispatch({
            type: TOGGLE_SUSPEND_USER,
            suspended_until,
            entityType,
            id,
        }))
        .catch(() => dispatch({
            type: SET_ALERT,
            data: 'Could not unsuspend user',
        }))
        .then(() => dispatch(fetchSuspendedUsers()));
    } else {
        suspended_until = moment().add(2, 'week').toISOString();
        api
        .post(`user/${user.get('id')}/suspend`, { suspended_until })
        .then(() => {
            dispatch({
                type: TOGGLE_SUSPEND_USER,
                suspended_until,
                entityType,
                id,
            });

            const name = user.get('username') ? `@${user.get('username')}` : user.get('full_name');
            dispatch(toggleInfoDialog({
                open: true,
                header: `Suspend ${name}`,
                body: `${name} will be given a 14-day suspension, which can be canceled at any time.`,
            }));
        })
        .catch(() => dispatch({
            type: SET_ALERT,
            data: 'Could not unsuspend user',
        }))
        .then(() => dispatch(fetchSuspendedUsers()));
    }
};

export const restoreSuspendedUser = (id) => (dispatch, getState) => {
    const user = getState()
        .getIn(['moderation', 'suspendedUsers', 'entities'])
        .find(u => u.get('id') === id);

    api
    .post(`user/${user.get('id')}/unsuspend`)
    .then(() => dispatch({
        type: RESTORE_SUSPENDED_USER,
        id,
    }))
    .catch(() => dispatch({
        type: SET_ALERT,
        data: 'Could not restore user',
    }));
};

export const toggleGalleryGraphic = (id) => (dispatch, getState) => {
    const nsfw = getState()
        .getIn(['moderation', 'galleries', 'entities'])
        .find(g => g.get('id') === id)
        .get('is_nsfw');

    api
    .post(`gallery/${id}/${nsfw ? 'sfw' : 'nsfw'}`)
    .then(() => dispatch({
        type: TOGGLE_GALLERY_GRAPHIC,
        id,
        nsfw: !nsfw,
    }))
    .catch(() => dispatch({
        type: SET_ALERT,
        data: 'Could not toggle graphic',
    }));
};

export const fadeOutCard = (entityType, id, cb) => (dispatch) => {
    let opacity = 1;
    dispatch({
        type: SET_CARD_OPACITY,
        entityType,
        opacity,
        id,
    });
    setTimeout(() => {
        opacity = 0;
        setTimeout(() => cb(entityType, id), 300);
        dispatch({
            type: SET_CARD_OPACITY,
            entityType,
            opacity,
            id,
        });
    }, 300);
};

export const skipCard = (entityType, id) => (dispatch) => (
    api
    .post(`${entityType}/${id}/report/skip`)
    .then(() => dispatch({
        type: CONFIRM_DELETE_CARD,
        id,
        entityType,
    }))
    .catch(() => dispatch({
        type: SET_ALERT,
        data: `Could not skip ${entityType}`,
    }))
);

export const requestDeleteCard = (entityType, id) => ({
    type: REQUEST_DELETE_CARD,
    entityType,
    id,
});

export const cancelDeleteCard = () => ({
    type: CANCEL_DELETE_CARD,
});

export const confirmDeleteCard = (entityType, id) => (dispatch) => {
    const params = entityType === 'user' ? { user_id: id } : {};
    const url = entityType === 'user' ? 'user/disable' : `gallery/${id}/delete`;

    api
    .post(url, params)
    .then(() => dispatch({
        type: CONFIRM_DELETE_CARD,
        id,
        entityType,
    }))
    .catch(() => dispatch({
        type: SET_ALERT,
        data: (entityType === 'gallery') ? 'Could not delete gallery' : 'Could not disable user',
    }));
};

const gallery = (state, action) => {
    if (state.get('id') !== action.id) {
        return state;
    }
    switch (action.type) {
    case TOGGLE_SUSPEND_USER:
        return state.mergeIn(['owner'], { suspended_until: action.suspended_until });
    case TOGGLE_GALLERY_GRAPHIC:
        return state.set('is_nsfw', action.nsfw);
    case SET_CARD_OPACITY:
        return state.set('opacity', action.opacity);
    default:
        return state;
    }
};

const galleries = (state = fromJS({
    entities: OrderedSet(),
    loading: false,
    requestDeleted: Map(),
}), action = {}) => {
    if (action.entityType && action.entityType !== 'gallery') return state;

    switch (action.type) {
    case FETCH_GALLERIES_REQUEST:
        return state.set('loading', true);
    case FETCH_GALLERIES_SUCCESS:
        return state
            .update('entities', g => g.concat(fromJS(action.data)))
            .set('loading', false);
    case FETCH_GALLERIES_FAIL:
        return state.set('loading', false);
    case SET_CARD_OPACITY:
    case TOGGLE_GALLERY_GRAPHIC:
    case TOGGLE_SUSPEND_USER:
        return state.update('entities', es => es.map(e => gallery(e, action)));
    case CONFIRM_DELETE_CARD:
        return state
            .update('entities', es => es.filterNot(e => e.get('id') === action.id))
            .set('requestDeleted', Map());
    case REQUEST_DELETE_CARD:
        return state.set('requestDeleted', fromJS({
            id: action.id,
            entityType: action.entityType,
        }));
    case CANCEL_DELETE_CARD:
        return state.set('requestDeleted', Map());
    default:
        return state;
    }
};

const user = (state, action) => {
    if (state.get('id') !== action.id) {
        return state;
    }
    switch (action.type) {
    case TOGGLE_SUSPEND_USER:
        return state.set('suspended_until', action.suspended_until);
    case SET_CARD_OPACITY:
        return state.set('opacity', action.opacity);
    default:
        return state;
    }
};

const users = (state = fromJS({
    entities: OrderedSet(),
    loading: false,
    requestDeleted: Map(),
}), action = {}) => {
    if (action.entityType && action.entityType !== 'user') return state;

    switch (action.type) {
    case FETCH_USERS_REQUEST:
        return state.set('loading', true);
    case FETCH_USERS_SUCCESS:
        return state
            .update('entities', u => u.concat(fromJS(action.data)))
            .set('loading', false);
    case FETCH_USERS_FAIL:
        return state.set('loading', false);
    case SET_CARD_OPACITY:
    case TOGGLE_SUSPEND_USER:
        return state.update('entities', es => es.map(e => user(e, action)));
    case CONFIRM_DELETE_CARD:
        return state
            .update('entities', es => es.filterNot(e => e.get('id') === action.id))
            .set('requestDeleted', Map());
    case REQUEST_DELETE_CARD:
        return state.set('requestDeleted', fromJS({
            id: action.id,
            entityType: action.entityType,
        }));
    case CANCEL_DELETE_CARD:
        return state.set('requestDeleted', Map());
    default:
        return state;
    }
};

const suspendedUsers = (state = fromJS({
    entities: OrderedSet(),
    loading: false,
}), action = {}) => {
    switch (action.type) {
    case FETCH_SUSPENDED_USERS_REQUEST:
        return state.set('loading', true);
    case FETCH_SUSPENDED_USERS_SUCCESS:
        return state
            .set('entities', OrderedSet(fromJS(action.data)))
            .set('loading', false);
    case RESTORE_SUSPENDED_USER:
        return state.update('entities', es => es.filterNot(s => s.get('id') === action.id));
    default:
        return state;
    }
};

const reports = (state = fromJS({
    galleries: {},
    users: {},
    loading: false,
}), action = {}) => {
    switch (action.type) {
    case FETCH_REPORTS_SUCCESS:
        return state.updateIn([action.entityType, action.id], Map(), r => fromJS({
            reports: r.get('reports', List()).concat(fromJS(action.reports)),
            index: r.get('index', 0),
        }));
    case SET_REPORTS_INDEX:
        return state.setIn([action.entityType, action.ownerId, 'index'], action.index);
    default:
        return state;
    }
};

const ui = (state = fromJS({
    activeTab: 'galleries',
    filters: fromJS({ galleries: Set(), users: Set() }),
    suspendedDialog: false,
    infoDialog: fromJS({ open: false, header: '', body: '' }),
    error: null,
    alert: null }), action = {}) => {
    switch (action.type) {
    case TOGGLE_SUSPENDED_DIALOG:
        return state.update('suspendedDialog', s => !s);
    case TOGGLE_INFO_DIALOG:
        return state.update('infoDialog', s => fromJS({
            open: !s.get('open'),
            header: action.header,
            body: action.body,
        }));
    case TOGGLE_FILTER:
        return state.updateIn(['filters', action.tab], f => {
            if (f.has(action.filter)) return f.delete(action.filter);
            return f.add(action.filter);
        });
    case SET_ACTIVE_TAB:
        return state
            .set('activeTab', action.activeTab.toLowerCase())
            .set('alert', null);
    case SET_ALERT:
        return state.set('alert', action.data);
    case DISMISS_ALERT:
        return state.set('alert', null);
    default:
        return state;
    }
};

export default combineReducers({
    galleries,
    users,
    suspendedUsers,
    reports,
    ui,
});

