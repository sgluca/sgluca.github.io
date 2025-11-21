import os
import re

folders = ["Analisi", "Blog"]  # Add more folders as needed

# Map emojis for each folder
folder_emojis = {
    "Analisi": "🔍",
    "Blog": "✍️"
}

# Map emojis for each article type
article_type_emojis = {
    "ricerca": "🔍",
    "test": "🧪",
    "gestfest": "🎉",
    "gestione": "🖥️",
    "ium": "👤",
    "react": "⚛️",
    "notifiche": "🔔",
    "pulizia": "🧹",
    "identity": "🔐",
    "aspnet": "🔐"
}

def get_article_emoji(filename):
    """Get appropriate emoji based on filename"""
    filename_lower = filename.lower()
    for key, emoji in article_type_emojis.items():
        if key in filename_lower:
            return emoji
    return "📄"

def extract_title_from_markdown(filepath):
    """Extract title from markdown file, skipping front matter"""
    with open(filepath, "r", encoding="utf-8") as f:
        in_front_matter = False
        for line in f:
            if line.strip() == "---":
                if not in_front_matter:
                    in_front_matter = True
                    continue
                else:
                    in_front_matter = False
                    continue
            if in_front_matter:
                continue
            if line.startswith("#"):
                return line.strip().replace("#", "").strip()
    return "Untitled"

for folder in folders:
    files = sorted(os.listdir(folder))
    folder_emoji = folder_emojis.get(folder, "📁")
    
    with open(f"{folder}/index.md", "w", encoding="utf-8") as f:
        # Write front matter
        f.write(f"""---
layout: default
title: "{folder_emoji} {folder}"
description: "{'Progetti di ricerca e analisi tecnica' if folder == 'Analisi' else 'Articoli su sviluppo, tecnologie e tutorial'}"
---

# {folder_emoji} {folder}

Ecco i documenti disponibili:

<div class="article-list">
""")
        
        for file in files:
            if file.endswith(".md") and file != "index.md":  # Filtra solo i file Markdown e esclude index.md
                title = extract_title_from_markdown(f"{folder}/{file}")
                emoji = get_article_emoji(file)
                # URL encode the filename for proper linking
                encoded_file = file.replace(" ", "%20").replace(".md", ".html")
                f.write(f'  <a href="./{encoded_file}" class="article-card">\n')
                f.write(f'    <div class="article-icon">{emoji}</div>\n')
                f.write(f'    <div class="article-title">{title} <span class="article-arrow">→</span></div>\n')
                f.write(f'  </a>\n')
        
        f.write("</div>")