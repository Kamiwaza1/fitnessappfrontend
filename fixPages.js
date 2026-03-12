const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add 'use client'
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
        content = `"use client";\n` + content;
    }

    // Replace '../components/' with '@/components/'
    content = content.replace(/\.\.\/components\//g, '@/components/');
    
    // Replace 'react-router-dom' imports for Link
    content = content.replace(/import \{ Link \} from 'react-router-dom';/g, "import Link from 'next/link';");
    content = content.replace(/import \{.*NavLink.*\} from 'react-router-dom';/g, "import Link from 'next/link';");
    
    // Replace 'useNavigate' with 'useRouter' from 'next/navigation'
    if (content.includes('useNavigate')) {
        content = content.replace(/import \{.*useNavigate.*\} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation';");
        content = content.replace(/const navigate = useNavigate\(\);/g, "const router = useRouter();");
        content = content.replace(/navigate\(/g, "router.push(");
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

const pages = [
    'src/app/page.jsx',
    'src/app/nutrition/page.jsx',
    'src/app/workouts/page.jsx',
    'src/app/library/page.jsx',
    'src/app/progress/page.jsx',
    'src/app/login/page.jsx',
];

pages.forEach(p => processFile(path.join(__dirname, p)));

console.log('done converting pages');
