# Annotation tool

A GUI to annotate a dataset for ML training.

## Environment variables

| Variable | Description |
| --- | --- |
| VUE_APP_STORAGE_SERVICVE_API_URL | The URL of the storage service |
| VUE_APP_LABELS | (OTIONAL) comma separated list of labels. Default is OK and NG |
| VUE_APP_HOMEPAGE_URL | (OPTIONAL) URL of the application homepage |

## Deployment

### Docker

```
docker run -e VUE_APP_STORAGE_SERVICVE_API_URL=http://storage-ms-url 172.16.98.151:5000/annotation-tool
```
