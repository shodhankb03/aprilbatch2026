# Kubernetes Three-Tier Assignment

This assignment deploys a frontend, backend, and PostgreSQL database into the
`shodhan` Kubernetes namespace.

## Architecture

```text
Internet
  -> frontend-service (LoadBalancer)
  -> frontend pods (Nginx)
  -> backend-service (ClusterIP)
  -> backend pods (Node.js)
  -> database-service (ClusterIP)
  -> database pod (PostgreSQL + 1Gi pod-local volume)
```

The manifest sets CPU and memory requests and limits for every pod. The
database uses an `emptyDir` volume with a 1Gi size limit because the training
EKS cluster does not have an EBS CSI storage provisioner installed. Its data is
removed if the database pod is replaced.

## Build and push images

Sign in to Docker Hub:

```powershell
docker login
```

From the repository root, build and push both application images:

```powershell
docker build -t shodhankb03/kubernetes-backend:latest ./Kubernetesassignment1/backend
docker push shodhankb03/kubernetes-backend:latest

docker build -t shodhankb03/kubernetes-frontend:latest ./Kubernetesassignment1/frontend
docker push shodhankb03/kubernetes-frontend:latest
```

PostgreSQL uses the public `postgres:16-alpine` image, so it does not need a
custom build.

## Deploy

Confirm that `kubectl` points to the correct EKS cluster:

```powershell
kubectl config current-context
kubectl get nodes
```

Apply the complete manifest:

```powershell
kubectl apply -f Kubernetesassignment1/manifest.yml
```

Check all assignment resources:

```powershell
kubectl get all -n shodhan
kubectl get pods -n shodhan
```

Wait for the public frontend address:

```powershell
kubectl get service frontend-service -n shodhan --watch
```

Press `Ctrl+C` after an external hostname appears, then open it using `http://`.

## Verify pod sizes

```powershell
kubectl describe pods -n shodhan
```

Look for the `Requests` and `Limits` sections under each container.

## Troubleshooting

```powershell
kubectl logs -n shodhan -l app=frontend
kubectl logs -n shodhan -l app=backend
kubectl logs -n shodhan -l app=database
kubectl describe pod -n shodhan <pod-name>
```

## Delete assignment resources

```powershell
kubectl delete -f Kubernetesassignment1/manifest.yml
```
