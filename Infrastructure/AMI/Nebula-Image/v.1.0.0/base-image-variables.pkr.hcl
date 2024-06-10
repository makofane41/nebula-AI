variable "region" {
  description = "Target region for this AMI"
  type        = string
  default     = "af-south-1"
}

variable "environment" {
  description = "Target environment for this AMI"
  type        = string
  default     = "dev"
}

variable "ami_users" {
  description = "List of AWS account IDs that can use this AMI"
  type        = list(string)
  default     = ["143671530412"]
}

variable "iam_instance_profile" {
  description = "IAM instance profile to attach to the AMI"
  type        = string
  default     = null
}

variable "vpc_filter" {
  description = "Filter to use when searching for VPCs"
  type        = map(string)
  default     = null
}

variable "subnet_filter" {
  description = "Filter to use when searching for subnets"
  type        = map(string)
  default     = null
}