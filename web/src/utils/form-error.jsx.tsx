import string from './../asset/strings.json';

export const formErrors = (
    value: any,
    maxValueLength?: number,
    minValueLength ?: number) => {
    { if (value) {
        switch (value.type) {
            case 'required':
                return (<span className={"field_required"}> {string.field_required} </span>);
            case'maxLength':
                return (<span> Ce champ doit comporter au maximum {` ${maxValueLength} `} caractères </span>);
            case'minLength':
                return (<span> Ce champ doit comporter au minimum{` ${minValueLength} `} caractères </span>);
        }
    } else return; }
};