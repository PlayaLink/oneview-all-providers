-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  element_selector TEXT NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  placement TEXT NOT NULL CHECK (placement IN ('top', 'bottom', 'left', 'right')),
  page_url TEXT NOT NULL,
  git_branch TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by page_url
CREATE INDEX IF NOT EXISTS idx_annotations_page_url ON annotations(page_url);

-- Create index for faster queries by created_at
CREATE INDEX IF NOT EXISTS idx_annotations_created_at ON annotations(created_at);

-- Enable Row Level Security
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read annotations
CREATE POLICY "Allow authenticated users to read annotations" ON annotations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow all authenticated users to insert annotations
CREATE POLICY "Allow authenticated users to insert annotations" ON annotations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow all authenticated users to update their own annotations
CREATE POLICY "Allow authenticated users to update annotations" ON annotations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow all authenticated users to delete annotations
CREATE POLICY "Allow authenticated users to delete annotations" ON annotations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_annotations_updated_at
  BEFORE UPDATE ON annotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE annotations IS 'Stores user annotations for UI elements across the application';
COMMENT ON COLUMN annotations.text IS 'The annotation text content';
COMMENT ON COLUMN annotations.element_selector IS 'CSS selector to identify the annotated element';
COMMENT ON COLUMN annotations.position_x IS 'X coordinate of the click position';
COMMENT ON COLUMN annotations.position_y IS 'Y coordinate of the click position';
COMMENT ON COLUMN annotations.placement IS 'Preferred placement direction (top, bottom, left, right)';
COMMENT ON COLUMN annotations.page_url IS 'URL path where the annotation was created';
COMMENT ON COLUMN annotations.git_branch IS 'Git branch name when the annotation was created';
