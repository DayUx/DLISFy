provider "azurerm" {
  features {}
  subscription_id            = var.subscription_id
  tenant_id                  = var.tenant_id
  client_id                  = var.client_id
  client_secret              = var.client_secret
  skip_provider_registration = true
}

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "puntifyeurope" {
  name     = "puntifyeurope"
  location = "westeurope"
}

resource "azurerm_resource_group" "puntifyus" {
  name     = "puntifyus"
  location = "eastus"
}

resource "azurerm_app_service_plan" "puntifyeurope" {
  name                = "puntifyeurope-asp"
  resource_group_name = azurerm_resource_group.puntifyeurope.name
  location            = azurerm_resource_group.puntifyeurope.location
  kind                = "Linux"
  reserved            = true
  sku {
    tier = "Basic"
    size = "B1"
  }
}
locals {
  env_variables_europe = {
    DOCKER_REGISTRY_SERVER_URL      = "acrpuntify.azurecr.io"
    DOCKER_REGISTRY_SERVER_USERNAME = "acrpuntify"
    DOCKER_REGISTRY_SERVER_PASSWORD = "ayc0c2LrKJvA3Lfw8oEjGVWzSKxcpyfYh+Zmx84Wn5+ACRBgaxAW"
    MONGO_URL                       = azurerm_cosmosdb_account.puntifyeuropemongoaccount.connection_strings[0]
    SECRET_KEY                      = var.secret_key
    ALGORITHM                       = var.algorithm
    ACCESS_TOKEN_EXPIRE_MINUTES     = var.access_token_expire_minutes
  }
}


resource "azurerm_cosmosdb_account" "puntifyeuropemongoaccount" {
  name                = "puntify-europe-mongo"
  resource_group_name = azurerm_resource_group.puntifyeurope.name
  location            = azurerm_resource_group.puntifyeurope.location
  offer_type          = "Standard"
  kind                = "MongoDB"

  enable_automatic_failover = true

  capabilities {
    name = "EnableAggregationPipeline"
  }

  capabilities {
    name = "mongoEnableDocLevelTTL"
  }

  capabilities {
    name = "MongoDBv3.4"
  }

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }
  geo_location {
    failover_priority = 0
    location          = azurerm_resource_group.puntifyeurope.location
  }
}

resource "azurerm_cosmosdb_mongo_database" "puntifyeuropemongodb" {
  name                = "puntify-europe-mongo-db"
  resource_group_name = azurerm_cosmosdb_account.puntifyeuropemongoaccount.resource_group_name
  account_name        = azurerm_cosmosdb_account.puntifyeuropemongoaccount.name
  throughput          = 3000
}


resource "azurerm_app_service" "puntifybackeurope" {
  name                    = "puntify-back-europe"
  location                = azurerm_resource_group.puntifyeurope.location
  resource_group_name     = azurerm_resource_group.puntifyeurope.name
  app_service_plan_id     = azurerm_app_service_plan.puntifyeurope.id
  https_only              = true
  client_affinity_enabled = true
  site_config {
    scm_type          = "VSTSRM"
    always_on         = true
    health_check_path = "/health"
    # health check required in order that internal app service plan loadbalancer do not loadbalance on instance down
    linux_fx_version  = "DOCKER|acrpuntify.azurecr.io/puntify-api:latest"
  }

  logs {
    http_logs {
      file_system {
        retention_in_days = 30
        retention_in_mb   = 30
      }
    }
  }

  app_settings = local.env_variables_europe
}


resource "azurerm_log_analytics_workspace" "puntifyeuropeloganalytics" {
  name                = "puntify-europe-log-analytics"
  location            = azurerm_resource_group.puntifyeurope.location
  resource_group_name = azurerm_resource_group.puntifyeurope.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "puntifyeuropeappenvironment" {
  name                       = "puntify-europe-app-environment"
  location                   = azurerm_resource_group.puntifyeurope.location
  resource_group_name        = azurerm_resource_group.puntifyeurope.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.puntifyeuropeloganalytics.id
}

resource "azurerm_container_app" "puntifybackeurope" {
  name                         = "puntify-back-europe"
  container_app_environment_id = azurerm_container_app_environment.puntifyeuropeappenvironment.id
  resource_group_name          = azurerm_resource_group.puntifyeurope.name
  revision_mode                = "Single"
  template {
    container {
      name   = "puntify-back-europe-container"
      image  = "acrpuntify.azurecr.io/puntify-api:latest"
      cpu    = 0.25
      memory = "0.5Gi"
      env {
        name  = "MONGO_URL"
        value = azurerm_cosmosdb_account.puntifyeuropemongoaccount.connection_strings[0]
      }

      env {
        name  = "SECRET_KEY"
        value = local.env_variables_europe.SECRET_KEY
      }

      env {
        name  = "ALGORITHM"
        value = local.env_variables_europe.ALGORITHM
      }
      env {
        name  = "ACCESS_TOKEN_EXPIRE_MINUTES"
        value = local.env_variables_europe.ACCESS_TOKEN_EXPIRE_MINUTES

      }
    }
  }
  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 443
    traffic_weight {
          latest_revision           = true
      percentage = 100
    }
  }
  registry {
    server               = local.env_variables_europe.DOCKER_REGISTRY_SERVER_URL
    username             = local.env_variables_europe.DOCKER_REGISTRY_SERVER_USERNAME
    password_secret_name = "docker-registry-secret"
  }

  secret {
    name  = "docker-registry-secret"
    value = local.env_variables_europe.DOCKER_REGISTRY_SERVER_PASSWORD
  }
}


resource "azurerm_container_app" "puntifyfronteurope" {
  name                         = "puntify-front-europe"
  container_app_environment_id = azurerm_container_app_environment.puntifyeuropeappenvironment.id
  resource_group_name          = azurerm_resource_group.puntifyeurope.name
  revision_mode                = "Single"
  #  latest_revision = true
  template {
    container {
      name   = "puntify-front-europe-container"
      image  = "acrpuntify.azurecr.io/puntify-front:latest"
      cpu    = 0.25
      memory = "0.5Gi"
      env {
        name  = "VITE_API_URL"
        value =  "https://${azurerm_container_app.puntifybackeurope.ingress[0].fqdn}"
      }
    }
  }
  ingress {

    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 80
    traffic_weight {
          latest_revision           = true

      percentage = 100
    }
  }
  registry {
    server               = local.env_variables_europe.DOCKER_REGISTRY_SERVER_URL
    username             = local.env_variables_europe.DOCKER_REGISTRY_SERVER_USERNAME
    password_secret_name = "docker-registry-secret"
  }

  secret {
    name  = "docker-registry-secret"
    value = local.env_variables_europe.DOCKER_REGISTRY_SERVER_PASSWORD
  }
}
output "test" {
  value = "https://${azurerm_container_app.puntifybackeurope.ingress[0].fqdn}"
}




