import { LAYOUT } from "@/router/constant";

const designPage = {
  path: "/prototype",
  component: LAYOUT,
  children: [
    {
      path: "",
      name: "Design",
      component: () => import("@/views/design/Home.vue"),
      meta: {
        title: "原型设计",
      },
    },
  ],
};

export default designPage;
