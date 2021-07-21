const axios = require('axios')
const {
  getGroups,
  getGroupProjects,
  getProjectsFileRaw
} = require('./utils/gitlab.api')

//  todo 定时任务更新 gitlab [group, project, dependencies]
;
(async () => {
  // await syncGroups()
  await syncProjects()
  await syncDependencies()
})()

function request(config) {
  return axios({
    ...config,
    headers: {
      'PRIVATE-TOKEN': ''
    }
  })
}

async function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('-----waiting 10s----')
      resolve()
    }, 10000)
  })
}

/**
 * 同步 groups
 * @returns {Promise<void>}
 */
async function syncGroups() {
  const res = await getGroups()

  const newArrList = [...res.filter(item => !item.parent_id), ...res.filter(item => item.parent_id)]

  for (const item of newArrList) {
    const isExist = await request({
      method: 'get',
      url: `http://localhost:3001/api/collect/groups/${item.id}`
    })

    if (!isExist.data.data) {
      const addRes = await request({
        method: 'post',
        url: 'http://localhost:3001/api/collect/groups',
        data: {
          id: item.id,
          name: item.name,
          path: item.web_url,
          parentId: item.parent_id || 1
        }
      })
      console.log(addRes)
    }
  }
}

/**
 * 同步 projects
 * @returns {Promise<void>}
 */
async function syncProjects() {
  // 查全部 group
  const allGroupsRes = await request({
    method: 'get',
    url: 'http://localhost:3001/api/collect/groups/list'
  })

  // timeout 在这里过滤出去  .filter(item => item.id > 1172)
  const allGroups = allGroupsRes.data.data

  for (const item of allGroups) {
    // 根据 gid 查下面所有 project
    const gitlabProject = await getGroupProjects(item.id)

    async function mapGitlabProject(gitlabProjectElement) {
      // 查找是否存在  project
      const isExistProjectRes = await request({
        method: 'get',
        url: `http://localhost:3001/api/collect/projects/${gitlabProjectElement.id}`
      })

      if (!isExistProjectRes.data.data) {
        const projectParams = {
          id: gitlabProjectElement.id,
          name: gitlabProjectElement.name,
          path: gitlabProjectElement.web_url,
          gid: item.id
        }

        await request({
          method: 'post',
          url: 'http://localhost:3001/api/collect/projects',
          data: projectParams
        })
      }
    }

    console.log('groupId: ', item.id)
    // console.log('[gitlabProject]: ', gitlabProject)

    // const reverseList = gitlabProject.reverse()

    for (const gitlabProjectElement of gitlabProject) {
      console.log('projectId: ', gitlabProjectElement.id)
      console.log('projectName: ', gitlabProjectElement.name)
      console.log('projectUrl: ', gitlabProjectElement.web_url)

      await mapGitlabProject(gitlabProjectElement)
    }

    await sleep()
  }
}

/**
 * 同步 dependencies
 * @returns {Promise<void>}
 */
async function syncDependencies() {
  // 查全部 group
  const allProjectRes = await request({
    method: 'get',
    url: 'http://localhost:3001/api/collect/projects/list'
  })

  const allProjects = allProjectRes.data.data

  // 插入
  async function insertDependencies({ pid, version, name, isDev }) {
    // 查找是否存在
    const isExistDeRes = await request({
      method: 'post',
      url: 'http://localhost:3001/api/collect/dependencies/one',
      data: { pid, version, name }
    })

    if (!isExistDeRes.data.data) {
      await request({
        method: 'post',
        url: 'http://localhost:3001/api/collect/dependencies',
        data: { name, pid, version, isDev }
      })
    }
  }

  for (const project of allProjects) {
    const { devDependencies = undefined, dependencies = undefined } = await getProjectsFileRaw(project.id, 'package.json')
    await sleep()

    console.log(project.id)

    let reqData = {
      pid: project.id
    }

    if (devDependencies) {
      for (const name of Object.keys(devDependencies)) {
        reqData = {
          ...reqData,
          name,
          version: devDependencies[name],
          isDev: true
        }
        await insertDependencies(reqData)
      }
    }

    if (dependencies) {
      for (const name of Object.keys(dependencies)) {
        reqData = {
          ...reqData,
          name,
          version: dependencies[name],
          isDev: false
        }
        await insertDependencies(reqData)
      }
    }
  }
}
