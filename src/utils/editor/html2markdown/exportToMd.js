import TurndownService from "turndown";

export function convertToMarkdown(html) {
  console.log(TurndownService)
  var turndownService = new TurndownService()
  return turndownService.turndown(html)
}

// export function convertToMarkdown(){
//   console.log("1")
// }
