variable "region" {
  description = "The default AWS region."
  type        = string
  default     = "af-south-1"
}

variable "default_tags" {
  description = "Set of tags to apply to all resources"
  type        = map(string)
  default = {
    "Project"     = "Nebula"
    "Owner"       = "Disraptor"
    "Application" = "Security Group"
    "Automation"  = "Terraform"
  }
}

variable "application_tags" {
  description = "Set of tags to apply to new EC2 instances"
  type        = map(string)
  default = {
    Name          = "nebula-server"
    "Project"     = "Nebula"
    "Owner"       = "Disraptor"
    "Application" = "Security Group"
    "Automation"  = "Terraform"
  }
}

variable "security_group" {
  description = "The VPC security group IDs to associate with the EC2 instance."
  type        = set(string)
  default     = ["sg-0754af1a345276dd7"]
}

variable "ami_owners" {
  description = "The AWS account IDs that own the AMI."
  type        = list(string)
  default     = ["143671530412"]
}

variable "ami_filters" {
  description = "The filters to apply when searching for AMIs."
  type        = map(list(string))
  default = {
    name                = ["model-linux-app-base-image--20240207100211"]
    virtualization-type = ["hvm"]
  }
}