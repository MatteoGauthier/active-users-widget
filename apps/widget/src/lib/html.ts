export const avatarElm = (e: string | number) =>
  `<img class="avatar" loading="lazy" src="https://i.pravatar.cc/20?${e}"></img>`

type Props = {
  count: number
  avatars: string[]
}

const formatter = Intl.NumberFormat("en", { notation: "compact" })

// @xxx ugly
export const template = (props: Props) => `
<div class="container">
  <div class="count-container">
      <div class="count-out">
        <div class="count-in"></div>
      </div>
      <p class="count-text"><b>${formatter.format(props.count)} utilisateurs</b> dans les 30 dernières minutes</p>
  </div>
  <div class="spacer"></div>
  <div class="avatars">
    ${avatarElm(props.avatars[1])}
    ${avatarElm(props.avatars[2])}
    ${avatarElm(props.avatars[3])}
    ${avatarElm(props.avatars[4])}
    ${avatarElm(props.avatars[5])}
  </div>
</div>
`
