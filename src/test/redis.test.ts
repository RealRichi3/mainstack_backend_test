import CacheUtil from '../utils/cache';
import redisClient from '../database/redis';
import { describe, beforeEach, it } from 'mocha';
import sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';
import logger from '../middlewares/logger';

// describe('CacheUtil', () => {
//     let setStub: SinonStub<[string | Buffer, string], Promise<number | string | null>>;
//     let setexStub: SinonStub<[string | Buffer, number, string | Buffer], Promise<string | null>>;
//     let getStub: SinonStub<[string | Buffer], Promise<Buffer | null>>;
//     let delStub: SinonStub<[string | Buffer], Promise<number>>;

//     beforeEach(() => {
//         setStub = sinon.stub(redisClient, 'set');
//         setexStub = sinon.stub(redisClient, 'setex');
//         getStub = sinon.stub(redisClient, 'get');
//         delStub = sinon.stub(redisClient, 'del');
//     });

//     afterEach(() => {
//         sinon.restore();
//     });

//     describe('saveToCache', () => {
//         it('should save value to cache without ttl', async () => {
//             const key = 'testKey';
//             const value = { name: 'John' };

//             await CacheUtil.saveToCache({ key, value });

//             expect(setStub.calledWith(key, JSON.stringify(value))).to.be.true;
//         });

//         it('should save value to cache with ttl', async () => {
//             const key = 'testKey';
//             const value = { name: 'John' };
//             const ttl = 60;

//             await CacheUtil.saveToCache({ key, value, ttl });

//             expect(setexStub.calledWith(key, ttl, JSON.stringify(value))).to.be.true;
//         });
//     });

//     describe('getFromCache', () => {
//         it('should get value from cache', async () => {
//             const key = 'testKey';
//             const expectedValue = JSON.stringify({ name: 'John' });

//             getStub.resolves(Buffer.from(expectedValue));

//             const result = await CacheUtil.getFromCache(key);

//             expect(getStub.calledWith(key)).to.be.true;
//             expect(result).to.equal(expectedValue);
//         });
//     });

//     describe('deleteFromCache', () => {
//         it('should delete value from cache', async () => {
//             const key = 'testKey';

//             await CacheUtil.deleteFromCache(key);

//             expect(delStub.calledWith(key)).to.be.true;
//         });
//     });
// });


describe('Testing init', () => { 
    beforeEach(() => {
        logger.info('Before init')
    })

    describe('Testing init', () => {
        it('should test init', () => {
            expect(1).to.equal(1)
        })
    })

    afterEach(() => {
        logger.info('After init')
    })
 })