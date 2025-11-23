"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../../components/StarRating";
import ReviewCard from "../../components/ReviewCard";
import ReviewModal from "../../components/ReviewModal";
import { useBook } from "@/hooks/useBook";
import { useBookReviews } from "@/hooks/useBookReviews";

interface BookDetailClientProps {
  bookId: string; 
}

function getTimeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `hace ${interval} ${unit}${interval > 1 ? 's' : ''}`; 
    }
  }

  return "hace un momento";
}

export default function BookDetailClient({ bookId }: BookDetailClientProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const { 
    data: book, 
    isLoading:isLoadingBooks, 
    isError: isErrorBooks, 
    error: error_books 
  } = useBook(bookId);
  const {
    data: reviews, 
    isLoading:isLoadingBookReviews, 
    isError: isErrorBookReviews, 
    error: error_book_reviews
  } = useBookReviews(bookId); 

 
  const isLoading = isLoadingBooks || isLoadingBookReviews
  const error = error_books || error_book_reviews
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center">
        <p className="text-[#2B2B2B] font-mono text-lg animate-pulse">Loading book details...</p>
      </div>
    );
  }
  if (error || !book || !reviews) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 font-mono text-lg">
          {error instanceof Error ? error.message : "Error loading book"}
        </p>
        <Link href="/discover" className="text-[#D6A55F] underline hover:text-[#B8B1A6]">
          Back to Discover
        </Link>
      </div>
    );
  }

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 
  ? (totalRating / reviews.length).toFixed(1) 
  : 0

  return (
    <>
      <div className="min-h-screen bg-[#F8F4EE] font-mono px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between mb-6">
            <Link href="/discover" className="flex items-center gap-2 text-[#2B2B2B] hover:text-[#D6A55F] transition-colors">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-base font-bold">Book Details</span>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* User Profile Icon */}
              <Link href="/profile" className="p-2 hover:bg-[#EAE7E2] rounded-full transition-colors">
                <svg
                  className="w-5 h-5 text-[#D6A55F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
              
              {/* Share Icon */}
              <button className="p-2 hover:bg-[#EAE7E2] rounded-full transition-colors">
                <svg
                  className="w-5 h-5 text-[#D6A55F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Book Information Section */}
          <section className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-48 aspect-[2/3] md:w-56 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={book.coverImage}
                  alt={book.coverAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 224px"
                  priority
                />
              </div>
            </div>

            {/* Title, Author, Rating */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-[#2B2B2B] mb-2">{book.title}</h1>
                <p className="text-lg text-[#6F6F6F]">by {book.author}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating rating={averageRating} size="lg" />
                <span className="text-[#2B2B2B] font-bold">{averageRating}</span>
                <span className="text-[#6F6F6F]">({reviews.length || 0} reviews)</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#D6A55F] text-[#FCFBF9] font-medium hover:bg-[#B8B1A6] transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Add to Favorites
                </button>
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-6 py-3 rounded-lg bg-[#FCFBF9] border border-[#B8B1A6] text-[#2B2B2B] font-medium hover:bg-[#EAE7E2] transition-colors"
                >
                  Write a review
                </button>
              </div>
            </div>
          </section>

          {/* About this book Section */}
          <section className="mb-8">
            <div className="bg-[#FCFBF9] rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#2B2B2B] mb-3">About this book</h2>
              <p className="text-[#2B2B2B] leading-relaxed">{book.description}</p>
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-xl font-bold text-[#2B2B2B]">Reviews</h2>
            </div>

            <div className="space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  reviewerName={review.reviewerName}
                  timeAgo={getTimeAgo(review.createdAt)}
                  rating={review.rating}
                  reviewText={review.reviewText}
                  avatar={review.avatar}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        bookTitle={book.title}
        bookId={bookId}
      />
    </>
  );
}

