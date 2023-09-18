<a name="Top"></a>
# Pasteleria Lety #

### Table of contents ###

1. [Pasteleria Lety](#pasteleria-lety)  

    1.1 [The latest version](#the-latest-version)  

    1.2 [Getting Started](#getting-started)  

2. [NPM scripts](#npm-scripts)
    
    2.1 [Compiling your application](#compiling-your-application)
    
This project contains differents cartridges that we use for his functionality. 
Pasteleria Lety has a base cartridge (`app_storefront_base`) provided by Commerce Cloud that is never directly customized or edited.

Instead, we can create a new cartridge for customization and we can put it on top of the base cartridge following the next estructure only to custom cartridges [app_custom_proyectname]() for example `app_custom_lety`. 
This change is intended to allow for easier adoption of new features and bug fixes.

### The latest version ###

The latest version of Pasteleria Lety is `1.9.0`

### Getting Started ###

1. Clone this [repository](https://github.com/PuntoCommerce/CielitoLindo).

2. Once that you´re located in the project folder need run `npm install` to install all of the local dependencies in the `package.json`

3. Run `npm run compile:js` from the command line that would compile all client-side JS files. Run `npm run compile:scss` and `npm run compile:fonts` that would do the same for css and fonts.
You can also run `npm run build` and it will automatically execute the last commands we mentioned.

4. Create `dw.json` file in the root of the project. Providing a [WebDAV access key from BM](https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2Fcontent%2Fb2c_commerce%2Ftopics%2Fadmin%2Fb2c_access_keys_for_business_manager.html) 
in the `password` field is optional, as you will be prompted if it is not provided.
```json
{
    "hostname": "your-sandbox-hostname.demandware.net",
    "username": "AM username like me.myself@company.com",
    "password": "your_webdav_access_key",
    "code-version": "version_to_upload_to"
}
```

5. You need a [propheat](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet) extention on your visual studio code to 
upload cartridges to the sandbox you specified in `dw.json` file.

6. Add the `app_storefront_base` cartridge and your custom cartridge to your cartridge path in _Administration >  Sites >  Manage Sites > RefArch - Settings_.

7. You should now be ready to navigate to and use your site.

# NPM scripts #
Use the provided NPM scripts to compile and upload changes to your Sandbox.

### Compiling your application ###

Compiles all .scss files into CSS.
~~~bash
npm run compile:scss
~~~

Compiles all .js files and aggregates them.
~~~bash
npm run compile:js
~~~

Copies all needed font files. Usually, this only has to be run once.
~~~bash
npm run compile:fonts
~~~

Compiles all .scss, .js and fonts.
~~~bash
npm run build
~~~

If you are having an issue compiling scss files, try running 'npm rebuild node-sass' from within your local repo.
## Connector Documentation ##

1. [Endpoints](docs/endpoints.md)

    1.1 [Function Soap](docs/endpoints.md#function-soap)
    
    1.2 [Service](docs/endpoints.md#service)

    1.3 [XML Soap](docs/endpoints.md#xml-soap)

2. [Date Time Picker](docs/date_time_picker.md)

    2.1 [Date Time JS](docs/date_time_picker.md#date-time-js)

    2.2 [All SM](docs/date_time_picker.md#all-sm)
    
    2.2 [Data Picker](docs/date_time_picker.md#data-picker)

    2.3 [Controllers](docs/date_time_picker.md#controllers)

[Back to the top](#Top)