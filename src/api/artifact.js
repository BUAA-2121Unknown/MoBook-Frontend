import service from "@/utils/request";
import { fmtForm } from "@/utils/common";

// 原型设计api
// 更新原型设计基础字段
export const updatePrototypeInfo = (data) => {
  const form = ["artId", "name", "type"];
  return service({
    url: "proj/artifact/profile/update",
    method: "post",
    data: fmtForm(data, form),
  });
};

// 创建原型设计
export const createPrototype = (data) => {
  const form = ["projId", "name", "type", "live"];
  return service({
    url: "proj/artifact/create",
    method: "post",
    data: fmtForm(data, form),
  });
};
// 更新原型设计状态
export const updatePrototypeStatus = (data) => {
  const form = ["status", "artifacts"];
  return service({
    url: "proj/artifact/status/update",
    method: "post",
    data: fmtForm(data, form),
  });
};
// 获取原型设计列表
export const getPrototypeList = (params) => {
  return service({
    url: "proj/artifacts",
    method: "get",
    params: params,
  });
};
// 获取指定id的原型设计数据
export const getPrototype = (params) => {
  return service({
    url: "proj/artifact/file/download/content",
    method: "get",
    params: params,
  });
};
// 保存指定id的原型设计数据
export const savePrototype = (data) => {
  const form = ["artId", "filename", "content"];
  return service({
    url: "proj/artifact/file/upload/content",
    method: "post",
    data: fmtForm(data, form),
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
    'artId',
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
    'artId',
    'expires',
    'auth',
    'orgOnly'
  ]
  return service({
    url: 'live/token/create',
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