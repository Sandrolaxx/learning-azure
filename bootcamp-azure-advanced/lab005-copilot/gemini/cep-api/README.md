# CEP API

This project is a simple Node.js API that consumes the ViaCEP API to provide ZIP code information. It includes validation for the provided ZIP code and adheres to current standards.

## Project Structure

```
cep-api
├── src
│   ├── app.js                  # Entry point of the application
│   ├── controllers             # Contains the CepController
│   │   └── cepController.js    # Handles logic for retrieving ZIP code information
│   ├── routes                  # Defines the API routes
│   │   └── cepRoutes.js        # Sets up the /v1/{cep} endpoint
│   ├── services                # Contains business logic
│   │   └── cepService.js       # Makes requests to the ViaCEP API
│   ├── models                  # Defines data structures
│   │   └── cepModel.js         # Structure of the data returned from ViaCEP
│   └── utils                   # Utility functions
│       └── validation.js       # Validates the ZIP code format
├── tests                       # Contains unit tests
│   └── cep.test.js             # Tests for CepController and CepService
├── package.json                # npm configuration file
└── package-lock.json           # Locks the versions of installed dependencies
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd cep-api
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the API, run the following command:
```
npm start
```

The API will be available at `http://localhost:3000/v1/{cep}` where `{cep}` is the ZIP code you want to query.

## Testing

To run the unit tests, use the following command:
```
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.