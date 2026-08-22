#!/usr/bin/env python3
"""Regenerate inlined critical-path CSS in every page from assets/styles.css.
Run after ANY edit to assets/styles.css:  python3 tools_inline_css.py
Replaces the <style id="site-css">…</style> block (or the external stylesheet
link, on first run) with the minified contents of assets/styles.css."""
import glob, re, rcssmin
css = rcssmin.cssmin(open('assets/styles.css').read())
block = '<style id="site-css">' + css + '</style>'
link_re  = re.compile(r'<link rel="stylesheet" href="/assets/styles\.css"[^>]*/?>')
style_re = re.compile(r'<style id="site-css">.*?</style>', re.S)
n=0
for f in ['index.html'] + glob.glob('*/index.html'):
    s = open(f).read()
    if style_re.search(s):
        s2 = style_re.sub(lambda m: block, s)
    elif link_re.search(s):
        s2 = link_re.sub(lambda m: block, s)
    else:
        print("  !! no stylesheet hook in", f); continue
    open(f,'w').write(s2); n += 1
print(f"inlined minified CSS ({len(css)} bytes) into {n} pages")
