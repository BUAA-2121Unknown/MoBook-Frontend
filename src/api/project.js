import { fmtForm } from '@/utils/common'
import service from '@/utils/request';
// 获得项目基础字段
export const getProjectInfo = (params) => {
  return service({
    url: 'proj/profile',
    method: 'get',
    params: params,
  })
}
// 更新项目基础字段
export const updateProjectInfo = (data) => {
  const form = [
    'projId',
    'name',
    'description'
  ]
  return service({
    url: 'proj/profile/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

export const updateProjectStatus = (data) => {
  const form = [
    'status',   // 0, 1, 2
    'projects', // 列表
  ]
  return service({
    url: 'proj/status/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 创建原型设计
export const createPrototype = (data) => {
  const form = [
    'projId',
    'name',
    'type',
    'live',
  ]
  return service({
    url: 'proj/artifact/create',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 更新原型设计状态
export const updatePrototypeStatus = (data) => {
  const form = [
    'status',
    'artifacts',
  ]
  return service({
    url: 'proj/artifact/status/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 获取原型设计
export const getPrototype = (data) => {
  const form = [
    'artId',
  ]
  return service({
    url: 'proj/artifact/file/download',
    method: 'get',
    data: fmtForm(data, form)
  })
}
// 获取原型设计列表
export const getPrototypeList = (data) => {
  const form = [
    'projId',
  ]
  return service({
    url: 'proj/artifacts',
    method: 'get',
    data: fmtForm(data, form)
  })
}
// 保存原型设计
export const savePrototype = (data) => {
  const form = [
    'artId',
    'file',
  ]
  return service({
    url: 'proj/artifact/file/upload',
    method: 'post',
    data: fmtForm(data, form)
  })
}



const url = {
  getProjectList: "/project/list",
  deleteProject: "/project/delete",
  copyProject: "/project/copy",
  reNameProject: "/project/rename",
  getRecycleList: "/project/deletedList",
  finalDeleted: "/project/finalDeleted",
  recoverProject: "/project/recover",
  getUserProjectList: "/project/userList",
  getProjectInfo: "/project/detail",
  deleteResource: "/project/deleteResource",
  addDoc: "/project/addDoc",
  addUML: "/project/addUML",
  editUML: "/project/editUML",
  addProto: "/project/addProto",
  createProject: "/api/proj/create",
  deleteDoc: "/project/deleteDoc",
  deleteProto: "/project/deleteProto",
  deleteUML: "/project/deleteUML",
  unlockUML: "/project/unlockUML",
  saveProto: "/project/saveProto",
  getProto: "/project/getProto",
  searchMyProject: '/project/myKeyword',
  searchProject: '/project/keyword',
  sortByTime: '/project/sortByTime',
  mySortByTime: '/project/mySortByTime',
  sortByAlpha: '/project/sortByAlpha',
  mySortByAlpha: '/project/mySortByAlpha',
  changeProjectIntro: "/project/changeIntro",
  recycleSortByTime: '/project/recycleSortByTime',
  renameProto: '/project/renameProto',
  renameUML: '/project/renameUML',
  renameDoc: '/project/renameDoc',
};

// 创建项目
export const createProject = (data) => {
  const form = [
    'orgId',
    'name',
    'description',
  ]
  return service({
    url: 'proj/create',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 获取全部项目
export const getProjects = (params) => {
  return service({
    url: 'org/projects',
    method: 'get',
    params: params
  })
}

// 改变项目状态
export const updateStatus = (data) => {
  const form = [
    'status',
    'projects'
  ]
  return service({
    url: 'proj/status/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 生成项目副本
export const duplicateProject = (data) => {
  const form = [
    'projId'  // 项目 ID
  ]
  return service({
    url: 'proj/duplicate',
    method: 'post',
    data: fmtForm(data, form)
  })
}

export class Project {
  static async recycleSortByTime(data) {
    return service(url.recycleSortByTime, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async mySortByAlpha(data) {
    return service(url.mySortByAlpha, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async sortByAlpha(data) {
    return service(url.sortByAlpha, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async mySortByTime(data) {
    return service(url.mySortByTime, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async sortByTime(data) {
    return service(url.sortByTime, {
      method: "post",
      responseType: "json",
      data,
    });
  }


  static async searchProject(data) {
    return service(url.searchProject, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async searchMyProject(data) {
    return service(url.searchMyProject, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async editUML(data) {
    return service(url.editUML, {
      method: "post",
      responseType: "json",
      data,
    });
  }
  static async unlockUML(data){
    return service(url.unlockUML, {
      method: "post",
      responseType: "json",
      data,
    });
  }
  static async deleteUML(data) {
    return service(url.deleteUML, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async deleteProto(data) {
    return service(url.deleteProto, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async deleteDoc(data) {
    return service(url.deleteDoc, {
      method: "post",
      responseType: "json",
      data,
    });
  }


  static async addProto(data) {
    return service(url.addProto, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async addUML(data) {
    return service(url.addUML, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async addDoc(data) {
    return service(url.addDoc, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async getProjectInfo(data) {
    return service(url.getProjectInfo, {
      method: "post",
      responseType: "json",
      data,
    });
  }
  static async getUserProjectList(data) {
    return service(url.getUserProjectList, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async finalDeleted(data) {
    return service(url.finalDeleted, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async recoverProject(data) {
    return service(url.recoverProject, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async getRecycleList(data) {
    return service(url.getRecycleList, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async deleteProject(data) {
    return service(url.deleteProject, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async renameProject(data) {
    return service(url.reNameProject, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async getProjectList(data) {
    return service(url.getProjectList, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async saveProto(data) {
    return service(url.saveProto, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async getProto(data) {
    return service(url.getProto, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async copyProject(data) {
    return service(url.copyProject, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async changeProjectIntro(data) {
    return service(url.changeProjectIntro, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async renameProto(data) {
    return service(url.renameProto, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async renameUML(data) {
    return service(url.renameUML, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async renameDoc(data) {
    return service(url.renameDoc, {
      method: "post",
      responseType: "json",
      data,
    });
  }
}
