-- Create documents table for file/document management
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  record_id UUID NOT NULL,
  name TEXT NOT NULL,
  size INTEGER,
  document_type TEXT,
  permission TEXT,
  date DATE,
  exp_date DATE,
  verif_date DATE,
  exp_na BOOLEAN DEFAULT false,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add indexes for better performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_record_id ON documents(record_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_date ON documents(date);
CREATE INDEX idx_documents_exp_date ON documents(exp_date);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE documents IS 'Stores document/file information with metadata';
COMMENT ON COLUMN documents.user_id IS 'User who uploaded the document';
COMMENT ON COLUMN documents.record_id IS 'ID of the record this document belongs to';
COMMENT ON COLUMN documents.name IS 'Display name of the document';
COMMENT ON COLUMN documents.size IS 'File size in bytes';
COMMENT ON COLUMN documents.document_type IS 'Type/category of document';
COMMENT ON COLUMN documents.permission IS 'Permission level for the document';
COMMENT ON COLUMN documents.date IS 'Document date';
COMMENT ON COLUMN documents.exp_date IS 'Document expiration date';
COMMENT ON COLUMN documents.verif_date IS 'Document verification date';
COMMENT ON COLUMN documents.exp_na IS 'Whether expiration is not applicable';
COMMENT ON COLUMN documents.bucket IS 'Storage bucket name';
COMMENT ON COLUMN documents.path IS 'Storage path within bucket';

-- Grant permissions
GRANT ALL ON TABLE documents TO authenticated; 