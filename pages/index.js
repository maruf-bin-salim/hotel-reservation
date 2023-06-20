import AuthUI from "@/components/AuthUI/AuthUI"

function Index() {
  return (
    <div>
      <h1>Next.js API</h1>
      <p>API version: beta 0.0.1</p>
    </div>
  )
}



export default function Page() {
  return (
    <AuthUI InnerComponent={Index} />
  )
}