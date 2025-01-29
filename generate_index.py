import os

folder = "Analisi"
files = sorted(os.listdir(folder))

with open(f"{folder}/index.md", "w", encoding="utf-8") as f:
    f.write("# 📂 Analisi\n\nEcco i documenti disponibili:\n\n")
    for file in files:
        if file.endswith(".md") and file != "index.md":  # Filtra solo i file Markdown e esclude index.md
            with open(f"{folder}/{file}", "r", encoding="utf-8") as md_file:
                title = md_file.readline().strip().replace("#", "").strip()  # Legge il titolo del file
            f.write(f"- [📄 {title}](./{file})\n")
    f.write("\nClicca su un file per aprirlo!\n")
    