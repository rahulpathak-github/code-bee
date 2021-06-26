import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
import Index from "cviews/Index.js";
import CourseItem from "components/CourseItem/CourseItem";
import { getCourse } from '../network/ApiAxios'
// core components
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
class Course extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  async componentDidMount() {
    await this.fetchCourse()
  }
  id = this.props.id || "60d45fbda641138170c1d9be";
  fetchCourse = async () => {
    const course = await getCourse(this.id);
    this.setState({ course: course.data });
  }

  getRoutes = () => {
    try {
      console.log(this.state.course);
      return (
        [<Route
          render={() => (<Index course={this.state.course} />)}
          path="/course/index"
          key
        />,
        <Route
          render={() => (<CourseItem course={this.state.course} />)}
          path="/course/course-item"
        />]
      )
    }
    catch (e) {
      console.log(e);
    }
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png").default,
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <Switch>
            {this.getRoutes()}
            <Redirect from="*" to="/course/index" />
          </Switch>
        </div>
      </>
    );
  }
}

export default Course;
