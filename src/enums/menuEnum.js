export const menuList = [
  {
    "ID": 1,
    "parentId": "0",
    "path": "team",
    "name": "team",
    "hidden": false,
    "component": "views/team/Team.vue",
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "团队",
      "icon": "House",
    },
    "authoritys": null,
    "children": null,
    "parameters": [],
    "btns": null
  },
  {
    "ID": 2,
    "parentId": "0",
    "path": "chat",
    "name": "chat",
    "hidden": false,
    "component": "views/chat/Chat.vue",
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "群聊",
      "icon": "ChatDotRound",
    },
    "authoritys": null,
    "children": null,
    "parameters": [],
    "btns": null
  },
  {
    "ID": 3,
    "parentId": "0",
    "path": "project",
    "name": "project",
    "hidden": false,
    "component": "views/project/Project.vue",
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "项目",
      "icon": "Files",
    },
    "authoritys": null,
    "children": [
      {
        "ID": 7,
        "parentId": 3,
        "path": "list",
        "name": "list",
        "hidden": false,
        "meta": {
          "activeName": "",
          "keepAlive": false,
          "defaultMenu": false,
          "title": "项目列表",
          "icon": "Document",
        },
        "authoritys": null,
        "children": null,
        "parameters": [],
        "btns": null
      },
      {
        "ID": 8,
        "parentId": 3,
        "path": "trash",
        "name": "trash",
        "hidden": false,
        "meta": {
          "activeName": "",
          "keepAlive": false,
          "defaultMenu": false,
          "title": "项目回收站",
          "icon": "DeleteFilled",
        },
        "authoritys": null,
        "children": null,
        "parameters": [],
        "btns": null
      },

    ],
    "parameters": [],
    "btns": null
  },
  {
    "ID": 4,
    "parentId": "0",
    "path": "me",
    "name": "me",
    "hidden": false,
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "我的",
      "icon": "User",
    },
    "authoritys": null,
    "children": [
      {
        "ID": 5,
        "parentId": 4,
        "path": "profile",
        "name": "profile",
        "hidden": false,
        "meta": {
          "activeName": "",
          "keepAlive": false,
          "defaultMenu": false,
          "title": "个人资料",
          "icon": "Avatar",
        },
        "authoritys": null,
        "children": null,
        "parameters": [],
        "btns": null
      },
      {
        "ID": 6,
        "parentId": 4,
        "path": "myteam",
        "name": "myteam",
        "hidden": false,
        "meta": {
          "activeName": "",
          "keepAlive": false,
          "defaultMenu": false,
          "title": "我的团队",
          "icon": "HomeFilled",
        },
        "authoritys": null,
        "children": null,
        "parameters": [],
        "btns": null
      },
    ],
    "parameters": [],
    "btns": null
  },
]

export const projectMenuList = [
  {
    "ID": 1,
    "parentId": "0",
    "path": "info",
    "name": "info",
    "hidden": false,
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "项目信息",
      "icon": "Document",
    },
    "authoritys": null,
    "children": null,
    "parameters": [],
    "btns": null
  },
  {
    "ID": 2,
    "parentId": "0",
    "path": "docs",
    "name": "docs",
    "hidden": false,
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "项目文档",
      "icon": "Document",
    },
    "authoritys": null,
    "children": null,
    "parameters": [],
    "btns": null
  },
  {
    "ID": 3,
    "parentId": "0",
    "path": "design",
    "name": "design",
    "hidden": false,
    "meta": {
      "activeName": "",
      "keepAlive": false,
      "defaultMenu": false,
      "title": "原型设计",
      "icon": "Document",
    },
    "authoritys": null,
    "children": null,
    "parameters": [],
    "btns": null
  },
]
