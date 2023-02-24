import { api } from "./lib/api"
import { template } from "./lib/html"
import "./style.css"

async function init() {
  let PROJECT_ID: string = "TEST-PROJECT-ID"
  let AUTOCAPTURE: string | boolean = true
  if (document.currentScript) {
    AUTOCAPTURE = document.currentScript.getAttribute("data-active-users-autocapture") || AUTOCAPTURE
    PROJECT_ID = document.currentScript.getAttribute("data-active-users-project-id") || PROJECT_ID
  }

  try {
    const stats = await api.getStatistics(PROJECT_ID)
    if (stats.keys.length !== 0) {
      document.querySelector<HTMLDivElement>(".active-users-widget")!.innerHTML = template({
        count: stats.keys.length,
        avatars: [
          "https://i.pravatar.cc/20?1",
          "https://i.pravatar.cc/20?2",
          "https://i.pravatar.cc/20?3",
          "https://i.pravatar.cc/20?4",
          "https://i.pravatar.cc/20?5",
        ],
      })
    }
  } catch (error) {}

  try {
    const capture = AUTOCAPTURE && (await api.captureActivity(PROJECT_ID))
  } catch (error) {
    log("Issue while capturing user presence")
  }
}

init()
