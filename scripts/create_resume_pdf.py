"""Generate the one-page public PDF from the same curated content as the HTML page.
Input: onePage JSON on stdin. Requires reportlab and pypdf.
"""
import json
import sys
from html import escape
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from pypdf import PdfReader

r = json.load(sys.stdin)
root = Path(__file__).resolve().parent.parent
out = root / 'public/downloads/Manoj-Mathivanan-Resume.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
ink = colors.HexColor('#202b29')
body = ParagraphStyle('Body', fontName='Helvetica', fontSize=9.1, leading=11.7, textColor=ink, spaceAfter=4)
heading = ParagraphStyle('Heading', parent=body, fontName='Helvetica-Bold', fontSize=9, leading=12, spaceBefore=9, spaceAfter=4, textColor=colors.HexColor('#914329'))
name = ParagraphStyle('Name', parent=body, fontName='Helvetica-Bold', fontSize=25, leading=29, spaceAfter=5)
role = ParagraphStyle('Role', parent=body, fontName='Helvetica-Bold', fontSize=10.4, leading=13, spaceAfter=7)
small = ParagraphStyle('Small', parent=body, fontSize=8.1, leading=10.5, textColor=colors.HexColor('#505955'))
bullet = ParagraphStyle('Bullet', parent=body, leftIndent=9, firstLineIndent=-7, spaceAfter=3)
job = ParagraphStyle('Job', parent=body, fontName='Helvetica-Bold', spaceBefore=5, spaceAfter=2)
story = []
def p(text, style=body):
    story.append(Paragraph(text, style))
def section(title, text):
    p(title.upper(), heading)
    p(escape(text))
p(escape(r['name']), name)
p(escape(r['title']), role)
p('Chennai, India | <link href="mailto:ma.manoj@gmail.com">ma.manoj@gmail.com</link> | <link href="https://manojmathivanan.com">manojmathivanan.com</link>', small)
p('<link href="https://github.com/manoj-mathivanan">github.com/manoj-mathivanan</link> | <link href="https://www.linkedin.com/in/manojmathivanan">linkedin.com/in/manojmathivanan</link>', small)
story.append(Spacer(1, 5))
p(escape(r['summary']))
section('Core skills', r['skills'])
p('EXPERIENCE', heading)
for item in r['jobs']:
    p(escape(item['company']) + ' | ' + escape(item['period']), job)
    p(escape(item['role']), small)
    for text in item['bullets']:
        p('- ' + escape(text), bullet)
section('Selected projects', r['projectText'])
p('<link href="https://github.com/manoj-mathivanan/trader_all">Trader source</link> | <link href="https://github.com/manoj-mathivanan/kafka-bootstrap-proxy">Kafka diagnostics source</link> | <link href="https://manojmathivanan.com/#projects">All projects and demos</link>', small)
section('Education', r['educationText'])
section('Recognition', r['recognitionText'])
story.append(Spacer(1, 6))
p(escape(r['footnote']), small)
doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=36, leftMargin=36, topMargin=32, bottomMargin=30, title='Manoj Mathivanan - Resume', author='Manoj Mathivanan', pageCompression=1)
doc.build(story)
reader = PdfReader(out)
if len(reader.pages) != 1:
    raise RuntimeError(f'Resume must be one page; generated {len(reader.pages)} pages')
print(f'Generated and verified one-page PDF: {out}')
