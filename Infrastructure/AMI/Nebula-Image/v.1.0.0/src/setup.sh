#!/bin/bash

# Install Terraform
echo "Installing Terraform..."
curl -LO https://releases.hashicorp.com/terraform/1.6.5/terraform_1.6.5_linux_amd64.zip
unzip terraform_1.6.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
sudo rm terraform_1.6.5_linux_amd64.zip

# Put Terraform on PATH
echo "Putting Terraform on PATH..."
echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
source ~/.bashrc

# Set date and time to Africa/Johannesburg
echo "Setting date and time to Africa/Johannesburg..."
sudo timedatectl set-timezone Africa/Johannesburg

# Install Git
echo "Installing Git..."
sudo yum update
sudo yum install git -y

# Install GNU Privacy Guard
sudo yum install gnupg


# Install Node.js
echo "Installing Node.js..."
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

# Install AWS SDK
echo "Installing AWS SDK..."
sudo npm install -g aws-sdk

# Install pm2-runtime
echo "Installing pm2-runtime..."
sudo npm install -g pm2

echo "Installation complete."

# Create nebula-dev user
echo "Creating nebula-dev user..."
sudo useradd -m -s /bin/bash nebula-dev
sudo groupadd Nebula
sudo usermod -aG Nebula nebula-dev

# Create working directory for Node.js app
echo "Creating working directory for Node.js app..."
sudo mkdir -p /home/nebula-dev/Nebula
sudo chown -R nebula-dev:Nebula /home/nebula-dev/Nebula

# Install Node.js app dependencies
echo "Installing Node.js app dependencies..."
cd /home/nebula-dev/Nebula
npm install



