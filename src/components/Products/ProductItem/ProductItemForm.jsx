import React, { useRef, useState } from "react";
import classes from './ProductItemForm.module.css';
import Input from '../../UI/Input/Input';

const ProductItemForm = (props) => {
    const amountInputRef = useRef();
    const [amountIsValid, setAmountIsValid] = useState(true);

    const submitHandler = event => {
        event.preventDefault();

        const enteredAmount = amountInputRef.current.value;
        const enteredAmountNumber = +enteredAmount;

        if (enteredAmount.trim().length === 0 || 
            enteredAmountNumber <= 0 || enteredAmountNumber > 5) {
                setAmountIsValid(false)
                return;
        };

        props.onAddToCart(enteredAmountNumber);
        setAmountIsValid(true);
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <Input
                ref={amountInputRef}
                input={{
                    type: 'number', 
                    id: 'amount_' + props.id,
                    min: '0',
                    max: '5',
                    step: '1',
                    defaultValue: '0'
                }}
                label='Amount'
            >
                Amount
            </Input>
            <button className="disabled:bg-[#ccc] disabled:hover:bg-[#ccc] disabled:border-0 disabled:cursor-not-allowed">
                + Add
            </button>
            {!amountIsValid && <p>Please enter a valid amount (0-5)</p>}
        </form>
    )
};

export default ProductItemForm;