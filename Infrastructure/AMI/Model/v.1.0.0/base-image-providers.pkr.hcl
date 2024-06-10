packer {
  required_plugins {
    # https://github.com/hashicorp/packer-plugin-amazon
    amazon = {
      version = ">= 1.0.1"
      source  = "github.com/hashicorp/amazon"
    }

    # https://github.com/hashicorp/packer-plugin-ansible
    ansible = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/ansible"
    }
  }
}