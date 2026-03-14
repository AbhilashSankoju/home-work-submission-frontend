import api from './api'

export const assignmentService = {
  getAll:  ()       => api.get('/assignments').then(r => r.data),
  getById: (id)     => api.get(`/assignments/${id}`).then(r => r.data),
  create:  (data)   => api.post('/assignments', data).then(r => r.data),
  getMine: ()       => api.get('/assignments/my').then(r => r.data),
}
