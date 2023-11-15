function Greeting(props) {
    return (
        <h2>Hello, {props.name ? props.name : "Default"}</h2>
    )
}

export default Greeting; 