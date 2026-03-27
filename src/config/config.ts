// config.ts

export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES,
  },

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
});
