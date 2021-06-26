import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import "./index.css"
function Index() {
  const listItems = ["Featured", "Pyhton", "Java", "Node.js", "Digital"]
  const user = localStorage.getItem("user");
  const imgLinks = [
    "https://user-images.githubusercontent.com/63184114/122943394-9c8c6800-d394-11eb-93df-710637ae1ea4.png",
    " https://assets.log2base2.com/Assets/Courses/dsC.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Tcs0JG3HR8oK6dZi3Si5IeJaADkskz20BQ&usqp=CAU",
    "https://www.educative.io/v2api/editorpage/5393602882568192/image/6038586442907648",
    "https://assets.log2base2.com/Assets/Courses/patterns.png",
    "data:image/jpeg;base64,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"
  ]
  const initialClasses = [];
  listItems.forEach(item => initialClasses.push(""))
  initialClasses[0] = "active"
  const [classes, setClasses] = useState(initialClasses)

  const changeActiveItem = (idx) => {
    const currentClasses = [];
    listItems.forEach(item => currentClasses.push(""))
    currentClasses[idx] = "active"
    console.log(currentClasses)
    setClasses(currentClasses)
  }

  const list = listItems.map(listItem => (
    <li
      key={listItems.indexOf(listItem)}
      onClick={() => changeActiveItem(listItems.indexOf(listItem))}
      className={classes[listItems.indexOf(listItem)]}>{listItem}</li>
  ))

  const imageCards = imgLinks.map(link => (
    <Link to={user ? "/course/index" : "/auth/login"}>
      <div className="itemm" key={imgLinks.indexOf(link)}>
        <img className="img11"
          src={link}
          alt=""
        />
        <h3>Start now</h3>
      </div>
    </Link>
  ))
  return (
    <>
      <div
      // className="main-content"
      >
        <div className="portfolio bg-gradient-success rounded" id="portfolio">
          <h1> Courses</h1>
          <ul>
            {list}
          </ul>
          <div className="containerr">
            {imageCards}


          </div>
        </div>
      </div>
    </>
  );
}

export default Index
