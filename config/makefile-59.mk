.PHONY: install test lint build clean dev

install:
	npm ci && cd sdk && npm ci && cd ../frontend && npm ci

test:
	npx vitest run

lint:
	npx eslint --ext .ts,.tsx sdk/src frontend/src

build:
	cd sdk && npm run build && cd ../frontend && npm run build

clean:
	rm -rf node_modules sdk/node_modules frontend/node_modules dist .next

dev:
	cd frontend && npm run dev
