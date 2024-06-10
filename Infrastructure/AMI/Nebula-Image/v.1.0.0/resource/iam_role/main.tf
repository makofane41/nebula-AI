# purpose: Create an IAM role and policy for the Nebula-Image

provider "aws" {
  region = "af-south-1" # Change this to your desired AWS region
}

terraform {
  backend "s3" {
    bucket         = "disraptor-dev-terraform-state"
    key            = "development/nebula/iam_role/terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "terraform-dev-locks"
  }
}

resource "aws_iam_role" "nebula_role" {
  name = "nebula-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    "Project"     = "Nebula"
    "Owner"       = "Disraptor"
    "Application" = "IAM Role"
    "Automation"  = "Terraform"
  }
}

resource "aws_iam_role_policy_attachment" "nebula_role_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
  role       = aws_iam_role.nebula_role.name
}

resource "aws_iam_policy" "nebula_policy" {
  name        = "nebula-ec2-policy"
  description = "Policy for EC2, Session Manager, Lambda, API Gateway, Kinesis, S3, Glue, CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["lambda:*", "cloudwatch:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["apigateway:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["kinesis:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["s3:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["glue:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["logs:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["ssm:StartSession", "ssm:TerminateSession", "ssm:ResumeSession", "ssm:DescribeSessions"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["ec2:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["codecommit:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["sqs:*"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["dynamodb:*"],
        Resource = "*"
      }
    ]
  })
  tags = {
    "Project"     = "Nebula"
    "Owner"       = "Disraptor"
    "Application" = "IAM Policy"
    "Automation"  = "Terraform"
  }
}

resource "aws_iam_role_policy_attachment" "nebula_policy_attachment" {
  policy_arn = aws_iam_policy.nebula_policy.arn
  role       = aws_iam_role.nebula_role.name
}


resource "aws_iam_instance_profile" "ec2_profile" {
  name = "nebula-ec2-profile"
  role = aws_iam_role.nebula_role.name

}