// 导出png
import html2canvas from "html2canvas";
import JsPDF from 'jspdf';
export const getSnapShot = async (elementId,name) => {
    const snapshotElement = document.getElementById(elementId)
    if (!snapshotElement) return ''
    const canvas = await html2canvas(snapshotElement, {
        allowTaint: false,
        useCORS: true
    })
    const shot = canvas.toDataURL('image/png')
    const a = document.createElement('a');
    a.href = shot;
    a.download = `${name}.png`;
    a.click();
    return shot;
}
// 导出pdf
export const html2pdf = async (elements, name = '未命名导出') => {
    
    let wrapper = document.createElement('div')
    wrapper.innerHTML = elements;
    console.log(wrapper.innerHTML);
    document.body.appendChild(wrapper);
    let pdfDom = wrapper;
    // allowTaint: true 表示允许跨越的图片
    html2canvas(pdfDom, {
      allowTaint: false,
      useCORS: true
    }).then((canvas) => {
        wrapper.remove();
      // a4纸的正常尺寸是宽592.28，高是841.89
      const pageWidth = 592.28*0.9
      const pageHeight = 841.89*0.9
      // 设置内容的宽高
      const contentWidth = canvas.width
      const contentHeight = canvas.height
      // 默认的偏移量
      let position = 0
      // 设置生成图片的宽高
      const imgCanvasWidth = pageWidth
      const imgCanvasHeight = (592.28 / contentWidth) * contentHeight
      let imageHeight = imgCanvasHeight
      // 生成canvas截图，1表示生成的截图质量（0-1）
      let pageData = canvas.toDataURL('image/jpeg', 1)
      // new JsPDF接收三个参数，landscape表示横向，（默认不填是纵向），打印单位和纸张尺寸
      let PDF = new JsPDF('p', 'pt', 'a4')
      // 当内容不超过a4纸一页的情况下
      if (imageHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 20, 20, imgCanvasWidth, imgCanvasHeight)
      } else {
        // 当内容超过a4纸一页的情况下，需要增加一页
        while (imageHeight > 0) {
          PDF.addImage(
            pageData,
            'JPEG',
            20,
            position,
            imgCanvasWidth,
            imgCanvasHeight
          )
          imageHeight -= pageHeight
          position -= pageHeight
          // 避免添加空白页
          if (imageHeight > 0) {
            PDF.addPage()
          }
        }
      }
      // 调用save方法生成pdf文件
      PDF.save(name + '.pdf')
    }).catch(err => {console.log(err)})
  }