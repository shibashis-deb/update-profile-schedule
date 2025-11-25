import { spawn } from 'child_process';
import path from 'path';

const INTERVAL_HOURS = 12;
const INTERVAL_MS = INTERVAL_HOURS * 60 * 60 * 1000;

function runUpdate() {
  console.log(`[${new Date().toISOString()}] Starting profile update...`);

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCmd, ['start'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  child.on('close', (code) => {
    console.log(`[${new Date().toISOString()}] Profile update finished with code ${code}`);
    console.log(`Next update scheduled in ${INTERVAL_HOURS} hours.`);
  });

  child.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Failed to start profile update:`, err);
  });
}

// Run immediately on start
runUpdate();

// Schedule subsequent runs
setInterval(runUpdate, INTERVAL_MS);

console.log(`Scheduler started. Running every ${INTERVAL_HOURS} hours.`);

// Start a dummy server to satisfy Render's port binding requirement
import http from 'http';
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Scheduler is running\n');
}).listen(port, () => {
  console.log(`Dummy server listening on port ${port}`);
});
