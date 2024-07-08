import { Link } from 'react-router-dom';
import classes from './Nav.module.css';

function NavLgScreen() {
    return (
        <header className='max-w-5xl m-auto p-8 py-0 hidden md:flex justify-between fixed top-[6%] left-0'>
            <nav>
                <ul className='flex gap-4'>
                    <li>
                        <Link className='text-stone-500 hover:text-stone-800' to='/'>Home</Link>
                    </li>
                    <li>
                        <Link className='text-stone-500 hover:text-stone-800' to='/about'>About Us</Link>
                    </li>
                    <li>
                        <Link className='text-stone-500 hover:text-stone-800' to='/products'>Products</Link>
                    </li>
                    <li>
                        <Link className='text-stone-500 hover:text-stone-800' to='/contact'>Contact Us</Link>
                    </li>
                    <li>
                        <Link className='text-stone-500 hover:text-stone-800' to='/checkout'>Checkout</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default NavLgScreen;