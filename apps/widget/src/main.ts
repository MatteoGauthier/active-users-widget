import "./style.scss"

import { api } from "./lib/api"
import { WIDGET_CLASS } from "./lib/constants"
import { template } from "./lib/html"
import { log } from "./lib/log"

async function init() {
  let PROJECT_ID = "TEST-PROJECT-ID"
  let AUTOCAPTURE: string | boolean = true
  // @xxx maybe not the best wording
  let HEADLESS: string | boolean = false

  if (document.currentScript) {
    AUTOCAPTURE = document.currentScript.getAttribute("data-active-users-autocapture") || AUTOCAPTURE
    PROJECT_ID = document.currentScript.getAttribute("data-active-users-project-id") || PROJECT_ID
    HEADLESS = document.currentScript.getAttribute("data-active-users-headless") || HEADLESS
  }

  const existingWidgetElement = document.querySelector<HTMLDivElement>(`.${WIDGET_CLASS}`)

  if (!HEADLESS) {
    if (!existingWidgetElement) {
      const attachedUI = document.createElement("DIV")
      attachedUI.classList.add(WIDGET_CLASS)

      document.body.appendChild(attachedUI)
    }
    try {
      const widgetElement = document.querySelector<HTMLDivElement>(`.${WIDGET_CLASS}`)

      const stats = await api.getStatistics(PROJECT_ID)
      if (stats.keys.length !== 0 && widgetElement) {
        widgetElement.innerHTML = template({
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
    } catch (error) {
      // @todo handle error
    }
  }
  if (AUTOCAPTURE)
    try {
      await api.captureActivity(PROJECT_ID)
    } catch (error) {
      log("Issue while capturing user presence")
      // @todo handle error
    }
}

init()
