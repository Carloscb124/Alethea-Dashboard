-- Create tables for the verification system

-- Submissions table for user-submitted content
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('LINK', 'IMAGE', 'TEXT')),
  content TEXT NOT NULL,
  submitter_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fact checks table for analyses and verdicts
CREATE TABLE public.fact_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  news_item_id UUID REFERENCES public.news_items(id) ON DELETE SET NULL,
  analysis TEXT NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('true', 'false', 'partial', 'manipulated')),
  sources TEXT[] NOT NULL DEFAULT '{}',
  checked_by TEXT, -- fact-checker identifier
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add verification fields to existing news_items table
ALTER TABLE public.news_items 
ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('true', 'false', 'partial', 'manipulated')),
ADD COLUMN IF NOT EXISTS fact_check_id UUID REFERENCES public.fact_checks(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
CREATE POLICY "Anyone can submit content" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update submission status" 
ON public.submissions 
FOR UPDATE 
USING (true);

-- RLS Policies for fact_checks
CREATE POLICY "Anyone can view published fact checks" 
ON public.fact_checks 
FOR SELECT 
USING (published = true);

CREATE POLICY "Anyone can create fact checks" 
ON public.fact_checks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update fact checks" 
ON public.fact_checks 
FOR UPDATE 
USING (true);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_timestamp_updated_at();

CREATE TRIGGER update_fact_checks_updated_at
  BEFORE UPDATE ON public.fact_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_timestamp_updated_at();