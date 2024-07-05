import { Fragment, useContext } from "react";

import NavLgScreen from "./NavLgSreen.jsx";
import NavSmScreen from "./NavSmScreen.jsx";
import HeaderCartButton from "./HeaderCartButton.jsx";
import classes from './Layout.module.css';
import CartContext from "../../store/cart-context.js";

const Layout = (props) => {
    const cartCtx = useContext(CartContext);
    
    const numberOfCartItems = cartCtx.items.reduce((currentNumber, item) => {
        return currentNumber + item.amount
      }, 0);

    return (
        <Fragment>
            <header className={classes.header}>    
                <NavSmScreen />
                <NavLgScreen />
                <section className={classes.section}>
                    <HeaderCartButton key={numberOfCartItems} onClick={props.onShowCart}/>
                </section>
            </header>
            <main className="mt-[100px]">{props.children}</main>
        </Fragment>
    )
}

export default Layout;