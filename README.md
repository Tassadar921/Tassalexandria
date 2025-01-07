# Tassalexandria

### Front : Svelte 4, TailwindCSS, Capacitor

### Back : Adonisjs 6.14.1

### Database : PostgreSQL

### ORM : Lucid

Tassalexandria is an opensource project to self-host a private file-upload service (to share with your friends) with a built-in mobile build.

You only have to deploy both frontend & backend, fill `.env` files on both sides, run backend migrations (`node ace migration:run`) and backend seeders (`node ace db:seed`).

This service allows users to upload their sharing files, associating them to built-in or custom tags and to find all uploaded files (all files are public for a given deployment, for all its users).

Note that files can also be edited by all other users, but can never be deleted (even by their owner).

https://tassalexandria.fr (incoming)

### Links

- [Production](https://tassalexandria.fr)
- [MIT Licence](/doc/LICENCE.md)
