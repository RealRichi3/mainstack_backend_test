import CacheUtil from '../../utils/cache';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Validator from '../../utils/validator';

describe('Validator utility', () => {
    describe('validateEmail', () => {
        it('should return true for valid email - testemail@email.com', async () => {
            const email = 'testemail@email.com'
            expect(Validator.isEmail(email)).to.equal(true);
        });

        it('should return false for invalid email - testemail', async () => {
            const email = 'testemail'
            expect(Validator.isEmail(email)).to.equal(false);
        });

        it('should return false for invalid email - testemail@', async () => {
            const email = 'testemail@'
            expect(Validator.isEmail(email)).to.equal(false);
        });
    })


    describe('validatePhoneNumber', () => {
        it('should return true for valid phone number - 08012345678', async () => {
            const phoneNumber = '08012345678'
            expect(Validator.isPhoneNumber(phoneNumber)).to.equal(true);
        });

        it('should return true for valid phone number - +2348012345678', async () => {
            const phoneNumber = '+2348012345678'
            expect(Validator.isPhoneNumber(phoneNumber)).to.equal(true);
        });

        it('should return false for invalid phone number - 0801234567', async () => {
            const phoneNumber = '0801234567'
            expect(Validator.isPhoneNumber(phoneNumber)).to.equal(false);
        });

        it('should return false for invalid phone number - 080123456789', async () => {
            const phoneNumber = '080123456789'
            expect(Validator.isPhoneNumber(phoneNumber)).to.equal(false);
        });

        it('should return false for invalid phone number - 0801234567a', async () => {
            const phoneNumber = '0801234567a'
            expect(Validator.isPhoneNumber(phoneNumber)).to.equal(false);
        });
    })


    describe('validatePassword', () => {
        it('should return true for valid password - Password1', async () => {
            const password = 'Password1'
            expect(Validator.isPassword(password)).to.equal(true);
        });

        it('should return false for invalid password - password', async () => {
            const password = 'password'
            expect(Validator.isPassword(password)).to.equal(false);
        });

        it('should return false for invalid password - PASSWORD', async () => {
            const password = 'PASSWORD'
            expect(Validator.isPassword(password)).to.equal(false);
        });

        it('should return false for invalid password - Password', async () => {
            const password = 'Password'
            expect(Validator.isPassword(password)).to.equal(false);
        });

        it('should return false for invalid password - 121212121', async () => {
            const password = '121212121'
            expect(Validator.isPassword(password)).to.equal(false);
        });
    })
});
