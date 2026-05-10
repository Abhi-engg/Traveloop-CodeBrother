import os
import glob

files = glob.glob('src/pages/*.jsx')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # replace \` with `
    content = content.replace('\\`', '`')
    # replace \$ with $
    content = content.replace('\\$', '$')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
