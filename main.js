const { spawn } = require('child_process');
const path = require('path');
const ini = require('ini');
const fs = require('fs');
const axios = require('axios');

// Constants
const DEFAULT_MAX_ATTEMPTS = 10;
const DEFAULT_DELAY_BETWEEN_ATTEMPTS = 1000;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const MIN_UPDATE = 1;
const MAX_UPDATE = 100000;

/**
 * Gomemextra - A Node.js wrapper for Gosumemory
 * 
 * @class Gomemextra
 */
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

    this.childProcess = null;
    this.configFileContent = null;
    this._loadConfig();
  }

  /**
   * Loads the configuration file content.
   * @private
   */
  _loadConfig() {
    try {
      if (fs.existsSync(this.iniPath)) {
        const configFileContent = fs.readFileSync(this.iniPath, 'utf-8');
        this.configFileContent = ini.parse(configFileContent);
      } else {
        throw new Error(`Configuration file not found: ${this.iniPath}`);
      }
    } catch (error) {
      if (this.displayErrors) {
        console.error(`Error loading configuration: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Launches the gosumemory child process.
   * @returns {boolean} - True if process started successfully, false otherwise.
   */
  launch() {
    try {
      if (this.childProcess && !this.childProcess.killed) {
        if (this.displayLogs) {
          console.log('Process is already running');
        }
        return false;
      }

      if (!fs.existsSync(this.exePath)) {
        throw new Error(`Executable not found: ${this.exePath}`);
      }

      this.childProcess = spawn(this.exePath);

      // Event listener for gosumemory stdout
      this.childProcess.stdout?.on('data', (data) => {
        if (this.displayLogs) {
          console.log(`gosumemory: ${data}`);
        }
      });

      // Event listener for gosumemory stderr
      this.childProcess.stderr?.on('data', (data) => {
        if (this.displayErrors) {
          console.error(`gosumemory: ${data}`);
        }
      });

      // Event listener for gosumemory process close
      this.childProcess.on('close', (code) => {
        if (this.displayLogs) {
          console.log(`Child process exited with code ${code}`);
        }
        this.childProcess = null;
      });

      // Event listener for process errors
      this.childProcess.on('error', (error) => {
        if (this.displayErrors) {
          console.error(`Process error: ${error.message}`);
        }
        this.childProcess = null;
      });

      return true;
    } catch (error) {
      if (this.displayErrors) {
        console.error(`Failed to launch process: ${error.message}`);
      }
      return false;
    }
  }

  /**
   * Closes the gosumemory child process if it is running.
   * @returns {boolean} - True if process was closed, false if not running.
   */
  close() {
    if (this.childProcess && !this.childProcess.killed) {
      this.childProcess.kill();
      this.childProcess = null;
      if (this.displayLogs) {
        console.log('Process closed successfully');
      }
      return true;
    }
    return false;
  }

  /**
   * Checks if the gosumemory process is currently running.
   * @returns {boolean} - True if process is running, false otherwise.
   */
  isRunning() {
    return this.childProcess && !this.childProcess.killed;
  }

  /**
   * Gets the process ID if the process is running.
   * @returns {number|undefined} - Process ID or undefined if not running.
   */
  getProcessId() {
    return this.childProcess?.pid;
  }

  /**
   * Gets the server IP address from the gosumemory configuration.
   *
   * @returns {string|undefined} - Server IP address or undefined if not found.
   */
  getAdress() {
    return this.configFileContent?.['Web']?.['serverip'];
  }

  /**
   * Gets the update value from the gosumemory configuration.
   *
   * @returns {number|undefined} - Update value or undefined if not found.
   */
  getUpdate() {
    const update = this.configFileContent?.['Main']?.['update'];
    return update ? parseInt(update, 10) : undefined;
  }

  /**
   * Sets the server port in the gosumemory configuration.
   *
   * @param {number} port - Port number to set.
   * @returns {boolean} - True if port was set successfully, false otherwise.
   */
  setPort(port) {
    const parsedPort = parseInt(port, 10);

    if (isNaN(parsedPort) || parsedPort < MIN_PORT || parsedPort > MAX_PORT) {
      if (this.displayErrors) {
        console.error(`Invalid port: ${port}. Must be between ${MIN_PORT} and ${MAX_PORT}`);
      }
      return false;
    }

    if (parsedPort !== Math.floor(parsedPort)) {
      if (this.displayErrors) {
        console.error(`Port must be an integer: ${port}`);
      }
      return false;
    }

    try {
      if (!this.configFileContent) {
        this._loadConfig();
      }

      if (!this.configFileContent['Web']) {
        this.configFileContent['Web'] = {};
      }

      this.configFileContent['Web']['serverip'] = `127.0.0.1:${parsedPort}`;
      const configFileContent = ini.stringify(this.configFileContent);
      fs.writeFileSync(this.iniPath, configFileContent, 'utf-8');

      if (this.displayLogs) {
        console.log(`Port set to ${parsedPort}`);
      }
      return true;
    } catch (error) {
      if (this.displayErrors) {
        console.error(`Failed to set port: ${error.message}`);
      }
      return false;
    }
  }

  /**
   * Sets the update value in the gosumemory configuration.
   *
   * @param {number} update - Update value to set.
   * @returns {boolean} - True if update was set successfully, false otherwise.
   */
  setUpdate(update) {
    const parsedUpdate = parseInt(update, 10);

    if (isNaN(parsedUpdate) || parsedUpdate < MIN_UPDATE || parsedUpdate > MAX_UPDATE) {
      if (this.displayErrors) {
        console.error(`Invalid update value: ${update}. Must be between ${MIN_UPDATE} and ${MAX_UPDATE}`);
      }
      return false;
    }

    if (parsedUpdate !== Math.floor(parsedUpdate)) {
      if (this.displayErrors) {
        console.error(`Update value must be an integer: ${update}`);
      }
      return false;
    }

    try {
      if (!this.configFileContent) {
        this._loadConfig();
      }

      if (!this.configFileContent['Main']) {
        this.configFileContent['Main'] = {};
      }

      this.configFileContent['Main']['update'] = parsedUpdate;
      const configFileContent = ini.stringify(this.configFileContent);
      fs.writeFileSync(this.iniPath, configFileContent, 'utf-8');

      if (this.displayLogs) {
        console.log(`Update interval set to ${parsedUpdate}ms`);
      }
      return true;
    } catch (error) {
      if (this.displayErrors) {
        console.error(`Failed to set update value: ${error.message}`);
      }
      return false;
    }
  }

  /**
   * Retrieves data from the gosumemory service, waiting for the service to respond.
   *
   * @param {number} [maxAttempts=DEFAULT_MAX_ATTEMPTS] - Maximum number of attempts.
   * @param {number} [delayBetweenAttempts=DEFAULT_DELAY_BETWEEN_ATTEMPTS] - Delay between attempts in ms.
   * @returns {Promise<Object>} - Promise resolving to the retrieved data.
   * @throws {Error} - Throws an error if the service does not respond after multiple attempts.
   */
  async data(maxAttempts = DEFAULT_MAX_ATTEMPTS, delayBetweenAttempts = DEFAULT_DELAY_BETWEEN_ATTEMPTS) {
    if (!this.configFileContent) {
      this._loadConfig();
    }

    const serverIp = this.configFileContent?.['Web']?.['serverip'];
    if (!serverIp) {
      throw new Error('Server IP not configured. Please set a port first.');
    }

    const url = `http://${serverIp}/json`;

    /**
     * Waits for the gosumemory service to respond.
     *
     * @returns {Promise<void>} - Promise resolving when the service responds.
     */
    const waitForService = async () => {
      let attempts = 0;

      while (attempts < maxAttempts) {
        try {
          await axios.get(url, { timeout: 5000 });
          return;
        } catch (error) {
          attempts++;
          if (this.displayLogs && attempts < maxAttempts) {
            console.log(`Attempt ${attempts}/${maxAttempts} failed, retrying in ${delayBetweenAttempts}ms...`);
          }
          await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
        }
      }

      throw new Error(`The service did not respond after ${maxAttempts} attempts.`);
    };

    try {
      await waitForService();
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
}

module.exports = Gomemextra;
