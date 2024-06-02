# Check if variables.sh exists
if [ -f ./scripts/variables.sh ]; then
    # Source the variables from the file
    source ./scripts/variables.sh
fi

./scripts/download-key-local.sh

# Run npm install
echo "Running npm install..."
npm install