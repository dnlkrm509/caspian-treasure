import { useRouteError } from 'react-router-dom';

import NavLgScreen from "../components/Nav/NavLgSreen";
import NavSmScreen from "../components/Nav/NavSmScreen";

function ErrorPage() {
    const error = useRouteError();
    console.log(error)
    const classes = error.data.isNextLine ? '' : 'flex flex-row gap-64';
    const pClasses = error.data.isNextLine ? '' : 'mt-[2%] ml-[3%]';

    let button;
    if (error.data.button) {
        button = <button
                    className="flex-none p-4 rounded-[20px] bg-amber-200 hover:bg-amber-300 active:bg-amber-400
                        focus:outline-none focus:ring focus:ring-amber-100"
                >
                    Try again
                </button>
    }


    let title = 'An error occurred!';
    let message = 'Something went wrong!';

    if (error.status === 500) {
        message = error.data.message;
    }

    if (error.status === 404) {
        title = 'Not found';
        message = 'Could not find resource or page.'
    }

    return (
        <>
            <NavLgScreen />
            <NavSmScreen />
            <main className="fixed t-[50px]">
                <div className={classes}>
                    {button}
                    <div className="grow">
                        <h1>{ title }</h1>
                        <p className={pClasses}>{ message }</p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ErrorPage;