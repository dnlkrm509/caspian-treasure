import React, { useState } from 'react';
import axios from 'axios';

import './ContactForm.module.css';
import Card from '../UI/Card/Card';
import classes from './ContactForm.module.css';
import emailjs from 'emailjs-com';
import { useAnimate, stagger } from 'framer-motion';

const serviceId = import.meta.env.VITE_SERVICE_ID;
const templateId = import.meta.env.VITE_TEMPLATE_ID1;
const publicKey = import.meta.env.VITE_PUBLIC_KEY;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    from_name: '',
    from_email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const [subjectIsTouched, setSubjectIsTouched] = useState(false);
  const [nameIsTouched, setNameIsTouched] = useState(false);
  const [emailIsTouched, setEmailIsTouched] = useState(false);
  const [messageIsTouched, setMessageIsTouched] = useState(false);

  const [scope, animate] = useAnimate();

  function subjectHandleBlur () {
    setSubjectIsTouched(true);
  }

  function nameHandleBlur () {
    setNameIsTouched(true);
  }

  function emailHandleBlur () {
    setEmailIsTouched(true);
  }

  function messageHandleBlur () {
    setMessageIsTouched(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [`${name}`]: value
    });

  };

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid =
    formData.subject.trim() !== '' &&
    formData['from_name'].trim() !== '' &&
    re.test(formData['from_email']) &&
    formData.message.trim().length > 5;

    if (subjectIsTouched && formData.subject.trim() === '') {
      animate(
        'input, textarea',
        { x: [-10, 0, 10, 0] },
        { type: 'spring', duration: 0.2, delay: stagger(0.05) }
      );
    }

    if (nameIsTouched && formData['from_name'].trim() === '') {
      animate(
        'input, textarea',
        { x: [-10, 0, 10, 0] },
        { type: 'spring', duration: 0.2, delay: stagger(0.05) }
      );
    }

    if (emailIsTouched && !re.test(formData['from_email'])) {
      animate(
        'input, textarea',
        { x: [-10, 0, 10, 0] },
        { type: 'spring', duration: 0.2, delay: stagger(0.05) }
      );
    }

    if (messageIsTouched && formData.message.trim().length <= 5) {
      animate(
        'input, textarea',
        { x: [-10, 0, 10, 0] },
        { type: 'spring', duration: 0.2, delay: stagger(0.05) }
      );
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }

    try {
       emailjs.sendForm(serviceId, templateId, e.target, publicKey)
       .then((result) => {
         console.log(result.text);
       }, (error) => {
         console.log(error.text);
       });

      await axios.post('/api/message-from', { data: formData });

      setFormData({
        subject: '',
        from_name: '',
        from_email: '',
        message: ''
      });
  
      setSubjectIsTouched(false);
      setNameIsTouched(false);
      setEmailIsTouched(false);
      setMessageIsTouched(false);

      setSubmitted(true);

    } catch (error) {
      console.error('An error ocurred!', error);
    }

  };

  const subjectClasses = subjectIsTouched && formData.subject.trim() === '' ?
  `${classes.invalid} ${classes['input-field']}` : 
  `${classes['input-field']}`;

  const nameClasses = nameIsTouched && formData['from_name'].trim() === '' ? 
    `${classes.invalid} ${classes['input-field']}` : 
    `${classes['input-field']}`;

    const emailClasses = emailIsTouched && !re.test(formData['from_email']) ?
    `${classes.invalid} ${classes['input-field']}` : 
    `${classes['input-field']}`;
    
    const messageClasses = messageIsTouched && formData.message.trim().length <= 5 ?
    `${classes.invalid} ${classes['input-field']}` : 
    `${classes['input-field']}`;


  return (
    <div className='w-[70%] mx-auto'>
      <Card>
        <div className="contact-form-container">
        {submitted ? (
          <div className="thank-you-message">
            <button
              onClick={() => {
                  setSubmitted(false);
                  setFormData({subject: '', from_name: '', from_email: '', message: ''})
                }
              }
              className={`h-[12px] w-[20px] cursor-pointer font-medium`}
            >
                <span className="w-full h-[4px] flex translate-x-0 translate-y-[10px] rotate-45 bg-red-400"></span>
                <span className='mt-[16px] w-full flex h-[4px] translate-x-0 translate-y-[-10px] rotate-[-45deg] bg-red-400'></span>
            </button>
            <h2>Thank you for contacting us!</h2>
            <p>We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} ref={scope} className={classes.form}>
            <div className={classes.control}>
              <div className={subjectClasses}>
                <div className={classes.input}>
                  <label htmlFor="subject" className={classes.tlabel}>Subject:</label>
                  <input
                    type='text'
                    id='subject'
                    value={formData['subject']}
                    onChange={handleChange}
                    onBlur={subjectHandleBlur}
                    name='subject'
                    required
                  />
                </div>
                {subjectIsTouched && formData.subject.trim() === '' && <p className={classes["error-text"]}>Please enter the subject.</p>}
              </div>
            </div>
            <div className={classes.control}>
              <div className={nameClasses}>
                <div className={classes.input}>
                  <label htmlFor="name" className={classes.tlabel}>Name:</label>
                  <input
                    type='text'
                    id='name'
                    value={formData['from_name']}
                    onChange={handleChange}
                    onBlur={nameHandleBlur}
                    name='from_name'
                    required
                  />  
                </div>
                {nameIsTouched && formData['from_name'].trim() === '' && <p className={classes["error-text"]}>Please enter your name.</p>}
              </div>
            </div>
            <div className={classes.control}>
              <div className={emailClasses}>
                <div className={classes.input}>
                  <label htmlFor="email" className={classes.tlabel}>Email Address:</label>
                  <input
                    type='email'
                    id='email'
                    value={formData['from_email']}
                    onChange={handleChange}
                    onBlur={emailHandleBlur}
                    name='from_email'
                    required
                  />
                </div>
                {emailIsTouched && !re.test(formData['from_email']) && <p className={classes["error-text"]}>Please enter your email address.</p>}
              </div>
            </div>
            <div className={classes.control}>
              <div className={messageClasses}>
                <div className={classes.input}>
                  <label htmlFor="message" className={classes.tlabel}>Message:</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={messageHandleBlur}
                    minLength={5}
                    required
                  />
                </div>
                {messageIsTouched && formData.message.trim().length <= 5 && <p className={classes["error-text"]}>Message length must be at leat 6 characters (message greater than 5 characters)</p>}
              </div>
            </div>
            <div className={classes.control}>
                <div className={classes.button}>
                    <button disabled={!isFormValid} type='submit'>
                        Submit
                    </button>
                </div>
            </div>
          </form>
        )}
        </div>
      </Card>
    </div>
  );
};

export default ContactForm;