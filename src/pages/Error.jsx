import NavLgScreen from "../components/Nav/NavLgSreen";
import NavSmScreen from "../components/Nav/NavSmScreen";
import Error from "../components/UI/Error";

function ErrorPage() {
    return (
        <>
            <NavLgScreen />
            <NavSmScreen />
            <main className="fixed t-[50px]">
                <Error title='An error occurred!' body='Could not find this page' isNextLine={true} />
            </main>
        </>
    )
}

export default ErrorPage;