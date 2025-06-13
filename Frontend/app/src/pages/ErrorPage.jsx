import React from 'react'
import NavBar from "./NavBar"

export default function ErrorPage() {
  return (
    <>
    <NavBar />
    <div style={{ padding: 20 }}>
      <h1>Oops! Something went wrong.</h1>
    </div>
    </>
  );
}
