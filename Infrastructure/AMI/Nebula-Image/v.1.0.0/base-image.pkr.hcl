locals {
  project_name = "nebula-linux-app-base-image"
  app_tags = {
    "automation"          = "packer"
    "environment"         = var.environment
    "project-name"        = "Nebula"
    "owner"               = "Disraptor"
    "application-service" = "ec2"

  }
  ami_tags = merge(
    local.app_tags,
    {
      Name = local.project_name
    }
  )
  packer_build_tags = merge(
    local.app_tags,
    {
      Name = "Packer Builder"
    }
  )
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "amazonlinux_app_base_image" {
  ami_name             = "${local.project_name}--${local.timestamp}"
  ami_description      = "AMI base image for Nebula for backend logic for handling provisioning"
  ami_users            = var.ami_users
  region               = var.region
  iam_instance_profile = "nebula-ec2-profile"

  source_ami_filter {
    owners = ["amazon"]
    filters = {
      name                = "amzn2-ami-kernel-5.10-hvm-2.0.*.*-x86_64-gp2" // amzn2-ami-hvm-2.0.2022*-x86_64-gp2 | amzn2-ami-hvm-2.0.20221210.1-x86_64-gp2
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    
    most_recent = true
  }
  spot_instance_types = ["t3.micro"]
  spot_price          = "auto"
  spot_tags           = local.packer_build_tags
  fleet_tags          = local.packer_build_tags # https://github.com/hashicorp/packer-plugin-amazon/issues/92 fixed by https://github.com/hashicorp/packer-plugin-amazon/pull/142 but still to be released
  tags                = local.ami_tags
  snapshot_tags       = local.ami_tags
  run_tags            = local.packer_build_tags
  run_volume_tags     = local.packer_build_tags
  ssh_username        = "ec2-user"
  ssh_interface       = "session_manager"
  communicator        = "ssh"
  ssh_remote_tunnels  = ["8080:localhost:80"]
  encrypt_boot        = false
  ebs_optimized       = true
  
  vpc_filter {
    filters = {
      "tag:Name" : "disraptor-dev-vpc"
    } 
  }
  subnet_filter {
    filters = {
      "tag:Name" : "disraptor-dev-vpc*"
    }
    most_free = true
    random    = true
  }
  security_group_filter {
    filters = {
      "tag:Name" : "nebula-security-group"
    }
  }

}

build {
  name = "nebula-app-base-ami"
  sources = [
    "source.amazon-ebs.amazonlinux_app_base_image"
  ]

  provisioner "shell" {
    script = "src/setup.sh"
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = "true"
    custom_data = {
      image_name = local.project_name
    }
  }
}