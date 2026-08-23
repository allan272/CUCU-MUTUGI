const os = require('os');

if (typeof os.userInfo === 'function') {
  os.userInfo = () => ({
    uid: 0,
    gid: 0,
    username: process.env.USERNAME || process.env.USER || 'codex',
    homedir: process.env.USERPROFILE || process.cwd(),
    shell: process.env.COMSPEC || 'cmd.exe',
  });
}
