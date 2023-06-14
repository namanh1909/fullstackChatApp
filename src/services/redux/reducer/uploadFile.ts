import { Action } from "../actionType";

let initialState: any = {
    isUploading: false,
    progressPercentage: 0,
    error: null,
};

export default function (state = initialState, action: Action) {
    switch (action.type) {
        case "SELECT_AND_UPLOAD_PDF": {
            return {
                ...state
            }
        }
        case 'UPLOADING_STARTED':
            return {
                ...state,
                isUploading: true,
                progressPercentage: 0,
                error: null,
            };
        case 'UPLOADING_PROGRESS':
            return {
                ...state,
                progressPercentage: action.payload.percentage,
            };
        case 'UPLOADING_FINISHED':
            return {
                ...state,
                isUploading: false,
                progressPercentage: 0,
                error: null,
            };
        case 'UPLOADING_ERROR':
            return {
                ...state,
                isUploading: false,
                progressPercentage: 0,
                error: action.payload.error,
            };
        default:
            return state;
    }
}
