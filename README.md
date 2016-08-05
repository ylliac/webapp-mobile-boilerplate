
# Mise en place du Squelette de projet


## FountainJS

Suivre les instructions de :
https://github.com/FountainJS/generator-fountain-webapp


Pour générer l'application et développer :
http://fountainjs.io/doc/usage/#use-npm-scripts



## Ajout de cordova dans le projet

### Prérequis

Installer cordova :
> npm install -g cordova

Créer le dossier `/mobile`.


### Plugin webpack cordova

(Inspiré de : https://github.com/markmarijnissen/webpack-cordova-plugin)

Créer le dossier `/webpack_plugins`.

Y créer un fichier `cordova.js` :

```
var replace = require('replace');
var path = require('path');
var optimist = require('optimist');
var fs = require('fs');
var mkdirp = require('mkdirp');


function WebpackCordovaPlugin(options){
  this.options = options;
}

WebpackCordovaPlugin.prototype.apply  = function(compiler){
    /**
     * Add commandline flags
     */
    var argv = require('optimist')
      .string('cordova')
      .string('platform')
      .string('cordova-config')
      .string('cordova-version')
      .argv;


    /**
     * initialize all values: src, config, platform, version
     */
    var cwd = process.cwd();
    var src = argv['cordova'] || this.options.src || "index.html";
    var config = path.join(cwd,argv['cordova-config'] || this.options.config || "config.xml");
    var platform = argv['platform'] || this.options.platform;
    var version = argv['cordova-version'] || this.options.version;

    /**
     * Modify webpack config (cordova.js is external, load as script)
     */
    compiler.options.external = compiler.options.external? [compiler.options.external]: [];
    compiler.options.external.push(/cordova(\.js)?$/);

    if(!compiler.options.module.loaders) compiler.options.module.loaders = [];
    compiler.options.module.loaders.push({
      test: /cordova(\.js)?$/,
      loader: 'script-loader'
    });

    /**
     * Modify webpack config: set output to www
     */
    if(!compiler.options.output) compiler.options.output = {};
    compiler.options.output.path = path.normalize(path.join(config,'..','www'));

    /**
     * Make directories and config if needed.
     */
    if(!fs.existsSync(config)){ // sorry for the sync funcion! better ideas are welcome.
      fs.writeFileSync(config, fs.readFileSync(path.join(__dirname,'default-cordova-config.xml')));
      mkdirp(path.resolve(cwd,'plugins')); // required cordova dir
      mkdirp(path.resolve(cwd,'www')); // required cordova dir
    }

    /**
     * Replace config.xml <content src=...>
     */
    if(compiler.options.reload){
      var ip = compiler.options.reload === true? 'localhost':compiler.options.reload;
      src = "http://" + ip + ":8080/" + src;
    }
    try {
      replace({
        regex: /<content +src="[^"]+\" *\/>/,
        replacement: "<content src=\""+src+"\"/>",
        paths: [config],
        silent: true
      });
    } catch(err) {
      console.error('ERROR webpack-cordova-plugin: Could not replace content src in: '+config,err.code);
    }
    
    /**
     * Replace config.xml version (if specified)
     */
    if(version) {
      // "true" defaults to package.json version
      if(version === true){
        try {
          var packageJsonPath = path.resolve(cwd, 'package.json');
          version = require(packageJsonPath).version;
        } catch(err){
          console.error('ERROR webpack-cordova-plugin: Could not read version from package.json'+config,err.code);
        }
      }
      try {
        replace({
          regex: /version=\"([0-9]+\.?){1,3}\"/,
          replacement: "version=\""+version+"\"",
          paths: [config],
          silent: true
        });
      } catch(err) {
        console.error('ERROR webpack-cordova-plugin: Could not replace version in: '+config,err.code);
      }
    }


    /**
     * Set correct --content-base for webpack-dev-server
     */
    var iosPath = path.join(cwd,'platforms','ios','www');
    var androidPath = path.join(cwd,'platforms','android','assets','www');

    if(platform === "ios" || (platform === undefined && fs.existsSync(iosPath))){
      if(!compiler.options.devServer) compiler.options.devServer = {};
      compiler.options.devServer.contentBase = iosPath;
    } else if(platform === "android" || (platform === undefined && fs.existsSync(androidPath))){
      if(!compiler.options.devServer) compiler.options.devServer = {};
      compiler.options.devServer.contentBase = androidPath;
    }

};

module.exports = WebpackCordovaPlugin;
```


### Nouvelle configuration Webpack

Créer une copie `conf/webpack-mobile.conf.js` du fichier `conf/webpack.conf.js`.

Compléter `webpack-mobile.conf.js` :

```
	const CordovaPlugin = require('../webpack_plugins/cordova');
```

```
	new CordovaPlugin({
      config: 'mobile/config.xml',  // Location of Cordova' config.xml (will be created if not found)
      src: 'index.html',     // Set entry-point of cordova in config.xml
      platform: 'android',   // Set `webpack-dev-server` to correct `contentBase` to use Cordova plugins.
      version: true,         // Set config.xml' version. (true = use version from package.json)
    })
```


### Nouvelle tâche npm

Dans `gulp_tasks/webpack.js`, ajouter :

```
const webpackMobileConf = require('../conf/webpack-mobile.conf');  
```

et

```
gulp.task('webpack:mobile', done => {
  webpackWrapper(true, webpackMobileConf, done);
});
```


Dans `gulpfile.js`, ajouter :

```
gulp.task('serve:mobile', gulp.series('webpack:mobile', 'watch', 'browsersync'));
```

Dans `package.json`, ajouter :

```
"serve:mobile": "gulp serve:mobile",
```


### Lancer le build

Lancer la commande :
> npm run serve:mobile

Un fichier `config.xml` a été créé dans le dossier `mobile`.


### Ajout des plateformes mobiles

Ajouter la plateforme android :
> cd mobile
> cordova platforms add android

Lancer l'application :
> cd mobile
> cordova run android

TODO Créer des tâches gulp pour lancer les différentes plateformes


## Fonctionnement du rafraichissement des fichiers

La commande `npm run serve` met à jour le répertoire `/www` à partir des sources de l'application.
Le mode watch est activé donc si les sources sont modifiées, le répertoire `/www` est mis à jour.

La commande `cordova run browser` met à jour le dossier `/platforms/browser/www` à partir du répertoire `/www`.
Il n'y a pas de mode watch, il faut donc relancer la commande à chaque mise à jour des sources.




# Pistes d'amélioration

## Installation du plugin Local Development Plugin de Cordova 

Source : https://github.com/nordnet/cordova-hot-code-push/wiki/Quick-start-guide-for-Cordova-project
Source : https://github.com/nordnet/cordova-hot-code-push-local-dev-addon
Source : https://github.com/nordnet/cordova-hot-code-push-cli

Marche pas, j'ai essayé les étapes suivantes :

> cordova plugin add cordova-hot-code-push-plugin
> cordova plugin add cordova-hot-code-push-local-dev-addon
> npm install -g cordova-hot-code-push-cli
> cordova-hcp server
> cordova run android
> modification de index.html dans /www

Il détecte bien qu'il y a eu changement, que l'appli passe d'active en inactive et inversement mais aucune mise à jour n'a l'air de se faire


## BrowserSync sur cordova

Pas creusé quel intérêt cela avait.

> http://blog.nparashuram.com/2015/08/using-browser-sync-with-cordova.html


