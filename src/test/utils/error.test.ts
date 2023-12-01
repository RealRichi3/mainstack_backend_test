import CacheUtil from '../../utils/cache';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as Error from '../../utils/error';

describe('Error utility', () => {
    describe('BadRequestError', () => {
        it('should save have status code 400', async () => {
            expect(new Error.BadRequestError('test').statusCode).to.equal(400);
        })
    });

    describe('UnauthenticatedError', () => {
        it('should save have status code 401', async () => {
            expect(new Error.UnauthenticatedError('test').statusCode).to.equal(401);
        })
    });

    describe('ForbiddenError', () => {
        it('should save have status code 403', async () => {
            expect(new Error.ForbiddenError('test').statusCode).to.equal(403);
        })
    });

    describe('NotFoundError', () => {
        it('should save have status code 404', async () => {
            expect(new Error.NotFoundError('test').statusCode).to.equal(404);
        })
    });

    describe('InternalServerError', () => {
        it('should save have status code 500', async () => {
            expect(new Error.InternalServerError('test').statusCode).to.equal(500);
        })
    });

    describe('ExpiredAuthError', () => {
        it('should save have status code 407', async () => {
            expect(new Error.ExpiredAuthError('test').statusCode).to.equal(407);
        })
    });

});
