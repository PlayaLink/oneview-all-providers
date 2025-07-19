-- Create notes table for record annotations and comments
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  author TEXT NOT NULL,
  record_id UUID NOT NULL,
  record_type TEXT NOT NULL
);

-- Add indexes for better performance
CREATE INDEX idx_notes_record_id ON notes(record_id);
CREATE INDEX idx_notes_record_type ON notes(record_type);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_author ON notes(author);

-- Add comments for documentation
COMMENT ON TABLE notes IS 'Stores notes and comments for various record types';
COMMENT ON COLUMN notes.text IS 'The note content';
COMMENT ON COLUMN notes.author IS 'Author of the note';
COMMENT ON COLUMN notes.record_id IS 'ID of the record this note belongs to';
COMMENT ON COLUMN notes.record_type IS 'Type of record (e.g., providers, state_licenses, etc.)';

-- Grant permissions
GRANT ALL ON TABLE notes TO authenticated; 