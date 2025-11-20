const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const setupTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('In-memory MongoDB started at:', uri);
  process.env.MONGODB_URI = uri;
  return uri;
};

const teardownTestDB = async () => {
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { setupTestDB, teardownTestDB };
