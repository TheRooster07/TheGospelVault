# Isaiah visual aids — generator

Builds the 18 Isaiah charts in the same style as the Prophecy visual aids.

1. `node maps.js` — draws the four schematic maps (map-*.png).
2. `node build-full.js` — builds Isaiah_Visual_Aids.pptx (Cambria/Arial, 16:9, speaker notes with sources). Needs pptxgenjs; the apply_theme path at the top points to Claude's pptx skill and can be removed if run elsewhere.
3. Convert the .pptx to PDF (LibreOffice or PowerPoint), then export each page as a 1600 × 900 JPG.
4. `python3 page.py` — builds bible-studies/isaiah/visual-aids.html from the Prophecy gallery page.

Chart content is drawn from Pastor William K. Lyons's Isaiah 1–66 Outline and Notes; each slide's speaker notes name the sources.
