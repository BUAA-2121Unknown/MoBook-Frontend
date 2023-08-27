import service from '@/utils/request'

export const createProject = (data) => {
  const form = [
    'orgId',
    'name',
    'description',
  ]
  return service({
    url: 'api/proj/create',
    method: 'post',
    data: fmtForm(data, form)
  })
}
