import React from "react";

const AuthHeader = () => {
    const goBack = () => {
        history.go(-1);
    }
    return (
        <div>
            <button className="btn-nav-back" onClick={goBack}>
                <div className="wrap header">
                    <svg className="icon-back" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none">
                        </path>
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z">
                        </path>
                    </svg>
                </div>
            </button>
        </div>
    )
}
export default AuthHeader