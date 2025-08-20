export const UpdateUserMessages = {
  avatar: {
    invalidFormat: 'must be a string',
  },
  firstName: {
    invalidFormat: 'must be a string',
    lengthField: 'min length is 1, max is 15',
  },
  lastName: {
    invalidFormat: 'must be a string',
    lengthField: 'min length is 1, max is 15'
  },
} as const;
