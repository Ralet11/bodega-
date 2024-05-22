import React from 'react'
import { Toaster } from "react-hot-toast";

const ToasterConfig = () => {
  return (
    <div>
         <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{
            zIndex: 1000,
            marginTop: "5px",
            height: "150px",
          }}
          toastOptions={{
            className: "",
            duration: 3000,
            style: {
              background: "#ffc8c8",
              color: "#000",
              fontSize: "17px"
            },

            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
              },
              style: {
                background: "#00A868",
                color: "#FFFF",
                fontWeight: "bold"
              },
            },

            error: {
              duration: 3000,
              theme: {
                primary: "pink",
                secondary: "black",
              },
              style: {
                background: "#C43433",
                color: "#fff",
                fontWeight: "bold"
              },
            },
          }}
        />
    </div>
  )
}

export default ToasterConfig