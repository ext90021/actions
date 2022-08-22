const core = require('@actions/core')
const exec = require('@actions/exec')
const yaml = require('yaml')
const fs = require('fs')
const os = require('os')

async function main() {
    try {
        const playbook = core.getInput("playbook", { required: true })
        const directory = core.getInput("directory")
        const key = core.getInput("key")
        const inventory = core.getInput("inventory")
        const vaultConfig = core.getInput("vault_config")
        const vaultPassword = core.getInput("vault_password")
        const knownHosts = core.getInput("known_hosts")
        const options = core.getInput("options")

        let cmd = ["ansible-playbook", playbook]

        if (options) {
            cmd.push(options.replace(/\n/g, " "))
        }

        if (directory) {
            process.chdir(directory)
            core.saveState("directory", directory)
        }

        if (key) {
            const keyFile = ".ansible_key"
            fs.copyFile(key, keyFile, fs.constants.COPYFILE_EXCL, (err) => {
              if (err) {
                console.log("Error Found:", err);
              }
              else {
                try {
                  const fd = fs.openSync(keyFile, "r");
                  fs.fchmodSync(fd, 0o600);
                } catch (error) {
                  console.log(error);
                }
              }
            })          
            core.saveState("keyFile", keyFile)
            cmd.push("--key-file")
            cmd.push(keyFile)
        }

        if (inventory) {
            const inventoryFile = "ansible_inventory"
            fs.copyFile(inventory, inventoryFile, fs.constants.COPYFILE_EXCL, (err) => {
              if (err) {
                console.log("Error Found:", err);
              }
            })          
            core.saveState("inventoryFile", inventoryFile)
            cmd.push("--inventory-file")
            cmd.push(inventoryFile)
        }

        if (vaultConfig) {
            const vaultConfigFile = "ansible_vault"
            fs.copyFile(vaultConfig, vaultConfigFile, fs.constants.COPYFILE_EXCL, (err) => {
              if (err) {
                console.log("Error Found:", err);
              }
            })
            core.saveState("vaultConfigFile", vaultConfigFile)
            cmd.push("-e @"+vaultConfigFile)
        }

        if (vaultPassword) {
            const vaultPasswordFile = ".ansible_vault_password"
            fs.writeFileSync(vaultPasswordFile, vaultPassword, { mode: 0600 })
            core.saveState("vaultPasswordFile", vaultPasswordFile)
            cmd.push("--vault-password-file")
            cmd.push(vaultPasswordFile)
        }

        if (knownHosts) {
            const knownHostsFile = ".ansible_known_hosts"
            fs.writeFileSync(knownHostsFile, knownHosts, { mode: 0600 })
            core.saveState("knownHostsFile", knownHostsFile)
            cmd.push(`--ssh-common-args="-o UserKnownHostsFile=${knownHostsFile}"`)
            process.env.ANSIBLE_HOST_KEY_CHECKING = "True"
        } else {
            process.env.ANSIBLE_HOST_KEY_CHECKING = "False"
        }

        let output = ""
        await exec.exec(cmd.join(' '), null, {
          listeners: {
            stdout: function(data) {
              output += data.toString()
            },
            stderr: function(data) {
              output += data.toString()
            }
          }
        })
        core.setOutput("output", output)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
