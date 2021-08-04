export const LogInButton = (props) => {
    if(props.waiting) {
        return (
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Waiting for API Respond...
            </button>
        );
    } else {
        return (
            <button className="btn btn-primary" onClick={props.onLogInBtnClick}>Log In</button>
        );
    }
}