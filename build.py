#!/usr/bin/env python3
"""
build.py — Minimal static-site builder.

Reads HTML files from ./pages/, replaces {{partial:NAME}} markers with the
contents of ./_partials/NAME.html, sets the active nav state, and writes
the output to the project root.

No dependencies. ~50 lines. Run with: python3 build.py
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).parent
PAGES_DIR = ROOT / "pages"
PARTIALS_DIR = ROOT / "_partials"
OUTPUT_DIR = ROOT


def load_partial(name: str) -> str:
    return (PARTIALS_DIR / f"{name}.html").read_text(encoding="utf-8")


def set_active_nav(html: str, page_key: str) -> str:
    """Mark the active navigation link with aria-current='page'."""
    if not page_key:
        return html
    pattern = rf'(<a[^>]*data-nav="{page_key}"[^>]*)>'
    return re.sub(pattern, r'\1 aria-current="page">', html)


def build_page(page_path: Path) -> None:
    html = page_path.read_text(encoding="utf-8")

    # Detect the page key from a {{page:KEY}} marker (if present)
    page_match = re.search(r"\{\{page:(\w+)\}\}", html)
    page_key = page_match.group(1) if page_match else ""
    html = re.sub(r"\{\{page:\w+\}\}\s*", "", html)

    # Replace {{partial:NAME}} markers
    def replace_partial(match: re.Match) -> str:
        return load_partial(match.group(1))

    html = re.sub(r"\{\{partial:(\w+)\}\}", replace_partial, html)
    html = set_active_nav(html, page_key)

    output_path = OUTPUT_DIR / page_path.name
    output_path.write_text(html, encoding="utf-8")
    print(f"  built  {output_path.name}")


def main() -> None:
    print("Building site...")
    for page in sorted(PAGES_DIR.glob("*.html")):
        build_page(page)
    print("Done.")


if __name__ == "__main__":
    main()
