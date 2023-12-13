variable "subscription_id" {
  description = "The Azure subscription ID."
  type        = string
}
variable "tenant_id" {
  description = "The Azure tenant ID."
  type        = string
}
variable "client_id" {
  description = "The Azure client ID."
  type        = string
}

variable "client_secret" {
  description = "The Azure client secret."
  type        = string
}

variable "secret_key" {
    description = "The secret key used to sign the JWT token."
    type        = string
}

variable "algorithm" {
    description = "The algorithm used to sign the JWT token."
    type        = string
}

variable "access_token_expire_minutes" {
    description = "The number of minutes the access token is valid for."
    type        = number
}