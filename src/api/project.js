import service from "@/http/request.js";

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
  createProject: "/project/create",
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

  static async createProject(data) {
    return service(url.createProject, {
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
