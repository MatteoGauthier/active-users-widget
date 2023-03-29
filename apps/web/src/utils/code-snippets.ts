import shiki from "shiki";

export const getHighlightedWidgetSnippet = async (id?: string) => {
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
    langs: ["html"],
  });
  let raw = `<script data-project-id="%PROJECT_ID%" src="https://unpkg.com/active-users-widget" defer async></script>`;
  let highlighted = highlighter.codeToHtml(raw, {
    lang: "html",
  });

  if (id) {
    raw = raw.replace("%PROJECT_ID%", id);
    highlighted = highlighted.replace("%PROJECT_ID%", id);
  }

  return {
    highlighted,
    raw,
  };
};
