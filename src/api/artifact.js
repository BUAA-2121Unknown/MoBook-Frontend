import service from "@/utils/request";
import { fmtForm } from "@/utils/common";

// 原型设计api
// yy更新原型设计基础字段
export const updatePrototypeInfo = (data) => {
  const form = ["projId", "itemId", "filename"];
  return service({
    url: "artifact/update/filename",
    method: "post",
    data: fmtForm(data, form),
  });
};
// yy创建原型设计
export const createPrototype = (data) => {
  const form = ["projId", "itemId", "filename", "prop", "live", "sibling", "content"];
  return service({
    url: "artifact/create/file",
    method: "post",
    data: fmtForm(data, form),
  });
};
// yy更新原型设计状态
export const updatePrototypeStatus = (data) => {
  const form = ["projId", "status", "items"];
  return service({
    url: "artifact/update/status",
    method: "post",
    data: fmtForm(data, form),
  });
};
// yy获取某项目下全部原型设计
export const getPrototypeList = (params) => {
  return service({
    url: "artifact/item/prototypes",
    method: "get",
    params: params,
  });
};
// yy根据token获取全部原型设计的列表
export const getPrototypeListWithToken = (params) => {
  return service({
    url: "artifact/share/prototypes",
    method: "get",
    params: params,
  });
};
// y获取指定id的原型设计数据
export const getPrototype = (params) => {
  return service({
    url: "artifact/file/download/content",
    method: "get",
    params: params,
  });
};
// yy保存指定id的原型设计数据
export const savePrototype = (data) => {
  const form = ["projId", "itemId", "version", "content"];
  return service({
    url: "artifact/file/upload/content",
    method: "post",
    data: fmtForm(data, form),
  });
};
// yy获取指定id的项目的原型设计token
export const getPrototypeToken = (params) => {
  return service({
    url: "live/token/get",
    method: "get",
    params: params,
  });
};
// yy创建指定id的项目的原型设计token
export const createPrototypeToken = (data) => {
  const form = ["projId", "itemId", "expires", "auth"];
  return service({
    url: "live/token/open",
    method: "post",
    data: fmtForm(data, form),
  });
};
// yy删除指定id的项目的原型设计token
export const revokePrototypeToken = (data) => {
  const form = ["token"];
  return service({
    url: "live/token/revoke",
    method: "post",
    data: fmtForm(data, form),
  });
};
// yy验证指定token的权限
export const verifyPrototypeToken = (params) => {
  return service({
    url: "live/token/auth",
    method: "get",
    params: params,
  });
};

// 项目文档api
// 创建文档
export const createDoc = (data) => {
  const form = ["projId", "name", "type", "live"];
  return service({
    url: "proj/artifact/create",
    method: "post",
    data: fmtForm(data, form),
  });
};
// 更新文档状态
export const updateDocStatus = (data) => {
  const form = ["status", "artifacts"];
  return service({
    url: "proj/artifact/status/update",
    method: "post",
    data: fmtForm(data, form),
  });
};
// 获取文档
export const getDoc = (params) => {
  return service({
    url: "proj/artifact/profile",
    method: "get",
    params: params,
  });
};

// 获取文档列表
export const getDocList = (params) => {
  return service({
    url: "proj/artifacts",
    method: "get",
    params: params,
  });
};

// 保存文档
export const saveDoc = (data) => {
  const form = ["artId", "file"];
  return service({
    url: 'proj/artifact/file/upload',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// @ 人
export const mention = (data) => {
  const form = [
    'projId',
    'fileId',
    'users'
  ]
  return service({
    url: 'notif/send/artat',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 生成文档分享的token
export const createDocToken = (data) => {
  const form = [
    'itemId',
    'expires',
    'auth',
    'projId',
  ]
  return service({
    url: 'live/token/open',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 获取文档token对应的权限
export const getDocAuth = (params) => {
  return service({
    url: "live/token/auth",
    method: "get",
    params: params,
  });
};

// 上传文档内容
export const uploadDoc = (data) => {
  const form = [
    'projId',
    'itemId',
    'content',
    'version',
  ]
  return service({
    url: 'artifact/file/upload/content',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 获取文档的所有版本
export const getAllVersions = (params) => {
  return service({
    url: "artifact/item/get",
    method: "get",
    params: params,
  });
};

// 获取指定文档指定版本
// projId
// itemId
// version
export const getDocVersion = (params) => {
  return service({
    url: "artifact/file/download/content",
    method: "get",
    params: params,
  });
};