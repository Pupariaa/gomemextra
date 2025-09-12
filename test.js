const Gomemextra = require('./main.js');

async function runTests() {
    console.log('🧪 Starting Gomemextra tests...\n');

    // Test 1: Constructor
    console.log('Test 1: Constructor');
    try {
        const gomemextra = new Gomemextra(true, true);
        console.log('✅ Constructor test passed');
    } catch (error) {
        console.log('❌ Constructor test failed:', error.message);
    }

    // Test 2: Configuration methods
    console.log('\nTest 2: Configuration methods');
    try {
        const gomemextra = new Gomemextra(false, false); // Disable logs for cleaner output

        // Test port setting
        const portResult = gomemextra.setPort(8080);
        console.log('Port setting result:', portResult ? '✅' : '❌');

        // Test update setting
        const updateResult = gomemextra.setUpdate(1000);
        console.log('Update setting result:', updateResult ? '✅' : '❌');

        // Test getting values
        const address = gomemextra.getAdress();
        const update = gomemextra.getUpdate();
        console.log('Address retrieved:', address ? '✅' : '❌');
        console.log('Update retrieved:', update ? '✅' : '❌');

    } catch (error) {
        console.log('❌ Configuration test failed:', error.message);
    }

    // Test 3: Invalid inputs
    console.log('\nTest 3: Invalid inputs');
    try {
        const gomemextra = new Gomemextra(false, false);

        // Test invalid port
        const invalidPortResult = gomemextra.setPort(-1);
        console.log('Invalid port rejected:', !invalidPortResult ? '✅' : '❌');

        // Test invalid update
        const invalidUpdateResult = gomemextra.setUpdate(0);
        console.log('Invalid update rejected:', !invalidUpdateResult ? '✅' : '❌');

    } catch (error) {
        console.log('❌ Invalid inputs test failed:', error.message);
    }

    console.log('\n🏁 Tests completed!');
    console.log('\nNote: To test the full functionality (launch, data fetching),');
    console.log('you need to have gosumemory.exe properly installed and configured.');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };
