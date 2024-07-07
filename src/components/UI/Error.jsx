function Error(props) {
    const classes = props.isNextLine ? undefined : 'flex gap-64';
    const pClasses = props.isNextLine ? undefined : 'mt-[2%] ml-[3%]';

    return (
        <div className={classes}>
            {props.button &&
            <button
                onClick={props.onClick}
                className="flex-none p-4 rounded-[20px] bg-amber-200 hover:bg-amber-300 active:bg-amber-400
                    focus:outline-none focus:ring focus:ring-amber-100"
            >
                Try again
            </button>}
            <div className="grow">
                <h1>{ props.title }</h1>
                <p className={pClasses}>{ props.body }</p>
            </div>
        </div>
    )
}

export default Error;