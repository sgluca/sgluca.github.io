"""Build one article index while preserving existing article URLs."""
from html import escape
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent
SOURCES = ("Blog", "Analisi")
ICONS = {"gestfest": "🎉", "iis": "🖥️", "ium": "👤", "react": "⚛️", "notifiche": "🔔", "pulizia": "🧹", "identity": "🔐", "ricerca": "🔍", "test": "🧪", "freepbx": "📞"}


def metadata(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    if lines and lines[0] == "---":
        for line in lines[1:]:
            if line == "---":
                break
            if line.startswith("title:"):
                return line.split(":", 1)[1].strip().strip('"')
    return path.stem


def render_index():
    cards = []
    for folder in SOURCES:
        for path in sorted((ROOT / folder).glob("*.md")):
            if path.name == "index.md":
                continue
            icon = next((value for key, value in ICONS.items() if key in path.stem.lower()), "📄")
            href = f"../{folder}/{quote(path.stem)}.html"
            title = escape(metadata(path))
            cards.append(f'  <a href="{href}" class="article-card">\n    <div class="article-icon" aria-hidden="true">{icon}</div>\n    <div class="article-title">{title} <span class="article-arrow" aria-hidden="true">→</span></div>\n  </a>')
    return ('---\nlayout: default\ntitle: "Articoli"\ndescription: "Guide e analisi sullo sviluppo software"\n---\n\n<p>Guide, approfondimenti e analisi sullo sviluppo software.</p>\n\n<div class="article-list">\n' + "\n".join(cards) + '\n</div>\n')


if __name__ == "__main__":
    (ROOT / "Blog" / "index.md").write_text(render_index(), encoding="utf-8")
