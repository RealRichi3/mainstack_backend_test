import CacheUtil from '../../utils/cache';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Cache utility', () => {
    afterEach(() => {
    });

    describe('saveToCache', () => {
        it('should save value to cache without ttl', async () => {
            const key = 'testKey';
            const value = { name: 'John' };

            await CacheUtil.saveToCache({ key, value });
           
        });

        it('should save value to cache with ttl', async () => {
            const key = 'testKey';
            const value = { name: 'John' };
            const ttl = 60;

            await CacheUtil.saveToCache({ key, value, ttl })
        });
    });

    describe('getFromCache', () => {
        it('should get value from cache', async () => {
            const key = 'testKey';
            const expectedValue = JSON.stringify({ name: 'John' });

            const result = await CacheUtil.getFromCache(key);
            expect(result).to.equal(expectedValue);
        });
    });

    describe('deleteFromCache', () => {
        it('should delete value from cache', async () => {
            const key = 'testKey';

            await CacheUtil.deleteFromCache(key);

            const result = await CacheUtil.getFromCache(key);
            expect(result).to.equal(null)
        });
    });
});
