import React from "react";
import '../App.css'

const Footer = () => {
    // border-top: 3px inset rgb(255 255 255);
    // /* border-radius: 2000px; */
    // background-color: #212529 !important;
    // color: white;
    // border-top-left-radius: 2000px;
    // border-top-right-radius: 2000px;

    const styleFooter = {
            borderTop : "3px inset #fff",
            color : "#fff",
            borderTopLeftRadius : "50px",
            borderTopRightRadius : "50px",
    }
    return (
        <footer className="container-fluid py-4" style={{...styleFooter}}>
            <div className="row">
                <div className="col-md-12"> 
                    <p className="text-center">&copy; TextEditor, 2024. All right reserved  </p>
                </div>
            </div>
        </footer>
    )
}
export default Footer