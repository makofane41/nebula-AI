#!/bin/bash

cd /home/ec2-user/Nebula-Backend/
git pull
pm2 reload 0
