import api from './api'

export const submissionService = {
  upload: (assignmentId, file, onProgress) => {
    const form = new FormData()
    form.append('assignmentId', assignmentId)
    form.append('file', file)
    return api.post('/submissions/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    }).then(r => r.data)
  },

  getByStudent:    (studentId)    => api.get(`/submissions/student/${studentId}`).then(r => r.data),
  getByAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`).then(r => r.data),
  viewFile:        (submissionId) => api.get(`/submissions/view/${submissionId}`, { responseType: 'blob' }).then(r => r.data),

  grade: (submissionId, data) => api.put(`/submissions/grade/${submissionId}`, data).then(r => r.data),
}
