<template>
    <div>
        代码生成窗口
    </div>
</template>

<script>
export default {
  data() {
    return {
      elements: [
        {
          content: "Element 1",
          styles: "background-color: blue; color: white;",
        },
        {
          content: "Element 2",
          styles: "background-color: red; color: white;",
        },
        // ... 更多元素
      ],
    };
  },
  methods: {
    exportPrototype() {
      const htmlCode = this.generateHTML();
      const cssCode = this.generateCSS();
      const jsCode = this.generateJS();

      const exportData = "";

      const blob = new Blob([exportData], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prototype.html";
      a.click();
      URL.revokeObjectURL(url);
    },
    generateHTML() {
      const elementsHTML = this.elements.join("\n");

      return elementsHTML;
    },
    generateCSS() {
      const elementsCSS = this.elements
        .map((element, index) => `#element-${index} { ${element.styles} }`)
        .join("\n");

      return elementsCSS;
    },
    generateJS() {
      // 生成与页面交互相关的JavaScript代码
      return "";
    },
  },
};
</script>