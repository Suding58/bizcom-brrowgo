module.exports = {
  apps: [
    {
      name: "bizcom-borrowgo",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 80",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
