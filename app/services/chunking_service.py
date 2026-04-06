from __future__ import annotations


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[dict]:
    """
    Split text into overlapping chunks, respecting paragraph boundaries where possible.
    Returns a list of dicts with chunk_index and text.
    """
    # Split on double newlines to respect paragraph boundaries
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks: list[dict] = []
    current = ""
    chunk_index = 0

    for paragraph in paragraphs:
        # If adding this paragraph stays under chunk_size, keep building
        if len(current) + len(paragraph) + 2 <= chunk_size:
            current = (current + "\n\n" + paragraph).strip()
        else:
            # Flush current chunk if non-empty
            if current:
                chunks.append({"chunk_index": chunk_index, "text": current})
                chunk_index += 1
                # Carry over the overlap tail into the next chunk
                current = current[-overlap:].strip() + "\n\n" + paragraph
                current = current.strip()
            else:
                # Paragraph alone exceeds chunk_size — hard-split it
                for start in range(0, len(paragraph), chunk_size - overlap):
                    piece = paragraph[start: start + chunk_size]
                    chunks.append({"chunk_index": chunk_index, "text": piece})
                    chunk_index += 1
                current = ""

    if current:
        chunks.append({"chunk_index": chunk_index, "text": current})

    return chunks
