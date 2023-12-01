import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import connectToMongoDBDatabase from '../../database/mongodb';
import { expect } from 'chai';
import mongoose from 'mongoose';

describe('Database connection and test for env variables', () => {
    it("should return 'test' for NODE_ENV environment variable", async () => {
        expect(process.env.NODE_ENV).to.equal('TEST')
    })

    it("should confirm that 'test' string is in the db name", async () => {
        expect(process.env.MONGO_URI_TEST).to.include('test')
    })

    it("should connect to MONGODB database successfully", async () => {
        await connectToMongoDBDatabase()
    })

    after(async () => {
        await mongoose.connection.dropDatabase()
    })
})