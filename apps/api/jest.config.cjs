/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@beauty/validation$': '<rootDir>/../../../packages/validation/src/index.ts',
    '^@beauty/types$': '<rootDir>/../../../packages/types/src/index.ts',
    '^@beauty/config$': '<rootDir>/../../../packages/config/src/index.ts',
  },
};
