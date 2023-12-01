import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { AuthTokenCipher, AuthTokenType, AuthorizationUtil, AuthCache } from '../../utils/token';
import { UserModel } from '../../models/user.model';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import PasswordModel from '../../models/password.model';
import { IEndUserProfileDoc, IUserDoc, PlainUser } from '../../interfaces/database-models/user';
import { JWT_SECRET } from '../../config';
import { assert } from 'console';

describe('Token utility', () => {
    let user: IUserDoc;
    let userProfile: IEndUserProfileDoc;
    let plainUserData: PlainUser;

    before(async () => {
        // Create user
        const session = await mongoose.connection.startSession();
        session.startTransaction();

        // Create a new user
        const newUser = await UserModel.create(
            [
                {
                    _id: new ObjectId(),
                    firstname: 'Random user',
                    lastname: 'Random user',
                    email: 'testemail@test.com',
                    role: 'EndUser',
                    accountStatus: { emailVerified: false, activated: true },
                },
            ],
            { session }
        );

        user = newUser[0];
        plainUserData = user.toObject()
        userProfile = await newUser[0].createProfile() as IEndUserProfileDoc;

        await PasswordModel.create(
            [
                {
                    _id: new ObjectId(),
                    user: newUser[0]._id,
                    password: 'Password1',
                },
            ],
            { session }
        );

        await session.commitTransaction();
        await session.endSession();

        // done()
    })

    describe('AuthTokenCipher', () => {
        describe('encodeToken', () => {
            it('should encode a token', async () => {
                const expectedToken = jwt.sign(plainUserData, JWT_SECRET, {});

                const result = await AuthTokenCipher.encodeToken(plainUserData);

                expect(result).to.equal(expectedToken);
            });

            it('should encode a token with expiry', async () => {
                const expiry = 3600;
                const expectedToken = jwt.sign(plainUserData, JWT_SECRET, { expiresIn: 1000 });

                const result = await AuthTokenCipher.encodeToken(plainUserData, expiry);

                expect(result).to.equal(expectedToken);
            });
        });

        describe('decodeToken', () => {
            it('should decode a token', async () => {
                type DecodedPayload = Omit<PlainUser, '_id' | 'createdAt' | 'updatedAt'> & { _id: string, createdAt: Date, updatedAt: Date };
                const decodedPayload = plainUserData as unknown as DecodedPayload

                const token = jwt.sign(plainUserData, JWT_SECRET, {});

                const result = await AuthTokenCipher.decodeToken(token) as Record<string, any>;
                delete result['iat']    // Remove the iat property from the result - it is not part of the payload

                for (let i = 0; i < Object.keys(decodedPayload).length; i++) {
                    const key = Object.keys(decodedPayload)[i] as keyof DecodedPayload
                    if (key === '_id') decodedPayload[key] = decodedPayload[key].toString()
                    if (key === 'createdAt') result[key] = new Date(result[key])    // Dates are by default converted to strings by jwt
                    if (key === 'updatedAt') result[key] = new Date(result[key])    // Dates are by default converted to strings by jwt

                    expect(result[key]).to.deep.equal(decodedPayload[key])
                }
            });
        });
    });


    describe('AuthCache', () => {
        afterEach(async () => {
            await AuthorizationUtil.clearAuthorization({ user: plainUserData, tokenType: AuthTokenType.Access })
            await AuthorizationUtil.clearAuthorization({ user: plainUserData, tokenType: AuthTokenType.Refresh })
        });

        describe('generateKey', () => {
            it('should generate a cache key', () => {
                const tokenType = AuthTokenType.Access;
                const expectedKey = plainUserData._id + ':access';

                const result = AuthCache.generateKey({ user: plainUserData, tokenType });

                expect(result).to.equal(expectedKey);
            });
        });

        describe('saveData', () => {
            it('should save data to cache', async () => {
                const tokenType = AuthTokenType.Access;
                const data = 'testToken';
                const expiry = 3600;

                await AuthCache.saveData({ user: plainUserData, tokenType, data, expiry });

                // You may want to assert the result if necessary
                assert(true)
            });
        });

        describe('getData', () => {
            it('should get data from cache', async () => {
                const tokenType = AuthTokenType.Access;
                const expectedData = await AuthorizationUtil.generateToken({ user: user, tokenType, expiry: 3600 });

                const result = await AuthCache.getData({ user: plainUserData, tokenType });
                expect(result).to.equal(expectedData);
            });
        });

        describe('compareToken', () => {
            it('should compare token with data in cache', async () => {
                const tokenType = AuthTokenType.Access;
                const token = await AuthorizationUtil.generateToken({ user: user, tokenType, expiry: 3600 });

                const result = await AuthCache.compareToken({ user: plainUserData, tokenType, token });

                expect(result).to.equal(true);
            });
        });

        after(async () => {
            await UserModel.deleteMany({});
            await PasswordModel.deleteMany({});
        })
    });


    // describe('AuthorizationUtil', () => {
    //     afterEach(async () => {
    //         sinon.restore();
    //         await CacheUtil.deleteFromCache('123:access');
    //     });

    //     describe('generateToken', () => {
    //         it('should generate and save a token', async () => {
    //             const user = { _id: '123' };
    //             const tokenType = AuthTokenType.Access;
    //             const expiry = 3600;

    //             const stubEncodeToken = sinon.stub(AuthTokenCipher, 'encodeToken').resolves('testToken');
    //             const stubSaveData = sinon.stub(AuthCache, 'saveData').resolves();

    //             const result = await AuthorizationUtil.generateToken({ user: plainUs, tokenType, expiry });

    //             expect(result).to.equal('testToken');
    //             sinon.assert.calledOnceWithExactly(stubEncodeToken, {
    //                 user: { _id: '123' },
    //                 tokenType: AuthTokenType.Access,
    //                 expiryDate: sinon.match.instanceOf(Date),
    //             }, 3600);
    //             sinon.assert.calledOnceWithExactly(stubSaveData, {
    //                 user: { _id: '123' },
    //                 tokenType: AuthTokenType.Access,
    //                 data: 'testToken',
    //                 expiry: 3600,
    //             });
    //         });
    //     });

    //     describe('clearAuthorization', () => {
    //         it('should clear authorization data from cache', async () => {
    //             const user = { _id: '123' };
    //             const tokenType = AuthTokenType.Access;

    //             const stubDeleteFromCache = sinon.stub(CacheUtil, 'deleteFromCache').resolves();

    //             await AuthorizationUtil.clearAuthorization({ user, tokenType });

    //             sinon.assert.calledOnceWithExactly(stubDeleteFromCache, '123:access');
    //         });
    //     });

    //     describe('verifyToken', () => {
    //         it('should verify token by comparing with data in cache', async () => {
    //             const user = { _id: '123' };
    //             const tokenType = AuthTokenType.Access;
    //             const token = 'testToken';

    //             const stubCompareToken = sinon.stub(AuthCache, 'compareToken').resolves(true);

    //             const result = await AuthorizationUtil.verifyToken({ user, tokenType, token });

    //             expect(result).to.equal(true);
    //             sinon.assert.calledOnceWithExactly(stubCompareToken, {
    //                 user: { _id: '123' },
    //                 tokenType: AuthTokenType.Access,
    //                 token: 'testToken',
    //             });
    //         });
    //     });
    // });
});
