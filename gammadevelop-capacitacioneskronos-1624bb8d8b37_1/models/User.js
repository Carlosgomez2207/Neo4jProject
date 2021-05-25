module.exports = {
  id: {
    primary: true,
    type: 'uuid',
  },
  username: {
    type: 'string',
    unique: true,
  },
  first_name: {
    type: 'string',
    unique: false,
  },
  last_name: {
    type: 'string',
    unique: false,
  },
  email: {
    type: 'string',
    email: true,
    unique: true,
  },
  admin: {
    type: 'boolean',
    default: false,
  },
  password_hash: {
    type: 'string',
    optional: true,
  },
  follows: {
    type: 'relationship',
    target: 'User',
    relationship: 'FOLLOWS',
    direction: 'out',
    properties: {
      user: 'string',
    },
    cascade: 'detach',
  },
};
