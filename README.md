# README #

## Déploiement

Il y a 2 environnements sur CleverCloud :
* La recette - recette à destination des clients Startbuilding
  * URL : http://startbuilding-rec.app-joza-it.fr
* La dev - recette à destination interne de Joza IT
  * URL : http://startbuilding-dev.app-joza-it.fr

### Recette

La première fois :
```
git remote add clever-rec git+ssh://git@push-n2-par-clevercloud-customers.services.clever-cloud.com/app_03e34c08-fcdc-443a-a9c6-3ce194910493.git
git push clever-rec master
```

Les fois suivantes il suffira de faire seulement :

```
git push clever-rec master
```

### Dev

La première fois :
```
git remote add clever-dev git+ssh://git@push-n2-par-clevercloud-customers.services.clever-cloud.com/app_00cf6414-cdef-4a30-bfde-c2deaabd6d6b.git
git push clever-dev master
```

Les fois suivantes il suffira de faire seulement :

```
git push clever-dev master
```

### 

## Base de données
### Creation de la base de données
```
CREATE USER startbuilding WITH PASSWORD 'startbuilding';
CREATE DATABASE startbuilding;
GRANT CREATE ON DATABASE startbuilding TO startbuilding;
ALTER USER startbuilding WITH SUPERUSER;
\connect startbuilding;
create schema startbuilding authorization startbuilding;
GRANT ALL PRIVILEGES ON DATABASE startbuilding to startbuilding;
```

### Codes ROME

Les codes ROME sont semés dans la base de données au démarrage, la compétence par défaut sélectionnée est CONSTRUCTION f, (rome.bootstrap-domains: f) vous pouvez semer l'arbre entier en supprimant rome.bootstrap-domains dans application.yml

------------------------------------------------------------------------------------------------------------------

### Creation de la base de test postgres

```
CREATE DATABASE startbuildingtest;
GRANT CREATE ON DATABASE startbuildingtest TO mdf;
\connect mdftest;
create schema startbuildingtest authorization mdf;
```
