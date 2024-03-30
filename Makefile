include .env

.PHONY: up

up:
	docker-compose up -d && npm run dev

.PHONY: down

down:
	docker-compose down

.PHONY: logs

logs:
	docker-compose logs -f