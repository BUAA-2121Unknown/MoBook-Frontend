import {
  LAYOUT,
} from '@/router/constant'

const project = [
  {
    path: "/info",
    component: LAYOUT,
    children: [
      {
        path: "",
        name: "ProjectInfo",
        component: () => import("@/views/project/ProjectInfo.vue"),
        meta: {
          title: "项目详情",
        },
      },
    ],
  },
  {
    path: "/design",
    component: LAYOUT,
    children: [
      {
        path: "",
        name: "ProjectDesign",
        component: () => import("@/views/project/ProjectDesign.vue"),
        meta: {
          title: "项目原型设计",
        },
      },
    ],
  },
  {
    path: "/doc",
    component: LAYOUT,
    children: [
      {
        path: "",
        name: "ProjectDoc",
        component: () => import("@/views/project/ProjectDoc.vue"),
        meta: {
          title: "项目文档",
        },
      },
    ],
  },
];

export default project
