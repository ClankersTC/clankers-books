"use client";

import { useState } from "react";
import { useCreateReview } from "@/hooks/useCreateReview";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookId: string;
  onSuccess?: () => void;
}

export default function ReviewModal({ 
  isOpen, 
  onClose,
  bookTitle, 
  bookId,
  onSuccess
}: ReviewModalProps) {
  const createReviewMutation = useCreateReview();
  const [rating, setRating] = useState(4);
  const [startedDate, setStartedDate] = useState(new Date().toISOString().split('T')[0]);
  const [finishedDate, setFinishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reviewText, setReviewText] = useState("");
  const [hasSpoilers, setHasSpoilers] = useState(false);


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleCleanForm = () => {
    setRating(4);
    setStartedDate(new Date().toISOString().split('T')[0]);
    setFinishedDate(new Date().toISOString().split('T')[0]);
    setReviewText("");
    setHasSpoilers(false);
  }

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        rating: rating,
        reviewText: reviewText, 
        hasSpoilers: hasSpoilers,
        startedDate: startedDate, 
        finishedDate: finishedDate 
      };

        createReviewMutation.mutate(
        { bookId, payload },
        {
          onSuccess: () => {
            onClose();
            handleCleanForm(); 
          },
          onError: (error: any) => {
            
          }
        }
      );
      
    } catch (err: any) {
      console.error("Error submit review:");
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#FCFBF9] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#B8B1A6]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#2B2B2B]">Review</h2>
            <button
              onClick={handleSubmit}
              className="text-[#D6A55F] font-medium hover:text-[#B8B1A6] transition-colors underline"
            >
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#EAE7E2] rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#2B2B2B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2B2B2B] mb-2">
                Your rating:
              </label>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => {}}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarClick(i);
                    }}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        i < rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-[#B8B1A6]">
                <label className="text-sm font-medium text-[#2B2B2B]">Started:</label>
                <div className="flex items-center gap-2 relative">
                  <input
                    type="date"
                    id="started-date"
                    value={startedDate}
                    onChange={(e) => setStartedDate(e.target.value)}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <span 
                    className="text-sm text-[#6F6F6F] cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById('started-date') as HTMLInputElement;
                      input?.showPicker();
                    }}
                  >
                    {formatDate(startedDate)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#B8B1A6]">
                <label className="text-sm font-medium text-[#2B2B2B]">Finished:</label>
                <div className="flex items-center gap-2 relative">
                  <input
                    type="date"
                    id="finished-date"
                    value={finishedDate}
                    onChange={(e) => setFinishedDate(e.target.value)}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <span 
                    className="text-sm text-[#6F6F6F] cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById('finished-date') as HTMLInputElement;
                      input?.showPicker();
                    }}
                  >
                    {formatDate(finishedDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Text Input */}
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-2">
              What did you think of the book?
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-lg border border-[#B8B1A6] bg-[#F8F4EE] text-[#2B2B2B] placeholder:text-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#D6A55F] focus:border-transparent min-h-[120px] resize-none"
            />
          </div>

          {/* Spoilers Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHasSpoilers(!hasSpoilers)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                hasSpoilers
                  ? "bg-[#D6A55F] border-[#D6A55F] text-[#FCFBF9]"
                  : "bg-transparent border-[#B8B1A6] text-[#2B2B2B] hover:bg-[#EAE7E2]"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <span className="text-sm font-medium">Spoilers?</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-[#FCFBF9] border border-[#B8B1A6] text-[#2B2B2B] font-medium hover:bg-[#EAE7E2] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg bg-[#D6A55F] text-[#FCFBF9] font-medium hover:bg-[#B8B1A6] transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

