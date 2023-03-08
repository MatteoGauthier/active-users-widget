// Generate 100 fetch calls

const requests = new Array(100).fill(0).map(() => {
  return fetch(`${process.env.VITE_API_URL}/${process.env.DEMO_PROJECT_ID || "TEST-PROJECT-ID"}/capture`)
})

Promise.all(requests).then(() => {
  console.log(`Done for ${process.env.DEMO_PROJECT_ID || "TEST-PROJECT-ID"}`)
})
