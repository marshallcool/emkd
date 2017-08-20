# EmkdFront

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.17.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Настройка нового сервера для сборки фронта: ##
Пакеты 


```
#!bash

yum install -y gcc-c++ make epel-release mc vsftpd tcpdump
```


1. Устанавливаем git

```
#!bash


yum install git
```


2. Устанавливаем ноду


```
#!bash

curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
yum install -y nodejs
```


3. Пакеты для ноды

```
#!bash


npm install -g angular-cli typescript typings
npm install process-nextick-args -S
npm install -g --save process-nextick-args
```


4. Ставим апач (по желанию с nginx)


```
#!bash

yum install -y httpd nginx
```


5. Генерируем ключ ssh для апача 

```
#!bash

chown apache:apache /var/www
sudo -u apache ssh-keygen
```

6. Ключ /var/www/.ssh/id_rsa.pub добавляем в репозиторийtбб

7. Создаём в рабочей папке скрипт синхронизации

migrate.sh
```
#!bash

chown -R apache:apache /var/www/virt/angular.emkd.ru/
cd /var/www/virt/angular.emkd.ru/
sudo -u apache git pull -u git@bitbucket.org:Lexxost/emkd-angular.git
#npm install
npm i -g typings
ng build
cp /var/www/virt/angular.emkd.ru/migrate.php /var/www/virt/angular.emkd.ru/dist/migrate.php
```

а также скрипт запускающийся по вебхуку, дергающий предыдущий

migrate.php
```
#!php

<?php
exec ("/var/www/virt/angular.emkd.ru/migrate.sh");
?>
```

9. Создаём в рабочей папке файл .htaccess

```
#!bash

<IfModule mod_rewrite.c>
  Options Indexes FollowSymLinks
 	RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
Меняем  AllowOverride в файле /etc/httpd/conf/httpd.conf с None на All

Устанавливаем на сервер новый gcc и g++, иначе нода не компилит


```
#!bash

yum install centos-release-scl
yum install devtoolset-4-gcc*
scl enable devtoolset-4 bash
```


## Adaptive with values
1360px
1200px
980px
840px
760px
600px
460px

