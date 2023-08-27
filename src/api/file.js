import service from "@/http/request.js";

const url = {
  uploadFile: "/file/upload",
  export: "/file/export",
  generatePreview: "/file/generatePreview",
  cancelPreview: "/file/cancelPreview",
  previewByCode: "/file/previewByCode",
  getpreviewList: "/file/getpreviewList",
};

export class File {
  static async generatePreview(data) {
    return service(url.generatePreview, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async cancelPreview(data) {
    return service(url.cancelPreview, {
      method: "post",
      responseType: "json",
      data,
    });
  }

  static async uploadFile(data) {
    return service(url.uploadFile, {
      method: "post",
      responseType: "json",
      data,
    });
  }
  static async exportFile(data) {
    return service(url.export, {
      method: "post",
      responseType: "blob",
      data,
    });
  }

  static async previewByCode(data) {
    return service(url.previewByCode, {
      method: "post",
      responseType: "json",
      data,
    });
  }
  
  static async getpreviewList(data) {
    return service(url.getpreviewList, {
      method: "post",
      responseType: "json",
      data,
    });
  }
}
