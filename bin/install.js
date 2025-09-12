const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

// Constants
const GOSUMEMORY_URL = 'https://raw.githubusercontent.com/Pupariaa/gomemextra/main/gosumemory.exe';
const EXECUTION_DELAY = 500;
const TIMEOUT = 30000; // 30 seconds timeout

(async () => {
    const filePath = path.join(__dirname, 'gosumemory.exe');

    try {
        console.log('Starting gosumemory.exe download...');

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            console.log('gosumemory.exe already exists, skipping download.');
        } else {
            // Fetch the gosumemory.exe file using axios
            const response = await axios.get(GOSUMEMORY_URL, {
                responseType: 'arraybuffer',
                timeout: TIMEOUT
            });

            // Save the file
            fs.writeFileSync(filePath, response.data);
            console.log('Successfully downloaded: gosumemory.exe');
        }

        // Verify the file exists and is executable
        if (!fs.existsSync(filePath)) {
            throw new Error('Downloaded file not found');
        }

        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        console.log('Executing gosumemory.exe to generate config...');

        // Spawn a child process to run gosumemory.exe
        const childProcess = spawn(filePath, [], {
            stdio: 'pipe',
            timeout: TIMEOUT
        });

        // Handle process events
        childProcess.on('error', (error) => {
            console.error(`Process error: ${error.message}`);
        });

        childProcess.stdout?.on('data', (data) => {
            console.log(`gosumemory: ${data}`);
        });

        childProcess.stderr?.on('data', (data) => {
            console.error(`gosumemory error: ${data}`);
        });

        // Wait for the process to initialize
        await new Promise((resolve) => setTimeout(resolve, EXECUTION_DELAY));

        // Kill the child process gracefully
        if (!childProcess.killed) {
            childProcess.kill();
        }

        console.log('Successfully executed gosumemory.exe');

        // Check if config.ini was created
        const configPath = path.join(__dirname, 'config.ini');
        if (fs.existsSync(configPath)) {
            console.log('Configuration file generated successfully');
        } else {
            console.warn('Warning: config.ini file was not generated');
        }

    } catch (error) {
        console.error(`Error during script execution: ${error.message}`);

        // Clean up partial download
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log('Cleaned up partial download');
            } catch (cleanupError) {
                console.error(`Cleanup error: ${cleanupError.message}`);
            }
        }

        process.exit(1);
    }
})();
