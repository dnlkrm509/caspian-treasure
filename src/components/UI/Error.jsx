function Error(props) {
    const classes = props.isNextLine ? undefined : 'flex gap-64';
    const pClasses = props.isNextLine ? undefined : 'mt-[2%] ml-[3%]';

    return (
        <div className={classes}>
            <div className="grow">
                <h1>{ props.title }</h1>
                <p className={pClasses}>{ props.body }</p>
            </div>
        </div>
    )
}

export default Error;