#!/bin/bash


# Set date and time to Africa/Johannesburg
echo "Setting date and time to Africa/Johannesburg..."
sudo timedatectl set-timezone Africa/Johannesburg


# Install Python 3.11.7
echo "Installing Python 3.11.7..."
wget https://www.python.org/ftp/python/3.11.7/Python-3.11.7.tgz
tar -xvf Python-3.11.7.tgz
cd Python-3.11.7
./configure
make
sudo make install

sudo rm -rf Python-3.11.7.tgz

# Update alternatives to set Python 3.11.7 as the default version
sudo update-alternatives --install /usr/bin/python python /usr/local/bin/python3.11 1
sudo update-alternatives --set python /usr/local/bin/python3.11

echo "Installation complete."


# Install required packages for AI/ML
echo "Installing required packages for AI/ML..."

sudo pip3 install transformers 
sudo pip3 install numpy
sudo pip3 install joblib 
sudo pip3 install flask 
sudo pip3 install flask_cors 
sudo pip3 scikit-learn 
sudo pip3 installpandas

echo "Installation complete."

# Install torch for AI/ML
echo "Installing torch for AI/ML..."
sudo pip3 install torch



echo "Installation complete."


