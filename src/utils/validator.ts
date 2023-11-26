class Validator {
    static isPhoneNumber(phoneNumber: string): boolean {
        const phoneNumberRegex = /^(\+234|0)[789]\d{9}$/;
        return phoneNumberRegex.test(phoneNumber);
    }

    static isEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isPassword(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    static isPasswordResetCode(passwordResetCode: string): boolean {
        const passwordResetCodeRegex = /^\d{6}$/;
        return passwordResetCodeRegex.test(passwordResetCode);
    }

    static isVerificationCode(verificationCode: string): boolean {
        const verificationCodeRegex = /^\d{6}$/;
        return verificationCodeRegex.test(verificationCode);
    }
}

export default Validator;