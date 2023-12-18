# Vega Project Gemini UI

ROADMAP

1. Rewrite Admin UI to create follow best practices and pull out shared components, etc. into nx architecture
2. Create Customer UI portal following the best practices established with the refactor of Admin UI.


## To begin after cloning the repo

`npm install` to install all dependencies

# To run a react app
### Either
1. This might require specific plugins to be installed
2. Run
   traverse to the particular app's `project.json` (`apps/*project*/project.json)
3. Locate the `"serve"` command `"targets"`
   1. Click on the arrow to the left of that serve command
### Or
1. Open a terminal and run the command `nx serve 'projectName'` or `nx run 'projectName':serve`
  1. Serve will generally have the development configuration set as default
  2. You can specify the configuration by adding the extension `nx run 'projectName':serve:'configuration'`

## To create a new react application, run
npmx nx g @nrwl/react:app 'nameofapp'

After running this tool, there is some additional steps that need to be done to develop react applications

1. Add Custom Webpack location and include Shared Assets to your application

### To add the custom webpack location
a. Edit apps/appname/project.json
b. Change this:
"webpackConfig": "@nrwl/react/plugins/webpack"
to this:
"webpackConfig": "custom-webpack.config.js"

### To include Vega shared assets to your new application
a. Edit apps/appname/project.json
b. Change this:
"assets": ["apps/ui/src/favicon.ico", "apps/ui/src/assets"],

to this:
```json
        "assets": ["apps/adminui/src/favicon.ico", "apps/adminui/src/assets",
        {
          "input": "libs/sharedassets/keycloak",
          "glob": "**/*",
          "output": "keycloak"
        },
        {
          "input": "libs/sharedassets/images",
          "glob": "**/*",
          "output": "images"
        },
        {
          "input": "libs/sharedassets/fonts",
          "glob": "**/*",
          "output": "fonts"
        }
      ],
```


# To add a new shared component to our global workspace
1. Run 
npx nx g @nrwl/react:component <componentname> --project=sharedcomponents

This will create a new react component in the libs/sharedcomponents/src/lib folder called <componentname>

You can also have child-components by doing
npx nx g @nrwl/react:component <childcomponentname> --project=sharedcomponents-<componentname>

This will create a new react component in the libs/sharedcomponents/src/lib/<componentname>/src/lib/<childcomponent>

# To build the image of an app with a bash script
#### The images will also be built/deployed once the GitHub Actions are fully implemented
1. Run `sh 'project'_'configuration'.sh '"imageTag"'`
   1. Example: `sh buildadminui_dev.sh "test"`
   2. To build an image that will reside in AWS you will need to tag the images as follows `"$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"`
   3. To build the image on a Mac but run it on AWS use the mac scripts
   4. To build the image on a Mac and also run it on the Mac use the normal scripts
2. To forgo running the script you can just first build the project with `nx run 'project':build:'configuration'`
   1. Where configuration might be development or production
3. Then run the build command `docker build -t 'imageTag' -f 'dockerFileName' .`

### After (To login into ecr and push the image)
1. `aws --profile 'profile'  ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 'accountId'.dkr.ecr.us-west-2.amazonaws.com`
   1. If you are using default credentials you can exclude the --profile flag
2. `docker push 'imageTag''`
