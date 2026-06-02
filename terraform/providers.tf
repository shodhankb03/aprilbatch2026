provider "aws" {
    region = "ap-southeast-2"
}

terraform {
  backend "s3" {
    bucket = "shoshankb03"
    key    = "devjune2026.tfstate"
    region = "ap-southeast-2"
  }
}

