#!/bin/bash

echo "🚀 Setting up Resync CLI..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Link CLI globally
echo "🔗 Linking CLI globally..."
npm link

if [ $? -ne 0 ]; then
    echo "❌ Failed to link CLI"
    exit 1
fi

echo "✓ CLI linked successfully"
echo ""

echo "✨ Setup complete!"
echo ""
echo "You can now use the 'resync' command from anywhere."
echo ""
echo "Quick start:"
echo "  resync auth login"
echo "  resync goals list"
echo "  resync --help"
echo ""
