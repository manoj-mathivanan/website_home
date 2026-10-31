import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { onePage } from '../src/resume.js';
const result = spawnSync(process.env.RESUME_PYTHON || 'python', [fileURLToPath(new URL('./create_resume_pdf.py', import.meta.url))], { input: JSON.stringify(onePage), encoding: 'utf8' });
if (result.error) throw result.error;
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.status !== 0) process.exit(result.status || 1);
