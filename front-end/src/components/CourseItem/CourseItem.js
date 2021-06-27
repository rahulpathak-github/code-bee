import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player/lazy'
import './CourseItem.css'
import { getCourseItem } from '../../network/ApiAxios'
import Discussion from '../Discussion/Discussion';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const tutorialSteps = [
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123439086-ff793b80-d5ee-11eb-9599-9e3834438a8c.png"
  },
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123439249-2cc5e980-d5ef-11eb-9e02-e18e82078110.png"
  },
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123439338-47985e00-d5ef-11eb-8f06-6f88d0e9a794.png"
  },
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123439417-5bdc5b00-d5ef-11eb-9600-25891c74f9ae.png"
  },
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123439532-79112980-d5ef-11eb-9a26-c18de23e68fe.png"
  },
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123439704-9fcf6000-d5ef-11eb-946f-0673782dcd0f.png"
  },
  {
    lable: "1", imgPath: "https://user-images.githubusercontent.com/63184114/123440002-f3da4480-d5ef-11eb-9188-50c7bdb3d028.png"
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
    marginLeft: '260px',
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: "hidden",
    display: "block",
    width: "100%"
  }
}));


function CourseItem(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [play, setPlay] = useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [visible, setVisible] = useState(0);
  const [id, setId] = useState(0);
  const [courseItem, setItem] = useState({});
  const fetchCourseItems = async () => {
    if (props.course !== null) {
      const courseItem = await getCourseItem(props.course.courseItems[id]._id)
      setItem(courseItem.data);
    }
  }
  useEffect(() => {
    fetchCourseItems()
  }, [id]);
  var content = () => { setVisible(0); if (play === 2) { setPlay(0); } }
  var notes = () => { setVisible(1); if (play === 2) { setPlay(0); } }
  var discussion = () => { setVisible(2); if (play === 2) { setPlay(0); } }
  var changeId = async (index) => {
    setId(index);
  }
  var visualize = () => { play === 0 ? setPlay(1) : setPlay(0); }
  var editor = () => {
    play === 2 ? setPlay(0) : setPlay(2);
    visible === 3 ? setVisible(0) : setVisible(3);
  }
  return (
    <div>
      <div>
        <div
          className="course-item-video embed-responsive embed-responsive-16by9"
          style={{ display: `${play == 0 ? 'block' : 'none'}` }}
        >
          <ReactPlayer className="video embed-responsive-item"
            width={"100%"} height={"auto"}
            controls
            styles={{ backgroundSize: "contain!important" }}
            url={courseItem.video} />
        </div>
        <div
          className={classes.root}
          style={{ display: `${play == 1 ? 'block' : 'none'}` }}
        >
          <Paper square elevation={0} className={classes.header}>
            <Typography>Sorting Visualization demo</Typography>
          </Paper>
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </div>
      </div>

      <div className="course-item-nav">
        <button className="btn btn-primary" onClick={content}>Content</button>
        <button className="btn btn-success" onClick={notes}>Notes</button>
        <button className="btn btn-danger btn-discussion" onClick={discussion}>Discussion</button>
        <button className="btn btn-warning" onClick={visualize}>
          {`${play == 0 ? 'Visualize' : 'Video'}`}
        </button>
        <button className="btn" onClick={editor}>
          {`${play == 2 ? 'Back' : 'Editor'}`}
        </button>
      </div>
      <div className="display">
        <div className="Course-main" style={{ display: `${visible == 0 ? 'block' : 'none'}` }}>
          <div class="list-group">
            {props.course ? props.course.courseItems.map((item, index) => (
              <a
                class={`list-group-item list-group-item-action ${id === index ? 'active' : ''}`}
                onClick={() => { changeId(index) }}>
                {item.name}
              </a>
            )) : null}
          </div>
        </div>
        <p className="course-item-overview" style={{ display: `${visible == 1 ? 'block' : 'none'}` }}>
          {courseItem.reading}
        </p>
        <div style={{ display: `${visible == 2 ? 'block' : 'none'}`, marginLeft: "5%", marginRight: "5%" }}>
          {courseItem._id ? <Discussion _id={courseItem._id} /> : null}
        </div>
        <div style={{ display: `${play == 2 ? 'block' : 'none'}` }}>
          <iframe
            src="https://trinket.io/embed/python/f7e7437066"
            width="100%" height="600"
            frameborder="0" marginwidth="0"
            marginheight="0" allowfullscreen
            style={{ minHeight: "90vh" }}
          />
        </div>
      </div>
    </div>
  )
}
export default CourseItem