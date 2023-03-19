// Generate 100 fetch calls

const promises = new Array(100).fill(0).map((_, idx) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = fetch(`${process.env.VITE_API_URL}/${process.env.DEMO_PROJECT_ID || "TEST-PROJECT-ID"}/capture`)
      resolve(request)
    }, idx * 500)
  })
})

Promise.all(promises).then(() => {
  console.log(`Done for ${process.env.DEMO_PROJECT_ID || "TEST-PROJECT-ID"}`)
})

export {}
