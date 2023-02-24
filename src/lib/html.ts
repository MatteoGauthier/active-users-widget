export const avatarElm = (e: string | number) =>
  `<img class="w-4 h-full border rounded-full border-white" loading="lazy" src="https://i.pravatar.cc/20?${e}"></img>`

type Props = {
  count: number
  avatars: string[]
}

// @xxx ugly
export const template = (props: Props) => `
<div class="inline-flex absolute bottom-5 right-5 transition-transform hover:scale-[1.03] ease-in duration-200 cursor-pointer hover:translate-y-[-2px] space-x-2 h-9 items-center justify-between px-3 bg-white shadow border rounded-md border-gray-200">
  <div class="flex space-x-1.5 items-center justify-start">
      <div class="w-3 h-3">
          <div class="flex items-center justify-center flex-1 h-full p-0.5 bg-blue-800 rounded-full">
              <div class="flex-1 h-full bg-white rounded-full"></div>
          </div>
      </div>
      <p class="text-xs text-[#8D8D8D]"><span class="text-[#373737] font-medium">${
        props.count
      } utilisateurs</span> dans les 30 dernières minutes</p>
  </div>
  <div class="w-4"></div>
  <div class="flex items-start justify-start -space-x-1">
    ${avatarElm(props.avatars[1])}
    ${avatarElm(props.avatars[2])}
    ${avatarElm(props.avatars[3])}
    ${avatarElm(props.avatars[4])}
    ${avatarElm(props.avatars[5])}
  </div>
</div>
`
