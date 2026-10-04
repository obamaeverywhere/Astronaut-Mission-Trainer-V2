"""Builds ONE self-contained HTML file from the project (handy for quick sharing or the Claude preview).
Usage: python3 tools/bundle.py [--cdn]   (--cdn loads three.js from cdnjs instead of inlining it)"""
import sys,re,os
os.chdir(os.path.join(os.path.dirname(__file__),'..'))
cdn='--cdn' in sys.argv
idx=open('index.html').read()
def inline(m):
    f=m.group(1)
    if f.startswith('vendor/') and cdn: return '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
    return '<script>'+open(f).read()+'</script>'
idx=re.sub(r'<script src="([^"]+)"></script>',inline,idx)
idx=idx.replace('<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/kid.css">','<style>'+open('css/style.css').read()+open('css/kid.css').read()+'</style>')
os.makedirs('dist',exist_ok=True);out='dist/outpost-zero-single.html';open(out,'w').write(idx);print('wrote',out,len(idx)//1024,'KB')

