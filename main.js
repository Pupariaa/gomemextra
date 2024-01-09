const { spawn } = require('child_process');
const path = require('path');
const ini = require('ini');
const fs = require('fs');
const axios = require('axios');

class Gomemextra {
  /**
   * Constructor for initializing the gomemextra object.
   *
   * @param {boolean} [logEnabled=true] - Flag to determine whether to display logs.
   * @param {boolean} [errorEnabled=true] - Flag to determine whether to display errors.
   */
  constructor(logEnabled = true, errorEnabled = true) {
    this.displayLogs = logEnabled;
    this.displayErrors = errorEnabled;

    // Path to the gosumemory executable
    this.exePath = path.join(require.main.path, 'node_modules', 'gomemextra', 'bin', 'gosumemory.exe');
    // Path to the gosumemory configuration file
    this.iniPath = path.join(require.main.path, 'node_modules', 'gomemextra', 'bin', 'config.ini');

    // Read the configuration file content from the iniPath
    let configFileContent = fs.readFileSync(this.iniPath, 'utf-8');
    // Parse the ini content into an object
    this.configFileContent = ini.parse(configFileContent);
    this.childProcess = null;
  }

  /**
   * Launches the gosumemory child process.
   */
  launch() {
    this.childProcess = spawn(this.exePath);

    // Event listener for gosumemory stdout
    this.childProcess.stdout.on('data', (data) => {
      if (this.displayLogs) {
        console.log(`gosumemory: ${data}`);
      }
    });

    // Event listener for gosumemory stderr
    this.childProcess.stderr.on('data', (data) => {
      if (this.displayErrors) {
        console.error(`gosumemory: ${data}`);
      }
    });

    // Event listener for gosumemory process close
    this.childProcess.on('close', (code) => {
      if (this.displayLogs) {
        console.log(`Child process exited with code ${code}`);
      }
    });
  }

  /**
   * Closes the gosumemory child process if it is running.
   */
  close() {
    if (this.childProcess) {
      this.childProcess.kill();
    }
  }

  /**
   * Gets the server IP address from the gosumemory configuration.
   *
   * @returns {string|undefined} - Server IP address or undefined if not found.
   */
  getAdress() {
    if (this.configFileContent && this.configFileContent['Web'] && this.configFileContent['Web']['serverip']) {
      return this.configFileContent['Web']['serverip'];
    }
  }

  /**
   * Gets the update value from the gosumemory configuration.
   *
   * @returns {number|undefined} - Update value or undefined if not found.
   */
  getUpdate() {
    if (this.configFileContent && this.configFileContent['Main'] && this.configFileContent['Main']['update']) {
      return this.configFileContent['Main']['update'];
    }
  }

  /**
   * Sets the server port in the gosumemory configuration.
   *
   * @param {number} port - Port number to set.
   */
  setPort(port) {
    const parsedPort = parseInt(port, 10);

    if (isNaN(parsedPort) || parsedPort <= 0 || parsedPort > 65535) {
      console.error(`The port ${port} is not a positive integer or is not in the valid range.`);
    } else if (parsedPort !== Math.floor(parsedPort)) {
      console.error(`The port ${port} is not an integer.`);
    } else {
      if (this.configFileContent && this.configFileContent['Web']) {
        this.configFileContent['Web']['serverip'] = `127.0.0.1:${port}`;
        const configFileContent = ini.stringify(this.configFileContent);
        fs.writeFileSync(this.iniPath, configFileContent, 'utf-8');
      }
    }
  }

  /**
   * Sets the update value in the gosumemory configuration.
   *
   * @param {number} update - Update value to set.
   */
  setUpdate(update) {
    update = parseInt(update);

    if (isNaN(update) || update <= 1 || update > 100000) {
      console.error(`Invalid update value: ${update}`);
    } else if (update !== Math.floor(update)) {
      console.error(`Update value must be an integer: ${update}`);
    } else {
      if (this.configFileContent && this.configFileContent['Main']) {
        this.configFileContent['Main']['update'] = update;
        const configFileContent = ini.stringify(this.configFileContent);
        fs.writeFileSync(this.iniPath, configFileContent, 'utf-8');
      }
    }
  }

  /**
   * Retrieves data from the gosumemory service, waiting for the service to respond.
   *
   * @returns {Promise<Object>} - Promise resolving to the retrieved data.
   * @throws {Error} - Throws an error if the service does not respond after multiple attempts.
   */
  async data() {
    const maxAttempts = 10;
    const delayBetweenAttempts = 1000;

    /**
     * Waits for the gosumemory service to respond.
     *
     * @returns {Promise<void>} - Promise resolving when the service responds.
     */
    const waitForService = async () => {
      let attempts = 0;

      while (attempts < maxAttempts) {
        try {
          await axios.get(`http://${this.configFileContent['Web']['serverip']}/json`);
          return;
        } catch (error) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
        }
      }

      throw new Error('The service did not respond after multiple attempts.');
    };

    try {
      await waitForService();
      const response = await axios.get(`http://${this.configFileContent['Web']['serverip']}/json`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching: ${error.message}`);
    }
  }
}

module.exports = Gomemextra;
