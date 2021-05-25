module.exports = {
  id: {
    primary: true,
    type: 'uuid',
    required: true,
  },
  token: {
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
};
