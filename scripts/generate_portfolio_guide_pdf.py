from pathlib import Path

INPUT = Path('docs/portfolio-ui-guide.md')
OUTPUT = Path('docs/portfolio-ui-guide.pdf')


def wrap_line(line: str, width: int = 92):
    if len(line) <= width:
        return [line]
    parts = []
    current = line
    while len(current) > width:
        cut = current.rfind(' ', 0, width)
        if cut <= 0:
            cut = width
        parts.append(current[:cut].rstrip())
        current = current[cut:].lstrip()
    if current:
        parts.append(current)
    return parts


def escape_pdf_text(text: str) -> str:
    return text.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')


def build_pdf(lines):
    lines_per_page = 52
    page_chunks = [lines[i:i + lines_per_page] for i in range(0, len(lines), lines_per_page)]
    if not page_chunks:
        page_chunks = [[]]

    objects = []

    # 1: Catalog
    objects.append('<< /Type /Catalog /Pages 2 0 R >>')

    # 2: Pages (filled after page objects are created)
    objects.append('')

    page_object_numbers = []
    content_object_numbers = []

    for chunk in page_chunks:
        # Content stream
        content_lines = ['BT', '/F1 10 Tf', '50 790 Td', '14 TL']
        first = True
        for line in chunk:
            text = escape_pdf_text(line)
            if first:
                content_lines.append(f'({text}) Tj')
                first = False
            else:
                content_lines.append('T*')
                content_lines.append(f'({text}) Tj')
        content_lines.append('ET')
        stream_data = '\n'.join(content_lines) + '\n'
        content_obj = f'<< /Length {len(stream_data.encode("utf-8"))} >>\nstream\n{stream_data}endstream'
        content_object_numbers.append(len(objects) + 1)
        objects.append(content_obj)

        page_obj_num = len(objects) + 1
        page_object_numbers.append(page_obj_num)
        page_obj = (
            f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] '
            f'/Resources << /Font << /F1 {len(objects) + 1} 0 R >> >> '
            f'/Contents {content_object_numbers[-1]} 0 R >>'
        )
        objects.append(page_obj)

    # Font object (single shared object referenced by all pages)
    font_obj_num = len(objects) + 1
    objects.append('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

    # Re-write page objects so each references shared font object
    for idx, page_obj_num in enumerate(page_object_numbers):
        content_obj_num = content_object_numbers[idx]
        objects[page_obj_num - 1] = (
            f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] '
            f'/Resources << /Font << /F1 {font_obj_num} 0 R >> >> '
            f'/Contents {content_obj_num} 0 R >>'
        )

    kids = ' '.join(f'{n} 0 R' for n in page_object_numbers)
    objects[1] = f'<< /Type /Pages /Kids [{kids}] /Count {len(page_object_numbers)} >>'

    pdf = ['%PDF-1.4']
    offsets = [0]
    current = len(pdf[0]) + 1

    for i, obj in enumerate(objects, start=1):
        entry = f'{i} 0 obj\n{obj}\nendobj\n'
        offsets.append(current)
        pdf.append(entry)
        current += len(entry.encode('utf-8'))

    xref_pos = current
    xref = [f'xref\n0 {len(objects) + 1}', '0000000000 65535 f ']
    for off in offsets[1:]:
        xref.append(f'{off:010d} 00000 n ')
    trailer = (
        f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n'
        f'startxref\n{xref_pos}\n%%EOF\n'
    )

    content = '\n'.join(pdf) + '\n' + '\n'.join(xref) + '\n' + trailer
    return content.encode('utf-8')


def main():
    raw = INPUT.read_text(encoding='utf-8').splitlines()
    prepared = []
    for line in raw:
        if not line.strip():
            prepared.append('')
            continue
        for wrapped in wrap_line(line):
            prepared.append(wrapped)

    OUTPUT.write_bytes(build_pdf(prepared))
    print(f'Wrote {OUTPUT}')


if __name__ == '__main__':
    main()
