import io, uuid
from pathlib import Path
import PyPDF2
from app.config import settings

class PDFService:
    upload_dir = Path(settings.UPLOAD_DIR)

    @classmethod
    def extract_text(cls, file_bytes: bytes, filename: str) -> str:
        if filename.lower().endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            return "\n\n".join(p.extract_text() or "" for p in reader.pages)
        return file_bytes.decode("utf-8", errors="ignore")

    @classmethod
    def save_file(cls, file_bytes: bytes, original_name: str) -> str:
        cls.upload_dir.mkdir(parents=True, exist_ok=True)
        ext = Path(original_name).suffix
        path = cls.upload_dir / f"{uuid.uuid4().hex}{ext}"
        path.write_bytes(file_bytes)
        return str(path)

pdf_service = PDFService()
