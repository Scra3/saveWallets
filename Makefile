.DEFAULT_GOAL := help

.PHONY: run-app
run-app: ## Run app with docker
	docker-compose up -d

.PHONY: re-build
re-build: ## Rebuild app and run app
	docker-compose up --build

.PHONY: stop-app
stop-app: ## Stop app
	docker-compose down

.PHONY: create-db
create-db: ## Create db in docker postgres
	docker-compose run web rake db:create

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'