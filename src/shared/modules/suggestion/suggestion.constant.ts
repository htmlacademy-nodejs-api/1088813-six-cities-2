import {AGGREGATE_USER} from '../../consts/index.js';

export const AGGREGATE_COMMENT = [
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'suggestionId',
      as: 'comments'
    }
  },
  {
    $lookup: {
      from: 'users',
      let: { authorId: '$authorId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$authorId'] }
          }
        },
        {
          $project: AGGREGATE_USER
        }
      ],
      as: 'author'
    }
  },
  {
    $unwind: {
      path: '$author',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      id: { $toString: '$_id' },
      commentsCount: { $size: '$comments' },
      rating: { $avg: '$comments.rating' },
    }
  },
  {
    $unset: 'comments'
  }
];
