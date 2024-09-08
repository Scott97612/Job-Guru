from pdfminer.high_level import extract_text

def pdf_to_text(pdf_file_path):
    return extract_text(pdf_file_path)
