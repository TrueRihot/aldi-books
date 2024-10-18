// Interface for the Rating schema
export interface Rating {
  source?: string; // The source of the rating (optional)
  value: number; // The rating value (required)
}

// Interface for the Book schema
export interface Book {
  name: string; // The name of the book (required)
  author: string; // The author of the book (required)
  category: string; // The category or genre of the book (required)
  ratings?: Rating[]; // A list of ratings for the book (optional)
  publishYear: number; // The year the book was published (required)
}

// Example of the response from GET /books
export type GetBooksResponse = Book[];

// Example of the request body for POST /books
export type AddBookRequest = Book;

// Example of the response from POST /books
export type AddBookResponse = Book;
