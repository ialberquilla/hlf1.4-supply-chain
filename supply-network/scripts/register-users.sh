#!/bin/bash
node src/enrollAdmin.js producer
node src/enrollAdmin.js manufacturer
node src/enrollAdmin.js deliverer
node src/enrollAdmin.js retailer

node src/registerUser.js producer
node src/registerUser.js manufacturer
node src/registerUser.js deliverer
node src/registerUser.js retailer

echo "***********************************"
echo "       Starting API server         "
echo "***********************************"
npm start