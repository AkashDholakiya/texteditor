import React from "react";

const Footer = () => {
    const styleFooter = {
            borderTop : "3px inset #000",
            borderRadius : "2000px",
    }
    return (
        <footer className="container-fluid py-4 bg-body-tertiary" style={styleFooter}>
            <div className="row">
                <div className="col-md-12"> 
                    <p className="text-center">sample</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer