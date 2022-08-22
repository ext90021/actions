# Run Ansible playbook GitHub Action

An Action that executes given Ansible playbook on selected hosts.

Should work on any OS, if `ansible-playbook` command is available in `PATH`.

## Usage

```yaml
- name: Run playbook
  uses: ext90021/action-ansible-playbook@v1
  with:
    playbook: tdvserver.yml
    directory: ./tdv
    key: ${{secrets.SSH_PRIVATE_KEY}}
    inventory: tdv_inventory.ini
    vault_password: ${{secrets.VAULT_PASSWORD}}
    options: |
      --verbose
```
