module.exports = {
	apps: {
		env: {
			"NODE_ENV": "development"
		},
		env_production: {
			"NODE_ENV": "production"
		},
		instances: 1,
		name: "discordo bot",
    script: `dist/index.js`,
    watch: ["dist"]
	}
}