import service from "@/utils/request"
import { fmtForm } from "@/utils/common"

/**
 * @params: { filename: "Doc", html: "<></>" }
 */
export const convertHtmlToDocx = (data) => {
    const form = [
        "filename",
        "html"
    ];

    return service({
        url: 'tool/html2docx',
        method: 'post',
        data: fmtForm(data, form)
    })
}
