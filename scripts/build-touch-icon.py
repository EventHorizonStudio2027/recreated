from pathlib import Path
import base64,re,io
from PIL import Image,ImageOps
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf-8')
match=re.search(r'class="brand"><img src="data:image/webp;base64,([^"]+)"',html)
if not match: raise RuntimeError('Original brand artwork missing')
im=Image.open(io.BytesIO(base64.b64decode(match.group(1)))).convert('RGB')
ImageOps.fit(im,(180,180),method=Image.Resampling.LANCZOS).save(root/'apple-touch-icon.png','PNG')
with Image.open(root/'apple-touch-icon.png') as result:
    assert result.size==(180,180) and result.format=='PNG'
