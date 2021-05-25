module.exports = {
  id: {
    type: 'uuid',
    unique: true,
    required: true,
  },
  comment_id: {
    type: 'uuid',
    unique: true,
    required: true,
  },
  body: {
    type: 'string',
    required: true,
  },
  owned_by: {
    type: 'relationship',
    target: 'User',
    relationship: 'OWNED_BY',
    direction: 'out',
    properties: {
      user: 'string',
    },
    cascade: 'detach',
  },
  is_in: {
    type: 'relationship',
    target: 'Post',
    relationship: 'IS_IN',
    direction: 'out',
    properties: {
      post_id: 'uuid',
    },
    cascade: 'detach',
  },
};
