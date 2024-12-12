module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@models/(.*)$': '<rootDir>/src/api/models/$1',
      '^@controllers/(.*)$': '<rootDir>/src/api/controllers/$1',
    },
  };
  