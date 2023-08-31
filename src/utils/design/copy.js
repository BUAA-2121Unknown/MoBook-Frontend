import ClipboardJS from "clipboard";

export const copyToClipboard = (str) => {
  console.log("开始复制", str);
  const clipboard = new ClipboardJS(".btn", {
    text: () => str,
  });
  // 监听复制成功事件
  clipboard.on("success", (e) => {
    console.log("复制成功:", e.text);
  });
  // 销毁Clipboard实例
  clipboard.destroy();
};
