"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Question {
  _id: string;
  text: string;
  options: string[];
}

interface Assessment {
  _id: string;
  skillId: {
    _id: string;
    name: string;
  };
  type: string;
  durationMinutes: number;
  questions: Question[];
}

interface AssessmentResult {
  score: number;
}

export default function AssessmentPage() {
  const params = useParams();
  const skillId = params.skillId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/assessments/skill/${skillId}`);
        setAssessment(res.data.data);
      } catch (err: unknown) {
        const apiError = err as {
          response?: {
            data?: {
              error?: {
                message?: string;
              };
            };
          };
        };
        setError(apiError.response?.data?.error?.message || 'Assessment not found');
      } finally {
        setLoading(false);
      }
    };
    if (user && skillId) {
      fetchAssessment();
    }
  }, [user, skillId]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    setSubmitting(true);
    
    // Format answers for backend: array of { questionId, selectedOptionIndex }
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOptionIndex: answers[qId]
    }));

    try {
      const res = await api.post(`/assessments/${assessment._id}/submit`, { answers: formattedAnswers });
      setResult(res.data.data as AssessmentResult);
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            error?: {
              message?: string;
            };
          };
        };
      };
      setError(apiError.response?.data?.error?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Assessment...</div>;
  }

  if (error || !assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-error-text mb-4">{error}</p>
        <Button onClick={() => router.push('/student/dashboard')}>Back to Passport</Button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl p-4 py-12">
        <Card className="text-center p-8 border-primary border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-fraunces text-primary">Assessment Complete</CardTitle>
            <CardDescription>You have completed the assessment for {assessment.skillId.name}</CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-6xl font-bold font-fraunces text-text-primary mb-2">
              {result.score}%
            </div>
            <p className="text-text-secondary">Your new verified score</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push('/student/dashboard')} size="lg">
              Return to Passport
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const isAnswered = answers[currentQuestion._id] !== undefined;

  return (
    <div className="mx-auto max-w-3xl p-4 py-8">
      <div className="mb-6 flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="font-fraunces text-2xl font-bold text-text-primary">{assessment.skillId.name} Assessment</h1>
          <p className="text-text-secondary text-sm mt-1">Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
        </div>
        <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {assessment.durationMinutes} min limit
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed font-inter font-medium text-text-primary">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <div 
              key={idx}
              onClick={() => handleSelectOption(currentQuestion._id, idx)}
              className={`p-4 rounded-md border cursor-pointer transition-colors ${
                answers[currentQuestion._id] === idx 
                  ? 'border-primary bg-primary/5 text-primary font-medium' 
                  : 'border-border hover:bg-border/30'
              }`}
            >
              {option}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t border-border">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0 || submitting}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!isAnswered || submitting || Object.keys(answers).length !== assessment.questions.length}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!isAnswered || submitting}
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
