const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

(async () => {
    const { default: fetch } = await import('node-fetch');
    // URL of the raw gosumemory.exe file on GitHub
    const rawUrl = 'https://raw.githubusercontent.com/Pupariaa/gomemextra/main/gosumemory.exe';

    try {
        // Fetch the gosumemory.exe file as an ArrayBuffer
        const response = await fetch(rawUrl);
        
        // Convert the ArrayBuffer to a Buffer
        const buffer = await response.buffer();

        // Save the gosumemory.exe file locally
        const filePath = path.join(__dirname, 'gosumemory.exe');
        fs.writeFileSync(filePath, buffer);

        console.log('Downloaded resource: gosumemory.exe');

        // Spawn a child process to run gosumemory.exe
        const childProcess = spawn(filePath);

        // Wait for 500 milliseconds (0.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Kill the child process
        childProcess.kill();

        console.log('Successfully executed gosumemory.exe');
    } catch (error) {
        // Handle errors during the execution of the script
        console.error(`Error during script execution: ${error.message}`);
    }
})();
