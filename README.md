# gomemextra

Gomemextrais a Node.js utility for managing gosumemory processes and configurations.

## Installation

1. Install Gomemextra using npm:
    ```bash
    npm install gomemextra
    ```
2. Import gomemextra in your Node.js project:
    ```javascript
    const gomemextra = require('gomemextra');
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
gomemextra.launch();
```
### Close Gosumemory
```javascript
// Close gosumemory process
gomemextra.close();
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
gomemextra.setPort(8080);

// Set update value
gomemextra.setUpdate(5000);
```

### Retriveing Data from gosumemory service
```javascript
// Retrieve data from gosumemory service
try {
const data = await gomemextra.data();
console.log('Data from gosumemory:', data);
} catch (error) {
console.error('Error retrieving data:', error.message);
}
```

### Contributing
Contributions are welcome! If you find any issues or want to add new features, feel free to submit a pull request.

### License 
