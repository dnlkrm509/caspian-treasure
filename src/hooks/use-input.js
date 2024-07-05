import { useState } from "react";

const useInput = (validateValue) => {
    const [value, setValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const valueIsValid = validateValue(value);
    const inputIsInvalid = !valueIsValid && isTouched;

    const valueChangeHandler = (event) => {
        setValue(event.target.value);
    };

    const inputBlurHandler = () => {
        setIsTouched(true);
    };

    const reset = () => {
        setValue('');
        setIsTouched(false);
    };

    return {
        value: value,
        isValid: valueIsValid,
        inputIsInvalid: inputIsInvalid,
        valueChangeHandler: valueChangeHandler,
        inputBlurHandler: inputBlurHandler,
        reset: reset
    }
};

export default useInput;
