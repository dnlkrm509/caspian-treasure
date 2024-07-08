import { useState } from "react";
import { Link } from "react-router-dom";
import classes from './Nav.module.css';

const NavSmScreen = () => {
    const [isShow, setIsShow] = useState(false);
    const showNavHandler = () => {
        setIsShow((prevState) => !prevState)
    }

    return (
        <header className="text-center w-full mt-[20px] mb-[70px] relative fixed top-0 left-0">
            {/* Button */}
                <button onClick={showNavHandler} className={`${classes.btn} hidden fixed top-[5%] right-[2%] h-[27px] w-[35px] cursor-pointer z-[100] ${isShow ?  'active' : ''}`}>
                    <span className="top"></span>
                    <span className="middle"></span>
                    <span className="bottom"></span>
                </button>


            {/* Links */}
            <div className={`${classes.overlay} h-full w-full invisible fixed top-0 left-0 z-[50] ${isShow ? 'open' : ''}`}>
                <nav>
                    <ul className={`${classes.links} flex w-full justify-around ${isShow ? 'active' : ''}`}>
                        <li onClick={() => setIsShow(false)}><Link to="/">Home</Link></li>
                        <li onClick={() => setIsShow(false)}><Link to="/about">About Us</Link></li>
                        <li onClick={() => setIsShow(false)}><Link to="/products">Products</Link></li>
                        <li onClick={() => setIsShow(false)}><Link to="/contact">Contact Us</Link></li>
                        <li onClick={() => setIsShow(false)}><Link to="/checkout">Checkout</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
};

export default NavSmScreen;
