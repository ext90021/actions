# Run Ansible playbook GitHub Action

An Action that executes given Ansible playbook on selected hosts.

Should work on any OS, if `ansible-playbook` command is available in `PATH`.

## Usage

```yaml
- name: Run playbook
  uses: ext90021/action-ansible-playbook@v1
  with:
    directory: ./tdv
    playbook: "${{ env.ANSIBLE_BASE_DIR }}/ansible/tdvserver.yml"
    inventory: "${{ env.TARGET_CONF }}/tdv_inventory.ini"
    key: "${{ env.TARGET_CONF }}/tdv_key.pem"
    vault_file: "${{ env.TARGET_CONF }}/tdv_vault"
    vault_password: "${{ secrets.TDV_VAULT_PASSWORD }}"
    options: |
      --verbose
```
