# New Docs

New document site for the Software Engineering Student Division (IT) with the
goal of replacing [cthit/dokument-site](https://github.com/cthit/dokument-site).

## Planned features

- [ ] Include other documents than the ones from
      [cthit/dokument](https://github.com/cthit/dokument)
- [ ] Divide documents into categories:
    - "Verksamhetsdokument" - Bylaws and regulations
        - "Verksamhetsdokument/Policier" - Policies
    - "Avtal" - Dispositionsavtal
    - "Sektionsmötesprotokoll" - Division meeting minutes
        - "Sektionsmötesprotokoll/Bilagor" - Maybe show attachments as separate
          documents if the data is available
    - "Styrelsemötesprotokoll" - Board meeting minutes
    - "Studienämndsprotokoll" - Student education group meeting minutes
    - "Hedersmedlemmar" - Honorary members (may be removed entirely)
    - "Annat" - Other documents
- [x] Remove template documents (feature through configuration)
- [ ] Searchable documents
    - Search content in the PDFs.
    - Select which category of document you want to search in.
- [x] Document revision history
- [x] Prettier document titles with diacritics.

## Development

After cloning you can install dependencies with the command below. This also copies `.env.example` and
generates the Prisma client.

```console
pnpm install
```

Then you should
[create a Gamma user client](https://gamma-docs.olillin.com/website#creating-a-user-client)
with an API key and without the email scope. Set the redirect URI to
`http://localhost:3000/callback`.

> [!TIP]
> You may also want to add yourself as an administrator. See
> [Administrators](#Administrators) for how administrators are managed.

After this you can run these commands to start the database and development
server.

```console
docker compose up --wait
pnpm prisma migrate dev
pnpm run dev
```

## Production build

Configure the secrets listed in `compose.prod.yaml` and run it using
[Docker Compose](https://docs.docker.com/compose).

## Configuration

### Environment Variables

The server can be configured by providing more
[environment variables](https://en.wikipedia.org/wiki/Environment_variable) in
the `.env` you created earlier. See the list of available settings below.

<a id="file-tip" name="file-tip"></a>

> [!TIP]
> Appending `_FILE` to the name of an environment variable will fetch the
> variable from a text file.
>
> **Example:** If `.env` contains `GAMMA_CLIENT_SECRET_FILE=secrets/gamma-secret.txt`
> then `GAMMA_CLIENT_SECRET` will be set to the content of the file
> `secrets/gamma-secret.txt`. The path is relative to the project root.

#### General

| Name     | Type | Default               | Description                                                                                 |
| -------- | ---- | --------------------- | ------------------------------------------------------------------------------------------- |
| BASE_URL | URI  | http://localhost:3000 | Generated URLs are relative to this URL. Usually this is your domain including the protocol |

#### JWT

| Name           | Type   | Default    | Description                                         |
| -------------- | ------ | ---------- | --------------------------------------------------- |
| JWT_SECRET     | string |            | Used to sign JWTs when users log in                 |
| JWT_ISSUER     | string | cthit-docs | The issuer of the JWT                               |
| JWT_EXPIRES_IN | int    | 14400      | How many seconds the JWT is valid for after signing |

#### Gamma

| Name                 | Type   | Default             | Description                                                                         |
| -------------------- | ------ | ------------------- | ----------------------------------------------------------------------------------- |
| GAMMA_CLIENT_ID      | string |                     | Public identifier of your Gamma client                                              |
| GAMMA_CLIENT_SECRET  | string |                     | Secret key of your Gamma client                                                     |
| GAMMA_API_KEY_ID     | string |                     | Client API key ID. Is the UUID near the start of the generated authorization header |
| GAMMA_API_KEY_SECRET | string |                     | Client API key secret. Shown as "Api key" below the client secret                   |
| GAMMA_REDIRECT_URI   | URI    | <BASE_URL>/callback | Redirect URI of your Gamma client                                                   |

#### Prisma

| Name         | Type   | Default | Description                                        |
| ------------ | ------ | ------- | -------------------------------------------------- |
| DATABASE_URL | string |         | The URL Prisma will use to connect to the databsae |

> [!IMPORTANT]
> When using Docker Compose in production make sure that the password in
> `DATABASE_URL` matches the `POSTGRES_PASSWORD` of the `db` service.

#### Advanced

These variables are used during CI workflows and builds of the Docker image. Only modify these if you know what you are doing.

| Name                    | Type   | Default | Description                                            |
| ----------------------- | ------ | ------- | ------------------------------------------------------ |
| SKIP_ENV_VALIDATION     | 1      |         | Skip validation of environment variables if set to "1" |
| NEXT_PUBLIC_WEB_VERSION | string |         | Version shown in the website footer                    |

### Administrators

Administrators are managed through Gamma
[Client Authorities](https://gamma-docs.olillin.com/api/client-api/#client-authorities).
Anyone who has an authority starting with `admin` will be considered an
administrator. See the guide on
[**Creating client authortities**](https://gamma-docs.olillin.com/website/#creating-client-authorities)
in the Gamma documentation.
