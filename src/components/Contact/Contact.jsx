import ContactForm from "./ContactForm";
import classes from './Contact.module.css';

function Contact() {
    return (
        <div className="mt-[20%] md:mt-0">
            <section className={classes.summary}>
                <h2>Contact Us</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ornare venenatis felis at pulvinar. Etiam non eleifend sapien. Pellentesque nec orci vel elit consequat laoreet. Cras id fermentum turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel imperdiet purus, eget hendrerit ipsum. Duis quis commodo purus. In diam nibh, consequat ac posuere sit amet, condimentum in odio. Maecenas ultrices id ligula nec fringilla. Aenean pellentesque ac metus vitae porttitor. Vestibulum cursus aliquet magna vitae aliquam. Aenean faucibus tellus in tortor congue interdum non ut lorem. Aliquam ut ligula ac odio tincidunt tincidunt non sit amet arcu. Sed imperdiet ligula sit amet orci viverra auctor. In quam quam, cursus nec tortor ac, placerat mollis tortor.
                </p>
            </section>
            <section className="mt-[3%] md:mt-[1%]">
                <ContactForm />
            </section>
        </div>
    )
}

export default Contact;