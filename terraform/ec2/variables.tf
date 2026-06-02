variable "ami_id" {
    description = "The AMI ID for the EC2 instance"
    type        = string
}

variable "subnet_id" {
    description = "The subnet ID where the EC2 instance will launch"
    type        = string
}