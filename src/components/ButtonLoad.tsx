import React from 'react'

function ButtonLoad({buttonName}:{buttonName:string}) {
  return (
    <><svg
    className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"
    viewBox="0 0 24 24"
  ></svg>
 {buttonName}
  </>
  )
}

export default ButtonLoad