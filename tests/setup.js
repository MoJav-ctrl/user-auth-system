const mongoose = require('mongoose');
const {MonogoMemoryServer} = require('mongodb-memory-server');

let mongoServer;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Clear all data after each test
afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

// Close the in-memory MongoDB server after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

module.exports = {
    mongoServer,
    mongoose
};


// // Clear all collections between tests
// afterEach(async () => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//       await collections[key].deleteMany();
//     }
//   });