#!/bin/bash

echo "Installing Firefox..."
sudo apt-get update
export DEBIAN_FRONTEND=noninteractive
sudo apt-get install -y firefox-esr

echo "Installing dependencies using yarn"
yarn install
