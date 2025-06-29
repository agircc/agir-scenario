.PHONY: sync-scenarios install dev build start lint clean help

# Install dependencies
install:
	@echo "Installing dependencies..."
	@npm install

# Development server
dev:
	@echo "Starting development server..."
	@npm run dev

# Build the project
build:
	@echo "Building project..."
	@npm run build

# Start production server
start:
	@echo "Starting production server..."
	@npm run start

# Run linter
lint:
	@echo "Running linter..."
	@npm run lint

# Clean generated files
clean:
	@echo "Cleaning generated files..."
	@rm -rf .next
	@rm -rf node_modules/.next

# Show help
help:
	@echo "Available commands:"
	@echo "  make install       - Install npm dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build the project"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run linter"
	@echo "  make clean        - Clean generated files"
	@echo "  make help         - Show this help message"

# Default target
all: install sync-scenarios 