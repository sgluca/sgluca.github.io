import os

folder = "analisi"
files = sorted(os.listdir(folder))

with open(f"{folder}/index.md", "w", encoding="utf-8") as f:
    f.write("# 📂 Analisi\n\nEcco i documenti disponibili:\n\n")
    for file in files:
        if file.endswith(".md"):  # Filtra solo i file Markdown
            f.write(f"- [📄 {file}](./{file})\n")
    f.write("\nClicca su un file per aprirlo!\n")
