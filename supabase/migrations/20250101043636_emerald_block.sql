/*
  # Update metrics schema

  1. Changes
    - Make accuracy_score and relevancy_score nullable
    - Add coherence_score and completeness_score columns
    - Add constraints to ensure valid score ranges
    - Add indexes for performance optimization

  2. Security
    - No changes to RLS policies needed
*/

-- Make existing score columns nullable and add check constraints
ALTER TABLE metrics
ALTER COLUMN accuracy_score DROP NOT NULL,
ALTER COLUMN relevancy_score DROP NOT NULL,
ADD CONSTRAINT metrics_accuracy_score_check 
  CHECK (accuracy_score IS NULL OR (accuracy_score >= 0 AND accuracy_score <= 1)),
ADD CONSTRAINT metrics_relevancy_score_check 
  CHECK (relevancy_score IS NULL OR (relevancy_score >= 0 AND relevancy_score <= 1));

-- Add new metric columns with constraints
ALTER TABLE metrics
ADD COLUMN IF NOT EXISTS coherence_score float,
ADD COLUMN IF NOT EXISTS completeness_score float,
ADD CONSTRAINT metrics_coherence_score_check 
  CHECK (coherence_score IS NULL OR (coherence_score >= 0 AND coherence_score <= 1)),
ADD CONSTRAINT metrics_completeness_score_check 
  CHECK (completeness_score IS NULL OR (completeness_score >= 0 AND completeness_score <= 1));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_metrics_scores 
ON metrics (accuracy_score, relevancy_score, coherence_score, completeness_score);

CREATE INDEX IF NOT EXISTS idx_metrics_response_id 
ON metrics (response_id);

-- Remove the automatic metrics calculation trigger since we now calculate metrics in the application
DROP TRIGGER IF EXISTS calculate_metrics_on_response ON llm_responses;
DROP FUNCTION IF EXISTS calculate_response_metrics();