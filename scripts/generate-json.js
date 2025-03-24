import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/datalist');
const subDirs = fs.readdirSync(srcDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const categories = subDirs;

function processMarkdownFiles(category) {
  const categoryDir = path.join(srcDir, category);
  const questions = [];

  if (!fs.existsSync(categoryDir)) {
    console.log(`目录不存在：${categoryDir}`);
    return [];
  }

  const files = fs.readdirSync(categoryDir);
  files.forEach((file) => {
    if (file.endsWith('.md')) {
      const filePath = path.join(categoryDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const id = path.basename(file, '.md');
      
      // 简单的标题提取（假设第一行是标题）
      const lines = content.split('\n');
      const title = lines[0].replace(/^#+\s+/g, '').replace(/^\d+\.\s*/, '').replace(/<[^>]+>/g, '');
      const answer = lines.slice(1).join('\n').trim();

      questions.push({
        id,
        title,
        answer
      });
    }
  });

  return questions;
}

function generateJsonFiles() {
  console.log(categories)
  categories.forEach((category) => {
    const questions = processMarkdownFiles(category);
    const outputPath = path.join(srcDir, `${category}.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`Generated ${outputPath}`);
  });
}

generateJsonFiles();