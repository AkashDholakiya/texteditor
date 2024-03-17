import React from "react";
import '../App.css'

const Footer = () => {
    const styleFooter = {
        borderTop : "3px inset #fff",
        color : "#fff",
        borderTopLeftRadius : "10px",
        borderTopRightRadius : "10px",
    }
    return (
        <footer className="container-fluid py-4" style={{...styleFooter}}>
            <div className="row">
                <div className="col-md-12"> 
                    <p className="text-center">&copy; TextEditor, 2024. All right reserved</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer