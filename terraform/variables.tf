variable "bucket_name" {
    description = "The name of the S3 bucket"
    type        = string
    default     = "shodhankb2000"
}

variable "region" {
    description = "The region where the S3 bucket will be created"
    type        = string
    default     = "ap-southeast-2"
}

variable "environment" {
    description = "The environment for the S3 bucket"
    type        = string
    default     = "dev"
}

variable "cidr_block" {
    description = "The CIDR block for the VPC"
    type        = string
}    

variable "subnet_cidr_block" {
    description = "The CIDR block for the subnet"
    type        = string
}

