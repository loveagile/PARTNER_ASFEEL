# Before-dev

You need to run this command to set the environment variable

Linux, MacOS or Unix shell
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/serviceAccountDev.json"
```
For more: [Initialize the SDK in non-Google environments](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)
## Deployment

You must have two files serviceAccountDev.json and serviceAccountProd.json, same level with deploy.sh and deploy-prod.sh

- For dev environment:
```bash
sh ./deploy.sh
```

- For prod environment:
```bash
sh ./deploy-prod.sh
```






## Seed Data

To run seed data (generate master data)
Generate script is written in seed/index.ts

```bash
npm run seed
```

To seed data of organizations/school, enable seedOrganizations function in seed/index.ts

After generating master data of address and clubTypeCategories on firestore, enable sync function