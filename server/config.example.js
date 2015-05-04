module.exports = {
  "db": {
    "databaseUrl": "postgres://username:@localhost:5432/unearth"
  },
  'facebookAuth' : {
    'clientId'      : 'your-secret-clientID-here', // your App ID
    'clientSecret'  : 'your-client-secret-here', // your App Secret
    'callbackUrl'   : 'http://localhost:8080/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'       : 'your-consumer-key-here',
    'consumerSecret'    : 'your-client-secret-here',
    'callbackUrl'       : 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientId'      : 'your-secret-clientID-here',
    'clientSecret'  : 'your-client-secret-here',
    'callbackUrl'   : 'http://localhost:8080/auth/google/callback'
  }
};
