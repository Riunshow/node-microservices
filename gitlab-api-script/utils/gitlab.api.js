const request = require('./request')

/**
 * 获取所有 groups
 * @returns {AxiosPromise}
 */
function getGroups() {
  return request(`/groups`)
}

/**
 * 根据获取 group 下面所有 project
 * @param groupId
 * @returns {AxiosPromise}
 */
function getGroupProjects(groupId) {
  return request(`/groups/${groupId}/projects`)
}

/**
 * 获取 project 下面的 file
 * @param projectId
 * @param filePath
 * @param branch
 * @returns {AxiosPromise}
 */
function getProjectsFileRaw(projectId, filePath, branch = 'master') {
  return request(`/projects/${projectId}/repository/files/${filePath}/raw?ref=${branch}`)
}

module.exports = {
  getGroups,
  getGroupProjects,
  getProjectsFileRaw
}
