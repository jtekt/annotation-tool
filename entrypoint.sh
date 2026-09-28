#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/assets/*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ..."

  sed -i 's|VITE_IMAGE_STORAGE_API_URL_PLACEHOLDER|'${VITE_IMAGE_STORAGE_API_URL}'|g' $file
  sed -i 's|VITE_LABELS_PLACEHOLDER|'${VITE_LABELS}'|g' $file
  sed -i 's|VITE_PREVENT_LABELS_EDIT_PLACEHOLDER|'${VITE_PREVENT_LABELS_EDIT}'|g' $file
  sed -i 's|VITE_CATEGORIZER_PLACEHOLDER|'${VITE_CATEGORIZER}'|g' $file
  sed -i 's|VITE_IDENTIFICATION_URL_PLACEHOLDER|'${VITE_IDENTIFICATION_URL}'|g' $file
  sed -i 's|VITE_LOGIN_URL_PLACEHOLDER|'${VITE_LOGIN_URL}'|g' $file

  # OIDC
  sed -i 's|VITE_OIDC_AUTHORITY_PLACEHOLDER|'${VITE_OIDC_AUTHORITY}'|g' $file
  sed -i 's|VITE_OIDC_CLIENT_ID_PLACEHOLDER|'${VITE_OIDC_CLIENT_ID}'|g' $file
  sed -i 's|VITE_OIDC_AUDIENCE_PLACEHOLDER|'${VITE_OIDC_AUDIENCE}'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'
