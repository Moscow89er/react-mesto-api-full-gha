import { useState, useCallback } from 'react';

function useFormValidator (initialState) {
    const [formValues, setFormValues] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const handleInputChange = (evt) => {
        const  { name, value } = evt.target;
        setFormValues({...formValues, [name]: value});
        setFormErrors({...formErrors, [name]: evt.target.validationMessage});
        setIsValid(evt.target.closest('form').checkValidity());
    };

    const resetForm = useCallback(() => {
        setFormValues({});
        setFormErrors({});
        setIsValid(false);
    }, [setFormValues, setFormErrors, setIsValid]);

    return { formValues, formErrors, isValid, handleInputChange, resetForm, setFormValues };
}

export default useFormValidator;