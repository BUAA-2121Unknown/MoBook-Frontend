import { Project } from "../api/project";

export function saveJSON(app) {
  const result = JSON.stringify({ array: app.controls });
  const data = new FormData();
  const protoId = app.$route.params.id;
  data.append("protoId", protoId);
  data.append("proto", result);
  Project.saveProto(data)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        ElMessage.success("保存成功！");
      } else {
        ElMessage.error("保存失败！");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // const blob = new Blob([result], { type: "application/json" });
  // const a = document.createElement("a");
  // a.href = URL.createObjectURL(blob);
  // a.download = "示例.json";
  // a.click();
}
