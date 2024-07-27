function Error(props) {
    const classes = props.isNextLine ? undefined : 'flex gap-64';
    const pClasses = props.isNextLine ? undefined : 'mt-[2%] ml-[3%]';

    return (
        <div className={classes}>
            <div className="grow">
                <h1 className="text-base md:text-2xl lg:text-4xl">{ props.title }</h1>
                <p className={pClasses}>{ props.body }</p>
            </div>
        </div>
    )
}

export default Error;