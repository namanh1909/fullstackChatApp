import { UPLOAD_IMAGE_PROGRESS } from "../actionType";



export const uploadImageProgress = (progress: any) => ({
    type: UPLOAD_IMAGE_PROGRESS,
    payload: { progress },
});