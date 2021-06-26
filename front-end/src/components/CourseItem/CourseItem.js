import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player/lazy'
import './CourseItem.css'
import { getCourseItem } from '../../network/ApiAxios'
import Discussion from '../Discussion/Discussion';
function CourseItem(props) {
    const [visible, setVisible] = useState(0);
    const [id, setId] = useState(0);
    const [courseItem, setItem] = useState({});
    const fetchCourseItems = async () => {
        if (props.course !== null) {
            const courseItem = await getCourseItem(props.course.courseItems[id]._id)
            console.log(courseItem);
            setItem(courseItem.data);
        }
    }
    useEffect(() => {
        fetchCourseItems()
    }, [])
    var content = () => { setVisible(0); }
    var notes = () => { setVisible(1); }
    var discussion = () => { setVisible(2); }
    var changeId=async(index)=>{
        await setId(index);
        fetchCourseItems();
    }
    return (
        <div>
            <div>
                <div className="course-item-video embed-responsive embed-responsive-16by9">
                    <ReactPlayer className="video embed-responsive-item"
                        width={"100%"} height={"auto"}
                        controls
                        styles={{ backgroundSize: "contain!important" }}
                        url="https://www.youtube.com/embed/UPG2HafMsHQ" />
                </div>  
            </div>
            
            <div className="course-item-nav">
                <button className="btn btn-primary" onClick={content}>Content</button>
                <button className="btn btn-success" onClick={notes}>Notes</button>
                <button className="btn btn-danger btn-discussion" onClick={discussion}>Discussion</button>
            </div>            
            <div className="display">
                <div className="Course-main" style={{ display: `${visible == 0 ? 'block' : 'none'}` }}>
                    <div class="list-group">
                        {props.course ? props.course.courseItems.map((item,index)=>(
                            <a 
                            class={`list-group-item list-group-item-action ${id===index ? 'active':''}`}
                            onClick={()=>{changeId(index)}}>
                            {item.name}
                            </a>
                        )):null}
                    </div>
                </div>
                <p className="course-item-overview" style={{ display: `${visible == 1 ? 'block' : 'none'}` }}>
                    {courseItem.overView}
                </p>
                <div style={{ display: `${visible == 2 ? 'block' : 'none'}`, marginLeft: "5%", marginRight: "5%" }}>
                    {courseItem._id ? <Discussion _id={courseItem._id} /> : null}
                </div>
            </div>
        </div>
    )
}
export default CourseItem