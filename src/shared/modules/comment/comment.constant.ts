import {AGGREGATE_SUGGESTION, AGGREGATE_USER} from '../../consts/index.js';

export const AGGREGATE_COMMENT = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author',
    }
  },
  {
    $unwind: '$author',
  },
  {
    $lookup: {
      from: 'suggestions',
      localField: 'suggestionId',
      foreignField: '_id',
      as: 'suggestion',
    },
  },
  {
    $unwind: '$suggestion',
  },
  {
    $project: {
      text: 1,
      createdAt: 1,
      updatedAt: 1,
      rating: 1,
      author: AGGREGATE_USER,
      suggestion: AGGREGATE_SUGGESTION
    }
  }
];

export enum CommentSettings {
  MAX_COMMENTS_COUNT = 50,
}
