module.exports = {
  apps: [
    {
      name: "dhweb",
      script: "./server/server.js", // Path to server entry point
      env: {
        NODE_ENV: "production",
        PORT: 3004,
        // DATABASE_URL: "mysql://USER:PASSWORD@HOST:PORT/DATABASE" <-- User needs to set this on server
      },
      watch: false,
      instances: 1,
      exec_mode: "fork"
    }
  ]
};
