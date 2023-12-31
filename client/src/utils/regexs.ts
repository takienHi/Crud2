export const regexAlphabet = /^[a-zA-Z0-9_.-]*$/;
export const regexUserName = /([a-zA-Z0-9]+)/im;

export const regexEmail = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;

export const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,20}$/;
