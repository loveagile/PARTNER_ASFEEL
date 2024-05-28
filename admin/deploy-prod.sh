# Description: Deploy prod to Google Cloud Run
# Get the current service account path
SERVICE_ACCOUNT_PATH="$(pwd)/serviceAccountProd.json"

# Check if the service account file exists, if exist echo the path, else throw error
if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
  echo "Service account file does not exist: $SERVICE_ACCOUNT_PATH"
  exit 1
fi

# export GOOGLE_APPLICATION_CREDENTIALS=$SERVICE_ACCOUNT_PATH
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_PATH"

echo "GOOGLE_APPLICATION_CREDENTIALS: $GOOGLE_APPLICATION_CREDENTIALS"

gcloud config set project www-asfeel-prod

gcloud builds submit --region=global --config cloudbuild/prod.yaml

gcloud config set project www-asfeel