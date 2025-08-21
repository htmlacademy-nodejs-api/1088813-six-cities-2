export const CreateCommentMessages = {
  text: {
    required: 'required field',
  },
  authorId: {
    invalidId: 'authorId field must be a valid id',
  },
  suggestionId: {
    invalidId: 'suggestionId field must be a valid id',
  },
  rating: {
    min: 'min rating is 1',
    max: 'max rating is 5',
    invalidType: 'must be an integer',
  },
} as const;
