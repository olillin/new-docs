# New Docs

New document site for the Software Engineering Student Division (IT) with the
goal of replacing [cthit/dokument-site](https://github.com/cthit/dokument-site).

## Planned features

- Include other documents than the ones from
  [cthit/dokument](https://github.com/cthit/dokument)
- Divide documents into categories:
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
- Remove template documents
- Searchable documents
    - Search content in the PDFs.
    - Select which category of document you want to search in.
- File history?
- Prettier document titles with diacritics.

## Development

Install dependencies with the command below. This also copies `.env.example` and
generates the Prisma client.

```console
pnpm install
```

Then you should
[create a Gamma user client](https://gamma-docs.olillin.com/website#creating-a-user-client)
with an API key and without the email scope. Set the redirect URI to
`http://localhost:3000/callback`.

> [!TIP] You may also want to add yourself as an administrator. See
> [Administrators](#Administrators) for how administrators are managed.

After this you can run these commands to start the database and development
server.

```console
docker compose up --wait
pnpm prisma migrate dev
pnpm run dev
```

## Production build

Run the `compose.prod.yaml` file using
[Docker Compose](https://docs.docker.com/compose).

## Configuration

### Administrators

Administrators are managed through Gamma
[Client Authorities](https://gamma-docs.olillin.com/api/client-api/#client-authorities).
Anyone who has an authority starting with `admin` will be considered an
administrator. See the guide on
[**Creating client authortities**](https://gamma-docs.olillin.com/website/#creating-client-authorities)
in the Gamma documentation.
