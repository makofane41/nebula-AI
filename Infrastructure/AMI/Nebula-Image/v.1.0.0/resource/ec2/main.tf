/*
 * # Setup EC2 Instance
 *
 * A Terraform module to create an EC2 Instance (some assumptions are made that are specific to Linux based OS.
 *
 * Pre-requisites include
 * - Custodian (for auto stop/start of instance)
 *
 *
 * Documentation generated using `terraform-docs markdown table --sort-by-required . > README.md`
 *
 */

provider "aws" {
  region = "af-south-1" # Change this to your desired AWS region
}

terraform {
  backend "s3" {
    bucket         = "disraptor-dev-terraform-state"
    key            = "development/nebula/ec2/terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "terraform-dev-locks"
  }
}

locals {
  instance_name = "nebula-server"
}

data "aws_ami" "found_ami" {
  most_recent = true
  owners      = var.ami_owners

  dynamic "filter" {
    for_each = {
      for key, value in var.ami_filters :
      key => value
    }

    content {
      name   = filter.key
      values = filter.value
    }
  }
}

data "aws_subnets" "selected_subnet" {
  filter {
    name   = "vpc-id"
    values = ["vpc-0da5531cdf58244fe"]
  }
}

resource "aws_eip" "ec2_eip" {
  instance = aws_instance.ec2_instance.id
  domain   = "vpc"
}

resource "aws_instance" "ec2_instance" {
  ami                    = data.aws_ami.found_ami.id
  vpc_security_group_ids = var.security_group
  instance_type          = "t3.micro"
  key_name               = "NebulaKeyPair"
  iam_instance_profile   = "nebula-ec2-profile"
  subnet_id              = data.aws_subnets.selected_subnet.ids[0]

  root_block_device {
    encrypted   = true
    volume_size = 8
    volume_type = "gp3"
  }

  ebs_optimized = true

  tags = merge(
    var.application_tags,
    {
      Name = local.instance_name
    }
  )
  volume_tags = merge(
    var.application_tags,
    {
      Name = local.instance_name
    }
  )
}

