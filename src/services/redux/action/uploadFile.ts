



export const uploadingStarted = () => ({
    type: 'UPLOADING_STARTED'
});

export const uploadingProgress = (percentage: any) => ({
    type: 'UPLOADING_PROGRESS', payload: { percentage }
});

export const uploadingFinished = () => ({
    type: 'UPLOADING_FINISHED'
});

export const uploadingError = (error: any) => ({
    type: 'UPLOADING_ERROR', payload: { error }
});
