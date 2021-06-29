const axios = require('axios')

function request(config) {
  return axios({
    ...config,
    headers: {
      'PRIVATE-TOKEN': 'XNxzJkzUHPy-R81r-WJT'
      // 'PRIVATE-TOKEN': 'BDgycbqLekgsEnwe8VyZ'
    }
  })
}

async function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 5000)
  })
}

async function getGroups() {
  console.log('-------start-------')
  const res = await request({
    method: 'get',
    url: 'http://gd-gitlab.dc.servyou-it.com/api/v4/groups'
  })

  console.log('----------gitlab---------')
  const newArrList = [...res.data.filter(item => !item.parent_id), ...res.data.filter(item => item.parent_id)]

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

async function getProjects() {
  // 查全部 group
  const allGroupsRes = await request({
    method: 'get',
    url: 'http://localhost:3001/api/collect/groups/list'
  })

  const allGroups = allGroupsRes.data.data.filter(item => item.id > 1246)
  console.log(allGroups)
  for (const item of allGroups) {
    // 根据 gid 查下面所有 project
    const gitlabProject = await request({
      method: 'get',
      url: `http://gd-gitlab.dc.servyou-it.com/api/v4/groups/${item.id}/projects`
    })

    async function mapGitlabProject(gitlabProjectElement) {
      // 查找是否存在  project
      const isExistProjectRes = await request({
        method: 'get',
        url: `http://localhost:3001/api/collect/projects/${gitlabProjectElement.id}`
      })

      console.log(isExistProjectRes.data.data)

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

    for (const gitlabProjectElement of gitlabProject.data) {
      await sleep()
      console.log('-----5s----')
      console.log('--------------')
      console.log(gitlabProjectElement.id, item.id)
      console.log(gitlabProjectElement.name, gitlabProjectElement.web_url)

      await mapGitlabProject(gitlabProjectElement)
    }
  }
}

// getGroups()
getProjects()