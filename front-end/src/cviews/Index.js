import "./index.css"
import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: '2rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',

  },
  head: {
    fontSize: '2rem'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },

}));

export default function VerticalLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = props.course.courseItems||[];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  useEffect(() => {
    console.log(props);
}, [])
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="course-landing">
      <div  className="course-point">
        <div className="course-write">
          <h1 className="course-h1">{props.course.name}</h1>
          <h4 className="course-h4">{props.course.summary}</h4>
          <Link to={`/course/course-item`}>
            <Button className="course-btn" variant="contained" >
              START
            </Button>
          </Link>
          
        </div>
        <div>
          <div className={classes.root}>
            <h2 className={classes.head} >Topics</h2>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label.name}</StepLabel>
                  <StepContent>
                    <Typography>{label.overView}</Typography>
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className={classes.button}
                        >
                          Back
                        </Button>
                        {(activeStep !== steps.length - 1) && <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          className={classes.button}
                        >
                          Next
                        </Button>}
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>
        <div className="course-bout">
         
        </div>
      </div>

    </div>
  );
}
