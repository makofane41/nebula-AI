provider "aws" {
  region = "af-south-1" # Change this to your desired AWS region
}

terraform {
  backend "s3" {
    bucket         = "disraptor-dev-terraform-state"
    key            = "development/nebula/security_group/terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "terraform-dev-locks"
  }
}

locals {
  vpc_id      = "disraptor-dev-vpc"
  cidr_blocks = ["0.0.0.0/0"]
  protocol    = "tcp"
}

resource "aws_security_group" "nebula_security_group" {
  name        = "nebula-security-group"
  description = "Allow TLS inbound traffic"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  egress {
    from_port   = 5001
    to_port     = 5001
    protocol    = local.protocol
    cidr_blocks = local.cidr_blocks
  }

  vpc_id = "vpc-0da5531cdf58244fe"

  tags = {
    Name          = "nebula-security-group"
    "Project"     = "Nebula"
    "Owner"       = "Disraptor"
    "Application" = "Security Group"
    "Automation"  = "Terraform"
  }


}


