.DEFAULT_GOAL := help

.PHONY: run-app
run-app: ## Run app with docker
	docker-compose up

.PHONY: re-build
re-build: ## Rebuild app and run app
	docker-compose up --build

.PHONY: stop-app
stop-app: ## Stop app
	docker-compose down

.PHONY: create-db
create-db: ## Create db in docker postgres
	docker-compose run web rake db:create

.PHONY: migrate-db
migrate-db: ## Migrate db in docker postgres
	docker-compose run web rake db:migrate

.PHONY: rollback-db
rollback-db: ## Rollback db in docker postgres
	docker-compose run web rake db:rollback

.PHONY: rails-console
rails-console: ## Rails console
	docker-compose exec web rails console

.PHONY: run-rubocop
run-rubocop: ## Run rubocop linter
	docker-compose exec web bundle exec rubocop

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
