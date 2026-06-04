# Docker Assignment 2

This assignment uses GitHub Actions to build an Nginx Docker image and push it
to Docker Hub.

## GitHub configuration

In the GitHub repository, open **Settings > Secrets and variables > Actions**.

Create this repository variable:

- `DOCKERHUB_USERNAME`: your Docker Hub username

Create this repository secret:

- `DOCKERHUB_TOKEN`: a Docker Hub access token with read/write permission

Create the access token from **Docker Hub > Account settings > Personal access
tokens**. Do not use or commit your Docker Hub password.

## Run the workflow

Push changes from this assignment to `main` or `master`, or manually run
**Build and Push Docker Image** from the GitHub Actions page.

The workflow publishes these image tags:

- `<DOCKERHUB_USERNAME>/dockerassignment2:latest`
- `<DOCKERHUB_USERNAME>/dockerassignment2:<git-commit-sha>`

## Run the published image

```bash
docker run --rm -p 8080:80 <DOCKERHUB_USERNAME>/dockerassignment2:latest
```

Open <http://localhost:8080>.
