export const CreateCoordinatesMessages = {
  longitude: {
    invalidType: 'must be number',
    min: 'The latitude cannot be less than -90',
    max: 'The latitude cannot be greater than 90'
  },
  latitude: {
    invalidType: 'must be number',
    min: 'The longitude cannot be less than -180',
    max: 'TThe longitude cannot be more than 180'
  }
} as const;
