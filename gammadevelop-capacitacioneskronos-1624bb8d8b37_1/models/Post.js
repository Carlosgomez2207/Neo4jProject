module.exports = {
  id: {
    primary: true,
    type: 'uuid',
    required: true,
  },
  post_id: {
    type: 'uuid',
    required: true,
  },
  title: {
    type: 'string',
    optional: true,
    empty: true,
    default: 'New post.',
  },
  body: {
    type: 'string',
    optional: true,
    empty: true,
    default: 'Post without body.',
  },
  tags: {
    type: 'string',
    optional: true,
    empty: true,
    default: '',
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
};
