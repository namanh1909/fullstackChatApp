import { Action, UPLOAD_IMAGE_PROGRESS } from "../actionType";


// Reducer
const initialState = {
    uploading: false,
    error: null,
    progress: 0,
    urls: [],
};

export default function (state = initialState, action: Action) {
    switch (action.type) {

        case 'UPLOAD_PROGRESS':
            return {
                ...state,
                progress: action.payload.progress,
            };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                progress: 0,
                error: null,
            };
        case 'UPLOAD_ERROR':
            return {
                ...state,
                progress: null,
                error: action.payload.error,
            };

        case 'UPLOAD_IMAGES':
            return {
                ...state,
                uploading: true,
                error: null,
                progress: 0,
                urls: [],
            };
        case 'UPLOAD_PROGRESS':
            return {
                ...state,
                progress: action.payload.progress,
            };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                urls: [...state.urls, action.payload.url],
            };
        case 'UPLOAD_ERROR':
            return {
                ...state,
                error: action.payload.error,
                process: 0,
            };
        case 'UPLOAD_COMPLETE':
            return {
                ...state,
                uploading: false,
                progress: 0,
                urls: action.payload.urls,
            };
        default:
            return state;
    }
};