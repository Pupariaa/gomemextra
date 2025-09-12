# gomemextra

[![npm version](https://img.shields.io/npm/v/gomemextra)]([https://www.npmjs.com/gomemextra](https://www.npmjs.com/package/gomemextra))
[![Downloads](https://img.shields.io/npm/dt/gomemextra)](https://www.npmjs.com/package/gomemextra)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

Gomemextra is a Node.js utility for managing gosumemory processes and configurations. This package provides a clean API to interact with gosumemory, including process management, configuration handling, and data retrieval.

## Features

- **Process Management**: Launch and close gosumemory processes safely
- **Configuration Management**: Set and get server ports and update intervals
- **Data Methods**: Fetch real-time data from gosumemory service
- **Error Handling**: Comprehensive error handling and validation
- **Logging Control**: Configurable logging and error display
- **Testing**: Built-in test suite for validation
- **Optimized**: Minimal dependencies and performance optimizations

## Installation

1. Install Gomemextra using npm:
    ```bash
    npm install gomemextra
    ```

2. Run the installation script to download gosumemory.exe:
    ```bash
    npm run install
    ```

3. Import gomemextra in your Node.js project:
    ```javascript
    const Gomemextra = require('gomemextra');
    ```

## Testing

Run the test suite to verify everything is working correctly:
```bash
npm test
```
## Usage
### Initializing Gomemextra
Create a new instance of gomemextra:
```javascript
const gomemextra = new Gomemextra();
const gomemextra = new Gomemextra(logEnabled, errorEnabled);
// logEnabled (default: true): Set to false to disable logs.
// errorEnabled (default: true): Set to false to disable errors.
```
#### Launch Gosumemory 
```javascript
// Launch gosumemory process
const launched = gomemextra.launch();
console.log('Process launched:', launched);
```

#### Check Process Status
```javascript
// Check if process is running
const isRunning = gomemextra.isRunning();
console.log('Process running:', isRunning);

// Get process ID
const pid = gomemextra.getProcessId();
console.log('Process ID:', pid);
```

#### Close Gosumemory
```javascript
// Close gosumemory process
const closed = gomemextra.close();
console.log('Process closed:', closed);
```
### Getting server IP address and update value
```javascript
// Get server IP address
const address = gomemextra.getAdress();
console.log('Server IP Address:', address);

// Get update value
const update = gomemextra.getUpdate();
console.log('Update Value:', update);
```

### Setting Server Port and Update Value
```javascript
// Set server port (returns true if successful)
const portSet = gomemextra.setPort(8080);
console.log('Port set successfully:', portSet);

// Set update value (returns true if successful)
const updateSet = gomemextra.setUpdate(5000);
console.log('Update interval set successfully:', updateSet);
```

### Retrieving Data from gosumemory service
```javascript
// Retrieve data from gosumemory service
try {
    const data = await gomemextra.data();
    console.log('Data from gosumemory:', data);
} catch (error) {
    console.error('Error retrieving data:', error.message);
}

// With custom retry settings
try {
    const data = await gomemextra.data(15, 2000); // 15 attempts, 2s delay
    console.log('Data from gosumemory:', data);
} catch (error) {
    console.error('Error retrieving data:', error.message);
}
```

## Performance Improvements

This version includes several optimizations:

- **Reduced Dependencies**: Removed unnecessary native modules from package.json
- **Better Error Handling**: Comprehensive error handling with proper validation
- **Process Management**: Improved process lifecycle management with status checking
- **Performance Optimizations**: Added timeouts, caching, and better resource management
- **Code Quality**: Added constants, better documentation, and cleaner code structure
- **Testing**: Built-in test suite for validation

## API Reference

### Constructor
- `new Gomemextra(logEnabled?, errorEnabled?)` - Creates a new instance

### Process Management
- `launch()` - Launches the gosumemory process (returns boolean)
- `close()` - Closes the gosumemory process (returns boolean)
- `isRunning()` - Checks if process is running (returns boolean)
- `getProcessId()` - Gets the process ID (returns number|undefined)

### Data Methods
`data(maxAttempts?, delayBetweenAttempts?)` - Retrieves data from service (returns Promise<Object>)

## Credits

Gosumemory  [Github for gosumemory project](https://github.com/l3lackShark/gosumemory )

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Report bugs](https://github.com/Pupariaa/gomemextra/issues)
- [Request features](https://github.com/Pupariaa/gomemextra/issues)
- [Documentation](https://github.com/Pupariaa/gomemextra#readme)

---

Made with ❤️ by [Puparia](https://github.com/Pupariaa)
